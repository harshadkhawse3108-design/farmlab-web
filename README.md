# 🌾 FarmLab - Agriculture Portal

A modern agriculture portal for farmers featuring daily tips, market prices, weather alerts, government schemes, and more.

## Features

- **📱 Real-time Viewer Count** - See how many farmers are online
- **💡 Daily Tips** - Agricultural advice updated daily
- **📊 Live Market Prices** - Mandi rates for various crops
- **🌤️ Weather Alerts** - Important weather notifications
- **🏛️ Government Schemes** - PM-KISAN and other scheme updates
- **🐛 Pest Control** - Tips for crop protection
- **❤️ Like & Engage** - Interact with helpful posts
- **🌙 Dark Mode** - Eye-friendly theme option
- **📱 Mobile Responsive** - Works on all devices

## Tech Stack

- **Backend:** Node.js, Express, TypeScript
- **Real-time:** Socket.IO
- **Frontend:** HTML, CSS, JavaScript

## Quick Start

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Start server
npm start

# Or run in development mode
npm run dev
```

Then open http://localhost:3000 in your browser.

## Project Structure

```
farmlab/
├── src/
│   ├── server.ts        # Express + Socket.IO server
│   ├── types/           # TypeScript interfaces
│   └── data/            # In-memory data store
├── public/
│   ├── index.html       # Main HTML page
│   ├── css/style.css    # Styles
│   └── js/app.js        # Frontend JavaScript
├── package.json
└── tsconfig.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/posts | Get all posts |
| GET | /api/posts/daily | Get daily tip |
| GET | /api/posts/trending | Get trending posts |
| GET | /api/market-prices | Get market prices |
| GET | /api/ads | Get advertisements |
| GET | /api/stats | Get site statistics |
| POST | /api/posts | Create new post |

## Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- Admin dashboard for managing posts
- User authentication
- Push notifications
- Multi-language support

---

Made with 💚 for Indian Farmers
