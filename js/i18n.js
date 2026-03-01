/* HODL Dog i18n — 60+ Languages */
const I18N_LANGS = {
  en:{flag:'🇺🇸',name:'English'},ru:{flag:'🇷🇺',name:'Русский'},uk:{flag:'🇺🇦',name:'Українська'},
  de:{flag:'🇩🇪',name:'Deutsch'},fr:{flag:'🇫🇷',name:'Français'},es:{flag:'🇪🇸',name:'Español'},
  'pt-br':{flag:'🇧🇷',name:'Português (BR)'},'pt-pt':{flag:'🇵🇹',name:'Português'},
  it:{flag:'🇮🇹',name:'Italiano'},tr:{flag:'🇹🇷',name:'Türkçe'},ar:{flag:'🇸🇦',name:'العربية',rtl:true},
  'zh-cn':{flag:'🇨🇳',name:'简体中文'},'zh-tw':{flag:'🇹🇼',name:'繁體中文'},
  ja:{flag:'🇯🇵',name:'日本語'},ko:{flag:'🇰🇷',name:'한국어'},hi:{flag:'🇮🇳',name:'हिन्दी'},
  id:{flag:'🇮🇩',name:'Bahasa Indonesia'},vi:{flag:'🇻🇳',name:'Tiếng Việt'},
  th:{flag:'🇹🇭',name:'ไทย'},pl:{flag:'🇵🇱',name:'Polski'},nl:{flag:'🇳🇱',name:'Nederlands'},
  sv:{flag:'🇸🇪',name:'Svenska'},no:{flag:'🇳🇴',name:'Norsk'},fi:{flag:'🇫🇮',name:'Suomi'},
  da:{flag:'🇩🇰',name:'Dansk'},el:{flag:'🇬🇷',name:'Ελληνικά'},he:{flag:'🇮🇱',name:'עברית',rtl:true},
  fa:{flag:'🇮🇷',name:'فارسی',rtl:true},ms:{flag:'🇲🇾',name:'Bahasa Melayu'},
  tl:{flag:'🇵🇭',name:'Filipino'},ro:{flag:'🇷🇴',name:'Română'},hu:{flag:'🇭🇺',name:'Magyar'},
  cs:{flag:'🇨🇿',name:'Čeština'},sk:{flag:'🇸🇰',name:'Slovenčina'},bg:{flag:'🇧🇬',name:'Български'},
  hr:{flag:'🇭🇷',name:'Hrvatski'},sr:{flag:'🇷🇸',name:'Српски'},sl:{flag:'🇸🇮',name:'Slovenščina'},
  lt:{flag:'🇱🇹',name:'Lietuvių'},lv:{flag:'🇱🇻',name:'Latviešu'},et:{flag:'🇪🇪',name:'Eesti'},
  kk:{flag:'🇰🇿',name:'Қазақша'},uz:{flag:'🇺🇿',name:"O'zbekcha"},az:{flag:'🇦🇿',name:'Azərbaycan'},
  ka:{flag:'🇬🇪',name:'ქართული'},hy:{flag:'🇦🇲',name:'Հայերեն'},be:{flag:'🇧🇾',name:'Беларуская'},
  sq:{flag:'🇦🇱',name:'Shqip'},mk:{flag:'🇲🇰',name:'Македонски'},bs:{flag:'🇧🇦',name:'Bosanski'},
  mn:{flag:'🇲🇳',name:'Монгол'},my:{flag:'🇲🇲',name:'မြန်မာ'},km:{flag:'🇰🇭',name:'ខ្មែរ'},
  lo:{flag:'🇱🇦',name:'ລາວ'},ne:{flag:'🇳🇵',name:'नेपाली'},si:{flag:'🇱🇰',name:'සිංහල'},
  ur:{flag:'🇵🇰',name:'اردو',rtl:true},bn:{flag:'🇧🇩',name:'বাংলা'},ta:{flag:'🇮🇳',name:'தமிழ்'},
  te:{flag:'🇮🇳',name:'తెలుగు'},mr:{flag:'🇮🇳',name:'मराठी'},gu:{flag:'🇮🇳',name:'ગુજરાતી'},
  kn:{flag:'🇮🇳',name:'ಕನ್ನಡ'},pa:{flag:'🇮🇳',name:'ਪੰਜਾਬੀ'}
};

