const express = require("express");
const todoRoutes=require('./routes/todo.route')
const userRoutes=require('./routes/user.route')
const dotenv=require("dotenv")
dotenv.config()

let db = require('./db')

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json())


app.get("/", (req, res) => {
  res.send("HelloWorld");
});


app.use('/user',userRoutes)
app.use('/todo',todoRoutes)

app.listen(PORT, () => {
  console.log("App running at http://localhost:" + PORT);
});
