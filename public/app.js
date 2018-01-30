const app = angular.module('ChatApp', []);

app.controller('MainController', ['$http', function($http) {

  // INITIAL STATES
  this.url = "http://localhost:3000";
  this.herokuUrl = "https://chatter-up-app.herokuapp.com/";
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
  // this.userfaves = [];
  this.favequestionid = null;
  this.showFavesModal = false;


  // Get categories
  	$http({
  		method: 'GET',
  		url: this.herokuUrl + '/categories'
  		// url: this.url + '/categories'
  	}).then(response => {
  		this.categories = response.data;
      console.log(this.categories);
  	}).catch(reject => {
  	});

  // Get Questions
  this.getQs = () =>{
  	$http({
  		method: 'GET',
  		url: this.herokuUrl + '/categories/1/questions'
  		// url: this.url + '/categories/1/questions'
  	}).then(response => {
      console.log("getting questions...");
  		this.questions = response.data;
      console.log(this.questions);
      this.getLikes();
  	}).catch(reject => {
  	});
  };

    //Randomize questions
    this.randomQs = (catQs) => {
       for (i=0; i<catQs.length; i++){
         this.newQs = catQs[Math.floor(Math.random() * catQs.length)];
         document.getElementById('displayQ').innerHTML = this.newQs.content;
       }
       this.changeHeart(this.newQs);
       this.formData.question_id = this.newQs.id;
     };


//FAVORITES POST route
     this.favorite = (questionid) => {
       console.log('this is question id: ', questionid);
       this.formData = {user_id: this.user.id, question_id: questionid, isliked: true};

       $http({
         method: 'POST',
         url: this.herokuUrl + '/users/' + this.user.id + '/favorites',
         // url: this.url + '/users/' + this.user.id + '/favorites',
         data: this.formData,
       }).then(response => {
         this.heartRed();
         console.log("non-push userfaves: ", this.userfaves);
         this.userfaves.push(response.data);
         console.log("push userfaves: ", this.userfaves);
         console.log("checking response: ", response);
       }).catch(reject => {
         console.log('Reject: ', reject);
       });
     }

//FAVORITES GET route

  this.showFaves = () => {
    $http({
    method: 'GET',
    url: this.herokuUrl + '/users/' + this.user.id + '/favorites/',
    // url: this.url + '/users/' + this.user.id + '/favorites/',
    }).then(response => {
      this.userfaves = response.data;
      console.log("userfaves: ", this.userfaves);
    }).catch(reject => {
     console.log('Reject: ', reject);
    });
    console.log("userfaves: ", this.userfaves);
  }

  this.displayFaves = () => {
    if (this.showFavesModal == false) {
    this.showFavesModal = true
    } else {
    this.showFavesModal = false
    }
  }

//Heart button
  this.heartRed = () => {
    document.getElementById('heart').style.color = "red";
  }

  this.changeHeart = (newQuestion) => {
    for (i=0; i<this.userfaves.length; i++) {
      this.userfaveid = this.userfaves[i].question_id;
      if (this.userfaveid == newQuestion.id) {
        console.log("newQuestion.id: ", newQuestion.id);
        console.log("yes");
       document.getElementById('heart').style.color = "red";
       break;
     } else if (this.userfaveid !== newQuestion.id){
       console.log("no");
       document.getElementById('heart').style.color = "grey";
     }
    }
  }

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

  //GET users
  this.getUsers = () => {
    $http({
    	 url: this.herokuUrl + '/users',
    	 // url: this.url + '/users',
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

//Authentication--------------
this.login = (userLogin) => {
  this.userfaves = [];
	$http({
	 method: 'POST',
	 // url: this.url + '/users/login',
   url: this.herokuUrl + '/users/login',
	 data: { user: { username: userLogin.username, password: userLogin.password }},
 }).then(response => {
   if (response.data.status == 200) {
   console.log(response);
		 this.user = response.data.user;
     this.loggedIn = true;
		 localStorage.setItem("token", JSON.stringify(response.data.token));
		 this.formData = {username: this.user.username}
     this.openLoginForm();
     this.showFaves();
     this.getQs();
   }
   else {
		this.err = 'Username and/or Password Incorrect';
	 }
 });
};

this.createUser = (userPass) => {
  this.userfaves = [];
	$http({
	 method: 'POST',
	 url: this.herokuUrl + '/users',
	 // url: this.url + '/users',
	 data: { user: { username: userPass.username, password: userPass.password }},
 }).then(response => {

	 this.user = response.data.user;
	 this.formData = {username: this.user.username}
   localStorage.setItem("token", JSON.stringify(response.data.token));

	 if (response.status == 200) {
    this.regForm = false;
	 }
   if (this.user.username !== null) {
     this.loggedIn = true;
     this.showFaves();
   }
 }).catch(reject => {
		this.err = 'Username Already Exists';
	});
};

this.getUsers = () => {
 $http({
	 url: this.herokuUrl + '/users',
	 // url: this.url + '/users',
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
  this.userfaves = [];
  localStorage.clear('token');
  location.reload();
  this.loggedIn = false;
}
//END Authentication----------------
}]);
