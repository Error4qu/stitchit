import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../components/theme-provider';
import { Navbar } from '../components/navbar';
import { Footer } from '../components/footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'StitchIt - Premium Online Cloth Tailoring',
  description: 'Browse exquisite fabric collections and clothing styles, place bespoke orders, and have master tailors visit your location for perfect measurements.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full`}>
      <body className="flex min-h-screen flex-col bg-[#F8F5F0] text-[#2D2D2D] dark:bg-[#0F1B2D] dark:text-[#F8F5F0] antialiased transition-colors duration-300">
        <ThemeProvider>
          <Navbar />
          <div className="flex-1 pt-20">
            {children}
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
