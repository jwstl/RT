(function() {
    var upMeetingsFactory = function($http) {

        var factory = {};

        factory.getCustomers = function() {
           return $http.get('relationshiptracker.json');
        };

       
        return factory;
    };

    upMeetingsFactory.$inject = ['$http'];

    angular.module('customersApp').factory('upMeetingsFactory',
            upMeetingsFactory);

}());