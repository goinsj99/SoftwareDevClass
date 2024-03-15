//API framework and implementation of one post endpoint to add a user to the
//database.
"use strict";

const express = require("express");
const multer = require("multer");
const app = express();

//Creates a new database pool connection to the bus_db database.
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'bus_db',
  password: 'pwd',
  port: 5432,
});

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

const DEFAULT_PORT = 3000;
const SERVER_ERR = "Sorry, something went wrong. Please try again later.";
const PARAM_ERR = "Missing required parameters.";

/**
 * Post endpoint to add a new user to the database. Currently returns the new
 * contents of the users table, this is for testing purposes only. Final
 * implementation will not return any data. Username for user must be unique.
 * query params: body {
 *               name: name of the user being added (string)
 *               username: username of the user being added (string, required)
 *               password: password of the user being added (string, required)
 *               favRoute: id numbers of the users favorite routes (array)
 *               walkingSpeed: coefficient of the user's walking speed (number)
 *             }
 */
app.post("/newUser", async (req, res) => {
  try {
    let username = req.body.username;
    let name = req.body.name;
    let password = req.body.password;
    let favRoute = req.body.favRoute;
    let walkingSpeed = req.body.walkingSpeed;
    console.log("addUser functioning");
    if (!username || !password) {
      res.status(400).type("text");
      res.send("Missing required parameters.");
    } else if (!(await isUnique(username))) {
      res.status(400).type("text");
      res.send("Username is already taken");
    } else {
      //inserts the new user into the database
      let db = await pool.connect();
      let sql = "INSERT INTO users(full_name, username, password, fav_routes, walking_speed) VALUES ($1, $2, $3, $4, $5)";
      await db.query(sql, [name, username, password, favRoute, walkingSpeed]);
      //selects all user data from the users table (TESTING)
      sql = "SELECT * FROM users";
      let result = await db.query(sql);
      //formats the response
      result = {
        "response": result.rows
      };
      await db.end();
      res.type("JSON");
      res.send(result);
    }
  } catch (err) {
    res.status(500).type("text");
    res.send("Sorry, something went wrong. Please try again later.");
  }
});

/**
 * Post endpoint to log in a user. Currently returns the entire contents of that
 * user, this is welcome to change. This also has very poor security as the password
 * is sent along the request unhashed.
 * query params: body {
 *               username: username of the user being added (string, required)
 *               password: password of the user being added (string, required)
 *             }
 */
app.post("/login", async (req, res) => {
  try {
    console.log('not errored yet');
    let username = req.body.username;
    let password = req.body.password;
    if (!username) {
      res.status(400).type("text");
      res.send("Missing required parameters.");
    } else {
      console.log("still not");
      //finds the user with given username
      let db = await pool.connect();
      let sql = "SELECT * FROM users WHERE (username = $1)";
      let result = await db.query(sql, [username]);
      if (result.rows[0].password != password) {
        res.status(400).type("text");
        res.send("Incorrect password");
      } else {
        //formats the response
        result = {
          "response": result.rows[0]
        };
        await db.end();
        res.type("JSON");
        res.send(result);
      }
    }
  } catch (err) {
    res.status(500).type("text");
    res.send("Sorry, something went wrong. Please try again later.");
  }
});

app.post("/newRoute", async (req, res) => {
  try {
    let source = req.body.source;
    let dest = req.body.destination;
    console.log("reached");
    console.log(source);
    console.log(dest);
    console.log("addRoute functioning");
      //inserts the new user into the database
      let db = await pool.connect();
      let sql = "INSERT INTO routes(departure, arrival) VALUES ($1, $2);";
      await db.query(sql, [source, dest]);
      //selects all user data from the users table (TESTING)
      sql = "SELECT * FROM routes;";
      let result = await db.query(sql);
      //formats the response
      result = {
        "response": result.rows
      };
      await db.end();
      res.type("JSON");
      res.send(result);
  } catch (err) {
    res.status(500).type("text");
    res.send("Sorry, something went wrong. Please try again later.");
  }
});

//TO DO
app.get("/getRoute", async (req, resp) => {
  try {
      //gets routes
      let db = await pool.connect();
      let sql = "SELECT * FROM routes;";
      let result = await db.query(sql);
      // //formats the response
      result = {
        "response": result.rows
      };
      await db.end();
      resp.type("JSON");
      resp.send(result)
  } catch (err) {
    resp.status(500).type("text");
    resp.send("Sorry, something went wrong. Please try again later.");
  }
});

