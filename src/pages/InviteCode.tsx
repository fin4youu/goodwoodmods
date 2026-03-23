import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Shield, KeyRound, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function InviteCode() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError('');

    try {
      const codeRef = doc(db, 'inviteCodes', code.trim().toUpperCase());
      const codeSnap = await getDoc(codeRef);

      if (!codeSnap.exists()) {
        setError('Invalid invite code. Please check and try again.');
        setLoading(false);
        return;
      }

      const codeData = codeSnap.data();
      if (codeData.usedBy) {
        setError('This invite code has already been used.');
        setLoading(false);
        return;
      }

      const discordProfileStr = localStorage.getItem('discord_profile');
      const discordProfile = discordProfileStr ? JSON.parse(discordProfileStr) : null;
      const email = discordProfile?.email || user.email || '';
      const displayName = discordProfile?.username || user.displayName || 'User';
      const photoURL = discordProfile?.avatar 
        ? `https://cdn.discordapp.com/avatars/${discordProfile.id}/${discordProfile.avatar}.png` 
        : (user.photoURL || '');

      // Assign role to user
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email,
        displayName,
        photoURL,
        role: codeData.roleToAssign,
        status: 'pending',
        currentModule: 0,
        testScore: 0,
        createdAt: Date.now(),
      });

      // Mark code as used
      await updateDoc(codeRef, {
        usedBy: user.uid,
        usedAt: Date.now(),
      });

      await refreshProfile();
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError('An error occurred while verifying the code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F0]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl border border-gray-200 text-center"
      >
        <div className="w-16 h-16 bg-[#004225] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <KeyRound className="w-8 h-8 text-[#D4AF37]" />
        </div>
        <h2 className="text-2xl font-bold text-[#004225] mb-2">Enter Invite Code</h2>
        <p className="text-gray-500 mb-8 text-sm">
          You need an invite code from a Goodwood RBLX Administrator to access the academy.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 flex items-center gap-2 text-sm text-left">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="e.g. GW-MOD-2026"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="text-center text-lg tracking-widest uppercase"
            required
          />
          <Button 
            type="submit" 
            disabled={loading || !code}
            className="w-full h-12 text-lg font-medium bg-[#004225] hover:bg-[#00331c] text-white"
          >
            {loading ? 'Verifying...' : 'Join Academy'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
