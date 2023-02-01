const res = require("express/lib/response");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

const validarJWT = (req, resp, next) => {
  // Leer el token
  const token = req.header("x-token");
  console.log(token);
  if (!token) {
    return resp.status(401).json({
      ok: false,
      msg: "No hay token en esta petición",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    req.uid = uid;
    next();
  } catch (error) {
    return resp.status(401).json({
      ok: false,
      msg: "Token no valido",
    });
  }
};

const validarAdmiRole = async (req, resp, next) => {
  const uid = req.uid;
  try {
    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return resp.status(404).json({
        ok: false,
        msg: "Usuario no existe",
      });
    }

    if (usuarioDB.role !== "ADMI_ROLE") {
      return resp.status(403).json({
        ok: false,
        msg: "Usuario no autorizado para realizar esas modificaciones",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const validarAdmiRoleOMismoUsuario = async (req, resp, next) => {
  const uid = req.uid;
  const id = req.params.id;
  try {
    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return resp.status(404).json({
        ok: false,
        msg: "Usuario no existe",
      });
    }

    if (usuarioDB.role === "ADMI_ROLE" || uid === id) {
      next();
    } else {
      return resp.status(403).json({
        ok: false,
        msg: "Usuario no autorizado para realizar esas modificaciones",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  validarJWT,
  validarAdmiRole,
  validarAdmiRoleOMismoUsuario,
};
