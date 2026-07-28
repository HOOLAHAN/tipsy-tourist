# Tipsy Tourist

<h3 align="center">
Makers final engineering project initially created by Iain Hoolahan, Kay Watts, Tim Buller & Will Lines. The app has since been refactored, redeveloped and extended by Iain Hoolahan.
</h3>

## Tech Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![Serverless](https://img.shields.io/badge/Serverless-FD5750?style=for-the-badge&logo=serverless&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![Chakra UI](https://img.shields.io/badge/Chakra--UI-319795?style=for-the-badge&logo=chakra-ui&logoColor=white)
![Google Maps API](https://img.shields.io/badge/Google%20Maps%20API-4285F4?style=for-the-badge)

## Spec

An interactive app for plotting a pub crawl while taking in the sights along the way. Simply input a start and end location, choose how many pubs and attractions you'd like to visit, and let the app handle the rest. Routes are optimised, themed, and supported with live place info pulled from Google Maps.

## Website

The app is live and can be used here: [https://d3pbhrkalr09t8.cloudfront.net/](https://d3pbhrkalr09t8.cloudfront.net/)

## Installation

### Backend

The backend is deployed using AWS Lambda:  
[Link to Repo](https://github.com/HOOLAHAN/tipsy-tourst-lambda)

### Frontend

[Clone this repo](https://github.com/HOOLAHAN/tipsy-tourist)

In terminal (Mac), run:

```bash
cd tipsy_tourist
npm install
```

Copy `.env.example` to `.env.development.local` in the project root and add the development website key:

```
REACT_APP_TIPSY_TOURIST_GOOGLE_MAPS_KEY_DEVELOPMENT="<YOUR-DEVELOPMENT-WEBSITE-API-KEY>"
```

## Running locally

```bash
cd tipsy_tourist
npm start
```

Then visit [http://localhost:3000](http://localhost:3000) to view the app.

## Folder Structure

```
src/
├── assets/
│   └── images/
│       ├── logo.png
│       └── logo3.svg
│
├── components/
│   ├── common/
│   │   ├── ActionButtonGroup.js
│   │   ├── RouteAlert.js
│   │   ├── ShowHideStops.js
│   │   └── TravelModeButtons.js
│   ├── itinerary/
│   │   ├── Itinerary.js
│   │   ├── ItineraryDrawer.js
│   │   └── LocationDetailsCard.js
│   ├── map/
│   │   ├── GoogleMapDisplay.js
│   │   └── StartFinishInput.js
│   ├── plan/
│   │   ├── PlanDrawer.js
│   │   ├── PlanTripButtons.js
│   │   └── PubAttractionSelectors.js
│   └── Header.js
│
├── features/
│   └── routing/
│       ├── calculateRoute.js
│       ├── clearRoute.js
│       ├── stateHandlers.js
│       └── calculateWaypoints.js
│
├── lib/
│   ├── geocode.js
│   ├── details.js
│   ├── Locations.js
│   ├── Attractions.js
│   ├── getPub.js
│   ├── getAttraction.js
│   ├── getAllPubs.js
│   └── getAllAttractions.js
│
├── utils/
│   ├── calculateDistance.js
│   ├── calculateTime.js
│   ├── findPlotPoints.js
│   ├── onlyUnique.js
│
├── theme/
│   └── index.js
│
├── App.js
└── index.js
```

## Demo

### 🔍 Searching a Route
The user begins by selecting their start and end locations and how many pubs/attractions they want to include.
![Search](https://github.com/HOOLAHAN/tipsy-tourist/blob/main/README_Images/searching_route.png)

### 🗺️ Route Display
Once the route is generated, users can view it plotted on a map with location markers and a line to connect the route.
![Route](https://github.com/HOOLAHAN/tipsy-tourist/blob/main/README_Images/route.png)

### 📋 Viewing Itinerary and Location Details
The itinerary modal lets users view an ordered list of all stops.
![Itinerary](https://github.com/HOOLAHAN/tipsy-tourist/blob/main/README_Images/itinerary.png)
Clicking one of the location markers will bring up details of that location. 
![Location](https://github.com/HOOLAHAN/tipsy-tourist/blob/main/README_Images/viewing_location.png)

### 🎨 Theme Customisation
Users can customise the look and feel with dynamic map themes.
![Themes](https://github.com/HOOLAHAN/tipsy-tourist/blob/main/README_Images/themes.png)
