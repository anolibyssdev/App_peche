/* eslint-disable react/function-component-definition */
// import Navbar from "./components/Navbar";
import "./Accueil.css";
// import LieuxDePeche from "@pages/LieuxDePeche";
// import Login from "./Login";
import Navbar from "@components/Navbar";

// import PartageMaPeche from "@components/PartageMaPeche";
import Footer from "../components/Footer";

const Accueil = () => {
  return (
    <div>
      <Navbar />

      <div className="accueil" />
      <div className="header" />
      {/* <div className="corpsHomepage" /> */}
      <div className="presentation">
        <h1>Présentation</h1>
        <p>Bienvenue sur la page App-Pêche🎣</p>

        <img
          className="picture"
          src=".././assets/Images/pecheur.png"
          alt="dessin de pecheur"
        />
        <p>Une fois connecté vous pourrez localiser un cours d'eau</p>
      </div>
      <Footer />
    </div>
  );
};

export default Accueil;
