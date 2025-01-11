import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect } from 'react';
import Box from '@mui/material/Box';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface AlertBoxProps {
  text: string;
  desc?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  timeoutDuration: number;
}

const getAlertIcon = (type: AlertBoxProps['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircleOutlineRoundedIcon sx={{ fontSize: "90px", color: '#00cc88' }} />;
    case 'error':
      return <ErrorOutlineIcon sx={{ fontSize: "90px", color: '#ff4444' }} />;
    case 'warning':
      return <WarningAmberIcon sx={{ fontSize: "90px", color: '#ffbb33' }} />;
    case 'info':
      return <InfoOutlinedIcon sx={{ fontSize: "90px", color: '#33b5e5' }} />;
  }
};

export default function AlertBox({ text, desc, type, isOpen, setIsOpen ,timeoutDuration }: AlertBoxProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, timeoutDuration); // Use custom timeoutDuration

      return () => clearTimeout(timer); // Clear timer if the component unmounts or isOpen changes
    }
  }, [isOpen, setIsOpen, timeoutDuration]); // Add timeoutDuration as a dependency


  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 flex items-center justify-center" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-50"
          leave="ease-in duration-200"
          leaveFrom="opacity-50"
          leaveTo="opacity-0"
        >
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1350,
            }}
          />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Box
            sx={{
              position: 'fixed',
              top: '30%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'white',
              borderRadius: 2,
              boxShadow: 3,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '250px',
              height: '250px',
              zIndex: 1390,
              // zIndex: 10000,
            }}
          >
            <Box mb={1}>
              {getAlertIcon(type)}
            </Box>

            <Box component="p" sx={{ fontSize: '1rem', fontWeight: 'bold', color: 'gray.900', textAlign: 'center' }}>
              {text}
            </Box>

            {desc && (
              <Box component="p" sx={{ fontSize: '1rem', color: 'gray.700', textAlign: 'center'}}>
                {desc}
              </Box>
            )}
          </Box>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
