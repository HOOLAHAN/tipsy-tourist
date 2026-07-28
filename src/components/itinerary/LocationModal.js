import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, HStack, IconButton, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";
import { useUITheme } from "../../context/ThemeContext";
import LocationDetailsCard from "./LocationDetailsCard";

export default function LocationModal({ isOpen, onClose, place, stopNumber, onBack }) {
  const theme = useUITheme();
  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom" scrollBehavior="inside">
      <ModalOverlay bg="transparent" />
      <ModalContent position="fixed" bottom={0} m={0} w={{ base: "100%", md: "520px" }} maxW="100%" h="82dvh" maxH="82dvh" bg={theme.bg} color={theme.text} border={`1px solid ${theme.accent}`} borderBottomWidth={0} borderTopRadius="3xl" overflow="hidden" boxShadow="0 -18px 55px rgba(15,23,42,.18)">
        <Box w="44px" h="5px" bg={theme.accent} opacity={0.45} borderRadius="full" mx="auto" mt={4} />
        <ModalHeader px={6} pt={5} pb={4}>
          <HStack spacing={3}>
            {onBack && <IconButton aria-label="Back to itinerary" icon={<ArrowBackIcon boxSize={6} />} onClick={onBack} isRound bg={`${theme.accent}18`} />}
            <Box><Text fontSize="2xl" fontWeight="extrabold">Location details</Text>{stopNumber && <Text fontSize="sm" fontWeight="normal" opacity={0.65}>Stop {stopNumber}</Text>}</Box>
          </HStack>
        </ModalHeader>
        <ModalBody px={{ base: 4, md: 5 }} pt={1} pb="calc(env(safe-area-inset-bottom, 0px) + 24px)">
          {place && <LocationDetailsCard place_id={place.place_id} place={place} stopNumber={stopNumber} />}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
