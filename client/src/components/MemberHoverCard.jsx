import React, { useState, useRef, useCallback, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  FiX, FiZap, FiTarget, FiStar, FiCode, FiAward,
  FiMapPin, FiGithub, FiTwitter, FiGlobe, FiLinkedin,
  FiCalendar, FiUsers, FiShield, FiCpu, FiActivity
} from "react-icons/fi";
import { api } from "../lib/api";

/* ── Difficulty Hex-Bar (Futuristic) ─────────────────────────────── */
const DiffHexBar = ({ label, solved, total, color }) => {
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
  return (
    <div className="relative group">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] opacity-80" style={{ color }}>{label}</span>
        <span className="text-[10px] font-mono tracking-wider" style={{ color }}>{solved}<span className="opacity-50">/{total}</span></span>
      </div>
      <div className="h-[6px] w-full rounded-sm bg-[#0A0A0F] border border-white/[0.05] overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PC9zdmc+')] opacity-20 z-10 pointer-events-none" />
        <motion.div
          className="h-full rounded-sm relative z-0"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: `linear-gradient(90deg, ${color}88, ${color})`, boxShadow: `0 0 10px ${color}40` }}
        >
           <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-r from-transparent to-white/30" />
        </motion.div>
      </div>
    </div>
  );
};

