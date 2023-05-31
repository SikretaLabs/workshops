app.controller('LoginController', function($scope, $location, $window, APIService, LoginService) {
    $scope.posts = [];
    $scope.isTagTwoActive = true;
    $scope.categories = [];
    $scope.users = [];
    $scope.username = "";
    $scope.password = "";
    $scope.msg = "";
    $scope.isError = false;
    $scope.isOK = false;
    $scope.isOKSignup = false;
    $scope.isOKSignupSignup = false;
    $scope.isErrorSignup = false;
    $scope.usernameacc = "";
    $scope.emailacc = "";
    $scope.passwordacc = "";
    $scope.submitSignup = function(){
        var re = /\S+@\S+\.\S+/;
        if($scope.usernameacc == "" || $scope.emailacc == "" || $scope.passwordacc == ""){
            $scope.isOKSignup = false;
            $scope.isErrorSignup = true;
            $scope.msg = "no information provided";
        }else if(re.test($scope.emailacc) == false){
            $scope.isOKSignup = false;
            $scope.isErrorSignup = true;
            $scope.msg = "invalid email provided";
        }else{
            LoginService.signup($scope.usernameacc, $scope.emailacc, $scope.passwordacc).success(function (response) {
                var i = response;
                if(i.message == "ok"){
                    APIService.log("new account has been created");
                    $scope.isOKSignupSignup = true;
                    $scope.isOKSignup = true;
                    $scope.isErrorSignup = false;
                    $scope.msg = "";
                }else{
                    $scope.isOKSignup = false;
                    $scope.isErrorSignup = true;
                    $scope.msg = i.error;
                }
            });
        }
    }
    $scope.submitLogin = function(){
        LoginService.login($scope.username, $scope.password).success(function (response) {
            var i = response;
            if(i.token){
                APIService.log("logged in");
                $window.localStorage.setItem('token', i.token);
                $window.localStorage.setItem('uid', i.uid);
                $scope.isOK = true;
                $scope.isError = false;
                $scope.msg = "";
                $location.path('/profile');
            }else{
                APIService.log("logged failed");
                $scope.msg = i.error;
                $scope.isError = true;
            }
        });
    }

    APIService.getCategories().success(function (response) {
        $scope.categories = response;
    });
    APIService.getPosts().success(function (response) {
        $scope.posts = response;
    });
    APIService.getMembers().success(function (response) {
        $scope.users = response;
    });
});

app.controller('HomeController', function($scope, APIService, LoginService) {
    $scope.posts = [];
    $scope.categories = [];
    $scope.users = [];
    $scope.uni = "";

    APIService.getCategories().success(function (response) {
        $scope.categories = response;
    });
    APIService.getPosts().success(function (response) {
        $scope.posts = response;
    });
    APIService.getMembers().success(function (response) {
        $scope.users = response;
    });
    
    $scope.resetPwd = function(){
        APIService.resetPwd($scope.uni).success(function (response) {
            var res = response;
            if(res.message){
                $scope.isOK = true;
                $scope.isError = false;
                $scope.msg = "";
            }else{
                $scope.isOK = false;
                $scope.isError = true;
                $scope.msg = res.error;
            }
        });
    }
});

