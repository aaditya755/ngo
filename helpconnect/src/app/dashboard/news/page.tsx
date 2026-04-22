"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Newspaper, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface NewsItem { id: string; title: string; content: string; author: { name: string }; createdAt: string; category: string }

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news").then(r => r.json()).then(d => { setNews(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>
          <Newspaper size={28} style={{ color: "var(--green-dark)" }} /> Field Updates & News
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>Latest from the field and community</p>
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ background: "var(--green-pale)" }} />)}</div>
      ) : news.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <Newspaper size={40} className="mx-auto mb-4" style={{ color: "var(--muted)" }} />
          <p className="font-bold text-lg" style={{ color: "var(--ink)" }}>No news yet</p>
          <p className="text-sm" style={{ color: "var(--muted)" }}>Field updates and community news will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {news.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="glass rounded-2xl p-6 hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full badge-low mb-2 inline-block">{item.category}</span>
                  <h2 className="font-bold text-lg leading-snug mt-1" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>{item.title}</h2>
                  <p className="text-sm mt-2 line-clamp-2 leading-relaxed" style={{ color: "var(--muted)" }}>{item.content}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs" style={{ color: "var(--muted)" }}>
                    <span className="flex items-center gap-1"><Calendar size={11} /> {formatDate(item.createdAt)}</span>
                    <span>by {item.author.name}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
