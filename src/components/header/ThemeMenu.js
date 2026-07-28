// src/components/header/ThemeMenu.js

import { IconButton, Tooltip } from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useUITheme } from "../../context/ThemeContext";

const ThemeMenu = ({ mapTheme, setMapTheme }) => {
  const theme = useUITheme();

  return (
    <Tooltip label={mapTheme === "dark" ? "Use light mode" : "Use dark mode"} hasArrow>
      <IconButton icon={mapTheme === "dark" ? <FaSun /> : <FaMoon />} aria-label="Change map theme" onClick={() => setMapTheme(mapTheme === "dark" ? "classic" : "dark")} bg={theme.bg} color={theme.text} _hover={{ bg: `${theme.accent}22` }} border={`1px solid ${theme.accent}`} shadow="md" size="lg" isRound />
    </Tooltip>
  );
};

export default ThemeMenu;
