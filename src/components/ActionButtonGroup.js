// components/ActionButtonGroup.js
import React from 'react';
import { HStack, IconButton } from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";

const ActionButtonGroup = ({ clearRoute }) => (
  <HStack>
    <IconButton
      bgColor="white"
      aria-label="center back"
      icon={<FaTimes />}
      onClick={clearRoute}
      placement="left"
      isRound
      left="10px"
      top="10px"
      zIndex={2}
    />
  </HStack>
);

export default ActionButtonGroup;
