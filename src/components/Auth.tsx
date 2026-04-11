import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, UserPlus, Mail, Lock, Loader2, ArrowRight, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthProps {
  onAuthSuccess: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 mb-6 shadow-2xl">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl rotate-12 flex items-center justify-center">
              <span className="text-white font-black text-xl -rotate-12">D</span>
            </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2 uppercase">DigiTaank</h1>
          <p className="text-zinc-500 font-medium uppercase tracking-widest text-[10px]">Agency Management Dashboard</p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-[40px] shadow-2xl">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Admin Login</h2>
            <p className="text-zinc-500 text-xs">Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="admin@digitaank.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-12 pr-5 py-4 text-sm text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-zinc-700 outline-none"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-12 pr-5 py-4 text-sm text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-zinc-700 outline-none"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-4 rounded-xl font-medium"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em]">
              DigiTaank AI Dashboard v1.0
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
