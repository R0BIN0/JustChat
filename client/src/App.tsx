import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./views/Form/Login/Login";
import PrivateRoutes from "./utils/PrivateRoutes";
import Home from "./views/Home/Home";
import Register from "./views/Form/Register/Register";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<PrivateRoutes />}></Route>
          <Route element={<Login />} path="/login" />
          <Route element={<Register />} path="/register" />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
