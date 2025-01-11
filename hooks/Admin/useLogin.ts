import { useState, useCallback } from 'react';
import { Login } from '@/types/Admin/Admin';
import { loginApi } from '@/app/api/Admin/loginService';

// Function to encode password to Base64
const encodePassword = (password: string) => {
  // Convert string to a UTF-8 encoded format before encoding to Base64
  const utf8Bytes = new TextEncoder().encode(password);
  // Convert Uint8Array to a regular array
  const binaryString = String.fromCharCode(...Array.from(utf8Bytes));
  return btoa(binaryString);
};

const useLogin = () => {
  const [formData, setFormData] = useState<Login>({ email: '', password: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const validateInput = () => {
    if (!formData.email || !formData.password) {
      setError('Email and Password are required');
      return false;
    }
    // Add any additional validation logic here (e.g., email format check)
    return true;
  };

  const loginUser = async () => {
    setLoading(true);
    setError(null);

    // Validate input before API call
    if (!validateInput()) {
      setLoading(false);
      return { success: false, message: 'Validation failed: Email and Password are required' };
    }

    try {
      // Ensure password is defined and encode it
      if (formData.password) {
        const encodedPassword = encodePassword(formData.password);
        const response = await loginApi({ ...formData, password: encodedPassword }); // Send encoded password

        if (response.success) {
          sessionStorage.setItem('userEmail', formData.email || '');
          sessionStorage.setItem('token', response.data?.token || '');
          setFormData({ email: '', password: '' }); // Reset form data on success
          return response;

          
        } else {
          return { success: false, message: response.message || 'Invalid credentials' };
        }
      } else {
        return { success: false, message: 'Password is required' };
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Something went wrong';
      setError(errorMessage);
      return { success: false, message: errorMessage }; // Return error response
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    handleChange,
    loginUser,
  };
};

export default useLogin;
