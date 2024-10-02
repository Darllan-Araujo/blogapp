//GRUPO DE ROTAS ADMIN

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')
require('../models/Postagem')
const Postagem = mongoose.model('postagens')

router.get('/', function(req,res){
    res.render('admin/index');
});

router.get('/posts', function(req, res){
    res.send('Página de posts')
});

router.get('/categorias', (req, res) => {
    Categoria.find().lean().sort({date: 'desc'}).then((categorias) => {
        res.render('admin/categorias', {categorias: categorias})
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao listar categorias')
        res.redirect('/admin')
    })
});

router.post('/categorias/nova', function(req, res){
    
    var erros = []

    //O '!' antes do obj é pra dizer se está vazio, os '||' é como se fosse o 'or' do if
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: 'Nome inválido'})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: 'Slug inválido'})
    }

    if(erros.length > 0){
        res.render('admin/addcategorias', {erros: erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(function(){
            req.flash('success_msg', 'Categoria criada com sucesso')
            res.redirect('/admin/categorias')
        }).catch(function(err){
            req.flash('error_msg', 'Erro ao salvar, tente novamente')
            res.redirect('/admin')
        })  
    }

});

router.get('/categorias/edit/:id', (req, res)=>{
    Categoria.findOne({_id:req.params.id}).lean().then((categoria)=>{
        res.render('admin/editcategorias', {categoria: categoria}) 
    }).catch((err)=>{
        req.flash('error_msg', 'Essa categoria não existe')
        res.redirect('/admin/categorias')
    })
})

router.get('/categorias/add', function(req, res){
    res.render('admin/addcategorias')
});

router.post('/categorias/edit', (req, res)=>{
    Categoria.findOne({_id: req.body.id}).then((categoria)=>{

        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(()=>{
            req.flash('success_msg', 'Categoria Editada com sucesso')
            res.redirect('/admin/categorias')
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro interno ao editar a categoria')
            res.redirect('/admin/categorias')
        })

    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao editar a categoria')
        res.redirect('/admin/categorias')
    })
}
)

router.post('/categorias/deletar', ((req, res)=>{
    Categoria.deleteOne({_id: req.body.id}).then(()=>{
        req.flash('success_msg', 'Categoria removida')
        res.redirect('/admin/categorias')
    }).catch((err)=>{
        req.flash('error_msg', "Falha ao deletar categoria")
        res.redirect('/admin/categorias')
    })
}))

router.get('/postagens', (req, res)=>{

    Postagem.find().lean().populate('categoria').sort({data:'desc'}).then((postagens)=>{
        res.render('admin/postagens', {postagens: postagens})
    }).catch((err)=>{
        req.flash('Erro au listar as postagens')
        res.redirect('/admin')
    })
})

router.get ('/postagens/add', (req, res)=>{
    Categoria.find().lean().then((categorias)=>{
        res.render('admin/addpostagem', {categorias: categorias})
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro')
        res.redirect('/admin')
    })
})

router.post('/postagens/nova', (req, res)=>{
     
    var erros = []

    if(req.body.categoria == '0'){
        erros.push({texto: 'Categoria inválida, registre uma categoria'})
    }

    if(erros.length>0){
        res.render('admin/addpostagem', {erros: erros})
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }

        new Postagem(novaPostagem).save().then(()=>{
            req.flash('success_msg', 'Postagem criada')
            res.redirect('/admin/postagens')
        }).catch((err)=>{
            req.flash('error_msg', 'Erro ao criar postagem')
            res.redirect('/admin/postagens')
        })
    }
})

router.get('/postagens/edit/:id', (req, res)=>{

    Postagem.findOne({_id: req.params.id}).lean().then((postagem)=>{

        Categoria.find().lean().then((categorias)=>{
            res.render('admin/editpostagens', {categorias: categorias, postagem: postagem})
        }).catch((err)=>{
            req.flash('error_msg', "Houve um erro ao listar as categorias")
            res.redirect('/admin/postagens')
        })

    }).catch((err)=>{
        req.flash('error_msg', "Houve um erro ao carregar o formulário de edição")
        res.redirect('/admin/postagens')
    })
})

router.post('/postagens/edit', (req, res) => {

    Postagem.findByIdAndUpdate({_id:req.body.id}).sort({data: 'desc'}).then((postagem) => {

        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria
        

        postagem.save().then(() => {

            req.flash('success_msg', 'Postagem atualizada com sucesso')
            res.redirect('/admin/postagens')
        }).catch((err) => {
            req.flash('error_msg', 'Erro na atualização da postagem')
            res.redirect('/admin/postagens')
        })
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro na edição da postagem ' )
        res.redirect('/admin/postagens')
    })

})

router.get('/postagens/deletar/:id', (req, res)=>{
    Postagem.deleteOne({_id: req.params.id}).then(()=>{
        req.flash('success_msg', 'Postagem deletada')
        res.redirect('/admin/postagens')
    }).catch(()=>{
        req.flash('error_msg', 'Houve um erro interno')
        res.redirect('admin/postagens')
    })
})

module.exports = router
