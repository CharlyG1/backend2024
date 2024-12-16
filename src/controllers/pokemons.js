const {request, response} = require('express');
const pool = require('../db/connection');
const pokemonsModel = require('../models/pokemons');

const  getAllPokemons= async (req = request, res = response) =>{
    let conn;
    try{
        conn = await pool.getConnection();
        const pokemons = await conn.query(pokemonsModel.getAll);
        res.send(pokemons);

    }catch(error){
        res.status(500).json(error);
        return;
    }finally{
        if (conn) conn.end();
    }
}

const  getPokemonById= async (req = request, res = response) =>{
    const {id} = req.params;

    if (isNaN(id)){
        res.status(400).send({mensage: 'Invalid user ID'});
        return;
    }
    let conn;

    try{
        conn = await pool.getConnection();
        const [pokemon] = await conn.query(pokemonsModel.getById, [id]);
        
        if (!pokemon) {
            res.status(404).send({mensage: 'User not found'});
            return;
        }

        res.json(pokemon);
    }catch(error){
        res.status(500).json(error);
        return;
    }finally{
        if (conn) conn.end();
    }
}

const  get3RandomPokemons= async (req = request, res = response) =>{
    
    let conn;
    try{
        conn=await pool.getConnection();
        const pokemon= await conn.query(pokemonsModel.get3Random);
        res.send(pokemons);
    }catch(error){
        res.status(500).json(error);
        return;
    }finally{
        if (conn) conn.end();
    }
}

const  createPokemon= async (req = request, res = response) =>{
    const {
        name,
        image
    } = req.body;

    if (!name || !image){
            res.status(400).send({mensage: 'Missing required fields'});
            return;
        }
    let conn;

    try{
        conn = await pool.getConnection();
        const [pokemon_exists] = await conn.query(pokemonsModel.getByImage, [image]);

        if (pokemon_exists){
            res.status(409).send({mensage: 'User already exists'});
            return;
        }

        const newPokemons = await conn.query(pokemonsModel.addPokemon, [name, image]);

        if (newPokemons.affectedRows === 0) {
            res.status(500).send({message: 'Error adding user'});
            return;
        }

        res.status(201).send({mensage: 'User created'});
    }catch(error){
        res.status(500).json(error);
        return;
    }finally{
        if (conn) conn.end();
    }
}

const updatePokemon = async (req = request, res = response) => {
    const { id } = req.params;
    const { name, image } = req.body;

    if (isNaN(id)) {
        res.status(400).send({ message: 'Invalid Pokemon ID' });
        return;
    }

    if (!name || !image) {
        res.status(400).send({ message: 'Missing required fields: name or image' });
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();

        // Verificar que el Pokémon existe
        const [pokemon] = await conn.query(pokemonsModel.getById, [id]);
        if (!pokemon) {
            res.status(404).send({ message: 'Pokemon not found' });
            return;
        }

        // Verificar si la imagen ya está en uso por otro Pokémon
        const [imageExists] = await conn.query(pokemonsModel.imageValid, [image, id]);
        if (imageExists) {
            res.status(400).send({ message: 'Image already in use by another Pokemon' });
            return;
        }

        // Actualizar los datos del Pokémon
        const updateResult = await conn.query(pokemonsModel.editPokemon, [name, image, id]);
        if (updateResult.affectedRows === 0) {
            res.status(500).send({ message: 'Failed to update Pokemon' });
            return;
        }

        res.send({ message: 'Pokemon updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    } finally {
        if (conn) conn.end();
    }
};


const  deletePokemon= async (req = request, res = response) =>{
    const {id} = req.params;

    if (isNaN(id)){
        res.status(400).send({mensage: 'Invalid user ID'});
        return;
    }

    let conn;

    try{
        conn = await pool.getConnection();
        const [pokemon] = await conn.query(pokemonsModel.getById, [id]);

        if (!pokemon) {
            res.status(400).send({mensage: 'User not found'});
            return;
        }

        const deletedUser = await conn.query(pokemonsModel.delete, [id]);
        if (deletedUser.affectedRows === 0) {
            res.status(500).send({message: 'Error deleting user'});
            return;
        }

        res.send({message: 'User deleted'});

    }catch(error){
        res.status(500).json(error);
        return;
    }finally{
        if (conn) conn.end();
    }
}


module.exports = {
    getAllPokemons,
    getPokemonById,
    get3RandomPokemons,
    createPokemon,
    updatePokemon,
    deletePokemon,
}