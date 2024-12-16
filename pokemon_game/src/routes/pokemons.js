const {Router} = require('express');
const { getAllPokemons, getPokemonById,  get3RandomPokemons, createPokemon, updatePokemon, deletePokemon} = require('../controllers/pokemons');


const routes =  Router();

routes.get('/', getAllPokemons);
routes.get('/:id', getPokemonById);
routes.get('/play', get3RandomPokemons);
routes.post('/', createPokemon);
routes.put('/:id', updatePokemon);
routes.delete('/:id', deletePokemon);

module.exports = routes;