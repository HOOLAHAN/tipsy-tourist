// src/components/itinerary/ItineraryDrawer.js

import Itinerary from "./Itinerary";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  DrawerHeader,
  DrawerFooter,
  Button,
} from "@chakra-ui/react";
import { useUITheme } from "../../context/ThemeContext";

const ItineraryDrawer = ({ isOpen, onClose, combinedStops }) => {
  const theme = useUITheme();

  return (
    <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent bg={theme.bg} color={theme.text}>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px" borderColor={theme.accent}>
          Itinerary:
        </DrawerHeader>
        <DrawerBody>
          <Itinerary combinedStops={combinedStops} />
        </DrawerBody>
        <DrawerFooter borderTopWidth="1px" borderColor={theme.accent}>
          <Button
            bg={theme.primary}
            color="white"
            _hover={{ bg: theme.accent }}
            onClick={onClose}
            boxShadow="md"
            size={"sm"}
          >
            Done
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ItineraryDrawer;
