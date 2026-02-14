"use client";

import { motion } from "framer-motion";
import { Banknote, Users, Activity } from "lucide-react";

export function StatsSection() {
  return (
    <div className="relative z-10 flex flex-col gap-4 mt-auto max-w-sm ml-auto mr-8 mb-8">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="stats-glass rounded-2xl p-5 hover:-translate-x-2 transition duration-500 group cursor-default"
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1 text-slate-500 dark:text-indigo-200/70">
              Total Institutions
            </p>
            <div className="text-2xl font-bold text-[#0F172A] dark:text-white">
              500+
            </div>
          </div>
          <div className="p-1.5 rounded-lg group-hover:bg-opacity-20 transition bg-indigo-50 group-hover:bg-indigo-100 dark:bg-white/5">
            <Banknote className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
          </div>
        </div>
        <div className="w-full h-1 mt-3 rounded-full overflow-hidden bg-slate-100 dark:bg-white/10">
          <div className="bg-indigo-400 h-full w-[75%]" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: -24 }}
        transition={{ delay: 0.6 }}
        className="stats-glass rounded-2xl p-5 hover:translate-x-[-32px] transition duration-500 group cursor-default"
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1 text-slate-500 dark:text-indigo-200/70">
              Active Users
            </p>
            <div className="text-2xl font-bold text-[#0F172A] dark:text-white">
              2.5M
            </div>
          </div>
          <div className="p-1.5 rounded-lg group-hover:bg-opacity-20 transition bg-indigo-50 group-hover:bg-indigo-100 dark:bg-white/5">
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
          </div>
        </div>
        <div className="mt-2 text-[10px] flex items-center gap-1.5 text-indigo-600 font-semibold dark:text-indigo-300/60 dark:font-normal">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          Live Tracking
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: -48 }}
        transition={{ delay: 0.7 }}
        className="stats-glass rounded-2xl p-5 hover:translate-x-[-56px] transition duration-500 group cursor-default"
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1 text-slate-500 dark:text-indigo-200/70">
              System Status
            </p>
            <div className="text-2xl font-bold text-[#0F172A] dark:text-white">
              100%
            </div>
          </div>
          <div className="p-1.5 rounded-lg group-hover:bg-opacity-20 transition bg-emerald-50 group-hover:bg-emerald-100 dark:bg-white/5">
            <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
