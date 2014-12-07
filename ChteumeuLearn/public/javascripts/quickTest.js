var chteumeulearn = angular.module('chteumeulearn');

chteumeulearn.controller('QuickTestController',
    function($rootScope,$scope, $http, QuickTestModel) {
        if(typeof($scope.button) === 'undefined'){
          $scope.button = 'Corriger';
        }
        $scope.correct = -1;
        $scope.checkedAnswer = -1;
        $scope.answeredQuestionsTest = 0;
        $scope.countCorrectAnswer = 0;
        $scope.selectedAnswer = "";
        $scope.submit = function(){
          if($scope.button === 'Corriger'){
            QuickTestModel.getCorrectAnswer($scope.randomQuestion.id,function(data){
              $scope.correct = parseInt(data); 
              $scope.checkedAnswer = parseInt($scope.selectedAnswer);
              if($scope.correct === $scope.checkedAnswer){
                $scope.countCorrectAnswer = parseInt($scope.countCorrectAnswer)+1;
              }
              $scope.answeredQuestionsTest = parseInt($scope.answeredQuestionsTest)+1;
              QuickTestModel.getStatsTest($scope.answeredQuestionsTest,$scope.countCorrectAnswer);
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

        $scope.getCorrectAnswers = function(){
          return $rootScope.countCorrectAnswer;
        }

        $scope.getAnsweredQuestions = function(){
          return $rootScope.answeredQuestionsTest;
        }

        if (typeof($scope.randomQuestion)==='undefined') {
            QuickTestModel.getRandomQuestion(function(data){
                $scope.randomQuestion = data;   
             });
        }
        
    });

chteumeulearn.service('QuickTestModel',
    function($rootScope, $http, $window){
    $rootScope.answeredQuestionsTest=0;
    $rootScope.countCorrectAnswer=0; 
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
            },
            getStatsTest : function(answeredQuestionsTest,countCorrectAnswer){
              $rootScope.answeredQuestionsTest = answeredQuestionsTest;
              $rootScope.countCorrectAnswer=countCorrectAnswer; 


            }
        }
    }
);