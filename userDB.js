const sqlite3 = require("sqlite3").verbose();


let db = new sqlite3.Database("./db/user.db", (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected to the user Sqlite database");
  });
  
  db.run(`CREATE TABLE IF NOT EXISTS users(
    id INTEGER NOT NULL,
    name text,
    email text,
    password text,
    PRIMARY KEY("id")
  )`,err=>{
    if(err){
      return console.log(err)
    }
    console.log('Created table users')
  })

  db.run(`CREATE TABLE IF NOT EXISTS tokens(
    id INTEGER NOT NULL,
    token text,
    user_id INTEGER NOT NULL,
    PRIMARY KEY("id")
  )`,err=>{
    if(err){
      return console.log(err)
    }
    console.log('Created table users')
  })

module.exports=db