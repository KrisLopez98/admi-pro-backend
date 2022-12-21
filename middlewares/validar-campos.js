// -------> IMPORTS
// Importar response
const { response } = require("express");
// Importar validationResult
const { validationResult } = require("express-validator");

// ----> VALIDAR CAMPOS
const validarCampos = (req, res = response, next) => {
  // Generacion de errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errores.mapped(),
    });
  }
  next();
};

// EXPORTS
module.exports = { validarCampos };
