App.directive('slider', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            angular.element(element).slider({ tooltip:'hide' }).on('slide', function(e) {
                scope.$apply(function() {
                    var range = scope.$eval(attrs.range);
                    range.min = e.value[0];
                    range.max = e.value[1];
                });
            });
        }
    };
});
