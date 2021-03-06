var app = angular.module('records', ['ngAnimate', 'ngTouch', 'ngResource', 'ngRoute', 'ui.grid', 'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.rowEdit']);

  
app.controller('loginCtrl', [ '$scope', 'Auth', function ($scope, Auth) {
  //submit
  $scope.login = function () {
    //      // Ask to the server, do your job and THEN set the user
    var user = {username: username.value, password: password.value};
    Auth.setUser(user); //Update the state of the user in the app
  };
}]);

app.controller('MainCtrl', ['$scope', 'Auth', '$http', '$route', '$resource', 'Record', 'uiGridConstants', function($scope, Auth, $http, $route, $resource, Record, uiGridConstants) {
  var paginationOptions = {
    pageNumber: 1,
    pageSize: 25,
    sort: null
  };

  $scope.$watch(Auth.isLoggedIn, function (value, oldValue) {
    if(!value && oldValue) {
      console.log("Disconnect");
      $location.path('../login');
    }
    if(value) {
            console.log("Connect");
      //    
    }
  }, true);

  $scope.gridOptions = {
    //totalItems: 100,
    enableFiltering: true,
    enableSorting: true,
    //useExternalPagination: true,
    paginationPageSizes: [25, 50, 75],
    paginationPageSize: 25,
    columnDefs: [
      //{ field: 'year',enableCellEdit: false, width: '10%', maxWidth: 50, minWidth: 50,},
      { field: 'record_id',  type: 'number', enableCellEdit: false, width: '5%',  sort: { direction: 'asc', priority: 0  } },
      { field: 'code', enableCellEdit: false},
      { field: 'english', enableCellEdit: true},
      { field: 'german', enableCellEdit: true},
      { field: 'french', enableCellEdit: true},
      { field: 'italian', enableCellEdit: true},
      { field: 'spanish', enableCellEdit: true},
      { field: 'updated_at', enableCellEdit: false, type: 'date', width: '10%' },
      //{  name: 'Insert', cellTemplate: '<button class="btn btn-success btn-sm" ng-click="grid.appScope.addNewItem()" ng-show="grid.appScope.isLast(row)">Add row</button>', width: '5%'  },
      //{name:' ',cellTemplate:'<div><button ng-click="deleteRecord()">Delete</button></div>'}
    ],
    enableColumnResizing: true,
    data: Record.index()};

  $scope.isLast = function(row) {
      return row.uid === $scope.gridApi.grid.renderContainers.body.visibleRowCache[$scope.gridApi.grid.renderContainers.body.visibleRowCache.length-1].uid;
  }

  $scope.gridOptions.onRegisterApi = function(gridApi) {
    $scope.gridApi = gridApi;
    gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
      rowEntity.updated_at = new Date().toISOString();
      Record.update(rowEntity);
    });
  }
  $scope.gridRowClick = row => {
    record = row.entity;
    $scope.record = record;
  };

  $scope.addNewItem = function() {
    $http({ method: "post", url: "/api/record/new", })
      .then(function(res){ $route.reload(); })
  };

}]);

