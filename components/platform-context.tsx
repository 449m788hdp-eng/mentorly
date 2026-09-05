'use client';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { tutors as baseTutors, defaultLists, type Tutor } from '@/lib/tutors';
import { translate, type Locale } from '@/lib/i18n';
export type Role = 'Student' | 'Tutor' | 'Admin';
export type Profile = {
  name: string;
  email: string;
  phone?: string;
  image?: string;
  role?: Role;
  subjects?: string[];
  budget?: number;
  format?: string;
  city?: string;
  goal?: string;
  onboarded?: boolean;
  notifications?: Record<string, boolean>;
  private?: boolean;
  blocked?: string[];
  viewed?: string[];
};
export type Message = {
  id: string;
  user_id: string;
  tutor_id: string;
  body: string;
  created_at: string;
};
export type Booking = {
  id: string;
  user_id: string;
  tutor_id: string;
  slot: string;
  created_at: string;
};
export type Review = {
  id: string;
  user_id: string;
  tutor_id: string;
  rating: number;
  body: string;
  name: string;
  created_at: string;
};
export type State = {
  profile: Profile | null;
  favorites: { tutor_id: string; list: string }[];
  lists: string[];
  messages: Message[];
  bookings: Booking[];
  tutors: Tutor[];
  reviews: Review[];
};
const empty: State = {
  profile: null,
  favorites: [],
  lists: defaultLists,
  messages: [],
  bookings: [],
  tutors: [],
  reviews: [],
};
type Context = {
  state: State;
  allTutors: Tutor[];
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  mutate: (
    b: Record<string, unknown>,
  ) => Promise<{ ok?: boolean; id?: string; error?: string }>;
  flash: (s: string) => void;
  auth: boolean;
  setAuth: (b: boolean) => void;
  locale: Locale;
  setLocale: (s: Locale) => void;
  t: (s: string) => string;
  theme: string;
  setTheme: (s: string) => void;
  requireProfile: () => boolean;
  favorite: (id: string, list?: string) => Promise<void>;
};
const C = createContext<Context>(null!);
export const usePlatform = () => useContext(C);
export function PlatformProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(empty),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(''),
    [notice, setNotice] = useState(''),
    [auth, setAuth] = useState(false);
  const locale = useSyncExternalStore(
    subscribePreferences,
    readLocale,
    () => 'uk' as Locale,
  );
  const theme = useSyncExternalStore(
    subscribePreferences,
    () => localStorage.getItem('mentorly.theme') || 'system',
    () => 'system',
  );
  const refresh = useCallback(async () => {
    try {
      const v = await fetchState();
      setState(v);
      setError('');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    let active = true;
    void fetchState()
      .then((v) => {
        if (active) {
          setState(v);
          setError('');
        }
      })
      .catch((e) => {
        if (active) setError((e as Error).message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)');
    const apply = () =>
      document.documentElement.classList.toggle(
        'dark',
        theme === 'dark' || (theme === 'system' && media.matches),
      );
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [theme]);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 4500);
    return () => clearTimeout(timer);
  }, [notice]);
  const mutate = useCallback(
    async (b: Record<string, unknown>) => {
      const r = await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(b),
      });
      const v = (await r.json()) as {
        ok?: boolean;
        id?: string;
        error?: string;
      };
      if (!r.ok) throw new Error(v.error || 'Не вдалося зберегти');
      await refresh();
      return v;
    },
    [refresh],
  );
  const requireProfile = () => {
    if (!state.profile) {
      setAuth(true);
      return false;
    }
    return true;
  };
  const favorite = async (id: string, list?: string) => {
    if (!requireProfile()) return;
    try {
      await mutate({
        action: 'favorite',
        tutorId: id,
        saved: list ? true : !state.favorites.some((f) => f.tutor_id === id),
        list,
      });
      setNotice(
        list
          ? 'Додано до списку'
          : state.favorites.some((f) => f.tutor_id === id)
            ? 'Видалено з обраного'
            : 'Збережено в обраних',
      );
    } catch (e) {
      setNotice((e as Error).message);
    }
  };
  const setLocale = (s: Locale) => {
    localStorage.setItem('mentorly.locale', s);
    window.dispatchEvent(new Event('mentorly.preferences'));
  };
  const setTheme = (s: string) => {
    localStorage.setItem('mentorly.theme', s);
    window.dispatchEvent(new Event('mentorly.preferences'));
  };
  return (
    <C.Provider
      value={{
        state,
        allTutors: [...baseTutors, ...state.tutors],
        loading,
        error,
        refresh,
        mutate,
        flash: setNotice,
        auth,
        setAuth,
        locale,
        setLocale,
        t: (s) => translate(locale, s),
        theme,
        setTheme,
        requireProfile,
        favorite,
      }}
    >
      {children}
      {notice && (
        <output className="notice">
          {notice}
          <button onClick={() => setNotice('')} aria-label="Закрити">
            ×
          </button>
        </output>
      )}
    </C.Provider>
  );
}

async function fetchState() {
  const r = await fetch('/api/state');
  const v = (await r.json()) as State & { error?: string };
  if (!r.ok) throw new Error(v.error || 'Не вдалося завантажити дані');
  return v;
}
function subscribePreferences(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('mentorly.preferences', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('mentorly.preferences', callback);
  };
}
function readLocale(): Locale {
  const value = localStorage.getItem('mentorly.locale');
  return value === 'en' || value === 'pl' ? value : 'uk';
}
