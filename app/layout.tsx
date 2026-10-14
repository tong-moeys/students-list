import type { Metadata } from 'next';
import { Kantumruy_Pro, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';

const kantumruy = Kantumruy_Pro({
  subsets: ['khmer', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-kantumruy',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cambodia Student Information & Health Record System',
  description: 'Comprehensive student information, academic records, equity status, and health tracking system with Firestore authentication and cloud database.',
  openGraph: {
    title: 'Cambodia Student Information & Health Record System',
    description: 'Comprehensive student information, academic records, equity status, and health tracking system with Firestore authentication and cloud database.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cambodia Student Information & Health Record System',
    description: 'Comprehensive student information, academic records, equity status, and health tracking system with Firestore authentication and cloud database.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="km" className={`${kantumruy.variable} ${jakarta.variable}`}>
      <body className="antialiased bg-slate-50 text-slate-900 font-sans min-h-screen selection:bg-indigo-500 selection:text-white" suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
