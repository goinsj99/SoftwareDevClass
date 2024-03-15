// Imports the server.js file to be tested.
const server = require("../server");
// Assertion (Test Driven Development) and Should,  Expect(Behaviour driven 
// development) library
const chai = require("chai");
// Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);
const { assert, expect } = chai;

describe("Server!", () => {
  // Sample test case given to test / endpoint.
  it("Returns the default welcome message", (done) => {
    chai
      .request(server)
      .get("/")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals("success");
        assert.strictEqual(res.body.message, "Welcome!");
        done();
      });
  });

  // ===========================================================================
  // TODO: Please add your test cases for part A here.

  it("Returns a list of operations", (done) => {
    chai
      .request(server)
      .get("/operations")
      .end((err, res) => {
        expect(res).to.have.status(200);
        res.body.should.be.an('array');
        res.body.length.should.not.be.eq(0);
        done();
      });
  });
  it("Returns the details of operation based on the id passed", (done) => {
    chai
      .request(server)
      .get("/operations/1")
      .end((err, res) => {

        expect(res.body).to.have.property('id').equal(1);
        res.body.should.have.property('name');
        res.body.should.have.property('sign');
       
        done();
      });
  });
  it("Operations exist", (done) => {
    chai
      .request(server)
      .get("/operations")
      .end((err, res) => {

        console.log(res.body);
        done();
      });
  });
  

  // ===========================================================================
  // TODO: Please add your test cases for part B here.
   
  it("Positive test case", (done) => {
    const test = {
      num1: 3,
      num2: 6,
    }
    chai
      .request(server)
      .post("/add")
      .send(test)
      .end((err, res) => {
       
        expect(res.body.sum).to.equal(9);
     
        done();
      });
  });

  it("Positive test case", (done) => {
    const test = {
      num1: 3,
      num2: 6,
    }
    chai

      .request(server)
      .post("/divide")
      .send(test)
      .end((err, res) => {
        
        expect(res.body.quotient).to.equal(.5);  
        done();
      });
  });

  it("Negative test case", (done) => {
    chai

      .request(server)
      .post("/add")
      .end((err, res) => {

        res.body.should.not.have.property('num1').equal(0);
        res.body.should.not.have.property('num2').equal(0);       
        done();
      });
  });

  it("Negative test case", (done) => {
    chai
      .request(server)
      .post("/divide")
      .end((err, res) => {
        res.body.should.not.have.property('num2').equal(0);       
        done();
      });
  }); 


});
