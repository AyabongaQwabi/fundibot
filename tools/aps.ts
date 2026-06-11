import type { SubjectMark } from './types';

const LIFE_ORIENTATION_PATTERN = /life\s*orientation/i;

/** NSC percentage → APS points (7-point scale). */
export function percentageToAps(pct: number): number {
  if (pct >= 90) return 7;
  if (pct >= 80) return 6;
  if (pct >= 70) return 5;
  if (pct >= 60) return 4;
  if (pct >= 50) return 3;
  if (pct >= 40) return 2;
  if (pct >= 30) return 1;
  return 0;
}

function isLifeOrientation(subject: string): boolean {
  return LIFE_ORIENTATION_PATTERN.test(subject);
}

/** Sum APS across best 6 subjects; optionally cap Life Orientation at 4 points. */
export function calcAps(
  marks: SubjectMark[],
  capLifeOrientation = true,
): number {
  const valid = marks.filter(
    (m) => m.subject.trim() && m.percentage >= 0 && m.percentage <= 100,
  );

  const scored = valid.map((m) => {
    let points = percentageToAps(m.percentage);
    if (capLifeOrientation && isLifeOrientation(m.subject)) {
      points = Math.min(points, 4);
    }
    return { ...m, points, isLo: isLifeOrientation(m.subject) };
  });

  // Best 6 subjects — exclude LO from the count of 6 when capped
  const withoutLo = scored.filter((s) => !s.isLo);
  const loEntries = scored.filter((s) => s.isLo);

  const pool =
    capLifeOrientation && loEntries.length > 0
      ? [...withoutLo.sort((a, b) => b.points - a.points).slice(0, 5), ...loEntries]
      : scored.sort((a, b) => b.points - a.points).slice(0, 6);

  const best6 =
    capLifeOrientation && loEntries.length > 0
      ? pool.slice(0, 6)
      : scored.sort((a, b) => b.points - a.points).slice(0, 6);

  return best6.reduce((sum, s) => sum + s.points, 0);
}
