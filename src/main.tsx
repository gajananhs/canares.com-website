import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';

const root = document.getElementById('root')!;
// The production build is pre-rendered, so React attaches to the existing HTML.
if (root.firstElementChild) hydrateRoot(root, <App />);
else createRoot(root).render(<App />);
