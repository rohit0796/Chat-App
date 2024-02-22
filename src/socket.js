import { io } from "socket.io-client";
const ENDPOINT = "http://localhost:5000"//'https://chatapp-y8yi.onrender.com/'

var socket = io(ENDPOINT);

export default socket
