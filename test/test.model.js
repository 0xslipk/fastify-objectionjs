const { Model } = require('objection')

class TestModel extends Model {
  static get tableName () {
    return 'test'
  }

  static get jsonSchema () {
    return {
      required: ['email'],
      properties: {
        id: { type: 'string' },
        email: { type: 'string', minLength: 1, maxLength: 255 },
        created_at: { type: 'string' },
        updated_at: { type: 'string' }
      }
    }
  }
}

module.exports = TestModel
