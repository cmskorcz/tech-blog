const router = require('express').Router();

const { User, Post, Comment } = require('../../models');

router.get('/', async (req, res) => {
    try {
        const foundUsers = await User.findAll({
            attributes: {
                exclude: ['password']
            }
        });
    
        res.json(foundUsers);    
    } catch (err) {
        res.status(500).json(err)
    }
});

router.post('/', async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        
        req.session.save(() => {
            req.session.user_id = newUser.id;
            req.session.username = newUser.username;
            req.session.isLoggedIn = true;
        });

        res.json(newUser)

    } catch (err) {
        res.status(500).json(err)

    }
});

router.post('/login', async (req, res) => {
    try {
        const foundUser = await User.findOne({
            where: {
                email: req.body.email
            }
        })

        if (!foundUser) {
            res.status(400).json({ message: 'Incorrect email/password' })
            return
        }

        const validPassword = await foundUser.checkPassword(req.body.password)

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect email/password' });
            return;
        }

        req.session.save(() => {
            req.session.user_id = foundUser.id;
            req.session.username = foundUser.username;
            req.session.isLoggedIn = true;

            res.json(foundUser)
        })
    } catch (err) {
        res.status(500).json(err)
    }
});

router.post('/logout', async (req, res) => {
    if (req.session.isLoggedIn) {
        req.session.destroy(() => {
            res.status(204).end()
        })
    } else {
        res.status(404).end();
    }
});

router.get('/:id', async (req, res) => {
    try {
        const foundUser = await User.findOne({
            where: {
                id: req.params.id
            },
            attributes: {
                exclude: ['password']
            },
            include: [
                {
                    model: Post,
                    attributes: [
                        'id',
                        'title',
                        'post_content',
                        'created_at'
                    ]
                },
                {
                    model: Comment,
                    attributes: [
                        'id',
                        'comment_content',
                        'created_at'
                    ]
                }
            ]
        })
    
        if (!foundUser) {
            res.status(404).json({ message: 'Unable to find user by that id' })
            return;
        }
    
        res.json(foundUser);    

    } catch (err) {
        res.status(500).json(err)
    
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.update(req.body, {
            individualHooks: true,
            where: {
                id: req.params.id
            }
        });
    
        if (!updatedUser) {
            res.status(404).json({ message: 'Unable to find user by that id' })
            return
        }
    
        res.json(updatedUser);
        
    } catch (err) {
        res.status(500).json(err)
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.destroy({
            where: {
                id: req.params.id
            }
        });

        if (!deletedUser) {
            res.status(404).json({ message: 'Unable to find user by that id' })
            return;
        }

        res.json(deletedUser);

    } catch (err) {
        res.status(500).json(err)
        
    }
})

module.exports = router;