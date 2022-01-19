const router = require('express').Router();
const { Blog, User, Comments } = require('../models');
const withAuth = require('../utils/auth');
const sequelize = require('../config/connection');

router.get('/', withAuth, async (req, res) => {

  try {
    const blogData = await Blog.findAll({
      where: {
        user_id: req.session.user_id
      },
      attributes: [
        'id',
        'title',
        'content',
        'created_at'
      ],
      include: [{
        model: Comments,
        attributes: ['id', 'comments_text', 'blog_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username'],
      },
      ],
    });

    const blogs = blogData.map((blog) => blog.get({ plain: true }));

    res.render('dashboard', {
      blogs,
      username: req.session.username,
      logged_in: req.session.logged_in
    });

  } catch (err) {
    res.status(500).json(err);
  }

});

router.get('/edit/:id', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'title',
        'content',
        'created_at'
      ],
      include: [{
        model: User,
        attributes: ['username']
      },
      {
        model: Comments,
        attributes: ['id', 'comments_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      }
      ]
    })

    const blog = blogData.get({ plain: true });

    res.render('editBlog', {
      blog,
      logged_in: req.session.logged_in
    });

  } catch (err) {
    res.status(500).json(err);
  }

});

router.get('/new', (req, res) => {
  res.render('newBlog');
});

module.exports = router;