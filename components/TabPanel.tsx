import React from 'react';
import { Box } from '@mui/material';

interface TabPanelProps {
  index: number;
  value: number;
  children: React.ReactNode;
}

const TabPanel: React.FC<TabPanelProps> = ({ index, value, children }) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      p={3}
    >
      {value === index && <>{children}</>}
    </Box>
  );
};

export default TabPanel;
