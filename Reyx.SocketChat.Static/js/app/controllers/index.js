'use strict';

var Chat = function (from, chat) {
    var self = this;

    if (chat.FromUser.Slug === from.Slug) {
        self.FromUser = chat.FromUser;
        self.ToUser = chat.ToUser;
    } else {
        self.FromUser = chat.ToUser;
        self.ToUser = chat.FromUser;
    }

    self.Messages = _.map(chat.Messages, function (item) {
        return new Message(item);
    });

    self.active = false;
};

var Message = function (message) {
    var self = this;

    self.FromUser = message.FromUser;
    self.ToUser = message.ToUser;
    self.Message = message.Message;
    if (Object.prototype.toString.call(message.Date) !== "[object Date]")
        if (message.Date)
            self.Date = new Date(parseInt(message.Date.substr(6)));
        else
            self.Date = new Date();
};

App.controller('IndexCtrl', ['$scope', '$routeParams', 'xsocket', function ($scope, $routeParams, xsocket) {
    
    $scope.chats = $scope.users = [];
    $scope.message = {
        Message: ''
    };

    xsocket.subscribe("getUsers").process(function (data) {
        $scope.users = data;
    });

    // Some has removed a animal, lets get rid of it from the list...
    xsocket.subscribe("removeUser").process(function (id) {
        var user = _.findWhere($scope.users, { Id: id });
        $scope.users = _.without($scope.users, user);
    });

    xsocket.subscribe("login").process(function (data) {
        $scope.user = data;
    });

    xsocket.subscribe("addUser").process(function (data) {
        var user = _.find($scope.users, function (item) {
            return item.Id === data.Id;
        });

        if (!user)
            $scope.users.unshift(data);
    });

    xsocket.subscribe("initChat").process(function (data) {

        var chat = $scope.getChatBySlug(data.ToUser.Slug);

        if (!chat) {
            chat = new Chat($scope.user, data);
            $scope.chats.push(chat);
        }
        else
            chat.Messages = _.map(data.Messages, function (item) {
                return new Message(item);
            });

        $scope.activateChat(chat.ToUser);
    });

    xsocket.subscribe("messageSent").process(function (data) {
        $scope.message.Message = '';
        $scope.getChatBySlug(data.ToUser.Slug).Messages.unshift(new Message(data));
    });

    xsocket.subscribe("messageReceived").process(function (data) {
        var chat = $scope.getChatBySlug(data.ToUser.Slug);

        if (chat) {
            chat.Messages.unshift(new Message(data.Messages[0]));
        } else {
            chat = new Chat($scope.user, data);
            $scope.chats.push(chat);
        }

        var user = _.find($scope.users, function (item) { return item.Slug === chat.ToUser.Slug });

        if (!chat.active)
            user.Unread = (user.Unread || 0) + 1;
    });

    $scope.login = function () {
        if ($scope.user.Name)
            xsocket.publish("login", $scope.user);
        else
            alert('Informe o nome de usuário.');
    };

    $scope.initChat = function (user) {
        var chat = $scope.getChatBySlug(user.Slug);
        if (!chat) {
            xsocket.publish("initChat", { from: $scope.user.Slug, to: user.Slug });
        } else {
            $scope.activateChat(chat.ToUser);
            user.Unread = 0;
        }
    };

    $scope.activateChat = function (user) {        
        var chat = $scope.getChatBySlug(user.Slug);

        if (!chat)
            $scope.initChat(user);

        _.each($scope.chats, function (item) {
            if (item.active && item.ToUser.Slug !== user.Slug)
                item.active = false;
            else if (item.ToUser.Slug === user.Slug)
                item.active = true;            
        });

        _.each($scope.users, function (item) {
            if (item.active && item.Slug !== user.Slug)
                item.active = false;
            else if (item.Slug === user.Slug)
                item.active = true;
        });
    };

    $scope.sendMessage = function (user) {
        if ($scope.message.Message) {
            xsocket.publish("sendMessage", {
                from: $scope.user.Slug,
                to: user.Slug,
                message: $scope.message.Message
            });
        }
    };

    $scope.getChatBySlug = function (slug) {
        return _.find($scope.chats, function (item) {
            return item.ToUser.Slug === slug;
        }) || null;
    };

    $scope.user = {
        Name: $routeParams.user,
        Slug: ''
    };

    if ($scope.user.Name)
        $scope.login();

    xsocket.publish("getUsers", $scope.user);

}]);