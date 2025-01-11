"use client";

import React, { useState } from 'react';
import LayoutAdmin from '../components/LayoutAdmin';
import Dashboard from './Dashboard/Dashboard';
import { FormName, sidebarItems, SidebarItemWithChildren, useSidebarNavigation } from '../components/sidebarItems';
import { Box, Grid } from '@mui/material';
import Statistics from './Dashboard/Statistics';



const Page: React.FC = () => {
  const [selectedForm, setSelectedForm] = useState<FormName>('dashboard');

  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { handleSidebarClick, renderSidebarItems } = useSidebarNavigation(setSelectedForm, setExpandedItems);




  return (
    <LayoutAdmin
      contentTitle="Dashboard"
      sidebarItems={renderSidebarItems} // ส่ง sidebarItems ที่เราสร้างขึ้น
    >
      <main>
        <Grid container spacing={2} sx={{ marginBottom : 10 }}>
          {/* Dashboard Section */}
          <Grid item xs={12}>
            <Box>
              <Dashboard />
            </Box>
          </Grid>

          {/* Statistics Section */}
          <Grid item xs={12}>
            <Box>
              <Statistics />
            </Box>
          </Grid>
        </Grid>
      </main>
    </LayoutAdmin>
  );
};

export default Page;
