App.directive('img', function ($timeout) {
    return {
        restrict: 'E',
        link: function (scope, element) {
            angular.element(element)
                .addClass('fade')
                .imagesLoaded()
                .progress(function (instance, image) {
                    angular.element(image.img).addClass('in');
                });

        }
    };
});