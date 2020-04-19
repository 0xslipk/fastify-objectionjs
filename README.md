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
Define the objectionjs model

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

Add the knex config and objectionjs models to the project with `register`

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

You can also use the plugin only to do the setup and call the model files directly.

```js
const fastify = require('fastify')()
const User = require('./user.model.js')

fastify.register(require('fastify-objectionjs'), {
  knexConfig: {
    client: 'sqlite3',
    connection: {
      filename: './default.sqlite'
    }
  }
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

  const user = await User.query().findOne({ username })

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
  models: [User],
  upperCase: false,
  underscoreBeforeDigits: false,
  underscoreBetweenUppercaseLetters: false
}
```

+ `knexConfig` (Default: `sqlite3 connection`): can be set any knex valid configuration.
+ `models` (Default: `undefined`): a collection of objectionjs models.
+ `upperCase` (Default: `false`): Set to `true` if your columns are UPPER_SNAKE_CASED.
+ `underscoreBeforeDigits` (Default: `false`): When `true`, will place an underscore before digits (`foo1Bar2` becomes `foo_1_bar_2`). When `false`, `foo1Bar2` becomes `foo1_bar2`.
+ `underscoreBetweenUppercaseLetters` (Default: `false`): When `true`, will place underscores between consecutive uppercase letters (`fooBAR` becomes `foo_b_a_r`). When `false`, `fooBAR` will become `foo_bar`.

## License

[MIT License](http://jsumners.mit-license.org/)
