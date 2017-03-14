'use strict';
app.controller('homeController',
    function ($scope, $rootScope, $uibModal, bulletinService, stickyService, shareService, notificationService) {

        $scope.activeBulletin = {
            title: "No bulletin!"
        };

        var _initialize = function () {
            getBulletins();
        };

        var _addBulletin = function () {
            $('#createBulletin')
                .modal({
                    backdrop: 'static',
                    keyboard: false,
                    open: function (event, ui) {
                        $(".close", ui.dialog | ui).hide();
                    }
                });
        };

        var _createBulletin = function () {
            if ($scope.frmBulletin.$valid) {
                bulletinService
                    .createBulletin($scope.activeBulletin)
                    .then(function (response) {
                        $scope.activeBulletin.title = $scope.activeBulletin.name;
                        $rootScope.bulletins.push(response.data);
                        $rootScope.active(response.data);
                        notificationService.displaySuccess('Bulletin created successfully.');
                    })
                    .catch(function (err) {
                        notificationService.displayError(err);
                    });
            }
        };

        var _addStickyNote = function () {
            if ($scope.sticky) {
                $scope.sticky.title = '';
                $scope.sticky.content = '';
            }
            $('#createStickBulletin')
                .modal({
                    backdrop: 'static',
                    keyboard: false,
                    open: function (event, ui) {
                        $(".close", ui.dialog | ui).hide();
                    }
                });
        };

        var _createStickyNote = function () {
            if ($scope.frmStickBulletin.$valid) {

                var stickyNote = {
                    title: $scope.sticky.title,
                    content: $scope.sticky.content,
                    bulletin: $scope.activeBulletin.Id,
                    top: $('#bulletinArea').position().top + 50,
                    left: $('#bulletinArea').position().left + 10
                };

                stickyService
                    .createStickNote(stickyNote)
                    .then(function (response) {
                        $scope.activeBulletin.BulletinStickies.push(response.data);
                        notificationService.displaySuccess('Sticky note created successfully.');
                    })
                    .catch(function (err) {
                        notificationService.displayError(err);
                    });
            }
        };

        var _removeStickyNote = function (sticky) {
            stickyService
                .deleteStickNote(sticky)
                .then(function (response) {

                    $scope.activeBulletin.BulletinStickies = $.grep($scope.activeBulletin.BulletinStickies, function (value) {
                        return value.Id != sticky.Id;
                    });
                    notificationService.displaySuccess('Sticky note deleted successfully.');
                })
                .catch(function (err) {
                    notificationService.displayError(err);
                });

        };

        var _active = function (bulletin) {
            bulletin.isActive = true;
            $scope.activeBulletin = bulletin;
            $scope.activeBulletin.title = $scope.activeBulletin.Title;
            if (!$scope.activeBulletin.BulletinStickies) {
                $scope.activeBulletin.BulletinStickies = [];
            }
        };

        $scope.updateStickyNotePosition = function (sticky) {

            var stickyNote = {
                id: sticky.Id,
                top: sticky.Top,
                left: sticky.Left
            };

            stickyService
                .updateStickNotePosition(stickyNote)
                .then(function (response) {
                    notificationService.displaySuccess('Position updated successfully.');
                })
                .catch(function (err) {
                    notificationService.displayError(err);
                });
        };

        $scope.createBulletin = _createBulletin;
        $scope.addBulletin = _addBulletin;
        $scope.addStickyNote = _addStickyNote;
        $scope.createStickyNote = _createStickyNote;
        $scope.removeStickyNote = _removeStickyNote;
        $rootScope.active = _active;
        $scope.initialize = _initialize;

        function getBulletins() {
            bulletinService
                .bulletins($scope.user)
                .then(function (response) {
                    $rootScope.bulletins = response.data;
                    $.grep($rootScope.bulletins, function (bulletin) {
                        if(bulletin.BulletinShares.length > 0)
                             bulletin.isShared = true;
                    });
                    shareService
                        .sharedBulletins($scope.user)
                        .then(function (response) {
                            $.grep(response.data, function (bulletin) {
                                var bulletinShare = bulletin.BulletinShare;
                                bulletinShare.isShared = true;
                                $rootScope.bulletins.push(bulletinShare);
                            });
                            if ($rootScope.bulletins.length > 0) {
                                $rootScope.active($rootScope.bulletins[0]);
                            }
                        })
                        .catch(function (err) {
                            notificationService.displayError(err);
                        });
                })
                .catch(function (err) {
                    notificationService.displayError(err);
                });
        }

    }
);