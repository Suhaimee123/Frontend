import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import Link from "next/link";
import Image from "next/image";
import logoImage from "/public/pim-Logo.png";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRouter } from "next/navigation";

const NavbarContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  padding: '5px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

const LogoContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  height: 100,
});

const Navbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [shouldScroll, setShouldScroll] = useState(false); // State to trigger scrolling
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  useEffect(() => {
    if (shouldScroll) {
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        setShouldScroll(false); // Reset the scroll trigger
      }, 1000); // Delay before scrolling
    }
  }, [shouldScroll]);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const handleNewsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Prevent default navigation behavior
    router.push("/"); // Navigate to the homepage
    setShouldScroll(true); // Set state to trigger scroll after navigation
  };

  const navItems = [
    { href: '/register', text: 'สมัคร' },
    { href: '/Volunteer', text: 'จิตอาสา' },
    { href: '/Dm', text: 'ติดต่อ' },
    { href: '/Scholarship', text: 'ต่อทุน' },
    { href: '/', text: 'ข่าวสาร', onClick: handleNewsClick } // Attach handleNewsClick to this item
  ];

  return (
    <NavbarContainer>
      <LogoContainer>
        <Box
          display="flex"
          alignItems="center"
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            ml: { sm: '30px' },
          }}
        >
          <Link href="/" passHref>
            <Box className="flex items-center text-white">
              <Image src={logoImage} alt="Logo" height={90} width={90} />
            </Box>
          </Link>
          <Typography
            variant="h6"
            color="white"
            component="a"
            href="/"
            sx={{
              textDecoration: 'none',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' },
              mt: { xs: '10px', sm: '0' },
              ml: { xs: '0', sm: '10px' },
            }}
          >
            PIMSMART
          </Typography>
        </Box>
      </LogoContainer>

      {isMobile ? (
        <>
          <IconButton
            edge="start"
            color="inherit"
            onClick={toggleDrawer(true)}
            aria-label="menu"
            sx={{ marginTop: '20px' }}
          >
            <MenuIcon />
          </IconButton>
          <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
            <Box
              sx={{ width: 250 }}
              role="presentation"
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
            >
              <List>
                {navItems.map(({ href, text, onClick }, index) => (
                  <ListItem
                    button
                    key={index}
                    component={Link}
                    href={href}
                    onClick={onClick ? onClick : undefined}
                  >
                    <ListItemText primary={text} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>
        </>
      ) : (
        <Box display="flex" gap={2}>
          {navItems.map(({ href, text, onClick }, index) => (
            <Typography
              key={index}
              variant="h6"
              color="white"
              component="a"
              href={href}
              onClick={onClick ? onClick : undefined}
              sx={{ textDecoration: 'none', fontSize: { sm: '1rem', md: '2rem' }, marginLeft: '10px' }}
            >
              {text}
            </Typography>
          ))}
        </Box>
      )}
    </NavbarContainer>
  );
};

export default Navbar;
