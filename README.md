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
const { Router : Route } = require('express-router-js')

Router.get('/' , (req , res , next) => {
    res.send('Hello World!');
});

Router.serve();

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
const { Router : Route } = require('express-router-js')

const AuthMiddleware = (req , res , next) => {
    // check user is login
}

const AdminMiddleware = = (req , res , next) => {
    // check user is admin
}

Route.group(() => {
    // localhost:3000/articles
    Route.get('/' , (req, res) => {}) 

    // localhost:3000/articles
    Route.post('/' , (req , res) => {} )

    // localhost:3000/articles/:articleId
    Route.get('/:articleId' , (req, res ) => {})

    // localhost:3000/articles/:articleId/edit
    Route.get('/:articleId/edit' , (req, res ) => {}).middleware((req , res , next) => {} , ...)

   // localhost:3000/articles/:articleId
    Route.patch('/:articleId' , (req, res ) => {})

}).prefix('articles').middleware(AuthMiddleware , AdminMiddleware);



Router.serve();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})