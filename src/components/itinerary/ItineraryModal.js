// src/components/itinerary/ItineraryModal.js

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { useUITheme } from "../../context/ThemeContext";
import Itinerary from "./Itinerary";

const ItineraryModal = ({ isOpen, onClose, combinedStops, distance, time, travelMethod, onMoveStop }) => {
  const theme = useUITheme();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent bg={theme.bg} color={theme.text}>
        <ModalHeader borderBottomWidth="1px" borderColor={theme.accent}>
          Your Itinerary
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {combinedStops.length > 0 ? (
            <>
              <HStack spacing={2} mb={4} wrap="wrap">
                <Badge colorScheme="blue">{combinedStops.length} stops</Badge>
                {distance && <Badge colorScheme="green">{distance}</Badge>}
                {time && <Badge colorScheme="purple">{time}</Badge>}
                {travelMethod && <Badge>{travelMethod.toLowerCase()}</Badge>}
              </HStack>
              <Itinerary combinedStops={combinedStops} onMoveStop={onMoveStop} />
            </>
          ) : (
            <Text>No stops in your itinerary yet.</Text>
          )}
        </ModalBody>
        <ModalFooter borderTopWidth="1px" borderColor={theme.accent}>
          <Button
            bg={theme.primary}
            color="white"
            _hover={{ bg: theme.accent }}
            onClick={onClose}
            boxShadow="md"
            size={"sm"}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ItineraryModal;
