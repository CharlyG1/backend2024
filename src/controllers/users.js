const {request, response} = require('express');
const pool = require('../db/connection');
const userQueries = require('../models/users');
const bcrypt = require('bcrypt');
const { get3RandomPokemons } = require('./pokemons');

const SALT_ROUNDS = 10;

const getAllUsers = async (req = request, res = response) =>{
    let conn;

    try{
        conn = await pool.getConnection();
        const users = await conn.query(userQueries.getAll);

        res.json(users);
        return;

    }catch(error){
        res.status(500).json(error);
        return;
    }finally{
        if (conn) conn.end();
    }
}

const createUser = async (req = request, res = response) =>{
    const {
        first_name,
        last_name,
        email,
        password
    } = req.body;

    if (!first_name || !last_name || !email || !password){
            res.status(400).send({mensage: 'Missing required fields'});
            return;
        }
    let conn;

    try{
        conn = await pool.getConnection();
        const [user_exists] = await conn.query(userQueries.getByEmail, [email]);

        if (user_exists){
            res.status(409).send({mensage: 'User already exists'});
            return;
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const newUser = await conn.query(userQueries.addUser, [first_name, last_name, email, hashedPassword]);

        if (newUser.affectedRows === 0) {
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


const getUser = async (req = request, res = response) =>{
    const {id} = req.params;

    if (isNaN(id)){
        res.status(400).send({mensage: 'Invalid user ID'});
        return;
    }
    let conn;

    try{
        conn = await pool.getConnection();
        const [user] = await conn.query(userQueries.getById, [id]);
        
        if (!user) {
            res.status(404).send({mensage: 'User not found'});
            return;
        }

        res.json(user);
    }catch(error){
        res.status(500).json(error);
        return;
    }finally{
        if (conn) conn.end();
    }
}

const updateUser = async (req = request, res = response) => {
    const {id} = req.params;
    const {
        first_name,
        last_name,
        email
    } = req.body;

    if (isNaN(id)){
        res.status(400).send({mensage: 'Invalid user ID'});
        return;
    }
    
    if (!first_name || !last_name || !email){
        res.status(400).send({mensage: 'Missing required fields'});
        return;
    }

    let conn;
    try{
        conn = await pool.getConnection();
        const [user] = await conn.query(userQueries.getById, [id]);
        if (!user) {
            res.status(404).send({mensage: 'User not found'});
            return;
        }

        const [emailExistst] = await conn.query(userQueries.emailValid, [email, id]);
        if (emailExistst) {
            res.status(400).send({mensage: 'Email already in use'});
            return;
        }
        const updatedUser = await conn.query(userQueries.editUser, [first_name, last_name, email, id]);
        if (updatedUser.affectedRows === 0){
            res.status(500).send({mensage: 'User not update'});
            return;
        }
     res.send({message: 'User updated'});
    }catch(error){
        res.status(500).json(error);
        return;
    }finally{
        if (conn) conn.end();
    }
}



const destroyUser = async (req = request, res = response) =>{
    const {id} = req.params;

    if (isNaN(id)){
        res.status(400).send({mensage: 'Invalid user ID'});
        return;
    }

    let conn;

    try{
        conn = await pool.getConnection();
        const [user] = await conn.query(userQueries.getById, [id]);

        if (!user) {
            res.status(400).send({mensage: 'User not found'});
            return;
        }

        const deletedUser = await conn.query(userQueries.delete, [id]);
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
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    destroyUser,
};

/*
const  = async (req = request, res = response) =>{
    
    let conn;
    try{

    }catch(error){
        res.status(500).json(error);
        return;
    }finally{
        if (conn) conn.end();
    }
}
    */