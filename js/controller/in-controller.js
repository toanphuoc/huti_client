var hutiController = angular.module('hutiController', []);

hutiController.controller('InCtrl', ['$scope', function($scope){
	
}]);

hutiController.controller('PageCommonCtrl', ['$scope', function($scope){
	
}]);

hutiController.controller('LoginCtrl', ['$scope', '$location', function($scope, $location){
	$scope.register = function(){
		$('#modal_login').modal('hide')
		$location.path('/dang-ky')
	}
}]);