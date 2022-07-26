/* eslint-disable react/function-component-definition */
import "./Contact.css";

import Navbar from "../components/Navbar";
import Formulaire from "../components/Formulaire";
// import ContactCard from "@components/CarteContact";
import Footer from "../components/Footer";

const Contact = () => {
  return (
    <>
      <div className="header" />
      <Navbar />
      <h1 className="h1-contact"> Des choses a améliorer ? Contacter moi</h1>

      <div className="corpsContact" />
      <Formulaire />

      <Footer />
    </>
  );
};

export default Contact;
