import React from 'react';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme, useMediaQuery, Box } from "@mui/material";

interface SidebarProps {
  items: { text: string; hook: () => void }[];
}

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const toggleDrawer = (open: boolean) => () => {
        setDrawerOpen(open);
    };

    const handleItemClick = (hook: () => void) => {
        hook(); // เรียกฟังก์ชัน hook ที่ส่งมาจาก props
        if (isMobile) {
            setDrawerOpen(false); // ปิด Drawer เมื่ออยู่ในโหมดมือถือ
        }
    };
    return (
        <>
            {/* Mobile Menu Icon */}
            {isMobile && (
                <Box display="flex" justifyContent="flex-end" p={2}>
                    <IconButton onClick={toggleDrawer(true)} color="inherit">
                        <MenuIcon />
                    </IconButton>
                </Box>
            )}

            {/* Drawer for Mobile */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
                <List>
                    {items.map((item, index) => (
                        <ListItem button key={index} onClick={() => handleItemClick(item.hook)}>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            {/* Sidebar for Desktop */}
            {!isMobile && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <List>
                        {items.map((item, index) => (
                            <ListItem button key={index} onClick={item.hook}>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
        </>
    );
};

export default Sidebar;
