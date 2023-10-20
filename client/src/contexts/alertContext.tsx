import { createContext, useContext, useState, ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";

export interface Alert {
  message: string;
  type: string;
}

type AlertContextType = (message: string, type: string) => void;

const AlertContext = createContext<AlertContextType | null>(null);

export function useAlert() {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}

interface AlertProviderProps {
  children: ReactNode;
}

export function AlertProvider({ children }: AlertProviderProps) {
  const [alert, setAlert] = useState<Alert | null>();

  const showAlert: AlertContextType = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  return (
    <AlertContext.Provider value={showAlert}>
      {children}
      {alert?.message && (
        <div
          className={`${
            alert?.type === "error"
              ? "bg-red-600"
              : alert?.type === "message"
              ? "bg-green-600"
              : "bg-yellow-600"
          } 
         text-white w-max-content flex justify-center items-center fixed bottom-10 left-1/2 transform -translate-x-1/2 pr-10 pl-5 
         py-4 rounded-lg z-50 font-bold font-sans`}
        >
          {alert.message}
          <span
            className="font-medium text-gray-700 cursor-pointer absolute right-2 text-lg"
            onClick={() => setAlert(null)}
          >
            <FontAwesomeIcon icon={faDeleteLeft} className="text-current" />
          </span>
        </div>
      )}
    </AlertContext.Provider>
  );
}
