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
  this.newQs = null;
  this.userid = 0;
  this.userfaves = [];
  this.favequestionid = null;


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
  	});
  };

    //Randomize questions
    this.randomQs = (catQs) => {
       for (i=0; i<catQs.length; i++){
         this.newQs = catQs[Math.floor(Math.random() * catQs.length)];
         document.getElementById('displayQ').innerHTML = this.newQs.content;
       }
       document.getElementById("faveBtn").style.display="inline-block";
     };

//FAVORITES POST route
     this.favorite = (questionid) => {
       console.log('this is question id: ', questionid);
       this.formData = {user_id: this.user.id, question_id: questionid};

       $http({
         method: 'POST',
         // url: this.herokuUrl + '/favorites',
         url: this.url + '/users/' + this.user.id + '/favorites',
         data: this.formData
       }).then(response => {
         console.log(response);
       }).catch(reject => {
         console.log('Reject: ', reject);
       });
     }

//FAVORITES GET route-------------NOT RIGHT

  this.showFaves = () => {
    $http({
    method: 'GET',
    // url: this.herokuUrl + '/categories/1/questions/' + this.questionID + '/answers',
    url: this.url + '/users/' + this.user.id + '/favorites/',
    }).then(response => {
      this.userfaves = response.data;
      console.log("userfaves: ", this.userfaves);
      // this.favequestionid = response.data.question_id;
      // console.log("this.favequestionid: ",this.favequestionid);
      console.log("response: ", response);
    }).catch(reject => {
     console.log('Reject: ', reject);
    });

    if (this.showFavesModal == false) {
    this.showFavesModal = true
    } else {
    this.showFavesModal = false
    }
    if (this.currentuser == false) {
    this.currentuser = true;
    }

  }
  //favorite put route
  // this.putFave = (questionid) => {
	// 		$http({
	// 			method: 'PUT',
	// 			// url: this.herokuUrl + '/categories/1/questions/' + this.questionID + '/answers/' + answerid,
	// 			url: this.url + '/categories/1/questions/' + this.questionID + '/favorites/' + questionid,
	// 		}).then(response => {
	// 			console.log('Response: ', response);
	// 		}).catch(reject => {
	// 				console.log('Reject: ', reject);
	// 		});
	// 		let index = this.findquestion.findIndex(i => i.id === answerid);
	// 		this.findanswer[index].upvote += 1;
	// }
//END of uncertainty-----------------------

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
     this.openLoginForm();
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

	 	this.openSignUpForm();
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
