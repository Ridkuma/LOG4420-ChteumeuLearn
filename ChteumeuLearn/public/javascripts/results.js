chteumeulearn.controller('ResultsController',
    function($scope, ResultsModel) {
        ResultsModel.getLastExamPercentage(function(percent) {
          if(percent < 25){
            $scope.resultText =  "Il faut étudier beaucoup plus !";    
          }
          else if(percent >= 25 && percent < 50){
            $scope.resultText =  "Presque à la moyenne, un peu plus d'effort !";    
          }
          else if(percent >= 50 && percent < 75){
            $scope.resultText = "Sur la moyenne, bon travail mais tu peux améliorer !";    
          }
          else if(percent >= 75){
            $scope.resultText =  "Super ! Continue comme ça !";    
          }
          else{
            $scope.resultText =  'percent'
          }
        });
    }
);

chteumeulearn.service('ResultsModel',
    function($rootScope, $http, $window) {
        return {
            getLastExamPercentage : function(callback) {
              $http.get('/api/getLastExamResults/').success(function(data, status, headers, config){
                  var percentage = data.score / data.maxScore * 100.;
                  callback(percentage);
              });
            }
        }
    }
);