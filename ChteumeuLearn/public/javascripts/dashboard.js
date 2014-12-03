var chteumeulearn = angular.module('chteumeulearn', []);

chteumeulearn.controller('DashboardController',
	function($scope, $http, DashboardModel) {

		$scope.selected = [];

		$scope.onDomainChanged = function() {
			$http.get('/api/postDomains/' + JSON.stringify($scope.selected)).success(function(data, status, headers, config){
				$scope.maxQuestionNumber = data;	
			});
			
		};
	});

chteumeulearn.service('DashboardModel',
	function() {
		
	}
);