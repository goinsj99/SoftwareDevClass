/** Load components
 * Express      - A Node.js Framework
 * Body-Parser  - A tool to help use parse the data in a post request
 */
const express = require("express");
const bodyParser = require("body-parser");

/** express configuration
 * - Support json encoded bodies
 * - Support encoded bodies
 */
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const ops = [
  {
    id: 1,
    name: "Add",
    sign: "+",
  },
  {
    id: 2,
    name: "Subtract",
    sign: "-",
  },
  {
    id: 3,
    name: "Multiply",
    sign: "*",
  },
];

// Simple get api provided to check if the node.js starts up successfully. Opening up http://localhost:3000 should display the below returned json.
app.get("/", (req, res) => {
  res.json({ status: "success", message: "Welcome!" });
});

app.get("/operations", (request, response) => {
  response.send(ops);
});

// GET (BY ID)
app.get("/operations/:id", (request, response) => {
  const opsId = request.params.id;
  const op = ops.find((op) => op.id === parseInt(opsId));
  if (!op)
    return response
      .status(404)
      .send("The task with the provided ID does not exist.");
  response.send(op);
});

// POST, add to the list of ops
app.post("/operations", (request, response) => {
  const op = {
    id: ops.length + 1,
    name: request.body.name,
    sign: request.body.sign,
  };

  ops.push(op);
  response.status(201).send(op);
});

// =============================================================================
// Part B TODO: Add your code support two new API's /add and /divide here.
app.post("/add", (req, res) => {
  var num1 = Number(req.body.num1);
  var num2 = Number(req.body.num2);
  const add = {
    sum: num1 + num2,
  };
   if(num1 == 0 || num2 == 0){
     return res.status(201).send("Cant add numbers less than or equal to 0");
   }
   else{
   res.status(200).send(add);}
});
  
app.post("/divide", (req, res) => {
  var num1 = Number(req.body.num1);
  var num2 = Number(req.body.num2);
  const div = {
    quotient: num1 / num2,
  };
   if( num2 == 0){
     return res.status(201).send("Cant divide by zero");
   }
   else{
   res.status(200).send(div);}
});
module.exports = app.listen(3000);
console.log("3000 is the magic port");
