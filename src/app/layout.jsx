import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import MagicalCursor from '../components/MagicalCursor';
import ShootingStars from '../components/ShootingStars';
import { AuthProvider } from '../components/AuthContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'InsightX',
  description: 'Your trading companion',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-foreground relative`}>
        <AuthProvider>
          <MagicalCursor />
          <ShootingStars />
          <main className="container mx-auto px-4">
            {children}
          </main>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}