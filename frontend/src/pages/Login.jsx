/* eslint-disable no-alert */
import "./Login.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@services/axios";
import { userContext } from "../contexts/UserContext";

export default function Login() {
  const { dispatch } = userContext();
  const navigate = useNavigate();
  const [utilisateurData, setUtilisateurdata] = useState({
    email: "",
    mot_de_pass: "",
  });

  const handleInputChange = (e) => {
    setUtilisateurdata((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!utilisateurData.email || !utilisateurData.password) {
      return alert("Vous devez fournir un email et un mot de passe");
    }
    try {
      const { data } = await axios.post("utilisateur/login", utilisateurData, {
        whithCredentials: true,
      });
      // console.log(data);
      setUtilisateurdata({ email: "", mot_de_pass: "" });
      dispatch({ type: "LOGIN", payload: data });
      if (data.role === "ADMIN") {
        return navigate("/Admin");
      }
      return null;
    } catch (err) {
      return alert(err.message);
    }
  };
  // const handlePasswordForgotten = async () => {
  //   if (!userData.email) {
  //     return alert("You must provide an email");
  //   }

  //   try {
  //     const { data } = await axios.post(
  //       "users/password-forgotten",
  //       {
  //         email: userData.email,
  //       },
  //       { withCredentials: true }
  //     );
  //     return alert(JSON.stringify(data));
  //   } catch (err) {
  //     return alert(err.message);
  //   }
  // };

  return (
    <div className="login">
      <section className="login_container">
        <h1 className="login-title">Connection</h1>
        <form className="champs" onSubmit={handleSubmit}>
          <label htmFor="email">
            Email:{" "}
            <input
              className="login_input"
              id="email"
              placeholder="Ton email"
              type="email"
              value={utilisateurData.email}
              onChange={handleInputChange}
            />
          </label>
          <label htmlFor="password">
            Password:{" "}
            <input
              className="login-input"
              id="password"
              placeholder="Ton mot de passe"
              type="password"
              value={utilisateurData.password}
              onChange={handleInputChange}
            />
          </label>
          <button className="login-btn" type="submit">
            Connection
          </button>
          {/* <button
            type="button"
            className="login-btn"
            onClick={handlePasswordForgotten}
          >
            Password Forgotten
          </button> */}
        </form>
      </section>
    </div>
  );
}
