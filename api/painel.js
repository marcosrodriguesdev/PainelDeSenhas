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
      }
      .senha {
        font-size: 2em;
        margin: 10px 0;
        animation: fadeIn 0.5s;
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
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
          div.className = 'senha';
          div.textContent = s.nome;
          container.appendChild(div);
        });
      }
      supabase.from('senhas').on('UPDATE', payload => {
        if (payload.new.status) {
          fetchSenhasProntas();
          new Audio('beep-07.wav').play();
        }
      }).subscribe();
      fetchSenhasProntas();
      function toggleFullscreen() {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      }
    </script>
  </body>
  </html>`;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}
