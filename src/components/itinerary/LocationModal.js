// src/components/map/LocationModal.js
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import ItineraryItem from "../itinerary/ItineraryItem";
import { useUITheme } from "../../context/ThemeContext";

const LocationModal = ({ isOpen, onClose, placeId }) => {
  const theme = useUITheme();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent bg={theme.bg} color={theme.text}>
        <ModalHeader borderBottomWidth="1px" borderColor={theme.accent}>
          Location Details
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ItineraryItem place_id={placeId} />
        </ModalBody>
        <ModalFooter borderTopWidth="1px" borderColor={theme.accent}>
          <Button
            bg={theme.primary}
            color="white"
            _hover={{ bg: theme.accent }}
            onClick={onClose}
            boxShadow="md"
            size="sm"
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LocationModal;
