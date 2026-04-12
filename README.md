# Схема проекта "game"

```bash
game/
├── .npm/
│   └── svg.js            # создание спрайтов svg
│
├── node_modules           # зависимости npm
│     └── ...
│
├── public/
│   ├── fonts           # шрифты
│   ├── icons           # иконки
│   ├── audio           # звуки
│   ├── images          # изображения
│   ├── .htaccess       # настройки для apache
│   ├── favicon.ico     # фавикон
│   └── ...             
│
├── src/              
│   ├── app              # провайдер, роутер и обвертка для анимации
│   ├── components       # layouts, sections
│   ├── pages            # страницы
│   ├── hooks            # хуки
│   ├── stores           # хук для взаимодействия с воркером
│   ├── types            # swiper.d.ts, types.ts
│   ├── styles           # стили
│   ├── ui               # мелкие елементы интерфейса
│   ├── main.tsx         # точка входа
│   └── ...
│
├── .gitignore           # игнор для git
├── index.html           # главный файл 
├── tailwind.config.js   # настройки tailwind
├── package.json         # зависимости
├── convert.php          # конвертер rem/px всех файлов проекта
├── vite.config.ts       # конфиг для vite  
└── ...

