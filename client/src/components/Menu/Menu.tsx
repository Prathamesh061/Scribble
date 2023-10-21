import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faEraser,
  faArrowLeftRotate,
  faArrowRightRotate,
  faCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import { TypedUseSelectorHook, useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { actionItemClick, menuItemClick } from "../../features/menu/menuSlice";
import { MENU_ITEMS } from "../../constants/constants";
const useAppDispatch: () => AppDispatch = useDispatch;
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

function Menu() {
  const dispatch = useAppDispatch();
  const activeMenuItem = useAppSelector((state) => state.menu.activeMenuItem);

  const handleMenuClick = (itemName: string) => {
    dispatch(menuItemClick(itemName));
  };

  const handleActioItemClick = (itemName: string) => {
    dispatch(actionItemClick(itemName));
  };

  return (
    <div className="flex justify-center relative top-10">
      <div
        className="flex w-full mx-4 sm:mx-0 sm:w-1/2  px-4 py-2 justify-around items-center border-2 border-black rounded-lg shadow-lg shadow-black-400 bg-orange-100"
        style={{ maxWidth: 500 }}
      >
        <div
          className={`flex flex-col justify-center items-center bg-orange-300 rounded-xl hover:cursor-pointer hover:bg-orange-400 focus:bg-orange-400 ${
            activeMenuItem === MENU_ITEMS.PENCIL
              ? "bg-orange-400 outline-dashed"
              : null
          }`}
          onClick={() => handleMenuClick(MENU_ITEMS.PENCIL)}
        >
          <FontAwesomeIcon icon={faPencil} className="h-4 w-4 p-2" />
        </div>
        <div
          className={`flex flex-col justify-center items-center bg-orange-300 rounded-xl hover:cursor-pointer hover:bg-orange-400 focus:bg-orange-400 ${
            activeMenuItem === MENU_ITEMS.ERASER
              ? "bg-orange-400 outline-dashed"
              : null
          }`}
          onClick={() => handleMenuClick(MENU_ITEMS.ERASER)}
        >
          <FontAwesomeIcon icon={faEraser} className="h-4 w-4 p-2" />
        </div>
        <div
          className="flex flex-col justify-center items-center bg-orange-300 rounded-xl hover:cursor-pointer hover:bg-orange-400 focus:bg-orange-400"
          onClick={() => handleActioItemClick(MENU_ITEMS.UNDO)}
        >
          <FontAwesomeIcon icon={faArrowLeftRotate} className="h-4 w-4 p-2" />
        </div>
        <div
          className="flex flex-col justify-center items-center bg-orange-300 rounded-xl hover:cursor-pointer hover:bg-orange-400 focus:bg-orange-400"
          onClick={() => handleActioItemClick(MENU_ITEMS.REDO)}
        >
          <FontAwesomeIcon icon={faArrowRightRotate} className="h-4 w-4 p-2" />
        </div>
        <div
          className="flex flex-col justify-center items-center bg-orange-300 rounded-xl hover:cursor-pointer hover:bg-orange-400 focus:bg-orange-400"
          onClick={() => handleActioItemClick(MENU_ITEMS.DOWNLOAD)}
        >
          <FontAwesomeIcon icon={faCircleDown} className="h-4 w-4 p-2" />
        </div>
      </div>
    </div>
  );
}

export default Menu;
