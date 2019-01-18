MicroMacroApp.component('query', {
    templateUrl : 'html/query.html',
    bindings : {
        query: '<'
    },
    controller : function($scope, Tables, Queries) {
        Tables.list().then(function(tables) {
            $scope.tables = tables;
        });

        $scope.execute = function () {
            Queries.execute($scope.$ctrl.query).then(function(data){
                $scope.results = data;
            });
        }
    }
});
