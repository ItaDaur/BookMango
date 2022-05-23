const express = require('express')
const app = new express()
const path = require("path")
const ejs = require('ejs')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const BlogPost = require('./models/BlogPost')

mongoose.connect('mongodb+srv://Daur:qwerty123@cluster0.jhqur.mongodb.net/?retryWrites=true&w=majority',{useNewUrlParser: true})

// app.use(bodyParser.json)
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine','ejs')
app.use(express.static('public'))

app.get("/", async (req,res) => {
    const blogposts = await BlogPost.find({})
    res.render('index', {
        blogposts
    })
})

app.get('/about',(req,res)=>{
    res.render('about')
})

app.get('/contact',(req,res)=>{
    res.render('contact')
})

app.get('/post/:id',async (req,res)=>{
    const blogpost = await BlogPost.findById(req.params.id)
    res.render('post', {
        blogpost
    })
})

app.get('/posts/new',(req,res)=>{
    res.render('create')
})

app.post("/posts/store", async (req,res) => {
    await BlogPost.create(req.body, (error, blogpost) => {
        res.redirect('/')
    })
})

app.listen(4000,()=>{
    console.log('App listening on port 4000')
})