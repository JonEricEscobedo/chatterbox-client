
// YOUR CODE HERE:
var app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages', 
  username: this.location.search.slice(10),
  roomname: 'lobby',
  messages: [],
  lastMessageId: 0,
  roomCollector: {},
  friends: {},

  init: () => {
    // Listeners
    $('#chats').on('click', '.username', app.handleUsernameClick);
    $('#send').on('submit', app.handleSubmit);
    $('#roomSelect').change(app.handleRoomChange);

    // Load messages
    app.fetch();

    // Update every three seconds
    setInterval(function() {
      app.fetch(true);
    }, 3000);

  }, // End of app.init

  send: (message) => {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');

        // Clear text box upon successful sent message
        $('#message').val('');

        // Load messages upon successful sent message
        app.fetch();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }, // End of app.send

  fetch: () => {
    $.ajax({
      url: app.server,
      type: 'GET',
      data: { order: '-createdAt' },
      contentType: 'application/json',
      success: function(data) {
        console.log('chatterbox: Messages received!', data);

        // Cache old messages
        app.messages = data.results;
        
        // Get newest message
        var mostRecentMessage = data.results[0];

        // Store objectId to verify newest messages...
        if (mostRecentMessage.objectId !== app.lastMessageId) {
          // Render rooms
          app.renderRoomList(data.results);

          // Render messages
          app.renderMessages(data.results);

          // Store most recent message as lastMessageId
          app.lastMessageId = mostRecentMessage.objectId;
        }
      },
      error: function(data) {
        console.error('chatterbox: Failed to receive message', data)
      }
    });
  }, // End of app.fetch

  clearMessages: () => {
    $('#chats').html('');
  }, // End of app.clearMessages

  renderMessage: (message) => {
    // Create a div to hold chats
    var $chat = $('<div class="chat"></div>');

    // Store username
    var $username = $('<span class="username"></span>');
    $username.text(message.username + ': ').attr('data-username', message.username).appendTo($chat);

    // Add friend class
    if (app.friends[message.username] === true) {
      $username.addClass('friend');
    }

    // Store message text
    var $message = $('<br><span></span>');
    $message.text(message.text).appendTo($chat);

    // Store time
    var $time = $('<span class="the-time text-muted"</span>')
    $time.text(' ' + jQuery.timeago(message.updatedAt)).appendTo($message);

    // Print to web
    $('#chats').append($chat);
  }, // End of app.renderMessage

  renderMessages: (messages) => {
    app.clearMessages();

    var roomMessages = messages.filter(function(message) {
      return message.roomname === app.roomname || app.roomname === 'lobby' && !message.roomname;
    });

    roomMessages.forEach(function(message) {
      app.renderMessage(message);
    });
  }, // End of app.renderMessages

  renderRoomList: (messages) => {
    if (messages) {
      messages.forEach(function(message) {
        if (!app.roomCollector.hasOwnProperty(message.roomname)) {
          app.renderRoom(message.roomname);
          app.roomCollector[message.roomname] = message.roomname;
        }
      });
    }
  }, // End of app.renderRoomList

  renderRoom: (roomname) => {
    var $room = $('#roomSelect');

    // Store room names
    var $roomname = $('<option></option>').val(roomname).text(roomname);

    // Print to menu
    $room.append($roomname);

  }, // End of app.renderRoom

  handleUsernameClick: (event) => {
    var username = $(event.target).data('username');
    var name = '[data-username="' + username + '"]';
    
    app.friends[username] = !app.friends[username];
    
    // Add 'friend' CSS class to all of that user's messages
    $(name).toggleClass('friend');

  }, // End of app.handleUsernameClick

  handleSubmit: () => {
    var message = {
      username: app.username,
      text: $('#message').val(),
      roomname: app.roomname || 'lobby'
    };
    
    app.send(message);

    event.preventDefault();

  }, // End of app.handleSubmit

  handleRoomChange: () => {
    var roomChoice = $('#roomSelect').find(':selected').text();
    if (roomChoice === 'New room...') {
      var newName = prompt('Name your new room!');
      if (newName) {
        // Set as the current room
        app.roomname = newName;

        // Add to collection of rooms
        app.roomCollector[newName] = newName;

        // Add the room to the menu
        app.renderRoom(newName);

        // Select the menu option
        $("#roomSelect").val(newName);
      }
    } else {
      app.roomname = roomChoice;
    }
    app.renderMessages(app.messages);
  } // End of app.handleRoomChange

}; // End of app.js

