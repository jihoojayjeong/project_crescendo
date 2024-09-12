import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../pages/loginPage';
import axios from 'axios';

jest.mock('axios');

describe('LoginPage', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    process.env = { ...originalEnv };
    delete window.location;
    window.location = { href: jest.fn() };
    axios.get.mockResolvedValue({ data: {} });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test('renders login button', async () => {
    render(<LoginPage />);
    expect(screen.getByText(/CAS Login/i)).toBeInTheDocument();
  });

  test('displays role selection in development environment', () => {
    process.env.NODE_ENV = 'development';
    render(<LoginPage />);
    expect(screen.getByLabelText(/Select Role/i)).toBeInTheDocument();
  });

  test('does not display role selection in production environment', () => {
    process.env.NODE_ENV = 'production';
    render(<LoginPage />);
    expect(screen.queryByLabelText(/Select Role/i)).not.toBeInTheDocument();
  });

  test('calls handleLogin and redirects to CAS login in production', () => {
    process.env.NODE_ENV = 'production';
    process.env.REACT_APP_CAS_LOGIN_URL = 'https://cas.vt.edu/login';
    render(<LoginPage />);
    fireEvent.click(screen.getByText(/CAS Login/i));
    expect(window.location.href).toBe('https://cas.vt.edu/login');
  });

  test('calls handleLogin and performs fake login in development', async () => {
    process.env.NODE_ENV = 'development';
    axios.post.mockResolvedValue({ data: { user: { role: 'student' } } });
    
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/Select Role/i), { target: { value: 'student' } });
    fireEvent.click(screen.getByText(/CAS Login/i));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/auth/fakeLogin', { role: 'student' });
      expect(window.location.href).toBe('http://localhost:3000/Dashboard');
    });
  });

  test('does not check session in development environment', async () => {
    process.env.NODE_ENV = 'development';
    
    render(<LoginPage />);

    await new Promise(resolve => setTimeout(resolve, 1000));

    expect(axios.get).not.toHaveBeenCalled();
  });
});
