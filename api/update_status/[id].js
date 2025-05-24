import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  console.log("🔧 Requisição recebida:", req.method, req.url);
  const { id } = req.query;

  if (req.method !== 'PATCH') {
    console.warn("⚠️ Método não permitido:", req.method);
    return res.status(405).json({ error: 'Método não permitido' });
  }

  console.log("📦 Atualizando senha ID:", id);

  const { error } = await supabase
    .from('senhas')
    .update({
      status: true,
      updated_at: new Date()
    })
    .eq('id', parseInt(id));

  if (error) {
    console.error("❌ Erro ao atualizar:", error.message);
    return res.status(500).json({ error: error.message });
  }

  console.log("✅ Senha atualizada com sucesso:", id);
  return res.status(200).json({ message: `Senha ${id} atualizada para pronto.` });
}
