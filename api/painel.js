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
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .container {
        background-color: #e9ecef;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        text-align:px;
      }
      .card {
        background-color: #fff;
        border: 1px solid #bbb;
        border-radius: 6px;
        margin: 10px 0;
        padding: 20px;
        font-size: 7em;
        font-weight: bold;
        text-align: center;
      }
      .highlight {
        animation: pulse 1s ease-in-out 3;
      }
      @keyframes pulse {
        0% { background-color: #ffe066; transform: scale(1.1); }
        50% { background-color: #fff3bf; transform: scale(1.5); }
        100% { background-color: #ffe066; transform: scale(1.1); }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>🟢 PRONTO</h2>
      <div id="senhas-container"></div>
    </div>
    <audio id="ding" src="/ding.mp3" preload="auto"></audio>
    <script type="module">
      import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
      const supabase = createClient('${SUPABASE_URL}', '${SUPABASE_KEY}');

      async function fetchSenhasProntas() {
        const { data, error } = await supabase.from('senhas').select('*').eq('status', true);
        if (error) return console.error('Erro:', error);
        const container = document.getElementById('senhas-container');
        container.innerHTML = '';
        data.forEach(s => {
          const div = document.createElement('div');
          div.className = 'card';
          div.textContent = s.id;
          container.appendChild(div);
        });
      }

      supabase
        .channel('senhas-channel')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'senhas' }, payload => {
          if (payload.new.status) {
            const container = document.getElementById('senhas-container');
            const div = document.createElement('div');
            div.className = 'card highlight';
            div.textContent = payload.new.id;
            const existente = Array.from(container.children).some(child => child.textContent === String(payload.new.id));
            if (!existente) {
              container.prepend(div);
              document.getElementById('ding').play();
              setTimeout(() => div.classList.remove('highlight'), 3000);
            }
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
