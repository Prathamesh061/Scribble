// import { useRef, useEffect } from "react";
// import socket from "../../../socket";

// function Board() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//    useEffect(() => {
//         if (!canvasRef.current) return
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d')

//         const changeConfig = (color: string, size:number) => {
//             if(context) {
//               context.strokeStyle = color
//             context.lineWidth = size
//             }
//         }

//         const handleChangeConfig = (config) => {
//             changeConfig(config.color, config.size)
//         }
//         changeConfig(color, size)
//         socket.on('changeConfig', handleChangeConfig)

//         return () => {
//             socket.off('changeConfig', handleChangeConfig)
//         }
//     }, [color, size])

//   useEffect(() => {
//     if (!canvasRef.current) return;
//     const canvas = canvasRef.current;

//     const context: CanvasRenderingContext2D | null = canvas.getContext("2d");

//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;

//     function updateWindow() {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     }
//     window.addEventListener("resize", updateWindow);

//     const beginPath = (x: number, y: number) => {
//       context?.beginPath();
//       context?.moveTo(x, y);
//     };

//     const drawLine = (x: number, y: number) => {
//       context?.lineTo(x, y);
//       context?.stroke();
//     };
//     const handleMouseDown = (e: ) => {
//       shouldDraw.current = true;
//       beginPath(
//         e.clientX || e.touches[0].clientX,
//         e.clientY || e.touches[0].clientY
//       );
//       socket.emit("beginPath", {
//         x: e.clientX || e.touches[0].clientX,
//         y: e.clientY || e.touches[0].clientY,
//       });
//     };

//     const handleMouseMove = (e) => {
//       if (!shouldDraw.current) return;
//       drawLine(
//         e.clientX || e.touches[0].clientX,
//         e.clientY || e.touches[0].clientY
//       );
//       socket.emit("drawLine", {
//         x: e.clientX || e.touches[0].clientX,
//         y: e.clientY || e.touches[0].clientY,
//       });
//     };

//     const handleMouseUp = (e) => {
//       shouldDraw.current = false;
//       const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
//       drawHistory.current.push(imageData);
//       historyPointer.current = drawHistory.current.length - 1;
//     };

//     const handleBeginPath = (path) => {
//       beginPath(path.x, path.y);
//     };

//     const handleDrawLine = (path) => {
//       drawLine(path.x, path.y);
//     };

//     return () => {
//       canvas.removeEventListener("mousedown", handleMouseDown);
//       canvas.removeEventListener("mousemove", handleMouseMove);
//       canvas.removeEventListener("mouseup", handleMouseUp);

//       canvas.removeEventListener("touchstart", handleMouseDown);
//       canvas.removeEventListener("touchmove", handleMouseMove);
//       canvas.removeEventListener("touchend", handleMouseUp);

//       window.removeEventListener("resize", updateWindow);

//       socket.off("beginPath", handleBeginPath);
//       socket.off("drawLine", handleDrawLine);
//     };
//   }, [canvasRef]);
//   return <canvas ref={canvasRef} className="absolute bg-gray-200"></canvas>;
// }

// export default Board;
