const router = require("express").Router();
const { Blog, User, Comments } = require("../../models");
const withAuth = require("../../utils/auth");

router.post("/", withAuth, async (req, res) => {

  try {
    const newBlog = await Blog.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newBlog);

  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/:id", async (req, res) => {

  try {
    const blogDB = await Blog.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "content", "title", "created_at"],
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Comments,
          attributes: [
            "id",
            "comments_text",
            "blog_id",
            "user_id",
            "created_at",
          ],
          include: {
            model: User,
            attributes: ["username"],
          },
        },
      ],
    });
    res.status(200).json(blogDB);

  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/", async (req, res) => {

  try {
    const blogDB = await Blog.findAll({
      attributes: ["id", "title", "content", "created_at"],
      order: [["created_at", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Comments,
          attributes: [
            "id",
            "comments_text",
            "blog_id",
            "user_id",
            "created_at",
          ],
          include: {
            model: User,
            attributes: ["username"],
          },
        },
      ],
    });
    res.status(200).json(blogDB);

  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/", withAuth, async (req, res) => {

  try {
    const blogDB = await Blog.findAll({ user_id: req.session.user_id });
    res.status(200).json(blogDB);

  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/:id", withAuth, async (req, res) => {

  try {
    const blogData = await Blog.update(
      {
        title: req.body.title,
        content: req.body.content,
      },
      {
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      }
    );

    if (!blogData) {
      res.status(404).json({ message: "No blog found with this id" });
      return;
    }
    res.status(200).json(blogData);

  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", withAuth, async (req, res) => {

  try {
    const blogData = await Blog.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!blogData) {
      res.status(404).json({ message: "No blog found with this id" });
      return;
    }

    res.status(200).json(blogData);
    
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
