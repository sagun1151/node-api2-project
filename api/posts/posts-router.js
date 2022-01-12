// implement your posts router here
const express = require("express");
const Posts = require("./posts-model");
const router = express.Router();

router.get("/", (req, res) => {
  Posts.find(req.query)
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "The posts information could not be retrieved" });
    });
});

router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((post) => {
      if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      } else {
        res.status(200).json(post);
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "The post information could not be retrieved" });
    });
});

router.post("/", (req, res) => {
  const { title, contents } = req.body;
  Posts.insert(req.body)
    .then(({id}) => {
        return Posts.findById(id)
    })
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((err) => {
      if (!title || !contents) {
        res
          .status(400)
          .json({ message: "Please provide title and contents for the post" });
      } else {
        res
          .status(500)
          .json({
            message: "There was an error while saving the post to the database",
          });
      }
    });
});

router.put("/:id", async (req, res) => {
    const { id } = req.params; // destructuring
    const { title, contents } = req.body;
    try {
      const post = await Posts.findById(id);
      if (!post) {
        res.status(404).json({
          message: "The post with the specified ID does not exist",
        });
      } else if (!title || !contents) {
        res.status(400).json({
          message: "Please provide title and contents for the post",
        });
      } else {
        await Posts.update(id, req.body);
        res.status(200).json(await Posts.findById(id));
      }
    } catch (err) {
      res.status(500).json({
        message: "The post information could not be modified",
      });
    }
})

router.delete('/:id', async (req, res)=> {
    const { id } = req.params;
  try {
    const post = await Posts.findById(id);
    if (!post) {
      res.status(404).json({
        message: "The post with the specified ID does not exist",
      });
    } else {
      await Posts.remove(id);
      res.status(200).json(post);
    }
  } catch (err) {
    res.status(500).json({
      message: "The post could not be removed",
      error: err.message,
    });
  }
})

router.get('/:id/comments', async (req,res)=>{
    const { id } = req.params;
  try {
    const post = await Posts.findById(id);
    if (!post) {
      res.status(404).json({
        message: "The post with the specified ID does not exist",
      });
    } else {
      const comments = await Posts.findPostComments(id);
      res.json(comments);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "The comments information could not be retrieved",
    });
  }
})


module.exports = router;
