app.controller("<%= prompts.name %>sCtrl", ["$scope", "<%= prompts.name %>s", function ($scope, <%= prompts.name %>s) {

  $scope.<%= prompts.name.toLowerCase() %> = <%= prompts.name %>s.all();
  $scope.selected<%= prompts.name %> = undefined;

  $scope.select<%= prompts.name %> = function (item) {
    $scope.selected<%= prompts.name %> =  item;
  };

}]);