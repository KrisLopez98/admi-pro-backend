/**
 * Ruta: api/upload/
 */
// -----> Imports
const { Router } = require("express");
const expressFileUpload = require("express-fileupload");
const { validarJWT } = require("../middlewares/validar-jwt");
const { fileUpload, retornaImagen } = require("../controllers/uploads");
const router = Router();
router.use(expressFileUpload());

// PUT IMAGE
router.put("/:tipo/:id", validarJWT, fileUpload);

// GET IMAGE
router.get("/:tipo/:foto", retornaImagen);

// ---> Exports
module.exports = router;
