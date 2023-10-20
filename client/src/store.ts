import { configureStore } from "@reduxjs/toolkit";
import MenuReducer from "./features/menu/menuSlice";
import ToolboxReducer from "./features/toolbox/toolboxSlice";

export const store = configureStore({
  reducer: {
    menu: MenuReducer,
    toolbox: ToolboxReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
