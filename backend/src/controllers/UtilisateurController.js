const jwt = require("jsonwebtoken");
const models = require("../models");

class UtilisateurController {
  static browse = async (req, res) => {
    try {
      const [results] = await models.utilisateur.findAll();
      return res.status(200).json(results);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  };

  static read = (req, res) => {
    models.utilisateur
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

  static edit = async (req, res) => {
    const { motDePass, role } = req.body;
    const id = parseInt(req.params.id, 10);

    try {
      // TODO validations (length, format...)
      console.warn(id, motDePass, role);
      const validUtilisateur = await models.utilisateur.validate(
        { id, motDePass, role },
        false
      );
      // console.warn(validUtilisateur);
      if (!validUtilisateur) {
        return res
          .status(400)
          .send("Vous devez fournir un mot de passe et/ou un rôle valide");
      }

      // Hash password
      const hashedPassword = await models.utilisateur.hashPassword(motDePass);

      const [result] = await models.utilisateur.update({
        id,
        hashedPassword,
        role,
      });

      if (result.affectedRows === 0) {
        return res.sendStatus(404);
      }

      return res.sendStatus(204);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  };

  static register = async (req, res) => {
    const { email, motDePass, role, prenom, nom, ville } = req.body;
    console.log(email, motDePass, role, prenom, nom, ville);

    try {
      // TODO validations (length, format...)
      const validUtilisateur = await models.utilisateur.validate({
        email,
        motDePass,
        role,
        prenom,
        nom,
        ville,
      });
      console.warn(validUtilisateur);
      if (!validUtilisateur) {
        return res
          .status(400)
          .send("You must provide a valid email and password");
      }

      // Check if email already exists
      const emailAlreadyUsed = await models.utilisateur.emailAlreadyExists(
        email
      );
      if (emailAlreadyUsed) {
        return res.status(400).send("Email already Used");
      }

      // Hash password
      const hashedPassword = await models.utilisateur.hashPassword(motDePass);

      const [result] = await models.utilisateur.insert({
        prenom,
        nom,
        email,
        hashedPassword,
        role,
        ville,
      });
      const [[utilisateurCreated]] = await models.utilisateur.find(
        result.insertId
      );

      delete utilisateurCreated.hashedPassword;

      return res.status(201).json(utilisateurCreated);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  };

  static delete = (req, res) => {
    models.utilisateur
      .delete(req.params.id)
      .then(() => {
        res.sendStatus(204);
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  };

  static login = async (req, res) => {
    const { email, motDePass } = req.body;

    if (!email || !motDePass) {
      return res
        .status(400)
        .send("Vous devez fournir un email et un mot de passe");
    }

    try {
      const [[utilisateur]] = await models.utilisateur.findByEmail(email);

      if (!utilisateur) {
        return res.status(403).send("Votre mot de passe est invalide");
      }
      if (
        await models.utilisateur.verifyPassword(
          motDePass,
          utilisateur.hashedPassword
        )
      ) {
        // Create token
        const token = jwt.sign(
          { id: utilisateur.id, role: utilisateur.role },
          process.env.ACCESS_JWT_SECRET,
          { expiresIn: process.env.ACCESS_JWT_EXPIRESIN }
        );
        return res
          .cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.ACCESS_JWT_SECURE === "true",
            maxAge: parseInt(process.env.ACCESS_JWT_COOKIE_MAXAGE, 10),
          })
          .status(200)
          .json({
            id: utilisateur.id,
            email: utilisateur.email,
            username: utilisateur.username,
            role: utilisateur.role,
            prenom: utilisateur.prenom,
          });
      }

      return res.status(403).send("Votre email ou mot de passe est invalide");
    } catch (err) {
      return res.status(500).send(err.message);
    }
  };

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

  static isAdmin = (req, res, next) => {
    if (
      !req.utilisateurId ||
      !req.utilisateurRole ||
      req.utilisateurRole !== "ADMIN"
    ) {
      return res.sendStatus(403);
    }

    return next();
  };

  static clearCookie = (req, res) => {
    return res.clearCookie("accessToken").sendStatus(200);
  };

  static isSameId = (req, res, next) => {
    let { id } = req.params;

    id = parseInt(id, 10);

    if (Number.isNaN(id)) {
      return res
        .status(400)
        .send("Vous devez fournir une identification valide");
    }

    if (id !== req.utilisateurId) {
      return res.sendStatus(403);
    }

    return next();
  };

  static editAvatar = async (req, res) => {
    // on modifie l'user id 3
    const utilisateurId = 3;

    try {
      const [result] = await models.utilisateur.updateAvatar({
        id: utilisateurId,
        avatar: req.pictureData.avatar,
        avatarDescription: req.pictureData.description,
      });
      if (result.affectedRows === 0) {
        return res.status(404).send("vous etes inconnu à la base de donnée");
      }
      const [[utilisateurUpdated]] = await models.utilisateur.find(
        utilisateurId
      );
      return res.status(201).json(utilisateurUpdated);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  };
}

module.exports = UtilisateurController;
