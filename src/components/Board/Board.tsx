import { useRef, useEffect, useState } from "react";
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
  const [isEraserActive, setIsEraserActive] = useState<boolean>(false);
  const [activeAction, setActiveAction] = useState<string>("");
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
      actionMenuItem === MENU_ITEMS.REDO ||
      activeAction
    ) {
      if (
        actionMenuItem === MENU_ITEMS.UNDO ||
        activeAction === MENU_ITEMS.UNDO
      ) {
        if (historyPointer.current >= 0) {
          historyPointer.current -= 1;
        }
      } else if (
        activeAction === MENU_ITEMS.REDO ||
        (actionMenuItem === MENU_ITEMS.REDO &&
          historyPointer.current < drawHistory.current.length - 1)
      ) {
        historyPointer.current += 1;
      } else {
        return;
      }

      const imageData = drawHistory.current[historyPointer.current];

      if (imageData) {
        context?.putImageData(imageData, 0, 0);
      } else {
        context?.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    if (actionMenuItem) {
      socket.emit("actionTaken", {
        actionMenuItem: actionMenuItem,
      });
    }

    socket.on("actionTaken", ({ actionMenuItem }) => {
      setActiveAction(actionMenuItem);
    });

    dispatch(actionItemClick(null));
    setActiveAction("");
  }, [actionMenuItem, dispatch, activeAction, actionMenuItem]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const changeConfig = (
      color: string | undefined,
      size: number | undefined
    ) => {
      if (context) {
        if (activeMenuItem === MENU_ITEMS.ERASER || isEraserActive) {
          context.globalCompositeOperation = "destination-out";
          context.lineWidth = (size ?? context.lineWidth) * 2;
        } else {
          context.globalCompositeOperation = "source-over";
          context.strokeStyle = color ?? context.strokeStyle;
          context.lineWidth = (size ?? context.lineWidth) * 2;
        }
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
      dispatch(changeBrushSize({ item: MENU_ITEMS.PENCIL, size: size }));
      dispatch(changeBrushSize({ item: MENU_ITEMS.ERASER, size: size }));
      dispatch(changeColor({ item: activeMenuItem, color: color }));
    }

    socket.on("changeConfig", handleChangeConfig);

    socket.emit("activeItem", {
      activeMenuItem,
    });

    socket.on("activeItem", ({ activeMenuItem }) => {
      setIsEraserActive(activeMenuItem === MENU_ITEMS.ERASER);
      // dispatch(actionItemClick(MENU_ITEMS.ERASER));
    });

    return () => {
      socket.off("changeConfig", handleChangeConfig);
    };
  }, [color, size, activeMenuItem, isEraserActive]);

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

    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
      shouldDraw.current = true;
      beginPath(
        (e as MouseEvent).clientX || (e as TouchEvent).touches[0].clientX,
        (e as MouseEvent).clientY || (e as TouchEvent).touches[0].clientY
      );
      socket.emit("beginPath", {
        x: (e as MouseEvent).clientX || (e as TouchEvent).touches[0].clientX,
        y: (e as MouseEvent).clientY || (e as TouchEvent).touches[0].clientY,
      });
    };

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!shouldDraw.current) return;
      drawLine(
        (e as MouseEvent).clientX || (e as TouchEvent).touches[0].clientX,
        (e as MouseEvent).clientY || (e as TouchEvent).touches[0].clientY
      );
      socket.emit("drawLine", {
        x: (e as MouseEvent).clientX || (e as TouchEvent).touches[0].clientX,
        y: (e as MouseEvent).clientY || (e as TouchEvent).touches[0].clientY,
      });
    };

    const handleMouseUp = () => {
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
