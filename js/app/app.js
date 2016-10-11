var hutiApp = angular.module('hutiApp', [
  	'ngRoute',
  	'hutiController', 
  	'hutiService'
]);

hutiApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/', {
        templateUrl: 'patials/in-hinh.html',
        controller: 'InCtrl'
    }).
    when('/gio-hang', {
    	templateUrl: 'patials/shopping-card.html',
    	controller: 'ShoppingCardCtrl'
    }).
    when('/thanh-toan', {
        templateUrl: 'patials/payment.html',
        controller: 'PaymentCtrl'
    }).
    when('/thanh-toan-thanh-cong', {
        templateUrl: 'patials/payment-success.html',
        controller: 'PaymentSuccessCtrl'
    }).
    when('/dang-ky', {
        templateUrl: 'patials/register.html',
        controller: 'RegisterCtrl'
    }).
    otherwise({
        redirectTo: '/'
    });
}]);