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
  const activeMenuItem = useAppSelector((state) => state.menu.actionMenuItem);
  const [openToolbox, setOpenToolbox] = useState<boolean>(false);
  const innerDivRef = useRef(null);

  const showStrokeToolOption = activeMenuItem === MENU_ITEMS.PENCIL;
  const showBrushToolOption =
    activeMenuItem === MENU_ITEMS.PENCIL ||
    activeMenuItem === MENU_ITEMS.ERASER;

  //   const { color, size } = useAppSelector(
  //     (state: RootState) => state.toolbox[activeMenuItem]
  //   );

  const dispatch = useAppDispatch();

  //   const updateBrushSize = (e) => {
  //     changeBrushSize({ item: activeMenuItem, size: e.target.value });
  //     socket.emit("changeConfig", { color, size: e.target.value });
  //   };

  const updateColor = (newColor: string) => {
    dispatch(changeColor({ item: activeMenuItem, color: newColor }));
    // socket.emit("changeConfig", { color: newColor, size });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (innerDivRef.current && event.target == document.documentElement) {
        setOpenToolbox(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [setOpenToolbox]);

  return (
    <div
      className="absolute bg-red-200 top-1/3 left-5 rounded-full flex flex-col justify-center items-center hover:cursor-pointer"
      onClick={() => setOpenToolbox(!openToolbox)}
    >
      <FontAwesomeIcon
        icon={faPaintBrush}
        className={`h-4 w-4 p-2 text-red-500`}
      />
      <div
        ref={innerDivRef}
        className={`absolute left-12 ${
          openToolbox ? "block" : "hidden"
        } border-2 border-black px-4 py-2 rounded-lg bg-red-200 shadow-lg hover:cursor-default flex flex-col items-center`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
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
        <div>
          <h3 className="font-serif text-gray-700">Brush size</h3>
          <input
            type="range"
            step={1}
            min={1}
            max={10}
            className="hover:cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

export default Toolbox;
