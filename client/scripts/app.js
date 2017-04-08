// YOUR CODE HERE:
// http://parse.sfm8.hackreactor.com/
var app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  roomsCollector: [],
  room: 'lobby'
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

app.fetch = function(chatRoomName) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'GET',
    // data: JSON.stringify(data),
    data: {
      limit: 100,
      order: '-updatedAt'
    },
    dataType: 'json',
    contentType: 'application/json',
    success: function (data) {
      var user = data.results;
      var index = user.length - 1;
      // console.log(user);

      while (index >= 0) {

        if (chatRoomName === undefined) {
          if (user[index].roomname === app.room) { // Default case... use lobby
            app.renderMessage(user[index]);          
          }
        } else if (chatRoomName) {
          if (user[index].roomname === chatRoomName) {
            app.renderMessage(user[index]);
          }
        }
        app.renderRoom(user[index].roomname);
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
  var userName = app.sanitize(message.username);
  var userText = app.sanitize(message.text);
  var userRoomName = app.sanitize(message.roomname);
  var userObjID = app.sanitize(message.objectId);
  var userCreated = app.sanitize(message.updatedAt);
  var $chats = $('#chats');


  $chats.prepend('<p class="username ' + userRoomName + '">' + userRoomName + ': ' + userName + ': ' + userText + '</p><br>');
  app.renderRoom(userRoomName);  
};


app.renderRoom = function(location) {
  if (!_.contains(app.roomsCollector, location)) {
    app.roomsCollector.push(location);
    $('#roomSelect').find('#chat-rooms').append('<option value="' + location + '">' + location + '</options>');

  }
};

app.sanitize = function(value) {
  var lt = /</g, 
      gt = />/g, 
      ap = /'/g, 
      ic = /"/g;

  if (value === undefined) {
    return ''
  }

  return value.toString().replace(lt, "&lt;").replace(gt, "&gt;").replace(ap, "&#39;").replace(ic, "&#34;");
}




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
  $('#chat-rooms').change(function(data) {
    var roomChoice = $('#chat-rooms').find(':selected').text();
    // console.log(app.server + '/' + roomChoice);
    app.clearMessages();
    app.fetch(roomChoice);
    // $('#chats > :not(.' + !roomChoice + ')').toggle();

    // console.log(roomChoice);
  })
  // hide

  // Refresh button here
  setInterval(function() {
    app.clearMessages();
    app.fetch();
    window.scrollTo(0, 0);
  }, 10000);


});

