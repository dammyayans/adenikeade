import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import CaseStudyPage from './pages/CaseStudy';
import { NotFound } from './pages/NotFound';
import { Nav } from './components/Nav';
import { Contact } from './components/Contact';
import { Stripe } from './components/Stripe';
import { useGround } from './hooks/useGround';
import { useScrollProgress } from './hooks/useScrollProgress';
import { useHead } from './hooks/useHead';

export default function App() {
  const { pathname, hash } = useLocation();
  useGround(pathname);
  useHead(pathname);
  const progress = useScrollProgress();

  // A new route starts at the top; an in-page hash keeps its anchor.
  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60]" aria-hidden="true">
        <div className="origin-left will-change-transform" style={{ transform: `scaleX(${Math.max(progress, 0.02)})` }}>
          <Stripe height={5} />
        </div>
      </div>

      <a href="#work" className="skip-link">Skip to work</a>

      <Nav />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<CaseStudyPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Stripe />
      <Contact />
    </>
  );
}
