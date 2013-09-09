app.controller("<%= name %>Ctrl", ["$scope", "<%= name %>s", function ($scope, <%= name %>s) {

  $scope.<%= name.toLowerCase() %> = <%= name %>s.all();
  $scope.selected<%= name %> = undefined;

  $scope.select<%= name %> = function (item) {
    $scope.selected<%= name %> =  item;
  };

}]);