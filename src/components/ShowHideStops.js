import {
  Text
} from "@chakra-ui/react";

import { React } from "react";

const ShowHideStops = ({showHideItinerary}) => {

  if ( showHideItinerary === true ) {
    return (<Text>Show Stops</Text>) 
  } else { 
    return (<Text>Hide Stops</Text>) 
  }
  
}

export default ShowHideStops;