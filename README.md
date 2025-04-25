# AI Skin Analyzer

A modern web application that uses AI to analyze skin conditions and provide personalized skincare recommendations.

## Features

- Skin condition analysis through photo upload
- Personalized skincare questionnaire
- AI-powered skin analysis
- Product recommendations based on analysis results
- Responsive design for both mobile and desktop

## Tech Stack

- React.js with TypeScript
- Chakra UI for components
- Tailwind CSS for styling
- React Router for navigation
- Vite for build tooling

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/AI-Skin-Analyzer.git
```

2. Install dependencies:
```bash
cd AI-Skin-Analyzer
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── pages/         # Page components
  ├── assets/        # Static assets
  ├── styles/        # Global styles
  ├── App.tsx        # Main application component
  └── main.tsx       # Application entry point
```

## Backend Integration

The frontend is designed to work with a Django backend. The API endpoints will need to be configured in the frontend once the backend is ready. The main integration points are:

- Photo upload and analysis
- User questionnaire data submission
- Receiving AI analysis results
- Product recommendations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 