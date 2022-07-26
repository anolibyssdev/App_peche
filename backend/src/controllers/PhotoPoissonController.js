const jwt = require("jsonwebtoken");
const fs = require("fs");

const path = require("path");
const multer = require("multer");
const models = require("../models");

const checkFile = (filename) => {
  try {
    fs.accessSync(
      path.join(__dirname, `../../public/assets/images/${filename}`)
    );
    return true;
  } catch (err) {
    return false;
  }
};

const deleteFile = (filename) => {
  if (checkFile(filename)) {
    fs.unlinkSync(
      path.join(__dirname, `../../public/assets/images/${filename}`)
    );
  }
  return true;
};

// Où se trouve le stockage :

const storage = multer.diskStorage({
  destination: (req, files, callback) => {
    callback(null, path.join(__dirname, "../../public/assets/images/"));
  },
  filename: (req, files, callback) => {
    req.body.name = `${Date.now()}_${files.originalname}`;
    callback(null, req.body.name);
  },
});

const checkFileType = (files, callback) => {
  const filetypes = /jpeg|jpg|png|pdf/;
  const extname = filetypes.test(
    path.extname(files.originalname).toLowerCase()
  ); // test() verifie la correspondance :
  const mimetype = filetypes.test(files.mimetype); // exemple de mimetype : jpg => 'images/jpg'

  if (extname && mimetype) {
    return callback(null, true);
  }
  return callback(
    "Erreur : vous pouvez poster uniquement des images avec l'extension suivante : .jpeg, .jpg, .png, .pdf"
  );
};
// Multer stuff :

const upload = multer({
  storage,
  limits: { fileSize: 32000000 }, // Taille maximum de 32 Mo en octets
  fileFilter: (data, files, callback) => {
    checkFileType(files, callback);
  },
}).single("image"); // <nom d'entrée="Image" type="fichier">

class PhotoPoissonController {
  // CRUD : créer, lire, mettre à jour, supprimer :

  static browse = async (req, res) => {
    try {
      const [results] = await models.photo_poisson.findAll();
      return res.status(200).json(results);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  };

  static add = async (req, res) => {
    const photoPoisson = req.body;

    try {
      const fileState = await checkFile(req.body.nom);
      if (!fileState) {
        return res
          .status(400)
          .send(
            "Nous rencontrons un problème avec le téléchargement de votre fichier"
          );
      }
      const object = await models.photo_poisson.validate({ ...photoPoisson });
      if (!object) {
        deleteFile(req.body.nom);
        return res
          .status(400)
          .send("Une des données demandées est manquante ou incorrecte");
      }
      console.log(photoPoisson);
      const [result] = await models.photo_poisson.insert(photoPoisson);
      const [[photoCreated]] = await models.photo_poisson.find(result.insertId);
      return res.status(201).send(photoCreated);
    } catch (err) {
      deleteFile(req.body.name);
      return res.status(500).send(err.message);
    }
  };

  static read = async (req, res) => {
    const { id } = req.params;

    try {
      const [result] = await models.photo_poisson.find(id);
      if (!result[0]) {
        return res.sendStatus(404);
      }
      return res.status(200).json(result[0]);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  };

  static edit = async (req, res) => {
    try {
      const photoPoissonId = req.params.id;
      const photoPoisson = req.body;
      const [result] = await models.photo_poisson.find(photoPoissonId);
      if (!result) {
        return res.sendStatus(404);
      }
      const validUtilisateur = await models.photo_poisson.validate(
        photoPoisson,
        false
      );
      if (!validUtilisateur) {
        return res.sendStatus(400);
      }
      await models.photo_poisson.update(photoPoisson, photoPoissonId);
      return res.sendStatus(204);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  };

  static delete = async (req, res) => {
    const { id } = req.params;

    try {
      const [photoPoisson] = await models.photo_poisson.find(id);
      if (!photoPoisson[0]) {
        return res.status(400).send("Espace vider");
      }
      deleteFile(photoPoisson[0].name);
      return models.photo_poisson.delete(photoPoisson[0].id).then(() => {
        return res.sendStatus(204);
      });
    } catch (err) {
      return res.status(500).send(err.message);
    }
  };

  // Télécharger des éléments:

  // Upload Stuff

  /* 
  static changeImage = (req, res, next) => {

        if (true) {
            return next();
        }
    }
    */

  static updateImage = (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        return res.status(400).send(err);
      }
      req.body = {
        nom: req.file.filename,
        ...JSON.parse(req.body.photoPoisson),
      };
      return next();
    });
    /*
    try {
            console.log("warning");
            upload(req).then(req, res, (err) => {
                console.log("test");
                if (err) {
                    return res.status(500).send(err);
                } else {
                    if (req.file == undefined){
                        return res.status(400).send('Error : No file selected');
                    } else {
                        res.status(200).send('File Uploaded');
                        return next();
                    }
                }
            })
        } catch (err) {
            return res.status(500).send(err.message);
        }
        */
  };

  // Autorisation générale :
  static authorization = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.sendStatus(401);
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_JWT_SECRET);
      req.utilisateurId = decoded.id;
      req.utilisateurRole = decoded.role;
      return next();
    } catch (err) {
      return res.status(500).send(err.message);
    }
  };

  // Autorisation de rôle :

  static isSA = (req, res, next) => {
    if (!req.utilisateurId || req.utilisateurRole !== "ADMIN") {
      return res.sendStatus(403);
    }
    return next();
  };
}

module.exports = PhotoPoissonController;
