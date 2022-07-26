/* eslint-disable class-methods-use-this */
const Joi = require("joi");
const argon2 = require("argon2");
const AbstractManager = require("./AbstractManager");

const roles = ["ADMIN", "USER"];

// le mot de passe doit contenir presque une majuscule, une minuscule, un chiffre et un caractère spécial contenus dans [!@#$%^&*], et comporter de 8 à 32 caractères

const schemaForCreation = Joi.object({
  motDePass: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
    .min(8)
    .max(32)
    .required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      // tlds: { allow: ["com", "net"] },
    })
    .required(),
  nom: Joi.string().required(),
  prenom: Joi.string().required(),
  role: Joi.string().valid(...roles),
  ville: Joi.string().required(),
});

const schemaForUpdate = Joi.object({
  motDePass: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
    .min(8)
    .max(32),

  email: Joi.string().email({
    minDomainSegments: 2,
    // tlds: { allow: ["com", "net"] },
  }),
  nom: Joi.string(),
  prenon: Joi.string(),
  role: Joi.string().valid(...roles),
});

class UtilisateurManager extends AbstractManager {
  static table = "utilisateur";

  insert(utilisateur) {
    if (utilisateur.role) {
      return this.connection.query(
        `INSERT INTO ${UtilisateurManager.table} (nom, prenom, email, mot_de_pass, ville, code_postal, role) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          utilisateur.nom,
          utilisateur.prenom,
          utilisateur.email,
          utilisateur.hashedPassword,
          utilisateur.ville,
          utilisateur.codePostal,
          utilisateur.role,
        ]
      );
    }
    return this.connection.query(
      `INSERT INTO ${UtilisateurManager.table} (nom, prenom, email, mot_de_pass, ville, code_postal) VALUES (?, ?, ?, ?, ?, ?)`,

      [
        utilisateur.nom,
        utilisateur.prenom,
        utilisateur.email,
        utilisateur.hashedPassword,
        utilisateur.ville,
        utilisateur.codePostal,
      ]
    );
  }

  update(utilisateur) {
    if (utilisateur.role === "ADMIN") {
      return this.connection.query(
        `UPDATE ${UtilisateurManager.table} SET mot_de_pass = ? WHERE id = ?`,
        [utilisateur.motDePass, utilisateur.id]
      );
    }
    return this.connection.query(
      `UPDATE ${UtilisateurManager.table} SET mot_de_pass = ? WHERE id = ?`,
      [utilisateur.motDePass, utilisateur.id]
    );
  }

  emailAlreadyExists(email) {
    return this.connection
      .query(`SELECT id FROM ${UtilisateurManager.table} WHERE email=?`, [
        email,
      ])
      .then(([results]) => results.length);
  }

  async validate(utilisateur, creation = true) {
    try {
      if (creation) {
        await schemaForCreation.validateAsync(utilisateur);
      } else {
        await schemaForUpdate.validateAsync(utilisateur);
      }
      return true;
    } catch (err) {
      return false;
    }
  }

  async hashPassword(motDePass) {
    const hashedPassword = await argon2.hash(motDePass);
    return hashedPassword;
  }

  async verifyPassword(motDePass, hashedPassword) {
    const passwordIsValid = await argon2.verify(hashedPassword, motDePass);
    return passwordIsValid;
  }

  find(id) {
    return this.connection.query(
      `SELECT id, nom, email, role from  ${this.table} where id = ?`,
      [id]
    );
  }

  findAll() {
    return this.connection.query(
      `SELECT id, nom, email, role from  ${this.table}`
    );
  }

  findByEmail(email) {
    return this.connection.query(
      `SELECT * FROM ${this.table} WHERE email = ?`,
      [email]
    );
  }

  updateAvatar({ id, avatar, avatarDescription }) {
    return this.connection.query(
      `UPDATE ${this.table} SET avatar=?, avatarDescription=? WHERE id=?`,
      [avatar, avatarDescription, id]
    );
  }
}

module.exports = UtilisateurManager;
