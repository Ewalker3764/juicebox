const express = require('express');
const tagsRouter = express.Router();
const { getAlltags, getPostsByTagName } = require('../db');

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next();
});

tagsRouter.get('/', async (req, res) => {
  const tags = await getAlltags();
  res.send({
    tags
  });
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
  // read the tagname from the params
  const { tagName } = req.params

  try {
    // use our method to get posts by tag name from the db
    const allPosts = await getPostsByTagName(tagName)
    // send out an object to the client { posts: // the posts }
    const posts = allPosts.filter(post => {
      // keep a post if it is either active, or if it belongs to the current user
      if (post.active) {
        return true;
      }

      // the post is not active, but it belogs to the current user
      if (req.user && post.author.id === req.user.id) {
        return true;
      }

      // none of the above are true
      return false;
    });
    res.send({ posts: posts })
  } catch ({ name, message }) {
    next({ name, message });
    // forward the name and message to the error handler
  }
});

module.exports = tagsRouter;