import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../components/Login/Login";
import PrivateRoutes from "../utils/PrivateRoutes";
import Home from "../components/Home/Home";
import Register from "../components/Register/Register";

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route element={<PrivateRoutes />}>
                        <Route element={<Home />} path="/home" />
                    </Route>
                    <Route element={<Login />} path="/" />
                    <Route element={<Register />} path="/register" />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
