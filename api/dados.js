import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  const senhaInicial = parseInt(req.query.senhaInicial || '1');
  const em_preparo = Array.from({ length: 10 }, (_, i) => ({
    id: senhaInicial + i
  }));

  const { data, error } = await supabase
    .from('senhas')
    .select('*')
    .eq('status', 'pronto');

  if (error) return res.status(500).json({ error });

  res.status(200).json({ em_preparo, prontos: data });
}
