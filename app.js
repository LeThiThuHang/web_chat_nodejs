const express = require('express');
const app = express();

//set the template engine ejs
app.set('view engine', 'ejs');

//middlewares
app.use(express.static('public'))


let roomID = '000'

//routes
app.get('/', (req, res) => {
    res.render('index', { roomID: roomID })
})


//listen on port 3000
server = app.listen(3000)


//socket.io instantiation
const io = require("socket.io")(server)

let room_list = ['common'];

//listen on every connection
//socket represent each client connected to our server
io.on('connection', (socket) => {
    console.log('New user connected')
    //need to put this function right in the connection so new user can load currently existing room ID and check if the room ID exsting when 
    //...they fill in the room ID in the input field 
    socket.emit('update_room_list_frontend', {roomlist: room_list})

    //create a room 
    socket.on('create', function(data) {
        socket.join(data.roomID);
        console.log(data.roomID);
        //this is to pass roomID to the index.ejs
        roomID = data.roomID;
    });

    //listen to the room from the front end and put the room id into the room list
    socket.on('add_room_to_the_list', function(data) {
        room_list.push(data.created_roomID)
        /* console.log(room_list)
        console.log(typeof(room_list)) */
    })

    //default username
    socket.username = "Anonymous"

    //listen on change username
    socket.on('change_username', (data) => {
        socket.username = data.username
    })

    //listen on update new message
    socket.on('new_message', (data) => {
        console.log('back end emit new message')
        console.log(data.roomID)
            //backend get the new message from client with the details of who sending
            //and then emit back to the front end
            //broadcast the new message to sockets ( represent all sockets)
        io.to(data.roomID).emit('new_message', {
            message: data.message,
            username: socket.username
        })

    })

    //listen on when users join the room
    socket.on('join_room', function(data) {
        console.log('join_room')
        console.log(data.room_id)
        socket.join(data.room_id);
    })

    //listen on when users join common room
    socket.on('join_common_room', function(data) {
        socket.join(room_list[0])
    })


})