const db = require("../db");

const getTodoList = async (req, res) => {
  try {
    db.all(`SELECT  * from todos`, (err, row) => {
      if (err) {
        throw new Error();
      }
      res.status(200).json({ todos: row });
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

const addTodo = async (req, res) => {
  try {
    const { title } = req?.body;
    db.run(`INSERT INTO todos(title) VALUES(?)`, [title], (err) => {
      if (err) {
        throw new Error(err);
      }
      res.status(200).send("Successfully added todo");
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

const deleteTodo = async (req, res) => {
  try {
    const id = req.params.id;
    db.run(`DELETE FROM todos WHERE todo_id=?`, [id], (err) => {
      if (err) {
        throw new Error(err);
      }
      res.status(200).send("Successfully deleted todo");
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

const updateTodo = async (req, res) => {
  try {
    const id = req.params.id;
    const { title } = req?.body;

    db.run(`UPDATE todos SET title=? WHERE todo_id=?`, [title, id], (err) => {
      if (err) {
        res.status(400).send(err);
      }
      else{
        res.status(200).send("Succesfoolly updated todos");
      }
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports = { getTodoList, addTodo, deleteTodo, updateTodo };
