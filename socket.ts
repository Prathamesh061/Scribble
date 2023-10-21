import { io } from "socket.io-client";
const URL = "http://192.168.1.5:3000";
const socket = io(URL);

socket.on("connection", (socket) => {
  console.log(socket);
  ("Successfully connected!");
});
export default socket;
