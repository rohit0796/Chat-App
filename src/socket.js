import { io } from "socket.io-client";
const ENDPOINT = 'http://localhost:5000'

var socket = io(ENDPOINT);

export default socket