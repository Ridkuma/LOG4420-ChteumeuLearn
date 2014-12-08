var chteumeulearn = angular.module('chteumeulearn');

chteumeulearn.controller('QuickTestController',
    function($rootScope,$scope, $http, QuickTestModel) {
        if(typeof($scope.button) === 'undefined'){
          $scope.button = 'Corriger';
        }
        $scope.correct = -1;
        $scope.checkedAnswer = -1;

        QuickTestModel.getCorrectAnswersFromServer();
        QuickTestModel.getAnsweredQuestionTestFromServer();

        $scope.selectedAnswer = "";
        $scope.submit = function(){
          if($scope.button === 'Corriger'){
            QuickTestModel.getCorrectAnswer($scope.randomQuestion.id,function(data){
              $scope.correct = parseInt(data); 
              $scope.checkedAnswer = parseInt($scope.selectedAnswer);
              QuickTestModel.getStatsTest($scope.correct,$scope.checkedAnswer);
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
        $scope.saveTestStats = function(){
          QuickTestModel.saveStats();
        }

        if (typeof($scope.randomQuestion)==='undefined') {
            QuickTestModel.getRandomQuestion(function(data){
                $scope.randomQuestion = data;   
             });
        }
        
    });

chteumeulearn.service('QuickTestModel',
    function($rootScope, $http, $window){ 
        return {
            saveStats : function(){
             var testStats=[];
             testStats.push( $rootScope.countCorrectAnswer);
             testStats.push( $rootScope.answeredQuestionsTest);
             $http.post('/api/postStats/'+ JSON.stringify(testStats));
             $window.location.href = '/dashboard';
             
            },

            getCorrectAnswersFromServer : function(){
              $http.get('/api/getCorrectAnswersTest').success(function(data, status, headers, config){
                $rootScope.countCorrectAnswer=parseInt(data);  
              });
            },

            getAnsweredQuestionTestFromServer : function(){
              $http.get('/api/getAnsweredQuestionTest').success(function(data, status, headers, config){
                $rootScope.answeredQuestionsTest=parseInt(data);
              });

            },

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

            getStatsTest : function(correct,checked){
              if(correct === checked){
                $rootScope.countCorrectAnswer = parseInt($rootScope.countCorrectAnswer)+1;
              }
              $rootScope.answeredQuestionsTest = parseInt($rootScope.answeredQuestionsTest)+1;
              var testStats=[];
              testStats.push( $rootScope.countCorrectAnswer);
              testStats.push( $rootScope.answeredQuestionsTest);
              $http.post('/api/postStats/'+ JSON.stringify(testStats));

            }
        }
    }
);