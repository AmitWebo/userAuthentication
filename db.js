const sqlite3 = require("sqlite3").verbose();


let db = new sqlite3.Database("./db/todo.db", (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected to the in-memory Sqlite database");
  });
  
  db.run(`CREATE TABLE IF NOT EXISTS todos(
    id INTEGER NOT NULL,
    title text,
    PRIMARY KEY("id")
  )`,err=>{
    if(err){
      return console.log(err)
    }
    console.log('Created table todos')
  })

module.exports=db