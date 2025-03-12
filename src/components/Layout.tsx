import React, { ReactNode } from 'react';
import { Wifi } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Wifi className="h-8 w-8 text-white" strokeWidth={1.5} />
          <h1 className="text-2xl font-light text-white">WiFi Scanner</h1>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 pb-20">
        {children}
      </main>
      
      {isHomePage && (
        <footer className="p-4 text-center text-sm text-white/70">
          <p>
            Made with <a href="https://www.chatandbuild.com" className="footer-link" target="_blank" rel="noopener noreferrer">chatandbuild.com</a>
          </p>
        </footer>
      )}
    </div>
  );
};

export default Layout;