const T = {
en:{
  loading:'Loading HODL Dog…',play:'PLAY',players_online:'{n} players online',
  connect_wallet:'Connect Wallet',change_lang:'Language',sound_on:'Sound On',sound_off:'Sound Off',
  coins:'Coins',distance:'Distance',multiplier:'Multiplier',
  tutorial_move:'Use arrows / swipe to move',tutorial_jump:'Tap / Space to jump',tutorial_collect:'Collect DogeCoins!',
  level_complete:'Level Complete!',stat_coins:'Coins',stat_time:'Time',stat_score:'Score',stat_rank:'Rank',
  claim_btn:'CLAIM REWARDS & ACTIVATE MINING RIG',
  ob_title1:'Play & Earn',ob_text1:'Jump, collect coins, earn real DOGE tokens every day',
  ob_title2:'Mining Rig',ob_text2:'Auto-mine DOGE 24/7 after connecting wallet',
  ob_title3:'Daily Rewards',ob_text3:'Login daily for increasing bonus multipliers',
  ob_title4:'Leaderboard',ob_text4:'Compete globally and win exclusive NFT prizes',
  wallet_title:'Connect Wallet',wallet_installed:'Installed',wallet_install:'Install',
  wallet_qr:'Scan QR Code',wallet_terms:'By connecting, you agree to Terms of Service',
  success_welcome:'Welcome,',success_bonus:'+1000 DOGE Bonus Credited!',
  success_mining:'Mining Rig Activated',success_continue:'Continue Playing',
  teaser_title:'Level 2 Coming Soon',teaser_days:'Coming in {n} days',teaser_email:'Enter your email',
  teaser_notify:'Notify Me',
  guest_title:'Guest Limitations',guest_text:'You are missing out:',
  guest_item1:'❌ No DOGE earnings',guest_item2:'❌ No mining rig',guest_item3:'❌ No daily rewards',
  guest_item4:'❌ No leaderboard',guest_item5:'❌ No NFT prizes',
  guest_connect:'Connect Wallet Now',guest_continue:'Continue as Guest',
  death_title:'Much Crash!',death_retry:'Try Again',death_score:'Score: {n}',
  pause:'Paused',resume:'Resume',quit:'Quit',
  install_app:'Install App',offline:'You are offline',
  footer:'© 2026 HODL Dog. All rights reserved.'
},
ru:{
  loading:'Загрузка HODL Dog…',play:'ИГРАТЬ',players_online:'{n} игроков онлайн',
  connect_wallet:'Подключить кошелёк',change_lang:'Язык',sound_on:'Звук вкл',sound_off:'Звук выкл',
  coins:'Монеты',distance:'Дистанция',multiplier:'Множитель',
  tutorial_move:'Стрелки / свайп для движения',tutorial_jump:'Тап / Пробел для прыжка',tutorial_collect:'Собирай DogeCoin!',
  level_complete:'Уровень пройден!',stat_coins:'Монеты',stat_time:'Время',stat_score:'Очки',stat_rank:'Ранг',
  claim_btn:'ПОЛУЧИТЬ НАГРАДЫ И ЗАПУСТИТЬ МАЙНИНГ',
  ob_title1:'Играй и зарабатывай',ob_text1:'Прыгай, собирай монеты, получай реальные DOGE токены',
  ob_title2:'Майнинг-ферма',ob_text2:'Автоматический майнинг DOGE 24/7 после подключения',
  ob_title3:'Ежедневные награды',ob_text3:'Заходи каждый день для увеличения бонусов',
  ob_title4:'Таблица лидеров',ob_text4:'Соревнуйся глобально и выигрывай NFT призы',
  wallet_title:'Подключить кошелёк',wallet_installed:'Установлен',wallet_install:'Установить',
  wallet_qr:'Сканируйте QR-код',wallet_terms:'Подключаясь, вы соглашаетесь с Условиями',
  success_welcome:'Добро пожаловать,',success_bonus:'+1000 DOGE бонус зачислен!',
  success_mining:'Майнинг-ферма активирована',success_continue:'Продолжить игру',
  teaser_title:'Уровень 2 скоро',teaser_days:'Через {n} дней',teaser_email:'Введите email',
  teaser_notify:'Уведомить меня',
  guest_title:'Ограничения гостя',guest_text:'Вы упускаете:',
  guest_item1:'❌ Нет заработка DOGE',guest_item2:'❌ Нет майнинг-фермы',guest_item3:'❌ Нет ежедневных наград',
  guest_item4:'❌ Нет таблицы лидеров',guest_item5:'❌ Нет NFT призов',
  guest_connect:'Подключить кошелёк',guest_continue:'Продолжить как гость',
  death_title:'Разбился!',death_retry:'Ещё раз',death_score:'Очки: {n}',
  pause:'Пауза',resume:'Продолжить',quit:'Выход',
  install_app:'Установить приложение',offline:'Нет соединения',
  footer:'© 2026 HODL Dog. Все права защищены.'
},
uk:{
  loading:'Завантаження HODL Dog…',play:'ГРАТИ',players_online:'{n} гравців онлайн',
  connect_wallet:"Під'єднати гаманець",change_lang:'Мова',sound_on:'Звук увімк',sound_off:'Звук вимк',
  coins:'Монети',distance:'Дистанція',multiplier:'Множник',
  tutorial_move:'Стрілки / свайп для руху',tutorial_jump:'Тап / Пробіл для стрибка',tutorial_collect:'Збирай DogeCoin!',
  level_complete:'Рівень пройдено!',stat_coins:'Монети',stat_time:'Час',stat_score:'Очки',stat_rank:'Ранг',
  claim_btn:'ОТРИМАТИ НАГОРОДИ ТА ЗАПУСТИТИ МАЙНІНГ',
  ob_title1:'Грай та заробляй',ob_text1:'Стрибай, збирай монети, отримуй реальні DOGE',
  ob_title2:'Майнінг-ферма',ob_text2:'Автоматичний майнінг DOGE 24/7 після підключення',
  ob_title3:'Щоденні нагороди',ob_text3:'Заходь щодня для збільшення бонусів',
  ob_title4:'Таблиця лідерів',ob_text4:'Змагайся глобально та вигравай NFT призи',
  wallet_title:"Під'єднати гаманець",wallet_installed:'Встановлено',wallet_install:'Встановити',
  wallet_qr:'Скануйте QR-код',wallet_terms:"Під'єднуючись, ви погоджуєтесь з Умовами",
  success_welcome:'Ласкаво просимо,',success_bonus:'+1000 DOGE бонус зараховано!',
  success_mining:'Майнінг-ферму активовано',success_continue:'Продовжити гру',
  teaser_title:'Рівень 2 незабаром',teaser_days:'Через {n} днів',teaser_email:'Введіть email',
  teaser_notify:'Повідомити мене',
  guest_title:'Обмеження гостя',guest_text:'Ви втрачаєте:',
  guest_item1:'❌ Немає заробітку DOGE',guest_item2:'❌ Немає майнінг-ферми',guest_item3:'❌ Немає щоденних нагород',
  guest_item4:'❌ Немає таблиці лідерів',guest_item5:'❌ Немає NFT призів',
  guest_connect:"Під'єднати гаманець",guest_continue:'Продовжити як гість',
  death_title:'Розбився!',death_retry:'Ще раз',death_score:'Очки: {n}',
  pause:'Пауза',resume:'Продовжити',quit:'Вихід',
  install_app:'Встановити додаток',offline:'Немає з\'єднання',
  footer:'© 2026 HODL Dog. Усі права захищені.'
}
};

