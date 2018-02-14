const bookshelf = require(`./bookshelf`);
const Photo = require(`./Photo`)

class User extends bookshelf.Model {
  get tableName() { return `users` }
  get hasTimestamps() { return true }


  photos() {
    return this.hasMany(Photo, `user_id`);
  }

}
module.exports = User;
