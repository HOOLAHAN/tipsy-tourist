import { AddIcon } from "@chakra-ui/icons";
import { Badge, Box, Flex, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Spinner, Text } from "@chakra-ui/react";
import { FaBeer, FaCamera } from "react-icons/fa";
import { useUITheme } from "../../context/ThemeContext";
import Itinerary from "./Itinerary";

export default function ItineraryModal({ isOpen, onClose, combinedStops, distance, time, travelMethod, routeLegs = [], onMoveStop, onSelectStop, onRemoveStop, onRegenerateStop, onAddStop, updatingStopId }) {
  const theme = useUITheme();
  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom" scrollBehavior="inside">
      <ModalOverlay bg="transparent" />
      <ModalContent position="fixed" bottom={0} m={0} w={{ base: "100%", md: "520px" }} maxW="100%" h="82dvh" maxH="82dvh" bg={theme.bg} color={theme.text} border={`1px solid ${theme.accent}`} borderBottomWidth={0} borderTopRadius="3xl" overflow="hidden" boxShadow="0 -18px 55px rgba(15,23,42,.18)">
        <Box w="44px" h="5px" bg={theme.accent} opacity={0.45} borderRadius="full" mx="auto" mt={4} />
        <ModalHeader px={6} pt={5} pb={2}>
          <Flex align="center" justify="space-between" gap={4}>
            <Box>
              <Text fontSize="2xl" fontWeight="extrabold">Your itinerary</Text>
              <Text fontSize="sm" fontWeight="normal" opacity={0.65}>Review the route · use arrows to reorder</Text>
            </Box>
            <Menu placement="bottom-end">
              <MenuButton
                as={IconButton}
                aria-label="Add a stop"
                icon={updatingStopId === "__adding__" ? <Spinner size="sm" /> : <AddIcon />}
                isRound
                isDisabled={!!updatingStopId}
                bg={theme.primary}
                color="white"
                _hover={{ bg: theme.accent }}
              />
              <MenuList bg={theme.bg} borderColor={theme.accent} zIndex={2000}>
                <MenuItem icon={<FaBeer />} bg={theme.bg} _hover={{ bg: `${theme.accent}22` }} onClick={() => onAddStop?.("pub")}>Add a pub</MenuItem>
                <MenuItem icon={<FaCamera />} bg={theme.bg} _hover={{ bg: `${theme.accent}22` }} onClick={() => onAddStop?.("attraction")}>Add an attraction</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </ModalHeader>
        <HStack spacing={2} px={6} py={3} wrap="wrap">
          <Badge borderRadius="full" px={3} py={2}>{combinedStops.length} STOPS</Badge>
          {distance && <Badge borderRadius="full" px={3} py={2}>{distance}</Badge>}
          {time && <Badge borderRadius="full" px={3} py={2}>{time}</Badge>}
          {travelMethod && <Badge borderRadius="full" px={3} py={2} bg={theme.primary} color="white">{travelMethod}</Badge>}
        </HStack>
        <ModalBody px={5} pt={2} pb="calc(env(safe-area-inset-bottom, 0px) + 24px)">
          {combinedStops.length ? <Itinerary combinedStops={combinedStops} routeLegs={routeLegs} onMoveStop={onMoveStop} onSelectStop={onSelectStop} onRemoveStop={onRemoveStop} onRegenerateStop={onRegenerateStop} updatingStopId={updatingStopId} /> : <Text>No stops in your itinerary yet.</Text>}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
