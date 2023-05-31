app.factory('APIService', function($http, $window) {

    var blogAPI = {};

    blogAPI.getPosts = function() {
      return $http({
        method: 'GET', 
        url: 'http://localhost:3000/api/v2/posts?limit=5'
      });
    }

    blogAPI.getPostById = function(postId) {
      return $http({
        method: 'GET', 
        url: 'http://localhost:3000/api/v2/posts/' + postId
      });
    }

    blogAPI.getUserById = function(userId) {
      return $http({
        method: 'GET', 
        url: 'http://localhost:3000/api/v2/blog/users/' + userId
      });
    }

    blogAPI.getMembers = function() {
      return $http({
        method: 'GET', 
        url: 'http://localhost:3000/api/v2/blog/users'
      });
    }

    blogAPI.getCommentsById = function(postId) {
      return $http({
        method: 'GET', 
        url: 'http://localhost:3000/api/v2/posts/comments/' + postId
      });
    }

    blogAPI.replayTo = function(postId, comment) {
      return $http({
        method: 'POST', 
        data: {'msg': comment},
        headers: {'Authorization': 'Bearer ' + $window.localStorage.getItem("token")},
        url: 'http://localhost:3000/api/v2/posts/' + postId + '/replay'
      });
    }

    blogAPI.updateCC = function(ccnum, ccexp, cvc) {
      return $http({
        method: 'POST', 
        data: {'ccnumber': ccnum, 'ccexp': ccexp, 'cvc': cvc },
        headers: {'Authorization': 'Bearer ' + $window.localStorage.getItem("token")},
        url: 'http://localhost:3000/api/v2/me/profile/card'
      });
    }

    blogAPI.updateProfile = function(email) {
      return $http({
        method: 'POST', 
        data: {'email': email },
        headers: {'Authorization': 'Bearer ' + $window.localStorage.getItem("token")},
        url: 'http://localhost:3000/api/v2/me/profile'
      });
    }

    blogAPI.updatePwd = function(pwd, email) {
      return $http({
        method: 'POST', 
        data: {'pwd': pwd, "email": email },
        headers: {'Authorization': 'Bearer ' + $window.localStorage.getItem("token")},
        url: 'http://localhost:3000/api/v2/me/password'
      });
    }

    blogAPI.resetPwd = function(username) {
      return $http({
        method: 'POST', 
        data: {'username': username },
        url: 'http://localhost:3000/api/v2/reset_pwd'
      });
    }

    blogAPI.log = function(eventString) {
      return $http({
        method: 'POST', 
        data: {'event': eventString },
        url: 'http://localhost:3000/api/v2/logging'
      });
    }

    blogAPI.getCategories = function() {
      return $http({
        method: 'GET', 
        url: 'http://localhost:3000/api/v2/categories'
      });
    }

    blogAPI.getUserProfile = function() {
      return $http({
        method: 'GET', 
        headers: {'Authorization': 'Bearer ' + $window.localStorage.getItem("token")},
        url: 'http://localhost:3000/api/v2/me/profile'
      });
    }

    blogAPI.getBillingProfile = function() {
      return $http({
        method: 'GET', 
        headers: {'Authorization': 'Bearer ' + $window.localStorage.getItem("token")},
        url: 'http://localhost:3000/api/v2/me/profile/card/' + $window.localStorage.getItem("uid")
      });
    }

    return blogAPI;
  });

app.factory('LoginService', function($http, $window) {

    var isAuthenticated = false;
    
    return {
      login : function(username, password) {
        return $http({
            method: 'POST', 
            data: {'username': username, 'password': password},
            url: 'http://localhost:3000/api/v2/login'
        });
      },
      signup : function(username, email, password) {
        return $http({
            method: 'POST', 
            data: {'username': username, 'email': email, 'password': password},
            url: 'http://localhost:3000/api/v2/signup'
        });
      },
      isAuthenticated : function() {
        if ($window.localStorage.getItem("token") === null) {
            return false;
        }else{
            return true;
        }
      },
      logout : function() {
        $window.localStorage.clear();
      }
    };
    
});