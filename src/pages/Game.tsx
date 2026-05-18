import { useParams, Navigate } from 'react-router-dom';
import type { LevelKey } from '../data/countries';
import { useGameStore, isLevelUnlocked } from '../store/gameStore';
import { EasyRound } from '../rounds/EasyRound';
import { MediumRound } from '../rounds/MediumRound';
import { HardRound } from '../rounds/HardRound';

const VALID: LevelKey[] = ['easy', 'medium', 'hard'];

export function Game() {
  const { level } = useParams<{ level: string }>();
  const { mastered, settings } = useGameStore();
  if (!level || !VALID.includes(level as LevelKey)) {
    return <Navigate to="/" replace />;
  }
  const key = level as LevelKey;
  if (!isLevelUnlocked(key, mastered, settings.expandedPool)) {
    return <Navigate to="/" replace />;
  }
  if (key === 'easy') return <EasyRound />;
  if (key === 'medium') return <MediumRound />;
  return <HardRound />;
}
