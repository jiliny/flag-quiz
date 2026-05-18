import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Game } from './pages/Game';
import { Passport } from './pages/Passport';
import { Settings } from './pages/Settings';
import { BackgroundScene } from './components/BackgroundScene';
import { useGameStore } from './store/gameStore';
import { setSoundEnabled } from './lib/audio';

function App() {
  const sound = useGameStore((s) => s.settings.sound);

  useEffect(() => {
    setSoundEnabled(sound);
  }, [sound]);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <BackgroundScene />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:level" element={<Game />} />
        <Route path="/passport" element={<Passport />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
