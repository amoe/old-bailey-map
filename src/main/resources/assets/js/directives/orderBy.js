MicroMacroApp.directive("orderBy", function () {
    return {
        restrict: 'E',
        templateUrl : 'html/orderBy.html',
        scope : {
            orderBy : '=ngModel',
            keys : '<',
            forId : '<?'
        },
        link : function(scope, element, attrs) {

            scope.orderBy.clauses = scope.orderBy.clauses || [];

//            scope.$watchCollection("keys", function(newVal, oldVal) {
//
//                scope.keyList = [];
//                angular.forEach(newVal, (item, key) => {
//                    var listItem = angular.copy(item);
//                    listItem.id = listItem.key();
//                    scope.keyList.push(listItem);
//                });
//            });

        }
    }
});
