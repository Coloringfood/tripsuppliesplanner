powerdialerApp.factory(
    'DialerListApiService',
    [
        '$q',
        '$location',
        'RestangularFactory',
        'ENV',
        'uibDateParser',
        function ($q, $location, restangularFactory, ENV, uibDateParser) {
            'use strict';
            var debugging = ENV.enviroment == 'dev';
            console.log("debugging: ", debugging);

            var DialerListApiService = {};

            function convertItemForApi(itemData) {
                return itemData;
            }

            function convertFactorForApi(factorData) {
                return factorData;
            }

            function convertVacationForApi(vacationData) {
                return vacationData;
            }

            function convertVacationForUi(vacationData) {
                var format = "yyyy-MM-dd";
                vacationData.start_date = uibDateParser.parse(vacationData.start_date.split("T")[0], format); // jshint ignore:line
                vacationData.end_date = uibDateParser.parse(vacationData.end_date.split("T")[0], format); // jshint ignore:line
                return vacationData;
            }

            function appendUserInfo(data) {
                data.user_id = 1; // jshint ignore:line
                return data;
            }

            DialerListApiService.getAllItems = () => {
                return restangularFactory.one('items').get()
                    .then(function (returnedData) {
                        if (debugging) {
                            console.log("getAllItems: ", returnedData);
                        }
                        return returnedData;
                    });
            };

            DialerListApiService.saveItem = (itemData, itemId) => {
                var convertedItem = convertItemForApi(itemData);
                convertedItem = appendUserInfo(convertedItem);
                return restangularFactory.allUrl('.').customPUT(convertedItem, "items/" + itemId)
                    .then(function (returnedData) {
                        if (debugging) {
                            console.log("saveItem: ", returnedData);
                        }
                        return returnedData;
                    });
            };

            DialerListApiService.createItem = (itemData) => {
                var convertedItem = convertItemForApi(itemData);
                convertedItem = appendUserInfo(convertedItem);
                return restangularFactory.all('items').post(convertedItem)
                    .then(function (returnedData) {
                        if (debugging) {
                            console.log("createItem: ", returnedData);
                        }
                        return returnedData;
                    });
            };

            DialerListApiService.deleteItem = (itemId) => {
                return restangularFactory.one('items').all(itemId).remove()
                    .then(function (returnedData) {
                        if (debugging) {
                            console.log("deleteItem: ", returnedData);
                        }
                        return returnedData;
                    });
            };

            DialerListApiService.getAllFactors = () => {
                return restangularFactory.one('factors').get()
                    .then(function (returnedData) {
                        if (debugging) {
                            console.log("getAllFactors: ", returnedData);
                        }
                        return returnedData;
                    });
            };

            DialerListApiService.createFactor = (factorData) => {
                var convertedFactor = convertFactorForApi(factorData);
                convertedFactor = appendUserInfo(convertedFactor);
                return restangularFactory.all('factors').post([convertedFactor])
                    .then(function (returnedData) {
                        if (debugging) {
                            console.log("createFactor: ", returnedData);
                        }
                        return returnedData;
                    });
            };

            DialerListApiService.getAllVacations = () => {
                return restangularFactory.one('vacations').get()
                    .then(function (returnedData) {
                        if (debugging) {
                            console.log("getAllVacations: ", returnedData);
                        }
                        return $q.all(returnedData.map(convertVacationForUi))
                            .then(function (returnedData) {
                                if (debugging) {
                                    console.log("Converted Vacation Data: ", returnedData);
                                }
                                return returnedData;
                            });
                    });
            };

            DialerListApiService.saveVacation = (vacationData, vacationId) => {
                var convertedVacation = convertVacationForApi(vacationData);
                convertedVacation = appendUserInfo(convertedVacation);

                return restangularFactory.allUrl('.').customPUT(convertedVacation, "vacations/" + vacationId)
                    .then(function (returnedData) {
                        if (debugging) {
                            console.log("saveVacation: ", returnedData);
                        }
                        return returnedData;
                    });
            };

            DialerListApiService.createVacation = (vacationData) => {
                var convertedVacation = convertVacationForApi(vacationData);
                convertedVacation = appendUserInfo(convertedVacation);

                return restangularFactory.all('vacations').post(convertedVacation)
                    .then(function (returnedData) {
                        if (debugging) {
                            console.log("createVacation: ", returnedData);
                        }
                        return returnedData;
                    });
            };

            DialerListApiService.deleteVacation = (vacationId) => {
                return restangularFactory.one('vacations').all(vacationId).remove()
                    .then(function (returnedData) {
                        if (debugging) {
                            console.log("deleteVacation: ", returnedData);
                        }
                        return returnedData;
                    });
            };

            DialerListApiService.authenticate = (username, password) => {
                var submitData = {
                    username: username,
                    password: password
                };
                return restangularFactory.all('authentication').post(submitData)
                    .then((result) => {
                        if (debugging) {
                            console.log("Authentication: ", result);
                        }
                        return result;
                    });
            };

            DialerListApiService.register = (signUpData) => {
                return restangularFactory.one('authentication').all('create').post(signUpData)
                    .then(function (result) {
                        if (debugging) {
                            console.log("Signup: ", result);
                        }
                        return result;
                    });
            };

            return DialerListApiService;
        }
    ]
);