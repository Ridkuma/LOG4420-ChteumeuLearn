chteumeulearn.controller('ResultsController',
    function($scope, ResultsModel) {
      $scope.getResultText = function () {
        ResultsModel.getLastExamPercentage(function(percent) {
          if(percent < 25){
            return "Il faut étudier beaucoup plus !";    
          }
          if(percent >= 25 && percent < 50){
            return "Presque à la moyenne, un peu plus d'effort !";    
          }
          if(percent >= 50 && percent < 75){
            return "Sur la moyenne, bon travail mais tu peux améliorer !";    
          }
          if(percent >= 75){
            return "Super ! Continue comme ça !";    
          }
        });
      });
    });

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