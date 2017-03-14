'use strict';
app.factory('authInterceptorService', 
    function ($q, $injector, localStorageService) {

        var authInterceptorServiceFactory = {};

        var _request = function (config) {

            config.headers = config.headers || {};

            var userData = localStorageService.get('userData');
            if (userData) {
                config.headers.Authorization = userData.token;
            }

            return config;
        }

        var _responseError = function (rejection) {
            if (rejection.status === 401 || rejection.status === 403) {
                var accountService = $injector.get('accountService');
                accountService.logOut();
            }
            return $q.reject(rejection);
        }

        authInterceptorServiceFactory.request = _request;
        authInterceptorServiceFactory.responseError = _responseError;

        return authInterceptorServiceFactory;
    }
);