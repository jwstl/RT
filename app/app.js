(function() {

    var app = angular.module('customersApp', ['ngRoute']);

    app.config(function($routeProvider) {
        $routeProvider
               
                .when('/grid', {
                    controller: 'GridController',
                    templateUrl: 'app/views/grid.html'
                })
                .when('/upMeetings', {
                    controller: 'UpMeetingsController',
                    templateUrl: 'app/views/upMeetings.html'
                })
                .when('/personalView', {
                    controller: 'personalViewController',
                    templateUrl: 'app/views/personalView.html'
                }).
                        
                otherwise({
                    redirectTo: '/personalView'
                });

    });

}());