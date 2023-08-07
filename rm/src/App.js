import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Results from "./pages/Results/Results";
import Users from "./pages/Lists/Users";
import Products from "./pages/Lists/Products";
import Departments from "./pages/Lists/Departments";
import RiskFactors from "./pages/Lists/RiskFactors";
import Questionaire from "./pages/Questionnaire/Questionaire";
import Navbar from "./components/Navbar/Navbar";
import AuthPage from "./pages/AuthPage/AuthPage";
import Cookies from "js-cookie";
import SpinScreen from "./components/SpinScreen/SpinScreen";
import { useState } from "react";


function App() {
  const id = Cookies.get("id");
  const token = Cookies.get("token");
  const [spin, setSpin] = useState(false)

  return (
    <BrowserRouter>
      {token ? (
        <>
          {spin && <SpinScreen />}

          <Navbar id={id} />
          <Routes>
            <Route path="/" element={<Navigate to="list/products" replace />} />
            <Route path="list/users" element={<Users />} />
            <Route path="list/products" element={<Products />} />
            <Route path="list/departments" element={<Departments />} />
            <Route path="list/risk-factors" element={<RiskFactors />} />
            <Route path="results" element={<Results setSpin={setSpin} />} />
            <Route path="questionaire/:id" element={<Questionaire />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="*" element={<Navigate element={<Navigate to="/" replace />} />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
