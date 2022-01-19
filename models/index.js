const User = require('./User');
const Blog = require('./Blog');
const Comments = require('./Comments');

User.hasMany(Blog, {
  foreignKey: 'user_id',
});

Blog.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: "CASCADE"
});

Comments.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Comments.belongsTo(Blog, {
  foreignKey: 'blog_id'
});

User.hasMany(Comments, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Blog.hasMany(Comments, {
  foreignKey: 'post_id',
  onDelete: 'CASCADE'
});

module.exports = { User, Blog, Comments };
