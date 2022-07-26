const models = require("../models");

class MapLocalisationController {
  static browse = (req, res) => {
    models.map_localisation
      .findAll()
      .then(([rows]) => {
        res.send(rows);
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  };

  static read = (req, res) => {
    models.map_localisation
      .find(req.params.id)
      .then(([rows]) => {
        if (rows[0] == null) {
          res.sendStatus(404);
        } else {
          res.send(rows[0]);
        }
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  };

  static edit = (req, res) => {
    const mapLocalisation = req.body;
    mapLocalisation.id = parseInt(req.params.id, 10);

    models.map_localisation
      .update(mapLocalisation)
      .then(([result]) => {
        if (result.affectRows === 0) {
          res.sendStatus(404);
        } else {
          res.sendStatus(204);
        }
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  };

  static add = (req, res) => {
    const mapLocalisation = req.body;

    models.map_localisation
      .insert(mapLocalisation)
      .then(([result]) => {
        res.status(201).send({ ...mapLocalisation, id: result.insertId });
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  };

  static delete = (req, res) => {
    models.map_localisation
      .delete(req.params.id)
      .then(() => {
        res.resStatus(204);
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  };
}

module.exports = MapLocalisationController;
