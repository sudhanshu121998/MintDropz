const express = require("express");
const router = express.Router();
const Posts = require("../models/Posts");
//MiddleWare
const fetchUser = require("../middleware/fetchUser");
const { body, validationResult } = require("express-validator");

//Endpoints for /api/posts/fetchallposts

//Get all the Posts:GET "/api/posts/fetchallposts".Login Required
router.get("/fetchallposts", fetchUser, async (req, res) => {
  const posts = await Posts.find({ user: req.user.id });
  res.json(posts);
});

//Get Post by id:GET "/api/posts/fetchpost/:id".Login Required
router.get("/fetchpost/:id", fetchUser, async (req, res) => {
  const post = await Posts.findById(req.params.id);
  if (!post) {
    res.status(404).send("Not Found!!");
  }
  res.json({ post });
});

//Add a new Posts:POST "/api/posts/addpost".Login Required
router.post(
  "/addpost",
  fetchUser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 character").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const post = new Posts({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedPost = await post.save();
      res.json(savedPost);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error Occured");
    }
  }
);

//Update an existing Post:PUT "/api/posts/updatepost/:id".Login Required
router.put("/updatepost/:id", fetchUser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    //Create a new post
    const newPost = {};
    if (title) {
      newPost.title = title;
    }
    if (description) {
      newPost.description = description;
    }
    if (tag) {
      newPost.tag = tag;
    }

    //Find the post to be updated
    //req.params.id is the id passed in request
    let post = await Posts.findById(req.params.id);
    if (!post) {
      res.status(404).send("Not Found!!");
    }
    //Checking the user,so that other user can't update someone else note
    if (post.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    post = await Posts.findByIdAndUpdate(
      req.params.id,
      { $set: newPost },
      { new: true }
    );
    res.json({ post });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error Occured");
  }
});
//Delete an existing Post:DELETE "/api/posts/deletenote/:id".Login Required
router.delete("/deletepost/:id", fetchUser, async (req, res) => {
  try {
    //Find the note to be deleted
    //req.params.id is the id passed in request
    let post = await Posts.findById(req.params.id);
    if (!post) {
      res.status(404).send("Not Found!!");
    }
    //Checking the user,so that other user can't delete someone else note
    if (post.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    await Posts.findByIdAndDelete(req.params.id);
    res.send("Deleted Successfully");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error Occured");
  }
});

module.exports = router;
