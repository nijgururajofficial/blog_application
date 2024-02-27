const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const { checkForUserAuthCookie } = require("./middlewares/auth");
const Blog = require("./models/blog");

const app = express();
const PORT = process.env.PORT;

mongoose
  .connect(process.env.DB_URI)
  .then((e) => console.log("MongoDB Connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForUserAuthCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  return res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});
app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => console.log("Server started at: " + PORT));
