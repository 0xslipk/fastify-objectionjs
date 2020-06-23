'use strict'

const t = require('tap')
const { test } = t
const Fastify = require('fastify')
const fastifyObjectionjs = require('../plugin')
const TestModel = require('./test.model')

test('unsupported client', t => {
  register(t, { knexConfig: { client: 'no_supported' } }, function (err, fastify) {
    t.throws(function () { throw err })
    t.notOk(fastify.objection)
    t.end()
  })
})

test('models option is not Array', t => {
  register(t, { models: {} }, function (err, fastify) {
    t.throws(function () { throw err })
    t.notOk(fastify.objection)
    t.end()
  })
})

test('empty models option', t => {
  register(t, { models: [] }, function (err, fastify) {
    t.throws(function () { throw err })
    t.notOk(fastify.objection)
    t.end()
  })
})

test('supplied models option are invalid ', t => {
  class GenricClass { }

  register(t, { models: [GenricClass] }, function (err, fastify) {
    t.throws(function () { throw err })
    t.notOk(fastify.objection)
    t.end()
  })
})

test('load a valid model', t => {
  register(t, { knexConfig: { client: 'sqlite3' }, models: [TestModel] }, function (err, fastify) {
    t.error(err)
    t.ok(fastify.objection)
    t.ok(fastify.objection.knex)
    t.ok(fastify.objection.models)
    t.ok(fastify.objection.models.testModel)
    t.end()
  })
})

test('only load a valid models', t => {
  class GenricClass { }

  register(t, { knexConfig: { client: 'sqlite3' }, models: [TestModel, GenricClass] }, function (err, fastify) {
    t.error(err)
    t.ok(fastify.objection)
    t.ok(fastify.objection.knex)
    t.ok(fastify.objection.models)
    t.ok(fastify.objection.models.testModel)
    t.notOk(fastify.objection.models.genricClass)
    t.end()
  })
})

test('double register of the same plugin', t => {
  const fastify = Fastify()
  t.teardown(() => fastify.close())

  fastify
    .register(fastifyObjectionjs, { knexConfig: { client: 'sqlite3' }, models: [TestModel] })
    .register(fastifyObjectionjs, { knexConfig: { client: 'sqlite3' }, models: [TestModel] })
    .ready(err => {
      t.ok(err)
      t.equal(err.message, 'fastify-objectionjs has already registered.')
      t.end()
    })
})

test('should destroy knex instance on onClose hook', t => {
  const fastify = Fastify()

  fastify
    .register(fastifyObjectionjs, { knexConfig: { client: 'sqlite3' }, models: [TestModel] })
    .ready(err => {
      t.error(err)
      fastify.close().then(() => {
        t.ok(fastify.objection.knex.client.pool.destroyed)
        t.end()
      })
    })
})

test('should only do the setup of knex without models', t => {
  register(t, { knexConfig: { client: 'sqlite3' } }, function (err, fastify) {
    t.error(err)
    t.ok(fastify.objection)
    t.ok(fastify.objection.knex)
    t.notOk(fastify.objection.models)
    t.end()
  })
})

function register (t, options, callback) {
  const fastify = Fastify()
  t.teardown(() => fastify.close())

  fastify.register(fastifyObjectionjs, options)
    .ready(err => callback(err, fastify))
}
