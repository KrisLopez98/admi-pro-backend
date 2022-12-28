/**
 * Ruta: api/todo/:busqueda
 */
// -----> Imports
const { Router } = require("express");
const {
  getBusquedasTotales,
  getDocumentosColeccion,
} = require("../controllers/busquedas");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

// GET BUSQUEDAS
router.get("/:busqueda", validarJWT, getBusquedasTotales);

// GET BUSQUEDAS POR COLECCIONES
router.get("/coleccion/:tabla/:busqueda", validarJWT, getDocumentosColeccion);

// ---> Exports
module.exports = router;
