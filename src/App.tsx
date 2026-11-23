import { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Statement from './components/Statement';
import Businesses from './components/Businesses';
import Milestones from './components/Milestones';
import Footer from './components/Footer';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Motion is loaded after the page is interactive, so content never waits for it.
  useEffect(() => {
    let dispose: (() => void) | undefined;
    let cancelled = false;
    import('./motion').then((m) => { if (!cancelled) dispose = m.initMotion(); });
    return () => { cancelled = true; dispose?.(); };
  }, []);

  return (
    <>
      <Header open={menuOpen} setOpen={setMenuOpen} />
      <main>
        <Hero />
        <Statement />
        <Businesses />
        <Milestones />
      </main>
      <Footer />
      <div className="cursor" data-cursor-el aria-hidden="true"><span /></div>
    </>
  );
}
