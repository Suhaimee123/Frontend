import React from 'react';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface SidebarProps {
  items: { 
    text: string; 
    hook: () => void; 
    id: string; // Added an id property for better key assignment
  }[];
}

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  return (
    <Box
      sx={{
        backgroundColor: '#2b485f',
        height: '100vh',
        minWidth: 200,  // Set a minimum width
        maxWidth: 250,  // Set a maximum width (optional)
        paddingRight: 1, // Optional: Add padding to the right side
      }}
    >
      <List>
        {items.map((item) => (
          <ListItem button key={item.id} onClick={item.hook} aria-label={item.text}>
            <ListItemText 
              primary={
                <Typography sx={{ fontSize: '18px', color: 'white' }}>
                  {item.text}
                </Typography>
              } 
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
