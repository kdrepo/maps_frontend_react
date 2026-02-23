# Bharat Land Jihad Dashboard - Frontend

A modern React + Vite application for tracking and managing land-related incidents in India with state and district-level drill-down capabilities.

## Features

- 🗺️ **Interactive Maps**: Navigate through India's states and districts with beautiful maps
- 📊 **Live Data Panels**: Real-time statistics and metrics for incidents
- 🔐 **User Authentication**: Secure login system with email/phone and password
- 👤 **User Profiles**: Personalized profile page with submission history
- 🌓 **Dark Mode**: Full dark mode support with orange/black color scheme
- 📱 **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- ✨ **Modern UI**: Built with Framer Motion animations and Lucide icons

## Environment Setup

### Configuration

Create a `.env.local` file in the project root with the following variables:

```env
# API Configuration (update to match your backend server)
VITE_API_BASE_URL=http://localhost:8000
```

The `.env.example` file contains the template for available environment variables.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Building

```bash
npm run build
```

## Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── LoginModal.jsx   # Login form modal
│   ├── ProfileDropdown.jsx  # User profile menu
│   ├── IndiaMap.jsx     # India state selection map
│   ├── StateMap.jsx     # District selection map
│   └── ...
├── hooks/               # Custom React hooks
│   ├── useAuth.js       # Authentication hook
│   ├── useGeoJson.js    # GeoJSON data fetching
│   └── ...
├── lib/                 # Utility functions
│   ├── colors.js        # Theme color configuration
│   └── api.js           # API utilities
├── data/                # Static data and mock data
└── App.jsx              # Main application component
```

## Authentication

The app uses session-based authentication with the backend API:

1. Click "Sign In" button in the header
2. Enter your email/phone and password
3. On successful login, your profile picture will appear in the header
4. Click on the profile dropdown to access "My Profile", "Settings", or "Log Out"

### API Endpoints Used

- `POST /api/auth/login/` - Login with email or phone
- `POST /api/auth/send-otp/` - Send OTP for signup
- `POST /api/auth/verify-otp/` - Verify OTP
- `POST /api/auth/logout/` - Logout

For complete API documentation, see [../api_endpoints.md](../api_endpoints.md)

## Theme

The application uses an orange and black color scheme designed for both light and dark modes:

- **Light Mode**: Orange accents (#e87722) on cream backgrounds
- **Dark Mode**: Bright orange accents (#ff9a3d) on warm black backgrounds

You can toggle between light and dark modes using the button in the header.

## Technologies Used

- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Lucide React**: Icon library
- **D3-Geo**: Geospatial visualization
- **React Simple Maps**: Map rendering

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
