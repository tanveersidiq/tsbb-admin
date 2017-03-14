'use strict';
app.controller('profileController',
    function ($scope, $rootScope, $uibModal, accountService, friendService, shareService, notificationService) {

        var _selected;
        var _searchFriendsOptions = {
            debounce: {
                default: 500,
                blur: 250
            },
            getterSetter: true
        };

        var _initialize = function () {
            getUsers();
        };

        var _select = function (user) {
            if (arguments.length) {
                _selected = $.grep($scope.users, function (value) {
                    return value.Email === user;
                })[0];
            } else {
                return _selected;
            }
        };

        var _unfriend = function (friend) {
            $scope.unfriend = friend;

            $('#unfriend')
                .modal({
                    backdrop: 'static',
                    keyboard: false,
                    open: function (event, ui) {
                        $(".close", ui.dialog | ui).hide();
                    }
                });
        };

        var _shareBulletin = function (friend) {
            $scope.friend = friend;
            $('#shareBulletin')
                .modal({
                    backdrop: 'static',
                    keyboard: false,
                    open: function (event, ui) {
                        $(".close", ui.dialog | ui).hide();
                    }
                });
        };

        var _share = function (bulletins, friend) {
            var bulletinShare = [];
            $.grep(bulletins, function (bulletin) {
                if (bulletin.share) {
                    bulletin.isShared = bulletin.share;
                    bulletinShare.push({
                        bulletin: bulletin.Id,
                        user: friend.Id
                    });
                }
            });
            if (bulletinShare.length > 0) {
                shareService
                    .share(bulletinShare)
                    .then(function (response) {
                        notificationService.displaySuccess('Bulletins shared successfully.');
                    })
                    .catch(function (err) {
                        notificationService.displayError(err);
                    });
            }
        };
        var _add = function () {
            friendService
                .add($scope.select().Id)
                .then(function (response) {
                    var addFriendRequest = response.data;
                    addFriendRequest.FriendUser = $scope.select();
                    $scope.currentUser.friendRequestsSent.push(addFriendRequest);
                    notificationService.displaySuccess('Friendship request sent successfully.');
                })
                .catch(function (err) {
                    notificationService.displayError(err);
                });
        };

        var _cancel = function (friend) {
            friendService
                .cancel(friend.Id)
                .then(function (response) {
                    $scope.currentUser.friendRequestsSent =
                        $.grep($scope.currentUser.friendRequestsSent, function (value) {
                            return value.Id !== friend.Id;
                        });
                    $scope.currentUser.friendRequestsReceived =
                        $.grep($scope.currentUser.friendRequestsReceived, function (value) {
                            return value.Id !== friend.Id;
                        });
                    $scope.currentUser.friends =
                        $.grep($scope.currentUser.friends, function (value) {
                            return value.Id !== friend.Id;
                        });
                    notificationService.displaySuccess('Friendship cancelled successfully.');
                })
                .catch(function (err) {
                    notificationService.displayError(err);
                });
        }

        var _accept = function (friend) {
            friendService
                .accept(friend.Id)
                .then(function (response) {

                    $scope.currentUser.friendRequestsReceived =
                        $.grep($scope.currentUser.friendRequestsReceived, function (value) {
                            return value.Id != friend.Id;
                        });

                    getFriends();
                    notificationService.displaySuccess('Friend added successfully.');

                })
                .catch(function (err) {
                    notificationService.displayError(err);
                });
        }

        $scope.users = [];
        $scope.currentUser;
        $scope.searchFriendsOptions = _searchFriendsOptions;
        $scope.initialize = _initialize;

        $scope.select = _select;
        $scope.unfriend = _unfriend;
        $scope.shareBulletin = _shareBulletin;
        $scope.share = _share;
        $scope.add = _add;
        $scope.cancel = _cancel;
        $scope.accept = _accept;

        function getUsers() {
            accountService
                .users()
                .then(function (response) {
                    $scope.users = $.grep(response.data, function (value) {
                        return value.Email !== accountService.authentication.email;
                    });
                    $scope.currentUser = $.grep(response.data, function (value) {
                        return value.Email === accountService.authentication.email;
                    })[0];
                    getFriends();
                })
                .catch(function (err) {
                    notificationService.displayError(err);
                });
        }

        function getFriends() {
            friendService
                .friends()
                .then(function (response) {
                    $scope.currentUser.friendRequestsSent = $.grep(response.data, function (value) {
                        return !value.Accepted && value.User === $scope.currentUser.Id;
                    });
                    $scope.currentUser.friendRequestsReceived = $.grep(response.data, function (value) {
                        if (value.UserFriend === value.FriendUser.Id) {
                            var fu = value.FriendUser;
                            value.FriendUser = value.FriendUser2;
                            value.FriendUser2 = fu;
                        }
                        return !value.Accepted && value.UserFriend === $scope.currentUser.Id;
                    });
                    $scope.currentUser.friends = [];
                    $.grep(response.data, function (value) {
                        if (value.Accepted) {
                            $scope.currentUser.friends.push(value);
                        }
                    });

                })
                .catch(function (err) {
                    notificationService.displayError(err);
                });
        }

    }
);