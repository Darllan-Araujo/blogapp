//import express from 'express'
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
//import mongoose from "mongoose"
require('../models/Usuario')
//import Usuarios from '../models/Usuario.js'
const Usuario = mongoose.model("usuarios")
const bcrypt = require('bcryptjs')

router.get('/registro', (req, res)=>{
    res.render('usuarios/registro')
})

router.post('/registro', (req, res)=>{
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: 'Nome Inválido'})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: 'Email Inválido'})
    }

    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: 'Senha Inválida'})
    }

    if(req.body.length < 4){
        erros.push({texto: 'Senha muito curta'})
    }

    if(req.body.senha != req.body.senha2){
        erros.push({texto: 'As senhas não combinam'})
    }    

    if(erros.length > 0){

        res.render('usuarios/registro', {erros: erros})

    }else{
        
        Usuario.findOne({email: req.body.email}).then((usuario)=>{
            if(usuario){
                req.flash('error_msg', 'email ja cadastrado')
                res.redirect('/usuarios/registro')
            }else{

                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })

                bcrypt.genSalt(10, (erro, salt)=>{
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash)=>{
                        if(erro){
                            req.flash('error_msg', 'Houve um erro no salvamento')
                            res.redirect('/')
                        }

                        novoUsuario.senha = hash

                        novoUsuario.save().then(()=>{
                            req.flash('success_msg', 'Usuario criado')
                            res.redirect('/')
                        }).catch((err)=>{
                            req.flash('error_smg', 'erro ao criar usuario')
                            res.redirect('/usuarios/registro')
                        })
                    })
                })

            }
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro')
            res.redirect('/')
        })

    }
})

router.get('/login', (req, res)=>{
    res.render('usuarios/login')
})

module.exports = router