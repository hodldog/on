# HODL Dog — Web3 Play-to-Earn Platformer 🐕🚀

[![Game](https://img.shields.io/badge/game-live-green.svg)](http://194.60.133.152:8888/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Networks](https://img.shields.io/badge/networks-5_chains-purple.svg)]()

> Web3 платформер с Play-to-Earn механикой. Прыгай, собирай монеты, подключай кошелек и получай DOGE. Встроенная админ-панель для управления доменами и деплоем.

## 🎮 Описание

HODL Dog — это браузерная Web3 игра в стиле platformer, где игрок управляет собакой, прыгает по платформам и собирает монеты. После прохождения уровня игрок может подключить кошелек и получить DOGE бонусы.

**Особенности:**
- 🎯 Платформер с физикой и мобильным управлением
- 💰 Play-to-Earn: DOGE токены за прохождение
- 🔗 Web3 интеграция: MetaMask, Trust, WalletConnect
- 🌍 16 языков локализации
- 📱 PWA поддержка (установка на телефон)
- 🛡️ Встроенная админ-панель с мониторингом доменов

## 🚀 Быстрый старт

### Текущий сервер

Игра развёрнута и доступна по адресу:
**http://194.60.133.152:8888/**

### Локальный запуск

```bash
# Клонировать репозиторий
git clone <repo-url>
cd Game1

# Простой HTTP сервер (Python 3)
python3 -m http.server 8888

# Или Node.js
npx serve .

# Или PHP
php -S localhost:8888
```

Открыть: http://localhost:8888

### Доступ к админ-панели

1. Откройте игру
2. Нажмите **Ctrl+Shift+A** (или в консоли: `admin777888`)
3. Введите пароль: `777888`

## 📁 Структура проекта

```
Game1/
├── index.html              # Главная страница игры
├── manifest.json           # PWA манифест
├── sw.js                   # Service Worker
├── css/
│   └── style.css          # Стили игры
├── js/
│   ├── game.js            # Игровая логика
│   ├── wallet.js          # Web3 интеграция
│   ├── i18n.js            # Локализация (16 языков)
│   ├── audio.js           # Звуковая система
│   ├── telemetry.js       # Аналитика
│   ├── app-security.js    # Безопасность
│   ├── admin.js           # Админ-панель (пароль: 777888)
│   └── admin-deploy.js    # Деплой на GitHub/Cloudflare
└── assets/                # Изображения и ресурсы
```

## 🛠️ Функции админ-панели

### 🌐 Domain Monitor
- Мониторинг всех доменов в real-time
- Trust Score для каждого домена
- Auto-check статуса (online/offline)
- Auto-select лучшего домена

### 🚀 Deploy
- Деплой на **GitHub Pages** (авто-создание репо)
- Деплой на **Cloudflare Pages**
- Генерация поддомена: `hodldog[xx].github.io`
- Проверка доступности поддомена

### 📊 Statistics
- Количество игроков
- Подключенные кошельки
- Завершенные уровни
- Распределение DOGE

### 📝 Logs
- История операций
- Экспорт логов в JSON

## 🔐 Настройка деплоя

### GitHub Token

1. Перейдите: https://github.com/settings/tokens
2. Generate new token (Classic)
3. Выберите scopes: `repo`, `workflow`
4. Скопируйте токен в админ-панель

### Cloudflare Token

1. Перейдите: https://dash.cloudflare.com/profile/api-tokens
2. Create Token → Custom token
3. Permissions: `Cloudflare Pages:Edit`
4. Скопируйте токен и Account ID в админ-панель

## 📦 Деплой вручную

### GitHub Pages

```bash
# 1. Создать репозиторий на GitHub
# 2. Залить код:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/repo.git
git push -u origin main

# 3. Settings → Pages → Source: Deploy from branch → main
# 4. Готово! URL: https://username.github.io/repo
```

### Cloudflare Pages

```bash
# Установить Wrangler
npm install -g wrangler

# Логин
wrangler login

# Деплой
wrangler pages deploy . --project-name=hodldog
```

## 🌍 Локализация

Поддерживаемые языки (16):
- 🇬🇧 English (en)
- 🇷🇺 Русский (ru)
- 🇨🇳 中文 (zh-cn)
- 🇯🇵 日本語 (ja)
- 🇰🇷 한국어 (ko)
- 🇪🇸 Español (es)
- 🇫🇷 Français (fr)
- 🇩🇪 Deutsch (de)
- 🇵🇹 Português (pt-br)
- 🇹🇷 Türkçe (tr)
- 🇸🇦 العربية (ar)
- 🇮🇳 हिंदी (hi)
- 🇻🇳 Tiếng Việt (vi)
- 🇹🇭 ไทย (th)
- 🇮🇩 Bahasa Indonesia (id)
- 🇮🇹 Italiano (it)

Переключение: кнопка 🌐 в игре

## 🔗 Поддерживаемые кошельки

- MetaMask
- Trust Wallet
- Coinbase Wallet
- WalletConnect
- Binance Wallet
- SafePal

## 📱 PWA Установка

1. Откройте игру в Chrome/Safari
2. Нажмите "Поделиться" (iOS) или "⋮ → Установить" (Android)
3. Игра добавится на домашний экран
4. Работает офлайн!

## 🎮 Управление

### Desktop
- **← →** или **A D** — движение
- **Пробел** или **↑** или **W** — прыжок
- **ESC** — пауза

### Mobile
- **◀ ▶** — движение
- **▲** — прыжок

## 📤 Экспорт кодовой базы

Для AI аудита и анализа:

```bash
# Сделать скрипт исполняемым
chmod +x export-codebase.sh

# Запустить экспорт
./export-codebase.sh

# Результат: codebase-export-YYYYMMDD-HHMMSS.md
```

Или вручную:

```bash
# Создать единый файл со всем кодом
find . -type f \( -name "*.js" -o -name "*.html" -o -name "*.css" \) \
  -not -path "./.git/*" \
  -not -path "./node_modules/*" \
  > codebase-export.txt
```

## 🔧 Разработка

### Добавление нового языка

1. Откройте `js/i18n.js`
2. Добавьте в объект `I18N_LANGS`:

```javascript
'fr': {
  name: 'Français',
  flag: '🇫🇷',
  strings: {
    play: 'JOUER',
    // ... остальные строки
  }
}
```

### Изменение игровой физики

```javascript
// js/game.js
const CONFIG = {
  gravity: 0.5,        // Гравитация
  jumpPower: 10,       // Сила прыжка
  speed: 5,            // Скорость
  // ...
};
```

## 🌐 Рекомендуемые домены для деплоя

| Домен | Trust Score | Примечание |
|-------|-------------|------------|
| `hodldog.github.io` | 90/100 | ⭐ Рекомендуется |
| `hodldog.pages.dev` | 85/100 | Быстрый CDN |
| `hodldog.vercel.app` | 80/100 | Популярен у dev |
| `hodldog.web.app` | 90/100 | Google Firebase |

## 🚨 Безопасность

- **Никогда** не комитьте API токены в git
- Используйте `.env` файл (добавлен в `.gitignore`)
- Пароль админки можно изменить в `js/admin.js`

## 📄 Лицензия

MIT License — свободное использование и модификация.

---

**HODL Dog** — создано с ❤️ для Web3 комьюнити.

🐕 **To The Moon!** 🚀
