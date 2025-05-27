// src/components/common/RouteAlert.js

import { Alert, AlertIcon, Box } from "@chakra-ui/react";

function RouteAlert({ error }) {

  const commonProps = {
    fontSize: "14px",
    borderRadius: "md",
    maxW: "100%",
    w: "100%",
    px: 3,
    py: 2,
  };

  const container = (status, children) => (
    <Box w="100%" maxW="250px">
      <Alert status={status} {...commonProps}>
        <AlertIcon />
        {children}
      </Alert>
    </Box>
  );

  if (error === "driving") {
    return container(
      "error",
      <>
        Never drink and drive! Be sure to have a designated driver.
      </>
    );
  }

  if (error === "bicycling") {
    return container(
      "warning",
      <>
        We do not recommend drinking and cycling!
      </>
    );
  }

  if (error === "shortened") {
    return container(
      "warning",
      <>Your route has been automatically shortened due to a lack of viable stops.</>
    );
  }

  if (error === "non-viable") {
    return container("error", <>No viable routes found.</>);
  }

  return null;
}

export default RouteAlert;
