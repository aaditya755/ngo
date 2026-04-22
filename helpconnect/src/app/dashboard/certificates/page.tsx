"use client";
import { FileText, Download } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

export default function CertificatesPage() {
  const { data: session } = useSession();

  const handleDownload = async () => {
    const res = await fetch("/api/certificates/generate");
    if (!res.ok) { alert("Could not generate certificate. Make sure you have logged hours."); return; }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "helpconnect-certificate.pdf"; a.click();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>Impact Certificates</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>Download your volunteer impact certificate</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl overflow-hidden border-4" style={{ borderColor: "var(--green-mid)" }}>
        {/* Certificate Preview */}
        <div className="p-12 text-center" style={{ background: "linear-gradient(135deg, #E8F5E9 0%, #ffffff 100%)" }}>
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6" style={{ background: "var(--green-dark)" }}>
            <FileText size={36} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--green-dark)" }}>
            Certificate of Service
          </h2>
          <p className="text-lg mb-1" style={{ color: "var(--muted)" }}>This certifies that</p>
          <p className="text-2xl font-bold mb-1" style={{ color: "var(--ink)", fontFamily: "Plus Jakarta Sans" }}>
            {session?.user?.name ?? "Volunteer"}
          </p>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            has contributed their time and skills to the HelpConnect community
          </p>
          <div className="flex justify-center gap-8 mt-8 pt-6 border-t" style={{ borderColor: "var(--green-pale)" }}>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: "var(--green-dark)", fontFamily: "Plus Jakarta Sans" }}>—</div>
              <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>Hours Served</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: "var(--green-dark)", fontFamily: "Plus Jakarta Sans" }}>—</div>
              <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>Tasks Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: "var(--green-dark)", fontFamily: "Plus Jakarta Sans" }}>—</div>
              <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>Points Earned</div>
            </div>
          </div>
          <div className="mt-6 text-xs font-semibold" style={{ color: "var(--green-mid)", fontFamily: "JetBrains Mono" }}>
            Powered by HelpConnect v3.0 · Sahyog Foundation
          </div>
        </div>

        <div className="px-8 py-5 border-t flex gap-3" style={{ borderColor: "var(--green-light)", background: "white" }}>
          <button onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            style={{ background: "var(--green-dark)" }}>
            <Download size={16} /> Download PDF
          </button>
        </div>
      </motion.div>
    </div>
  );
}
