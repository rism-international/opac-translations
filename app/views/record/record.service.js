app.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      controller: 'MainCtrl',
      templateUrl: '../views/record/index.html'
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
      $location.path('../login');
    }
    else {
      console.log('ALLOW');
      //event.preventDefault();
      //if ( $location.path() === "/"  ) return;
    }
  });
}]);

app.factory('Auth', function(){
  var user;
  return{
    setUser : function(aUser){
      user = aUser;
    },
    isLoggedIn : function(){
      return(user)? user : true;
    }
  }
})

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

