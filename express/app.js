const express = require("express");
const app = express();
app.get("/", (req, res)=>{
    res.status(404).send("Hola mundo!")
});

app.listen(3000, ()=>{
    console.log("servidor corriendo en http://localhost:3000");
});