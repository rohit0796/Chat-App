import { io } from "socket.io-client";
const ENDPOINT = "https://chatapp-y8yi.onrender.com/"//'http://localhost:5000/'

var socket = io(ENDPOINT);

export default socket
