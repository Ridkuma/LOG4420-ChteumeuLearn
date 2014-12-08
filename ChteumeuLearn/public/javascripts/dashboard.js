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
        };

        $scope.updateDetails = function() {
            var table = $("#details #detailsTable");
            var results = JSON.parse(localStorage.results);
            for (var i =0; i<results.length; i++) {
                var $row = $("<tr/>").appendTo(table);
                $row.append("<td>" + (i + 1) + "</td>");
                $row.append("<td>" + results[i] + "</td>");
                var domains = JSON.parse(localStorage.domains);
                $row.append("<td>" + domains[i] + "</td>");
            };
        };
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

            getAllExamsInfo : function(callback) {
                http.get('/api/getAllExamsInfo/' + JSON.stringify(selected)).success(function(data, status, headers, config){
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