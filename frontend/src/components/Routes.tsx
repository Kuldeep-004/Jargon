import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "../pages/Homepage";
import ProtectorRoute from "./ProtectorRoute";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Otp from "../pages/Otp";
import ForgotPass from "../pages/ForgotPass";
import UpdatePass from "../pages/UpdatePass";
import Dashboard from "../pages/Dashboard";
import Layouts from "./Layouts";

const Routess = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />}>
            <Route path="otp" element={<Otp />} />
          </Route>
          <Route path="/forgot-password" element={<ForgotPass />} />
          <Route path="/update-password/:token" element={<UpdatePass />} />
          <Route element={<ProtectorRoute />}>
            <Route element={<Layouts/>}>
                <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Routess;
