chteumeulearn.controller('ExamenController',
    function($rootScope, $scope, $http, $window, ExamenModel) {
        if(typeof($scope.button) === 'undefined'){
          $scope.button = 'Corriger';
        }
        $scope.remaining = 100;
        $scope.correct = -1;
        $scope.checkedAnswer = -1;
        $scope.selectedAnswer = "";
        $scope.answeredQuestions = 0;
        $scope.countCorrectAnswer = 0;

        $scope.submit = function(){
          if ($scope.button === 'Terminer') {
            ExamenModel.postExamResults($scope.countCorrectAnswer, $scope.answeredQuestions, function(){});
            $window.location.href = '/results';
          }

          if($scope.button === 'Corriger'){

            $scope.correct = $scope.randomQuestion.correct;
            $scope.checkedAnswer = parseInt($scope.selectedAnswer);
            $scope.button = 'Suivant';

            ExamenModel.getCorrectAnswer($scope.randomQuestion.id,function(data){
              $scope.correct = parseInt(data); 
              $scope.checkedAnswer = parseInt($scope.selectedAnswer);
              if($scope.correct === $scope.checkedAnswer){
                $scope.countCorrectAnswer++;
              }
              $scope.answeredQuestions++;
              $rootScope.answeredQuestions = $scope.answeredQuestions;
              $rootScope.countCorrectAnswer = $scope.countCorrectAnswer;
            });

            if ($scope.remaining == 0) {
              $scope.button = 'Terminer';                
            } else {
              $scope.button = 'Suivant'; 
            }
          } 
          else {
            ExamenModel.getQuestionExam(function(data){
              $scope.correct = -1;
              $scope.checkedAnswer = -1;
              $scope.selectedAnswer = "";
              $scope.button = 'Corriger';
              $scope.randomQuestion = data;
              $scope.remaining = data.remaining - 1;   
            });
          }

        }

        if (typeof($scope.randomQuestion)==='undefined') {
            ExamenModel.getQuestionExam(function(data){
                $scope.randomQuestion = data;
                $scope.remaining = data.remaining - 1;
             });
        }   
    });

chteumeulearn.service('ExamenModel',
    function($rootScope, $http, $window) {
        return {
            getQuestionExam : function(callback) {
                $http.get('/api/getQuestionExam/').success(function(data, status, headers, config){
                    callback(data);
                });
            },

            getCorrectAnswer : function(id,callback) {
                $http.get('/api/getAnswer/'+id).success(function(data, status, headers, config){
                    callback(data);
                });
            },

            postExamResults : function(score, maxScore, callback) {
              var object = {
                score : score,
                maxScore : maxScore
              };
              $http.post('/api/postExamResults/' + JSON.stringify(object)).success(function(data, status, headers, config){
                    callback;
              });
            }
        }
    }
);