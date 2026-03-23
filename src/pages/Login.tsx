import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signInWithDiscordAnonymous } from '../firebase';
import { Shield } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { motion } from 'motion/react';

export default function Login() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (!loading && user) {
      if (!profile) {
        navigate('/invite');
      } else {
        navigate('/');
      }
    }
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Allow messages from same origin
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === 'DISCORD_AUTH_SUCCESS') {
        const discordProfile = event.data.profile;
        try {
          localStorage.setItem('discord_profile', JSON.stringify(discordProfile));
          await signInWithDiscordAnonymous();
        } catch (error) {
          console.error(error);
          setAuthError('Failed to sign in securely. Please try again.');
        }
      } else if (event.data?.type === 'DISCORD_AUTH_ERROR') {
        setAuthError('Discord authentication failed.');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleDiscordLogin = () => {
    setAuthError('');
    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
    if (!clientId) {
      setAuthError("VITE_DISCORD_CLIENT_ID is missing. Please set it in your environment variables.");
      return;
    }
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`);
    const url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=identify%20email`;
    
    const authWindow = window.open(url, 'discord_oauth', 'width=500,height=700');
    if (!authWindow) {
      setAuthError('Please allow popups to sign in with Discord.');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F5F5F0]">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F0]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl border border-gray-200 text-center"
      >
        <div className="w-20 h-20 bg-[#004225] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Shield className="w-10 h-10 text-[#D4AF37]" />
        </div>
        <h1 className="text-3xl font-bold text-[#004225] mb-2">Goodwood RBLX</h1>
        <p className="text-gray-500 mb-8 uppercase tracking-widest text-sm font-semibold">Moderator Academy</p>
        
        <p className="text-gray-600 mb-8">
          Welcome to the official training portal for Goodwood RBLX moderators. Please sign in to continue.
        </p>

        {authError && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {authError}
          </div>
        )}

        <Button 
          onClick={handleDiscordLogin} 
          className="w-full h-12 text-lg font-medium bg-[#5865F2] hover:bg-[#4752C4] text-white flex items-center justify-center gap-3 transition-colors"
        >
          <svg className="w-6 h-6" viewBox="0 0 127.14 96.36" fill="currentColor">
            <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.33,46,96.22,53,91.08,65.69,84.69,65.69Z"/>
          </svg>
          Login with Discord
        </Button>
      </motion.div>
    </div>
  );
}

