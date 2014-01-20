'use strict';

App.factory('appLoading', function ($rootScope) {
    var timer;

    return {
        loading: function () {
            clearTimeout(timer);
            $rootScope.status = 'loading';
            if (!$rootScope.$$phase)
                $rootScope.$apply();
        },
        ready: function (delay) {
            function ready() {
                $rootScope.status = 'ready';
                if (!$rootScope.$$phase)
                    $rootScope.$apply();
            }

            clearTimeout(timer);
            if (delay)
                timer = setTimeout(ready, delay);
            else
                ready(); 
        }
    };
});