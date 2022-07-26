import logo from "../assets/Images/logoPoisson.jpg";
import Login from "./Login";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import RegisterUser from "./RegisterUser";
// import Footer from "../components/Footer";
export default function Home() {
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>Bienvenue sur App_Pêche </p>

      <Navbar />

      <Login />
      <RegisterUser />

      <Footer />
    </header>
  );
}
