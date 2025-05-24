export default function handler(req, res) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;

  const html = `<!DOCTYPE html>
  <html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Senhas Prontas</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 20px;
        box }
      .painel {
        display: flex;
        gap: 20px;
        max-width: 1200px;
        margin: 0 auto;
      }
      .coluna {
        flex: 1;
        background-color: #e9ecef;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }
      .coluna h2 {
        margin-top: 0;
        text-align: center;
      }
      .ultima-senha {
        font-size: 10em;
        font-weight: bold;
        text-align: center;
        background-color: #fff;
        border: 2px solid #bbb;
        border-radius: 10px;
        padding: 30px;
        margin-top: 20px;
      }
      .highlight {
        animation: pulse 1s ease-in-out 3;
      }
      @keyframes pulse {
        0% { background-color: #ffe066; transform: scale(1.1); }
        50% { background-color: #fff3bf; transform: scale(1.5); }
        100% { background-color: #ffe066; transform: scale(1.1); }
      }
      .card {
        background-color: #fff;
        border: 1px solid #bbb;
        border-radius: 6px;
        margin: 10px 0;
        padding: 20px;
        font-size: 5em;
        font-weight: bold;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="painel">
      <div class="coluna">
        <h2>🔔 Última Senha</h2>
        <div id="ultima-senha" class="ultima-senha">--</div>
      </div>
      <div class="coluna">
        <h2>🟢 Senhas Anteriores</h2>
        <div id="senhas-anteriores"></div>
      </div>
    </div>
    <audio id="ding" src="/ding.mp3" preload="auto"></audio>
    <script type="module">
      import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
      const supabase = createClient('${SUPABASE_URL}', '${SUPABASE_KEY}');

      async function fetchSenhasProntas() {
        const { data, error } = await supabase
          .from('senhas')
          .select('*')
          .eq('status', true)
          .order('updated_at', { ascending: false }); // ou 'created_at' se for o campo correto

        if (error) return console.error('Erro:', error);

        const ultimaSenhaDiv = document.getElementById('ultima-senha');
        const anterioresContainer = document.getElementById('senhas-anteriores');
        anterioresContainer.innerHTML = '';

        if (data.length > 0) {
          ultimaSenhaDiv.textContent = data[0].id;
          data.slice(1).forEach(s => {
            const div = document.createElement('div');
            div.className = 'card';
            div.textContent = s.id;
            anterioresContainer.appendChild(div);
          });
        }
      }

      supabase
        .channel('senhas-channel')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'senhas' }, payload => {
          if (payload.new.status) {
            document.getElementById('ding').play();
            fetchSenhasProntas();
          }
        })
        .subscribe();

      fetchSenhasProntas();
    </script>
  </body>
  </html>`;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}
