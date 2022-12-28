require("dotenv").config();
const express = require("express");
const { dbConnection } = require("./database/config");
const cors = require("cors");

// crear el servidor de express
const app = express();

// configurar cors
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

// base de datos
dbConnection();

// usuario krystalv
// password 3O2kyuMSrFJzz3PN

// Rutas
// --> Usuarios
app.use("/api/usuarios", require("./routes/usuarios"));
// --> Login
app.use("/api/login", require("./routes/auth"));
// --> Hospital
app.use("/api/hospitales", require("./routes/hospitales"));
// --> Medicos
app.use("/api/medicos", require("./routes/medicos"));
// --> Busquedas Totales
app.use("/api/todo", require("./routes/busquedas"));
// --> Upload imagenes
app.use("/api/upload", require("./routes/uploads"));
app.listen(process.env.PORT, () => {
  console.log("Servidor corriendo en puerto ", process.env.PORT);
});
