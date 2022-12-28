/**
 * Path: /api/hospitales
 */
// ----> IMPORTS
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const {
  getHospitales,
  crearHospital,
  actualizarHospital,
  borrarHospital,
} = require("../controllers/hospitales");
const router = Router();

// ROUTE GET HOSPITALES
router.get("/", getHospitales);

// ROUTE POST HOSPITAL
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre del hospital es necesario").not().isEmpty(),
    validarCampos,
  ],
  crearHospital
);

// ROUTE PUT HOSPITAL
router.put("/:id", [], actualizarHospital);

// ROUTE DELETE HOSPITAL
router.delete("/:id", borrarHospital);

// EXPORTS
module.exports = router;
