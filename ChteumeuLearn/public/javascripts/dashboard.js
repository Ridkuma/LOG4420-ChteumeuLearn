var chteumeulearn = angular.module('chteumeulearn', []);

chteumeulearn.controller('DashboardController',
    function($rootScope, $scope, $http, $window, DashboardModel) {
        $scope.selected = [];
        $scope.selectedQuestionCount = 0;

        $scope.onDomainChanged = function() {
             DashboardModel.getMaxQuestionCount($scope.selected,function(){
                $scope.maxQuestionCount = $rootScope.maxQuestionCount;
             });
            $("#questionCount").attr("disabled", false);
            $("#finalTestButton").attr("disabled", true);
            $scope.selectedQuestionCount = 0;
        };

        $scope.onQuestionCountChanged = function () {
            $("#finalTestButton").attr("disabled", false);
            $scope.selectedQuestionCount = $("#questionCount").val();
        };

        $scope.submitExam = function() {
            DashboardModel.postExamChoices($scope.selected, $scope.selectedQuestionCount, function(){
            });
            $window.location.href = '/questionExam';
        }
    });

chteumeulearn.service('DashboardModel',
    function($rootScope, $http, $window) {
        return {

            getMaxQuestionCount : function(selected,callback) {
                $http.get('/api/postDomains/' + JSON.stringify(selected)).success(function(data, status, headers, config){
                    $rootScope.maxQuestionCount = data;
                    callback;
                });
            },

            postExamChoices : function (selected, questionCount, callback) {
                var object = {domains : selected, count : questionCount};
                $http.post('/api/postExamChoices/' + JSON.stringify(object)).success(function(data, status, headers, config){
                    callback;
                });
            }
        }
    }
);