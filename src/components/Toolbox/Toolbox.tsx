import { faPaintBrush } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { COLORS, MENU_ITEMS } from "../../constants/constants";
import {
  changeColor,
  changeBrushSize,
} from "../../features/toolbox/toolboxSlice";
import socket from "../../../socket.ts";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
const useAppDispatch: () => AppDispatch = useDispatch;
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

function Toolbox() {
  const activeMenuItem = useAppSelector((state) => state.menu.activeMenuItem);

  const [openToolbox, setOpenToolbox] = useState<boolean>(false);

  const innerDivRef = useRef<HTMLDivElement | null>(null);

  const showStrokeToolOption = activeMenuItem === MENU_ITEMS.PENCIL;

  const showBrushToolOption =
    activeMenuItem === MENU_ITEMS.PENCIL ||
    activeMenuItem === MENU_ITEMS.ERASER;

  let { color, size } = useAppSelector(
    (state: RootState) => state.toolbox[activeMenuItem ?? MENU_ITEMS.PENCIL]
  );

  const dispatch = useAppDispatch();

  const updateBrushSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      changeBrushSize({ item: MENU_ITEMS.PENCIL, size: e.target.value })
    );
    dispatch(
      changeBrushSize({ item: MENU_ITEMS.ERASER, size: e.target.value })
    );
    socket.emit("changeConfig", { color, size: e.target.value });
  };

  const updateColor = (newColor: string) => {
    dispatch(changeColor({ item: activeMenuItem, color: newColor }));
    socket.emit("changeConfig", { color: newColor, size });
  };

  let bgCol = `bg-gray-600`;

  switch (color) {
    case "orange":
      bgCol = "bg-orange-400";
      break;

    case "blue":
      bgCol = "bg-blue-400";
      break;

    case "yellow":
      bgCol = "bg-yellow-400";
      break;

    case "red":
      bgCol = "bg-red-400";
      break;

    case "green":
      bgCol = "bg-green-400";
      break;

    case "white":
      bgCol = "bg-orange";
      break;
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        innerDivRef.current &&
        !innerDivRef.current.contains(event.target as ChildNode)
      ) {
        setOpenToolbox(false);
      }
    };

    document.documentElement.addEventListener("click", handleClickOutside);

    return () => {
      document.documentElement.removeEventListener("click", handleClickOutside);
    };
  }, [setOpenToolbox]);

  return (
    <div
      ref={innerDivRef}
      className={`absolute ${bgCol} top-1/3 left-5 rounded-full flex flex-col justify-center items-center hover:cursor-pointer border-2 border-gray-500 shadow-lg`}
      onClick={() => setOpenToolbox(!openToolbox)}
    >
      <FontAwesomeIcon
        icon={faPaintBrush}
        className={`h-4 w-4 p-2 text-black`}
      />
      <div
        className={`absolute left-12 ${
          openToolbox ? "block" : "hidden"
        } border-2 border-black bg-orange-100 px-4 py-2 rounded-lg shadow-lg hover:cursor-default flex flex-col items-center`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {showStrokeToolOption && (
          <div className="w-full">
            <h3 className="font-serif text-gray-700">Stroke color</h3>
            <div className="flex w-full justify-around py-2 mb-3">
              <div
                className="h-4 w-4 rounded-sm hover:cursor-pointer hover:scale-105 transition-all hover:outline focue:outline outline-gray-500"
                style={{ backgroundColor: COLORS.BLACK }}
                onClick={() => updateColor(COLORS.BLACK)}
              />
              <div
                className="h-4 w-4 rounded-sm hover:cursor-pointer hover:scale-105 transition-all hover:outline focue:outline outline-gray-500"
                style={{ backgroundColor: COLORS.RED }}
                onClick={() => updateColor(COLORS.RED)}
              />
              <div
                className="h-4 w-4 rounded-sm hover:cursor-pointer hover:scale-105 transition-all hover:outline focue:outline outline-gray-500"
                style={{ backgroundColor: COLORS.GREEN }}
                onClick={() => updateColor(COLORS.GREEN)}
              />
              <div
                className="h-4 w-4 rounded-sm hover:cursor-pointer hover:scale-105 transition-all hover:outline focue:outline outline-gray-500"
                style={{ backgroundColor: COLORS.BLUE }}
                onClick={() => updateColor(COLORS.BLUE)}
              />
              <div
                className="h-4 w-4 rounded-sm hover:cursor-pointer hover:scale-105 transition-all hover:outline focue:outline outline-gray-500"
                style={{ backgroundColor: COLORS.ORANGE }}
                onClick={() => updateColor(COLORS.ORANGE)}
              />
              <div
                className="h-4 w-4 rounded-sm  hover:cursor-pointer hover:scale-105 transition-all hover:outline focue:outline outline-gray-500"
                style={{ backgroundColor: COLORS.YELLOW }}
                onClick={() => updateColor(COLORS.YELLOW)}
              />
            </div>
          </div>
        )}
        {showBrushToolOption && (
          <div>
            <h3 className="font-serif text-gray-700">Brush size</h3>
            <input
              type="range"
              step={1}
              min={1}
              max={10}
              className="hover:cursor-pointer"
              onChange={updateBrushSize}
              value={size}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Toolbox;
