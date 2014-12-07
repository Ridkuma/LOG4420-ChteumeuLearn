var chteumeulearn = angular.module('chteumeulearn', []);

chteumeulearn.controller('DashboardController',
    function($rootScope, $scope, $http, DashboardModel) {
        $scope.selected = [];

        $scope.onDomainChanged = function() {
             DashboardModel.getMaxQuestionNumber($scope.selected,function(){
                $scope.maxQuestionNumber = $rootScope.maxQuestionNumber;   
             });
             
        };
    });

chteumeulearn.service('DashboardModel',
    function($rootScope, $http, $window) {
        return {
            getMaxQuestionNumber : function(selected,callback) {
                $http.get('/api/postDomains/' + JSON.stringify(selected)).success(function(data, status, headers, config){
                    $rootScope.maxQuestionNumber = data;
                    callback;
                });
            }
        }
    }
);