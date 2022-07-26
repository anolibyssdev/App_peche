import { useState, useEffect } from "react";
import axios from "../services/axios";

export default function Utilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState([]);

  const getUtilisateurs = async () => {
    try {
      const { data } = await axios.get("utilisateurs", {
        withCredentials: true,
      });
      setUtilisateurs(data);
    } catch (err) {
      console.error(err.response.status);
      if (err.response.status === 401) {
        alert("Vous n'êtes pas authentifié");
      } else if (err.response.status === 403) {
        alert("Vous n'etes malheureusement pas autorisé");
      }
    }
  };
  useEffect(() => {
    getUtilisateurs();
  }, []);
  return (
    <section>
      {utilisateurs.length ? (
        <ul>
          {utilisateurs.map((utilisateur) => (
            <li key={utilisateur.id}>
              {utilisateur.email} - {utilisateur.role}
            </li>
          ))}
        </ul>
      ) : (
        <h2>Aucune donnée à afficher</h2>
      )}
    </section>
  );
}
