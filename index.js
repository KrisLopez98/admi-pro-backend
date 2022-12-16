require("dotenv").config();
const express = require("express");
const { dbConnection } = require("./database/config");
const cors = require("cors");

// crear el servidor de express
const app = express();

// configurar cors
app.use(cors());

// base de datos
dbConnection();

// usuario krystalv
// password 3O2kyuMSrFJzz3PN

// Rutas
app.get("/", (request, response) => {
  response.json({
    ok: true,
    msg: "Hola mundo",
  });
});

app.listen(process.env.PORT, () => {
  console.log("Servidor corriendo en puerto ", process.env.PORT);
});
