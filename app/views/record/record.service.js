app.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      controller: 'MainCtrl',
      templateUrl: '../views/record/index.html'
    })
   .when('/login', {
      controller: 'loginCtrl',
      templateUrl: '../views/login.html'
    })
  ;
  $locationProvider.html5Mode(true);
});

app.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
  $rootScope.$on('$routeChangeStart', function (event) {

    if (!Auth.isLoggedIn()) {
      console.log('DENY');
      event.preventDefault();
      if ( $location.path() === "/login"  ) return;
      $location.path('/login');
    }
    else {
      console.log('ALLOW');
      //event.preventDefault();
      //if ( $location.path() === "/"  ) return;
      //$location.path('../login');
    }
  });
}]);

app.factory('Auth', function() {
  var admin = 'admin';
  var pass = 'pass';
  var isLoggedIn = true;
  return {
    setUser : function(aUser) {
      isLoggedIn = aUser.username === admin && aUser.password === pass;
      return true;
    },
    isLoggedIn : function() {
      return true;
    }
  };
});
/*
app.factory('Auth', function(){
  var user;
  return{
    setUser : function(aUser){
      if (aUser.username === 'aaa'){
        user = aUser;
      }
    },
    isLoggedIn : function(){
      return(user)? user : true;
    }
  }
})
*/
app.factory("Record", function($resource) {
  var resource = $resource("../api/records/:record_id", {record_id: '@record_id'}, {
          query: {method: 'GET', isArray: true, params: {limit: 40} }
  });
  resource.index = function(start, stop){
    return this.query();
  }
  resource.show = function(item){
    return this.get(item);
  }
  resource.update = function(item){
    return this.save(item);
  }
  resource.delete = function(item){
    return this.remove(item);
  }

  return resource;
});

