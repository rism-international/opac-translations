app.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      controller: 'MainCtrl',
      templateUrl: '../views/record/index.html'
    });
  $locationProvider.html5Mode(true);
});


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

