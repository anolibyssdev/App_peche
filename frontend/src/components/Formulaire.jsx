/* eslint-disable react/function-component-definition */
import "./Formulaire.css";

const Formulaire = () => {
  return (
    <form className="form">
      <div className="formulaire">
        <label className="champs">
          <input className="nom" type="text" placeholder="Nom" required />
          <input className="prenom" type="text" placeholder="Prénom" required />
          <input
            className="email"
            type="text"
            placeholder="Adresse mail"
            required
          />
          <textarea
            className="message"
            rows="6 "
            placeholder="Message"
            required
          />
          <input className="button" type="submit" value="Envoyer" />
        </label>
      </div>
    </form>
  );
};

export default Formulaire;
