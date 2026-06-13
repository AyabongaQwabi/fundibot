'use client';

// Cross-tool session state stored in localStorage.
// Tools 1, 3, 6, and 7 read/write subject marks so students don't re-enter them.

export type SessionSubjectMark = { subject: string; percentage: number };

const KEY = 'fundibot_session';

type SessionData = {
  marks?: SessionSubjectMark[];
  selectedCourse?: string;
};

function load(): SessionData {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SessionData) : {};
  } catch {
    return {};
  }
}

function save(data: SessionData) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // storage may be unavailable
  }
}

export function getSessionMarks(): SessionSubjectMark[] {
  return load().marks ?? [];
}

export function saveSessionMarks(marks: SessionSubjectMark[]) {
  save({ ...load(), marks });
}

export function getSessionCourse(): string {
  return load().selectedCourse ?? '';
}

export function saveSessionCourse(course: string) {
  save({ ...load(), selectedCourse: course });
}

export function clearSession() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(KEY);
  }
}
