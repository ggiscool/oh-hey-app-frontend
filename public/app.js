const app = angular.module('ChatApp', []);

app.controller('MainController', ['$http', function($http) {

  // this.test = "test";
  this.url = "http://localhost:3000";
  this.user = {};
	this.loggedIn = false;
  this.loginForm = false;
	this.regForm = false;
  this.err = '';
  this.currentquestion = false;
  this.questionContent = '';
  this.categories = [];
	this.questions = [];


  // Get categories
  	$http({
  		method: 'GET',
  		// url: this.herokuUrl + '/categories'
  		url: this.url + '/categories'
  	}).then(response => {
  		this.categories = response.data;
      console.log(this.categories);
  	}).catch(reject => {
  	});

  // Get Questions
  this.getQs = () =>{
  	$http({
  		method: 'GET',
  		// url: this.herokuUrl + '/categories/1/questions'
  		url: this.url + '/categories/1/questions'
  	}).then(response => {
      console.log("getting questions...");
  		this.questions = response.data;
      console.log(this.questions);
  	}).catch(reject => {
  		// console.log('Reject: ', reject);
  	});
  };

  	// this.displayQ = (question) => {
  	// 	this.err = '';
  	// 	if (this.display == false) {
  	// 		this.display = true;
  	// 		this.questionContent = question.content;
  	// 	}
  	// 	else {
  	// 		this.display = false;
  	// 	}
  	// };

    //Randomize questions
    this.randomQs = (catQs) => {
      // const blurbs = this.questions;
       // const i = i;
       for (i=0; i<catQs.length; i++){
         const newQs = catQs[Math.floor(Math.random() * catQs.length)];
         document.getElementById('displayQ').innerHTML = newQs.content;
       }
     };
    //
  	// this.category = (num) => {
  	// 	this.category = num;
  	// 	this.questionID = 0;
  	// }
    //
  	// this.pickQuestion = (question) => {
  	// 	this.questionID = question.id;
  	// }


//LOGIN/OUT/SIGNUP FORMS---------------
  this.openLoginForm = () => {

		this.err = '';

		if (this.loginForm == false) {
			this.loginForm = true;
		} else {
			this.loginForm = false;
		}
	}

	this.openRegForm = () => {

		this.err = '';

		if (this.regForm == false) {
			this.regForm = true;
		} else {
			this.regForm = false;
		}
	}

//Authentication--------------
this.login = (userPass) => {

	$http({
	 method: 'POST',
	 url: this.url + '/users/login',
   // url: this.herokuUrl + '/users/login',
	 data: { user: { username: userPass.username, password: userPass.password }},
 }).then(response => {
   if (response.data.status == 200) {
   console.log(response);
		 this.user = response.data.user;
     this.loggedIn = true;
		 localStorage.setItem("token", JSON.stringify(response.data.token));
		 this.formData = {username: this.user.username}
     // this.openLoginForm();
   }
   else {
		this.err = 'Username and/or Password Incorrect';
	 }
 });
};

this.createUser = (userPass) => {

	$http({
	 method: 'POST',
	 // url: this.herokuUrl + '/users',
	 url: this.url + '/users',
	 data: { user: { username: userPass.username, password: userPass.password }},
 }).then(response => {

	 this.user = response.data.user;
	 this.loggedIn = true;
	 this.formData = {username: this.user.username}

	 if (response.status == 200) {

	 	// this.openSignUpForm();
	 }
 }).catch(reject => {


		this.err = 'Username Already Exists';
	});
};

this.getUsers = () => {
 $http({
	 // url: this.herokuUrl + '/users',
	 url: this.url + '/users',
	 method: 'GET',
	 headers: {
		Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
	 }
 }).then(response => {
	 console.log(response);
	 if (response.data.status == 401) {
	    this.error = "Unauthorized";
		} else {
			this.users = response.data;
		}
 });
};

this.logout = () => {
  localStorage.clear('token');
  location.reload();
  this.loggedIn = false;
}
//END Authentication----------------
}]);
