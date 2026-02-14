"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { School } from "lucide-react";
import { authClient } from "@workspace/auth/client";
import { toast } from "sonner";

import { AuthForm } from "../form/auth-form";
import { StatsSection } from "../components/stats-section";

const bengalPatternDark = `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`;
const bengalPatternLight = `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`;

export function AuthView() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Invalid credentials");
      } else {
        toast.success("Welcome back!");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex h-screen overflow-hidden font-sans selection:bg-indigo-600 selection:text-white flex-col md:flex-row bg-[#F0F4F8] dark:bg-[#0A0514] text-[#1E293B] dark:text-white">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .bengali-pattern {
          background-image: url("${bengalPatternLight}");
        }
        .dark .bengali-pattern {
          background-image: url("${bengalPatternDark}");
        }
        .stats-glass {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-top: 1px solid rgba(226, 232, 240, 0.8);
          border-left: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
        }
        .dark .stats-glass {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
          backdrop-filter: blur(10px);
          border: none;
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          border-left: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
        }
        .frosted-glass {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255,255,255,0.5);
        }
        .dark .frosted-glass {
          background: rgba(20, 15, 35, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 80px -20px rgba(109, 40, 217, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
        }
      `,
        }}
      />

      {/* Hero Section (55%) */}
      <div className="hidden md:flex md:w-[55%] relative flex-col justify-between p-10 lg:p-14 overflow-hidden bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE] dark:from-[#1e1b4b] dark:via-[#0F0B1E] dark:to-[#000000]">
        <div className="absolute inset-0 bengali-pattern opacity-100 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full filter blur-[150px] opacity-40 translate-x-1/2 -translate-y-1/2 bg-teal-100/40 dark:bg-indigo-900/20" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full filter blur-[120px] opacity-30 -translate-x-1/4 translate-y-1/4 bg-indigo-100/50 dark:bg-purple-900/10" />

        <div className="relative z-10 flex flex-col justify-start">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 backdrop-blur-md rounded-xl flex items-center justify-center border shadow-lg group hover:bg-opacity-20 transition-colors cursor-default bg-white/80 border-indigo-100 dark:bg-white/5 dark:border-white/10">
              <School className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
            </div>
            <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-indigo-900 dark:text-white/90">
              Shikhonary
            </h2>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl lg:text-6xl font-bold leading-[1.1] mb-4 tracking-tight text-[#0F172A] dark:text-white"
          >
            Global Control <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500 drop-shadow-sm dark:from-indigo-200 dark:via-purple-200 dark:to-indigo-400">
              Center
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg max-w-lg leading-relaxed text-slate-600 font-medium dark:text-indigo-200/80 dark:font-light"
          >
            Orchestrating the future of assessment. <br />
            Secure, scalable, and intelligent management for the modern
            enterprise.
          </motion.p>
        </div>

        <StatsSection />

        {/* Indicator dots */}
        <div className="absolute bottom-10 left-12 flex gap-2">
          <div className="w-16 h-1 rounded-full bg-indigo-900/20 dark:bg-white/20" />
          <div className="w-4 h-1 rounded-full bg-indigo-900/10 dark:bg-white/10" />
          <div className="w-4 h-1 rounded-full bg-indigo-900/10 dark:bg-white/10" />
        </div>
      </div>

      {/* Form Section (45%) */}
      <div className="w-full md:w-[45%] flex items-center justify-center p-6 relative bg-[#F5F7F8] dark:bg-[#0F0B1E]">
        <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full pointer-events-none filter blur-[80px] opacity-40 bg-teal-200/30 dark:bg-[#6D28D9]/20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none filter blur-[60px] bg-indigo-300/20 dark:bg-indigo-600/10" />

        <AuthForm
          isLoading={isLoading}
          onSubmit={handleAuth}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
        />

        <div className="absolute bottom-6 text-center w-full text-[10px] tracking-widest uppercase text-slate-400 dark:text-indigo-200/20">
          © {new Date().getFullYear()} Shikhonary Systems Inc. All rights
          reserved.
        </div>
      </div>
    </div>
  );
}
