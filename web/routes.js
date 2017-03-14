angular
    .module('tsBBAdminRoutes', [])
    .config([
        '$routeProvider',
        '$locationProvider',
        function ($routeProvider, $locationProvider) {

            var authResolver = function (accountService) {
                return accountService.authorize(accountService);
            };

            $routeProvider
                .when('/home', {
                    templateUrl: 'tsbbAdmin/home/home.html',
                    controller: "homeController",
                    authorize: true,
                    resolve: {
                        authorizationResolver: authResolver
                    }
                })
                .when('/', {
                    templateUrl: 'tsbbAdmin/login/login.html',
                    controller: "loginController"
                });

            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
        }
    ]);