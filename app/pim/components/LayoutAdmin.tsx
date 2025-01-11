import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Navbar from './Navbar';
import Content from './Content';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  sidebarItems?: { text: string; hook: () => void; id: string }[]; // Added id here
  contentTitle?: string;
}

const LayoutAdmin: React.FC<LayoutProps> = ({ children, sidebarItems, contentTitle }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    console.log("Checking authentication...");
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('token'); // Retrieve token
      console.log("Token:", token); // Log the token
      if (!token) {
        console.log("No token found, redirecting to login...");
        router.push('/pim/login'); // Redirect if token is not found
      } else {
        console.log("Token found, setting authenticated state.");
        setIsAuthenticated(true); // Set the authenticated state
      }
    }
  }, [router]);

  if (isAuthenticated === null) return <div>Loading...</div>; // Show loading until auth check is done
  if (!isAuthenticated) return null; // Render nothing if not authenticated

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Navbar />
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          <Grid container sx={{ flexGrow: 1, maxWidth: '100%' }}>
            {/* Sidebar */}
            {sidebarItems && sidebarItems.length > 0 && (
              <Grid
                item
                xs={2}   // ให้ Sidebar ใช้ 2/12 ในทุกขนาด
                sm={2}   // ให้ Sidebar ใช้ 2/12 ในทุกขนาด
                md={2}   // ให้ Sidebar ใช้ 2/12 ในทุกขนาด
                // sx={{
                //   minWidth: 200,
                //   maxWidth: 250,
                //   flexShrink: 0, // ป้องกันไม่ให้ Sidebar หดตัว
                // }}
              >
                <Sidebar items={sidebarItems} />
              </Grid>
            )}
            {/* Content */}
            <Grid
              item
              xs={9}  
              sm={9}  
              md={9}  
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                marginLeft: '50px',
                flexGrow: 1, // ให้ Content ยืดเต็มพื้นที่ที่เหลือ
              }}
            >
              <Content title={contentTitle}>{children}</Content>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default LayoutAdmin;
