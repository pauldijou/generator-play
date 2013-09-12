var app = angular.module("<% global.app.name %>", ["ngRoute", "ngAnimate", "ngResource"])
  .constant("Config", {});
  .config(["$locationProvider", "$routeProvider", function ($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true).hashPrefix("!");

    $routeProvider
      .when("/", {
        templateUrl: "/views/index"
      })
      .otherwise({
        redirectTo: "/"
      });
  }]);