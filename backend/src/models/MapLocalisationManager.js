const AbstractManager = require("./AbstractManager");

class MapLocalisationManager extends AbstractManager {
  static table = "map_localisation";

  findAll() {
    return this.connection.query(`SELECT * FROM ${this.table}`);
  }

  find(id) {
    return this.connection.query(`SELECT * FROM ${this.table} WHERE id = ?`, [
      id,
    ]);
  }

  insert(mapLocalisation) {
    return this.connection.query(
      `INSERT INTO ${MapLocalisationManager.table} (nom_de_commune, coordonnees_gps, nom_du_cours_eau) VALUES ( ?, ?, ?)`,
      [
        mapLocalisation.nomDeCommune,
        mapLocalisation.coordonnesGps,
        mapLocalisation.nomDuCoursEau,
      ]
    );
  }

  update(mapLocalisation) {
    return this.connection.query(
      `UPDATE ${MapLocalisationManager.table} SET nom_de_commune = ?, coordonnees_gps = ?, nom_du_cours_eau = ?, WHERE id = ?`,
      [
        mapLocalisation.nomDeCommune,
        mapLocalisation.coordonnesGps,
        mapLocalisation.nomDuCoursEau,
        mapLocalisation.id,
      ]
    );
  }
}
module.exports = MapLocalisationManager;
