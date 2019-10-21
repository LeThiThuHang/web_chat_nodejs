/* when the client load this file, it will automatically connect and so create a new socket */

$(function(){
    var socket = io.connect('http://localhost:3000')
})