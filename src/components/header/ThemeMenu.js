// src/components/header/ThemeMenu.js

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useUITheme } from "../../context/ThemeContext";

const ThemeMenu = ({ mapTheme, setMapTheme, fullWidth = false }) => {
  const theme = useUITheme();

  const buttonStyle = {
    borderRadius: "md",
    bg: theme.primary,
    color: "white",
    _hover: { bg: theme.accent },
    border: `1px solid ${theme.accent}`,
    shadow: "md",
    h: "32px",
    w: fullWidth ? "100%" : "fit-content",
    minW: fullWidth ? undefined : "110px",
    px: 3,
  };

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} {...buttonStyle}>
        {mapTheme.charAt(0).toUpperCase() + mapTheme.slice(1)}
      </MenuButton>
      <MenuList
        bg={theme.bg}
        color={theme.text}
        borderColor={theme.accent}
        sx={{
          backgroundColor: theme.bg,
          color: theme.text,
        }}
      >
        {["classic", "dark", "plain", "neon"].map((themeKey) => (
          <MenuItem
            key={themeKey}
            onClick={() => setMapTheme(themeKey)}
            sx={{
              backgroundColor: theme.bg,
              color: theme.text,
              _hover: {
                backgroundColor: theme.accent,
                color: "white",
              },
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
