export type LevelKey = 'easy' | 'fill' | 'medium' | 'hard';
export type Lang = 'en' | 'zh';

export interface Country {
  code: string;
  name: { en: string; zh: string };
  /** 3 short kid-friendly facts per language. Cycled when the kid gets the answer wrong. */
  hints: { en: string[]; zh: string[] };
  pools: { easy: boolean; fill: boolean; medium: boolean; hard: boolean };
}

type Seed = Omit<Country, 'pools'>;

function withAllPools(seeds: Seed[]): Country[] {
  return seeds.map((c) => ({
    ...c,
    pools: { easy: true, fill: true, medium: true, hard: true },
  }));
}

/**
 * 50 curated, kid-friendly countries — distinctive flags, short names,
 * famous landmarks. Each has 3 hints in EN + ZH.
 */
export const CURATED: Country[] = withAllPools([
  {
    code: 'us',
    name: { en: 'United States', zh: '美国' },
    hints: {
      en: ['Has the Statue of Liberty', 'Home to Disneyland and Hollywood', '50 stars on the flag'],
      zh: ['有自由女神像', '迪士尼乐园和好莱坞在这里', '国旗上有50颗星'],
    },
  },
  {
    code: 'ca',
    name: { en: 'Canada', zh: '加拿大' },
    hints: {
      en: ['Famous for maple syrup', 'Has Niagara Falls', 'Hockey is the national sport'],
      zh: ['枫糖最有名', '有尼亚加拉大瀑布', '冰球是国球'],
    },
  },
  {
    code: 'mx',
    name: { en: 'Mexico', zh: '墨西哥' },
    hints: {
      en: ['Tacos come from here', 'Has ancient Aztec pyramids', 'Famous for the Day of the Dead'],
      zh: ['玉米卷饼来自这里', '有古老的金字塔', '亡灵节最有名'],
    },
  },
  {
    code: 'br',
    name: { en: 'Brazil', zh: '巴西' },
    hints: {
      en: ['Home of the Amazon rainforest', 'Famous for Carnival and samba', 'Has the Christ the Redeemer statue'],
      zh: ['亚马逊雨林在这里', '狂欢节和桑巴舞最有名', '有救世基督像'],
    },
  },
  {
    code: 'ar',
    name: { en: 'Argentina', zh: '阿根廷' },
    hints: {
      en: ['Tango dance was born here', 'Famous for football and Messi', 'Has Patagonia and penguins'],
      zh: ['探戈舞诞生于此', '足球和梅西的故乡', '有巴塔哥尼亚和企鹅'],
    },
  },
  {
    code: 'cl',
    name: { en: 'Chile', zh: '智利' },
    hints: {
      en: ['A very long, narrow country', 'Has the Atacama, the driest desert', 'Famous for Easter Island statues'],
      zh: ['国土又长又窄', '有最干旱的阿塔卡马沙漠', '复活节岛石像最有名'],
    },
  },
  {
    code: 'pe',
    name: { en: 'Peru', zh: '秘鲁' },
    hints: {
      en: ['Home of Machu Picchu', 'Llamas and alpacas live here', 'Potatoes were first grown here'],
      zh: ['马丘比丘古城在这里', '有羊驼和驼羊', '土豆最早在这里种植'],
    },
  },
  {
    code: 'co',
    name: { en: 'Colombia', zh: '哥伦比亚' },
    hints: {
      en: ['Famous for coffee', 'Has rainforests and Andes mountains', 'Capital is Bogotá'],
      zh: ['咖啡最有名', '有雨林和安第斯山脉', '首都是波哥大'],
    },
  },
  {
    code: 'gb',
    name: { en: 'United Kingdom', zh: '英国' },
    hints: {
      en: ['Has Big Ben and red double-decker buses', 'Home of Harry Potter', 'Afternoon tea is a tradition'],
      zh: ['有大本钟和红色双层巴士', '哈利波特的故乡', '下午茶是传统'],
    },
  },
  {
    code: 'fr',
    name: { en: 'France', zh: '法国' },
    hints: {
      en: ['Home of the Eiffel Tower', 'Famous for croissants and baguettes', 'The Mona Lisa is here'],
      zh: ['埃菲尔铁塔在这里', '可颂和长棍面包最有名', '蒙娜丽莎在这里'],
    },
  },
  {
    code: 'de',
    name: { en: 'Germany', zh: '德国' },
    hints: {
      en: ['Famous for cars like BMW and Mercedes', 'Pretzels and bratwurst are popular', 'Has the Brandenburg Gate'],
      zh: ['宝马和奔驰等汽车最有名', '椒盐卷饼和香肠很受欢迎', '有勃兰登堡门'],
    },
  },
  {
    code: 'it',
    name: { en: 'Italy', zh: '意大利' },
    hints: {
      en: ['Pizza and pasta come from here', 'Has the Leaning Tower of Pisa', 'Rome has the Colosseum'],
      zh: ['披萨和意大利面来自这里', '有比萨斜塔', '罗马有斗兽场'],
    },
  },
  {
    code: 'es',
    name: { en: 'Spain', zh: '西班牙' },
    hints: {
      en: ['Home of flamenco dance', 'Paella is a famous dish', 'Famous for Picasso paintings'],
      zh: ['弗拉门戈舞的故乡', '西班牙海鲜饭最有名', '毕加索的画很有名'],
    },
  },
  {
    code: 'nl',
    name: { en: 'Netherlands', zh: '荷兰' },
    hints: {
      en: ['Famous for tulips and windmills', 'People love bicycles here', 'Amsterdam has lots of canals'],
      zh: ['郁金香和风车最有名', '人们爱骑自行车', '阿姆斯特丹有很多运河'],
    },
  },
  {
    code: 'ch',
    name: { en: 'Switzerland', zh: '瑞士' },
    hints: {
      en: ['Famous for chocolate and cheese', 'Has the Alps with skiing', 'Watches and Swiss Army knives'],
      zh: ['巧克力和奶酪最有名', '有阿尔卑斯山可以滑雪', '手表和瑞士军刀很有名'],
    },
  },
  {
    code: 'se',
    name: { en: 'Sweden', zh: '瑞典' },
    hints: {
      en: ['Home of IKEA and ABBA', 'Famous for Swedish meatballs', 'Lots of forests and lakes'],
      zh: ['宜家和ABBA乐队的故乡', '瑞典肉丸最有名', '有很多森林和湖泊'],
    },
  },
  {
    code: 'no',
    name: { en: 'Norway', zh: '挪威' },
    hints: {
      en: ['Has beautiful fjords', 'Vikings came from here', 'See the Northern Lights here'],
      zh: ['有美丽的峡湾', '维京人的故乡', '可以看到北极光'],
    },
  },
  {
    code: 'gr',
    name: { en: 'Greece', zh: '希腊' },
    hints: {
      en: ['Birthplace of the Olympics', 'Has the ancient Parthenon', 'Greek yogurt and feta cheese'],
      zh: ['奥运会的发源地', '有古老的帕特农神庙', '希腊酸奶和菲达奶酪'],
    },
  },
  {
    code: 'ru',
    name: { en: 'Russia', zh: '俄罗斯' },
    hints: {
      en: ['The biggest country in the world', 'Famous for matryoshka nesting dolls', 'Moscow has the Red Square'],
      zh: ['世界上面积最大的国家', '套娃最有名', '莫斯科有红场'],
    },
  },
  {
    code: 'ie',
    name: { en: 'Ireland', zh: '爱尔兰' },
    hints: {
      en: ['Famous for leprechauns and shamrocks', "St. Patrick's Day comes from here", 'Lots of green hills and castles'],
      zh: ['小精灵和三叶草最有名', '圣帕特里克节来自这里', '有很多绿色山丘和城堡'],
    },
  },
  {
    code: 'pt',
    name: { en: 'Portugal', zh: '葡萄牙' },
    hints: {
      en: ['Famous for egg custard tarts', 'Lisbon is by the sea', 'Home of Cristiano Ronaldo'],
      zh: ['蛋挞最有名', '里斯本靠海', 'C罗的故乡'],
    },
  },
  {
    code: 'pl',
    name: { en: 'Poland', zh: '波兰' },
    hints: {
      en: ['Famous for pierogi dumplings', 'Chopin the pianist was born here', 'Capital is Warsaw'],
      zh: ['波兰饺子最有名', '钢琴家肖邦在这里出生', '首都是华沙'],
    },
  },
  {
    code: 'dk',
    name: { en: 'Denmark', zh: '丹麦' },
    hints: {
      en: ['Home of LEGO bricks', 'Famous for Andersen fairy tales', 'Vikings came from here too'],
      zh: ['乐高积木的故乡', '安徒生童话最有名', '也是维京人的故乡'],
    },
  },
  {
    code: 'fi',
    name: { en: 'Finland', zh: '芬兰' },
    hints: {
      en: ['Home of Santa Claus in Lapland', 'Has lots of saunas', 'Angry Birds and Moomins come from here'],
      zh: ['圣诞老人住在这里', '有很多桑拿房', '愤怒的小鸟和姆明来自这里'],
    },
  },
  {
    code: 'be',
    name: { en: 'Belgium', zh: '比利时' },
    hints: {
      en: ['Famous for waffles and chocolate', 'Smurfs and Tintin come from here', 'Has yummy fries'],
      zh: ['华夫饼和巧克力最有名', '蓝精灵和丁丁来自这里', '有好吃的薯条'],
    },
  },
  {
    code: 'at',
    name: { en: 'Austria', zh: '奥地利' },
    hints: {
      en: ['Birthplace of Mozart', 'Famous for The Sound of Music', 'Has the snowy Alps'],
      zh: ['莫扎特的故乡', '音乐之声最有名', '有雪山阿尔卑斯'],
    },
  },
  {
    code: 'hu',
    name: { en: 'Hungary', zh: '匈牙利' },
    hints: {
      en: ['Famous for paprika and goulash', 'Budapest has thermal baths', "Rubik's Cube was invented here"],
      zh: ['辣椒粉和炖牛肉最有名', '布达佩斯有温泉浴', '魔方在这里发明'],
    },
  },
  {
    code: 'is',
    name: { en: 'Iceland', zh: '冰岛' },
    hints: {
      en: ['Has volcanoes and glaciers', 'Famous for Northern Lights', 'Only 400,000 people live here'],
      zh: ['有火山和冰川', '北极光最有名', '只有40万人住在这里'],
    },
  },
  {
    code: 'cz',
    name: { en: 'Czechia', zh: '捷克' },
    hints: {
      en: ['Prague has beautiful castles', 'Famous for puppets', 'Beer is a big tradition'],
      zh: ['布拉格有美丽的城堡', '木偶最有名', '啤酒是传统'],
    },
  },
  {
    code: 'ua',
    name: { en: 'Ukraine', zh: '乌克兰' },
    hints: {
      en: ['Famous for sunflowers', 'Painted Easter eggs called pysanky', 'Lots of golden wheat fields'],
      zh: ['向日葵最有名', '复活节彩蛋很有名', '有很多金色的麦田'],
    },
  },
  {
    code: 'cn',
    name: { en: 'China', zh: '中国' },
    hints: {
      en: ['Has the Great Wall', 'Pandas live here', 'Invented paper and noodles'],
      zh: ['有万里长城', '大熊猫住在这里', '发明了纸和面条'],
    },
  },
  {
    code: 'jp',
    name: { en: 'Japan', zh: '日本' },
    hints: {
      en: ['Famous for sushi and ramen', 'Has Mount Fuji', 'Cherry blossoms in spring'],
      zh: ['寿司和拉面最有名', '有富士山', '春天的樱花最美'],
    },
  },
  {
    code: 'kr',
    name: { en: 'South Korea', zh: '韩国' },
    hints: {
      en: ['Famous for K-pop and BTS', 'Kimchi is a popular dish', 'Home of Taekwondo'],
      zh: ['K-pop和BTS的故乡', '泡菜很受欢迎', '跆拳道的故乡'],
    },
  },
  {
    code: 'in',
    name: { en: 'India', zh: '印度' },
    hints: {
      en: ['Has the Taj Mahal', 'Famous for curry and naan', 'Elephants and tigers live here'],
      zh: ['有泰姬陵', '咖喱和印度烤饼最有名', '有大象和老虎'],
    },
  },
  {
    code: 'th',
    name: { en: 'Thailand', zh: '泰国' },
    hints: {
      en: ['Famous for pad thai noodles', 'Lots of elephants live here', 'Has beautiful temples'],
      zh: ['泰式炒河粉最有名', '有很多大象', '有美丽的寺庙'],
    },
  },
  {
    code: 'vn',
    name: { en: 'Vietnam', zh: '越南' },
    hints: {
      en: ['Famous for pho noodle soup', 'Has Ha Long Bay with limestone islands', 'Lots of rice fields'],
      zh: ['越南粉最有名', '有下龙湾和石灰岩岛', '有很多稻田'],
    },
  },
  {
    code: 'sg',
    name: { en: 'Singapore', zh: '新加坡' },
    hints: {
      en: ['A tiny island country', 'Has the Marina Bay Sands hotel', 'Famous for chili crab'],
      zh: ['一个很小的岛国', '有金沙酒店', '辣椒螃蟹最有名'],
    },
  },
  {
    code: 'ph',
    name: { en: 'Philippines', zh: '菲律宾' },
    hints: {
      en: ['Has over 7,000 islands', 'Famous for delicious mangoes', 'People speak English and Tagalog'],
      zh: ['有7000多个岛', '芒果最有名', '人们说英语和他加禄语'],
    },
  },
  {
    code: 'id',
    name: { en: 'Indonesia', zh: '印尼' },
    hints: {
      en: ['Has many islands, including Bali', 'Komodo dragons live here', 'Famous for nasi goreng'],
      zh: ['有很多岛，包括巴厘岛', '有科莫多巨蜥', '印尼炒饭最有名'],
    },
  },
  {
    code: 'my',
    name: { en: 'Malaysia', zh: '马来西亚' },
    hints: {
      en: ['Has the Petronas Twin Towers', 'Rainforests with orangutans', 'Famous for nasi lemak'],
      zh: ['有双子塔', '雨林里有红毛猩猩', '椰浆饭最有名'],
    },
  },
  {
    code: 'tr',
    name: { en: 'Turkey', zh: '土耳其' },
    hints: {
      en: ['Istanbul sits between Europe and Asia', 'Hot air balloons fly over Cappadocia', 'Famous for Turkish delight'],
      zh: ['伊斯坦布尔横跨欧亚', '卡帕多西亚有热气球', '土耳其软糖最有名'],
    },
  },
  {
    code: 'il',
    name: { en: 'Israel', zh: '以色列' },
    hints: {
      en: ['Has the Dead Sea where you can float', 'Famous for falafel and hummus', 'Has the ancient city of Jerusalem'],
      zh: ['在死海可以漂浮', '炸鹰嘴豆和鹰嘴豆泥最有名', '有古老的耶路撒冷'],
    },
  },
  {
    code: 'eg',
    name: { en: 'Egypt', zh: '埃及' },
    hints: {
      en: ['Home of the pyramids and Sphinx', 'Has the Nile, longest river', 'Ancient pharaohs ruled here'],
      zh: ['金字塔和狮身人面像的故乡', '有最长的尼罗河', '古代法老在这里统治'],
    },
  },
  {
    code: 'za',
    name: { en: 'South Africa', zh: '南非' },
    hints: {
      en: ['Lions and elephants live here', 'Has Table Mountain in Cape Town', 'Nelson Mandela was from here'],
      zh: ['有狮子和大象', '开普敦有桌山', '曼德拉来自这里'],
    },
  },
  {
    code: 'ng',
    name: { en: 'Nigeria', zh: '尼日利亚' },
    hints: {
      en: ['The most populous country in Africa', 'Famous for jollof rice', 'Nollywood movies come from here'],
      zh: ['非洲人口最多的国家', 'jollof饭最有名', '诺莱坞电影来自这里'],
    },
  },
  {
    code: 'ke',
    name: { en: 'Kenya', zh: '肯尼亚' },
    hints: {
      en: ['Famous for safaris with lions and zebras', 'Many world-class long-distance runners', 'Has Mount Kenya'],
      zh: ['可以看到狮子和斑马', '有很多世界级长跑运动员', '有肯尼亚山'],
    },
  },
  {
    code: 'ma',
    name: { en: 'Morocco', zh: '摩洛哥' },
    hints: {
      en: ['Famous for couscous and tagine', 'Camel rides in the Sahara', 'Colorful markets called souks'],
      zh: ['古斯米和塔吉锅最有名', '可以骑骆驼游撒哈拉', '有色彩斑斓的市场'],
    },
  },
  {
    code: 'au',
    name: { en: 'Australia', zh: '澳大利亚' },
    hints: {
      en: ['Kangaroos and koalas live here', 'Has the Great Barrier Reef', 'Sydney has a famous opera house'],
      zh: ['袋鼠和考拉的家', '有大堡礁', '悉尼有歌剧院'],
    },
  },
  {
    code: 'nz',
    name: { en: 'New Zealand', zh: '新西兰' },
    hints: {
      en: ['Where Lord of the Rings was filmed', 'Famous for kiwi birds and Maori culture', 'Has glaciers and lots of sheep'],
      zh: ['魔戒电影在这里拍摄', '有几维鸟和毛利文化', '有冰川和很多羊'],
    },
  },
  {
    code: 'ae',
    name: { en: 'United Arab Emirates', zh: '阿联酋' },
    hints: {
      en: ["Has the tallest building, Burj Khalifa", 'Dubai has indoor ski slopes', 'Camels live in the desert'],
      zh: ['有最高的哈利法塔', '迪拜有室内滑雪场', '沙漠里有骆驼'],
    },
  },
]);

