const PontoPublicoModel = require('../models/PontoPublicoModel');

const PontoPublicoController = {
  // GET /pontos
  // Esse esta funcionando (Graças a Deus)
  async listar(req, res) {
    try {
      const pontos = await PontoPublicoModel.getAll();
      return res.status(200).json(pontos);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // POST /pontos
  async criar(req, res) {
    try {
      const { nome, endereco, latitude, longitude, descricao, horario_funcionamento, telefone } = req.body;

      // Validação
      if (!nome || !latitude || !longitude) {
        return res.status(400).json({ error: 'Nome, Latitude e Longitude são obrigatórios.' });
      }

      const novoPonto = await PontoPublicoModel.create({ 
        nome, endereco, latitude, longitude, descricao, horario_funcionamento, telefone 
      });

      return res.status(201).json(novoPonto);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // PUT /pontos/:id
  // Esse provavelmente tbm n vai funcionar :(
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const dados = req.body;
      const atualizado = await PontoPublicoModel.update(id, dados);
      return res.status(200).json(atualizado);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // DELETE /pontos/:id
  async deletar(req, res) {
    try {
      const { id } = req.params;
      await PontoPublicoModel.delete(id);
      return res.status(204).send(); // 204 = sem cnteudo
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

module.exports = PontoPublicoController;