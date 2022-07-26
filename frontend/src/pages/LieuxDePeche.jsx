import { useState, useEffect } from "react";
// import departements from "@assets/departements.json";
// import communes from "@assets/communes.json";

import axios from "axios";
import Navbar from "@components/Navbar";

export default function LieuxDePeche() {
  const [arrayLieu, setArrayLieu] = useState([]);

  function getArrayLieu(poisson) {
    console.log(poisson);
    axios
      .get(
        `https://hubeau.eaufrance.fr/api/v0/etat_piscicole/lieux_peche?format=json&code_espece_poisson=${poisson}`
      )
      .then((response) => response.data)
      .then((data) => {
        setArrayLieu(data.data);
      });
  }

  const [arrayTypeDePoisson, setArrayTypeDePoisson] = useState([]);
  function getArrayTypeDePoisson() {
    axios
      .get(
        "https://hubeau.eaufrance.fr/api/v0/etat_piscicole/code_espece_poisson"
      )
      .then((response) => response.data)
      .then((data2) => {
        setArrayTypeDePoisson(data2.data);
      });
  }

  useEffect(() => {
    getArrayTypeDePoisson();
  }, []);

  //   useEffect(() => {
  //     getArrayLieu();
  //   }, []);

  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (filter) {
      getArrayLieu(filter);
    }
  }, [filter]);

  return (
    <div className="choix-poisson-page">
      <Navbar />

      <h2 className="sous-titre-poisson-page">
        Choisissez un poissons selon et l'application vous indiquera le type de
        poisson que vous trouverez
      </h2>
      <div className="chercher">
        <h2 className="titre-chercher">Chercher par Nom de poisson :</h2>
        {/* <input
          type="text"
          id="name-filter"
          value={filter}
          name="name"
          placeholder="Ecrit le nom du poisson ici"
          onChange={(e) => setFilter(e.target.value)}
        /> */}
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          {arrayTypeDePoisson.map((poisson) => (
            <option key={poisson.code} value={poisson.code}>
              {poisson.nom_commun}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
