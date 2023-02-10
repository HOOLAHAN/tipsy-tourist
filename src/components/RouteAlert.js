import { Alert, AlertIcon, Link } from "@chakra-ui/react";

function RouteAlert({ error }) {
  console.log("alert function called");
  if (error === "driving") {
    console.log("driving alert");
    return (
      <Alert status="error" fontSize="14">
        <AlertIcon />
        Do not drink and drive! This route assumes you have a designated driver.
        <Link
          href="https://www.zeropercentbrews.com/"
          color="blue"
          paddingLeft="7px"
        >
          Explore alcohol free beverages
        </Link>
      </Alert>
    );
  } else if (error === "bicycling") {
    console.log("cycling alert");
    return (
      <Alert status="warning" fontSize="14">
        <AlertIcon />
        Do not drink and cycle!
        <Link
          href="https://www.zeropercentbrews.com/"
          color="blue"
          paddingLeft="7px"
        >
          Explore alcohol free beverages
        </Link>
      </Alert>
    );
  } else if (error === "shortened") {
    console.log("shortened alert");
    return (
      <Alert status="warning">
        <AlertIcon />
        Your route has been automatically shortened due to a lack of viable
        stops along your route.
      </Alert>
    );
  } else if (error === "non-viable") {
    console.log("non-viable alert");
    return (
      <Alert status="error">
        <AlertIcon />
        No viable routes found.
      </Alert>
    );
  } else {
    console.log("got to else");
    return;
  }
}

export default RouteAlert;
