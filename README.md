# express-router
express advanced routing system

> it`s next level express routing system

## Installation

first of all you must install the package

run this command first : 
```
npm i express-router-js
```

## How To Use

after you install the package you can require express routing system like this :
```js

const express = require('express')
const app = express()
const port = 3000
const Router = require('express-router-js')();

Router.get('/' , (req , res , next) => {
    res.send('Hello World!');
});

Router.serve(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

## Define Route Group

You Have Route Group in Express from now

```js

const express = require('express')
const app = express()
const port = 3000
const Router = require('express-router-js')()

const AuthMiddleware = (req , res , next) => {
    // check user is login
}

const AdminMiddleware = = (req , res , next) => {
    // check user is admin
}

Router.group((Router) => {

    // localhost:3000/articles
    Router.get('/' , (req, res) => {}) 

    // localhost:3000/articles/:articleId
    Router.get('/:articleId' , (req, res ) => {})

   // localhost:3000/articles/:articleId
    Router.patch('/:articleId' , (req, res ) => {})

       // localhost:3000/articles/:articleId/delete
    Router.delete('/:articleId' , (req, res ) => {})

}).prefix('articles').middleware(AuthMiddleware , AdminMiddleware);


Router.serve(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```


## Route Group in N-Level

you can define diffrent route groups inside toghter

```js
Router.group((Router) => {
    
    Router.group((Router) => {
        Router.get('/' , (req , res , next) => {})
    }).prefix('videos');

    Router.group((Router) => {
        Router.get('/' , (req , res , next) => {})
    }).prefix('articles');

}).prefix('web').middleware((req , res , next) => {} , ...);
```

