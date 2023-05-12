# Tipsy Tourist
<div>

<h5 align="center">
<a href='https://github.com/HOOLAHAN/tipsy-tourist/blob/main/README.md#Spec'> Tech </a> <span> · </span>
<a href='https://github.com/HOOLAHAN/tipsy-tourist/blob/main/README.md#Spec'> Spec </a> <span> · </span>
<a href='https://github.com/HOOLAHAN/tipsy-tourist/blob/main/README.md#Installation'> Installation </a><span> · </span>
<a href='https://github.com/HOOLAHAN/tipsy-tourist/blob/main/README.md#Running-locally'> Running locally</a>
<h5>
</div>

<h3 align="center">
Makers final engineering project created by Iain Hoolahan, Kay Watts, Tim Buller & Will Lines.</h3>

# Tech
![Image](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Image](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![Image](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Image](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white)
![Image](https://img.shields.io/badge/Chakra--UI-319795?style=for-the-badge&logo=chakra-ui&logoColor=white)

# Spec

An app to plot a pub crawl whilst taking in the sights along the way!

# Website

The website has been fully deployed and can can be viewed via [this link](http://tipsytourist.s3-website.eu-west-2.amazonaws.com/)

# Installation

## Backend

The backend has been deployed using AWS Lambda: 
[Link to Repo](https://github.com/HOOLAHAN/tipsy-tourst-lambda)

## Frontend

[Clone this repo](https://github.com/HOOLAHAN/tipsy-tourist)

In terminal (Mac), run:

```
cd tipsy_tourist
npm install
```
Create a .env.local file in the root of the directory and add in this code:
```
REACT_APP_GOOGLE_MAPS_API_KEY= "<YOUR-API-KEY>
```

# Running locally

## Frontend

```
cd tipsy_tourist
npm run build
serve -s build
```

Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Demo

Tipsy Toursit has a single page with 4 main components (map, search form, itinerary, location details). When you first land on the website you will see the map component which fills the screen and a button to open up the search form which provides many options for the user to tailor their requirements. Once the user has provided a start-point, end-point, number of pubs/attractions and clicked the search button the route will be displayed.

![Image](https://github.com/HOOLAHAN/tipsy-tourist/blob/main/README_Images/searching_route.png)

The user can minimise the search form and view the route full screen.
  
![Image](https://github.com/HOOLAHAN/tipsy-tourist/blob/main/README_Images/route.png)

The user can click a button which opens up a side drawer containing the route itinerary.
  
![Image](https://github.com/HOOLAHAN/tipsy-tourist/blob/main/README_Images/itinerary.png)

The user can click on any of the locations in the itinerary to find out more details.

![Image](https://github.com/HOOLAHAN/tipsy-tourist/blob/main/README_Images/viewing_location.png)

The UX has been designed so that it will work well both on mobile devices as well as computer screens:

![Image](https://github.com/HOOLAHAN/tipsy-tourist/blob/main/README_Images/phone_search.png)
  
![Image](https://github.com/HOOLAHAN/tipsy-tourist/blob/main/README_Images/phone_route.png)
  
![Image](https://github.com/HOOLAHAN/tipsy-tourist/blob/main/README_Images/phone_itinerary.png)
  
![Image](https://github.com/HOOLAHAN/tipsy-tourist/blob/main/README_Images/phone_location_details.png)
