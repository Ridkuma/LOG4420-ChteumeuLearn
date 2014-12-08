chteumeulearn.controller('AsideController',
    function($rootScope,$scope,AsideModel) {
      AsideModel.getCorrectAnswersFromServer(function(){
        $scope.answeredQuestionsTest = $rootScope.answeredQuestionsTest;
      });
      AsideModel.getAnsweredQuestionTestFromServer(function(){
        $scope.countCorrectAnswer = $rootScope.countCorrectAnswer;    
      });

      AsideModel.getTotalCountExams(function(){
        $scope.totalCountExams = $rootScope.totalCountExams;    
      });

      AsideModel.getAverageExams(function(){
        $scope.averageExams = $rootScope.averageExams;    
      });

      
      
        
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
          
          getTotalCountExams : function(callback){
            $http.get('/api/getTotalCountExams').success(function(data, status, headers, config){
                $rootScope.totalCountExams=parseInt(data);
                callback;
                
            });

          },

          getAverageExams : function(callback){
            $http.get('/api/getAverageExams').success(function(data, status, headers, config){
                $rootScope.averageExams=parseInt(data);
                callback;
                
            });
          }
            
        }
    }
);