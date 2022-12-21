// -----> IMPORTACIONES
// Definir el tipado del response
const { response } = require("express");
// crypt
const bcrypt = require("bcryptjs");
// Importar el modelo
const Usuario = require("../models/usuario.js");
const { generarJWT } = require("../helpers/jwt.js");

// ---> GET USUARIOS
const getUsuarios = async (request, response) => {
  const usuarios = await Usuario.find({}, "nombre email role google");
  response.json({
    ok: true,
    usuarios,
    uid: request.uid,
  });
};

// -----> POST USUARIO
const createUsuarios = async (request, res = response) => {
  // Desestructuración del body
  const { email, password } = request.body;

  // Realizar la validación de un usuario existente
  try {
    // Validicacion email
    const existeEmail = await Usuario.findOne({ email: email });

    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya esta registrado",
      });
    }

    // Crear un nuevo objecto haciendo uso del modelo "Usuario"
    const usuario = new Usuario(request.body);
    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    // Guardar en la base de datos
    await usuario.save();

    // Genrar el token
    const token = await generarJWT(usuario.id);

    // Response success
    res.json({ ok: true, usuario, token });
  } catch (error) {
    console.log(error);
    // Response error
    response.status(500).json({
      ok: false,
      msg: "Error inesperado... revisa los logs",
    });
  }
};

// ------> PUT USUARIO
const actualizarUsuario = async (req, res = response) => {
  // TODO: Validar token y comprobar si es el usuario correcto
  // Obtener el id del usuario
  const uid = req.params.id;

  try {
    // Encontrar el usuario mediante el id
    const usuarioDB = await Usuario.findById(uid);
    // Realizar la validacion cuando no exista el el usuario en la base de datos
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario por ese id",
      });
    }

    // Actualizaciones
    // Eliminación del password, google, email
    const { password, google, email, ...campos } = req.body;
    if (usuarioDB.email !== email) {
      const existeEmail = await Usuario.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: "Existe un usuario con el mismo email",
        });
      }
    }
    // Tomar el campo del email
    campos.email = email;

    // Obtener los campos que hemos actualizado
    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {
      new: true,
    });

    res.json({
      ok: true,
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado...",
    });
  }
};

// ------> DELETE USUARIO
const borrarUsuario = async (req, resp = response) => {
  // Obtener el id del parametro del request
  const uid = req.params.id;
  try {
    // PASO 1: Encontrar el usuario con ese id(uid)
    const usuarioDB = await Usuario.findById(uid);
    // PASO 2: Realizar la validacion de la existencia del usuario
    if (!usuarioDB) {
      return resp.status(404).json({
        ok: false,
        msg: "No existe un usuario con ese id",
      });
    }

    await Usuario.findByIdAndDelete(uid);

    resp.json({
      ok: true,
      msg: "Usuario eliminado",
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: "Error inesperado...",
    });
  }
};

// -----> EXPORTS
module.exports = {
  getUsuarios,
  createUsuarios,
  actualizarUsuario,
  borrarUsuario,
};
