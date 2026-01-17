import type { Metadata } from "next"
import "./globals.css"
import Providers from "@/components/Providers"
import LayoutWrapper from "@/components/layout/LayoutWrapper"

export const metadata: Metadata = {
  title: "INFPSVaastu - Vastu-Compliant Properties in India",
  description: "India's leading Vastu-compliant real estate marketplace. Find apartments, houses, villas, and plots with authentic Vastu verification. Buy, sell, or rent your sacred space.",
  keywords: "vastu, real estate, property, vastu-compliant homes, buy, sell, rent, apartments, houses, villas, plots, India, sacred spaces",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  )
}
