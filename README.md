# Tipsy Tourist
<div>
<h4>
Makers final engineering project created by Iain Hoolahan, Kay Watts, Tim Buller & Will Lines.</h4>
<h5>
<a href='https://github.com/HOOLAHAN/tipsy-tourist/blob/main/README.md#Spec'> Spec </a> <span> · </span>
<a href='https://github.com/HOOLAHAN/tipsy-tourist/blob/main/README.md#Installation'> Installation </a><span> · </span>
<a href='https://github.com/HOOLAHAN/tipsy-tourist/blob/main/README.md#Running-locally'> Running locally</a>
<h5>
</div>

# Spec

An app to plot a pub crawl whilst taking in the sights along the way!

# Installation

## Backend

Clone the repo at https://github.com/williamlines/tipsy-tourist-server.git

In terminal (Mac), run:

```
cd tipsy_tourist_server
npm install
```
You will need to request a google API key at https://cloud.google.com/ and then create a new file apiKey.js in the src directory with the following code:

```
const apiKey = "<YOUR-API-KEY>"
module.exports = apiKey
```

## Frontend

Clone this repo

In terminal (Mac), run:

```
cd tipsy_tourist
npm install
```
Create a new file apiKey.js in the src directory with the following code:

```
const apiKey = "<YOUR-API-KEY>"
module.exports = apiKey
```
Additionally, create a .env.local file and add in this code:
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
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.
