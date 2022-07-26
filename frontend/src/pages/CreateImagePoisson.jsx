/* eslint-disable jsx-a11y/click-events-have-key-events */
// import "./CreateImagePoisson.css";

import { useEffect, useState } from "react";
import axios from "@services/axios";

export default function CreateImagePoisson() {
  const [photos, setPhotos] = useState([]);
  const [imagePoissonId, setImagePoissonId] = useState(1);
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  const getPhotos = async () => {
    try {
      const { data } = await axios.get("photo_poisson");
      setPhotos(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  // const getPhotosByImagePoissonId = async () => {
  //   try {
  //     const { data } = await axios.get(`photo_poisson/${imagePoissonId}`);
  //     setSelectedPhotos(data.map((photo) => photo.photoId));
  //   } catch (err) {
  //     console.error(err.message);
  //   }
  // };

  // useEffect(() => {
  //   getPhotosByImagePoissonId();
  // }, [imagePoissonId]);

  useEffect(() => {
    getPhotos();
  }, []);

  // const handleClick = (id) => {
  //   if (selectedPhotos.includes(id)) {
  //     setSelectedPhotos(selectedPhotos.filter((photoId) => photoId !== id));
  //   } else {
  //     setSelectedPhotos([...selectedPhotos, id]);
  //   }
  // };

  const handleValidate = async () => {
    if (imagePoissonId && selectedPhotos.length && selectedPhotos.length <= 5) {
      try {
        await axios.delete(`carouselJointPhoto/${imagePoissonId}`);

        const response = await Promise.all(
          selectedPhotos.map((photo) =>
            axios.post(`photo_poisson`, {
              imagePoissonId,
              photoId: photo,
            })
          )
        );
        console.log(response);
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  return (
    <div>
      {/* <label htmlFor="choixCarousel">
        Choisir un Carousel
        <select
          value={imagePoissonId}
          onChange={(e) => setImagePoissonId(parseInt(e.target.value, 10))}
          name=""
          id="choixCarousel"
        >
          <option value="1">ACCEUIL</option>
          <option value="2">BOUTIQUE</option>
          <option value="3">ATELIER</option>
          <option value="4">CREATION</option>
          <option value="5">CONTACT</option>
        </select>
      </label> */}
      <div className="galerie-contenaire">
        {photos.map((photo) => (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          <img
            key={`photo-${photo.id}`}
            onClick={() => handleClick(photo.id)}
            className={
              selectedPhotos.includes(photo.id)
                ? "galerie-photo photo-selected"
                : "galerie-photo"
            }
            src={`${import.meta.env.VITE_IMAGES_URL}${photo.nom}`}
            alt={photo.description_du_poisson}
          />
        ))}
        <button type="button" onClick={handleValidate}>
          Créer le Nouveau Carousel
        </button>
      </div>
    </div>
  );
}
