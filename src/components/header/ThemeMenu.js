// src/components/header/ThemeMenu.js

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { FiSettings } from "react-icons/fi";
import { useUITheme } from "../../context/ThemeContext";

const ThemeMenu = ({ mapTheme, setMapTheme }) => {
  const theme = useUITheme();

  return (
    <Menu>
      <Tooltip label="Change theme" hasArrow>
        <MenuButton
          as={IconButton}
          icon={<FiSettings />}
          aria-label="Change map theme"
          bg={theme.primary}
          color="white"
          _hover={{ bg: theme.accent }}
          border={`1px solid ${theme.accent}`}
          shadow="md"
          size="md"
          isRound
        />
      </Tooltip>
      <MenuList
        bg={theme.bg}
        color={theme.text}
        borderColor={theme.accent}
      >
        {["classic", "dark", "plain", "neon"].map((themeKey) => (
          <MenuItem
            key={themeKey}
            onClick={() => setMapTheme(themeKey)}
            bg={theme.bg}
            color={theme.text}
            _hover={{
              bg: theme.accent,
              color: "white",
            }}
          >
            {themeKey.charAt(0).toUpperCase() + themeKey.slice(1)}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default ThemeMenu;
