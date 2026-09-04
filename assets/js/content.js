export const projects = [
  { title: 'My Daily Pod', mark: 'MDP', status: 'Product', year: '', summary: 'Turns selected YouTube videos into short, AI-generated podcast recaps for daily or on-demand listening.', technologies: ['AI audio', 'YouTube', 'Podcasting'], primaryLink: '', repositoryLink: '', draft: false },
  { title: 'Twiga Dunia', mark: 'TD', status: 'Travel tool', year: '', summary: 'An interactive map tracking my countdown to visiting all 197 countries.', technologies: ['Next.js', 'Travel', 'Mapping'], primaryLink: '', repositoryLink: '', draft: false },
  { title: 'Twiga Akiba', mark: 'TA', status: 'Travel tool', year: '', summary: 'Tracks travel and everyday spending, then analyzes how the two compare.', technologies: ['Next.js', 'Travel', 'Analytics'], primaryLink: '', repositoryLink: '', draft: false },
  { title: 'Reimagined', mark: 'RE', status: 'Creative tool', year: '', summary: 'Creates personalized books from uploaded photographs.', technologies: ['MongoDB', 'Python', 'OpenAI', 'React'], primaryLink: '', repositoryLink: '', draft: false },
  { title: 'Mementa', mark: 'ME', status: 'Personal CRM', year: '', summary: 'A personal relationship archive built from extracts across dozens of old mailboxes.', technologies: ['MongoDB', 'Python', 'React', 'OpenAI'], primaryLink: '', repositoryLink: '', draft: false },
  { title: 'OctoFeeder', mark: 'OF', status: 'Building', year: '2026', summary: 'An Iran-focused, Telegram-first news tool that brings multiple sources into one flow, with summaries, source inspection, and narrative comparison.', technologies: ['Telegram', 'AI', 'News'], primaryLink: 'https://t.me/octopusfeeder', repositoryLink: 'https://github.com/saginawj/telegram-octopus-feeder', linkLabel: 'OPEN CHANNEL', draft: false },
  { title: 'Yalda Bot', mark: 'YB', status: 'Live', year: '', summary: 'An intelligent Telegram companion that turns conversations into images, stories, summaries, searchable memory, and visual timelines.', technologies: ['Telegram', 'Generative AI', 'Knowledge'], primaryLink: 'https://yaldabot.up.railway.app/', repositoryLink: '', linkLabel: 'MEET YALDA', draft: false },
  { title: 'MCP Reddit Companion', mark: 'RC', status: 'Open source', year: '2025', summary: 'Natural-language access to a personal Reddit experience: curated feeds, analysis, summaries, and the conversations that matter.', technologies: ['Python', 'MCP', 'Reddit API'], primaryLink: 'https://github.com/saginawj/mcp-reddit-companion', repositoryLink: 'https://github.com/saginawj/mcp-reddit-companion', linkLabel: 'VIEW SOURCE', draft: false },
  { title: 'MCP YouTube Companion', mark: 'YT', status: 'Open source', year: '2025', summary: 'A personal YouTube feed for LLM clients, with trending videos and recent uploads from subscribed channels via OAuth.', technologies: ['Python', 'MCP', 'YouTube API'], primaryLink: 'https://github.com/saginawj/mcp-server-youtube', repositoryLink: 'https://github.com/saginawj/mcp-server-youtube', linkLabel: 'VIEW SOURCE', draft: false },
  { title: 'Next build', mark: '03', status: 'In progress', year: '', summary: '', technologies: [], primaryLink: '', repositoryLink: '', draft: true },
  { title: 'Next experiment', mark: '04', status: 'Field test', year: '', summary: '', technologies: [], primaryLink: '', repositoryLink: '', draft: true }
];

export const photos = [
  { id: 'greenland-001', src: 'assets/img/greenland-hero-2.jpg', alt: 'Jon standing on a rocky overlook above icebergs and a glacier in Greenland', country: 'Greenland', caption: 'Looking out over the ice near Nuuk.', date: '2018', orientation: 'landscape', draft: false },
  ...Array.from({ length: 8 }, (_, index) => ({ id: `photo-slot-${String(index + 2).padStart(3, '0')}`, src: '', alt: '', country: '', caption: '', date: '', orientation: index % 3 === 0 ? 'portrait' : 'landscape', draft: true }))
];

// 193 UN members + Palestine + Vatican City + Kosovo + Taiwan = the site's 197-country convention.
const countryCodeString = `
dz ao bj bw bf bi cv cm cf td km cg cd ci dj eg gq er sz et ga gm gh gn gw ke ls lr ly mg mw ml mr mu ma mz na ne ng rw st sn sc sl so za ss sd tz tg tn ug zm zw
af am az bh bd bt bn kh cn cy ge in id ir iq il jp jo kz kw kg la lb my mv mn mm np kp om pk ps ph qa sa sg kr lk sy tj th tl tr tm ae uz vn ye tw
al ad at by be ba bg hr cz dk ee fi fr de gr hu is ie it lv li lt lu mt md mc me nl mk no pl pt ro ru sm rs sk si es se ch ua gb va xk
ag bs bb bz ca cr cu dm do sv gd gt ht hn jm mx ni pa kn lc vc tt us
ar bo br cl co ec gy py pe sr uy ve
au fj ki mh fm nr nz pw pg ws sb to tv vu
`;

export const officialCountryCodes = countryCodeString.trim().split(/\s+/);

// TODO: Replace this provisional set with Jon's exact unvisited-country list.
// It preserves the last published 175/197 total without presenting invented trip notes.
export const provisionalUnvisitedCodes = [
  'ir', // Iran
  'kp', // North Korea
  'ps', // Palestine
  've', // Venezuela
  'jm', // Jamaica
  'do', // Dominican Republic
  'ht', // Haiti
  'dm', // Dominica
  'gd', // Grenada
  'kn', // Saint Kitts and Nevis
  'vc', // Saint Vincent and the Grenadines
  'lc', // Saint Lucia
];
export const countryNotes = {
  gl: { visited: true, year: '2018', note: 'Field note 001. Ice, rock, and a very good reason to stop walking.' },
  us: { visited: true, note: 'Home base: New York.' }
};

export const travelData = officialCountryCodes.map((code) => ({ code, visited: !provisionalUnvisitedCodes.includes(code), provisional: true, ...(countryNotes[code] || {}) }));
