import React, { useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FiCalendar, FiDownload, FiX, FiZap, FiActivity,
} from "react-icons/fi";
import { toPng } from "html-to-image";
import saveAs from "file-saver";
import { api } from "../lib/api";
import { USE_MOCK, mockProfileStats } from "../lib/mockData";
import { useAuth } from "../context/useAuth";
import SkeletonCard from "../components/SkeletonCard";

const fd = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
});

const Profile = () => {
  const { user } = useAuth();
  const cardRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const profileQ = useQuery({
    queryKey: ["profile-stats"],
    queryFn: async () => {
      if (USE_MOCK) return mockProfileStats;
      const res = await api.get("/api/profile/stats");
      return res.data.data;
    },
  });

  const stats = profileQ.data || {};
  const currentXP = stats.totalPoints || 0;
  const level = Math.floor(currentXP / 500) + 1;
  const xpInLevel = currentXP % 500;
  const xpPct = (xpInLevel / 500) * 100;

  const handleExport = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      await new Promise(r => setTimeout(r, 100));
      const url = await toPng(cardRef.current, {
        cacheBust: true,
        backgroundColor: "#050507",
        pixelRatio: 2,
        style: {
          borderRadius: "0px",
        }
      });
      saveAs(url, `${user?.username || "user"}-identity-card.png`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  if (profileQ.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <SkeletonCard className="w-full max-w-2xl h-[500px] !rounded-3xl" />
      </div>
    );
  }

  const difficulty = stats.difficultyBreakdown || {
    easy: { solved: 0, total: 0 },
    medium: { solved: 0, total: 0 },
    hard: { solved: 0, total: 0 },
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4">
      <div className="w-full max-w-3xl flex justify-end mb-6">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="btn-secondary flex items-center gap-2 text-xs font-black uppercase tracking-widest px-6 py-2.5 !rounded-xl"
        >
          <FiDownload /> {isExporting ? "Exporting..." : "Download Identity"}
        </button>
      </div>

      <motion.div
        ref={cardRef}
        {...fd(0)}
        className="relative w-full max-w-3xl overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-[#09090b] shadow-2xl"
        style={{
          boxShadow: "0 0 80px rgba(0,0,0,0.5), inset 0 0 40px rgba(var(--accent-rgb), 0.05)",
        }}
      >
        {/* Grid Background Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} 
        />
        
        {/* Top Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />

        <div className="relative p-8 md:p-12">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
            {/* Avatar Box */}
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-black border-2 border-accent/20 flex items-center justify-center text-5xl font-black text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-50" />
                <span className="relative z-10">{user?.username?.[0]?.toUpperCase() || "C"}</span>
                {/* Scanline effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent h-1/2 w-full animate-scan pointer-events-none" />
              </div>
              {/* Status Indicator */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-[#09090b] shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
            </div>

            {/* User Details */}
            <div className="flex-1 text-center md:text-left pt-2">
              <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{user?.username || "Operative"}</h1>
                <div className="p-1.5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer hidden md:flex">
                  <FiX className="text-tertiary" size={16} />
                </div>
              </div>
              <p className="text-lg italic text-secondary mb-6 font-medium">"Expert Algorithmist"</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <div className="px-4 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  {user?.role === "admin" ? "ADMINISTRATOR" : user?.role === "chief" ? "CLAN CHIEF" : "ELITE CODER"}
                </div>
                <div className="px-4 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-2">
                  <FiActivity size={12} />
                  ALPHA CODERS
                </div>
                <div className="px-4 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[10px] font-black uppercase tracking-widest text-purple-400 flex items-center gap-2">
                  <FiZap size={12} />
                  GDG SOA
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-white/[0.05] mb-10" />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Side: Level & Main Stats */}
            <div className="space-y-8">
              {/* Level Section */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-tertiary mb-3">Current Level</p>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-4xl font-black text-white">Lv. {level}</span>
                  <span className="text-sm font-mono text-tertiary">{xpInLevel} <span className="text-white/20">/</span> 500 XP</span>
                </div>
                <div className="h-2 w-full bg-white/[0.03] border border-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPct}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-accent shadow-[0_0_15px_rgba(var(--accent-rgb),0.5)]"
                  />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center gap-2 group hover:bg-white/[0.04] transition-all">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                    <FiTarget size={20} />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-tertiary">Solved</p>
                    <p className="text-2xl font-black text-white">{stats.acceptedCount || 0}</p>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center gap-2 group hover:bg-white/[0.04] transition-all">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
                    <FiActivity size={20} />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-tertiary">Streak</p>
                    <p className="text-2xl font-black text-white">{stats.streak || 0} <span className="text-xs text-tertiary font-bold">Days</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Performance Matrix */}
            <div className="space-y-8">
              <div className="flex items-center gap-2 text-tertiary">
                <FiZap size={14} className="text-accent" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Performance Matrix</p>
              </div>

              <div className="space-y-6">
                {[
                  { label: "EASY", value: difficulty.easy.solved, total: Math.max(difficulty.easy.total, 1), color: "text-green-400", bg: "bg-green-500" },
                  { label: "MEDIUM", value: difficulty.medium.solved, total: Math.max(difficulty.medium.total, 1), color: "text-yellow-400", bg: "bg-yellow-500" },
                  { label: "HARD", value: difficulty.hard.solved, total: Math.max(difficulty.hard.total, 1), color: "text-red-400", bg: "bg-red-500" },
                ].map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black tracking-widest">
                      <span className={item.color}>{item.label}</span>
                      <span className="text-tertiary font-mono">{item.value} <span className="text-white/20">/</span> {item.total === 1 && item.value === 0 ? 0 : item.total}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.03] border border-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.value / item.total) * 100}%` }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                        className={`h-full ${item.bg} opacity-80`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-white/[0.05] my-10" />

          {/* Footer Info */}
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-tertiary">Metadata</p>
              <div className="flex items-center gap-2 text-secondary text-sm font-medium">
                <FiCalendar className="text-accent" />
                <span>Activated {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
            
            <div className="space-y-3 text-center md:text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-tertiary">Recent Honors</p>
              <p className="text-sm italic text-tertiary font-medium">No honors accumulated yet.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
