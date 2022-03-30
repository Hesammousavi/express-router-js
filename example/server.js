const express = require('express')
const app = express()
const port = 3000
const Router = require('express-router-js')()

const AuthMiddleware = (req , res , next) => {
    // check user is login
    console.log('auth')
    next();
}

const AdminMiddleware = (req , res , next) => {
    // check user is admin
    console.log('admin')
    next();
}

Router.group((Router) => {

    // localhost:3000/articles
    Router.get('/' , (req, res) => {
        return res.json({ articles : []})
    });

    // localhost:3000/articles/:articleId
    Router.get('/:articleId' , (req, res ) => {})

   // localhost:3000/articles/:articleId
    Router.patch('/:articleId' , (req, res ) => {})

    // localhost:3000/articles/:articleId/delete
    Router.delete('/:articleId' , (req, res ) => {})

}).prefix('articles').middleware([AuthMiddleware , AdminMiddleware]);

Router.serve(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
