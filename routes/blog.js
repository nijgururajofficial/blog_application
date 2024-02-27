const { Router } = require("express");
const multer = require("multer");
const path = require("path");

const Blog = require("../models/blog");
const Comment = require("../models/comment");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

const router = Router();

router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("author");
  const allComments = await Comment.find({ blogId: req.params.id }).populate(
    "commentedBy"
  );
  return res.render("blog", {
    user: req.user,
    blog: blog,
    comments: allComments,
  });
});

router.post("/comment/:blogId", async (req, res) => {
  const { body, params, user } = req;

  const comment = await Comment.create({
    content: body.content,
    blogId: params.blogId,
    commentedBy: user._id,
  });
  return res.redirect(`/blog/${params.blogId}`);
});

router.post("/add-new", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.create({
    body,
    title,
    author: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;
