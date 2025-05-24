import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  const senhaInicial = parseInt(req.query.senhaInicial || '1');

  // Gera as 10 senhas a partir da senha inicial
  const todas = Array.from({ length: 10 }, (_, i) => senhaInicial + i);

  // Busca as senhas já marcadas como "pronto"
  const { data: prontos, error } = await supabase
    .from('senhas')
    .select('id')
    .eq('status', 'pronto');

  if (error) return res.status(500).json({ error });

  const idsProntos = prontos.map(s => s.id);

  // Remove da lista "em_preparo" as que já estão prontas
  const em_preparo = todas
    .filter(id => !idsProntos.includes(id))
    .map(id => ({ id }));

  res.status(200).json({ em_preparo, prontos });
}
