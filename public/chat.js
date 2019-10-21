/* when the client load this file, it will automatically connect and so create a new socket */

$(function() {
    //make connection
    var socket = io.connect('http://localhost:3000');

    //btns and inputs
    var username = $("#username")
    var send_username = $("#send_username")

    var message = $("#message")
    var send_message = $("#send_message")

    var chatroom = $("#chatroom")



    //emit a username
    send_username.click(function() {
        console.log(username.val())
        socket.emit('change_username', { username: username.val() })
            //clear the form after submit
        username.val("")
    })

    //emit a message
    send_message.click(function() {
        console.log(message.val())
        socket.emit("new_message", { message: message.val() })

        //clear the message after submit
        message.val("")
    })

    //listen on new message which detais of who send from backend
    socket.on("new_message", (data) => {
        console.log(data)
        chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>")
    })
});