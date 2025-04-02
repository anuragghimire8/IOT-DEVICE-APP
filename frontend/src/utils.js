import { toast } from 'react-toastify';

// Default toast configuration
const toastConfig = {
  position: 'top-right',
  autoClose: 5000,  // Automatically closes after 5 seconds
  hideProgressBar: false,  // Show progress bar
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

// Success toast handler
export const handleSuccess = (msg) => {
    toast.success(msg, toastConfig);
};

// Error toast handler
export const handleError = (msg) => {
    toast.error(msg, toastConfig);
};
