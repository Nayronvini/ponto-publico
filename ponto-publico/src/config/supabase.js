require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Verifica se as chaves existem
if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL ou Key não encontradas no .env');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false, // Para não precisar renovar token
    persistSession: false    // Para não precisar salvar sessão
  }
});

module.exports = supabase;