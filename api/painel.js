export default function handler(req, res) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;

  const html = `<!DOCTYPE html>
  <html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Senhas Prontas - Realtime</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background: #f0f0f0;
        height: 100vh;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .container {
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        text-align: center;
        width: 90%;
        max-width: 600px;
      }
      .card {
        background-color: #fff;
        border: 1px solid #bbb;
        border-radius: 6px;
        margin: 10px 0;
        padding: 20px;
        font-size: 8em;
        font-weight: bold;
        animation: fadeIn 0.5s;
      }
      .highlight {
        animation: pulse 1s ease-in-out 6;
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes pulse {
        0% { background-color: #ffe066; transform: scale(1.1); }
        50% { background-color: #fff3bf; transform: scale(1.5); }
        100% { background-color: #ffe066; transform: scale(1.1); }
      }
      .fullscreen-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 10px 20px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Senhas Prontas</h1>
      <div id="senhas-container"></div>
      <button class="fullscreen-btn" onclick="toggleFullscreen()">Fullscreen</button>
    </div>
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
          div.textContent = s.id; // Altere para s.nome ou s.senha se necessário
          container.appendChild(div);
        });
      }

      supabase
        .channel('senhas-channel')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'senhas' }, payload => {
          if (payload.new.status) {
            const div = document.createElement('div');
            div.className = 'card highlight';
            div.textContent = payload.new.id; // ou payload.new.nome
            document.getElementById('senhas-container').prepend(div);
            new Audio('ding.mp3').play();
            setTimeout(() => div.classList.remove('highlight'), 3000);
          }
        })
        .subscribe();

      fetchSenhasProntas();

      window.toggleFullscreen = function () {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      };
    </script>
  </body>
  </html>`;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}
