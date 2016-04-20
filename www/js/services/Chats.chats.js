var chatsFactory = function () {
  'use strict';
  var Chats = {},
    chats = [{
      id: 0,
      name: 'Ben Sparrow',
      lastText: 'You on your way?',
      face: 'img/ben.png'
    }, {
      id: 1,
      name: 'Max Lynx',
      lastText: 'Hey, it\'s me',
      face: 'img/max.png'
    }, {
      id: 2,
      name: 'Adam Bradleyson',
      lastText: 'I should buy a boat',
      face: 'img/adam.jpg'
    }, {
      id: 3,
      name: 'Perry Governor',
      lastText: 'Look at my mukluks!',
      face: 'img/perry.png'
    }, {
      id: 4,
      name: 'Mike Harrington',
      lastText: 'This is wicked good ice cream.',
      face: 'img/mike.png'
    }];

  Chats.all = function () {
    return chats;
  };

  Chats.remove = function (chat) {
    chats.splice(chats.indexOf(chat), 1);
  };

  Chats.get = function (chatId) {
    var i = 0;
    for (i = 0; i < chats.length; i++) {
      if (chats[i].id === parseInt(chatId, 10)) {
        return chats[i];
      }
    }
    return null;
  };

  return Chats;
};

angular.module('Chats')
  .factory('Chats', chatsFactory);
