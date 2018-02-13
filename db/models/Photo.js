const bookshelf = require('./bookshelf');

//CLASS PHOTO RETRIEVES DATA FROM THE TABLE 'PHOTOS'
class Photo extends bookshelf.Model{
  get tableName(){return 'photos'}
  get hasTimestamp(){return true}
}

module.exports = Photo;