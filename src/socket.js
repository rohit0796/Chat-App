import { io } from "socket.io-client";
const ENDPOINT = 'https://chat-app-backend-gules-beta.vercel.app/'

var socket = io(ENDPOINT);

export default socket
