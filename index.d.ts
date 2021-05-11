import { FastifyPluginCallback, FastifyPluginAsync } from 'fastify'
import { Knex } from 'knex'
import { Model } from 'objection'

declare namespace fastifyObjectionjs {
  interface FastifyObjectionObject {
    /**
     * Knew configuration
     */
    knex: Knex.Config
    /**
     * Objectionjs models
     */
    models: Model[]
  }
  
  interface FastifyObjectionNestedObject {
    [name: string]: FastifyObjectionObject
  }
  
  interface FastifyObjectionOptions {
    /**
     * Knew configuration
     */
    knexConfig?: Knex.Config
    /**
     * Objectionjs models
     */
    models?: Model[]
    /**
     * Set to true if your columns are UPPER_SNAKE_CASED. Default: false
     */
    upperCase?: boolean
    /**
     * Set true will place an underscore before digits (foo1Bar2 becomes foo_1_bar_2). 
     * When false, foo1Bar2 becomes foo1_bar2. Default false
     */
    underscoreBeforeDigits?: boolean
    /**
     * Set to true will place underscores between consecutive uppercase letters (fooBAR becomes foo_b_a_r).
     * When false, fooBAR will become foo_bar. Default: false
     */
    underscoreBetweenUppercaseLetters?: boolean 
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    objection: fastifyObjectionjs.FastifyObjectionObject & fastifyObjectionjs.FastifyObjectionNestedObject
  }
}

declare const fastifyObjectionjs: FastifyPluginCallback<fastifyObjectionjs.FastifyObjectionOptions> | FastifyPluginAsync<fastifyObjectionjs.FastifyObjectionOptions>

export default fastifyObjectionjs
