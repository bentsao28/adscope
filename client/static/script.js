var myApp = angular.module('myApp', ['ngResource', 'ngRoute']);
myApp.config(function($routeProvider, $locationProvider, $httpProvider){
	var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
		var deferred = $q.defer();
		$http.get('/loggedin').success(function(user){
			if(user !== '0')
				deferred.resolve();
			else{
				$rootScope.message = "You need to log in.";
				deferred.reject();
				$location.url('/userlogin');
			}
		})
		return deferred.promise;
	};
	$httpProvider.interceptors.push(function($q, $location){
		return{
			response: function(response){
				return response;
			},
			responseError: function(response){
				if(response.status ===401)
					$location.url('/userlogin');
				return $q.reject(response);
			}
		};
	});

	$routeProvider
	.when('/',{
		templateUrl: '/partials/main.html'
	})
	.when('/register',{
		templateUrl: '/partials/register.html'
	})
	.when('/userlogin',{
		templateUrl: '/partials/login.html'
	})
	.when('/business',{
		templateUrl: '/partials/business.html'
	})
	.when('/dashboard',{
		templateUrl: '/partials/dashboard.html',
		resolve: {
			loggedin: checkLoggedin
		}
	})
	.otherwise({
		redirectTo: '/'
	});
})
	.run(function($rootScope, $http){
		$rootScope.message = '';
		$rootScope.logout = function(){
			$rootScope.message = "Logged out";
			$http.post('/logout');
		}
	})

myApp.factory('myAppFactory', function($http){
	var factory = {};
	factory.addUser = function(info, callback){
		$http.post('/add_user', info).success(function(){
			callback();
		})
	}
	factory.userLogin = function(info, callback){
		$http.post('/login', info).success(function(){
			callback();
		})
	}
	factory.logOut = function(callback){
		$http.post('/logout').success(function(){
			callback();
		})
	}
	return factory;
})
myApp.controller('registerController', function($scope, $rootScope, $location, myAppFactory){
	$scope.addUser = function(isValid){
		if(isValid){
			myAppFactory.addUser($scope.newUser, function(){
				$location.path('/userlogin');
			})
		}
	}
	$scope.userLogin = function(){
		myAppFactory.userLogin($scope.newLogin, function(){
			$rootScope.message = 'Authentication successful!';
			$location.path('/dashboard');
		})
	}
})
myApp.controller('dashboardController', function($scope, $rootScope, $location, myAppFactory){
	$scope.logOut = function(){
		myAppFactory.logOut(function(){
			$location.path('/userlogin');
		})
	}
})