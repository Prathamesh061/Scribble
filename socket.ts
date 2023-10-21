import { io } from "socket.io-client";
const URL = "https://scribble-l51d.onrender.com";
const socket = io(URL);

socket.on("connection", (socket) => {
  console.log(socket);
  ("Successfully connected!");
});
export default socket;
