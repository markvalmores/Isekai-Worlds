export const LOCAL_IPTV_EMBED_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TV Channels Embed</title>
  <style>
    :root {
      --bg-color: #0f172a;
      --card-bg: #1e293b;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --accent-color: #38bdf8;
      --border-color: #334155;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg-color);
      color: var(--text-main);
      padding: 12px;
    }

    .tv-embed-widget {
      width: 100%;
      height: 100%;
      min-height: 480px;
      display: flex;
      flex-direction: column;
      background-color: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
    }

    .widget-header {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: space-between;
      align-items: center;
      background-color: rgba(15, 23, 42, 0.4);
    }

    .controls {
      display: flex;
      gap: 8px;
      flex: 1;
      min-width: 200px;
    }

    input, select {
      background-color: var(--bg-color);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      padding: 8px 12px;
      border-radius: 6px;
      outline: none;
      font-size: 0.85rem;
    }

    input {
      flex: 1;
    }

    input:focus, select:focus {
      border-color: var(--accent-color);
    }

    .stats {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .channel-grid {
      flex: 1;
      overflow-y: auto;
      padding: 12px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 10px;
      align-content: start;
      max-height: 420px;
    }

    .channel-card {
      background-color: var(--bg-color);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 8px;
      transition: transform 0.15s ease, border-color 0.15s ease;
    }

    .channel-card:hover {
      transform: translateY(-2px);
      border-color: var(--accent-color);
    }

    .card-title {
      font-weight: 600;
      font-size: 0.95rem;
    }

    .card-meta {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .badge {
      font-size: 0.65rem;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
      font-weight: bold;
    }

    .badge-country { background-color: #334155; color: #e2e8f0; }
    .badge-cat { background-color: #0284c7; color: #ffffff; }

    .card-action {
      display: inline-block;
      text-align: center;
      background-color: var(--accent-color);
      color: #000;
      text-decoration: none;
      padding: 6px 12px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.8rem;
      margin-top: 4px;
    }

    .card-action:hover {
      opacity: 0.9;
    }

    .no-results {
      grid-column: 1 / -1;
      text-align: center;
      padding: 30px;
      color: var(--text-muted);
    }
  </style>
</head>
<body>
  <div class="tv-embed-widget">
    <div class="widget-header">
      <div class="controls">
        <input type="text" id="searchInput" placeholder="Search TV channels..." oninput="renderChannels()">
        <select id="categoryFilter" onchange="renderChannels()">
          <option value="">All Categories</option>
        </select>
      </div>
      <div class="stats" id="channelCount">Showing 0 channels</div>
    </div>

    <div class="channel-grid" id="channelGrid"></div>
  </div>

  <script>
    const channelData = [
      { id: "002RadioTV.do", name: "002 Radio TV", country: "DO", categories: ["general"], website: "https://www.002radio.com/" },
      { id: "00sReplay.us", name: "00s Replay", network: "Pluto TV", country: "US", categories: ["movies"], website: "https://pluto.tv/live-tv/00s-replay/details" },
      { id: "0TV.dk", name: "0-TV", country: "DK", categories: ["general"], website: "https://0-tv.dk/" },
      { id: "10.au", name: "10", country: "AU", categories: ["news"], website: "http://10play.com.au/" },
      { id: "1000xHoraTV.uy", name: "1000xHora TV", country: "UY", categories: ["auto"], website: "https://www.1000xhoratv.com/" },
      { id: "1001Noites.br", name: "1001 Noites", country: "BR", categories: ["shop"], website: "https://1001noites.com.br/" },
      { id: "100AutoMotoTV.bg", name: "100% Auto Moto TV", country: "BG", categories: ["auto"], website: "http://100automoto.tv/" },
      { id: "100NEWS.ua", name: "100% NEWS", country: "UA", categories: ["news", "business"], website: "https://www.100news.tv/" },
      { id: "100NLTV.nl", name: "100% NL TV", country: "NL", categories: ["music"], website: "https://www.100p.nl/" },
      { id: "101tvAntequera.es", name: "101tv Antequera", country: "ES", categories: ["general"], website: "https://www.101tv.es/antequera/" },
      { id: "101tvMalaga.es", name: "101tv Malaga", country: "ES", categories: ["news"], website: "https://www.101tv.es/endirecto101tv/" },
      { id: "10Bold.au", name: "10 Bold", country: "AU", categories: ["lifestyle", "relax"], website: "http://tenplay.com.au/" },
      { id: "10Channel.gr", name: "10 Channel", country: "GR", categories: ["entertainment"], website: "https://10channel.gr/" },
      { id: "10Peach.au", name: "10 Peach", country: "AU", categories: ["general"], website: "http://tenplay.com.au/" },
      { id: "10Shake.au", name: "10 Shake", country: "AU", categories: ["animation", "kids"], website: "http://10play.com.au" },
      { id: "10TV.in", name: "10 TV", country: "IN", categories: ["news"], website: "https://www.10tv.in/" },
      { id: "111TV.it", name: "111 TV", country: "IT", categories: ["general"], website: "https://www.111tv.it/" },
      { id: "123live.de", name: "123.live", country: "DE", categories: ["shop"], website: "https://www.123.live/" },
      { id: "123TV.ve", name: "123TV", country: "VE", categories: ["kids"], website: "https://123tvinfantil.blogspot.com/" },
      { id: "13C.cl", name: "13C", country: "CL", categories: ["culture"], website: "https://www.13.cl/c" },
      { id: "13Cocina.cl", name: "13 Cocina", country: "CL", categories: ["cooking"], website: "https://www.13go.cl/" },
      { id: "13emeRue.fr", name: "13eme Rue", country: "FR", categories: ["entertainment"], website: "https://www.13emerue.fr/" },
      { id: "13Kids.cl", name: "13 Kids", country: "CL", categories: ["kids"], website: "https://www.13.cl/13kids" },
      { id: "15TV.mx", name: "15TV", country: "MX", categories: ["general"], website: "https://15tv.com.mx/" },
      { id: "192TV.nl", name: "192TV", country: "NL", categories: ["music"], website: "http://www.192tv.tv/" },
      { id: "1HDMusicTelevision.ru", name: "1HD Music Television", country: "RU", categories: ["music"], website: "https://1hd.ru/" },
      { id: "1Plus1.ua", name: "1+1", country: "UA", categories: ["general"], website: "https://1plus1.ua/" },
      { id: "1TV.ge", name: "1TV", country: "GE", categories: ["general"], website: "https://1tv.ge/" },
      { id: "20.it", name: "20", country: "IT", categories: ["entertainment"], website: "https://www.mediasetplay.mediaset.it/20mediaset" },
      { id: "24Horas.cl", name: "24 Horas", country: "CL", categories: ["news"], website: "https://www.24horas.cl/" },
      { id: "24Horas.es", name: "24 Horas", country: "ES", categories: ["news", "public"], website: "http://www.rtve.es/alacarta/tve/24-horas/" },
      { id: "24Kitchen.us", name: "24Kitchen", country: "US", categories: ["cooking"], website: "https://www.24kitchen.bg/" },
      { id: "24NewsHD.pk", name: "24 News HD", country: "PK", categories: ["news"], website: "https://www.24newshd.tv/" },
      { id: "24TV.tr", name: "24 TV", country: "TR", categories: ["news"], website: "https://www.yirmidort.tv/" }
    ];

    function initFilters() {
      const categorySelect = document.getElementById('categoryFilter');
      const categories = new Set();

      channelData.forEach(item => {
        item.categories.forEach(cat => categories.add(cat));
      });

      Array.from(categories).sort().forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        categorySelect.appendChild(option);
      });
    }

    function renderChannels() {
      const searchValue = document.getElementById('searchInput').value.toLowerCase();
      const selectedCat = document.getElementById('categoryFilter').value;
      const container = document.getElementById('channelGrid');

      const filtered = channelData.filter(ch => {
        const matchesSearch = ch.name.toLowerCase().includes(searchValue) || 
                              ch.country.toLowerCase().includes(searchValue) ||
                              ch.id.toLowerCase().includes(searchValue);
        const matchesCategory = selectedCat === "" || ch.categories.includes(selectedCat);
        return matchesSearch && matchesCategory;
      });

      document.getElementById('channelCount').textContent = 'Showing ' + filtered.length + ' of ' + channelData.length + ' channels';

      if (filtered.length === 0) {
        container.innerHTML = '<div class="no-results">No channels found matching your criteria.</div>';
        return;
      }

      container.innerHTML = filtered.map(ch => {
        const categoriesHtml = ch.categories.map(c => '<span class="badge badge-cat">' + c + '</span>').join(' ');
        const websiteLink = ch.website ? '<a class="card-action" href="' + ch.website + '" target="_blank" rel="noopener">Visit Station</a>' : '';
        
        return \`
          <div class="channel-card">
            <div>
              <div class="card-title">\${ch.name}</div>
              <div class="card-meta" style="margin-top: 6px;">
                <span class="badge badge-country">\${ch.country}</span>
                \${categoriesHtml}
              </div>
            </div>
            \${websiteLink}
          </div>
        \`;
      }).join('');
    }

    initFilters();
    renderChannels();
  </script>
</body>
</html>`;
