const app = angular.module('ChatApp', []);

app.controller('MainController', ['$http', function($http) {

  this.test = "test";
  this.url = "http://localhost:3000";
  this.user = {};



//Authentication--------------
this.login = (userPass) => {

	$http({
	 method: 'POST',
	 url: this.url + '/users/login',
	 data: { user: { username: userPass.username, password: userPass.password }},
 }).then(response => {
   console.log(response);
		 this.user = response.data.user;
		 localStorage.setItem("token", JSON.stringify(response.data.token));
		 // this.formData = {username: this.user.username}
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

}]);
