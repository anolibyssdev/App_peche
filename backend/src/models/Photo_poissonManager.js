/* eslint-disable camelcase */
const Joi = require("joi");

const AbstractManager = require("./AbstractManager");

const validationScheme = (data, isCreated) => {
  const parameter = isCreated ? "required" : "optional";

  return Joi.object({
    nom: Joi.string().max(255).presence(parameter),
    nomDuPoisson: Joi.string().max(255).presence(parameter),
    descriptionDuPoisson: Joi.string().max(255).presence(parameter),
    lieuDeLaPeche: Joi.string().max(255).presence(parameter),
    dateDePeche: Joi.number().presence(parameter),
    mapLocalisationId: Joi.number().presence("optional"),
  }).validate(data, { abortEarly: false }).error;
};

class Photo_poissonManager extends AbstractManager {
  static table = "photo_poisson";

  findAll() {
    return this.connection.query(`SELECT * FROM ${this.table}`);
  }

  find(id) {
    return this.connection.query(`SELECT * FROM ${this.table} WHERE id = ?`, [
      id,
    ]);
  }

  insert(photoPoisson) {
    return this.connection.query(
      `INSERT INTO ${Photo_poissonManager.table} (nom, nom_du_poisson, description_du_poisson, lieu_de_la_peche, date_de_peche, map_localisation_id) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        photoPoisson.nom,
        photoPoisson.nomDuPoisson,
        photoPoisson.descriptionDuPoisson,
        photoPoisson.lieuDeLaPeche,
        photoPoisson.dateDeLaPeche,
        photoPoisson.mapLocalisationId,
      ]
    );
  }

  update(photoPoisson) {
    return this.connection.query(
      `UPDATE ${Photo_poissonManager.table} SET nom_du_poisson = ?, description_du_poisson = ?, lieu_de_la_peche = ?, date_de_peche = ?, map_localisation_id = ?`,
      [
        photoPoisson.nom,
        photoPoisson.nomDuPoisson,
        photoPoisson.descriptionDuPoisson,
        photoPoisson.lieuDeLaPeche,
        photoPoisson.dateDeLaPeche,
        photoPoisson.mapLocalisationId,
      ]
    );
  }

  // eslint-disable-next-line class-methods-use-this
  async validate(data, creationState = true) {
    try {
      await validationScheme(data, creationState);
      return true;
    } catch (err) {
      console.error(err.message);
      return false;
    }
  }
}

module.exports = Photo_poissonManager;