app.controller('ProfileController', function($scope, $window, $location, APIService, LoginService) {
    $scope.posts = [];
    $scope.categories = [];
    $scope.users = [];
    $scope.profile = [];
    $scope.billing = [];
    $scope.ccnum = "";
    $scope.exp = "";
    $scope.uni = "";
    $scope.cvc = "";
    $scope.uname = "";
    $scope.uemail = "";
    $scope.subs = "";
    $scope.level = "";
    $scope.npwd = "";
    $scope.logout = function(){
        LoginService.logout();
        $location.path('/login');
    }
    $scope.pwd = function(){
        $location.path('/pwd_change');
    }
    $scope.up = function(){
        $location.path('/profile-update');
    }
    $scope.back = function(){
        $location.path('/profile');
    }
    $scope.bill = function(){
        $location.path('/billing');
    }
    $scope.updateBill = function(){
        APIService.updateCC($scope.ccnum, $scope.exp, $scope.cvc).success(function (response) {
            var res = response;
            if(res.message){
                APIService.log("billing profile updated");
                $scope.isOK = true;
                $scope.isError = false;
                $scope.msg = "";
            }else{
                $scope.isOK = false;
                $scope.isError = true;
                $scope.msg = res.error;
            }
        });
    }

    $scope.profileup = function(){
        APIService.updateProfile($scope.uemail).success(function (response) {
            var res = response;
            if(res.message){
                APIService.log("user profile updated");
                $scope.isOK = true;
                $scope.isError = false;
                $scope.msg = "";
            }else{
                $scope.isOK = false;
                $scope.isError = true;
                $scope.msg = res.error;
            }
        });
    }

    $scope.updatedPwd = function(){
        APIService.updatePwd($scope.npwd, $scope.uemail).success(function (response) {
            var res = response;
            if(res.message){
                APIService.log("user password updated");
                $scope.isOK = true;
                $scope.isError = false;
                $scope.msg = "";
            }else{
                $scope.isOK = false;
                $scope.isError = true;
                $scope.msg = res.error;
            }
        });
    }

    APIService.getUserProfile().success(function (response) {
            $scope.profile = response;
            $scope.subs = response.subscribers;
            $scope.uname = response.username;
            $scope.uemail = response.email;
            $scope.level = response.level;
    }).error(function (data, status, headers, config) {
        // clear user session if failed
        $window.localStorage.clear();
        location.reload();
     });

    APIService.getBillingProfile().success(function (response) {
        $scope.cvc = response.cvc;
        $scope.exp = response.exp;
        $scope.ccnum = response.ccnumber;
    }).error(function (data, status, headers, config) {
        // clear user session if failed
        $window.localStorage.clear();
        location.reload();
     });

    APIService.getCategories().success(function (response) {
        $scope.categories = response;
    });
    APIService.getPosts().success(function (response) {
        $scope.posts = response;
    });
    APIService.getMembers().success(function (response) {
        $scope.users = response;
    });
});

app.controller('SignupController', function($scope, APIService, LoginService) {
    $scope.posts = [];
    $scope.categories = [];
    $scope.users = [];

    APIService.getCategories().success(function (response) {
        $scope.categories = response;
    });
    APIService.getPosts().success(function (response) {
        $scope.posts = response;
    });
    APIService.getMembers().success(function (response) {
        $scope.users = response;
    });
});
     
app.controller('PostController', function($scope, APIService, LoginService, $routeParams) {
    $scope.posts = [];
    $scope.users = [];
    $scope.categories = [];
    $scope.comments = [];
    $scope.name = "";
    $scope.isPublished = false;
    $scope.isLoggedIn = false;

    APIService.getUserProfile().success(function (response) {
        $scope.isLoggedIn = true;
    }).error(function (data, status, headers, config) {
        $scope.isLoggedIn = false;
    });

    $scope.addComment = function(){
        APIService.replayTo($routeParams.postId, $scope.msg).success(function (response) {
            var res = response;
            if(res.message){
                $scope.isPublished = true;
            }else{
                $scope.isPublished = false;
            }
        });
    }
    APIService.getCategories().success(function (response) {
        $scope.categories = response;
    });
    APIService.getCommentsById($routeParams.postId).success(function (response) {
        $scope.comments = response;
    });
    APIService.getPosts().success(function (response) {
        $scope.posts = response;
    });
    APIService.getPostById($routeParams.postId).success(function (response) {
        $scope.content = response;
    });
    APIService.getMembers().success(function (response) {
        $scope.users = response;
    });
});
     
app.controller('UserController', function($scope, APIService, $routeParams) {
    $scope.posts = [];
    $scope.users = [];
    $scope.categories = [];
    $scope.comments = [];
    $scope.username = "";
    $scope.subs = "";
    $scope.level = "";
    APIService.getCategories().success(function (response) {
        $scope.categories = response;
    });
    APIService.getUserById($routeParams.uid).success(function (response) {
        $scope.username = response.username;
        $scope.level = response.level;
        $scope.subs = response.subscribers;
    });
    APIService.getMembers().success(function (response) {
        $scope.users = response;
    });
});
     
app.controller('PageController', function($scope) {
    $scope.categories = [];
    APIService.getCategories().success(function (response) {
        $scope.categories = response;
    });
    $scope.message = 'Hello from ThirdController';
});