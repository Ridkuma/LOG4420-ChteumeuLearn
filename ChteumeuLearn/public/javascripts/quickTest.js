var chteumeulearn = angular.module('chteumeulearn');

chteumeulearn.controller('QuickTestController',
    function($scope, $http, QuickTestModel) {
        if(typeof($scope.button) === 'undefined'){
          $scope.button = 'Corriger';
        }
        $scope.correct = -1;
        $scope.checkedAnswer = -1;

        $scope.selectedAnswer = "";
        $scope.submit = function(){
          if($scope.button === 'Corriger'){
            $scope.correct = $scope.randomQuestion.correct;
            $scope.checkedAnswer = parseInt($scope.selectedAnswer);
            $scope.button = 'Suivant';
          }
          else{
            $scope.correct = -1;
            $scope.checkedAnswer = -1;
            $scope.selectedAnswer = "";
            $scope.button = 'Corriger';
            
            QuickTestModel.getRandomQuestion(function(){
              
              $scope.randomQuestion = $rootScope.randomQuestion;   
             });
          }
        }

        if (typeof($scope.randomQuestion)==='undefined') {
            QuickTestModel.getRandomQuestion(function(){
                $scope.randomQuestion = $rootScope.randomQuestion;   
             });
        }
        
    });

chteumeulearn.service('QuickTestModel',
    function($rootScope, $http, $window) {
        return {
            getRandomQuestion : function(callback) {
                $http.get('/api/getRandomQuestion/').success(function(data, status, headers, config){
                    $rootScope.randomQuestion = data;
                    callback;
                });
            }
        }
    }
);