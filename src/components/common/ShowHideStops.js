// src/components/common/ShowHideStops.js

import {
  Text
} from "@chakra-ui/react";

import { React } from "react";

const ShowHideStops = ({showHideItinerary}) => {

  if ( showHideItinerary === true ) {
    return (<Text>Hide Itinerary</Text>) 
  } else { 
    return (<Text>Show Itinerary</Text>) 
  }
  
}

export default ShowHideStops;