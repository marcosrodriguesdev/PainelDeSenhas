import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  const senhaInicial = parseInt(req.query.senhaInicial || '1');

  // Busca as 10 senhas a partir da senha inicial que ainda não estão prontas
  const { data: em_preparo, error: erroPreparo } = await supabase
    .from('senhas')
    .select('id')
    .eq('status', false)
    .gte('id', senhaInicial)
    .order('id', { ascending: true })
    .limit(10);

  // Busca todas as senhas que já estão prontas
  const { data: prontos, error: erroProntos } = await supabase
    .from('senhas')
    .select('id')
    .eq('status', true)
    .order('updated_at', { ascending: false });

  if (erroPreparo || erroProntos) {
    return res.status(500).json({ error: erroPreparo || erroProntos });
  }

  res.status(200).json({
    em_preparo: em_preparo.map(s => ({ id: s.id })),
    prontos: prontos.map(s => ({ id: s.id }))
  });
}
