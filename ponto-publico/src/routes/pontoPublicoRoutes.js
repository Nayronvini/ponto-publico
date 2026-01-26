const express = require('express');
const router = express.Router();
const PontoPublicoController = require('../controllers/PontoPublicoController');

// Definição das Rotas
router.get('/', PontoPublicoController.listar);      // Listar todos
router.post('/', PontoPublicoController.criar);      // Criar novo
router.put('/:id', PontoPublicoController.atualizar); // Atualizar pelo ID
router.delete('/:id', PontoPublicoController.deletar); // Deletar pelo ID

module.exports = router;