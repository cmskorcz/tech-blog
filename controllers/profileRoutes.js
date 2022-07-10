const router = require('express').Router();
const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth')

router.get('/', withAuth, async(req, res) => {
    try {
        const isLoggedIn = req.session.isLoggedIn
        const response = await Post.findAll({
            where: {
                user_id: req.session.user_id
            },
            attributes: [
                'id',
                'post_content',
                'title',
                'created_at'
            ],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment_content', 'post_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        });

        const posts = response.map(post => post.get({ plain: true }));
        res.render('profile', { posts, isLoggedIn })
    } catch (error) {
        res.status(500).json(error)
    }
});

router.get('/edit/:id', withAuth, async (req, res) => {
    try {
        const isLoggedIn = req.session.isLoggedIn
        const response = await Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
                'id',
                'post_content',
                'title',
                'created_at'
            ],
            include: [ 
                {
                    model: Comment,
                    attributes: ['id', 'comment_content', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        });

        const post = response.get({ plain: true });
        res.render('edit-post', { post, isLoggedIn })
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;