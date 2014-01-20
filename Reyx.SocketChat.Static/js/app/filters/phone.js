'use strict';

App.filter('phone', function () {
    return function (input) {
        if (!input)
            return '';

        var value = input.toString().trim().replace(/^\+/, '');

        switch (value.length) {
            case 8:
                return value.substr(0,4) + '-' + value.substr(4);

            case 9:
                return value.substr(0,5) + '-' + value.substr(5);

            case 10:
                return '(' + value.substr(0,2) + ') ' + value.substr(2,4) + '-' + value.substr(6);

            case 11:
                return '(' + value.substr(0,2) + ') ' + value.substr(2,5) + '-' + value.substr(7);

            default:
                return value;
        }
    };
})