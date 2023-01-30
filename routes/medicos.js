/**
 * Path: /api/medicos
 */

// ----> Imports
const { Router } = require("express");
const { check } = require("express-validator");
const {
  getMedicos,
  crearMedico,
  actualizarMedico,
  borrarMedico,
  getMedicoById,
} = require("../controllers/medicos");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();


// GET MEDICOS
router.get("/", getMedicos);

// POST MEDICO
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre del médico es necesario").not().isEmpty(),
    check("hospital", "El id del hospital debe ser válido").isMongoId(),
    validarCampos,
  ],
  crearMedico
);

// PUT MEDICO
router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre del médico es necesario").not().isEmpty(),
    check("hospital", "El id del hospital debe ser válido").isMongoId(),
    validarCampos,
  ],
  actualizarMedico
);

// DELETE MEDICO
router.delete("/:id", validarJWT ,borrarMedico);

// GET ID MEDICO
router.get("/:id", validarJWT , getMedicoById);

// -----> Exports
module.exports = router;
