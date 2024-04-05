const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path'); 


const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const liveUsers = new Set();

const socketIdMap = new Map();

io.on('connection', (socket) => {
  console.log('A user connected ', socket.id);

  socket.on('submitForm',(userData)=>{
  


  
    userData.socketId = socket.id
    liveUsers.add(userData);
  
    io.emit('newUser', userData);
  
    

  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    liveUsers.forEach((user) => {
      if (user.socketId === socket.id) {
        liveUsers.delete(user);
        io.emit('userLeft', user);
      }
    });
  });
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.resolve("./")); 



app.get('/', (req, res) => {
  res.render('form'); 
});
   


app.get('/liveUsers', (req, res) => {
  res.render('liveUsers', { liveUsers }); 
});



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
