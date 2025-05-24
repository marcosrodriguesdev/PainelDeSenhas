import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  console.log('🔧 Requisição recebida:', req.method, req.url);

  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // Extrair ID da URL
  const match = req.url.match(/\/api\/update_status\/(\d+)/);
  const id = match ? parseInt(match[1]) : null;

  if (!id || isNaN(id)) {
    console.error('❌ ID inválido:', id);
    return res.status(400).json({ error: 'ID inválido' });
  }

  // Verificar se a senha existe
  const { data: existente, error: erroBusca } = await supabase
    .from('senhas')
    .select('status')
    .eq('id', id)
    .single();

  if (erroBusca || !existente) {
    console.error('❌ Senha não encontrada:', erroBusca?.message);
    return res.status(404).json({ error: 'Senha não encontrada' });
  }

  // Atualizar status apenas se ainda não for true
  if (existente.status === true) {
    console.log('ℹ️ Senha já está marcada como pronta.');
    return res.status(200).json({ message: `Senha ${id} já estava pronta.` });
  }

  const { error: erroUpdate } = await supabase
    .from('senhas')
    .update({
      status: true,
      updated_at: new Date()
    })
    .eq('id', id);

  if (erroUpdate) {
    console.error('❌ Erro ao atualizar:', erroUpdate.message);
    return res.status(500).json({ error: erroUpdate.message });
  }

  console.log('✅ Senha atualizada com sucesso:', id);
  return res.status(200).json({ message: `Senha ${id} atualizada para pronto.` });
}
