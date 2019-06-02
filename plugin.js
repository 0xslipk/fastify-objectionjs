'use strict'

const fp = require('fastify-plugin')
const Knex = require('knex')
const { Model } = require('objection')

const defaultKnexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './default.sqlite'
  }
}

const supportedClients = ['pg', 'sqlite3', 'mysql', 'mysql2', 'oracle', 'mssql']

function fastifyObjectionjs (fastify, options, next) {
  const knexConfig = Object.assign({}, defaultKnexConfig, options.knexConfig)

  if (supportedClients.indexOf(knexConfig.client) === -1) {
    next(new Error(`unsupported client, 'fastify-objectionjs' only support ${supportedClients.join(', ')}.`))
    return
  }

  const knexConnection = Knex(knexConfig)

  const objection = {
    knex: knexConnection
  }

  Model.knex(knexConnection)

  if (!options.models || !Array.isArray(options.models) || options.models.length < 1) {
    next(new Error('You need to provide a valid array of `objection.js` models.'))
    return
  }

  objection.models = {}

  for (let i = 0; i < options.models.length; i += 1) {
    const model = options.models[i]

    if (model.idColumn && model.tableName && model.jsonSchema && model.query) {
      objection.models[model.name.replace(/^\w/, c => c.toLowerCase())] = model
    }
  }

  if (Object.keys(objection.models).length < 1) {
    next(new Error('The supplied models are invalid.'))
    return
  }

  if (!fastify.objection) {
    fastify.decorate('objection', objection)
  } else {
    next(new Error('fastify-objectionjs has already registered.'))
    return
  }

  next()
}

module.exports = fp(fastifyObjectionjs, {
  fastify: '>=2.0.0',
  name: 'fastify-objectionjs'
})
