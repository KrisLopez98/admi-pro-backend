/**
 * Ruta: /api/usuarios
 */
// ----> IMPORTS
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getUsuarios,
  createUsuarios,
  actualizarUsuario,
  borrarUsuario,
} = require("../controllers/usuarios");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

// ROUTE GET USUARIOS
router.get("/", validarJWT, getUsuarios);

// ROUTE POST USUARIO
router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    validarCampos,
  ],
  createUsuarios
);

// ROUTE PUT USUARIO
router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("role", "El rol es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  actualizarUsuario
);

// ROUTE DELETE USUARIO
router.delete("/:id", validarJWT, borrarUsuario);

// EXPORTS
module.exports = router;
