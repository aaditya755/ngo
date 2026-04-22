"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal } from "lucide-react";

interface LeaderEntry { id: string; userId: string; totalPoints: number; totalHours: number; user: { name: string; image: string | null }; badges: { badge: { emoji: string; name: string } }[] }

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/volunteers/leaderboard").then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, []);

  const rankClass = (i: number) => i === 0 ? "rank-gold" : i === 1 ? "rank-silver" : i === 2 ? "rank-bronze" : "glass";
  const rankEmoji = (i: number) => i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>
          <Trophy size={28} style={{ color: "var(--amber)" }} /> Volunteer Leaderboard
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>Top volunteers by points this all-time</p>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: "var(--green-pale)" }} />)}</div>
      ) : data.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <Trophy size={40} className="mx-auto mb-4" style={{ color: "var(--muted)" }} />
          <p className="font-bold" style={{ color: "var(--ink)" }}>No volunteers yet</p>
          <p className="text-sm" style={{ color: "var(--muted)" }}>Complete tasks to earn points and appear here!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((v, i) => (
            <motion.div key={v.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
              className={`rounded-2xl p-4 flex items-center gap-4 ${rankClass(i)}`}>
              <div className="text-2xl w-10 text-center font-bold">{rankEmoji(i)}</div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                style={{ background: "var(--green-dark)" }}>
                {v.user.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="flex-1">
                <p className="font-bold" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>{v.user.name}</p>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {v.badges.slice(0, 3).map(b => (
                    <span key={b.badge.name} className="text-xs px-1.5 py-0.5 rounded-full border" style={{ borderColor: "var(--green-light)", background: "var(--green-pale)" }}>
                      {b.badge.emoji} {b.badge.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-extrabold" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--green-dark)" }}>{v.totalPoints}</div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>pts · {v.totalHours}h</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
