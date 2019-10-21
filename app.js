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
    socket.on('create', function(room) {
        socket.join(room);
        console.log(room);
        roomID = room;
    });

    //default username
    socket.username = "Anonymous"

    //listen on change username
    socket.on('change_username', (data) => {
        socket.username = data.username
    })

    socket.on('new_message', (data) => {
        console.log('back end emit new message')
            //backend get the new message from client with the details of who sending
            //and then emit back to the front end
            //broadcast the new message to sockets ( represent all sockets)
        io.sockets.emit('new_message', {
            message: data.message,
            username: socket.username
        })

    })


})