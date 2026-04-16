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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-slate-200 mb-6 shadow-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg rotate-12 flex items-center justify-center">
              <span className="text-white font-bold text-lg -rotate-12">D</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2 uppercase">DigiTaank</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Agency Management Dashboard</p>
        </div>

        <div className="bg-white border border-slate-200 p-8 rounded-[32px] shadow-2xl shadow-slate-200/50">
          <div className="mb-8 text-center">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Admin Login</h2>
            <p className="text-slate-500 text-xs">Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={16} />
                <input 
                  type="email" 
                  required
                  placeholder="admin@digitaank.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 transition-all placeholder:text-slate-300 outline-none"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={16} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 transition-all placeholder:text-slate-300 outline-none"
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
                  className="bg-red-50 border border-red-100 text-red-500 text-[10px] p-3 rounded-lg font-medium"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 disabled:from-primary-600/50 disabled:to-accent-600/50 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2 group text-xs uppercase tracking-widest"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-300 text-[9px] font-bold uppercase tracking-[0.2em]">
              DigiTaank AI Dashboard v1.0
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
