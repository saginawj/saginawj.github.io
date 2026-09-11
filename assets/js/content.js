window.siteContent = (() => {
const regions = [
  { id: 'places', name: 'Places', number: '01', description: 'Where I’ve been and where I’m going.', visibility: 'private', app: { name: 'Twiga Dunia', description: 'My travel map, trips, photographs, and stories.', icon: 'assets/img/favicon.png', iconAlt: 'Twiga Dunia globe icon', fallback: 'TD', url: 'https://travel.goodluckfinding.me' } },
  { id: 'money', name: 'Money', number: '02', description: 'How I spend, save, invest, and pay attention.', visibility: 'private', position: 'east', app: { name: 'Twiga Akiba', description: 'A private system for understanding my financial life.', icon: '', iconAlt: '', fallback: 'TA', url: 'https://finance.goodluckfinding.me' } },
  { id: 'memory', name: 'Memory', number: '03', description: 'What I want to remember, and who was there.', visibility: 'private', app: { name: 'Yalda', description: 'My journal, life record, and relationship memory.', icon: '', iconAlt: '', fallback: 'YA', url: 'https://journal.goodluckfinding.me' } },
  { id: 'body', name: 'Body', number: '04', description: 'Health, movement, sleep, and the physical record.', visibility: 'future', app: null }
];
const projects = [
  { id: 'meanwhile', name: 'Meanwhile', mark: 'MW', description: 'A place for work that belongs in the space between everything else.', status: 'building', year: '2026', url: '', githubUrl: '' },
  { id: 'reimagined', name: 'Reimagined', mark: 'RE', description: 'Personalized books made from the photographs people already care about.', status: 'building', year: '', url: '', githubUrl: '' },
  { id: 'daily-pod', name: 'My Daily Pod', mark: 'MDP', description: 'Selected YouTube videos turned into short, AI-generated podcast recaps.', status: 'building', year: '', url: '', githubUrl: '' },
  { id: 'mementa', name: 'Mementa', mark: 'ME', description: 'A personal relationship archive assembled from years of old mailboxes.', status: 'building', year: '', url: '', githubUrl: '' },
  { id: 'octofeeder', name: 'OctoFeeder', mark: 'OF', description: 'An Iran-focused, Telegram-first news tool for comparing sources and narratives.', status: 'public', year: '2026', url: 'https://t.me/octopusfeeder', githubUrl: 'https://github.com/saginawj/telegram-octopus-feeder' },
  { id: 'yalda-bot', name: 'Yalda Bot', mark: 'YB', description: 'A Telegram companion for images, stories, summaries, searchable memory, and timelines.', status: 'public', year: '', url: 'https://yaldabot.up.railway.app/', githubUrl: '' },
  { id: 'reddit-companion', name: 'MCP Reddit Companion', mark: 'RC', description: 'Natural-language access to a calmer, more useful personal Reddit feed.', status: 'public', year: '2025', url: 'https://github.com/saginawj/mcp-reddit-companion', githubUrl: 'https://github.com/saginawj/mcp-reddit-companion' },
  { id: 'youtube-companion', name: 'MCP YouTube Companion', mark: 'YT', description: 'A personal YouTube feed for LLM clients, with trending and subscribed-channel video discovery.', status: 'public', year: '2025', url: 'https://github.com/saginawj/mcp-server-youtube', githubUrl: 'https://github.com/saginawj/mcp-server-youtube' }
];
const countryCodeString = `
dz ao bj bw bf bi cv cm cf td km cg cd ci dj eg gq er sz et ga gm gh gn gw ke ls lr ly mg mw ml mr mu ma mz na ne ng rw st sn sc sl so za ss sd tz tg tn ug zm zw
af am az bh bd bt bn kh cn cy ge in id ir iq il jp jo kz kw kg la lb my mv mn mm np kp om pk ps ph qa sa sg kr lk sy tj th tl tr tm ae uz vn ye tw
al ad at by be ba bg hr cz dk ee fi fr de gr hu is ie it lv li lt lu mt md mc me nl mk no pl pt ro ru sm rs sk si es se ch ua gb va xk
ag bs bb bz ca cr cu dm do sv gd gt ht hn jm mx ni pa kn lc vc tt us
ar bo br cl co ec gy py pe sr uy ve
au fj ki mh fm nr nz pw pg ws sb to tv vu
`;
const officialCountryCodes = countryCodeString.trim().split(/\s+/);
const provisionalUnvisitedCodes = ['ir','kp','ps','ve','jm','do','ht','dm','gd','kn','vc','lc'];
const countryNotes = { gl: { visited: true, year: '2018', note: 'Ice, rock, and a very good reason to stop walking.' }, us: { visited: true, note: 'Home base: New York.' } };
const travelData = officialCountryCodes.map((code) => ({ code, visited: !provisionalUnvisitedCodes.includes(code), provisional: true, ...(countryNotes[code] || {}) }));
return { regions, projects, officialCountryCodes, countryNotes, travelData };
})();
