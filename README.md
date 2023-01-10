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

# Installation

## Backend

[Clone this repo](https://github.com/williamlines/tipsy-tourist-server.git)

In terminal (Mac), run:

```
cd tipsy_tourist_server
npm install
```
You will need to request a Google API key [here](https://cloud.google.com/) and then create a new file apiKey.js in the src directory with the following code:

```
const apiKey = "<YOUR-API-KEY>"
module.exports = apiKey
```

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

## Backend

```
cd tipsy_tourist_server
npm start
```

## Frontend

```
cd tipsy_tourist
npm run build
serve -s build
```

Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.
