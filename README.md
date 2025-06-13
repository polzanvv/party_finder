# Party Finder

## Project Overview

**Party Finder** is a web application that helps parents find and book venues for children’s parties. 
It upload data from Google Places API, allowing users to search, filter, and view detailed information about venues. 
Logged-in users can leave reviews and make bookings.

## Features

- Geolocation-based venue discovery
- Search and filter venues by name, rating, and type
- Integration with Google Places API
- Venue detail pages with reviews, and map link
- User authentication (login/register)
- Submit reviews with rating and comments
- Booking form with date, time, and notes
- "Owner" page placeholder for future venue management
- Responsive design built with Tailwind CSS

## Installation Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/party-finder.git
cd party-finder

2. Backend Setup
cd backend
npm install
Create a .env file in the backend/ folder with the following content:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
PORT=5000

Start the backend server:
npm run dev

3. Frontend Setup
cd ../frontend
npm install
Create a .env file in the frontend/ folder:
REACT_APP_API_URL=http://localhost:5000/api

Start the frontend app:
npm start

Usage
On the home page, choose Parent to browse venues or Owner to see a "Coming soon" message.
The app uses your location to show venues nearby.
Search or filter venues by name, type, or rating.
Click on a venue to view details, reviews, and booking options.
Log in to submit reviews or make a booking.
Navigate back with the "Back" button on the details page.

Technologies Used

Frontend:
React
React Router
Axios
Tailwind CSS

Backend:
Node.js
Express
MongoDB & Mongoose
JWT Authentication
dotenv

APIs & Services:
Google Places API
Google Maps JavaScript API

Future Improvements
✅ Venue owner dashboard and management
✅ Booking calendar with availability sync
✅ Social logins (Google, Facebook)
✅ Messaging between parents and owners
✅ Admin panel with moderation tools
✅ Responsive mobile design improvements
✅ Payment integration for paid bookings