/**
 * Post endpoint to update data for a user. Takes a username and any combination of
 * information to be changed. Returns a text message.
 * query params: body {
 *               username: username of the user (string, required)
 *               full_name: new name of the user being changed (string, optional)
 *               password: new password of the user being changed (string, optional)
 *               fav_routes: new favorite routes of the user being changed (Array, optional)
 *               walking_speed: new walking speed of the user being changed (number, optional)
 *             }
 */
 app.post("/updateUser", async (req, res) => {
  try {
    let username = req.body.username;
    if (username) {
      let fields = {
        full_name: req.body.name,
        password: req.body.password,
        fav_routes: req.body.favRoute,
        walking_speed: req.body.walkingSpeed
      };
      await updateUser(fields, username);
      res.status(200).type("text");
      res.send("User successfully changed.");
    } else {
      res.status(400).type("text");
      res.send("Missing required parameters");
    }
  } catch (err) {
    res.status(500).type("text");
    res.send(SERVER_ERR);
  }
});

/**
 * Post endpoint to add feedback. Currently does not work correctly in adding the
 * id of the user, most likely due to issues with primary keys. Returns the contents
 * of the feedback table.
 * query params: body {
 *               username: username of the user adding feedback (string, optional)
 *               message: new feedback message (string, required)
 *               time: time of the feedback submission (time, optional)
 *             }
 */
app.post("/feedback", async (req, res) => {
  try {
    let username = req.body.username;
    let message = req.body.message;
    let time = req.body.time;
    let read = false;
    // let id = await getUser(username);
    // console.log(id);
    if (!message) {
      res.status(400).type("text");
      res.send(PARAM_ERR);
    } else {
      let sql = "INSERT INTO feedback(message, time, read) VALUES ($1, $2, $3);";
      let db = await pool.connect();
      console.log('before query');
      await db.query(sql, [message, time, read]);
      console.log('after query');
      sql = "SELECT * FROM feedback";
      let result = await db.query(sql);
      //formats the response
      result = {
        "response": result.rows
      };
      await db.end();
      res.status(200).type("JSON");
      res.send(result);
      // res.status(200).type("text");
      // res.send("Feedback successfully added");
    }
  } catch (err) {
    res.status(500).type('text');
    res.send(SERVER_ERR);
  }
});

app.get("/favorites/:username", async (req, res) => {
  try {
    let username = req.params.username;
    if (!username) {
      req.status(400),type("text");
      req.send(PARAM_ERR);
    } else {
      let routeArr = await getFavArray(username);
      let routes = await getFavRoutes(routeArr);
      let resp = {
        "response": routes
      };
      res.status(200).type('json');
      res.send(resp);
    }
  } catch (err) {
    res.status(500).type("text");
    res.send(SERVER_ERR);
  }
});

/**
 * Checks if a given username is unique within the database.
 * @param {String} username Proposed username to be added.
 * @returns {Boolean} True if username is unique, false otherwise.
 */
async function isUnique(username) {
  let db = await pool.connect();
  let sql = "SELECT * FROM users WHERE (username = $1)";
  let res = await db.query(sql, [username]);
  await db.end();
  res = res.rows[0];
  return (!res);
}

/**
 * Changes the values for a given user using a passed request object.
 * @param {Object} fields All of the fields of the request.
 * @param {String} username username of the user being changed.
 */
async function updateUser(fields, username) {
  try {
    let sql = "UPDATE users SET ";
    for (let field in fields) {
      if (fields[field] != undefined) {
        sql += field + " = '" + fields[field] + "', ";
      }
    }
    sql = sql.substring(0, (sql.length - 2));
    sql += " WHERE username = '" + username + "';";
    let db = await pool.connect();
    let res = await db.query(sql);
    await db.end();
  } catch (err) {
    console.log(err);
  }
}

/**
 * Finds the id of a user with a given username.
 * @param {String} username Username of the user whose id is being found
 * @returns {Number} The id of the user.
 */
async function getUser(username) {
  try {
    let sql = "SELECT id FROM users WHERE username = $1";
    let db = await pool.connect();
    let res = await db.query(sql, [username]);
    await db.end();
    return res;
  } catch (err) {
    console.log(err);
  }
}

/**
 * Finds the array of a user's favorite routes given that user's username.
 * @param {String} username The username of the user whose routes are being retrieved.
 * @returns {Array} The array of the ids of the user's favorite routes.
 */
async function getFavArray(username) {
  try {
    let sql = "SELECT fav_routes FROM users WHERE username = $1;";
    let db = await db.connect();
    let resp = await db.query(sql, [username]);
    resp = resp.rows[0];
    await db.end();
    return resp;
  } catch (err) {
    return err;
  }
}

async function getFavRoutes(routeArr) {
  try {
    let routes = [];
    let db = await pool.connect();
    let sql = "SELECT * FROM routes WHERE id = $1;";
    for (let i = 0; i < routeArr.length; i++) {
      let routeID = routeArr[i];
      let resp = await db.query(sql, [routeID]);
      routes[i] = resp.rows[0];
    }
    await db.end();
    return routes;
  } catch (err) {
    return err;
  }
 }

app.use(express.static("public"));
const PORT = process.env.PORT || DEFAULT_PORT;
app.listen(PORT);