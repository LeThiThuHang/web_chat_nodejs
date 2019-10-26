/* when the client load this file, it will automatically connect and so create a new socket */

$(function() {
    //make connection
    /* let socket = io.connect('http://localhost:8000'); */
    let Socket = io('https://webchatwithnodejs.herokuapp.com/', {transports: ['websocket']})

    //btns and inputs
    let username = $("#username")
    let send_username = $("#send_username")

    let message = $("#message")
    let send_message = $("#send_message")

    let chatroom = $("#chatroom")
    let chatroom_container = $(".row3_chatbox")

    let roomID = $("#join_a_room_input")

    //btns
    let create_room = $("#create_your_room_btn")
    let join_room = $("#join_a_room_btn")
    let copy_btn_container = $("#copy_btn_container")
    let join_common_room = $("#common_room_btn")

    //section
    let chat_section = $(".chat_section")
    let setting_section = $(".setting_container")
    let common_room = $(".common_room")

    let room_id_container = $("#room_id_container")

    //room

    let room_id

    let room_list = []

    //click on create room or join room, it will show different interface
    create_room.click(function() {
        chat_section.show()

        /* setting_section.removeClass('d-none') */
        setting_section.hide()
        common_room.hide()

        // create a room when click on button, emit an event
        let roomID = Math.random().toString(36).substring(2, 13);
        console.log(roomID)
        socket.emit('create', { roomID: roomID })

        // emit the function to backend so it will record each time the user create a room
        socket.emit('add_room_to_the_list', {created_roomID: roomID})

        // display the room ID 
        room_id_container.empty();
        copy_btn_container.empty();    
        room_id_container.append('<h2 id="room_id" >Your roomID is ' + roomID + '</h2>')
        copy_btn_container.append('<button type="button" class="btn btn-success" id ="copy_room_btn">Copy the room ID</button>')

        //change the variable room_id
        room_id = roomID
    })

    //copy function
    copy_btn_container.click(function() {

    let copyhelper = document.createElement("input");
    document.body.appendChild(copyhelper);
    copyhelper.value = room_id;
    copyhelper.select();

        try {
            let status =  document.execCommand('copy');

            if(!status) {
                alert("Can't copy text")
            } else {
                alert("Copied the text: " + room_id)
            }
        } catch(err) {
            alert('Unable to copy')
        }
    
    document.body.removeChild(copyhelper);

    })

    socket.on('update_room_list_frontend', function(data) {
        /* console.log('update room in front end')
        console.log(data)
        console.log(data['roomlist']) */
        room_list = data['roomlist']
        /* console.log(room_list) */
    })
    
    //enable the button when the text in the fill in room ID is filled
    $("#join_a_room_input").keyup(function() {
        let input_value = $(this).val()

        /* console.log(room_list)
        console.log(input_value) */

        if(input_value == '') {
            $("#join_a_room_btn").prop('disabled',true);
        } else {
            //check if the room id is existed in the room arrays
            if ( room_list.includes(input_value) ) {
                $("#join_a_room_btn").prop('disabled',false);
            } else {
                alert('Your room ID is not existing!')
            }
        }
    })

    

    join_room.click(function() {
        chat_section.show()

        /* setting_section.removeClass('d-none') */
        setting_section.hide()
        common_room.hide()

        //make the button disabled until the users click on fill in the room code

        //read the roomID from the input
        room_id = roomID.val()

        // display the room ID 
        room_id_container.empty();
        room_id_container.append('<h2>Welcome to room ' + room_id + '</h2>')

        //join a room when click on button, emit an event subscribe so backend will listen to it and join the room
        socket.emit('join_room', {room_id: room_id})

    })

    //join a common room 
    join_common_room.click(function() {
        chat_section.show()
        setting_section.hide()
        common_room.hide()

         // display the room ID 
         room_id_container.empty();
         room_id_container.append('<p style="font-size: 1rem">Welcome to the common room.</p>')

        socket.emit('join_common_room')

    })
    

    //emit a username
    send_username.click(function() {
        console.log(username.val())
            //passing the username and the roomID to the backend
        socket.emit('change_username', { username: username.val(), roomID: room_id })
            //clear the form after submit
        username.val("")
    })

    //emit a message
    send_message.click(function() {
        console.log(message.val())
        //passing the username and the roomID to the backend
        console.log(room_id)
        console.log(room_id == undefined)
        //if room_id length is NOT 11 meaning that the uers enter a common room, emit it to the common room
        if (room_id == undefined) {
            socket.emit("new_message", { message: message.val(), roomID: 'common' })
        } else {
            socket.emit("new_message", { message: message.val(), roomID: room_id })
        }

        //clear the message after submit
        message.val("")
    })

    //listen on new message which detais of who send from backend
    socket.on("new_message", (data) => {
        console.log(data)
        chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>")
        
        //scroll down
        chatroom_container.scrollTop(chatroom.outerHeight())

    })



});