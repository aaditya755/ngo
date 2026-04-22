import type { Metadata } from "next";
import "./theme.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "HelpConnect | NGO Volunteer Coordination Platform",
  description:
    "HelpConnect unifies NGOs, volunteers, donors, and field teams with live needs tracking, response workflows, and community operations dashboards.",
  keywords: ["NGO", "volunteer", "community", "helpconnect", "social impact"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
