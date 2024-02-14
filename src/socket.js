import { io } from "socket.io-client";
const ENDPOINT = 'http://localhost:1337/'

var socket = io(ENDPOINT);

export default socket