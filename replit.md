# MovieStream - Movie Website

## Overview
A modern movie streaming website showcasing 4 featured movies in a responsive grid layout. Built with HTML, CSS, and JavaScript with a sleek dark theme and gradient design.

## Recent Changes
- September 28, 2025: Completely replaced calculator app with movie website
- Added movie grid layout with 4 movies: Thunder Strike, Lost Kingdom, Shadow Hunter, Cyber Genesis
- Implemented modern CSS with gradients and responsive design
- Added interactive JavaScript functionality for movie cards and play buttons
- Configured deployment for production use

## Project Architecture
- **Frontend**: Static HTML/CSS/JavaScript website
- **Server**: Python HTTP server on port 5000
- **Images**: Stock movie poster images stored in attached_assets/stock_images/
- **Layout**: Responsive grid (4 movies on desktop, adapts for mobile)
- **Deployment**: Configured for autoscale deployment

## Features
- Modern gradient-based design
- Responsive movie grid layout
- Interactive movie cards with hover effects
- Play button functionality
- Keyboard navigation support
- Mobile-responsive design

## File Structure
```
index.html - Main website page
brain/
  css/style.css - Modern CSS styling
  js/script.js - Interactive functionality
  img/fav.png - Favicon
attached_assets/stock_images/ - Movie poster images
```

## Development
- Frontend runs on port 5000 via Python HTTP server
- Website is optimized for Replit's proxy environment
- All assets served statically