const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

User.hasMany(Post, {
    onDelete: 'cascade'
});

User.hasMany(Comment, {
    onDelete: 'cascade'
});

Post.hasOne(User, {
    foreignKey: 'user_id'
});

Post.hasMany(Comment, {
    onDelete: 'cascade'
});

Comment.hasOne(User, {
    foreignKey: 'user_id'
});

Comment.hasOne(Post, {
    foreignKey: 'post_id'
});

module.exports = { User, Post, Comment };