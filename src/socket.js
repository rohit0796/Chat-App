import { io } from "socket.io-client";
const ENDPOINT = 'https://chat-app-backend-2hyehym6y-rohit0796.vercel.app/'

var socket = io(ENDPOINT);

export default socket