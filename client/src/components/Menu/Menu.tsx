import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faEraser,
  faRotateLeft,
  faRotateRight,
  faFileArrowDown,
  faArrowLeftRotate,
  faArrowRightRotate,
  faCircleDown,
} from "@fortawesome/free-solid-svg-icons";

function Menu() {
  return (
    <div className="flex justify-center relative top-10">
      <div
        className="flex w-full mx-4 sm:mx-0 sm:w-1/2  px-4 py-2 justify-around items-center border-2 border-black rounded-lg shadow-lg shadow-black-400 bg-orange-100"
        style={{ maxWidth: 500 }}
      >
        <div className="flex flex-col justify-center items-center bg-orange-300 rounded-xl hover:cursor-pointer hover:bg-orange-400 focus:bg-orange-400">
          <FontAwesomeIcon icon={faPencil} className="h-4 w-4 p-2" />
        </div>
        <div className="flex flex-col justify-center items-center bg-orange-300 rounded-xl hover:cursor-pointer hover:bg-orange-400 focus:bg-orange-400">
          <FontAwesomeIcon icon={faEraser} className="h-4 w-4 p-2" />
        </div>
        <div className="flex flex-col justify-center items-center bg-orange-300 rounded-xl hover:cursor-pointer hover:bg-orange-400 focus:bg-orange-400">
          <FontAwesomeIcon icon={faArrowLeftRotate} className="h-4 w-4 p-2" />
        </div>
        <div className="flex flex-col justify-center items-center bg-orange-300 rounded-xl hover:cursor-pointer hover:bg-orange-400 focus:bg-orange-400">
          <FontAwesomeIcon icon={faArrowRightRotate} className="h-4 w-4 p-2" />
        </div>
        <div className="flex flex-col justify-center items-center bg-orange-300 rounded-xl hover:cursor-pointer hover:bg-orange-400 focus:bg-orange-400">
          <FontAwesomeIcon icon={faCircleDown} className="h-4 w-4 p-2" />
        </div>
      </div>
    </div>
  );
}

export default Menu;
