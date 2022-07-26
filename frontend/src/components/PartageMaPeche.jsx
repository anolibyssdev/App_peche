import { useState, React, useEffect } from "react";
import CreateCardOverview from "../pages/CreateCardOverviewAdmin";
import axios from "../services/axios";
import Navbar from "@components/Navbar";
import "./PartageMaPeche.css";

// eslint-disable-next-line react/function-component-definition
const PartageMaPeche = () => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    axios.get("photo_poisson").then((result) => setPhotos(result.data));
  }, []);

  return (
    <div>
      <div className="global-page">
        <h1 id="accueil1">Il a mordu ?</h1>
        <h2 id="accueil2">Immortalise ta prise !</h2>
        {!photos[0] ? (
          <p>il n'y a pas de photo</p>
        ) : (
          <ul>
            {photos.map((photo) => {
              <li key={photo.id}>
                <img
                  src={`${import.meta.env.VITE_IMAGES_URL}/${photo.name}`}
                  alt={photo.description}
                />
                <p>{photo.description}</p>
                <button
                  type="button"
                  onClick={() =>
                    axios
                      .delete(`photo_poisson/${photo.id}`)
                      .then(() => console.warn("delete Items"))
                  }
                >
                  Supprimé
                </button>
              </li>;
            })}
          </ul>
        )}
      </div>
      <CreateCardOverview setPhotos={setPhotos} />
    </div>
  );
};

export default PartageMaPeche;
