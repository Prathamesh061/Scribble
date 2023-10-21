import { useRef, useEffect } from "react";
import socket from "../../../socket";
import { TypedUseSelectorHook, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { useSelector } from "react-redux";
import {
  changeBrushSize,
  changeColor,
} from "../../features/toolbox/toolboxSlice";
import { MENU_ITEMS } from "../../constants/constants";
import { actionItemClick } from "../../features/menu/menuSlice";
const useAppDispatch: () => AppDispatch = useDispatch;
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

interface Path {
  x: number;
  y: number;
}

function Board() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldDraw = useRef<boolean>(false);
  const drawHistory = useRef<ImageData[]>([]);
  const historyPointer = useRef<number>(0);
  const dispatch = useAppDispatch();
  const { activeMenuItem, actionMenuItem } = useAppSelector(
    (state) => state.menu
  );

  const { color, size } = useAppSelector(
    (state) => state.toolbox[activeMenuItem]
  );

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (actionMenuItem === MENU_ITEMS.DOWNLOAD) {
      const imageData = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");

      downloadLink.href = imageData;
      downloadLink.download = "scribble.png";
      downloadLink.click();
    } else if (
      actionMenuItem === MENU_ITEMS.UNDO ||
      actionMenuItem === MENU_ITEMS.REDO
    ) {
      if (historyPointer.current > 0 && actionMenuItem === MENU_ITEMS.UNDO)
        historyPointer.current -= 1;
      if (
        historyPointer.current < drawHistory.current.length - 1 &&
        actionMenuItem === MENU_ITEMS.REDO
      )
        historyPointer.current += 1;
      const imageData = drawHistory.current[historyPointer.current];
      context?.putImageData(imageData, 0, 0);
    }
    dispatch(actionItemClick(null));
  }, [actionMenuItem, dispatch]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const changeConfig = (
      color: string | undefined,
      size: number | undefined
    ) => {
      if (context) {
        context.strokeStyle = color ?? context.strokeStyle;
        context.lineWidth = (size ?? context.lineWidth) * 2;
      }
    };

    changeConfig(color, size);

    function handleChangeConfig({
      color,
      size,
    }: {
      color: string;
      size: number;
    }) {
      dispatch(changeBrushSize({ item: activeMenuItem, size: size }));
      dispatch(changeColor({ item: activeMenuItem, color: color }));
    }

    socket.on("changeConfig", handleChangeConfig);

    return () => {
      socket.off("changeConfig", handleChangeConfig);
    };
  }, [color, size]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context: CanvasRenderingContext2D | null = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function updateWindow() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", updateWindow);

    const beginPath = (x: number, y: number) => {
      context?.beginPath();
      context?.moveTo(x, y);
    };

    const drawLine = (x: number, y: number) => {
      context?.lineTo(x, y);
      context?.stroke();
    };

    const handleMouseDown = (e: any) => {
      shouldDraw.current = true;
      beginPath(
        e.clientX || e.touches[0].clientX,
        e.clientY || e.touches[0].clientY
      );
      socket.emit("beginPath", {
        x: e.clientX || e.touches[0].clientX,
        y: e.clientY || e.touches[0].clientY,
      });
    };

    const handleMouseMove = (e: any) => {
      if (!shouldDraw.current) return;
      drawLine(
        e.clientX || e.touches[0].clientX,
        e.clientY || e.touches[0].clientY
      );
      socket.emit("drawLine", {
        x: e.clientX || e.touches[0].clientX,
        y: e.clientY || e.touches[0].clientY,
      });
    };

    const handleMouseUp = (e: TouchEvent | MouseEvent) => {
      if (context) {
        shouldDraw.current = false;
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        drawHistory.current.push(imageData);
        historyPointer.current = drawHistory.current.length - 1;
      }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    canvas.addEventListener("touchstart", handleMouseDown);
    canvas.addEventListener("touchmove", handleMouseMove);
    canvas.addEventListener("touchend", handleMouseUp);

    const handleBeginPath = (path: Path) => {
      beginPath(path.x, path.y);
    };

    const handleDrawLine = (path: Path) => {
      drawLine(path.x, path.y);
    };

    socket.on("beginPath", handleBeginPath);
    socket.on("drawLine", handleDrawLine);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);

      canvas.removeEventListener("touchstart", handleMouseDown);
      canvas.removeEventListener("touchmove", handleMouseMove);
      canvas.removeEventListener("touchend", handleMouseUp);

      window.removeEventListener("resize", updateWindow);

      socket.off("beginPath", handleBeginPath);
      socket.off("drawLine", handleDrawLine);
    };
  }, [canvasRef]);
  return <canvas ref={canvasRef} className="absolute bg-gray-200"></canvas>;
}

export default Board;
