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

//listen on every connection
//socket represent each client connected to our server
io.on('connection', (socket) => {
    console.log('New user connected')

    //create a room 
    socket.on('create', function(data) {
        socket.join(data.roomID);
        console.log(data.roomID);
        //this is to pass roomID to the index.ejs
        roomID = data.roomID;
    });

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


})