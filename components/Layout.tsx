import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Content from './Content';

interface LayoutProps {
  children: React.ReactNode;
  sidebarItems?: { text: string; hook: () => void }[]; // Updated hook type
  contentTitle?: string; // Make contentTitle optional
}

const Layout: React.FC<LayoutProps> = ({ children, sidebarItems, contentTitle }) => {
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Navbar />
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          <Grid container sx={{ flexGrow: 1, maxWidth: '100%' }}>
            {sidebarItems && sidebarItems.length > 0 && (
              <Grid item xs={2}>
                <Sidebar items={sidebarItems} />
              </Grid>
            )}
            <Grid item xs={sidebarItems && sidebarItems.length > 0 ? 10 : 12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
              <Content title={contentTitle}>{children}</Content>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Layout;
