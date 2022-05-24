const express = require('express')
const app = new express()
const ejs = require('ejs')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const expressSession = require('express-session')
const flash = require('connect-flash')

//Controllers
const newPostController = require('./controllers/newPost')
const homeController = require('./controllers/home')
const storePostController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')
const newUserController = require('./controllers/newUser')
const storeUserController = require('./controllers/storeUser')
const loginController = require('./controllers/login')
const loginUserController = require('./controllers/loginUser')
const logoutController = require('./controllers/logout')

//connect
const dbConfig = require('./config/database.config.js');
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Database Connected Successfully!!");
}).catch(err => {
    console.log('Could not connect to the database', err);
    process.exit();
});

//middleWare
const validateMiddleware = require('./middleware/validationMiddleware')
const authMiddleware = require('./middleware/authMiddleware')
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware')

app.use(bodyParser.json())
app.use(fileUpload())
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine','ejs')
app.use(express.static('public'))
app.use(expressSession({
    secret: 'keyboard cat'
}))
app.use(flash())

//already logged in
global.loggedIn = null
app.use('*', (req,res,next) => {
    loggedIn = req.session.userId
    next()
})

app.use('/posts/store',validateMiddleware)

//routes
app.get('/', homeController)
app.get('/post/:id', getPostController)
app.get('/posts/new',authMiddleware,newPostController)
app.post('/posts/store',authMiddleware, storePostController)
app.get('/auth/register',redirectIfAuthenticatedMiddleware, newUserController)
app.post('/users/register',redirectIfAuthenticatedMiddleware, storeUserController)
app.get('/auth/login',redirectIfAuthenticatedMiddleware, loginController)
app.post('/users/login',redirectIfAuthenticatedMiddleware, loginUserController)
app.get('/auth/logout', logoutController)

//not found
app.use((req,res) => {
    res.render('notfound')
})

//run server
app.listen(4000,()=>{
    console.log('App listening on port 4000')
})