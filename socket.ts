import { io } from "socket.io-client";
const URL = "https://scribble-8qrk.onrender.com";
const socket = io(URL);

socket.on("connection", (socket) => {
  console.log(socket);
  ("Successfully connected!");
});
export default socket;
