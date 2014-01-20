App.directive('select', function() {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            var optionsCollection = attrs.ngOptions.replace(/.*\sin\s(.*)/g,'$1');
            scope.$watch(optionsCollection, function () {
                angular.element(element).selectpicker('refresh');
            });
            angular.element(element).selectpicker('render');
        }
    };
});
