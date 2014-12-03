var chteumeulearn = angular.module('chteumeulearn', []);

chteumeulearn.controller('QuickTestController',
    function($scope, $http, QuickTestModel) {

        $scope.correct = -1;
        $scope.checkedAnswer = -1;

        if (!$scope.randomQuestion) {
            $http.get('/api/getRandomQuestion/').success(function(data, status, headers, config){
                $scope.randomQuestion = data;    
            });
        }
    });

chteumeulearn.service('QuickTestModel',
    function() {
        
    }
);