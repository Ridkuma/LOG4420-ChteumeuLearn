var chteumeulearn = angular.module('chteumeulearn', []);

chteumeulearn.controller('DashboardController',
	function($scope, $http, DashboardModel) {

		$scope.selected = [];

		$scope.onDomainChanged = function() {
			console.log($scope.selected);
			$http.get('/api/postDomains/' + JSON.stringify($scope.selected)).success(function(data, status, headers, config){
				console.log(headers);
				console.log(data);
				$scope.maxQuestionNumber = data;	
			});
			
		};
	});

chteumeulearn.service('DashboardModel',
	function() {
		
	}
);