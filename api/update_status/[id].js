import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  console.log('Requisição recebida:', req.method, req.url);

  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // Extrair ID manualmente da URL
  const match = req.url.match(/\/api\/update_status\/(\d+)/);
  const id = match ? match[1] : null;

  if (!id || isNaN(parseInt(id))) {
    console.error('❌ ID inválido:', id);
    return res.status(400).json({ error: 'ID inválido' });
  }

  const idNum = parseInt(id);
  console.log('🔄 Atualizando senha ID:', idNum);

  const { error } = await supabase
    .from('senhas')
    .update({
      status: true,
      updated_at: new Date()
    })
    .eq('id', idNum);

  if (error) {
    console.error('❌ Erro ao atualizar:', error.message);
    return res.status(500).json({ error: error.message });
  }

  console.log('✅ Senha atualizada com sucesso:', idNum);
  return res.status(200).json({ message: `Senha ${idNum} atualizada para pronto.` });
}
