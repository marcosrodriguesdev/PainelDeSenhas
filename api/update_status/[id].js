import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { error } = await supabase
    .from('senhas')
    .upsert({ id: parseInt(id), status: 'pronto', updated_at: new Date() });

  if (error) return res.status(500).json({ error });

  res.status(200).json({ message: 'Status atualizado com sucesso' });
}
