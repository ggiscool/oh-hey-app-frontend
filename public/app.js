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
  this.showFavesModal = false;


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
      // this.questionViewed = true;
      // this.liked = false;
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
       // console.log("newQs: ", this.newQs);
       this.formData.question_id = this.newQs.id;
       // this.checkHeart();
     };

//FAVORITES POST route
     this.favorite = (questionid) => {
       console.log('this is question id: ', questionid);
       this.formData = {user_id: this.user.id, question_id: questionid, isliked: true};

       $http({
         method: 'POST',
         // url: this.herokuUrl + '/favorites',
         url: this.url + '/users/' + this.user.id + '/favorites',
         data: this.formData
       }).then(response => {
         // this.liked = true;
         // this.checkHeart();
         // document.getElementsByClassName("fa-heart")[0].style.color = "red";
         console.log(response);
       }).catch(reject => {
         console.log('Reject: ', reject);
       });

     }

//FAVORITES GET route

  this.showFaves = () => {
    $http({
    method: 'GET',
    // url: this.herokuUrl + '/categories/1/questions/' + this.questionID + '/answers',
    url: this.url + '/users/' + this.user.id + '/favorites/',
    }).then(response => {
      this.userfaves = response.data;
      // console.log("userfaves: ", this.userfaves);
      // console.log("response: ", response);
    }).catch(reject => {
     console.log('Reject: ', reject);
    });

  }

  this.displayFaves = () => {
    this.showFaves();
    if (this.showFavesModal == false) {
    this.showFavesModal = true
    } else {
    this.showFavesModal = false
    }
    if (this.currentuser == false) {
    this.currentuser = true;
    }
  }

  this.showFaves();
  //Favorites heart turn reload


  this.getLikes = () => {

    console.log("is this method working?");
    for(i=0;i<this.userfaves.length;i++){
      this.questions.forEach((question) => {
        if(question.id == this.userfaves[i].question_id){
          question.like = true
        }
      })
    }

    console.log(this.questions);
  }
  // this.checkHeart = () => {
  //   let counter = 0;
    //loops through user's array of favorites and checks is the current question has a value of isliked=true
    // if (this.userfaves.question_id.includes(this.formData.question_id)) {
    //   console.log("trying to be red");
    //   document.getElementsByClassName("fa-heart")[0].style.color = "red";
    // } else {
    //   console.log("trying to be grey");
    //   document.getElementsByClassName("fa-heart")[0].style.color = "grey";
    //       }
    // for(i=0;i<this.userfaves.length;i++){
    //     console.log("userfavesqid: ", this.userfaves[i].question_id);
    //     console.log("forDataqid: ", this.formData.question_id);
    //     console.log("isliked?: ", this.userfaves[i].isliked);
    //   if (this.formData.question_id == this.userfaves[i].question_id && this.userfaves[i].isliked === true) {
    //     console.log("trying to be red");
    //     document.getElementsByClassName("fa-heart")[0].style.color = "red";
    //   }
    //   else {
    //     console.log("trying to be grey");
    //     document.getElementsByClassName("fa-heart")[0].style.color = "grey";
    //   }
// }
    // if (counter>0) {
    //   document.getElementsByClassName("fa-heart")[0].style.color = "red";
    // } else {
    //   document.getElementsByClassName("fa-heart")[0].style.color = "grey";
    // }
  // console.log("formData: ", this.formData.question_id);
  //
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
     this.openLoginForm();
     this.showFaves();
     // this.getLikes();
     this.getQs();
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
	 	// this.openRegForm();
    this.regForm = false;
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
