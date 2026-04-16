import { Route, Routes } from "react-router-dom";
import { Signin } from "../screens/Signin";

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Signin />} />
        </Routes>
    )
}