import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import CreateImagePoisson from "./CreateImagePoisson";

export default function ImmortaliseTaPeche() {
  return (
    <div>
      <p>ok</p>
      <Navbar />

      <p className="texte-photo">Prends la photographie de ta prise</p>
      <CreateImagePoisson />
      <Footer />
    </div>
  );
}
