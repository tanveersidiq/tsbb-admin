'use strict';

app.controller('loginController', [
	'$scope',
	'$location',
	'accountService',
	'notificationService',
	function ($scope, $location, accountService, notificationService) {

		$scope.initialize = function () {

		}

		$scope.login = function () {
			if ($scope.frmLogin.$valid) {
				accountService.login($scope.user)
					.then(function () {
						$location.path('/home');
						notificationService.displaySuccess('Welcome ' + $scope.user.email);
					})
					.catch(function (err) {
						notificationService.displayError(err);
					});
			}

		}
	}
]);
