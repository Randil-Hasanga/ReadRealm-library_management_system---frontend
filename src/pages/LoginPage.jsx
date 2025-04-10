import React, { useState } from 'react';
import BackgroundImg from '../assets/books-arrangement-with-copy-space.jpg';
import LogoColored from '../assets/Logo.png';
import AuthService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const status = await AuthService.login({email, password})

    if(status == 201){
        navigate('/dashboard')
    }
  };

  return (
    <div
      className="min-h-screen flex items-center p-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${BackgroundImg})` }}
    >
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