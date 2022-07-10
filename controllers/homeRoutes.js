const router = require('express').Router()
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

router.get('/', async (req, res) => {
    try {
        const postsArr = await Post.findAll({
            attributes: [
                'id',
                'title',
                'post_content',
                'created_at'
            ],
            include: [
                {
                    model: Comment,
                    attributes: [
                        'id',
                        'comment_content',
                        'post_id',
                        'user_id',
                        'created_at'
                    ],
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
        const posts = postsArr.map(post => post.get({ plain: true }));
        const isLoggedIn = req.session.isLoggedIn;
        res.render('homepage', { posts, isLoggedIn });        
    } catch (err) {
        res.status(500).json(err)
    }
});

router.get('/login', async (req, res) => {
    if (req.session.isLoggedIn) {
        res.redirect('/')
        return;
    }
    res.render('login')
});

router.get('/post/:id', async (req, res) => {
    try {
        const foundPost = await Post.findOne({
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
                    attributes: [
                        'id',
                        'comment_content',
                        'post_id',
                        'user_id',
                        'created_at'
                    ],
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
    
        if (!foundPost) {
            res.status(404).json({ message: 'Unable to find post' });
            return;
        }
        const post = foundPost.get({ plain: true });
        const isLoggedIn = req.session.isLoggedIn;
    
        res.render('single-post', { post, isLoggedIn });    
    } catch (error) {
        res.status(500).json(error);   
    }
})

module.exports = router;