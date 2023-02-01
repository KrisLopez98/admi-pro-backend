const { response } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");
const { getMenuFrontEnd } = require('../helpers/menu-frontend');

const login = async (req, resp = response) => {
  const { email, password } = req.body;

  try {
    // Verificar email
    const usuarioDB = await Usuario.findOne({ email });

    if (!usuarioDB) {
      return resp.status(404).json({
        ok: false,
        msg: "Email no válido",
      });
    }

    // Verificar contraseña
    const validPassword = bcrypt.compareSync(password, usuarioDB.password);
    if (!validPassword) {
      return resp.status(400).json({
        ok: false,
        msg: "Password no valido",
      });
    }

    // Generar un token
    const token = await generarJWT(usuarioDB.id);

    resp.json({
      ok: true,
      token: token,
      menu: getMenuFrontEnd(usuarioDB.role)
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const googleSignIn = async (req, res = response) => {
  try {
    const { email, name, picture } = await googleVerify(req.body.token);

    // VALIDAR SI UN USUARIO YA EXISTE EN LA BASE DE DATOS
    const usuarioDB = await Usuario.findOne({ email });
    let usuario;
    if (!usuarioDB) {
      usuario = new Usuario({
        nombre: name,
        email: email,
        password: "111",
        img: picture,
        google: true,
      });
    } else {
      usuario = usuarioDB;
      usuario.google = true;
    }

    // GUARDAR USUARIO
    await usuario.save();

    // GENERAR EL TOKEN - JWT
    const token = await generarJWT(usuario.id);

    res.json({
      ok: true,
      email,
      name,
      picture,
      token,
      menu: getMenuFrontEnd(usuario.role)
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: "Token de Google incorrecto",
    });
  }
};

const renewToken = async (req, res = response) => {
  const uid = req.uid;

  // Generar el token
  const token = await generarJWT(uid);

  // Obtener el usuario por UID
  const usuarioDB = await Usuario.findById(uid);

  if (!usuarioDB) {
    res.status(400).json({
      ok: false,
      msg: "No existe un usuario con ese id",
    });
  }

  res.json({
    ok: true,
    token,
    usuario: usuarioDB,
    menu: getMenuFrontEnd(usuarioDB.role)
  });
};

module.exports = {
  login,
  googleSignIn,
  renewToken,
};
