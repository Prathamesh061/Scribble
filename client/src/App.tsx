import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Board from "./components/Board/Board";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Board />} />
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
