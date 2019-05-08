# fastify-objectionjs

[![Greenkeeper badge](https://badges.greenkeeper.io/jarcodallo/fastify-objectionjs.svg)](https://greenkeeper.io/) [![Build Status](https://travis-ci.org/jarcodallo/fastify-objectionjs.svg?branch=master)](https://travis-ci.org/jarcodallo/fastify-objectionjs)

*fastify-objectionjs* is a plugin for the [Fastify](http://fastify.io/) framework that provides integration with [objectionjs ORM](https://vincit.github.io/objection.js/).

Supports Fastify versions ^2.0.0.

If you don't provide the `knexConfig.client` by yourself (see below), the plugin use the default configuration:

```js
const defaultKnexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './default.sqlite'
  }
}
```

## Install

```
npm i fastify-objectionjs --save
```

## Usage
<<<<<<< HEAD
<<<<<<< HEAD
Define the objectionjs model
=======
Define the objectionjs models
>>>>>>> f0d42ae... Update README.md
=======
Define the objectionjs model
>>>>>>> 424cc4e... typo

```js
// user.model.js
'use strict'

const { Model } = require('objection')
const schema = require('./schema')

class User extends Model {
  static get tableName () {
    return 'users'
  }

  static get jsonSchema () {
    return Base.generateJsonSchema({
      type: 'object',
      required: ['username', 'password'],
      properties: {
        id: { type: 'integer' },
        username: { type: 'string', minLength: 1, maxLength: 255 },
        password: { type: 'string', minLength: 1, maxLength: 255 },
        salt: { type: 'string', minLength: 1, maxLength: 255 },
        created_at: { type: 'string' },
        updated_at: { type: 'string' }
      }
    })
  }
}

module.exports = User
```

<<<<<<< HEAD
<<<<<<< HEAD
Add the knex config and objectionjs model to the project with `register`
=======
Add it to your project with `register` and you are done!
>>>>>>> f0d42ae... Update README.md
=======
Add the knex config and objectionjs model to the project with `register`
>>>>>>> 424cc4e... typo

```js
const fastify = require('fastify')()
const User = require('./user.model.js')

fastify.register(require('fastify-objectionjs'), {
  knexConfig: {
    client: 'sqlite3',
    connection: {
      filename: './default.sqlite'
    }
  },
  models: [User]
})

const schemas = {
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        token: { type: 'string' }
      }
    },
    401: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    }
  },
  body: {
    type: 'object',
    properties: {
      username: { type: 'string', minLength: 1, maxLength: 255 },
      password: { type: 'string', minLength: 1, maxLength: 255 }
    },
    required: ['username', 'password']
  }
}

fastify.post('/login', { schema }, async function (request, reply) {
  const { username, password } = request.body

  const user = await fastify.objection.models.user
    .query()
    .findOne({ username })

  if (user && fastify.password.validate(user.password, user.salt, password)) {
    const token = fastify.jwt.sign(
      { sub: user.username },
      { expiresIn: '6h' }
    )

    reply.send({ id: user.id, token })
  } else {
    reply.status(401).send({ message: 'Invalid username or password' })
  }
})

fastify.listen(3000, err => {
  if (err) throw err
})
```

## API

### Options

*fastify-objectionjs* accepts the options object:

```js
{
  knexConfig: {
    client: 'sqlite3',
    connection: {
      filename: './default.sqlite'
    }
  },
  models: [User]
}
```

+ `knexConfig` (Default: `sqlite3 connection`): can be set any knex valid configuration.
+ `models` (Default: `undefined`): a collection of objectionjs models.

## License

<<<<<<< HEAD
[MIT License](http://jsumners.mit-license.org/)
=======
[MIT License](http://jsumners.mit-license.org/)
>>>>>>> f0d42ae... Update README.md