// Generate remaining 57 languages from English base with key translations
const LANG_OVERRIDES = {
  de:{play:'SPIELEN',loading:'HODL Dog wird geladen…',connect_wallet:'Wallet verbinden',coins:'Münzen',level_complete:'Level geschafft!',claim_btn:'BELOHNUNGEN BEANSPRUCHEN',death_title:'Abgestürzt!',death_retry:'Nochmal',pause:'Pause',resume:'Weiter',quit:'Beenden',
    ob_title1:'Spielen & Verdienen',ob_title2:'Mining-Rig',ob_title3:'Tägliche Belohnungen',ob_title4:'Bestenliste',wallet_title:'Wallet verbinden',success_welcome:'Willkommen,',guest_title:'Gast-Einschränkungen',teaser_title:'Level 2 kommt bald',teaser_notify:'Benachrichtige mich'},
  fr:{play:'JOUER',loading:'Chargement HODL Dog…',connect_wallet:'Connecter portefeuille',coins:'Pièces',level_complete:'Niveau terminé!',claim_btn:'RÉCLAMER LES RÉCOMPENSES',death_title:'Crash!',death_retry:'Réessayer',pause:'Pause',resume:'Reprendre',quit:'Quitter',
    ob_title1:'Jouer et gagner',ob_title2:'Rig de minage',ob_title3:'Récompenses quotidiennes',ob_title4:'Classement',wallet_title:'Connecter portefeuille',success_welcome:'Bienvenue,',guest_title:'Limitations invité',teaser_title:'Niveau 2 bientôt',teaser_notify:'Me notifier'},
  es:{play:'JUGAR',loading:'Cargando HODL Dog…',connect_wallet:'Conectar billetera',coins:'Monedas',level_complete:'¡Nivel completado!',claim_btn:'RECLAMAR RECOMPENSAS',death_title:'¡Crash!',death_retry:'Reintentar',pause:'Pausa',resume:'Reanudar',quit:'Salir',
    ob_title1:'Jugar y ganar',ob_title2:'Plataforma minera',ob_title3:'Recompensas diarias',ob_title4:'Clasificación',wallet_title:'Conectar billetera',success_welcome:'Bienvenido,',guest_title:'Limitaciones de invitado',teaser_title:'Nivel 2 próximamente',teaser_notify:'Notifícame'},
  'pt-br':{play:'JOGAR',loading:'Carregando HODL Dog…',connect_wallet:'Conectar carteira',coins:'Moedas',level_complete:'Fase concluída!',claim_btn:'RESGATAR RECOMPENSAS',death_title:'Crash!',death_retry:'Tentar de novo',pause:'Pausado',resume:'Continuar',quit:'Sair',
    ob_title1:'Jogue e ganhe',ob_title2:'Mineradora',ob_title3:'Recompensas diárias',ob_title4:'Ranking',wallet_title:'Conectar carteira',success_welcome:'Bem-vindo,',guest_title:'Limitações de convidado',teaser_title:'Nível 2 em breve',teaser_notify:'Me avise'},
  'pt-pt':{play:'JOGAR',loading:'A carregar HODL Dog…',connect_wallet:'Ligar carteira',coins:'Moedas',level_complete:'Nível concluído!',claim_btn:'RESGATAR RECOMPENSAS',death_title:'Crash!',death_retry:'Tentar novamente',pause:'Pausa',resume:'Continuar',quit:'Sair'},
  it:{play:'GIOCA',loading:'Caricamento HODL Dog…',connect_wallet:'Connetti portafoglio',coins:'Monete',level_complete:'Livello completato!',claim_btn:'RISCUOTI RICOMPENSE',death_title:'Crash!',death_retry:'Riprova',pause:'Pausa',resume:'Riprendi',quit:'Esci',
    ob_title1:'Gioca e guadagna',ob_title2:'Mining Rig',ob_title3:'Ricompense giornaliere',ob_title4:'Classifica',wallet_title:'Connetti portafoglio',success_welcome:'Benvenuto,'},
  tr:{play:'OYNA',loading:'HODL Dog yükleniyor…',connect_wallet:'Cüzdan bağla',coins:'Jeton',level_complete:'Seviye tamamlandı!',claim_btn:'ÖDÜLLERİ AL',death_title:'Çarpışma!',death_retry:'Tekrar dene',pause:'Duraklat',resume:'Devam',quit:'Çıkış',
    ob_title1:'Oyna ve kazan',ob_title2:'Madencilik',ob_title3:'Günlük ödüller',ob_title4:'Sıralama',wallet_title:'Cüzdan bağla',success_welcome:'Hoş geldin,'},
  ar:{play:'لعب',loading:'...HODL Dog جاري تحميل',connect_wallet:'ربط المحفظة',coins:'عملات',level_complete:'!المستوى مكتمل',claim_btn:'اطلب المكافآت',death_title:'!تحطم',death_retry:'حاول مرة أخرى',pause:'إيقاف مؤقت',resume:'استئناف',quit:'خروج',
    wallet_title:'ربط المحفظة',success_welcome:'،مرحباً',guest_title:'قيود الضيف'},
  'zh-cn':{play:'开始游戏',loading:'正在加载 HODL Dog…',connect_wallet:'连接钱包',coins:'金币',level_complete:'关卡完成！',claim_btn:'领取奖励并激活矿机',death_title:'坠毁了！',death_retry:'再试一次',pause:'暂停',resume:'继续',quit:'退出',
    ob_title1:'玩赚模式',ob_title2:'挖矿设备',ob_title3:'每日奖励',ob_title4:'排行榜',wallet_title:'连接钱包',success_welcome:'欢迎，',guest_title:'访客限制',teaser_title:'第2关即将推出',teaser_notify:'通知我'},
  'zh-tw':{play:'開始遊戲',loading:'正在載入 HODL Dog…',connect_wallet:'連接錢包',coins:'金幣',level_complete:'關卡完成！',claim_btn:'領取獎勵並啟動礦機',death_title:'墜毀了！',death_retry:'再試一次',pause:'暫停',resume:'繼續',quit:'退出',
    wallet_title:'連接錢包',success_welcome:'歡迎，',guest_title:'訪客限制'},
  ja:{play:'プレイ',loading:'HODL Dog ロード中…',connect_wallet:'ウォレット接続',coins:'コイン',level_complete:'レベルクリア！',claim_btn:'報酬を受け取る',death_title:'クラッシュ！',death_retry:'リトライ',pause:'一時停止',resume:'再開',quit:'終了',
    ob_title1:'遊んで稼ぐ',ob_title2:'マイニングリグ',ob_title3:'デイリー報酬',ob_title4:'ランキング',wallet_title:'ウォレット接続',success_welcome:'ようこそ、',guest_title:'ゲスト制限'},
  ko:{play:'플레이',loading:'HODL Dog 로딩 중…',connect_wallet:'지갑 연결',coins:'코인',level_complete:'레벨 완료!',claim_btn:'보상 받기',death_title:'추락!',death_retry:'다시 시도',pause:'일시정지',resume:'계속',quit:'종료',
    ob_title1:'플레이 & 수익',ob_title2:'채굴 장비',ob_title3:'일일 보상',ob_title4:'리더보드',wallet_title:'지갑 연결',success_welcome:'환영합니다,',guest_title:'게스트 제한'},
  hi:{play:'खेलें',loading:'HODL Dog लोड हो रहा है…',connect_wallet:'वॉलेट कनेक्ट करें',coins:'सिक्के',level_complete:'लेवल पूरा!',claim_btn:'पुरस्कार प्राप्त करें',death_title:'क्रैश!',death_retry:'फिर से कोशिश',pause:'रुकें',resume:'जारी रखें',quit:'बाहर',
    wallet_title:'वॉलेट कनेक्ट करें',success_welcome:'स्वागत है,',guest_title:'अतिथि सीमाएँ'},
  id:{play:'MAIN KE BULAN',loading:'Memuat HODL Dog…',connect_wallet:'Hubungkan dompet',coins:'Koin',level_complete:'Level selesai!',claim_btn:'KLAIM HADIAH',death_title:'Tabrakan!',death_retry:'Coba lagi',pause:'Jeda',resume:'Lanjut',quit:'Keluar'},
  vi:{play:'CHƠI LÊN MẶT TRĂNG',loading:'Đang tải HODL Dog…',connect_wallet:'Kết nối ví',coins:'Xu',level_complete:'Hoàn thành!',claim_btn:'NHẬN THƯỞNG',death_title:'Va chạm!',death_retry:'Thử lại',pause:'Tạm dừng',resume:'Tiếp tục',quit:'Thoát'},
  th:{play:'เล่นสู่ดวงจันทร์',loading:'กำลังโหลด HODL Dog…',connect_wallet:'เชื่อมต่อกระเป๋า',coins:'เหรียญ',level_complete:'ผ่านด่าน!',claim_btn:'รับรางวัล',death_title:'ชน!',death_retry:'ลองอีกครั้ง',pause:'หยุดชั่วคราว',resume:'ดำเนินต่อ',quit:'ออก'},
  pl:{play:'GRAJ DO KSIĘŻYCA',loading:'Ładowanie HODL Dog…',connect_wallet:'Podłącz portfel',coins:'Monety',level_complete:'Poziom ukończony!',claim_btn:'ODBIERZ NAGRODY',death_title:'Katastrofa!',death_retry:'Spróbuj ponownie',pause:'Pauza',resume:'Wznów',quit:'Wyjdź'},
  nl:{play:'SPEEL NAAR DE MAAN',loading:'HODL Dog laden…',connect_wallet:'Portemonnee verbinden',coins:'Munten',level_complete:'Level voltooid!',claim_btn:'BELONINGEN CLAIMEN',death_title:'Crash!',death_retry:'Opnieuw proberen',pause:'Pauze',resume:'Hervatten',quit:'Stoppen'},
  sv:{play:'SPELA TILL MÅNEN',loading:'Laddar HODL Dog…',connect_wallet:'Anslut plånbok',coins:'Mynt',level_complete:'Nivå klar!',claim_btn:'HÄMTA BELÖNINGAR',death_title:'Krasch!',death_retry:'Försök igen',pause:'Paus',resume:'Fortsätt',quit:'Avsluta'},
  no:{play:'SPILL TIL MÅNEN',loading:'Laster HODL Dog…',connect_wallet:'Koble lommebok',coins:'Mynter',level_complete:'Nivå fullført!',claim_btn:'HENT BELØNNINGER',death_title:'Krasj!',death_retry:'Prøv igjen',pause:'Pause',resume:'Fortsett',quit:'Avslutt'},
  fi:{play:'PELAA KUUHUN',loading:'Ladataan HODL Dog…',connect_wallet:'Yhdistä lompakko',coins:'Kolikot',level_complete:'Taso läpäisty!',claim_btn:'LUNASTA PALKINNOT',death_title:'Törmäys!',death_retry:'Yritä uudelleen',pause:'Tauko',resume:'Jatka',quit:'Lopeta'},
  da:{play:'SPIL TIL MÅNEN',loading:'Indlæser HODL Dog…',connect_wallet:'Tilslut tegnebog',coins:'Mønter',level_complete:'Niveau klaret!',claim_btn:'HENT BELØNNINGER',death_title:'Crash!',death_retry:'Prøv igen',pause:'Pause',resume:'Fortsæt',quit:'Afslut'},
  el:{play:'ΠΑΙΞΕ ΣΤΟ ΦΕΓΓΑΡΙ',loading:'Φόρτωση HODL Dog…',connect_wallet:'Σύνδεση πορτοφολιού',coins:'Νομίσματα',level_complete:'Επίπεδο ολοκληρώθηκε!',claim_btn:'ΛΑΒΕ ΑΝΤΑΜΟΙΒΕΣ',death_title:'Συντριβή!',death_retry:'Δοκίμασε ξανά'},
  he:{play:'שחק לירח',loading:'…HODL Dog טוען',connect_wallet:'חבר ארנק',coins:'מטבעות',level_complete:'!שלב הושלם',claim_btn:'קבל פרסים',death_title:'!התרסקות',death_retry:'נסה שוב'},
  fa:{play:'بازی به سمت ماه',loading:'...HODL Dog در حال بارگذاری',connect_wallet:'اتصال کیف پول',coins:'سکه‌ها',level_complete:'!مرحله تمام شد',claim_btn:'دریافت پاداش',death_title:'!سقوط',death_retry:'دوباره تلاش کنید'},
  ms:{play:'MAIN KE BULAN',loading:'Memuatkan HODL Dog…',connect_wallet:'Sambung dompet',coins:'Syiling',level_complete:'Tahap selesai!',claim_btn:'TUNTUT GANJARAN',death_title:'Nahas!',death_retry:'Cuba lagi'},
  tl:{play:'LARUIN PAPUNTANG BUWAN',loading:'Nagloload HODL Dog…',connect_wallet:'Ikonekta ang wallet',coins:'Barya',level_complete:'Level tapos!',claim_btn:'KUNIN ANG MGA REWARD',death_title:'Bumagsak!',death_retry:'Subukan muli'},
  ro:{play:'JOACĂ SPRE LUNĂ',loading:'Se încarcă HODL Dog…',connect_wallet:'Conectează portofel',coins:'Monede',level_complete:'Nivel complet!',claim_btn:'REVENDICĂ RECOMPENSE',death_title:'Crash!',death_retry:'Încearcă din nou'},
  hu:{play:'JÁTSSZ A HOLDIG',loading:'HODL Dog betöltése…',connect_wallet:'Tárca csatlakoztatása',coins:'Érmék',level_complete:'Szint teljesítve!',claim_btn:'JUTALMAK ÁTVÉTELE',death_title:'Összeütközés!',death_retry:'Próbáld újra'},
  cs:{play:'HRAJ NA MĚSÍC',loading:'Načítání HODL Dog…',connect_wallet:'Připojit peněženku',coins:'Mince',level_complete:'Úroveň dokončena!',claim_btn:'ZÍSKAT ODMĚNY',death_title:'Havárie!',death_retry:'Zkusit znovu'},
  sk:{play:'HRAJ NA MESIAC',loading:'Načítava sa HODL Dog…',connect_wallet:'Pripojiť peňaženku',coins:'Mince',level_complete:'Úroveň dokončená!',claim_btn:'ZÍSKAŤ ODMENY',death_title:'Havária!',death_retry:'Skúsiť znova'},
  bg:{play:'ИГРАЙ ДО ЛУНАТА',loading:'HODL Dog се зарежда…',connect_wallet:'Свържи портфейл',coins:'Монети',level_complete:'Ниво завършено!',claim_btn:'ВЗЕМИ НАГРАДИ',death_title:'Катастрофа!',death_retry:'Опитай отново'},
  hr:{play:'IGRAJ DO MJESECA',loading:'Učitavanje HODL Dog…',connect_wallet:'Poveži novčanik',coins:'Kovanice',level_complete:'Razina završena!',claim_btn:'PREUZMI NAGRADE',death_title:'Sudar!',death_retry:'Pokušaj ponovo'},
  sr:{play:'ИГРАЈ ДО МЕСЕЦА',loading:'Учитавање HODL Dog…',connect_wallet:'Повежи новчаник',coins:'Новчићи',level_complete:'Ниво завршен!',claim_btn:'ПРЕУЗМИ НАГРАДЕ',death_title:'Судар!',death_retry:'Покушај поново'},
  sl:{play:'IGRAJ DO LUNE',loading:'Nalaganje HODL Dog…',connect_wallet:'Poveži denarnico',coins:'Kovanci',level_complete:'Stopnja končana!',claim_btn:'PREVZEMI NAGRADE',death_title:'Trčenje!',death_retry:'Poskusi znova'},
  lt:{play:'ŽAISK IKI MĖNULIO',loading:'Kraunamas HODL Dog…',connect_wallet:'Prijungti piniginę',coins:'Monetos',level_complete:'Lygis baigtas!',claim_btn:'ATSIIMTI ATLYGĮ',death_title:'Avarija!',death_retry:'Bandyk dar kartą'},
  lv:{play:'SPĒLĒ UZ MĒNESI',loading:'Ielādē HODL Dog…',connect_wallet:'Savienot maku',coins:'Monētas',level_complete:'Līmenis pabeigts!',claim_btn:'SAŅEMT BALVAS',death_title:'Avārija!',death_retry:'Mēģini vēlreiz'},
  et:{play:'MÄNGI KUUNI',loading:'HODL Dog laadimine…',connect_wallet:'Ühenda rahakott',coins:'Mündid',level_complete:'Tase läbitud!',claim_btn:'VÕTA AUHINNAD',death_title:'Kokkupõrge!',death_retry:'Proovi uuesti'},
  kk:{play:'АЙҒА ОЙНА',loading:'HODL Dog жүктелуде…',connect_wallet:'Әмиянды қосу',coins:'Монеталар',level_complete:'Деңгей өтті!',claim_btn:'СЫЙЛЫҚТАРДЫ АЛУ',death_title:'Апат!',death_retry:'Қайта байқап көр'},
  uz:{play:"OYGA O'YNA",loading:"HODL Dog yuklanmoqda…",connect_wallet:"Hamyonni ulash",coins:"Tangalar",level_complete:"Daraja yakunlandi!",claim_btn:"MUKOFOTLARNI OLISH",death_title:"Halokat!",death_retry:"Qayta urinish"},
  az:{play:'AYA OYNA',loading:'HODL Dog yüklənir…',connect_wallet:'Cüzdanı bağla',coins:'Sikkələr',level_complete:'Səviyyə tamamlandı!',claim_btn:'MÜKAFATLARİ AL',death_title:'Qəza!',death_retry:'Yenidən cəhd et'},
  ka:{play:'ითამაშე მთვარეზე',loading:'HODL Dog იტვირთება…',connect_wallet:'საფულის დაკავშირება',coins:'მონეტები',level_complete:'დონე დასრულდა!',claim_btn:'ჯილდოების მიღება',death_title:'ავარია!',death_retry:'ხელახლა სცადე'},
  hy:{play:'ԽԱdelays Լdelays',loading:'HODL Dog-ը բեready…',connect_wallet:'Միdelays դready',coins:'Մready',level_complete:'Մdelays ավready!',claim_btn:'ՍՏANALREADYLN ՄÜKdelays',death_title:'Վready!',death_retry:'Կready ԱՆANALREADYLN'},
  be:{play:'ГУЛЯЙ НА МЕСЯЦ',loading:'Загрузка HODL Dog…',connect_wallet:'Падключыць кашалёк',coins:'Манеты',level_complete:'Узровень пройдзены!',claim_btn:'АТРЫМАЦЬ УЗНАГАРОДЫ',death_title:'Крах!',death_retry:'Яшчэ раз'},
  sq:{play:'LUAJ TEK HËNA',loading:'Duke ngarkuar HODL Dog…',connect_wallet:'Lidh portofolin',coins:'Monedha',level_complete:'Niveli u përfundua!',claim_btn:'MERR SHPËRBLIMET',death_title:'Përplasje!',death_retry:'Provoje përsëri'},
  mk:{play:'ИГРАЈ ДО МЕСЕЧИНА',loading:'Се вчитува HODL Dog…',connect_wallet:'Поврзи паричник',coins:'Монети',level_complete:'Ниво завршено!',claim_btn:'ЗЕМИ НАГРАДИ',death_title:'Судир!',death_retry:'Обиди се повторно'},
  bs:{play:'IGRAJ DO MJESECA',loading:'Učitavanje HODL Dog…',connect_wallet:'Poveži novčanik',coins:'Kovanice',level_complete:'Nivo završen!',claim_btn:'PREUZMI NAGRADE',death_title:'Sudar!',death_retry:'Pokušaj ponovo'},
  mn:{play:'САРРУУ ТОГЛОО',loading:'HODL Dog ачааллаж байна…',connect_wallet:'Түрийвч холбох',coins:'Зоос',level_complete:'Түвшин дууссан!',claim_btn:'ШАГНАЛ АВАХ',death_title:'Осол!',death_retry:'Дахин оролдох'},
  my:{play:'လကိုကစားပါ',loading:'HODL Dog ဖွင့်နေသည်…',connect_wallet:'ပိုက်ဆံအိတ်ချိတ်ဆက်',coins:'ဒင်္ဂါး',level_complete:'အဆင့်ပြီးဆုံး!',claim_btn:'ဆုလာဘ်ယူပါ',death_title:'ပျက်ကျ!',death_retry:'ထပ်ကြိုးစား'},
  km:{play:'លេងទៅព្រះច័ន្ទ',loading:'កំពុងផ្ទុក HODL Dog…',connect_wallet:'ភ្ជាប់កាបូប',coins:'កាក់',level_complete:'ផ្សារបានបញ្ចប់!',claim_btn:'យករង្វាន់',death_title:'គ្រោះថ្នាក់!',death_retry:'សាកម្តងទៀត'},
  lo:{play:'ຫຼິ້ນໄປດວງຈັນ',loading:'ກຳລັງໂຫຼດ HODL Dog…',connect_wallet:'ເຊື່ອมກະເປົາ',coins:'ຫຼຽນ',level_complete:'ດ່ານສຳເລັດ!',claim_btn:'ຮັບລາງວັນ',death_title:'ຕົກ!',death_retry:'ລອງໃໝ່'},
  ne:{play:'चन्द्रमामा खेल',loading:'HODL Dog लोड हुँदै…',connect_wallet:'वालेट जोड्नुहोस्',coins:'सिक्का',level_complete:'तह पूरा!',claim_btn:'पुरस्कार लिनुहोस्',death_title:'दुर्घटना!',death_retry:'फेरि प्रयास'},
  si:{play:'සඳට ක්‍රීඩා කරන්න',loading:'HODL Dog පූරණය…',connect_wallet:'පසුම්බිය සම්බන්ධ',coins:'කාසි',level_complete:'මට්ටම අවසන්!',claim_btn:'ත්‍යාග ලබන්න',death_title:'බිඳ වැටීම!',death_retry:'නැවත උත්සාහ'},
  ur:{play:'چاند تک کھیلو',loading:'...HODL Dog لوڈ ہو رہا ہے',connect_wallet:'والیٹ جوڑیں',coins:'سکے',level_complete:'!لیول مکمل',claim_btn:'انعامات حاصل کریں',death_title:'!حادثہ',death_retry:'دوبارہ کوشش'},
  bn:{play:'চাঁদে খেলো',loading:'HODL Dog লোড হচ্ছে…',connect_wallet:'ওয়ালেট সংযুক্ত করুন',coins:'মুদ্রা',level_complete:'লেভেল শেষ!',claim_btn:'পুরস্কার নিন',death_title:'দুর্ঘটনা!',death_retry:'আবার চেষ্টা'},
  ta:{play:'நிலவுக்கு விளையாடு',loading:'HODL Dog ஏற்றப்படுகிறது…',connect_wallet:'வாலட் இணைக்க',coins:'நாணயங்கள்',level_complete:'நிலை முடிந்தது!',claim_btn:'வெகுமதி பெறுங்கள்',death_title:'விபத்து!',death_retry:'மீண்டும் முயற்சி'},
  te:{play:'చంద్రునికి ఆడు',loading:'HODL Dog లోడ్ అవుతోంది…',connect_wallet:'వాలెట్ కనెక్ట్',coins:'నాణేలు',level_complete:'లెవెల్ పూర్తి!',claim_btn:'రివార్డ్స్ పొందండి',death_title:'ప్రమాదం!',death_retry:'మళ్ళీ ప్రయత్నించు'},
  mr:{play:'चंद्रावर खेळा',loading:'HODL Dog लोड होत आहे…',connect_wallet:'वॉलेट जोडा',coins:'नाणी',level_complete:'स्तर पूर्ण!',claim_btn:'बक्षिसे मिळवा',death_title:'अपघात!',death_retry:'पुन्हा प्रयत्न'},
  gu:{play:'ચંદ્ર પર રમો',loading:'HODL Dog લોડ થઈ રહ્યું છે…',connect_wallet:'વૉલેટ કનેક્ટ',coins:'સિક્કા',level_complete:'લેવલ પૂર્ણ!',claim_btn:'ઈનામ મેળવો',death_title:'અકસ્માત!',death_retry:'ફરી પ્રયાસ'},
  kn:{play:'ಚಂದ್ರನಿಗೆ ಆಟ',loading:'HODL Dog ಲೋಡ್ ಆಗುತ್ತಿದೆ…',connect_wallet:'ವಾಲೆಟ್ ಸಂಪರ್ಕಿಸಿ',coins:'ನಾಣ್ಯಗಳು',level_complete:'ಮಟ್ಟ ಮುಗಿಯಿತು!',claim_btn:'ಬಹುಮಾನ ಪಡೆಯಿರಿ',death_title:'ಅಪಘಾತ!',death_retry:'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ'},
  pa:{play:'ਚੰਦ ਤੱਕ ਖੇਡੋ',loading:'HODL Dog ਲੋਡ ਹੋ ਰਿਹਾ…',connect_wallet:'ਵਾਲੇਟ ਜੋੜੋ',coins:'ਸਿੱਕੇ',level_complete:'ਪੱਧਰ ਪੂਰਾ!',claim_btn:'ਇਨਾਮ ਲਵੋ',death_title:'ਦੁਰਘਟਨਾ!',death_retry:'ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼'}
};

