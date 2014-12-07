chteumeulearn.controller('ExamenController',
    function($scope, $http, ExamenModel) {
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
            
            ExamenModel.getQuestionExam(function(){
              
              $scope.randomQuestion = $rootScope.randomQuestion;   
             });
          }
        }

        if (typeof($scope.randomQuestion)==='undefined') {
            ExamenModel.getQuestionExam(function(){
                $scope.randomQuestion = $rootScope.randomQuestion;   
             });
        }
        
    });

chteumeulearn.service('ExamenModel',
    function($rootScope, $http, $window) {
        return {
            getQuestionExam : function(callback) {
                $http.get('/api/getQuestionExam/').success(function(data, status, headers, config){
                    $rootScope.randomQuestion = data;
                    callback;
                });
            }
        }
    }
);