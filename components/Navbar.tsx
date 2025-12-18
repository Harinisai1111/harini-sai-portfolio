
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import ProfileDropdown from './ProfileDropdown';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 py-4 flex items-center justify-between ${isScrolled || isMenuOpen
            ? 'bg-neutral-950/95 backdrop-blur-xl shadow-2xl'
            : 'bg-gradient-to-b from-neutral-950/80 to-transparent'
          }`}
      >
        <div className="flex items-center gap-10">
          <div
            className="logo-arc cursor-pointer select-none leading-none pt-2"
            onClick={() => handleLinkClick('/')}
          >
            HARINI SAI
          </div>

          {/* Desktop Navigation Links */}
          <ul className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <button
                  onClick={() => onNavigate(link.path)}
                  className={`text-sm font-medium transition-colors hover:text-neutral-300 ${currentPath === link.path ? 'text-white underline underline-offset-4 decoration-red-600' : 'text-neutral-400'
                    }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-4">
          <ProfileDropdown />

          {/* Mobile Menu Toggle Button */}
          <button
            className="md:hidden p-2 text-white hover:bg-neutral-800 rounded-full transition-colors no-print"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[90] bg-neutral-950 pt-28 px-8 md:hidden overflow-y-auto"
          >
            <ul className="flex flex-col gap-8">
              {NAV_LINKS.map((link) => (
                <motion.li
                  key={link.path}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <button
                    onClick={() => handleLinkClick(link.path)}
                    className={`text-3xl font-black uppercase italic tracking-tighter transition-colors ${currentPath === link.path ? 'text-red-600' : 'text-neutral-400'
                      }`}
                  >
                    {link.label}
                  </button>
                </motion.li>
              ))}
              <motion.li
                className="pt-8 border-t border-neutral-900 flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="transform scale-150 origin-top">
                  <ProfileDropdown />
                </div>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
