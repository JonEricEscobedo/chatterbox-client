// YOUR CODE HERE:
// http://parse.sfm8.hackreactor.com/
var app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  roomsCollector: []
};

app.init = function() {
  $('.username').on('click', app.handleUsernameClick());
  $('#send').on('click', app.handleSubmit());
};

app.send = function(data) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent', data);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function(data) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'GET',
    // data: JSON.stringify(data),
    data: {
      limit: 10,
      order: '-updatedAt'
    },
    dataType: 'json',
    contentType: 'application/json',
    success: function (data) {
      var user = data.results;
      var index = user.length - 1;
      console.log(user);

      while (index >= 0) {
        app.renderMessage(user[index]);
        index -= 1;
      }
      
      
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};


app.clearMessages = function() {
  $('#chats').empty();
};

app.renderMessage = function(message) {
  var userName = message.username;
  var userText = message.text;
  var userRoomName = message.roomname;
  var userObjID = message.objectId;
  var userCreated = message.updatedAt;
  $('#chats').prepend('<p class="username">' + userName + ': ' + userText + '</p><br>');
  app.renderRoom(userRoomName);  
};


app.renderRoom = function(location) {
  if (!_.contains(app.roomsCollector, location)) {
    app.roomsCollector.push(location);
    $('#roomSelect').find('#chat-rooms').append('<option value="' + location + '">' + location + '</options>');

  }
};


app.handleUsernameClick = function() {

};

app.handleSubmit = function() {

};


$(document).ready(function() {
  app.fetch();

  var myName = this.location.search.slice(10);

  // Send a chat message
  $('#send').on('click', function() {
    var myText = $('#message').val();
    var myMessage = {
      username: myName,
      text: myText,
      roomname: 'lobby'
    };
    app.send(myMessage);

    app.fetch();
  });

  // Select a lobby
  

  // Refresh button here
  setInterval(function() {
    app.clearMessages();
    app.fetch();
    window.scrollTo(0, 0);
  }, 10000);


});

