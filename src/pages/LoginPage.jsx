import React, { useState, useEffect } from 'react';
import BackgroundImg from '../assets/books-arrangement-with-copy-space.jpg';
import LogoColored from '../assets/Logo.png';
import AuthService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader'; // Import the Loader component
import '../styles/LoginPage.css'; // Import the CSS for transitions

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true); // State to track loading
  const [authLoading, setAuthLoading] = useState(false); // State to track login loading
  const [fadeOut, setFadeOut] = useState(false); // State to handle fade-out effect

  const navigate = useNavigate();

  // Fallback to stop loading after a timeout (in case onLoad doesn't fire)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000); // 5 seconds fallback timeout

    return () => clearTimeout(timeout); // Cleanup timeout on unmount
  }, []);

  const handleImageLoad = () => {
    setTimeout(() => {
      setFadeOut(true); // Trigger fade-out effect
      setTimeout(() => setLoading(false), 500); // Wait for fade-out animation to complete
    }, 100); // Small delay to ensure smooth transition
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true); // Show the loader during login
    try {
      const status = await AuthService.login({ email, password });
      if (status === 201) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setAuthLoading(false); // Hide the loader after login
    }
  };

  if (loading || authLoading) {
    return <div className={`loader-wrapper ${fadeOut ? 'fade-out' : ''}`}><Loader /></div>; // Add fade-out class
  }

  return (
    <div
      className="min-h-screen flex items-center p-6 bg-cover bg-center fade-in"
      style={{ backgroundImage: `url(${BackgroundImg})` }}
    >
      {/* Hidden image to detect when the background image is loaded */}
      <img
        src={BackgroundImg}
        alt="Background"
        className="hidden"
        onLoad={handleImageLoad}
      />

      <div className="bg-white/90 backdrop-blur-sm w-full max-w-md rounded-2xl shadow-xl p-8 border border-orange-300 ml-96 justify-start">
        <div className="flex items-center justify-center mb-6">
          <img src={LogoColored} alt="Logo" className="h-12 w-auto rounded-xl shadow" />
        </div>

        <h2 className="text-3xl font-bold text-orange-600 mb-1 text-center">Welcome Back</h2>
        <p className="text-gray-700 text-center mb-10">Log in to continue</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-sm text-orange-600 hover:text-orange-800 font-medium">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-md font-bold transition-colors"
          >
            Log in
          </button>
        </form>

        <p className="text-center text-sm text-gray-700 mt-8">
          Don't have an account?{' '}
          <button className="text-orange-600 hover:text-orange-800 font-semibold">Sign up</button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;