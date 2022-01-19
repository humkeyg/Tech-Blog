const router = require('express').Router();
const { Blog, User, Comments } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', (req, res) => {
  Blog.findAll({
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
                  attributes: ['username']
              }
          ]
      })

      .then(dbBlogData => {
          const blogs = dbBlogData.map(blog => blog.get({ plain: true }));
          res.render('homepage', { blogs, logged_in: req.session.logged_in });
      })

      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.get('/blog/:id', (req, res) => {
  Blog.findOne({
          where: {
              id: req.params.id
          },
          attributes: [
              'id',
              'content',
              'title',
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
                  attributes: ['username']
              }
          ]
      })
      .then(dbBlogData => {
          if (!dbBlogData) {
              res.status(404).json({ message: 'No blog found with this id' });
              return;
          }
          const blog = dbBlogData.get({ plain: true });
          console.log(blog);
          res.render('singleBlog', { ...blog, logged_in: req.session.logged_in });


      })
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

router.get('/blogs-comments', (req, res) => {
  Blog.findOne({
          where: {
              id: req.params.id
          },
          attributes: [
              'id',
              'content',
              'title',
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
                  attributes: ['username']
              }
          ]
      })
      .then(dbBlogData => {
          if (!dbBlogData) {
              res.status(404).json({ message: 'No blog found with this id' });
              return;
          }
          const blog = dbBlogData.get({ plain: true });

          res.render('blogs-comments', { blog, logged_in: req.session.logged_in });
      })
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

module.exports = router;