/* ── XP Level Calculator ─────────────────────────────────────────── */
const XP_PER_LEVEL = 500;
const getLevel = (xp) => Math.floor(xp / XP_PER_LEVEL) + 1;
const getLevelPct = (xp) => ((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100;

/* ── Full Profile Modal ───────────────────────────────── */
const MemberModal = ({ userId, username, onClose }) => {
  const profileQ = useQuery({
    queryKey: ["member-profile", userId || username],
    queryFn: async () => {
      try {
        const endpoint = userId
          ? `/api/profile/user/${userId}`
          : `/api/profile/username/${username}`;
        const res = await api.get(endpoint);
        return res.data.data;
      } catch {
        return null;
      }
    },
    enabled: !!(userId || username),
  });

  const p = profileQ.data;
  const xp = p?.totalPoints || 0;
  const level = getLevel(xp);
  const levelPct = getLevelPct(xp);
  const easy = p?.difficultyBreakdown?.easy || { solved: 0, total: 0 };
  const medium = p?.difficultyBreakdown?.medium || { solved: 0, total: 0 };
  const hard = p?.difficultyBreakdown?.hard || { solved: 0, total: 0 };

  return createPortal(
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
        style={{ background: "rgba(5, 5, 8, 0.85)", backdropFilter: "blur(16px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, rotateX: 15 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          exit={{ scale: 0.95, opacity: 0, rotateX: -15 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/10"
          style={{
            background: "linear-gradient(180deg, rgba(16, 16, 24, 0.95) 0%, rgba(10, 10, 16, 0.98) 100%)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.05) inset, 0 40px 80px -20px rgba(0,0,0,0.8), 0 0 60px rgba(var(--accent-rgb), 0.15)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cybernetic Accents */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-80" />
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-[60px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
          
          {/* Tech Grid Background */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
               style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-secondary hover:text-white hover:rotate-90 duration-300"
          >
            <FiX size={18} />
          </button>

          {profileQ.isLoading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-6">
              <div className="relative w-16 h-16">
                 <div className="absolute inset-0 border-2 border-accent/20 rounded-full animate-ping" />
                 <div className="absolute inset-2 border-2 border-t-accent rounded-full animate-spin" />
                 <FiCpu className="absolute inset-0 m-auto text-accent opacity-50" size={20} />
              </div>
              <p className="text-sm text-tertiary font-mono tracking-widest uppercase animate-pulse">Initializing Identity Protocol...</p>
            </div>
          ) : !p ? (
            <div className="p-20 text-center">
              <FiZap className="mx-auto text-red-500/50 mb-4" size={32} />
              <p className="text-secondary text-sm font-mono uppercase tracking-widest">Entity Not Found.</p>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col h-full">
              {/* Header Section */}
              <div className="p-8 pb-6 border-b border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
                  
                  {/* Avatar Hexagon Style */}
                  <div className="relative group shrink-0">
                    <div className="absolute -inset-1 bg-gradient-to-br from-accent to-purple-600 rounded-2xl blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
                    <div className="relative w-28 h-28 rounded-2xl p-[2px] bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl overflow-hidden">
                       <div className="w-full h-full rounded-[14px] overflow-hidden bg-[#0A0A0F] flex items-center justify-center">
                          {p.profilePicture ? (
                            <img src={p.profilePicture} alt="" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                          ) : (
                            <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-accent to-purple-400">
                              {(p.username || "?")[0].toUpperCase()}
                            </span>
                          )}
                       </div>
                    </div>
                    {/* Status Dot */}
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#0A0A0F] rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse" />
                    </div>
                  </div>

                  {/* Core Info */}
                  <div className="flex-1 text-center sm:text-left mt-2 sm:mt-0">
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-2">
                      <h2 className="text-3xl font-black text-white tracking-tight">{p.username}</h2>
                      {p.rank && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                          <FiAward className="text-yellow-400" size={14} />
                          <span className="text-xs font-black text-yellow-400">Global #{p.rank}</span>
                        </div>
                      )}
                    </div>
                    
                    {p.bio && <p className="text-sm text-secondary mb-4 max-w-md italic opacity-80">"{p.bio}"</p>}

                    {/* Roles & Affiliations */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent/10 border border-accent/20 text-[10px] font-black uppercase tracking-widest text-accent">
                        <FiShield size={12} /> {p.role === "admin" ? "Admin" : p.role === "clan-chief" ? "Clan Chief" : "Operative"}
                      </span>
                      {p.clan && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest text-blue-400">
                          <FiUsers size={12} /> {p.clan.name || "Clan Member"}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/70">
                        <img src="/gdg-logo.png" className="w-3 h-3 object-contain grayscale opacity-70" alt="GDG" /> GDG SOA
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Data Grid Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
                
                {/* Left Col: Stats & Level */}
                <div className="bg-[#0e0e15] p-8 space-y-8">
                   {/* Level System */}
                   <div>
                     <div className="flex items-end justify-between mb-2">
                       <div>
                         <p className="text-[10px] text-tertiary uppercase tracking-widest font-bold">Current Level</p>
                         <p className="text-2xl font-black text-white">Lv. <span className="text-accent">{level}</span></p>
                       </div>
                       <p className="text-xs font-mono text-secondary"><span className="text-white">{xp}</span> / {level * XP_PER_LEVEL} XP</p>
                     </div>
                     <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative">
                        <motion.div 
                          className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-accent to-purple-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${levelPct}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                        {/* Glitch highlight */}
                        <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-r from-transparent to-white/40 mix-blend-overlay animate-[shimmer_2s_infinite]" />
                     </div>
                   </div>

                   {/* Key Metrics */}
                   <div className="grid grid-cols-2 gap-4">
                     {[
                        { l: "Solved", v: p.acceptedCount || 0, c: "text-green-400", i: FiTarget },
                        { l: "Streak", v: `${p.streak || 0} Days`, c: "text-yellow-400", i: FiActivity },
                     ].map((stat, i) => (
                       <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-3 hover:bg-white/[0.04] transition-colors">
                          <div className={`p-2 rounded-lg bg-white/5 ${stat.c}`}>
                            <stat.i size={16} />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-tertiary mb-0.5">{stat.l}</p>
                            <p className="text-lg font-black text-white">{stat.v}</p>
                          </div>
                       </div>
                     ))}
                   </div>

                   {/* Personal Info */}
                   <div className="space-y-3">
                     <p className="text-[10px] text-tertiary uppercase tracking-widest font-bold mb-2">Metadata</p>
                     {p.branch && (
                        <div className="flex items-center gap-3 text-sm text-secondary">
                          <FiCode className="text-accent/70" />
                          <span>{p.branch} {p.year ? `· ${p.year}` : ""} {p.section ? `· Sec ${p.section}` : ""}</span>
                        </div>
                      )}
                      {p.location && (
                        <div className="flex items-center gap-3 text-sm text-secondary">
                          <FiMapPin className="text-accent/70" />
                          <span>{p.location}</span>
                        </div>
                      )}
                      {p.createdAt && (
                        <div className="flex items-center gap-3 text-sm text-secondary">
                          <FiCalendar className="text-accent/70" />
                          <span>Activated {new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                        </div>
                      )}
                   </div>
                </div>

                {/* Right Col: Performance & Links */}
                <div className="bg-[#0e0e15] p-8 space-y-8 flex flex-col justify-between">
                  {/* Difficulty Analytics */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <FiZap className="text-tertiary" size={14} />
                      <p className="text-[10px] text-tertiary uppercase tracking-[0.2em] font-bold">Performance Matrix</p>
                    </div>
                    <div className="space-y-4">
                      <DiffHexBar label="Easy" solved={easy.solved} total={easy.total} color="#4ade80" />
                      <DiffHexBar label="Medium" solved={medium.solved} total={medium.total} color="#facc15" />
                      <DiffHexBar label="Hard" solved={hard.solved} total={hard.total} color="#f87171" />
                    </div>
                  </div>

                  {/* Badges/Achievements (Placeholder for future) */}
                  <div>
                    <p className="text-[10px] text-tertiary uppercase tracking-widest font-bold mb-3">Recent Honors</p>
                    <div className="flex flex-wrap gap-2">
                       {p.badges?.length > 0 ? (
                         p.badges.slice(0, 4).map((b, i) => (
                           <div key={i} className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center tooltip-trigger" data-tip={b.name}>
                              {/* Assuming badge has icon or image, fallback to star */}
                              <FiStar className="text-purple-400" />
                           </div>
                         ))
                       ) : (
                         <span className="text-xs text-secondary/50 font-mono italic">No honors accumulated yet.</span>
                       )}
                    </div>
                  </div>

                  {/* Transmissions (Socials) */}
                  {(p.github || p.twitter || p.linkedin || p.website) && (
                    <div className="pt-4 border-t border-white/5">
                      <div className="flex flex-wrap gap-2">
                        {p.github && (
                          <a href={`https://github.com/${p.github}`} target="_blank" rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-white/5 text-secondary hover:text-white hover:bg-white/10 transition-colors">
                            <FiGithub size={16} />
                          </a>
                        )}
                        {p.linkedin && (
                          <a href={`https://linkedin.com/in/${p.linkedin}`} target="_blank" rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 transition-colors">
                            <FiLinkedin size={16} />
                          </a>
                        )}
                        {p.twitter && (
                          <a href={`https://twitter.com/${p.twitter}`} target="_blank" rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-sky-500/10 text-sky-400 hover:text-sky-300 hover:bg-sky-500/20 transition-colors">
                            <FiTwitter size={16} />
                          </a>
                        )}
                        {p.website && (
                          <a href={p.website} target="_blank" rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:text-green-300 hover:bg-green-500/20 transition-colors">
                            <FiGlobe size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

/* ── Smart Position Hover Tooltip ───────────────────────────────── */
const HoverTooltip = ({ data, onExpand, position }) => {
  const xp = data?.totalPoints || 0;
  const level = getLevel(xp);
  const easy = data?.difficultyBreakdown?.easy || { solved: 0, total: 0 };
  const medium = data?.difficultyBreakdown?.medium || { solved: 0, total: 0 };
  const hard = data?.difficultyBreakdown?.hard || { solved: 0, total: 0 };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: position.yOffset }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: position.yOffset, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="absolute z-[9999] w-72 rounded-[20px] overflow-hidden cursor-pointer backdrop-blur-xl"
      style={{
        top: position.top,
        left: position.left,
        background: "linear-gradient(145deg, rgba(16, 16, 24, 0.85) 0%, rgba(10, 10, 15, 0.95) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.8), 0 0 20px rgba(var(--accent-rgb), 0.1)",
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onExpand();
      }}
    >
      {/* Decorative Edges */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent/80 to-transparent" />
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/20 blur-[40px] rounded-full pointer-events-none" />

      <div className="p-5 flex flex-col gap-4 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-xl p-[1px] bg-gradient-to-br from-white/20 to-transparent">
               <div className="w-full h-full rounded-[11px] overflow-hidden bg-[#0a0a0f] flex items-center justify-center">
                 {data?.profilePicture ? (
                   <img src={data.profilePicture} alt="" className="w-full h-full object-cover" />
                 ) : (
                   <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-br from-accent to-purple-400">
                     {(data?.username || "?")[0].toUpperCase()}
                   </span>
                 )}
               </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#101018] rounded-full flex items-center justify-center">
               <div className="w-2 h-2 bg-green-500 rounded-full" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-base font-black text-white truncate">{data?.username}</p>
              {data?.role === "admin" && <FiShield className="text-accent shrink-0" size={12} />}
            </div>
            <div className="flex items-center gap-2">
               <span className="text-xs font-bold text-accent">Lv. {level}</span>
               <span className="text-[10px] text-tertiary font-mono">|</span>
               <span className="text-[10px] font-mono text-secondary">{xp} XP</span>
            </div>
          </div>
        </div>

        {/* Mini Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { l: "Easy", v: easy.solved, c: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
            { l: "Med", v: medium.solved, c: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
            { l: "Hard", v: hard.solved, c: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
          ].map((stat) => (
            <div key={stat.l} className={`flex flex-col items-center justify-center py-2 rounded-lg border ${stat.border} ${stat.bg}`}>
              <span className={`text-sm font-black ${stat.c}`}>{stat.v}</span>
              <span className="text-[8px] uppercase tracking-widest text-white/50">{stat.l}</span>
            </div>
          ))}
        </div>

        {/* Interaction Hint */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
           <span className="text-[9px] uppercase tracking-widest text-tertiary">Access Protocol</span>
           <span className="text-[10px] text-accent font-bold animate-pulse flex items-center gap-1">
             Expand <FiZap size={10} />
           </span>
        </div>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════
   MAIN WRAPPER COMPONENT
   ══════════════════════════════════════════════════════ */
const MemberHoverCard = ({ userId, username, children, className = "" }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0, yOffset: 10 });
  const triggerRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  const profileQ = useQuery({
    queryKey: ["member-hover", userId || username],
    queryFn: async () => {
      try {
        const endpoint = userId
          ? `/api/profile/user/${userId}`
          : `/api/profile/username/${username}`;
        const res = await api.get(endpoint);
        return res.data.data;
      } catch {
        return { username, totalPoints: 0, difficultyBreakdown: {} };
      }
    },
    enabled: (showTooltip || showModal) && !!(userId || username),
    staleTime: 60_000,
  });

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const tooltipWidth = 288; // w-72 = 18rem = 288px
    const tooltipHeight = 200; // estimated height
    const gap = 12;

    let top = rect.bottom + gap;
    let left = rect.left;
    let yOffset = -10; // Start slightly higher for animation

    // Check bottom boundary
    if (rect.bottom + tooltipHeight + gap > window.innerHeight) {
      // Place above
      top = rect.top - tooltipHeight - gap;
      yOffset = 10;
    }

    // Check right boundary
    if (left + tooltipWidth > window.innerWidth) {
      left = window.innerWidth - tooltipWidth - gap;
    }
    // Check left boundary
    if (left < gap) {
      left = gap;
    }

    setTooltipPos({ top, left, yOffset });
  }, []);

  const handleMouseEnter = useCallback(() => {
    clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      calculatePosition();
      setShowTooltip(true);
    }, 400); // Slight delay to prevent flashing when moving mouse quickly
  }, [calculatePosition]);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => setShowTooltip(false), 300);
  }, []);

  const handleTooltipEnter = useCallback(() => {
    clearTimeout(hoverTimeoutRef.current);
  }, []);

  const handleClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    clearTimeout(hoverTimeoutRef.current);
    setShowTooltip(false);
    setShowModal(true);
  }, []);

  // Recalculate on scroll/resize if tooltip is open
  useEffect(() => {
    if (!showTooltip) return;
    const updatePos = () => calculatePosition();
    window.addEventListener("scroll", updatePos, true);
    window.addEventListener("resize", updatePos);
    return () => {
      window.removeEventListener("scroll", updatePos, true);
      window.removeEventListener("resize", updatePos);
    };
  }, [showTooltip, calculatePosition]);

  return (
    <>
      <span
        ref={triggerRef}
        className={`relative inline-block cursor-pointer hover:text-accent transition-colors ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {children}
        {/* Subtle underline hover effect */}
        <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
      </span>

      {/* Tooltip portal */}
      {createPortal(
        <AnimatePresence>
          {showTooltip && !showModal && profileQ.data && (
            <div
              className="fixed inset-0 z-[9998] pointer-events-none"
              onMouseEnter={handleTooltipEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="pointer-events-auto">
                <HoverTooltip
                  data={profileQ.data}
                  position={tooltipPos}
                  onExpand={handleClick}
                />
              </div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Full modal */}
      {showModal && (
        <MemberModal
          userId={userId}
          username={username}
          onClose={(e) => {
            if(e) e.stopPropagation();
            setShowModal(false);
          }}
        />
      )}
    </>
  );
};

export default MemberHoverCard;