/** Extra ~60 countries unlocked via "Include all countries" in Settings. */
export const EXTRA: Country[] = withAllPools([
  {
    code: 'sa',
    name: { en: 'Saudi Arabia', zh: '沙特阿拉伯' },
    hints: { en: ['Has the holy city of Mecca', 'Lots of desert and camels', 'Birthplace of Islam'], zh: ['有圣城麦加', '有很多沙漠和骆驼', '伊斯兰教的发源地'] },
  },
  {
    code: 'ir',
    name: { en: 'Iran', zh: '伊朗' },
    hints: { en: ['Famous for Persian carpets', 'Has ancient Persepolis ruins', 'Pistachios grow here'], zh: ['波斯地毯最有名', '有古代波斯波利斯遗迹', '盛产开心果'] },
  },
  {
    code: 'iq',
    name: { en: 'Iraq', zh: '伊拉克' },
    hints: { en: ['Home of ancient Babylon', 'Sits between two big rivers', 'Famous for date palms'], zh: ['有古代巴比伦城', '在两条大河之间', '椰枣树最有名'] },
  },
  {
    code: 'jo',
    name: { en: 'Jordan', zh: '约旦' },
    hints: { en: ['Has the rose-red city of Petra', 'Visit the Dead Sea here too', 'Famous for desert castles'], zh: ['有玫瑰红色的佩特拉古城', '也可以游死海', '沙漠城堡最有名'] },
  },
  {
    code: 'lb',
    name: { en: 'Lebanon', zh: '黎巴嫩' },
    hints: { en: ['Famous for cedar trees', 'Lebanese food is delicious', 'Has beaches and mountains'], zh: ['雪松树最有名', '黎巴嫩美食很好吃', '有海滩和山'] },
  },
  {
    code: 'qa',
    name: { en: 'Qatar', zh: '卡塔尔' },
    hints: { en: ['Hosted the World Cup', 'Doha has tall shiny buildings', 'Has falcon hunters'], zh: ['曾举办世界杯', '多哈有闪亮的高楼', '有猎鹰猎人'] },
  },
  {
    code: 'kw',
    name: { en: 'Kuwait', zh: '科威特' },
    hints: { en: ['A small desert country', 'Famous for the Kuwait Towers', 'Lots of oil here'], zh: ['一个小的沙漠国家', '科威特塔最有名', '石油很多'] },
  },
  {
    code: 'om',
    name: { en: 'Oman', zh: '阿曼' },
    hints: { en: ['Has frankincense trees', 'Famous for forts and castles', 'Camels and turtles live here'], zh: ['有乳香树', '城堡和堡垒最有名', '有骆驼和海龟'] },
  },
  {
    code: 'pk',
    name: { en: 'Pakistan', zh: '巴基斯坦' },
    hints: { en: ["Has K2, world's second-tallest mountain", 'Famous for biryani rice', 'Cricket is the favorite sport'], zh: ['有世界第二高峰K2', '印度香饭最有名', '板球是最爱'] },
  },
  {
    code: 'bd',
    name: { en: 'Bangladesh', zh: '孟加拉' },
    hints: { en: ['Bengal tigers live here', 'Famous for rivers and boats', 'Lots of rice and fish'], zh: ['有孟加拉虎', '有很多河流和小船', '盛产大米和鱼'] },
  },
  {
    code: 'lk',
    name: { en: 'Sri Lanka', zh: '斯里兰卡' },
    hints: { en: ['Famous for Ceylon tea', 'Elephants live here', 'An island shaped like a teardrop'], zh: ['锡兰红茶最有名', '有大象', '国家形状像一滴眼泪'] },
  },
  {
    code: 'np',
    name: { en: 'Nepal', zh: '尼泊尔' },
    hints: { en: ["Home to Mount Everest, world's tallest", 'Lots of mountain villages', 'Famous for momo dumplings'], zh: ['世界最高峰珠峰在这里', '有很多山村', 'momo饺子最有名'] },
  },
  {
    code: 'mm',
    name: { en: 'Myanmar', zh: '缅甸' },
    hints: { en: ['Thousands of golden pagodas', 'Famous for jade and rubies', 'Elephants and tigers live here'], zh: ['有上千座金色佛塔', '翡翠和红宝石最有名', '有大象和老虎'] },
  },
  {
    code: 'kh',
    name: { en: 'Cambodia', zh: '柬埔寨' },
    hints: { en: ['Has the ancient Angkor Wat temple', 'Famous for amok fish curry', 'Lots of rice fields'], zh: ['有古老的吴哥窟', 'amok鱼咖喱最有名', '有很多稻田'] },
  },
  {
    code: 'la',
    name: { en: 'Laos', zh: '老挝' },
    hints: { en: ['Lots of mountains and rivers', 'Famous for sticky rice', 'Tigers and elephants live here'], zh: ['有很多山和河', '糯米饭最有名', '有老虎和大象'] },
  },
  {
    code: 'mn',
    name: { en: 'Mongolia', zh: '蒙古' },
    hints: { en: ['Has the Gobi Desert', 'Famous for horse-riding nomads', 'Yurts are traditional homes'], zh: ['有戈壁沙漠', '骑马的游牧民最有名', '蒙古包是传统住房'] },
  },
  {
    code: 'kz',
    name: { en: 'Kazakhstan', zh: '哈萨克斯坦' },
    hints: { en: ['Largest landlocked country', 'Vast steppes for horse riding', 'Launches space rockets'], zh: ['最大的内陆国家', '有适合骑马的大草原', '可以发射太空火箭'] },
  },
  {
    code: 'uz',
    name: { en: 'Uzbekistan', zh: '乌兹别克斯坦' },
    hints: { en: ['Has ancient Silk Road cities', 'Famous for pilaf rice', 'Beautiful blue-domed mosques'], zh: ['有古老的丝绸之路城市', '抓饭最有名', '有蓝色圆顶清真寺'] },
  },
  {
    code: 'dz',
    name: { en: 'Algeria', zh: '阿尔及利亚' },
    hints: { en: ['Lots of Sahara Desert', 'Famous for couscous', "Africa's largest country"], zh: ['有很多撒哈拉沙漠', '古斯米最有名', '非洲面积最大'] },
  },
  {
    code: 'tn',
    name: { en: 'Tunisia', zh: '突尼斯' },
    hints: { en: ['Where Star Wars was filmed', 'Has Roman ruins', 'Famous for olives'], zh: ['星球大战在这里拍摄', '有罗马遗址', '橄榄最有名'] },
  },
  {
    code: 'ly',
    name: { en: 'Libya', zh: '利比亚' },
    hints: { en: ['Lots of desert', 'Ancient Roman cities here', 'Sand seas of the Sahara'], zh: ['有很多沙漠', '有古罗马城市', '撒哈拉沙海'] },
  },
  {
    code: 'sd',
    name: { en: 'Sudan', zh: '苏丹' },
    hints: { en: ['Has more pyramids than Egypt', 'The Nile flows through it', 'Lots of desert'], zh: ['金字塔比埃及还多', '尼罗河流经这里', '有很多沙漠'] },
  },
  {
    code: 'et',
    name: { en: 'Ethiopia', zh: '埃塞俄比亚' },
    hints: { en: ['Where coffee was first found', 'Famous for long-distance runners', 'Has rock-cut churches'], zh: ['咖啡的发源地', '长跑运动员最有名', '有岩石凿成的教堂'] },
  },
  {
    code: 'gh',
    name: { en: 'Ghana', zh: '加纳' },
    hints: { en: ['Famous for cocoa beans', 'Has the colorful Kente cloth', 'Very friendly people'], zh: ['可可豆最有名', '有彩色的肯特布', '人民很友善'] },
  },
  {
    code: 'tz',
    name: { en: 'Tanzania', zh: '坦桑尼亚' },
    hints: { en: ['Has Mount Kilimanjaro', 'Safaris with lions and elephants', 'Has Zanzibar Island'], zh: ['有乞力马扎罗山', '可以看狮子和大象', '有桑给巴尔岛'] },
  },
  {
    code: 'ug',
    name: { en: 'Uganda', zh: '乌干达' },
    hints: { en: ['Has rare mountain gorillas', 'Source of the Nile River', 'Sits on the equator'], zh: ['有山地大猩猩', '尼罗河的源头', '赤道经过这里'] },
  },
  {
    code: 'sn',
    name: { en: 'Senegal', zh: '塞内加尔' },
    hints: { en: ['Famous for music and drums', 'Has pink Lake Retba', 'Lots of peanuts grow here'], zh: ['音乐和鼓最有名', '有粉红色的雷特巴湖', '盛产花生'] },
  },
  {
    code: 'ci',
    name: { en: 'Ivory Coast', zh: '科特迪瓦' },
    hints: { en: ['Lots of cocoa for chocolate', 'Has rainforests and elephants', 'Football is very popular'], zh: ['盛产可可制作巧克力', '有雨林和大象', '足球很受欢迎'] },
  },
  {
    code: 'cm',
    name: { en: 'Cameroon', zh: '喀麦隆' },
    hints: { en: ['Called "Africa in miniature"', 'Has Mount Cameroon volcano', 'Lots of rainforest'], zh: ['号称微缩版的非洲', '有喀麦隆山火山', '有很多雨林'] },
  },
  {
    code: 'ao',
    name: { en: 'Angola', zh: '安哥拉' },
    hints: { en: ['Has lots of oil and diamonds', 'Capital is Luanda', 'Long Atlantic coastline'], zh: ['有很多石油和钻石', '首都是罗安达', '有很长的大西洋海岸线'] },
  },
  {
    code: 'zw',
    name: { en: 'Zimbabwe', zh: '津巴布韦' },
    hints: { en: ['Has Victoria Falls', 'Ancient Great Zimbabwe ruins', 'Elephants live here'], zh: ['有维多利亚瀑布', '有大津巴布韦遗址', '有大象'] },
  },
  {
    code: 'bw',
    name: { en: 'Botswana', zh: '博茨瓦纳' },
    hints: { en: ['Has the Okavango Delta', 'Lots of elephants and lions', 'Diamonds are mined here'], zh: ['有奥卡万戈三角洲', '有很多大象和狮子', '盛产钻石'] },
  },
  {
    code: 'cu',
    name: { en: 'Cuba', zh: '古巴' },
    hints: { en: ['Famous for cigars and music', 'Has classic old American cars', 'Salsa dancing started here'], zh: ['雪茄和音乐最有名', '有经典的老爷车', '萨尔萨舞来自这里'] },
  },
  {
    code: 'jm',
    name: { en: 'Jamaica', zh: '牙买加' },
    hints: { en: ['Birthplace of reggae music', 'Famous for Bob Marley', 'Has the fastest sprinters'], zh: ['雷鬼音乐的故乡', '鲍勃·马利最有名', '有世界最快的短跑运动员'] },
  },
  {
    code: 'do',
    name: { en: 'Dominican Republic', zh: '多米尼加' },
    hints: { en: ['Famous for baseball stars', 'Has beautiful beaches', 'Merengue dance comes from here'], zh: ['出了很多棒球明星', '有美丽的海滩', '梅伦格舞来自这里'] },
  },
  {
    code: 'ht',
    name: { en: 'Haiti', zh: '海地' },
    hints: { en: ['Shares an island with Dominican Republic', 'Famous for Creole cooking', 'Mountains and beaches'], zh: ['和多米尼加共一个岛', '克里奥尔菜最有名', '有山和海滩'] },
  },
  {
    code: 'cr',
    name: { en: 'Costa Rica', zh: '哥斯达黎加' },
    hints: { en: ['Rainforests with sloths and toucans', 'Has many volcanoes', "People say 'Pura Vida'"], zh: ['雨林里有树懒和巨嘴鸟', '有很多火山', "人们说'Pura Vida'"] },
  },
  {
    code: 'pa',
    name: { en: 'Panama', zh: '巴拿马' },
    hints: { en: ['Has the famous Panama Canal', 'Where two oceans meet', 'Famous for Panama hats'], zh: ['有巴拿马运河', '两大洋在这里相连', '巴拿马帽最有名'] },
  },
  {
    code: 'gt',
    name: { en: 'Guatemala', zh: '危地马拉' },
    hints: { en: ['Has Mayan pyramids', 'Famous for colorful weaving', 'Lots of volcanoes'], zh: ['有玛雅金字塔', '彩色编织最有名', '有很多火山'] },
  },
  {
    code: 'hn',
    name: { en: 'Honduras', zh: '洪都拉斯' },
    hints: { en: ['Has Mayan ruins of Copán', 'Lots of bananas grow here', 'Beautiful Caribbean beaches'], zh: ['有科潘玛雅遗址', '盛产香蕉', '有美丽的加勒比海滩'] },
  },
  {
    code: 'sv',
    name: { en: 'El Salvador', zh: '萨尔瓦多' },
    hints: { en: ['Smallest country in Central America', 'Has lots of volcanoes', 'Famous for pupusas'], zh: ['中美洲最小的国家', '有很多火山', 'pupusa玉米饼最有名'] },
  },
  {
    code: 'ec',
    name: { en: 'Ecuador', zh: '厄瓜多尔' },
    hints: { en: ['Has the Galápagos Islands', 'Sits right on the equator', "Panama hats actually come from here"], zh: ['有加拉帕戈斯群岛', '正好在赤道上', '巴拿马草帽其实来自这里'] },
  },
  {
    code: 'bo',
    name: { en: 'Bolivia', zh: '玻利维亚' },
    hints: { en: ['Has a huge salt flat: Salar de Uyuni', 'Llamas and alpacas live here', 'La Paz is very high up'], zh: ['有巨大的乌尤尼盐沼', '有羊驼和驼羊', '拉巴斯海拔很高'] },
  },
  {
    code: 'py',
    name: { en: 'Paraguay', zh: '巴拉圭' },
    hints: { en: ['Famous for yerba mate tea', 'Has waterfalls on its border', 'Two languages: Spanish & Guaraní'], zh: ['巴拉圭茶最有名', '边境有瀑布', '讲西班牙语和瓜拉尼语'] },
  },
  {
    code: 'uy',
    name: { en: 'Uruguay', zh: '乌拉圭' },
    hints: { en: ['Famous for grilled meat', 'Has beautiful beaches', 'Football is very popular'], zh: ['烤肉最有名', '有美丽的海滩', '足球很受欢迎'] },
  },
  {
    code: 've',
    name: { en: 'Venezuela', zh: '委内瑞拉' },
    hints: { en: ["Has Angel Falls, world's tallest waterfall", 'Famous for arepas', 'Beautiful Caribbean coast'], zh: ['有世界最高瀑布天使瀑布', '玉米饼arepa最有名', '有美丽的加勒比海岸'] },
  },
  {
    code: 'ro',
    name: { en: 'Romania', zh: '罗马尼亚' },
    hints: { en: ["Home of Dracula's castle", 'Has the Carpathian Mountains', 'Bears live in the forests'], zh: ['德古拉城堡的故乡', '有喀尔巴阡山脉', '森林里有熊'] },
  },
  {
    code: 'bg',
    name: { en: 'Bulgaria', zh: '保加利亚' },
    hints: { en: ['Famous for rose oil', 'Yogurt was invented here', 'Lots of old Roman ruins'], zh: ['玫瑰精油最有名', '酸奶在这里发明', '到处有罗马遗址'] },
  },
  {
    code: 'sk',
    name: { en: 'Slovakia', zh: '斯洛伐克' },
    hints: { en: ['Lots of castles', 'Has the High Tatra Mountains', 'Famous for bryndzové halušky'], zh: ['有很多城堡', '有高塔特拉山', '羊奶酪面疙瘩最有名'] },
  },
  {
    code: 'si',
    name: { en: 'Slovenia', zh: '斯洛文尼亚' },
    hints: { en: ['Has the beautiful Lake Bled', 'Bees are very important here', 'Lots of caves and mountains'], zh: ['有美丽的布莱德湖', '蜜蜂很重要', '有很多洞穴和山'] },
  },
  {
    code: 'hr',
    name: { en: 'Croatia', zh: '克罗地亚' },
    hints: { en: ['Has over 1,000 islands', 'Where Game of Thrones was filmed', 'Beautiful Adriatic coast'], zh: ['有1000多个岛', '权游在这里拍摄', '亚得里亚海岸很美'] },
  },
  {
    code: 'rs',
    name: { en: 'Serbia', zh: '塞尔维亚' },
    hints: { en: ['The Danube River flows through', 'Birthplace of Nikola Tesla', 'Lots of monasteries'], zh: ['多瑙河流经这里', '特斯拉的故乡', '有很多修道院'] },
  },
  {
    code: 'al',
    name: { en: 'Albania', zh: '阿尔巴尼亚' },
    hints: { en: ['Has lots of bunkers', 'Beautiful Adriatic beaches', 'Mother Teresa was from here'], zh: ['有很多碉堡', '亚得里亚海滩很美', '特蕾莎修女的故乡'] },
  },
  {
    code: 'ee',
    name: { en: 'Estonia', zh: '爱沙尼亚' },
    hints: { en: ['Home of Skype', 'Very advanced in digital tech', 'Lots of medieval old towns'], zh: ['Skype的故乡', '数字科技很发达', '有很多中世纪老城'] },
  },
  {
    code: 'lv',
    name: { en: 'Latvia', zh: '拉脱维亚' },
    hints: { en: ['Beautiful Art Nouveau buildings', 'Lots of forests', 'Famous for chocolate'], zh: ['有美丽的新艺术建筑', '有很多森林', '巧克力最有名'] },
  },
  {
    code: 'lt',
    name: { en: 'Lithuania', zh: '立陶宛' },
    hints: { en: ['Famous for amber', 'Has the Hill of Crosses', 'Lots of lakes and forests'], zh: ['琥珀最有名', '有十字架山', '有很多湖和森林'] },
  },
  {
    code: 'lu',
    name: { en: 'Luxembourg', zh: '卢森堡' },
    hints: { en: ['One of the smallest countries', 'Lots of beautiful castles', 'People speak three languages'], zh: ['最小的国家之一', '有很多美丽的城堡', '人们讲三种语言'] },
  },
  {
    code: 'mt',
    name: { en: 'Malta', zh: '马耳他' },
    hints: { en: ['A tiny island country', 'Has ancient stone temples', 'Famous for honey and lace'], zh: ['一个小小的岛国', '有古代石头神庙', '蜂蜜和蕾丝最有名'] },
  },
  {
    code: 'by',
    name: { en: 'Belarus', zh: '白俄罗斯' },
    hints: { en: ['Has European bison', 'Lots of forests and lakes', 'Capital is Minsk'], zh: ['有欧洲野牛', '有很多森林和湖泊', '首都是明斯克'] },
  },
]);

export const COUNTRIES: Country[] = [...CURATED, ...EXTRA];

export function getActivePool(expanded: boolean): Country[] {
  return expanded ? COUNTRIES : CURATED;
}

export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}

export function nameOf(c: Country, lang: Lang): string {
  return c.name[lang];
}

export function hintsOf(c: Country, lang: Lang): string[] {
  return c.hints[lang];
}
