const BlogPost = require("../models/BlogPost");
const path = require('path')

exports.home = async (req,res) => {
    const blogposts = await BlogPost.find({})
    res.render('index', {
        blogposts
    })
}

exports.getPost = async (req,res) => {
    const blogpost = await BlogPost.findById(req.params.id)
    res.render('post', {
        blogpost
    })
}

exports.newPost = (req,res) => {
    if (req.session.userId) {
        return res.render('create')
    }
    res.redirect('/auth/login')
}

exports.storePost = (req,res) => {
    let image = req.files.image;
    image.mv(path.resolve(__dirname, '..','public/img', image.name), async (error) => {
        await BlogPost.create({
            ...req.body,
            image:'/img/' + image.name
        })
        res.redirect('/')
    })
}