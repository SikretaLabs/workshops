var app = angular.module('myApp', ['ngRoute']);
 
app.filter('monthName', [function() {
    return function (monthNumber) { //1 = January
        var monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December' ];
        return monthNames[monthNumber - 1];
    }
}]);

app.filter('limitChar', function () {
    return function (content, length, tail) {
        if (isNaN(length))
            length = 50;
 
        if (tail === undefined)
            tail = "...";
 
        if (content.length <= length || content.length - tail.length <= length) {
            return content;
        }
        else {
            return String(content).substring(0, length-tail.length) + tail;
        }
    };
});

app.run(['$rootScope', '$location', '$window', function ($rootScope, $location, $window) {                
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if (typeof(next.$$route.isAuthRequired) == "undefined"){
            $location.path("/");
        }else{
            if ($window.localStorage.getItem("token") === null) {
                $location.path("/login");
            }else{
            }
        }
    });
}]);

app.config(function($routeProvider, $locationProvider) {

$routeProvider
 
.when('/', {
    isAuthRequired: false,
    templateUrl : 'home.html',
    controller : 'HomeController'
})
 
.when('/post/:postId', {
    isAuthRequired: false,
templateUrl : 'post.html',
controller : 'PostController'
})
 
.when('/login', {
isAuthRequired: false,
templateUrl : 'login.html',
controller : 'LoginController'
})
 
.when('/resetpwd', {
isAuthRequired: false,
templateUrl : 'resetpwd.html',
controller : 'HomeController'
})

.when('/signup', {
isAuthRequired: false,
templateUrl : 'signup.html',
controller : 'LoginController'
})

.when('/profile', {
isAuthRequired: true,
templateUrl : 'profile.html',
controller : 'ProfileController'
})

.when('/profile-update', {
isAuthRequired: true,
templateUrl : 'update.html',
controller : 'ProfileController'
})

.when('/pwd_change', {
isAuthRequired: true,
templateUrl : 'password.html',
controller : 'ProfileController'
})

.when('/billing', {
isAuthRequired: true,
templateUrl : 'billing.html',
controller : 'ProfileController'
})

.when('/user/:uid', {
isAuthRequired: false,
templateUrl : 'user.html',
controller : 'UserController'
})

.when('/logout', {
isAuthRequired: true,
controller : 'LogoutController'
})
 
.otherwise({redirectTo: '/'});
});
