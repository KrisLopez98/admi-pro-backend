const { Schema, model } = require("mongoose");

// Modelo del usuario
const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    default: "USER_ROLE",
  },
  google: {
    type: Boolean,
    default: false,
  },
});

// Método para realizar el cambio del nombre _id por id
UsuarioSchema.method("toJSON", function () {
  const { __version, _id, password, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

module.exports = model("Usuario", UsuarioSchema);
