(function() {
    var personalViewFactory = function($http) {
    
        var factory = {};
        
//        factory.getCustomers = function() {
//            return $http.get('relationshiptracker.json');
//        };
        factory.getCustomers = function() {
            return  $http({
                method: 'GET',
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/GetByTitle('clientrelationships')/items?                $select=ID,Title,primaryaccountability,segment,currentstrength,lastmeetingdate,nextmeetingdate",
                dataType: "json",
                headers: {
                    Accept: "application/json;odata=verbose"
                }
            });
        };
        
        factory.getCustomer = function(customerId) {
            return $http.get('/customers/' + customerId);
        };
        
        return factory;
    };
    
    personalViewFactory.$inject = ['$http'];
        
    angular.module('customersApp').factory('customersFactory', 
                                           personalViewFactory);
                                           
}());