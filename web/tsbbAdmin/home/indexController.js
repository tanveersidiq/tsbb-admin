'use strict';
app.controller('indexController',
    function ($scope,  accountService) {

        $scope.logOut = function () {
            accountService.logOut();
        }

        $scope.isAdmin = function () {
            return accountService.isAdmin();
        }

        $scope.authentication = accountService.authentication;
    }
);