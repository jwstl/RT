(function() {

    var personalViewController = function($scope, $log, customersFactory, appSettings) {
        $scope.sortBy = 'name';
        $scope.daysFromLastUpdate = null;
        $scope.reverse = false;
        $scope.customers = [];
        $scope.appSettings = appSettings;
        $scope.primaryAccountability = {};
        $scope.selectedName = "";
        $scope.name = "";
        $scope.newPrimaryAccountablility = function() {
            return {
                count: 0,
                ownernextmeetingCount: 0,
                lastMeetingCount: 0,
                segments: {'Upstream': 0, 'Trading': 0, 'Technology': 0, 'Downstream': 0, 'ITSO': 0, 'Consumer ES': 0}
            };
        };

        $scope.calculateFromLastUpdate = function(row) {

            var modifiedDate = moment(row["Modified"]);
            $scope.daysFromLastUpdate = Math.abs(modifiedDate.diff(moment(), 'days'))


        }
        $scope.setPrimaryAccountability = function() {
            angular.forEach($scope.data, function(object) {

                if (typeof $scope.primaryAccountability[object.primaryaccountability] != 'undefined') {
                    $scope.primaryAccountability[object.primaryaccountability].count++;
                } else {
                    $scope.primaryAccountability[object.primaryaccountability] = $scope.newPrimaryAccountablility();
                    $scope.primaryAccountability[object.primaryaccountability].count++;
                }

                //Check for ownerNextMeetingCount
                if (typeof $scope.primaryAccountability[object.ownernextmeeting] != 'undefined') {
                    $scope.primaryAccountability[object.ownernextmeeting].ownernextmeetingCount++;
                } else {
                    $scope.primaryAccountability[object.ownernextmeeting] = $scope.newPrimaryAccountablility();
                    $scope.primaryAccountability[object.ownernextmeeting].ownernextmeetingCount++;
                }


                //Update the last meeting date counter for each name. 
                if (object.lastmeetingdate) {
                    $scope.primaryAccountability[object.primaryaccountability].lastMeetingCount++;
                }
                //  $scope.primaryAccountability[object.primaryaccountability]['segments'][object.segment]++;
            });

        };

        $scope.processSummaryInfo = function(name) {
            $scope.summary = {};
            $scope.selectedSegment = null;
            $scope.selectedSegmentLate = null;
            $scope.nextOwnerShips = [];
            $scope.ownernextmeetingCount = 0;
            $scope.upStreamAct = 0;
            $scope.downStreamAct = 0;
            $scope.ITSOAct = 0;
            $scope.tradingACt = 0;
            $scope.PTAct = 0;
            $scope.technologyAct = 0;
            $scope.ConsumerAct = 0;
            $scope.mainPerfomanceScore = 0;
            angular.forEach($scope.data, function(object) {
                if (typeof object['nextmeetingowner'] != 'undefined' && object['nextmeetingowner'] == name) {

                    $scope.nextOwnerShips.push(object);
                    $scope.ownernextmeetingCount++;
                }
                if (object['primaryaccountability'] == name) {
                    var segment = object.Segment;
                    switch (object.Segment) {
                        case "Downstream":
                            segment = "DS";
                            break;
                        case "Trading and Supply":
                            segment = "P&T";
                            break;
                        case "Global Functions":
                            segment = "GS & ES";
                            break;
                        default:
                            break;
                    }

                    if ($scope.summary[segment] == undefined) {
                        $scope.summary[segment] = {
                            totalRelationships: 0,
                            totalOwnedRelationships: 0,
                            totalLateRelationships: 0,
                            totalNewRelationships: 0,
                            totalMissedRelationships: 0,
                            newRelationships: [],
                            lateRelationships: [],
                            missedTargets: []
                        };
                    }

                    var modifiedDate = moment(object["Modified"]),
                            createdDate = moment(object["CreatedDate"]);

                    $scope.summary[segment].totalRelationships++;

                    if (object["Last Meeting Date"].length && Math.abs(modifiedDate.diff(moment(), 'days')) < 31) {
                        $scope.summary[segment].totalOwnedRelationships++;
                    }


                    if (Math.abs(modifiedDate.diff(moment(), 'days')) > 30) {
                        $scope.summary[segment].totalLateRelationships++;
                        $scope.summary[segment].lateRelationships.push(object);
                    }

                    if (object["nextmeetingowner"].length && Math.abs(createdDate.diff(moment(), 'days')) < 31) {
                        $scope.summary[segment].totalNewRelationships++;
                        $scope.summary[segment].newRelationships.push(object);
                    }
                    if (!(object["Last Meeting Date"].length) && Math.abs(createdDate.diff(moment(), 'days')) > 14) {

                        object['tier'] = object["nextmeetingowner"];
                    }


                    if (Math.abs(modifiedDate.diff(moment(), 'days')) > 30 && object["nextmeetingowner"].length) {
                        $scope.summary[segment].totalMissedRelationships++;
                    }


                    if (object["Last Meeting Date"].length && Math.abs(modifiedDate.diff(moment(), 'days')) < 31 && object["Segment"] == 'Upstream') {
                        $scope.upStreamAct++;
                    }
                    if (object["Last Meeting Date"].length && Math.abs(modifiedDate.diff(moment(), 'days')) < 31 && object["Segment"] == 'Downstream') {
                        $scope.downStreamAct++;
                    }
                    if (object["Last Meeting Date"].length && Math.abs(modifiedDate.diff(moment(), 'days')) < 31 && object["Segment"] == 'ITSO') {
                        $scope.ITSOAct++;
                    }
                    if (object["Last Meeting Date"].length && Math.abs(modifiedDate.diff(moment(), 'days')) < 31 && object["Segment"] == 'Trading') {
                        $scope.tradingACt++;
                    }
                    if (object["Last Meeting Date"].length && Math.abs(modifiedDate.diff(moment(), 'days')) < 31 && object["Segment"] == 'P&T') {
                        $scope.PTAct++;
                    }
                    if (object["Last Meeting Date"].length && Math.abs(modifiedDate.diff(moment(), 'days')) < 31 && object["Segment"] == 'Technology') {
                        $scope.technologyAct++;
                    }
                    if (object["Last Meeting Date"].length && Math.abs(modifiedDate.diff(moment(), 'days')) < 31 && object["Segment"] == 'Global Functions and ES') {
                        $scope.ConsumerAct++;
                    }



                }

            });
            $scope.mainPerfomanceScore = ($scope.upStreamAct + $scope.downStreamAct + $scope.ITSOAct + $scope.tradingACt + $scope.PTAct + $scope.technologyAct + $scope.ConsumerAct) / 7;
            angular.forEach($scope.segments, function(object) {
                if ($scope.summary[object] == undefined) {
                    $scope.summary[object] = {
                        totalRelationships: 0,
                        totalOwnedRelationships: 0,
                        totalLateRelationships: 0,
                        totalNewRelationships: 0,
                        totalMissedRelationships: 0,
                        performanceScore: 0,
                        performanceNewScore: 0,
                        newRelationships: []
                    };
                } else {
                    $scope.summary[object].performanceScore =
                            $scope.summary[object].totalOwnedRelationships == 0 ? 0 : ($scope.summary[object].totalOwnedRelationships * 8) / 100;

                    $scope.summary[object].performanceNewScore =
                            $scope.summary[object].totalNewRelationships == 0 ? 0 : ($scope.summary[object].totalNewRelationships * 8) / 100;
                }

            });

        };

        $scope.showSegmentDetail = function(item) {
            $scope.selectedSegment = item;
        };
        $scope.showLateSegmentDetail = function(item) {
            $scope.selectedSegmentLate = item;
        };


        $scope.segments = ["Trading", "P&T", "Upstream", "ITSO", "DS", "GS & ES"];
        function init() {
            customersFactory.getCustomers()
                    .success(function(customers) {
                        $scope.customers = customers;
                        $scope.data = customers;
                        $scope.setPrimaryAccountability();
                        //   $scope.processSummaryInfo();
                    })
                    .error(function(data, status, headers, config) {
                        $log.log(data.error + ' ' + status);
                    });
        }

        init();
        $scope.doSort = function(propName) {
            $scope.sortBy = propName;
            $scope.reverse = !$scope.reverse;
        };

    };



    personalViewController.$inject = ['$scope', '$log', 'customersFactory',
        'appSettings'];

    angular.module('customersApp')
            .controller('personalViewController', personalViewController);

    var UpMeetingsController = function($scope, $log, customersFactory, appSettings) {
        $scope.sortBy = 'name';
        $scope.reverse = false;
        $scope.customers = [];
        $scope.appSettings = appSettings;

        function init() {
            customersFactory.getCustomers()
                    .success(function(customers) {
                        $scope.customers = customers;
                        $scope.data = customers;
                        $scope.processSummaryInfo();
                    })
                    .error(function(data, status, headers, config) {
                        $log.log(data.error + ' ' + status);
                    });
        }

        init();

        $scope.doSort = function(propName) {
            $scope.sortBy = propName;
            $scope.reverse = !$scope.reverse;
        };
        $scope.processSummaryInfo = function() {
            $scope.summary = {};
            $scope.allMeetings = null;
            $scope.NewData = [];
            $scope.selectedSegmentLate = null;
            $scope.selectedSegmentMain = null;
            $scope.selectedOwnedRelationships = null;
            angular.forEach($scope.data, function(object) {


                var segment = object.Segment;
                switch (object.Segment) {
                    case "Downstream":
                        segment = "DS";
                        break;
                    case "Global Functions and ES":
                        segment = "GS & ES";
                        break;
                    default:
                        break;
                }

                if ($scope.summary[segment] == undefined) {
                    $scope.summary[segment] = {
                        upCommingEvents: []
                    };
                }

                var modifiedDate = moment(object["Modified"]),
                        createdDate = moment(object["CreatedDate"]),
                        upcomingDate = moment(object["upcomingdate"]);


                if (object["upcomingdate"].length) {

                    var date1 = new Date(object["upcomingdate"]);
                    var date2 = new Date();
                    //console.log(date1);
//                    console.log(date2.getTime()+"<==D1");
//                    console.log(date1.getTime()+"<==D2");
                    if (date2.getTime() < date1.getTime()) {
                        var timeDiff = Math.abs(date1.getTime() - date2.getTime());
                        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                        $scope.summary[segment].upCommingEvents.push(object);

                    }
                }

//                if (object["upcomingdate"].length && Math.abs(upcomingDate.diff(moment(), 'days')) <  30) {
//                    $scope.summary[segment].upCommingEvents.push(object);
//                }



                return;
                // }

            });

            $scope.showSegmentDetail('Trading', 'trading');

        };

        $scope.showSegmentDetail = function(getSegment, idPart) {
            $scope.NewData = [];
            $("#upNavs li").removeClass('active');
            $("#upCom_" + idPart).parent("li").addClass('active');
            $scope.allMeetings = $scope.summary[getSegment]['upCommingEvents'];
            for (var i = 0; i < $scope.allMeetings.length; i++) {
                $scope.NewData.push($scope.allMeetings);
            }


        };
    };

    UpMeetingsController.$inject = ['$scope', '$log', 'customersFactory',
        'appSettings'];

    angular.module('customersApp')
            .controller('UpMeetingsController', UpMeetingsController);



    var GridController = function($scope, $log, customersFactory, appSettings) {
        $scope.sortBy = 'name';
        $scope.reverse = false;
        $scope.customers = [];
        $scope.appSettings = appSettings;
        $scope.primaryAccountability = {};
        $scope.selectedName = "";
        $scope.daysFromLastUpdate=null;
        $scope.newPrimaryAccountablility = function() {
            return {
                count: 0,
                ownernextmeetingCount: 0,
                lastMeetingCount: 0,
                segments: {'Upstream': 0, 'Trading': 0, 'Technology': 0, 'Downstream': 0, 'ITSO': 0, 'Consumer ES': 0}
            };
        };
        $scope.calculateFromLastUpdate = function(row) {

            var modifiedDate = moment(row["Modified"]);
            $scope.daysFromLastUpdate = Math.abs(modifiedDate.diff(moment(), 'days'))


        }
        $scope.setPrimaryAccountability = function() {
            angular.forEach($scope.data, function(object) {

                if (typeof $scope.primaryAccountability[object.primaryaccountability] != 'undefined') {
                    $scope.primaryAccountability[object.primaryaccountability].count++;
                } else {
                    $scope.primaryAccountability[object.primaryaccountability] = $scope.newPrimaryAccountablility();
                    $scope.primaryAccountability[object.primaryaccountability].count++;
                }

                //Check for ownerNextMeetingCount
                if (typeof $scope.primaryAccountability[object.ownernextmeeting] != 'undefined') {
                    $scope.primaryAccountability[object.ownernextmeeting].ownernextmeetingCount++;
                } else {
                    $scope.primaryAccountability[object.ownernextmeeting] = $scope.newPrimaryAccountablility();
                    $scope.primaryAccountability[object.ownernextmeeting].ownernextmeetingCount++;
                }


                //Update the last meeting date counter for each name. 
                if (object.lastmeetingdate) {
                    $scope.primaryAccountability[object.primaryaccountability].lastMeetingCount++;
                }
                $scope.primaryAccountability[object.primaryaccountability]['segments'][object.segment]++;
            });
            $scope.processSummaryInfo();
        };
        $scope.processSummaryInfo = function() {
            $scope.summary = {};
            $scope.selectedSegment = null;
            $scope.selectedSegmentLate = null;
            $scope.selectedSegmentMain = null;
            $scope.selectedOwnedRelationships = null;
            $scope.selectedMissed = null;
            angular.forEach($scope.data, function(object) {

                //   if (object['primaryaccountability'] == name) {
                var segment = object.Segment;
                switch (object.Segment) {
                    case "Downstream":
                        segment = "DS";
                        break;
                    case "Global Functions and ES":
                        segment = "GS & ES";
                        break;
                    default:
                        break;
                }

                if ($scope.summary[segment] == undefined) {
                    $scope.summary[segment] = {
                        totalRelationships: 0,
                        totalOwnedRelationships: 0,
                        totalLateRelationships: 0,
                        newRelationships: [],
                        lateRelationships: [],
                        newRelationshipsMain: [],
                        ownedRelationships: [],
                        totalNewRelationships: 0,
                        totalMissedRelationships: 0,
                        missedRelationships: []
                    };
                }

                var modifiedDate = moment(object["Modified"]),
                        createdDate = moment(object["CreatedDate"]);

                $scope.summary[segment].totalOwnedRelationships++;
                $scope.summary[segment].ownedRelationships.push(object);

                if ((!object["nextmeetingowner"].length) || !(object["Last Meeting Date"].length)) {
                    $scope.summary[segment].totalLateRelationships++;
                    $scope.summary[segment].lateRelationships.push(object);
                }

                if (object["nextmeetingowner"].length && Math.abs(createdDate.diff(moment(), 'days')) <= 30) {
                    $scope.summary[segment].totalNewRelationships++;
                    $scope.summary[segment].newRelationships.push(object);
                }

                /* please change here for missed relationships */
                if ($scope.summary[segment].totalNewRelationships < 8) {
                    $scope.summary[segment].totalMissedRelationships = 8 - $scope.summary[segment].totalNewRelationships;
                } else {
                    $scope.summary[segment].totalMissedRelationships = 0;
                }

                return;
                // }

            });
            angular.forEach($scope.segments, function(object) {
                if ($scope.summary[object] == undefined) {
                    $scope.summary[object] = {
                        totalRelationships: 0,
                        totalOwnedRelationships: 0,
                        totalLateRelationships: 0,
                        performanceScore: 0 + "%",
                    };
                } else {

                    if ($scope.summary[object].totalLateRelationships > 0) {
                        $scope.summary[object].performanceScore = $scope.summary[object].totalOwnedRelationships == 0 ? 0 + "%" : ($scope.summary[object].totalOwnedRelationships) / ($scope.summary[object].totalLateRelationships * 100) + "%";
                    } else {
                        $scope.summary[object].performanceScore = 0 + '%';
                    }
                    $scope.summary[object].performanceNewScore =
                            $scope.summary[object].totalNewRelationships == 0 ? 0 + "%" : ($scope.summary[object].totalNewRelationships) / (8 * 100) + "%";

                }

            });


        };
        $scope.showSegmentDetail = function(item) {
            var dataE = angular.equals($scope.selectedSegment, item);
            if (!dataE) {
                $scope.selectedSegment = item;
            } else {
                $scope.selectedSegment = null;
            }



        };

        $scope.showOwnnedRelationShips = function(item) {

            var dataE = angular.equals($scope.selectedOwnedRelationships, item);
            if (!dataE) {

                $scope.selectedOwnedRelationships = item;
            } else {
                $scope.selectedOwnedRelationships = null;
            }



        };
        $scope.showNewRelationShipsMain = function(item) {
            var dataE = angular.equals($scope.selectedSegmentMain, item);
            if (!dataE) {
                $scope.selectedSegmentMain = item;
            } else {
                $scope.selectedSegmentMain = null;
            }

        };

        $scope.showLateSegmentDetail = function(item) {
            var dataE = angular.equals($scope.selectedSegmentLate, item);
            if (!dataE) {
                $scope.selectedSegmentLate = item;
            } else {
                $scope.selectedSegmentLate = null;
            }

        };
        $scope.dataDetails = function() {
            var dataE = angular.equals($scope.selectedSegment, item);
            if (!dataE) {
                $scope.selectedSegment = item;
            } else {
                $scope.selectedSegment = null;
            }

        }
        $scope.showMissedRelationships = function(item) {
            var dataE = angular.equals($scope.selectedMissed, item);
            if (!dataE) {
                $scope.selectedMissed = item;
            } else {
                $scope.selectedMissed = null;
            }

        };
        $scope.segments = ["Trading", "P&T", "Upstream", "ITSO", "DS", "GS & ES"];
        function init() {
            customersFactory.getCustomers()
                    .success(function(customers) {
                        $scope.customers = customers;
                        $scope.data = customers;
                        $scope.processSummaryInfo();
                    })
                    .error(function(data, status, headers, config) {
                        $log.log(data.error + ' ' + status);
                    });
        }

        init();

        $scope.doSort = function(propName) {
            $scope.sortBy = propName;
            $scope.reverse = !$scope.reverse;
        };
    };

    GridController.$inject = ['$scope', '$log', 'customersFactory',
        'appSettings'];

    angular.module('customersApp')
            .controller('GridController', GridController);

}());