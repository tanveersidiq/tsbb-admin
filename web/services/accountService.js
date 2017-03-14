'use strict';
app.factory('accountService',
    function ($http, $q, $location, localStorageService, tsBBSettings) {

        var serviceBase = tsBBSettings.apiBaseUri;
        var accountServiceFactory = {};

        var _authentication = {
            token: '',
            email: '',
            authenticated: false
        };

        var _login = function (user) {
            var userData = {
                email: user.email,
                password: user.password
            };

            var deferred = $q.defer();

            _authentication.token = 'response.data.token';
            _authentication.email = 'tanveer.sidiq@gmail.com';
            _authentication.authenticated = true;

            localStorageService.set('userData', _authentication);

            deferred.resolve(response);

            return deferred.promise;
        };

        var _logOut = function () {

            localStorageService.remove('userData');

            _authentication.authenticated = false;
            _authentication.token = "";
            $location.path('/');
        };

        var _userData = function () {

            var userData = localStorageService.get('userData');
            if (userData) {
                _authentication.authenticated = userData.authenticated;
            }

        };

        var _authorize = function (accountService) {
            if (accountService && accountService.authentication.authenticated === true)
                return true;
            throw new AuthorizationError("User not authenticated.");
        };

        accountServiceFactory.login = _login;
        accountServiceFactory.logOut = _logOut;
        accountServiceFactory.userData = _userData;
        accountServiceFactory.authentication = _authentication;
        accountServiceFactory.authorize = _authorize;

        return accountServiceFactory;
    }
);

// Custom error type
function AuthorizationError(description) {
    this.forbidden = "Forbidden";
    this.message = description || this.forbidden;
    this.description = description || this.message;
}

AuthorizationError.prototype = Object.create(Error.prototype);
AuthorizationError.prototype.constructor = AuthorizationError;