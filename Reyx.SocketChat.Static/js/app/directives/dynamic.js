App.directive('dynamic', function ($compile, $parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            if ((scope.widget.contents && scope.widget.contents.length) ||
                (scope.widget.widgets && scope.widget.widgets.length))
                element.append($compile('<' + scope.$eval(attrs.dynamic) + ' />')(scope));
        }
    };
});