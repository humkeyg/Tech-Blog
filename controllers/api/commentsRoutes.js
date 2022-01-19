const router = require("express").Router();
const { Comments } = require("../../models");
const withAuth = require("../../utils/auth");

router.post("/", withAuth, async (req, res) => {
  try {
    const newComment = await Comments.create({
      comments_text: req.body.comments_text,
      post_id: req.body.post_id,
      user_id: req.session.user_id,
    });
    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const commentsDB = await Comments.findAll({});
    res.status(200).json(commentsDB);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const commentsDB = await Comments.findAll({
      where: {
        id: req.body.id,
      },
    });
    res.status(200).json(commentsDB);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/:id", withAuth, async (req, res) => {

  try {
    const commentsData = await Comments.update(
      {
        title: req.body.title,
        comments_text: req.body.comments_text,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (!commentsData) {
      res.status(404).json({ message: "No post found with this id!" });
      return;
    }

    res.status(200).json(commentsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", withAuth, async (req, res) => {
  try {
    const commentsData = await Comments.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!commentsData) {
      res.status(404).json({ message: "No comment found with this id!" });
      return;
    }

    res.status(200).json(commentsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
