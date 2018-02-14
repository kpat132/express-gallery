const bookshelf = require('./bookshelf');
const User = require(`./User`);

//CLASS PHOTO RETRIEVES DATA FROM THE TABLE 'PHOTOS'
class Photo extends bookshelf.Model {
  get tableName() { return 'photos' }
  get hasTimestamp() { return true }


  user() {
    this.belongsTo(User);

  }

}

module.exports = Photo;