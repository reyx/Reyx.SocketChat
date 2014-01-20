'use strict';

App.filter('slug', function () {
    return function (value) {
        return (value || '').replace(/[^a-z0-9]+/gi, '-').replace(/^-*|-*$/g, '').toLowerCase();
    };
});

