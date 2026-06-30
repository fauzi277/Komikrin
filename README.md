# 📚 KomikRin - Platform Baca Komik

Platform modern untuk membaca komik dengan web dan mobile app yang user-friendly.

## 🎯 Fitur Utama

### User Side
- ✅ Register/Login dengan JWT
- ✅ Browse & search komik
- ✅ Komik reader dengan zoom
- ✅ Bookmark & history
- ✅ Favorit komik
- ✅ Rating & review
- ✅ Dark mode

### Creator/Admin
- ✅ Upload komik & chapters
- ✅ Manage metadata
- ✅ Analytics
- ✅ Admin dashboard

## 🏗️ Struktur Proyek

```
komikRin/
├── backend/           # Node.js + Express + PostgreSQL
├── web/              # React + TypeScript + Tailwind
├── mobile/           # React Native + Expo
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Web
```bash
cd web
npm install
npm run dev
```

### Mobile
```bash
cd mobile
npm install
npm start
```

## 📦 Tech Stack

- **Backend:** Node.js, Express, PostgreSQL, JWT
- **Web:** React 18, TypeScript, Tailwind CSS, React Router
- **Mobile:** React Native, Expo, React Navigation
- **Storage:** Local (akan migrate ke AWS S3)

## 👤 Author

- GitHub: [@fauzi277](https://github.com/fauzi277)

## 📝 License

MIT