'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback, type ReactNode } from 'react';
import {
  Compass,
  Sparkles,
  GraduationCap,
  Heart,
  User,
  Bell,
  MessageCircle,
  ArrowUpRight,
  Search,
  ArrowRight,
  SlidersHorizontal,
  X,
  Star,
  MapPin,
  Monitor,
  BadgeCheck,
  Check,
  Plus,
  ArrowLeft,
  CalendarDays,
  ShieldCheck,
  BookOpen,
  Sun,
  Globe,
  Settings,
  ChevronLeft,
  ChevronRight,
  Send,
  FileCheck,
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { usePlatform, type Profile } from './platform-context';
import {
  Brand,
  Picker,
  Field,
  CheckChoice,
  Modal,
  TutorCard,
  EmptyState,
  UploadField,
} from './platform-ui';
import {
  subjects,
  subjectIcons,
  filterTutors,
  type Tutor,
  type Filters,
} from '@/lib/tutors';
import type { Locale } from '@/lib/i18n';
const navItems = [
  ['/explore', 'Головна', Compass],
  ['/search', 'AI-пошук', Sparkles],
  ['/become-tutor', 'Стати репетитором', GraduationCap],
  ['/favorites', 'Обрані', Heart],
  ['/profile', 'Профіль', User],
] as const;
export function AppShell({
  screen,
  children,
}: {
  screen: string;
  children: ReactNode;
}) {
  const { t, state, setAuth, error, refresh } = usePlatform();
  const [panel, setPanel] = useState('');
  return (
    <SidebarProvider className="app-shell">
      <Sidebar collapsible="none" className="app-sidebar">
        <SidebarHeader>
          <Brand />
        </SidebarHeader>
        <SidebarContent>
          <span className="sidebar-eyebrow">ТВІЙ ПРОСТІР НАВЧАННЯ</span>
          <SidebarMenu>
            {navItems.map(([href, label, Icon]) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  render={<Link href={href} aria-label={t(label)} />}
                  isActive={'/' + screen === href}
                  className={
                    'nav-link ' + (href === '/become-tutor' ? 'tutor-nav' : '')
                  }
                >
                  <Icon size={21} />
                  <span>{t(label)}</span>
                  {href === '/search' && <span className="mini-ai">AI</span>}
                  {href === '/favorites' && state.favorites.length > 0 && (
                    <small>{state.favorites.length}</small>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <div className="sidebar-tip">
            <Sparkles size={23} />
            <h3>Знайдемо твій match?</h3>
            <p>Опиши свої цілі — ми допоможемо з вибором.</p>
            <Link href="/search">
              Спробувати пошук <ArrowRight size={15} />
            </Link>
          </div>
        </SidebarContent>
        <SidebarFooter>
          <p className="demo-label">Демо MVP · профілі вигадані</p>
          <button
            className="user-mini"
            onClick={() =>
              state.profile ? window.location.assign('/profile') : setAuth(true)
            }
          >
            <span className="avatar-letter">
              {state.profile?.image ? (
                <Image
                  width={800}
                  height={800}
                  unoptimized
                  src={state.profile.image}
                  alt=""
                />
              ) : (
                state.profile?.name?.slice(0, 1) || 'М'
              )}
            </span>
            <span>
              <strong>{state.profile?.name || 'Твій профіль'}</strong>
              <small>
                {state.profile?.role === 'Tutor'
                  ? 'Репетитор'
                  : 'Учень / студент'}
              </small>
            </span>
            <Settings size={16} />
          </button>
        </SidebarFooter>
      </Sidebar>
      <div className="app-main">
        <header className="app-header">
          <div className="mobile-brand">
            <Brand />
          </div>
          <span className="header-breadcrumb">
            Твій простір <span>/</span>{' '}
            {t(
              navItems.find((x) => x[0] === '/' + screen)?.[1] ||
                'Профіль репетитора',
            )}
          </span>
          <div className="app-header-actions">
            <button
              aria-label={t('Повідомлення')}
              onClick={() => setPanel('messages')}
            >
              <MessageCircle size={21} />
            </button>
            <button
              aria-label={t('Сповіщення')}
              onClick={() => setPanel('notifications')}
            >
              <Bell size={21} />
              {state.bookings.length > 0 && <i />}
            </button>
            <Link href="/profile" className="avatar-letter">
              {state.profile?.name?.slice(0, 1) || 'М'}
            </Link>
          </div>
        </header>
        {error && (
          <div role="alert" className="data-error">
            {error}
            <button onClick={() => refresh()}>Спробувати знову</button>
          </div>
        )}
        <main className="workspace">{children}</main>
        <footer className="app-footer">
          mentorly. <span>Навчання, яке підходить тобі.</span>
          <span>Демо · без реальних оплат і надсилання</span>
        </footer>
      </div>
      <nav className="bottom-nav" aria-label="Основна навігація">
        {navItems.map(([href, label, Icon]) => (
          <Link
            key={href}
            href={href}
            className={
              (href === '/become-tutor' ? 'center-nav ' : '') +
              ('/' + screen === href ? 'active' : '')
            }
            aria-label={t(label)}
          >
            <span>
              <Icon size={22} />
            </span>
            <small>{href === '/become-tutor' ? 'Викладати' : t(label)}</small>
          </Link>
        ))}
      </nav>
      <Modal
        open={!!panel}
        onClose={() => setPanel('')}
        title={t(panel === 'messages' ? 'Повідомлення' : 'Сповіщення')}
        description="Демонстраційний режим: записи та повідомлення зберігаються у твоєму просторі."
      >
        {panel === 'messages' ? <Messages /> : <Notifications />}
      </Modal>
    </SidebarProvider>
  );
}
function Messages() {
  const { state, allTutors } = usePlatform();
  const ids = [...new Set(state.messages.map((m) => m.tutor_id))];
  return ids.length ? (
    <div className="form-stack">
      {ids.map((id) => {
        const tutor = allTutors.find((t) => t.id === id);
        const messages = state.messages.filter((m) => m.tutor_id === id);
        return (
          <Link
            className="conversation-row"
            key={id}
            href={'/tutors/' + id + '?contact=1'}
          >
            <Image
              width={800}
              height={800}
              unoptimized
              src={tutor?.image || '/images/sofia.jpg'}
              alt=""
            />
            <div>
              <strong>{tutor?.name}</strong>
              <p>{messages.at(-1)?.body}</p>
              <small>{messages.length} повідомлень · демочат</small>
            </div>
            <ArrowUpRight size={18} />
          </Link>
        );
      })}
    </div>
  ) : (
    <EmptyState
      title="Поки немає повідомлень"
      description="Відкрий профіль викладача й натисни «Написати»."
    />
  );
}
function Notifications() {
  const { state, allTutors } = usePlatform();
  return (
    <div className="form-stack">
      <div className="notification-item">
        <Sparkles />
        <div>
          <strong>Знайди свого викладача</strong>
          <p>Нові можливості починаються з першого знайомства.</p>
          <Link href="/explore" className="text-link">
            Переглянути рекомендації →
          </Link>
        </div>
      </div>
      {state.bookings.map((b) => (
        <div key={b.id} className="notification-item">
          <CalendarDays />
          <div>
            <strong>Демозапис збережено</strong>
            <p>
              {allTutors.find((t) => t.id === b.tutor_id)?.name} ·{' '}
              {b.slot.slice(0, 10)} о {b.slot.slice(11, 16)}
            </p>
            <Link className="text-link" href="/profile?tab=lessons">
              Мої заняття →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
export function SearchBox({
  compact = false,
  onSearch,
  initial = '',
}: {
  compact?: boolean;
  onSearch?: (s: string) => void;
  initial?: string;
}) {
  const { t } = usePlatform();
  const [query, setQuery] = useState(initial);

  const submit = (s = query) => {
    if (onSearch) onSearch(s);
    else window.location.assign('/search?q=' + encodeURIComponent(s));
  };
  return (
    <section className={'ai-banner ' + (compact ? 'compact-ai' : '')}>
      <div className="ai-caption">
        <span className="ai-icon">
          <Sparkles />
        </span>
        <div>
          <h2>{t('Ти описуєш. Ми знаходимо.')}</h2>
          <p>{t('Спробуй пошук із розумінням твоїх потреб')}</p>
        </div>
        <span className="beta">AI ПОШУК</span>
      </div>
      <form
        className="query-box"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <Search size={20} />
        <input
          aria-label={t('Опиши, якого репетитора ти шукаєш…')}
          placeholder={t('Опиши, якого репетитора ти шукаєш…')}
          value={query}
          maxLength={2000}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="button primary" type="submit">
          {t('Знайти')}
          <ArrowRight size={19} />
        </button>
      </form>
      <div className="suggestions">
        <span>Спробуй:</span>
        {[
          '🇬🇧 Англійська для подорожей',
          '📐 Математика без стресу',
          '🎯 НМТ онлайн до 500 грн',
        ].map((s) => (
          <button
            key={s}
            onClick={() => {
              setQuery(s);
              submit(s);
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </section>
  );
}
function PageHeading({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  const { t } = usePlatform();
  return (
    <div className="page-heading">
      <div>
        <h1>{t(title)}</h1>
        {description && <p>{t(description)}</p>}
      </div>
      {children}
    </div>
  );
}
export function Explore() {
  const { t, allTutors, state } = usePlatform();
  const [subject, setSubject] = useState('');
  const interests = [
    ...(state.profile?.subjects || []),
    ...state.favorites.map(
      (f) => allTutors.find((t) => t.id === f.tutor_id)?.subject,
    ),
    ...(state.profile?.viewed || []).map(
      (id) => allTutors.find((t) => t.id === id)?.subject,
    ),
  ];
  const eligible = allTutors.filter(
    (x) =>
      (!subject || x.subject === subject) &&
      !state.profile?.blocked?.includes(x.id),
  );
  const recommended = [...eligible].sort(
    (a, b) =>
      Number(interests.includes(b.subject)) -
        Number(interests.includes(a.subject)) ||
      Number(b.price <= (state.profile?.budget || 500)) -
        Number(a.price <= (state.profile?.budget || 500)) ||
      b.rating - a.rating,
  );
  const sections = [
    ['Рекомендовано для тебе', recommended.slice(0, 4)],
    [
      'Популярні репетитори',
      [...eligible].sort((a, b) => b.students - a.students).slice(0, 4),
    ],
    ['Нові викладачі', eligible.filter((t) => t.isNew)],
    [
      'Найкращі за рейтингом',
      [...eligible].sort((a, b) => b.rating - a.rating).slice(0, 4),
    ],
  ] as const;
  return (
    <>
      <PageHeading
        title="Навчайся у своєму темпі."
        description="Обери людину, яка допоможе тобі рухатися вперед."
      />
      <SearchBox compact />
      <div className="subject-chips app-chips">
        {['', ...subjects].map((s, i) => (
          <button
            key={s}
            className={subject === s ? 'active' : ''}
            onClick={() => setSubject(s)}
          >
            {s ? subjectIcons[i - 1] + ' ' + t(s) : t('Усі предмети')}
          </button>
        ))}
      </div>
      {sections.map(([title, items]) => (
        <section className="tutor-section" key={title}>
          <div className="section-heading">
            <h2>{t(title)}</h2>
            <Link href={'/search?subject=' + encodeURIComponent(subject)}>
              {t('Усі репетитори')}
              <ArrowUpRight size={17} />
            </Link>
          </div>
          {items.length ? (
            <div className="tutor-grid">
              {items.map((t) => (
                <TutorCard key={t.id} tutor={t} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Нічого не знайдено"
              description="Спробуй змінити фільтри або описати запит інакше."
            />
          )}
        </section>
      ))}
    </>
  );
}
export function SearchPage({
  initialQuery = '',
  initialSubject = '',
}: {
  initialQuery?: string;
  initialSubject?: string;
}) {
  const { t, allTutors, state } = usePlatform();
  const [filters, setFilters] = useState<Filters>({ subject: initialSubject }),
    [expanded, setExpanded] = useState(false),
    [query, setQuery] = useState(initialQuery),
    [results, setResults] = useState<
      { tutor: Tutor; reasons: string[] }[] | null
    >(null),
    [busy, setBusy] = useState(false),
    [sort, setSort] = useState('За відповідністю'),
    [parsed, setParsed] = useState<Filters>({}),
    [err, setErr] = useState('');
  const update = (k: keyof Filters, v: string | number) => {
    setFilters((f) => ({ ...f, [k]: v }));
    setResults(null);
    setParsed({});
  };
  const run = useCallback(async (q: string, f: Filters = {}) => {
    setQuery(q);
    setBusy(true);
    setErr('');
    try {
      const r = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, filters: f }),
      });
      const v = (await r.json()) as {
        error?: string;
        results: { tutor: Tutor; reasons: string[] }[];
        filters: Filters;
      };
      if (!r.ok) throw new Error(v.error || 'Помилка пошуку');
      setResults(v.results);
      setParsed(v.filters);
      setFilters(v.filters);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }, []);
  useEffect(() => {
    if (!initialQuery) return;
    let active = true;
    void fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: initialQuery, filters: {} }),
    })
      .then(async (r) => {
        const v = (await r.json()) as {
          results: { tutor: Tutor; reasons: string[] }[];
          filters: Filters;
          error?: string;
        };
        if (!r.ok) throw new Error(v.error || 'Помилка пошуку');
        if (active) {
          setResults(v.results);
          setFilters(v.filters);
          setParsed(v.filters);
          setQuery(initialQuery);
        }
      })
      .catch((e) => {
        if (active) setErr((e as Error).message);
      });
    return () => {
      active = false;
    };
  }, [initialQuery]);
  useEffect(() => {
    const context = (
      document as unknown as {
        modelContext?: {
          registerTool: (
            tool: unknown,
            options: { signal: AbortSignal },
          ) => void | Promise<void>;
        };
      }
    ).modelContext;
    if (!context?.registerTool) return;
    const life = new AbortController();
    Promise.resolve(
      context.registerTool(
        {
          name: 'search_tutors',
          title: 'Пошук репетиторів',
          description:
            'Search the tutor catalog and display results. Does not book or contact a tutor.',
          inputSchema: {
            type: 'object',
            properties: { query: { type: 'string', maxLength: 2000 } },
            required: ['query'],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false, untrustedContentHint: true },
          async execute(input: unknown) {
            const q = (input as { query?: unknown })?.query;
            if (typeof q !== 'string' || q.length > 2000)
              throw new Error('Invalid query');
            await run(q);
            return { query: q, display: 'search_results' };
          },
        },
        { signal: life.signal },
      ),
    ).catch(() => {});
    return () => life.abort();
  }, [run]);
  let rows = (
    results ||
    filterTutors(allTutors, filters).map((t) => ({ tutor: t, reasons: [] }))
  ).filter((x) => !state.profile?.blocked?.includes(x.tutor.id));
  rows = [...rows].sort((a, b) =>
    sort === 'Ціна: від нижчої'
      ? a.tutor.price - b.tutor.price
      : sort === 'За рейтингом'
        ? b.tutor.rating - a.tutor.rating
        : sort === 'За популярністю'
          ? b.tutor.students - a.tutor.students
          : sort === 'За досвідом'
            ? b.tutor.experience - a.tutor.experience
            : 0,
  );
  return (
    <>
      <PageHeading
        title="AI-пошук"
        description="Твоя мета, бюджет і побажання — в одному запиті."
      />
      <SearchBox key={query} initial={query} onSearch={(q) => run(q)} />
      <p className="search-demo">
        <Sparkles size={14} /> Демо-алгоритм · розпізнає предмет, бюджет, мету,
        місто, формат, день і час. AI API ще не підключено.
      </p>
      <div className="filters-bar">
        <Picker
          label="Предмет"
          value={filters.subject}
          onChange={(v) => update('subject', v)}
          options={subjects}
          all
        />
        <Picker
          label="Формат"
          value={filters.format}
          onChange={(v) => update('format', v)}
          options={['Онлайн', 'Офлайн', 'Гібрид']}
          all
        />
        <Field
          label="Ціна до"
          type="number"
          min={0}
          value={filters.max || ''}
          placeholder="1000 ₴"
          onChange={(e) => update('max', Number(e.target.value))}
        />
        <button
          className={
            'button outline filter-toggle ' + (expanded ? 'selected' : '')
          }
          onClick={() => setExpanded(!expanded)}
        >
          <SlidersHorizontal size={17} />
          {t('Фільтри')}
          {Object.values(filters).filter(Boolean).length > 0 && (
            <span>{Object.values(filters).filter(Boolean).length}</span>
          )}
        </button>
      </div>
      {expanded && (
        <div className="filter-panel">
          <Field
            label="Ціна від"
            type="number"
            min={0}
            value={filters.min || ''}
            onChange={(e) => update('min', Number(e.target.value))}
          />
          <Picker
            label="Місто"
            value={filters.city}
            onChange={(v) => update('city', v)}
            options={['Київ', 'Львів', 'Одеса', 'Дніпро', 'Харків']}
            all
          />
          <Picker
            label="Рівень"
            value={filters.level}
            onChange={(v) => update('level', v)}
            options={['Початковий', 'Середній', 'Просунутий']}
            all
          />
          <Picker
            label="Мета"
            value={filters.goal}
            onChange={(v) => update('goal', v)}
            options={[
              'НМТ',
              'Шкільна програма',
              'Розмовна практика',
              'Університетські предмети',
              'Підготовка до вступу',
            ]}
            all
          />
          <Picker
            label="Стать викладача"
            value={filters.gender}
            onChange={(v) => update('gender', v)}
            options={['Жінка', 'Чоловік']}
            all
          />
          <Picker
            label="Мова викладання"
            value={filters.language}
            onChange={(v) => update('language', v)}
            options={['Українська', 'English', 'Polski']}
            all
          />
          <Picker
            label="Досвід"
            value={filters.experience ? String(filters.experience) : ''}
            onChange={(v) => update('experience', Number(v))}
            options={['1', '3', '5', '7', '10']}
            all
          />
          <Picker
            label="Рейтинг"
            value={filters.rating ? String(filters.rating) : ''}
            onChange={(v) => update('rating', Number(v))}
            options={['4', '4.5', '4.8', '4.9', '5']}
            all
          />
          <Picker
            label="День"
            value={filters.day}
            onChange={(v) => update('day', v)}
            options={['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']}
            all
          />
          <Picker
            label="Час"
            value={filters.time}
            onChange={(v) => update('time', v)}
            options={['10:00', '14:00', '17:00', '19:00']}
            all
          />
          <Picker
            label="Тривалість"
            value={filters.duration ? String(filters.duration) : ''}
            onChange={(v) => update('duration', Number(v))}
            options={['30', '45', '60', '90']}
            all
          />
          <button
            className="text-link"
            onClick={() => {
              setFilters({});
              setResults(null);
              setParsed({});
              setQuery('');
            }}
          >
            {t('Скинути')}
          </button>
        </div>
      )}
      {Object.values(parsed).some(Boolean) && (
        <div className="parsed-tags">
          <span>Розпізнано:</span>
          {Object.entries(parsed).map(([k, v]) => (
            <span key={k}>
              {k === 'max' ? 'до ' : ''}
              {t(String(v))}
              {k === 'max' ? ' ₴' : ''}
            </span>
          ))}
        </div>
      )}
      <div className="results-heading">
        <span>
          Знайдено <strong>{rows.length}</strong>{' '}
          {rows.length === 1 ? 'викладача' : 'викладачів'}
        </span>
        <Picker
          label="Сортування"
          value={sort}
          onChange={setSort}
          options={[
            'За відповідністю',
            'За рейтингом',
            'Ціна: від нижчої',
            'За популярністю',
            'За досвідом',
          ]}
        />
      </div>
      {err && (
        <div role="alert" className="data-error">
          {err}
          <button onClick={() => run(query, filters)}>Повторити</button>
        </div>
      )}
      {busy ? (
        <div className="tutor-grid">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-96 rounded-2xl" />
          ))}
        </div>
      ) : rows.length ? (
        <div className="tutor-grid">
          {rows.map(({ tutor, reasons }) => (
            <TutorCard
              key={tutor.id}
              tutor={tutor}
              reason={reasons.length ? reasons.join(' · ') : undefined}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Нічого не знайдено"
          description="Спробуй змінити фільтри або описати запит інакше."
        >
          <button
            className="button primary"
            onClick={() => {
              setFilters({});
              setParsed({});
              setResults(null);
              setQuery('');
            }}
          >
            {t('Скинути')}
          </button>
        </EmptyState>
      )}
    </>
  );
}
export function Favorites() {
  const { t, state, allTutors, mutate, flash, favorite, setAuth } =
    usePlatform();
  const [list, setList] = useState('Усі'),
    [newList, setNewList] = useState(false),
    [name, setName] = useState(''),
    [selected, setSelected] = useState<string[]>([]),
    [compare, setCompare] = useState(false),
    [busy, setBusy] = useState(false);
  const rows = allTutors.filter((t) =>
    state.favorites.some(
      (f) => f.tutor_id === t.id && (list === 'Усі' || f.list === list),
    ),
  );
  const choices = allTutors.filter((t) => selected.includes(t.id));
  return (
    <>
      <PageHeading
        title="Обрані"
        description="Твої люди. Твої списки. Зручний вибір."
      >
        <button
          className="button outline"
          onClick={() => (state.profile ? setNewList(true) : setAuth(true))}
        >
          <Plus size={17} />
          {t('Створити список')}
        </button>
      </PageHeading>
      <div className="favorites-toolbar">
        <div className="subject-chips app-chips">
          {['Усі', ...state.lists].map((l) => (
            <button
              key={l}
              className={l === list ? 'active' : ''}
              onClick={() => setList(l)}
            >
              {t(l)}{' '}
              <small>
                {l === 'Усі'
                  ? state.favorites.length
                  : state.favorites.filter((f) => f.list === l).length}
              </small>
            </button>
          ))}
        </div>
        <button
          className="button dark-btn"
          disabled={selected.length < 2}
          onClick={() => setCompare(true)}
        >
          {t('Порівняти')} ({selected.length}/4)
        </button>
      </div>
      {rows.length ? (
        <div className="tutor-grid">
          {rows.map((tutor) => (
            <div key={tutor.id}>
              <TutorCard
                tutor={tutor}
                compare
                selected={selected.includes(tutor.id)}
                onSelect={() => {
                  if (selected.includes(tutor.id))
                    setSelected(selected.filter((x) => x !== tutor.id));
                  else if (selected.length < 4)
                    setSelected([...selected, tutor.id]);
                  else flash('Обери до 4 викладачів');
                }}
              />
              <div className="list-picker">
                <Picker
                  label="Списки"
                  value={
                    state.favorites.find((f) => f.tutor_id === tutor.id)?.list
                  }
                  onChange={(v) => favorite(tutor.id, v)}
                  options={state.lists}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Ще нікого не збережено"
          description="Обирай викладачів сердечком, щоб повернутися до них пізніше."
        >
          <Link className="button primary" href="/explore">
            {t('Знайти репетитора')}
            <ArrowRight size={18} />
          </Link>
        </EmptyState>
      )}
      <Modal
        open={newList}
        onClose={() => setNewList(false)}
        title={t('Створити список')}
      >
        <form
          className="form-stack"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              await mutate({ action: 'list', name });
              setNewList(false);
              setName('');
              flash('Список створено');
            } catch (e) {
              flash((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <Field
            label="Назва списку"
            value={name}
            required
            maxLength={60}
            onChange={(e) => setName(e.target.value)}
            placeholder="Наприклад, підготовка до НМТ"
          />
          <button className="button primary" disabled={busy}>
            {t('Створити список')}
          </button>
        </form>
      </Modal>
      <Modal
        open={compare}
        onClose={() => setCompare(false)}
        title="Порівняння репетиторів"
        wide
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Критерій</TableHead>
              {choices.map((t) => (
                <TableHead key={t.id}>
                  <Image
                    width={800}
                    height={800}
                    unoptimized
                    className="compare-avatar"
                    src={t.image}
                    alt=""
                  />
                  {t.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              ['Предмет', 'subject'],
              ['Ціна, ₴ / заняття', 'price'],
              ['Рейтинг', 'rating'],
              ['Досвід, років', 'experience'],
              ['Формат', 'format'],
              ['Місто', 'city'],
              ['Мови', 'languages'],
              ['Дні', 'days'],
            ].map(([label, key]) => (
              <TableRow key={key}>
                <TableCell>{t(label)}</TableCell>
                {choices.map((x) => (
                  <TableCell key={x.id}>
                    {formatTutorValue(x, key, t)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow>
              <TableCell />
              {choices.map((x) => (
                <TableCell key={x.id}>
                  <Link className="text-link" href={'/tutors/' + x.id}>
                    Профіль →
                  </Link>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
        <div className="match">
          <Sparkles size={18} />
          <p>
            Найнижча ціна:{' '}
            <strong>
              {[...choices].sort((a, b) => a.price - b.price)[0]?.name}
            </strong>
            . Найбільший досвід:{' '}
            <strong>
              {
                [...choices].sort((a, b) => b.experience - a.experience)[0]
                  ?.name
              }
            </strong>
            . Порівняння на основі даних профілів.
          </p>
        </div>
      </Modal>
    </>
  );
}
export function TutorDetail({
  id,
  initialContact = false,
}: {
  id: string;
  initialContact?: boolean;
}) {
  const {
    allTutors,
    state,
    loading,
    t,
    mutate,
    flash,
    favorite,
    requireProfile,
  } = usePlatform();
  const tutor = allTutors.find((t) => t.id === id);
  const [contact, setContact] = useState(initialContact),
    [booking, setBooking] = useState(false),
    [text, setText] = useState(''),
    [busy, setBusy] = useState(false),
    [dateIndex, setDateIndex] = useState(0),
    [time, setTime] = useState(''),
    [review, setReview] = useState(false),
    [rating, setRating] = useState('5');
  useEffect(() => {
    if (!tutor || !state.profile || state.profile.viewed?.includes(id)) return;
    mutate({
      action: 'profile',
      data: {
        ...state.profile,
        viewed: [...(state.profile.viewed || []), id].slice(-30),
      },
    }).catch(() => {});
  }, [id, state.profile, tutor, mutate]);
  if (!tutor)
    return loading ? (
      <Skeleton className="h-96 rounded-xl" />
    ) : (
      <EmptyState
        title="Профіль не знайдено"
        description="Викладач міг змінити профіль. Повернися до пошуку."
      >
        <Link href="/explore" className="button primary">
          Усі репетитори
        </Link>
      </EmptyState>
    );
  const saved = state.favorites.some((f) => f.tutor_id === id),
    messages = state.messages.filter((m) => m.tutor_id === id),
    ownReviews = state.reviews.filter((r) => r.tutor_id === id);
  const dates = Array.from({ length: 28 }, (_, i) => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() + i + 1);
    return d;
  }).filter((d) =>
    tutor.days.includes(
      ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][d.getUTCDay()],
    ),
  );
  const date = dates[dateIndex];
  const slots = tutor.times.filter(
    (tm) =>
      !state.bookings.some(
        (b) => b.slot === date?.toISOString().slice(0, 10) + 'T' + tm + ':00Z',
      ),
  );
  const startContact = () => {
    if (requireProfile()) setContact(true);
  };
  const startBooking = () => {
    if (requireProfile()) {
      setTime('');
      setBooking(true);
    }
  };
  return (
    <>
      <Link className="back-link" href="/explore">
        <ArrowLeft size={16} /> До викладачів
      </Link>
      <div className="detail-layout">
        <div className="detail-main">
          <section className="detail-intro">
            <Image
              width={800}
              height={800}
              unoptimized
              className="detail-photo"
              src={tutor.image || '/images/sofia.jpg'}
              alt={tutor.name}
            />
            <div>
              <span className="subject-label">
                {subjectIcons[subjects.indexOf(tutor.subject)]}{' '}
                {[tutor.subject, ...(tutor.additionalSubjects || [])]
                  .map(t)
                  .join(' · ')}
              </span>
              <h1>
                {tutor.name} {tutor.verified && <BadgeCheck size={25} />}
              </h1>
              <div className="detail-rating">
                <Star size={16} fill="currentColor" />
                {tutor.rating || 'Новий'}{' '}
                <span>
                  ({tutor.reviews + ownReviews.length} відгуків) ·{' '}
                  {tutor.students} учнів
                </span>
              </div>
              <p>
                <MapPin size={15} />
                {tutor.city}
                <span>·</span>
                <Monitor size={15} />
                {t(tutor.format)}
              </p>
              <div className="detail-tags">
                {tutor.goals.map((g) => (
                  <span key={g}>{t(g)}</span>
                ))}
              </div>
            </div>
          </section>
          <div className="detail-stats">
            <span>
              <strong>{tutor.experience} років</strong>
              {t('Досвід')}
            </span>
            <span>
              <strong>{tutor.languages.join(' / ')}</strong>
              {t('Мова викладання')}
            </span>
            <span>
              <strong>{tutor.duration} хв</strong>
              {t('Тривалість')}
            </span>
          </div>
          <Tabs defaultValue="about">
            <TabsList variant="line" className="detail-tabs">
              <TabsTrigger value="about">{t('Про себе')}</TabsTrigger>
              <TabsTrigger value="education">{t('Освіта')}</TabsTrigger>
              <TabsTrigger value="reviews">{t('Відгуки')}</TabsTrigger>
            </TabsList>
            <TabsContent value="about">
              <div className="detail-section">
                <h2>{t('Про себе')}</h2>
                <p>{tutor.description}</p>
                <h2>{t('Методика')}</h2>
                <p>{tutor.method}</p>
                <h2>Для кого мої заняття</h2>
                <div className="detail-tags">
                  {tutor.levels.map((l) => (
                    <span key={l}>{t(l)}</span>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="education">
              <div className="detail-section">
                <h2>{t('Освіта')}</h2>
                <div className="education-card">
                  <GraduationCap />
                  <div>
                    <strong>{tutor.education}</strong>
                    <p>
                      {tutor.verified
                        ? 'Приклад підтвердженої освіти в демокаталозі'
                        : 'Освіта вказана викладачем; перевірка очікується'}
                    </p>
                  </div>
                </div>
                <h2>Сертифікати</h2>
                {tutor.certificates?.length ? (
                  tutor.certificates.map((c) => (
                    <Link
                      className="education-card"
                      href={c.url}
                      target="_blank"
                      rel="noreferrer"
                      key={c.url}
                    >
                      <FileCheck />
                      <span>{c.name}</span>
                      <ArrowUpRight />
                    </Link>
                  ))
                ) : (
                  <p>
                    Інформацію про додаткові сертифікати можна уточнити на
                    знайомстві.
                  </p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="reviews">
              <div className="detail-section">
                <div className="section-heading">
                  <h2>{t('Відгуки')}</h2>
                  <button
                    className="text-link"
                    onClick={() => {
                      if (requireProfile()) setReview(true);
                    }}
                  >
                    {t('Додати відгук')}
                  </button>
                </div>
                {ownReviews.map((r) => (
                  <div className="review" key={r.id}>
                    <strong>{r.name}</strong>
                    <span className="proof-stars">{'★'.repeat(r.rating)}</span>
                    <p>{r.body}</p>
                    <small>{r.created_at.slice(0, 10)} · демовідгук</small>
                  </div>
                ))}
                {tutor.reviews > 0 && (
                  <>
                    <div className="review">
                      <strong>Анастасія · учень</strong>
                      <span className="proof-stars">★★★★★</span>
                      <p>
                        Дуже подобається спокійна атмосфера. Тепер не боюся
                        ставити запитання, а складні теми нарешті стали
                        зрозумілими.
                      </p>
                      <small>Приклад відгуку · демонстраційні дані</small>
                    </div>
                    <div className="review">
                      <strong>Данило · студент</strong>
                      <span className="proof-stars">★★★★★</span>
                      <p>
                        Зрозумілий план, багато практики та підтримка. На
                        кожному занятті бачу свій прогрес.
                      </p>
                      <small>Приклад відгуку · демонстраційні дані</small>
                    </div>
                  </>
                )}
                {!tutor.reviews && !ownReviews.length && (
                  <p>Перший відгук ще попереду.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
          <section className="detail-section">
            <h2>{t('Доступний графік')}</h2>
            <p>Обери зручний день. Час Києва · демонстраційна доступність.</p>
            <div className="availability-days">
              {tutor.days.map((d) => (
                <button key={d} onClick={startBooking}>
                  {d}
                  <span className="green-dot" />
                </button>
              ))}
            </div>
            <button className="button outline" onClick={startBooking}>
              <CalendarDays size={18} />
              Відкрити календар
            </button>
          </section>
        </div>
        <aside className="booking-card">
          <span className="availability-pill">
            <span /> Відкритий до нових учнів
          </span>
          <div className="detail-price">
            {tutor.price} ₴ <span>/ {tutor.duration} хв</span>
          </div>
          <p>Знайомство — перший крок до твоєї мети.</p>
          <button className="button primary" onClick={startBooking}>
            {t('Записатися на заняття')}
            <ArrowUpRight size={18} />
          </button>
          <button className="button outline" onClick={startContact}>
            <MessageCircle size={18} />
            {t('Написати')}
          </button>
          <button
            className={'save-detail ' + (saved ? 'saved' : '')}
            onClick={() => favorite(id)}
          >
            <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
            {t(saved ? 'Збережено' : 'Зберегти')}
          </button>
          <div className="booking-benefits">
            <span>
              <Check size={16} /> Навчання у твоєму темпі
            </span>
            <span>
              <Check size={16} /> Особистий план занять
            </span>
            <span>
              <ShieldCheck size={16} /> Без оплати на платформі
            </span>
          </div>
          <small className="demo-label">
            Демонстраційний профіль. Запис не створює реального заняття.
          </small>
          <button
            className="quiet-button"
            onClick={async () => {
              if (!requireProfile()) return;
              try {
                const blocked = state.profile?.blocked || [];
                await mutate({
                  action: 'profile',
                  data: {
                    ...state.profile,
                    blocked: blocked.includes(id)
                      ? blocked.filter((x) => x !== id)
                      : [...blocked, id],
                  },
                });
                flash(
                  blocked.includes(id)
                    ? 'Викладача розблоковано'
                    : 'Викладача приховано з рекомендацій',
                );
              } catch (e) {
                flash((e as Error).message);
              }
            }}
          >
            {state.profile?.blocked?.includes(id)
              ? 'Розблокувати викладача'
              : 'Приховати цього викладача'}
          </button>
        </aside>
      </div>
      <Modal
        open={contact}
        onClose={() => setContact(false)}
        title={'Написати · ' + tutor.name}
        description="Демочат: повідомлення збережеться у твоєму просторі, але не надсилатиметься реальній людині."
      >
        <div className="chat-history">
          {messages.length ? (
            messages.map((m) => (
              <div className="chat-bubble" key={m.id}>
                {m.body}
                <small>{m.created_at.slice(11, 16)} · збережено</small>
              </div>
            ))
          ) : (
            <div className="chat-greeting">
              <Image
                width={800}
                height={800}
                unoptimized
                src={tutor.image}
                alt=""
              />
              <p>
                Розкажи про свою мету, зручний час та очікування від занять.
              </p>
            </div>
          )}
        </div>
        <form
          className="chat-compose"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!requireProfile()) return;
            setBusy(true);
            try {
              await mutate({ action: 'message', tutorId: id, body: text });
              setText('');
              flash('Повідомлення збережено у демочаті');
            } catch (e) {
              flash((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <textarea
            required
            value={text}
            maxLength={4000}
            onChange={(e) => setText(e.target.value)}
            placeholder="Привіт! Хочу дізнатися про заняття…"
            aria-label="Повідомлення"
          />
          <button
            className="button primary"
            disabled={busy || !text.trim()}
            aria-label="Надіслати повідомлення"
          >
            <Send size={20} />
          </button>
        </form>
      </Modal>
      <Modal
        open={booking}
        onClose={() => setBooking(false)}
        title="Обери час для знайомства"
        description={
          'Заняття з ' +
          tutor.name +
          ' · ' +
          tutor.price +
          ' ₴ / ' +
          tutor.duration +
          ' хв. Демо, без оплати.'
        }
      >
        <div className="calendar-nav">
          <button
            aria-label="Попередній день"
            disabled={dateIndex === 0}
            onClick={() => {
              setDateIndex((i) => i - 1);
              setTime('');
            }}
          >
            <ChevronLeft />
          </button>
          <strong>
            {date?.toLocaleDateString('uk-UA', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              timeZone: 'UTC',
            })}
          </strong>
          <button
            aria-label="Наступний день"
            disabled={dateIndex >= dates.length - 1}
            onClick={() => {
              setDateIndex((i) => i + 1);
              setTime('');
            }}
          >
            <ChevronRight />
          </button>
        </div>
        <div className="time-grid">
          {slots.map((tm) => (
            <button
              className={tm === time ? 'active' : ''}
              key={tm}
              onClick={() => setTime(tm)}
            >
              {tm}
            </button>
          ))}
        </div>
        {!slots.length && (
          <p>Усі години цього дня зайняті. Обери інший день.</p>
        )}
        <p className="demo-note">
          Час Києва. Запис можна скасувати в розділі «Мої заняття».
        </p>
        <button
          className="button primary"
          disabled={!time || busy}
          onClick={async () => {
            if (!date || !time || !requireProfile()) return;
            setBusy(true);
            try {
              await mutate({
                action: 'booking',
                tutorId: id,
                slot: date.toISOString().slice(0, 10) + 'T' + time + ':00Z',
              });
              setBooking(false);
              flash('Демозапис збережено! Деталі — у «Мої заняття».');
            } catch (e) {
              flash((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? 'Зберігаємо…' : 'Підтвердити демозапис'}
          <Check size={18} />
        </button>
      </Modal>
      <Modal
        open={review}
        onClose={() => setReview(false)}
        title="Твій відгук"
        description="Відгук збережеться як демонстраційний."
      >
        <form
          className="form-stack"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              await mutate({
                action: 'review',
                tutorId: id,
                rating: Number(rating),
                body: text,
              });
              setText('');
              setReview(false);
              flash('Відгук додано');
            } catch (e) {
              flash((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <Picker
            label="Рейтинг"
            value={rating}
            onChange={setRating}
            options={['5', '4', '3', '2', '1']}
          />
          <textarea
            required
            className="text-area"
            aria-label="Текст відгуку"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={2000}
            placeholder="Що тобі сподобалося?"
          />
          <button className="button primary" disabled={busy}>
            Додати відгук
          </button>
        </form>
      </Modal>
    </>
  );
}
export function SettingsPage({
  initialTab = 'account',
}: {
  initialTab?: string;
}) {
  const {
    state,
    allTutors,
    t,
    locale,
    setLocale,
    theme,
    setTheme,
    mutate,
    flash,
    setAuth,
  } = usePlatform();
  const [draft, setDraft] = useState<Profile>(
      state.profile || { name: '', email: '' },
    ),
    [tab, setTab] = useState(initialTab),
    [busy, setBusy] = useState(false),
    [deleting, setDeleting] = useState(false);
  const patch = (k: keyof Profile, v: Profile[keyof Profile]) =>
    setDraft((p) => ({ ...p, [k]: v }));
  const save = async () => {
    setBusy(true);
    try {
      await mutate({ action: 'profile', data: draft });
      flash('Налаштування збережено');
    } catch (e) {
      flash((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <PageHeading
        title="Налаштування"
        description="Твій профіль, твої вподобання, твій комфорт."
      />
      {!state.profile ? (
        <EmptyState
          title="Створи свій профіль"
          description="Збережи вподобання та знайди викладача, який підходить саме тобі."
        >
          <button className="button primary" onClick={() => setAuth(true)}>
            {t('Створити демопрофіль')}
          </button>
        </EmptyState>
      ) : (
        <div className="settings-layout">
          <Tabs
            value={tab}
            onValueChange={(v) => setTab(String(v))}
            orientation="vertical"
            className="settings-tabs"
          >
            <TabsList className="settings-tab-list">
              {(
                [
                  ['account', 'Акаунт', User],
                  ['lessons', 'Мої заняття', CalendarDays],
                  ['appearance', 'Вигляд', Sun],
                  ['language', 'Мова', Globe],
                  ['preferences', 'Вподобання', BookOpen],
                  ['notifications', 'Сповіщення', Bell],
                  ['security', 'Безпека', ShieldCheck],
                ] as const
              ).map(([key, label, Icon]) => (
                <TabsTrigger value={key} key={key}>
                  <Icon size={18} />
                  {t(label)}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="settings-content">
              <TabsContent value="account">
                <form
                  className="form-stack"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void save();
                  }}
                >
                  <h2>{t('Акаунт')}</h2>
                  <div className="account-avatar">
                    <span className="avatar-letter">
                      {draft.image ? (
                        <Image
                          width={800}
                          height={800}
                          unoptimized
                          src={draft.image}
                          alt="Фото профілю"
                        />
                      ) : (
                        draft.name[0]
                      )}
                    </span>
                    <UploadField
                      label="Фото профілю"
                      image
                      onUploaded={(v) => patch('image', v.url)}
                    />
                  </div>
                  <Field
                    label="Ім’я"
                    required
                    value={draft.name}
                    onChange={(e) => patch('name', e.target.value)}
                  />
                  <Field
                    label="Email"
                    type="email"
                    required
                    value={draft.email}
                    onChange={(e) => patch('email', e.target.value)}
                  />
                  <Field
                    label="Телефон"
                    type="tel"
                    value={draft.phone || ''}
                    onChange={(e) => patch('phone', e.target.value)}
                    placeholder="+380"
                  />
                  <div className="linked-accounts">
                    <span>Google / Apple</span>
                    <button
                      className="text-link"
                      type="button"
                      onClick={() =>
                        flash(
                          'Google та Apple OAuth потребують налаштування перед публічним запуском.',
                        )
                      }
                    >
                      Не підключено · подробиці
                    </button>
                  </div>
                  <div className="linked-accounts">
                    <span>Роль</span>
                    <strong>{draft.role || 'Student'}</strong>
                  </div>
                  <button className="button primary" disabled={busy}>
                    {t('Зберегти зміни')}
                  </button>
                  <button
                    className="quiet-button"
                    type="button"
                    onClick={() =>
                      flash(
                        'Демопрофіль не має пароля. Доступ захищено входом до цього сайту.',
                      )
                    }
                  >
                    Зміна пароля
                  </button>
                </form>
              </TabsContent>
              <TabsContent value="lessons">
                <h2>{t('Мої заняття')}</h2>
                {state.bookings.length ? (
                  <div className="form-stack">
                    {state.bookings.map((b) => {
                      const tutor = allTutors.find((x) => x.id === b.tutor_id);
                      return (
                        <div className="lesson-card" key={b.id}>
                          <Image
                            width={800}
                            height={800}
                            unoptimized
                            src={tutor?.image || '/images/sofia.jpg'}
                            alt=""
                          />
                          <div>
                            <strong>{tutor?.name}</strong>
                            <p>
                              {b.slot.slice(0, 10)} · {b.slot.slice(11, 16)}
                            </p>
                            <small>Демозапис · {tutor?.price} ₴</small>
                          </div>
                          <button
                            className="text-link"
                            onClick={async () => {
                              try {
                                await mutate({
                                  action: 'cancel',
                                  tutorId: b.tutor_id,
                                  id: b.id,
                                });
                                flash('Запис скасовано');
                              } catch (e) {
                                flash((e as Error).message);
                              }
                            }}
                          >
                            {t('Скасувати')}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <EmptyState
                    title="Твоє перше заняття попереду"
                    description="Знайди викладача й обери зручний час у його календарі."
                  >
                    <Link href="/explore" className="button primary">
                      Знайти репетитора
                    </Link>
                  </EmptyState>
                )}
              </TabsContent>
              <TabsContent value="appearance">
                <h2>{t('Вигляд')}</h2>
                <p>Обери комфортну тему для навчання.</p>
                <div className="theme-options">
                  {[
                    ['light', 'Світла'],
                    ['dark', 'Темна'],
                    ['system', 'Системна'],
                  ].map(([v, label]) => (
                    <button
                      key={v}
                      className={theme === v ? 'active' : ''}
                      onClick={() => setTheme(v)}
                    >
                      <span className={'theme-swatch ' + v}>
                        <i />
                        <i />
                        <i />
                      </span>
                      {t(label)}
                      {theme === v && <Check size={16} />}
                    </button>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="language">
                <h2>{t('Мова')}</h2>
                <Picker
                  label="Мова інтерфейсу"
                  value={
                    { uk: 'Українська', en: 'English', pl: 'Polski' }[locale]
                  }
                  options={['Українська', 'English', 'Polski']}
                  onChange={(v) =>
                    setLocale(
                      (
                        {
                          Українська: 'uk',
                          English: 'en',
                          Polski: 'pl',
                        } as Record<string, Locale>
                      )[v],
                    )
                  }
                />
                <p className="demo-note">
                  Основна навігація й елементи керування перекладені. Описи
                  викладачів і частина демопідказок залишаються українською.
                </p>
              </TabsContent>
              <TabsContent value="preferences">
                <div className="form-stack">
                  <h2>{t('Вподобання')}</h2>
                  <div className="checkbox-grid">
                    {subjects.map((s) => (
                      <CheckChoice
                        key={s}
                        label={s}
                        checked={draft.subjects?.includes(s) || false}
                        onChange={(v) =>
                          patch(
                            'subjects',
                            v
                              ? [...(draft.subjects || []), s]
                              : draft.subjects?.filter((x) => x !== s),
                          )
                        }
                      />
                    ))}
                  </div>
                  <Field
                    label="Твій бюджет за годину"
                    type="number"
                    min={50}
                    max={10000}
                    value={draft.budget || 500}
                    onChange={(e) => patch('budget', Number(e.target.value))}
                  />
                  <Picker
                    label="Формат"
                    value={draft.format || 'Онлайн'}
                    onChange={(v) => patch('format', v)}
                    options={['Онлайн', 'Офлайн', 'Гібрид']}
                  />
                  <Field
                    label="Місто"
                    value={draft.city || ''}
                    onChange={(e) => patch('city', e.target.value)}
                  />
                  <Picker
                    label="Мета"
                    value={draft.goal}
                    onChange={(v) => patch('goal', v)}
                    options={[
                      'НМТ',
                      'Шкільна програма',
                      'Розмовна практика',
                      'Університетські предмети',
                      'Підготовка до вступу',
                    ]}
                    all
                  />
                  <button
                    className="button primary"
                    disabled={busy}
                    onClick={save}
                  >
                    {t('Зберегти зміни')}
                  </button>
                </div>
              </TabsContent>
              <TabsContent value="notifications">
                <h2>{t('Сповіщення')}</h2>
                <p>
                  Збережені налаштування застосовуватимуться після підключення
                  сервісу сповіщень.
                </p>
                {[
                  'Нові повідомлення',
                  'Нові рекомендації',
                  'Зміни ціни',
                  'Відповіді репетиторів',
                  'Системні повідомлення',
                ].map((n) => (
                  <label className="switch-row" key={n}>
                    <span>{n}</span>
                    <Switch
                      checked={draft.notifications?.[n] ?? true}
                      onCheckedChange={(v) =>
                        patch('notifications', {
                          ...draft.notifications,
                          [n]: v,
                        })
                      }
                    />
                  </label>
                ))}
                <button
                  className="button primary"
                  disabled={busy}
                  onClick={save}
                >
                  {t('Зберегти зміни')}
                </button>
              </TabsContent>
              <TabsContent value="security">
                <h2>{t('Безпека')}</h2>
                <label className="switch-row" htmlFor="profile-privacy">
                  <span>Приховати контактні дані у профілі</span>
                  <Switch
                    id="profile-privacy"
                    checked={draft.private ?? true}
                    onCheckedChange={(v) => patch('private', v)}
                  />
                </label>
                <h3>Активні сесії</h3>
                <div className="security-session">
                  <Monitor size={24} />
                  <div>
                    <strong>Поточний доступ до сайту</strong>
                    <p>
                      Сесією керує платформа Sites. Окремі сесії Google / Apple
                      ще не створюються.
                    </p>
                  </div>
                </div>
                <h3>Заблоковані користувачі</h3>
                {draft.blocked?.length ? (
                  draft.blocked.map((id) => (
                    <div key={id} className="switch-row">
                      <span>
                        {allTutors.find((t) => t.id === id)?.name || id}
                      </span>
                      <button
                        className="text-link"
                        onClick={() =>
                          patch(
                            'blocked',
                            draft.blocked?.filter((x) => x !== id),
                          )
                        }
                      >
                        Розблокувати
                      </button>
                    </div>
                  ))
                ) : (
                  <p>Немає заблокованих викладачів.</p>
                )}
                <div className="form-stack">
                  <button
                    className="button primary"
                    disabled={busy}
                    onClick={save}
                  >
                    {t('Зберегти зміни')}
                  </button>
                  <button
                    className="danger-link"
                    onClick={() => setDeleting(true)}
                  >
                    {t('Видалити акаунт')}
                  </button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      )}
      <AlertDialog open={deleting} onOpenChange={setDeleting}>
        <AlertDialogContent>
          <AlertDialogTitle>Видалити демопрофіль?</AlertDialogTitle>
          <AlertDialogDescription>
            Буде видалено твій профіль, обране, списки, повідомлення, записи та
            створений профіль викладача. Цю дію неможливо скасувати.
          </AlertDialogDescription>
          <button className="button outline" onClick={() => setDeleting(false)}>
            Залишити профіль
          </button>
          <button
            className="button danger-btn"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await mutate({ action: 'delete' });
                setDeleting(false);
                flash('Демопрофіль видалено');
              } catch (e) {
                flash((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            Видалити мої дані
          </button>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
export function BecomeTutor() {
  const { t, state, mutate, setAuth } = usePlatform();
  const [step, setStep] = useState(0),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [draft, setDraft] = useState({
      name: state.profile?.name || '',
      image: '',
      university: '',
      specialty: '',
      subject: 'Англійська',
      additionalSubjects: [] as string[],
      experience: 1,
      languages: ['Українська'],
      format: 'Онлайн',
      city: 'Київ',
      price: 400,
      duration: 60,
      days: ['Пн', 'Ср', 'Пт'],
      times: ['17:00', '19:00'],
      description: '',
      method: '',
      gender: 'Жінка',
      goals: ['Шкільна програма'],
      levels: ['Початковий', 'Середній'],
      certificates: [] as { name: string; url: string }[],
    });
  const patch = (
    k: string,
    v: string | number | string[] | { name: string; url: string }[],
  ) => setDraft((d) => ({ ...d, [k]: v }));
  const toggle = (
    k: 'days' | 'times' | 'languages' | 'goals' | 'levels',
    s: string,
    v: boolean,
  ) => patch(k, v ? [...draft[k], s] : draft[k].filter((x) => x !== s));
  const titles = [
    'Особиста інформація',
    'Освіта',
    'Предмети й досвід',
    'Вартість та графік',
    'Про себе',
  ];
  const next = () => {
    setError('');
    if (step === 0 && (!draft.name.trim() || !draft.image))
      return setError('Додай ім’я та фото профілю.');
    if (step === 1 && (!draft.university.trim() || !draft.specialty.trim()))
      return setError('Вкажи університет і спеціальність.');
    if (
      step === 2 &&
      (!draft.languages.length || !draft.goals.length || !draft.levels.length)
    )
      return setError('Обери мови, рівні та цілі навчання.');
    if (
      step === 3 &&
      (!draft.days.length ||
        !draft.times.length ||
        draft.price < 50 ||
        draft.price > 10000 ||
        !draft.city.trim())
    )
      return setError('Вкажи місто, коректну ціну та доступний графік.');
    setStep((s) => s + 1);
  };
  if (!state.profile)
    return (
      <>
        <PageHeading
          title="Ділися знаннями. Змінюй майбутнє."
          description="Стань викладачем Mentorly та знайди своїх учнів."
        />
        <div className="tutor-welcome">
          <span className="ai-icon">
            <GraduationCap size={30} />
          </span>
          <h2>Твій досвід комусь дуже потрібен.</h2>
          <p>
            Розкажи про себе, обери предмет і зручний графік. Учні зможуть
            знайти твій профіль, зберегти його та написати.
          </p>
          <button className="button primary" onClick={() => setAuth(true)}>
            Спочатку створити демопрофіль <ArrowRight size={18} />
          </button>
        </div>
      </>
    );
  return (
    <>
      <PageHeading
        title="Твій профіль репетитора"
        description="Покажи учням, чому навчатися з тобою — хороша ідея."
      />
      <div className="onboarding-layout">
        <aside className="onboarding-steps">
          {titles.map((title, i) => (
            <div
              key={title}
              className={i === step ? 'active' : i < step ? 'done' : ''}
            >
              <span>{i < step ? <Check size={17} /> : i + 1}</span>
              <strong>{t(title)}</strong>
            </div>
          ))}
        </aside>
        <div className="onboarding-form">
          <span className="eyebrow">
            {t('Крок')} {step + 1} / 5
          </span>
          <h2>{t(titles[step])}</h2>
          <Progress value={(step + 1) * 20} />
          <form
            className="form-stack"
            onSubmit={async (e) => {
              e.preventDefault();
              if (step < 4) {
                next();
                return;
              }
              if (draft.description.length < 40 || draft.method.length < 40) {
                setError('Напиши принаймні 40 символів про себе та методику.');
                return;
              }
              setBusy(true);
              setError('');
              try {
                const v = await mutate({
                  action: 'tutor',
                  data: {
                    ...draft,
                    education: draft.university + ' · ' + draft.specialty,
                  },
                });
                window.location.assign('/tutors/' + v.id);
              } catch (e) {
                setError((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            {step === 0 && (
              <>
                <Field
                  label="Ім’я та прізвище"
                  required
                  value={draft.name}
                  onChange={(e) => patch('name', e.target.value)}
                  maxLength={100}
                />
                {draft.image && (
                  <Image
                    width={800}
                    height={800}
                    unoptimized
                    className="onboard-photo"
                    src={draft.image}
                    alt="Фото профілю"
                  />
                )}
                <UploadField
                  label="Фото профілю"
                  image
                  onUploaded={(v) => patch('image', v.url)}
                />
                <Picker
                  label="Стать викладача"
                  value={draft.gender}
                  onChange={(v) => patch('gender', v)}
                  options={['Жінка', 'Чоловік']}
                />
              </>
            )}
            {step === 1 && (
              <>
                <Field
                  label="Університет"
                  required
                  value={draft.university}
                  onChange={(e) => patch('university', e.target.value)}
                  placeholder="Назва навчального закладу"
                />
                <Field
                  label="Спеціальність"
                  required
                  value={draft.specialty}
                  onChange={(e) => patch('specialty', e.target.value)}
                />
                <UploadField
                  label="Дипломи та сертифікати"
                  onUploaded={(v) =>
                    patch('certificates', [...draft.certificates, v])
                  }
                />
                {draft.certificates.map((c) => (
                  <div className="file-row" key={c.url}>
                    <FileCheck size={16} />
                    <Link href={c.url}>{c.name}</Link>
                    <button
                      type="button"
                      aria-label={'Видалити ' + c.name}
                      onClick={() =>
                        patch(
                          'certificates',
                          draft.certificates.filter((x) => x.url !== c.url),
                        )
                      }
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <p className="demo-note">
                  Документи необов’язкові. Значок підтвердження з’явиться після
                  перевірки — завантаження саме по собі не підтверджує освіту.
                </p>
              </>
            )}
            {step === 2 && (
              <>
                <Picker
                  label="Предмет"
                  value={draft.subject}
                  onChange={(v) => patch('subject', v)}
                  options={subjects}
                />
                <span className="field-title">Додаткові предмети</span>
                <div className="checkbox-grid">
                  {subjects
                    .filter((s) => s !== draft.subject)
                    .map((s) => (
                      <CheckChoice
                        key={s}
                        label={s}
                        checked={draft.additionalSubjects.includes(s)}
                        onChange={(v) =>
                          patch(
                            'additionalSubjects',
                            v
                              ? [...draft.additionalSubjects, s]
                              : draft.additionalSubjects.filter((x) => x !== s),
                          )
                        }
                      />
                    ))}
                </div>
                <Field
                  label="Досвід, років"
                  type="number"
                  min={0}
                  max={60}
                  required
                  value={draft.experience}
                  onChange={(e) => patch('experience', Number(e.target.value))}
                />
                <span className="field-title">Мови викладання</span>
                <div className="checkbox-grid">
                  {['Українська', 'English', 'Polski'].map((s) => (
                    <CheckChoice
                      key={s}
                      label={s}
                      checked={draft.languages.includes(s)}
                      onChange={(v) => toggle('languages', s, v)}
                    />
                  ))}
                </div>
                <span className="field-title">Цілі учнів</span>
                <div className="checkbox-grid">
                  {[
                    'НМТ',
                    'Шкільна програма',
                    'Розмовна практика',
                    'Університетські предмети',
                    'Підготовка до вступу',
                  ].map((s) => (
                    <CheckChoice
                      key={s}
                      label={s}
                      checked={draft.goals.includes(s)}
                      onChange={(v) => toggle('goals', s, v)}
                    />
                  ))}
                </div>
                <span className="field-title">Рівень знань</span>
                <div className="checkbox-grid">
                  {['Початковий', 'Середній', 'Просунутий'].map((s) => (
                    <CheckChoice
                      key={s}
                      label={s}
                      checked={draft.levels.includes(s)}
                      onChange={(v) => toggle('levels', s, v)}
                    />
                  ))}
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <div className="form-two">
                  <Picker
                    label="Формат"
                    value={draft.format}
                    onChange={(v) => patch('format', v)}
                    options={['Онлайн', 'Офлайн', 'Гібрид']}
                  />
                  <Field
                    label="Місто"
                    required
                    value={draft.city}
                    onChange={(e) => patch('city', e.target.value)}
                  />
                  <Field
                    label="Ціна, ₴ за заняття"
                    type="number"
                    min={50}
                    max={10000}
                    required
                    value={draft.price}
                    onChange={(e) => patch('price', Number(e.target.value))}
                  />
                  <Picker
                    label="Тривалість"
                    value={String(draft.duration)}
                    onChange={(v) => patch('duration', Number(v))}
                    options={['30', '45', '60', '90']}
                  />
                </div>
                <span className="field-title">Доступні дні</span>
                <div className="checkbox-grid">
                  {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map((s) => (
                    <CheckChoice
                      key={s}
                      label={s}
                      checked={draft.days.includes(s)}
                      onChange={(v) => toggle('days', s, v)}
                    />
                  ))}
                </div>
                <span className="field-title">Час початку занять · Київ</span>
                <div className="checkbox-grid">
                  {['10:00', '14:00', '17:00', '19:00'].map((s) => (
                    <CheckChoice
                      key={s}
                      label={s}
                      checked={draft.times.includes(s)}
                      onChange={(v) => toggle('times', s, v)}
                    />
                  ))}
                </div>
              </>
            )}
            {step === 4 && (
              <>
                <label className="field">
                  <span>{t('Про себе')}</span>
                  <textarea
                    className="text-area"
                    required
                    minLength={40}
                    maxLength={3000}
                    value={draft.description}
                    onChange={(e) => patch('description', e.target.value)}
                    placeholder="Розкажи про себе та свій досвід. Що тебе надихає викладати?"
                  />
                </label>
                <label className="field">
                  <span>{t('Методика')}</span>
                  <textarea
                    className="text-area"
                    required
                    minLength={40}
                    maxLength={3000}
                    value={draft.method}
                    onChange={(e) => patch('method', e.target.value)}
                    placeholder="Як проходить заняття? Як ти допомагаєш учням досягати мети?"
                  />
                </label>
                <div className="publish-summary">
                  <Check size={20} />
                  <p>
                    Профіль з’явиться в каталозі цього приватного демосайту.
                    Освіта позначатиметься як неперевірена.
                  </p>
                </div>
              </>
            )}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <div className="form-actions">
              {step > 0 && (
                <button
                  type="button"
                  className="button outline"
                  onClick={() => {
                    setError('');
                    setStep((s) => s - 1);
                  }}
                >
                  <ArrowLeft size={17} />
                  {t('Назад')}
                </button>
              )}
              <button className="button primary" disabled={busy}>
                {busy
                  ? 'Зберігаємо…'
                  : t(step === 4 ? 'Опублікувати профіль' : 'Далі')}
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
export function PlatformScreen({
  screen,
  id,
  initialQuery,
  initialSubject,
  initialTab,
  initialContact,
}: {
  screen: string;
  id?: string;
  initialQuery?: string;
  initialSubject?: string;
  initialTab?: string;
  initialContact?: boolean;
}) {
  const { loading } = usePlatform();
  return (
    <AppShell screen={screen}>
      {loading && ['profile', 'become-tutor'].includes(screen) ? (
        <Skeleton className="h-96 rounded-xl" />
      ) : screen === 'explore' ? (
        <Explore />
      ) : screen === 'search' ? (
        <SearchPage
          key={(initialQuery || '') + (initialSubject || '')}
          initialQuery={initialQuery}
          initialSubject={initialSubject}
        />
      ) : screen === 'favorites' ? (
        <Favorites />
      ) : screen === 'profile' ? (
        <SettingsPage key={initialTab} initialTab={initialTab} />
      ) : screen === 'become-tutor' ? (
        <BecomeTutor />
      ) : (
        <TutorDetail
          key={id + String(initialContact)}
          id={id || ''}
          initialContact={initialContact}
        />
      )}
    </AppShell>
  );
}

function formatTutorValue(tutor: Tutor, key: string, t: (v: string) => string) {
  const value = (
    tutor as unknown as Record<string, string | number | string[]>
  )[key];
  return Array.isArray(value) ? value.join(', ') : t(String(value));
}
