powerdialerApp.factory(
    'DialerListApiService',
    [
        '$q',
        '$location',
        'RestangularFactory',
        'ENV',

        function ($q,
                  $location,
                  restangularFactory,
                  ENV) {
            'use strict';

            var DialerListApiService = {};

            function appendUserInfo(data) {
                data.user_id = 1;
                data.user_name = "Joe Tester";
                data.user_platform = "LMP";
                data.owner_id = 1;
                data.company_id = 1;
                return data;
            }

            DialerListApiService.getList = function (listId) {
                return restangularFactory.one('list', listId).get().then(function (returnedData) {
                    return convertListForUI(returnedData);
                });
            };

            function convertListForUI(listData) {
                var formattedData = {
                    id: listData.id,
                    name: listData.name,
                    minutesBetweenCalls: parseInt(listData.minutes_between_calls),
                    limitCallingTimes: listData.limit_calling_time.name,
                    visibility: listData.visibility.name,
                    dialerInitiativesType: listData.dialer_initiatives_type,
                    attendees: listData.attendees,
                    callerId: listData.caller_id,
                    emailCategory: listData.email_category,
                    dialerRules: []
                };
                if (!formattedData.attendees) {
                    formattedData.attendees = {};
                }
                if (!formattedData.callerId) {
                    formattedData.callerId = {};
                }
                var rulesLength = listData.dialer_rules.length;
                for (var j = 0; j < rulesLength; j++) {
                    var ruleData = listData.dialer_rules[j];
                    var formattedRule = convertRuleForUI(ruleData);
                    formattedData.dialerRules.push(formattedRule);
                }
                return formattedData;
            }

            function convertRuleForUI(ruleData) {
                var formattedRule = {
                    id: ruleData.id,
                    name: ruleData.name,
                    startTime: parseInt(ruleData.start_time.split(':')[0]),
                    endTime: parseInt(ruleData.end_time.split(':')[0]),
                    priority: ruleData.priority,
                    orderBy: ruleData.order_by,
                    maxDials: ruleData.max_dials,
                    minDials: ruleData.min_dials,
                    dialerRuleFilters: [],
                    limitCallsType: ruleData.object_type.name.toLowerCase(),
                    limitCallsTo: ruleData.limit_calls_to.name.toLowerCase()
                };
                var filtersLength = ruleData.dialer_rule_filters.length;
                for (var k = 0; k < filtersLength; k++) {
                    var filter = ruleData.dialer_rule_filters[k];
                    var formattedFilter = {
                        id: filter.id,
                        filterData: filter.filter_data
                    };
                    formattedRule.dialerRuleFilters.push(formattedFilter);
                }
                return formattedRule;
            }

            DialerListApiService.getEmailCategories = function (profile_id) {
                var deferred = $q.defer();
                var data = [
                    {id: 1, name: "Email Option 1"},
                    {id: 2, name: "Email Option 2"},
                    {id: 3, name: "Email Option 3"},
                    {id: 4, name: "Email Option 4"}
                ];
                deferred.resolve(data);
                return deferred.promise;
            };

            DialerListApiService.getTeamsToInvite = function (profile_id) {
                var deferred = $q.defer();
                var data = [
                    {id: 0, name: "Team 1"},
                    {id: 1, name: "Team 2"},
                    {id: 2, name: "Team 3"},
                    {id: 3, name: "Team 4"}
                ];
                deferred.resolve(data);
                return deferred.promise;
            };

            DialerListApiService.getUsersToInvite = function () {
                var deferred = $q.defer();
                var data = [
                    {id: 1, name: "User Option 1"},
                    {id: 2, name: "User Option 2"},
                    {id: 3, name: "User Option 3"},
                    {id: 4, name: "User Option 4"}
                ];
                deferred.resolve(data);
                return deferred.promise;
            };

            DialerListApiService.getRule = function (rule_id) {
                return restangularFactory.one('rule', rule_id).get().then(function (returnedData) {
                    return convertRuleForUI(returnedData);
                });
            };

            function convertRuleForApi(ruleData) {
                var convertedRule = {
                    id: ruleData.id,
                    name: ruleData.name,
                    start_time: ruleData.startTime + ":00",
                    end_time: ruleData.endTime + ":00",
                    priority: ruleData.priority,
                    order_by: ruleData.orderBy,
                    min_dials: ruleData.minDials,
                    max_dials: ruleData.maxDials,
                    dialer_rule_filters: [],
                    object_type: ruleData.limitCallsType,
                    limit_calls_to: ruleData.limitCallsTo
                };
                if (!ruleData.minDials) {
                    convertedRule.min_dials = ruleData.dialerRuleFilters[0].filterData.value.start;
                    convertedRule.max_dials = ruleData.dialerRuleFilters[0].filterData.value.end;
                }
                var filtersLength = ruleData.dialerRuleFilters.length;
                for (var i = 0; i < filtersLength; i++) {
                    var filter = ruleData.dialerRuleFilters[i];
                    var convertedFilter = {
                        id: filter.id,
                        filter_data: filter.filterData
                    };
                    convertedRule.dialer_rule_filters.push(convertedFilter);
                }

                return convertedRule;
            }

            DialerListApiService.getSearchFields = function () {
                var deferred = $q.defer();
                var data = [
                    {
                        "field": "address",
                        "type": "text",
                        "label": "Address",
                        "is_address": true,
                        "alias": "ad.addr1",
                        "operators": [
                            {
                                "name": "(=) equal to",
                                "value": "equals"
                            },
                            {
                                "name": "(>) greater than",
                                "value": "greater"
                            },
                            {
                                "name": "(<) less than",
                                "value": "less"
                            },
                            {
                                "name": "between",
                                "value": "between"
                            },
                            {
                                "name": "like",
                                "value": "like"
                            },
                            {
                                "name": "one of",
                                "value": "oneof"
                            },
                            {
                                "name": "set to any value",
                                "value": "set"
                            }
                        ]
                    },
                    {
                        "field": "annual_revenue",
                        "type": "text",
                        "label": "Annual Revenue",
                        "alias": "a.annual_revenue",
                        "operators": [
                            {
                                "name": "(=) equal to",
                                "value": "equals"
                            },
                            {
                                "name": "(>) greater than",
                                "value": "greater"
                            },
                            {
                                "name": "(<) less than",
                                "value": "less"
                            },
                            {
                                "name": "between",
                                "value": "between"
                            },
                            {
                                "name": "like",
                                "value": "like"
                            },
                            {
                                "name": "one of",
                                "value": "oneof"
                            },
                            {
                                "name": "set to any value",
                                "value": "set"
                            }
                        ]
                    },
                    {
                        "field": "area_code",
                        "type": "status",
                        "label": "Area Code",
                        "alias": "ci.area_code",
                        "options": [
                            {
                                "id": 201,
                                "name": 201
                            },
                            {
                                "id": 202,
                                "name": 202
                            },
                            {
                                "id": 203,
                                "name": 203
                            },
                            {
                                "id": 204,
                                "name": 204
                            },
                            {
                                "id": 205,
                                "name": 205
                            },
                            {
                                "id": 206,
                                "name": 206
                            },
                            {
                                "id": 207,
                                "name": 207
                            },
                            {
                                "id": 208,
                                "name": 208
                            },
                            {
                                "id": 209,
                                "name": 209
                            },
                            {
                                "id": 210,
                                "name": 210
                            }
                        ],
                        "operators": [
                            {
                                "name": "(=) equal to",
                                "value": "equals"
                            },
                            {
                                "name": "one of",
                                "value": "oneof"
                            },
                            {
                                "name": "set to any value",
                                "value": "set"
                            }
                        ]
                    },
                    {
                        "field": "assistant_first_name",
                        "type": "text",
                        "label": "Assistant First Name",
                        "alias": "aci.first_name",
                        "operators": [
                            {
                                "name": "(=) equal to",
                                "value": "equals"
                            },
                            {
                                "name": "(>) greater than",
                                "value": "greater"
                            },
                            {
                                "name": "(<) less than",
                                "value": "less"
                            },
                            {
                                "name": "between",
                                "value": "between"
                            },
                            {
                                "name": "like",
                                "value": "like"
                            },
                            {
                                "name": "one of",
                                "value": "oneof"
                            },
                            {
                                "name": "set to any value",
                                "value": "set"
                            }
                        ]
                    },
                    {
                        "field": "assistant_last_name",
                        "type": "text",
                        "label": "Assistant Last Name",
                        "alias": "aci.last_name",
                        "operators": [
                            {
                                "name": "(=) equal to",
                                "value": "equals"
                            },
                            {
                                "name": "(>) greater than",
                                "value": "greater"
                            },
                            {
                                "name": "(<) less than",
                                "value": "less"
                            },
                            {
                                "name": "between",
                                "value": "between"
                            },
                            {
                                "name": "like",
                                "value": "like"
                            },
                            {
                                "name": "one of",
                                "value": "oneof"
                            },
                            {
                                "name": "set to any value",
                                "value": "set"
                            }
                        ]
                    },
                    {
                        "field": "street",
                        "type": "text",
                        "label": "Billing Address 1",
                        "is_address1": true,
                        "alias": "ad.addr1",
                        "operators": [
                            {
                                "name": "(=) equal to",
                                "value": "equals"
                            },
                            {
                                "name": "(>) greater than",
                                "value": "greater"
                            },
                            {
                                "name": "(<) less than",
                                "value": "less"
                            },
                            {
                                "name": "between",
                                "value": "between"
                            },
                            {
                                "name": "like",
                                "value": "like"
                            },
                            {
                                "name": "one of",
                                "value": "oneof"
                            },
                            {
                                "name": "set to any value",
                                "value": "set"
                            }
                        ]
                    },
                    {
                        "field": "suite",
                        "type": "text",
                        "label": "Billing Address 2",
                        "is_address2": true,
                        "alias": "ad.addr2",
                        "operators": [
                            {
                                "name": "(=) equal to",
                                "value": "equals"
                            },
                            {
                                "name": "(>) greater than",
                                "value": "greater"
                            },
                            {
                                "name": "(<) less than",
                                "value": "less"
                            },
                            {
                                "name": "between",
                                "value": "between"
                            },
                            {
                                "name": "like",
                                "value": "like"
                            },
                            {
                                "name": "one of",
                                "value": "oneof"
                            },
                            {
                                "name": "set to any value",
                                "value": "set"
                            }
                        ]
                    },
                    {
                        "field": "city",
                        "type": "text",
                        "label": "Billing City",
                        "is_city": true,
                        "alias": "ct.name",
                        "operators": [
                            {
                                "name": "(=) equal to",
                                "value": "equals"
                            },
                            {
                                "name": "(>) greater than",
                                "value": "greater"
                            },
                            {
                                "name": "(<) less than",
                                "value": "less"
                            },
                            {
                                "name": "between",
                                "value": "between"
                            },
                            {
                                "name": "like",
                                "value": "like"
                            },
                            {
                                "name": "one of",
                                "value": "oneof"
                            },
                            {
                                "name": "set to any value",
                                "value": "set"
                            }
                        ]
                    },
                    {
                        "field": "country",
                        "type": "status",
                        "label": "Billing Country",
                        "is_country": true,
                        "alias": "ad.country_id",
                        "options": [
                            {
                                "id": 2,
                                "name": "United States of America",
                                "abbrev": "USA"
                            },
                            {
                                "id": 3,
                                "name": "Canada",
                                "abbrev": "CA"
                            },
                            {
                                "id": 1,
                                "name": "unknown",
                                "abbrev": "??"
                            }
                        ],
                        "operators": [
                            {
                                "name": "(=) equal to",
                                "value": "equals"
                            },
                            {
                                "name": "one of",
                                "value": "oneof"
                            },
                            {
                                "name": "set to any value",
                                "value": "set"
                            }
                        ]
                    },
                    {
                        "field": "state_abbrev",
                        "type": "status",
                        "label": "Billing State",
                        "is_state": true,
                        "alias": "ad.state_id",
                        "options": [
                            {
                                "id": 39,
                                "country_id": 2,
                                "name": "Pennsylvania",
                                "abbrev": "PA",
                                "type": "state"
                            },
                            {
                                "id": 40,
                                "country_id": 2,
                                "name": "Rhode Island",
                                "abbrev": "RI",
                                "type": "state"
                            },
                            {
                                "id": 41,
                                "country_id": 2,
                                "name": "South Carolina",
                                "abbrev": "SC",
                                "type": "state"
                            },
                            {
                                "id": 42,
                                "country_id": 2,
                                "name": "South Dakota",
                                "abbrev": "SD",
                                "type": "state"
                            },
                            {
                                "id": 43,
                                "country_id": 2,
                                "name": "Tennessee",
                                "abbrev": "TN",
                                "type": "state"
                            },
                            {
                                "id": 44,
                                "country_id": 2,
                                "name": "Texas",
                                "abbrev": "TX",
                                "type": "state"
                            },
                            {
                                "id": 45,
                                "country_id": 2,
                                "name": "Utah",
                                "abbrev": "UT",
                                "type": "state"
                            },
                            {
                                "id": 46,
                                "country_id": 2,
                                "name": "Vermont",
                                "abbrev": "VT",
                                "type": "state"
                            },
                            {
                                "id": 47,
                                "country_id": 2,
                                "name": "Virginia",
                                "abbrev": "VA",
                                "type": "state"
                            },
                            {
                                "id": 48,
                                "country_id": 2,
                                "name": "Washington",
                                "abbrev": "WA",
                                "type": "state"
                            },
                            {
                                "id": 49,
                                "country_id": 2,
                                "name": "West Virginia",
                                "abbrev": "WV",
                                "type": "state"
                            },
                            {
                                "id": 50,
                                "country_id": 2,
                                "name": "Wisconsin",
                                "abbrev": "WI",
                                "type": "state"
                            },
                            {
                                "id": 51,
                                "country_id": 2,
                                "name": "Wyoming",
                                "abbrev": "WY",
                                "type": "state"
                            },
                            {
                                "id": 52,
                                "country_id": 3,
                                "name": "Alberta",
                                "abbrev": "AB",
                                "type": "province"
                            },
                            {
                                "id": 53,
                                "country_id": 3,
                                "name": "British Columbia",
                                "abbrev": "BC",
                                "type": "province"
                            },
                            {
                                "id": 54,
                                "country_id": 3,
                                "name": "Manitoba",
                                "abbrev": "MB",
                                "type": "province"
                            },
                            {
                                "id": 55,
                                "country_id": 3,
                                "name": "New Brunswick",
                                "abbrev": "NB",
                                "type": "province"
                            },
                            {
                                "id": 56,
                                "country_id": 3,
                                "name": "Newfoundland",
                                "abbrev": "NL",
                                "type": "province"
                            },
                            {
                                "id": 57,
                                "country_id": 3,
                                "name": "Labrador",
                                "abbrev": "NL",
                                "type": "province"
                            },
                            {
                                "id": 58,
                                "country_id": 3,
                                "name": "Northwest Territories",
                                "abbrev": "NT",
                                "type": "province"
                            },
                            {
                                "id": 59,
                                "country_id": 3,
                                "name": "Nova Scotia",
                                "abbrev": "NS",
                                "type": "province"
                            },
                            {
                                "id": 60,
                                "country_id": 3,
                                "name": "Nunavut",
                                "abbrev": "NU",
                                "type": "province"
                            },
                            {
                                "id": 61,
                                "country_id": 3,
                                "name": "Ontario",
                                "abbrev": "ON",
                                "type": "province"
                            },
                            {
                                "id": 62,
                                "country_id": 3,
                                "name": "Prince Edward Island",
                                "abbrev": "PE",
                                "type": "province"
                            },
                            {
                                "id": 63,
                                "country_id": 3,
                                "name": "Quebec",
                                "abbrev": "QC",
                                "type": "province"
                            },
                            {
                                "id": 64,
                                "country_id": 3,
                                "name": "Saskatchewan",
                                "abbrev": "SK",
                                "type": "province"
                            },
                            {
                                "id": 65,
                                "country_id": 3,
                                "name": "Yukon",
                                "abbrev": "YT",
                                "type": "province"
                            },
                            {
                                "id": 66,
                                "country_id": 2,
                                "name": "",
                                "abbrev": "",
                                "type": "country"
                            }
                        ],
                        "operators": [
                            {
                                "name": "(=) equal to",
                                "value": "equals"
                            },
                            {
                                "name": "one of",
                                "value": "oneof"
                            },
                            {
                                "name": "set to any value",
                                "value": "set"
                            }
                        ]
                    },
                    {
                        "field": "zip",
                        "type": "text",
                        "label": "Billing Zip/Postal Code",
                        "is_zip": true,
                        "alias": "ad.zip",
                        "operators": [
                            {
                                "name": "(=) equal to",
                                "value": "equals"
                            },
                            {
                                "name": "(>) greater than",
                                "value": "greater"
                            },
                            {
                                "name": "(<) less than",
                                "value": "less"
                            },
                            {
                                "name": "between",
                                "value": "between"
                            },
                            {
                                "name": "like",
                                "value": "like"
                            },
                            {
                                "name": "one of",
                                "value": "oneof"
                            },
                            {
                                "name": "set to any value",
                                "value": "set"
                            }
                        ]
                    },
                    {
                        "field": "birthdate",
                        "type": "date",
                        "label": "Birthdate",
                        "is_date": true,
                        "alias": "ci.birthdate",
                        "operators": [
                            {
                                "name": "(=) on",
                                "value": "equals"
                            },
                            {
                                "name": "(<) before",
                                "value": "less"
                            },
                            {
                                "name": "(>) after",
                                "value": "greater"
                            },
                            {
                                "name": "within (+/-)",
                                "value": "within_last"
                            },
                            {
                                "name": "between",
                                "value": "between"
                            },
                            {
                                "name": "set to any value",
                                "value": "set"
                            },
                            {
                                "name": "older than",
                                "value": "beyond"
                            }
                        ]
                    },
                    {
                        "field": "campaign",
                        "type": "status",
                        "label": "Campaign ID",
                        "alias": "lci.campaign_id",
                        "options": [
                            {
                                "id": 1,
                                "name": "Test 1"
                            },
                            {
                                "id": 2,
                                "name": "Test Two"
                            },
                            {
                                "id": 3,
                                "name": "Test Three"
                            },
                            {
                                "id": 4,
                                "name": "User1 Campaign"
                            }
                        ],
                        "operators": [
                            {
                                "name": "(=) equal to",
                                "value": "equals"
                            },
                            {
                                "name": "one of",
                                "value": "oneof"
                            },
                            {
                                "name": "set to any value",
                                "value": "set"
                            }
                        ]
                    },
                    {
                        "field": "campaign_name",
                        "type": "status",
                        "label": "Campaign Name",
                        "alias": "lci.campaign_id",
                        "order_by": "cmp.name",
                        "options": [
                            {
                                "id": 1,
                                "name": "Test 1"
                            },
                            {
                                "id": 2,
                                "name": "Test Two"
                            },
                            {
                                "id": 3,
                                "name": "Test Three"
                            },
                            {
                                "id": 4,
                                "name": "User1 Campaign"
                            }
                        ],
                        "operators": [
                            {
                                "name": "(=) equal to",
                                "value": "equals"
                            },
                            {
                                "name": "one of",
                                "value": "oneof"
                            },
                            {
                                "name": "set to any value",
                                "value": "set"
                            }
                        ]
                    },
                    {
                        "field": "num_dials",
                        "type": "text",
                        "is_impression": true,
                        "label": "Dial Attempts",
                        "alias": "imp_type_1.impression_type_count",
                        "sql": "COALESCE(imp_type_1.impression_type_count, 0)",
                        "operators": [
                            {
                                "name": "(=) equal to",
                                "value": "equals"
                            },
                            {
                                "name": "(>) greater than",
                                "value": "greater"
                            },
                            {
                                "name": "(<) less than",
                                "value": "less"
                            },
                            {
                                "name": "between",
                                "value": "between"
                            },
                            {
                                "name": "like",
                                "value": "like"
                            },
                            {
                                "name": "one of",
                                "value": "oneof"
                            },
                            {
                                "name": "set to any value",
                                "value": "set"
                            }
                        ]
                    }
                ];
                deferred.resolve(data);
                return deferred.promise;
            };

            DialerListApiService.saveRule = function (ruleData) {
                var convertedRule = convertRuleForApi(ruleData);
                convertedRule = appendUserInfo(convertedRule);
                return restangularFactory.allUrl('.').customPUT(convertedRule, "rule/" + ruleData.id).then(function (returnedData) {
                    return returnedData;
                });
            };
            DialerListApiService.createRule = function (ruleData, listId) {
                var convertedRule = convertRuleForApi(ruleData);
                convertedRule = appendUserInfo(convertedRule);
                return restangularFactory.one('rules').all(listId).post(convertedRule).then(function (returnedData) {
                    return returnedData;
                });
            };

            function convertListForApi(listData) {
                var convertedListData = {
                    name: listData.name,
                    minutes_between_calls: listData.minutesBetweenCalls,
                    limit_calling_times: listData.limitCallingTimes,
                    visibility: listData.visibility,
                    dialer_initiatives_type: listData.dialerInitiativesType,

                    attendees: listData.attendees,
                    caller_id: listData.callerId,
                    email_category: listData.emailCategory,
                    dialer_rules: []
                };
                var rulesLength = listData.dialerRules.length;
                for (var i = 0; i < rulesLength; i++) {
                    var rule = listData.dialerRules[i];
                    convertedListData.dialer_rules.push(convertRuleForApi(rule));
                }
                return convertedListData;
            }

            DialerListApiService.saveList = function (listData) {
                var convertedList = convertListForApi(listData);
                convertedList = appendUserInfo(convertedList);
                return restangularFactory.allUrl('.').customPUT(convertedList, "list/" + listData.id).then(function (returnedData) {
                    return returnedData;
                });
            };

            DialerListApiService.createList = function (listData) {
                var convertedListData = convertListForApi(listData);
                convertedListData = appendUserInfo(convertedListData);
                return restangularFactory.all('list').post(convertedListData);
            };

            DialerListApiService.getLists = function () {
                var deferred = $q.defer();
                var data = [
                    {
                        "id": 1,
                        "name": "Api test list",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 2,
                        "name": "Api test list - renamed",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 4,
                        "name": "Api test list",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 5,
                        "name": "Api test list",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 6,
                        "name": "Api test list",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 7,
                        "name": "Api test list",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 8,
                        "name": "Api test list",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 9,
                        "name": "Api test list",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 10,
                        "name": "Api test list",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 11,
                        "name": "Api test list",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 12,
                        "name": "Api test list - renamed",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 14,
                        "name": "Api test list",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 15,
                        "name": "Api test list",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 16,
                        "name": "Api test list",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 17,
                        "name": "Api test list",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 18,
                        "name": "Api test list",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 19,
                        "name": "Api test list",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 20,
                        "name": "Api test list",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 21,
                        "name": "Api test list",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 22,
                        "name": "Api test list - renamed",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 24,
                        "name": "Api test list",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 25,
                        "name": "Api test list",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 26,
                        "name": "Api test list",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 27,
                        "name": "Api test list",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 28,
                        "name": "Api test list",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 29,
                        "name": "Api test list",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 30,
                        "name": "Api test list",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 31,
                        "name": "Api test list",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 32,
                        "name": "Api test list - renamed",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 34,
                        "name": "Api test list",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 35,
                        "name": "Api test list",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 36,
                        "name": "Api test list",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 37,
                        "name": "Api test list",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    },
                    {
                        "id": 38,
                        "name": "Api test list",
                        "minutes_between_calls": 1440,
                        "attendees": [
                            {
                                "attendee_id": "3"
                            },
                            {
                                "attendee_id": "1"
                            }
                        ],
                        "visibility": "company",
                        "type": "lead"
                    }
                ];
                deferred.resolve(data);
                return deferred.promise;
            };

            DialerListApiService.deleteList = function (listId) {
                return restangularFactory.one('list', listId).remove();
            };

            return DialerListApiService;
        }
    ]
);