import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { error } = await supabase
    .from('senhas')
    .update({ status: false })
    .eq('status', true);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: 'Senhas resetadas com sucesso.' });
}
