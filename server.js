const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//config db
const db = require("./config/keys").mongoURI;

//mongodb connection
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Mongodb connected successfully"))
  .catch(err => console.log(err));

//app.get("/", (req, res) => res.send("hello World"));
const port = process.env.PORT || 5000;

// middle passport
app.use(passport.initialize());

//password config ---- jwt type
require("./config/passport")(passport);

//routes use
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

app.listen(port, () => console.log(`server is running on port ${port}`));

//static server in production
if (process.env.NODE_ENV === "production") {
  //ser static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
