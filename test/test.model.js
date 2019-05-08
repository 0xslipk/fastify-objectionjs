const { Model } = require('objection')

class TestModel extends Model {
  static get tableName () {
    return 'test'
  }
}

module.exports = TestModel
