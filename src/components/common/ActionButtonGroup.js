// components/common/ActionButtonGroup.js

import { HStack, IconButton } from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";
import { useUITheme } from "../../context/ThemeContext";

const ActionButtonGroup = ({ clearRoute }) => {
  const theme = useUITheme();

  return (
    <HStack>
      <IconButton
        aria-label="Clear route"
        icon={<FaTimes />}
        onClick={clearRoute}
        placement="left"
        isRound
        left="10px"
        top="10px"
        zIndex={2}
        bg={theme.primary}
        color="white"
        _hover={{ bg: theme.accent }}
        boxShadow="md"
      />
    </HStack>
  );
};

export default ActionButtonGroup;
