import Itinerary from "./Itinerary";

import React from 'react';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  DrawerHeader,
  DrawerFooter,
  Button,
} from '@chakra-ui/react';

const ItineraryDrawer = ({ isOpen, onClose, combinedStops }) => {
  return (
    <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerBody>
          <DrawerHeader>Itinerary:</DrawerHeader>
          <Itinerary combinedStops={combinedStops} />
        </DrawerBody>
        <DrawerFooter>
          <Button colorScheme="green" onClick={onClose}>
            Done
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ItineraryDrawer;
