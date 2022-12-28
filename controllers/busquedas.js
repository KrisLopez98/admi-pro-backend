const { response } = require("express");
const Usuario = require("../models/usuario");
const Hospital = require("../models/hospital");
const Medico = require("../models/medico");

// getBusquedasTotales
const getBusquedasTotales = async (req, res = response) => {
  const busqueda = req.params.busqueda;
  const regex = new RegExp(busqueda, "i");

  const [usuarios, hospitales, medicos] = await Promise.all([
    (usuarios = await Usuario.find({ nombre: regex })),
    (hospitales = await Hospital.find({ nombre: regex })),
    (medicos = await Medico.find({ nombre: regex })),
  ]);

  res.json({
    ok: true,
    usuarios,
    hospitales,
    medicos,
  });
};

// getDocumentosColeccion
const getDocumentosColeccion = async (req, res = response) => {
  const busqueda = req.params.busqueda;
  const tabla = req.params.tabla;
  const regex = new RegExp(busqueda, "i");

  let data = [];

  switch (tabla) {
    case "medicos":
      data = await Medico.find({ nombre: regex })
        .populate("usuario", "nombre img")
        .populate("hospital", "nombre, img");
      break;

    case "hospitales":
      data = await Hospital.find({ nombre: regex }).populate(
        "usuario",
        "nombre img"
      );
      break;

    case "usuarios":
      data = await Usuario.find({ nombre: regex });
      break;

    default:
      return res.status(400).json({
        ok: false,
        msg: "La tabla tiene que ser usuarios/medicos/hospitales",
      });
  }

  res.json({
    ok: true,
    resultados: data,
  });
};

// ---> Exports
module.exports = { getBusquedasTotales, getDocumentosColeccion };
