//placeholder frontend js to make a call to the bus API, adding a new user using
// the data from the form found in index.html
"use strict";

(function() {

  window.addEventListener("load", init);

  //Adds an event listener to the add user form, pointing to the api call function.
  async function init() {
    let addForm = document.getElementById("add-form");
    addForm.addEventListener("submit", async function (event) {
      let res = await addUser(event);
      console.log(res);
    });
    let changeForm = document.getElementById("change-form");
    changeForm.addEventListener("submit", async function (event) {
      let res = await changeUser(event);
      console.log(res);
    });
    //Adds an event listener to the login form, pointing to the api call function.
    let loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", async function (event) {
      let res = await login(event);
      let resp = await favorite();
      console.log(res);
      console.log(resp);
    });
    let feedbackForm = document.getElementById("feedback-form");
    feedbackForm.addEventListener("submit", async function (event) {
      let res = await addFeedback(event);
      console.log(res);
    });
  }

  /**
   * Makes a post request to the bus API, adding a new user from the formdata.
   * Username and password are necessary fields for the post request.
   * @param {Event} event Form submit event, used for event.target (the form)
   * @returns response object containing current users table, only for testing purposes.
   */
  async function addUser(event) {
    //Prevents the page from clearing when the form is submitted
    event.preventDefault();
    try {
      //converts the filled out form into a form data object
      let form = new FormData(event.target);
      //creates a post request to the API with the formData as the body
      let res = await fetch("/newUser", {
        method: "POST",
        body: form
      });
      //ensures the response from the API is ok, throws error if not.
      res = await statusCheck(res);
      //converts the json response to an object
      res = await res.json();
      //returns the object
      return res.response;
    } catch (err) {
      return "Unsuccessful fetch request";
    }
  }

  async function changeUser(event) {
    //Prevents the page from clearing when the form is submitted
    event.preventDefault();
    try {
      //converts the filled out form into a form data object
      let form = new FormData(event.target);
      //creates a post request to the API with the formData as the body
      let res = await fetch("/updateUser", {
        method: "POST",
        body: form
      });
      //ensures the response from the API is ok, throws error if not.
      res = await statusCheck(res);
      //converts the json response to an object
      res = await res.json();
      //returns the object
      return res.response;
    } catch (err) {
      return "Unsuccessful fetch request";
    }
  }

  /**
   * Makes a post request to the bus API, logging in a user
   * Username and password are necessary fields for the post request.
   * @param {Event} event Form submit event, used for event.target (the form)
   * @returns response object containing the users info, subject to change.
   */
  async function login(event) {
    //Prevents the page from clearing when the form is submitted
    event.preventDefault();
    try {
      let form = new FormData(event.target);
      let res = await fetch("/login", {
        method: "POST",
        body: form
      });
      //ensures the response from the API is ok, throws error if not.
      res = await statusCheck(res);
      //converts the json response to an object
      res = await res.json();
      //returns the object
      return res.response;
    } catch (err) {
      return "Unsuccessful fetch request";
    }
  }

  async function addFeedback(event) {
    //Prevents the page from clearing when the form is submitted
    event.preventDefault();
    try {
      //converts the filled out form into a form data object
      let form = new FormData(event.target);
      //creates a post request to the API with the formData as the body
      let res = await fetch("/feedback", {
        method: "POST",
        body: form
      });
      //ensures the response from the API is ok, throws error if not.
      res = await statusCheck(res);
      //converts the json response to an object
      res = await res.json();
      //returns the object
      return res.response;
    } catch (err) {
      return "Unsuccessful fetch request";
    }
  }

  async function statusCheck(response) {
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response;
  }

})();