//all npm modules
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const {Server} = require("socket.io");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const path = require("path");
const hbs = require("hbs");
const {router} = require("./router/routes");

const io = new Server(server);
let user = {};
io.on("connection",(socket)=>{

    // console.log("joined")
    socket.on("username",(msg)=>{
      user[socket.id] = msg;
      socket.emit("add-username",user);
      socket.broadcast.emit("add-username",user);

    });

 
    socket.on("message",(msg)=>{
    let sent = {
        name:user[msg["id"]],
        message:msg["message"],
        
    }
    // console.log(sent)
     socket.broadcast.emit("message",sent);


    });

    socket.on("disconnect",()=>{
//  console.log("disconnection"+socket.id);
 delete user[socket.id];
 console.log(user)
 socket.broadcast.emit("disconnection",user);
    })

});

//all middlewares
app.use("/public",express.static(path.join(__dirname,"/public")));
app.use(express.json());
app.use(express.urlencoded());
app.use(helmet());
app.use(cookieParser());
app.use("/",router);

app.set("view engine","hbs");
hbs.registerPartials(path.join(__dirname,"/views/partials"));

app.get("/",(req,res)=>{
res.render("chat")
})




server.listen(8000,"127.0.0.1",()=>{
    console.log("the application is running on 127.0.0.1:8000");
})
