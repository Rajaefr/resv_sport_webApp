import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import RootLayoutClient from './root-layout-client'; // Import the client component

// Metadata for the entire application (Server Component)
export const metadata: Metadata = {
  title: 'OCP Sport',
  description: 'Application de gestion des réservations sportives OCP',
  icons: {
    icon: '/images/logo.png', // Path to your logo
  },
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}
