var chteumeulearn = angular.module('chteumeulearn', []);

chteumeulearn.controller('DashboardController',
	function($scope, $http, DashboardModel) {

		$scope.selected = [];

		$scope.onDomainChanged = function() {
			console.log($scope.selected);
			$http.post('/api/postDomains/:' + JSON.stringify($scope.selected) );
		};
	});

chteumeulearn.service('DashboardModel',
	function() {
		
	}
);