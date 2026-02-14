"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  MoveRight,
  ArrowRight,
} from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

interface AuthFormProps {
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
}

export function AuthForm({
  isLoading,
  onSubmit,
  email,
  setEmail,
  password,
  setPassword,
}: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-md frosted-glass rounded-3xl p-8 md:p-12 relative z-20"
    >
      {/* Badge */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border shadow-sm backdrop-blur-sm bg-white/60 border-white/40 dark:bg-black/30 dark:border-white/5 dark:shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
          <span className="w-2 h-2 rounded-full animate-pulse bg-indigo-600 dark:bg-[#6D28D9]" />
          <span className="font-bold text-[10px] uppercase tracking-[0.2em] text-indigo-900 dark:text-indigo-200">
            Super Admin Access
          </span>
        </div>
      </div>

      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold mb-3 tracking-tight text-[#0F172A] dark:text-white">
          Welcome back
        </h3>
        <p className="text-sm font-medium text-slate-500 dark:text-indigo-200/60">
          Enter your credentials to access the control panel.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2 group">
          <Label
            htmlFor="email"
            className="block text-xs font-bold uppercase tracking-wider ml-1 text-slate-500 dark:text-indigo-200/80"
          >
            Master ID
          </Label>
          <div className="relative transition-all duration-300 focus-within:scale-[1.02]">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <ShieldCheck className="transition-colors w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 dark:text-indigo-400/50 dark:group-focus-within:text-indigo-400" />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="admin@shikhonary.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-12 pr-4 py-6 border-slate-200 rounded-xl transition duration-300 shadow-inner bg-white text-[#0F172A] placeholder-slate-400 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] dark:bg-black/20 dark:border-white/10 dark:text-white dark:placeholder-indigo-300/20 dark:focus:ring-[#6D28D9]/40"
              required
            />
          </div>
        </div>

        <div className="space-y-2 group">
          <Label
            htmlFor="password"
            className="block text-xs font-bold uppercase tracking-wider ml-1 text-slate-500 dark:text-indigo-200/80"
          >
            Secure Key
          </Label>
          <div className="relative transition-all duration-300 focus-within:scale-[1.02]">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="transition-colors w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 dark:text-indigo-400/50 dark:group-focus-within:text-indigo-400" />
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-12 pr-12 py-6 border-slate-200 rounded-xl transition duration-300 shadow-inner bg-white text-[#0F172A] placeholder-slate-400 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] dark:bg-black/20 dark:border-white/10 dark:text-white dark:placeholder-indigo-300/20 dark:focus:ring-[#6D28D9]/40"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors text-slate-400 hover:text-indigo-600 dark:text-indigo-400/40 dark:hover:text-indigo-300"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm pt-2">
          <label className="flex items-center cursor-pointer group">
            <div className="relative">
              <input type="checkbox" className="peer sr-only" />
              <div className="h-4 w-4 border rounded transition-all border-slate-300 bg-white peer-checked:bg-indigo-600 peer-checked:border-indigo-600 dark:border-indigo-400/30 dark:bg-black/20 dark:peer-checked:bg-[#6D28D9] dark:peer-checked:border-[#6D28D9]" />
              <MoveRight className="text-white absolute inset-0 w-3 h-3 opacity-0 peer-checked:opacity-100 m-auto pointer-events-none" />
            </div>
            <span className="ml-2 text-xs transition-colors font-medium text-slate-500 group-hover:text-indigo-700 dark:text-indigo-200/60 dark:group-hover:text-indigo-200">
              Remember device
            </span>
          </label>
          <Link
            href="/forgot-password"
            className="text-xs font-bold underline underline-offset-4 transition-colors text-indigo-600 hover:text-indigo-800 decoration-indigo-200 hover:decoration-indigo-600 dark:text-indigo-300 dark:hover:text-white dark:decoration-indigo-500/30"
          >
            Forgot Key?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center py-4 px-4 rounded-xl text-white font-semibold transition-all duration-300 mt-4 overflow-hidden border border-indigo-500/20 shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] dark:border-white/10 dark:shadow-[0_10px_20px_-10px_rgba(109,40,217,0.5)] dark:hover:shadow-[0_20px_40px_-15px_rgba(109,40,217,0.6)] hover:-translate-y-1"
        >
          <div className="absolute inset-0 opacity-100 transition-opacity bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] dark:from-[#5b21b6} dark:to-[#7c3aed]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          <div className="relative flex items-center gap-3">
            <span className="tracking-wide text-white">
              {isLoading ? "Authenticating..." : "Authenticate"}
            </span>
            {!isLoading && (
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-white" />
            )}
          </div>
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-tighter text-slate-400 font-medium dark:text-indigo-300/40">
          <Lock className="w-3 h-3" />
          <span>AES-256 ENCRYPTED CONNECTION</span>
        </div>
      </div>
    </motion.div>
  );
}
