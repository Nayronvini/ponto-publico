const supabase = require('../config/supabase');

const PontoPublicoModel = {
  //Função de listar todos pontos
  async getAll() {
    const { data, error } = await supabase.from('pontos_publicos').select('*');
    if (error) throw error;
    return data;
  },

  //Função de criar ponto
  async create(ponto) {
    const { data, error } = await supabase
      .from('pontos_publicos')
      .insert([{
        nome: ponto.nome,
        endereco: ponto.endereco,
        descricao: ponto.descricao,
        horario_funcionamento: ponto.horario_funcionamento,
        telefone: ponto.telefone,
        latitude: parseFloat(ponto.latitude),
        longitude: parseFloat(ponto.longitude),
      
        geom: `POINT(${ponto.longitude} ${ponto.latitude})` 
      }])
      .select();

    if (error) throw error;
    return data;
  },

  //Função de atualizar ponto
  async update(id, dados) {
    const payload = { ...dados };
    
    if (dados.latitude && dados.longitude) {
        payload.latitude = parseFloat(dados.latitude);
        payload.longitude = parseFloat(dados.longitude);
        payload.geom = `POINT(${dados.longitude} ${dados.latitude})`;
    }

    const { data, error } = await supabase
      .from('pontos_publicos')
      .update(payload)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data;
  },

  // Deletar Ponto
  async delete(id) {
    const { error } = await supabase
      .from('pontos_publicos')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};

module.exports = PontoPublicoModel;