import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar.jsx';
import { Footer } from './Footer.jsx';
import { AnimatedCursor } from './AnimatedCursor.jsx';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { Chatbot } from './Chatbot.jsx';

export function Layout() {
  const mainRef = useScrollReveal();

  return (
    <>
      <div className="page-bg" aria-hidden="true" />
      <AnimatedCursor />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <div ref={mainRef}>
        <main id="main-content" style={{ paddingTop: '0.5rem' }}>
          <Outlet />
        </main>
        <Footer />
      </div>
      <Chatbot />
    </>
  );
}
