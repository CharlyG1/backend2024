const express = require("express");

const app = express();
 app.get("/", (req, res) => {
    res.status(200).send("Hola Mundo!");
 })
app.get("/prueba", (req, res) => {
    res.status(200).send("Hola desde la ruta de prueba!");
}); //GET Obtener informacion 
app.post("/", (req, res) => {
    res.status(200).send("Hola desde POST!");
}); // POST crear nuevo recurso
app.put("/", (req, res) => {
    res.status(200).send("Hola desde PUT!");
}); //PUT actualizar recurso
app.patch("/", (req, res) => {
    res.status(200).send("Hola desde PATCH!");
}); //PATCH actualizar parcialmente recurso
app.delete("/", (req, res) => {
    res.status(200).send("Hola desde DELETE!");
}); //DELETE eliminar recurso
app.listen(3000, () => {
    console.log("Servidor corriendo en el http://localhost: 3000");
});  