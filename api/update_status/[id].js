import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  console.log("Método:", req.method, "ID:", req.query.id);
  const { id } = req.query;

  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { error } = await supabase
    .from('senhas')
    .update({
      status: true,
      updated_at: new Date()
    })
    .eq('id', parseInt(id));

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ message: `Senha ${id} atualizada para pronto.` });
}
