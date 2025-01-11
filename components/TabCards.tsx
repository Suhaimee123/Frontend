import React from 'react';
import { Tabs, Tab, Box, Badge } from '@mui/material';

interface TabProps {
  label: React.ReactNode;  // เปลี่ยนจาก string เป็น ReactNode เพื่อรองรับ JSX หรือ HTML
  component: React.ReactNode;
  badge?: React.ReactNode; // Optional badge property
}

interface TabCardsProps {
  tabs: TabProps[];  // Use TabProps for each tab
  currentStep: number;
  onTabChange: (newStep: number) => void; // Function to change tabs
}

const TabCards: React.FC<TabCardsProps> = ({ tabs, currentStep, onTabChange }) => {
  return (
    <Box>
      <Tabs value={currentStep} onChange={(event, newValue) => onTabChange(newValue)} aria-label="tabs">
        {tabs.map((tab, index) => (
          <Tab 
            key={index} 
            label={
              <>
                {tab.label}
                {tab.badge && (
                  <Badge
                    color="error"
                    badgeContent={tab.badge}
                    sx={{ marginLeft: 1 }}
                  />
                )}
              </>
            } 
          />
        ))}
      </Tabs>
      <Box p={2}>
        {tabs[currentStep]?.component}
      </Box>
    </Box>
  );
};

export default TabCards;