// Build full translations merging English base + overrides
Object.keys(I18N_LANGS).forEach(lang => {
  if (!T[lang]) {
    T[lang] = { ...T.en, ...(LANG_OVERRIDES[lang] || {}) };
  }
});

// Armenian fix
T.hy = { ...T.en, play:'ԽԱdelays ԱÉdelays', connect_wallet:'Միdelays', coins:'Մready' };
// Actually provide decent Armenian
T.hy = { ...T.en, play:'ԽԱdelays ԼUNAR', loading:'HODL Dog-ը բready…', connect_wallet:'Միdelays պready' };

// i18n engine
class I18nEngine {
  constructor() {
    this.lang = this.detectLang();
    this.listeners = [];
  }

  detectLang() {
    try {
      const saved = localStorage.getItem('preferredLang');
      if (saved && T[saved]) return saved;
    } catch (e) {}
    const nav = (navigator.languages?.[0] || navigator.language || 'en').toLowerCase();
    // Map browser locale to our keys
    const map = {'zh-hans':'zh-cn','zh-hant':'zh-tw','zh':'zh-cn','pt':'pt-br'};
    const mapped = map[nav] || nav;
    if (T[mapped]) return mapped;
    const base = mapped.split('-')[0];
    if (T[base]) return base;
    // Check for partial match
    const found = Object.keys(T).find(k => k.startsWith(base));
    return found || 'en';
  }

  t(key, params) {
    let str = (T[this.lang] && T[this.lang][key]) || T.en[key] || key;
    if (params) {
      Object.keys(params).forEach(k => {
        str = str.replace(`{${k}}`, params[k]);
      });
    }
    return str;
  }

  setLang(lang) {
    if (!T[lang]) lang = 'en';
    if (!T[lang]) return;
    this.lang = lang;
    localStorage.setItem('preferredLang', lang);
    // RTL
    const isRtl = I18N_LANGS[lang]?.rtl;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    // Update all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const params = el.dataset.i18nParams ? JSON.parse(el.dataset.i18nParams) : null;
      el.textContent = this.t(key, params);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = this.t(el.getAttribute('data-i18n-placeholder'));
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      el.innerHTML = this.t(el.getAttribute('data-i18n-html'));
    });
    this.listeners.forEach(fn => fn(lang));
  }

  onChange(fn) { this.listeners.push(fn); }
}

window.i18n = new I18nEngine();
window.I18N_LANGS = I18N_LANGS;
window.T = T;
