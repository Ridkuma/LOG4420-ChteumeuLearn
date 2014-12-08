chteumeulearn.controller('AsideController',
    function($rootScope,$scope,AsideModel) {
      AsideModel.getCorrectAnswersFromServer(function(){
        $scope.answeredQuestionsTest = $rootScope.answeredQuestionsTest;
      });
      AsideModel.getAnsweredQuestionTestFromServer(function(){
        $scope.countCorrectAnswer = $rootScope.countCorrectAnswer;    
      });

      function getCorrectAnswers(){
        console.log($rootScope.countCorrectAnswer);
          
      }

      function getAnsweredQuestions(){
        console.log($rootScope.answeredQuestionsTest);
          
      }
      
        
    });

chteumeulearn.service('AsideModel',
    function($http,$rootScope){ 
        return {
          getCorrectAnswersFromServer : function(callback){
              $http.get('/api/getCorrectAnswersTest').success(function(data, status, headers, config){
                $rootScope.countCorrectAnswer=parseInt(data); 
                callback; 
                
              });
            },

          getAnsweredQuestionTestFromServer : function(callback){
              $http.get('/api/getAnsweredQuestionTest').success(function(data, status, headers, config){
                $rootScope.answeredQuestionsTest=parseInt(data);
                callback;
                
              });

            },
            
        }
    }
);