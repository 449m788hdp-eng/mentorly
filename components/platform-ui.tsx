'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, type ReactNode } from 'react';
import {
  GraduationCap,
  Heart,
  ArrowUpRight,
  Star,
  BadgeCheck,
  MapPin,
  ArrowRight,
  Upload,
  LoaderCircle,
  Sparkles,
  Search,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Empty } from '@/components/ui/empty';
import { Progress } from '@/components/ui/progress';
import { usePlatform } from './platform-context';
import { subjects, subjectIcons, type Tutor } from '@/lib/tutors';
export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Mentorly — головна">
      <span className="brand-icon">
        <GraduationCap size={25} />
      </span>
      mentorly<span className="brand-dot">.</span>
    </Link>
  );
}
export function Picker({
  label,
  value,
  onChange,
  options,
  all = false,
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  options: string[];
  all?: boolean;
}) {
  const { t } = usePlatform();
  return (
    <label className="field">
      <span>{t(label)}</span>
      <Select
        value={value || '__all'}
        onValueChange={(v) => onChange(v === '__all' ? '' : String(v))}
      >
        <SelectTrigger aria-label={t(label)} className="picker">
          <SelectValue>{value ? t(value) : t('Усі')}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {all && <SelectItem value="__all">{t('Усі')}</SelectItem>}
          {options.map((x) => (
            <SelectItem key={x} value={x}>
              {t(x)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}
export function Field({
  label,
  ...p
}: React.ComponentProps<typeof Input> & { label: string }) {
  const { t } = usePlatform();
  return (
    <label className="field">
      <span>{t(label)}</span>
      <Input {...p} className={'text-input ' + (p.className || '')} />
    </label>
  );
}
export function CheckChoice({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const { t } = usePlatform();
  return (
    <label className="check-choice">
      <Checkbox checked={checked} onCheckedChange={(v) => onChange(!!v)} />
      {t(label)}
    </label>
  );
}
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className={'modal ' + (wide ? 'modal-wide' : '')}>
        <DialogTitle className="modal-title">{title}</DialogTitle>
        <DialogDescription
          className={description ? 'modal-description' : 'sr-only'}
        >
          {description || title}
        </DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  );
}
export function TutorCard({
  tutor,
  reason,
  compare,
  selected,
  onSelect,
}: {
  tutor: Tutor;
  reason?: string;
  compare?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const { t, favorite, state } = usePlatform(),
    saved = state.favorites.some((f) => f.tutor_id === tutor.id);
  return (
    <article className="tutor-card">
      <div className="tutor-photo">
        <Link href={'/tutors/' + tutor.id}>
          <Image
            width={800}
            height={800}
            unoptimized
            src={tutor.image || '/images/sofia.jpg'}
            alt={tutor.name}
            loading="lazy"
          />
        </Link>
        <span className={'photo-tag ' + (tutor.isNew ? 'new-tag' : '')}>
          <span />
          {tutor.isNew ? 'Новий викладач' : t(tutor.format)}
        </span>
        <button
          className={'heart-button ' + (saved ? 'saved' : '')}
          aria-label={
            (saved ? 'Видалити з обраного: ' : 'Зберегти: ') + tutor.name
          }
          aria-pressed={saved}
          onClick={() => favorite(tutor.id)}
        >
          <Heart size={19} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="tutor-body">
        <div className="name-row">
          <Link href={'/tutors/' + tutor.id}>
            <h3>
              {tutor.name} {tutor.verified && <BadgeCheck size={16} />}
            </h3>
          </Link>
          <span className="rating">
            <Star size={13} fill="currentColor" />
            {tutor.rating ? tutor.rating.toFixed(1) : '—'}
            <small>({tutor.reviews})</small>
          </span>
        </div>
        <span className="subject-label">
          {subjectIcons[subjects.indexOf(tutor.subject)]} {t(tutor.subject)}
        </span>
        <p>{tutor.description}</p>
        <div className="tutor-meta">
          <span>
            <GraduationCap size={14} />
            {tutor.experience} р. досвіду
          </span>
          <span>
            <MapPin size={14} />
            {tutor.city}
          </span>
        </div>
        <div className="tutor-footer">
          <span>
            <strong>{tutor.price} ₴</strong>
            <small> / {tutor.duration} хв</small>
          </span>
          <Link
            href={'/tutors/' + tutor.id}
            aria-label={t('Переглянути профіль') + ': ' + tutor.name}
          >
            <ArrowUpRight size={20} />
          </Link>
        </div>
        <Link className="profile-link" href={'/tutors/' + tutor.id}>
          {t('Переглянути профіль')} <ArrowRight size={14} />
        </Link>
        {reason && (
          <div className="match">
            <Sparkles size={15} />
            <span>{reason}</span>
          </div>
        )}
        {compare && (
          <CheckChoice
            label="Порівняти"
            checked={!!selected}
            onChange={() => onSelect?.()}
          />
        )}
      </div>
    </article>
  );
}
export function EmptyState({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  const { t } = usePlatform();
  return (
    <Empty className="empty-state">
      <Search size={32} />
      <h3>{t(title)}</h3>
      <p>{t(description)}</p>
      {children}
    </Empty>
  );
}
export function UploadField({
  label,
  onUploaded,
  image = false,
}: {
  label: string;
  onUploaded: (v: { url: string; name: string }) => void;
  image?: boolean;
}) {
  const [busy, setBusy] = useState(false),
    [name, setName] = useState('');
  const { flash, t } = usePlatform();
  return (
    <label className="upload-field">
      <Upload size={19} />
      <span>
        {busy ? 'Завантаження…' : name || t(label)}
        <small>
          {image ? 'JPG, PNG, WebP' : 'JPG, PNG, WebP, PDF'} · до 5 МБ
        </small>
      </span>
      <input
        type="file"
        disabled={busy}
        accept={
          image
            ? 'image/jpeg,image/png,image/webp'
            : 'image/jpeg,image/png,image/webp,application/pdf'
        }
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          setBusy(true);
          try {
            const b = new FormData();
            b.append('file', f);
            const r = await fetch('/api/upload', { method: 'POST', body: b });
            const v = (await r.json()) as {
              error?: string;
              url: string;
              name: string;
            };
            if (!r.ok) throw new Error(v.error || 'Помилка завантаження');
            setName(f.name);
            onUploaded(v);
          } catch (e) {
            flash((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      />
    </label>
  );
}
export function AuthFlow() {
  const {
    auth,
    setAuth,
    state,
    mutate,
    flash,
    t,
    error: loadError,
  } = usePlatform();
  const [step, setStep] = useState(0),
    [name, setName] = useState(''),
    [email, setEmail] = useState(''),
    [selected, setSelected] = useState<string[]>([]),
    [budget, setBudget] = useState(500),
    [format, setFormat] = useState('Онлайн'),
    [busy, setBusy] = useState(false),
    [provider, setProvider] = useState('Email'),
    [err, setErr] = useState('');
  async function save() {
    setBusy(true);
    setErr('');
    try {
      await mutate({
        action: 'profile',
        data: {
          ...state.profile,
          name,
          email,
          subjects: selected,
          budget,
          format,
          onboarded: true,
        },
      });
      setAuth(false);
      setStep(0);
      flash('Профіль створено. Знайдемо твого викладача!');
      window.location.href =
        location.pathname === '/become-tutor' ? '/become-tutor' : '/explore';
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      open={auth}
      onClose={() => setAuth(false)}
      title={t(step === 0 ? 'Привіт, раді знайомству!' : 'Мене цікавить')}
      description={
        step === 0
          ? 'Створи профіль, щоб зберігати викладачів і планувати заняття.'
          : 'Кілька деталей — і рекомендації стануть ближчими до тебе.'
      }
    >
      <Progress value={step === 0 ? 35 : 75} />
      {loadError.includes('Увійди') && (
        <a className="button outline" href={demoSignInPath} target="_top">
          Увійти до захищеного демо
        </a>
      )}
      {step === 0 ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStep(1);
          }}
          className="form-stack"
        >
          <div className="social-row">
            <button
              type="button"
              className="social-btn"
              onClick={() => {
                setProvider('Google');
                flash(
                  'Google OAuth ще не підключено. Продовжуй із демопрофілем через email.',
                );
              }}
            >
              <b className="google-g">G</b> Google
            </button>
            <button
              type="button"
              className="social-btn"
              onClick={() => {
                setProvider('Apple');
                flash(
                  'Sign in with Apple ще не підключено. Продовжуй із демопрофілем через email.',
                );
              }}
            >
              <svg
                width="17"
                height="19"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.1 12.3c0-2.6 2.1-3.9 2.2-4-1.2-1.8-3-2-3.7-2-1.6-.2-3.1 1-3.9 1-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.1 2.5-1.8 3.1-.5 7.7 1.2 10.2.8 1.2 1.8 2.5 3.1 2.4 1.2 0 1.7-.8 3.2-.8s2 .8 3.3.8c1.4 0 2.3-1.2 3.1-2.4 1-1.4 1.4-2.8 1.4-2.9-.1 0-2.5-1-2.5-3.9ZM14.5 4.7c.7-.9 1.3-2.1 1.2-3.3-1.1 0-2.4.7-3.2 1.6-.7.8-1.3 2-1.2 3.2 1.2.1 2.4-.6 3.2-1.5Z" />
              </svg>{' '}
              Apple
            </button>
          </div>
          <div className="divider">
            <span>або через email</span>
          </div>
          <Field
            label="Ім’я"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Як до тебе звертатися?"
            maxLength={100}
          />
          <Field
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <p className="demo-note">
            Демонстраційний режим. Google, Apple та email-вхід ще не підключені.
            Пароль не потрібен; дані прив’язані до твого доступу до цього сайту.
          </p>
          <button className="button primary" type="submit">
            {t('Далі')} <ArrowRight size={18} />
          </button>
          {provider !== 'Email' && (
            <small className="muted">
              Обрано {provider}; зараз доступний демопрофіль.
            </small>
          )}
        </form>
      ) : (
        <div className="form-stack">
          <div className="checkbox-grid">
            {subjects.map((s) => (
              <CheckChoice
                key={s}
                label={s}
                checked={selected.includes(s)}
                onChange={(v) =>
                  setSelected(
                    v ? [...selected, s] : selected.filter((x) => x !== s),
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
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
          />
          <Picker
            label="Формат"
            value={format}
            onChange={setFormat}
            options={['Онлайн', 'Офлайн', 'Гібрид']}
          />
          {err && (
            <p role="alert" className="form-error">
              {err}
            </p>
          )}
          <button
            disabled={busy || budget < 50 || budget > 10000}
            className="button primary"
            onClick={save}
          >
            {busy ? (
              <LoaderCircle className="spin" size={18} />
            ) : (
              t('Створити демопрофіль')
            )}
            <ArrowRight size={18} />
          </button>
          <button onClick={() => setStep(0)}>{t('Назад')}</button>
        </div>
      )}
    </Modal>
  );
}

const demoSignInPath = '/signin-with-chatgpt?return_to=/';
