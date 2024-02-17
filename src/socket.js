import { io } from "socket.io-client";
const ENDPOINT = 'https://chatapp-y8yi.onrender.com/'

var socket = io(ENDPOINT);

export default socket
