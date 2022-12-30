const { response } = require("express");
const res = require("express/lib/response");
const Medico = require("../models/medico");

const getMedicos = async (req, res = response) => {
  const medicos = await Medico.find()
    .populate("usuario", "id nombre")
    .populate("hospital", "id nombre");
  res.json({
    ok: true,
    medicos,
  });
};

const crearMedico = async (req, res = response) => {
  const uid = req.uid;
  const medico = new Medico({
    usuario: uid,
    ...req.body,
  });

  try {
    const medicoDB = await medico.save();

    res.json({
      ok: true,
      medico: medicoDB,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarMedico = async (req, res = response) => {
  const medicoId = req.params.id;
  const uid = req.uid;
  try {
    const medico = await Medico.findById(medicoId);

    if (!medico) {
      return req.status(404).json({
        ok: false,
        msg: "No existe el médico",
      });
    }

    const cambiosMedico = {
      ...req.body,
      usuario: uid,
    };

    const medicoActualizado = await Medico.findByIdAndUpdate(
      medicoId,
      cambiosMedico,
      { new: true }
    );

    res.json({
      ok: true,
      medico: medicoActualizado,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const borrarMedico = async (req, res = response) => {
  const medicoId = req.params.id;
  try {
    if (!medicoId) {
      return res.status(404).json({
        ok: false,
        msg: "El médico que desea eliminar no existe",
      });
    }

    await Medico.findByIdAndDelete(medicoId);

    res.json({
      ok: true,
      msg: "Médico eliminado",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getMedicos,
  crearMedico,
  actualizarMedico,
  borrarMedico,
};
