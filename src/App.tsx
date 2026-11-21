import { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Statement from './components/Statement';
import Businesses from './components/Businesses';
import Identity from './components/Identity';
import Capabilities from './components/Capabilities';
import Milestones from './components/Milestones';
import Enquiry from './components/Enquiry';
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
        <Identity />
        <Capabilities />
        <Milestones />
        <Enquiry />
      </main>
      <Footer />
    </>
  );
}
