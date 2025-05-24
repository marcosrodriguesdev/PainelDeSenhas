import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  const senhaInicial = parseInt(req.query.senhaInicial || '1');

  // 1. Resetar todas as senhas prontas para "em preparo"
  const { error: erroReset } = await supabase
    .from('senhas')
    .update({ status: false })
    .eq('status', true);

  if (erroReset) {
    return res.status(500).json({ error: 'Erro ao resetar senhas prontas', detalhes: erroReset.message });
  }

  // 2. Buscar as 10 senhas em preparo a partir da senha inicial
  const { data: em_preparo, error: erroPreparo } = await supabase
    .from('senhas')
    .select('id')
    .eq('status', false)
    .gte('id', senhaInicial)
    .order('id', { ascending: true })
    .limit(10);

  if (erroPreparo) {
    return res.status(500).json({ error: 'Erro ao buscar senhas em preparo', detalhes: erroPreparo.message });
  }

  res.status(200).json({
    em_preparo: em_preparo.map(s => ({ id: s.id })),
    prontos: [] // Nenhuma senha estará pronta após o reset
  });
}
