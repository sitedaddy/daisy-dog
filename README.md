# Fetch22 Pet Styling Website

A professional pet grooming website for Fetch22 Pet Styling, featuring real-time Google reviews integration and modern responsive design.

## Features

- **Responsive Design**: Mobile-friendly interface optimized for all devices
- **Google Reviews Integration**: Real-time display of authentic customer reviews from Google Places API
- **Professional Styling**: Modern design with smooth animations and intuitive navigation
- **Booking System**: Interactive booking form for pet grooming appointments
- **Security**: XSS protection and secure API handling

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Python HTTP server with Google Places API integration
- **APIs**: Google Places API for reviews and business information
- **Styling**: Custom CSS with FontAwesome icons

## Setup Instructions

### Prerequisites

- Python 3.7+
- Google Places API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fetch22-pet-grooming.git
cd fetch22-pet-grooming
```

2. Install dependencies:
```bash
pip install requests
```

3. Set up environment variables:
```bash
export GOOGLE_PLACES_API_KEY="your_google_places_api_key_here"
```

4. Run the server:
```bash
python server.py
```

5. Open your browser and navigate to `http://localhost:5000`

## API Configuration

The website uses Google Places API to fetch real customer reviews and business information. You'll need to:

1. Get a Google Places API key from the [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Places API for your project
3. Set the API key as an environment variable: `GOOGLE_PLACES_API_KEY`

## File Structure

```
fetch22-pet-grooming/
├── index.html          # Main website page
├── styles.css          # Website styling
├── script.js           # Frontend JavaScript
├── server.py           # Combined web and API server
├── api.py              # Standalone API server (legacy)
├── assets/             # Images and static assets
├── README.md           # This file
└── .gitignore         # Git ignore rules
```

## Security Features

- XSS protection in star rating display
- CORS headers for secure API access
- Input validation and sanitization
- Secure environment variable handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software for Fetch22 Pet Styling.

## Contact

For support or inquiries, please contact Fetch22 Pet Styling directly through the website.