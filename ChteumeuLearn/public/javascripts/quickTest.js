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
            QuickTestModel.getCorrectAnswer($scope.randomQuestion.id,function(data){
              $scope.correct = parseInt(data); 
              $scope.checkedAnswer = parseInt($scope.selectedAnswer);
              $scope.button = 'Suivant';
             });
            
          }
          else{
            QuickTestModel.getRandomQuestion(function(data){
              $scope.correct = -1;
              $scope.checkedAnswer = -1;
              $scope.selectedAnswer = "";
              $scope.button = 'Corriger';
              $scope.randomQuestion = data;   
             });
          }
        }

        if (typeof($scope.randomQuestion)==='undefined') {
            QuickTestModel.getRandomQuestion(function(data){
                $scope.randomQuestion = data;   
             });
        }
        
    });

chteumeulearn.service('QuickTestModel',
    function($rootScope, $http, $window) {
        return {
            getRandomQuestion : function(callback) {
                $http.get('/api/getRandomQuestion/').success(function(data, status, headers, config){
                    callback(data);
                });
            },
            getCorrectAnswer : function(id,callback) {
                $http.get('/api/getAnswer/'+id).success(function(data, status, headers, config){
                    callback(data);
                });
            }
        }
    }
);