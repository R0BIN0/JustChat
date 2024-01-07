import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./views/Form/Login/Login";
import PrivateRoutes from "./utils/PrivateRoutes";
import Home from "./views/Home/Home";
import Register from "./views/Form/Register/Register";
import useWebSocket from "./hooks/useWebSocket";
import Chat from "./views/Chat/Chat";
import Navbar from "./components/Navbar/Navbar";
import Dialogs from "./components/Dialogs/Dialogs";

function App() {
  useWebSocket("ws://localhost:8000");

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Dialogs />
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route element={<Home />} path="/home" />
            <Route element={<Chat />} path="/chat/:id" />
          </Route>
          <Route element={<Login />} path="/" />
          <Route element={<Register />} path="/register" />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
