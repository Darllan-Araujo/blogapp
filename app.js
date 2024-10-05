//CARREGANDO MÓDULOS PARA A APLICAÇÃO
    const express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const mongoose = require('mongoose');
    const app = express();
    const admin = require('./routes/admin');
    const path = require('path');
    const session = require('express-session');
    const flash = require('connect-flash');
    require("./models/Postagem")
    const Postagem = mongoose.model("postagens")
    const usuarios = require('./routes/usuario')
    const passport = require('passport')
    require('./config/auth')(passport)

//CONFIGURAÇÕES
    //Sessão
        app.use(session({
            secret: 'cursodenode',
            resave: true,
            saveUninitialized: true
        }))

        app.use(passport.initialize())
        app.use(passport.session())

        app.use(flash())

    //Middleware
    app.use((req, res, next)=>{
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg = req.flash('error_msg')
        res.locals.error = req.flash('error')
        res.locals.user = req.user || null;
        next()

    })
    //Body Parser
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    //Handlebars
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')

    //Mongoose - Fazer a conexçao com o DB
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/blogapp').then(function(){
        console.log('Server conectado')
    }).catch(function(err){
        console.log('Erro '+err)
    });

    //Usar a pasta Public
    app.use(express.static(path.join(__dirname, 'public')));
//Rotas
app.get('/', (req, res) => {
    Postagem.find().lean().populate("categoria").sort({data: "desc"}).then((postagens) => {
        res.render("index", {postagens: postagens})
    }).catch((err) => {
        req.flash('error_msg','Houve um carregar postagens')
        console.log("Erro ao carregar postagens: ",err)
        res.redirect('/404')
    })
})


app.get("/404", (req, res) => {
    res.send("Erro 404!")
})

    app.get('/posts', (req, res)=>{
        res.send('Lista de Posts')
    })

app.get('/postagem/:slug', (req, res)=>{
    Postagem.findOne({slug: req.params.slug}).lean().then((postagem)=>{
        if(postagem){
            res.render('postagem/index', {postagem:postagem})
        }else{
            req.flash('error_msg', "Essa postagem não existe")
            res.redirect('/')
        }
    }).catch((err) => {
        req.flash('error_msg','Houve um erro interno')
        res.redirect('/')
    })
})


//ROTAS IMPORTADAS
    app.use('/admin', admin);
    
    app.get('/',( req, res) => {
        res.send('Tela inicial')
    });

    app.use('/usuarios', usuarios)

//OUTROS
    const PORT = 8081
    app.listen(PORT, function(){
        console.log('Server On')
    });