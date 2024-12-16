const express = require("express");

const app = express();

app.use(express.json());

const usuarios = [
    {
      id: 1,
      nombre: "Juan",
      apellido: "Perez",
      email: "juanperez@gmail.com",
    },
    {
      id: 2,
      nombre: "Carlos",
      apellido: "Perez",
      email: "carlosperez@gmail.com",
    },
  ];

app.get("/usuarios", (req, res) => {
  res.status(200).send({usuarios});
});

app.get("/usuarios/:id", (req, res) => {
  const {id} = req.params;
  
  if(isNaN(id)){
    res.status(400).send({error: "El id debe ser un número"});
    return;
  };
  
  const usuario = usuarios.find((usuario) => usuario.id === +id);

  if(!usuario){
    res.status(404).send({error: `El usuario con id ${id} no existe`});
    return;
  };
  
  res.status(200).send(usuario);
}); //End point

app.post("/usuarios", (req, res) => {
  const {nombre, apellido, email} = req.body;

  if(!nombre || !apellido || !email){
    res.status(400).send({error: "Todos los campos son requeridos"});
    return;
  }

  if(usuarios.find((usuario) => usuario.email === email)){
    res.status(400).send({error: "El email ya existe"});
    return;
  }

  usuarios.push({id: usuarios.length + 1, nombre, apellido, email});

  res.status(201).send("El usuario se agregó correctamente");
});

app.put("/usuarios/:id", (req, res) => {
  const {nombre, apellido, email} = req.body;
  const id = +req.params.id;

  if(!nombre || !apellido || !email){
    res.status(400).send({error: "Todos los campos son requeridos"});
    return;
  }

  if(isNaN(id)){
    res.status(400).send({error: "El id debe ser un número"});
    return;
  };
  
  const usuario = usuarios.find((usuario) => usuario.id === +id);

  if(!usuario){
    res.status(404).send({error: `El usuario con id ${id} no existe`});
    return;
  };

  // Se revisa si el email ya existe, al menos que sea el mismo correo del usuario a actualizar
  console.log(email, usuarios.find((usuario) => usuario.email === email), email !== usuarios[+id].email);

  usuarios.forEach((usuario) => {
    if(usuario.id === id){
      usuario.nombre = nombre;
      usuario.apellido = apellido;
      usuario.email = email;
    }
  })

  res.status(200).send("El usuario se actualizó correctamente");
});

app.patch("/usuarios/:id", (req, res) => {
  const nuevaInfoUsuario = req.body;
  const id = req.params.id;

  //Realizamos la validación de los parámetros
  if(isNaN(id)){
    res.status(400).send({error: "El id debe ser un número"});
    return;
  };
  
  const usuario = usuarios.find((usuario) => usuario.id === +id);

  if(!usuario){
    res.status(404).send({error: `El usuario con id ${id} no existe`});
    return;
  };
  //Se revisa si se envió algún dato para actualizar, importante el uso de parentesis para que se evalúe la expresión
  if(!(nuevaInfoUsuario.nombre || nuevaInfoUsuario.apellido || nuevaInfoUsuario.email)){
    res.status(400).send({error: "Debe enviar información para actualizar el usuario"});
    return;
  }

  if(nuevaInfoUsuario.email && usuarios.find((usuario) => usuario.email === nuevaInfoUsuario.email) && nuevaInfoUsuario.email !== usuarios[+id].email){
    res.status(400).send({error: "El email ya existe"});
    return;
  }

  // Se actualizan los datos del usuario, si no se envió ningún dato se mantiene el mismo, usando el operador || para que se evalúe la expresión
  usuarios.forEach((usuario) => {
    if(usuario.id === +id){
      usuario.nombre = nuevaInfoUsuario.nombre || usuario.nombre;
      usuario.apellido = nuevaInfoUsuario.apellido || usuario.apellido;
      usuario.email = nuevaInfoUsuario.email || usuario.email;
    }
  })

  res.status(200).send("El usuario se actualizó correctamente");
});

app.delete("/usuarios/:id", (req, res) => {
  const id = req.params.id;

  // Realizamos la validación de los parámetros
  // Como no se recibe ningún parámetro, el número de validaciones es menor
  if(isNaN(id)){
    res.status(400).send({error: "El id debe ser un número"});
    return;
  };
  
  const usuario = usuarios.find((usuario) => usuario.id === +id);

  if(!usuario){
    res.status(404).send({error: `El usuario con id ${id} no existe`});
    return;
  };

  // Se elimina el usuario
  // El método splice elimina el usuario en la posición que corresponda, y devuelve el elemento eliminado
  usuarios.splice(usuarios.findIndex((usuario) => usuario.id === +id), 1);

  res.status(200).send("El usuario se eliminó correctamente");
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});