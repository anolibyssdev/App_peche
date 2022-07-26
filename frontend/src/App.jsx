import { Routes, Route } from "react-router-dom";
// import Admin from "@pages/Admin";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
// import RegisterUser from "./pages/RegisterUser";
import Utilisateurs from "./pages/Utilisateur";
import AccueilAdmin from "./pages/pagesadmin/AccueilAdmin";
import Accueil from "./pages/Accueil";
import { userContext } from "./contexts/UserContext";
import "./App.css";

import LieuxDePeche from "./pages/LieuxDePeche";
import ImmortaliseTaPeche from "./pages/ImmortaliseTaPeche";

function App() {
  const { state } = userContext();

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="login" element={<Login />} />
        <Route path="trouver_un_lieu" element={<LieuxDePeche />} />
        <Route path="creer_photo" element={<ImmortaliseTaPeche />} />
        <Route path="utilisateur" element={<Utilisateurs />} />
        <Route path="contact" element={<Contact />} />
        {/* <Route path="register" element={<RegisterUser />} /> */}
        {!state.id ? (
          <Route path="*" element={<Accueil />} />
        ) : (
          <Route path="admin">
            {/* <Route path="" element={<Admin />} /> */}
            <Route path="accueil" element={<AccueilAdmin />} />
          </Route>
        )}
        <Route path="*" element={<Accueil />} />
      </Routes>
    </div>
  );
}

export default App;
