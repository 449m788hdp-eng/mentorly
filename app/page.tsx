'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ArrowUpRight, Sparkles, Check, GraduationCap } from 'lucide-react';
import { usePlatform } from '@/components/platform-context';
import { Brand, TutorCard } from '@/components/platform-ui';
import { SearchBox } from '@/components/platform';
import { subjects, subjectIcons } from '@/lib/tutors';
export default function Home() {
  const { t, locale, setAuth, state, allTutors } = usePlatform();
  const [subject, setSubject] = useState('');
  const begin = () =>
    state.profile ? window.location.assign('/explore') : setAuth(true);
  const hero = {
    uk: (
      <>
        Знайди репетитора,
        <br />з яким навчання
        <br />
        стає <span>простішим.</span>
      </>
    ),
    en: (
      <>
        Find a tutor.
        <br />
        Make learning
        <br />
        feel <span>simpler.</span>
      </>
    ),
    pl: (
      <>
        Znajdź nauczyciela,
        <br />z którym nauka
        <br />
        jest <span>prostsza.</span>
      </>
    ),
  }[locale];
  return (
    <div className="site">
      <header className="topbar">
        <Brand />
        <nav>
          <Link href="/explore">{t('Знайти репетитора')}</Link>
          <Link href="#about">{t('Як це працює')}</Link>
          <Link href="/become-tutor">
            {t('Стати репетитором')}
            <ArrowUpRight size={15} />
          </Link>
        </nav>
        <div className="header-actions">
          <button onClick={begin}>
            {t(state.profile ? 'Профіль' : 'Увійти')}
          </button>
          <button className="button dark-btn" onClick={begin}>
            {t('Почати навчання')}
            <ArrowUpRight size={17} />
          </button>
        </div>
      </header>
      <main className="landing">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="orange-dot" />
              {locale === 'en'
                ? 'YOUR NEXT STEP IS FORWARD'
                : locale === 'pl'
                  ? 'TWÓJ KOLEJNY KROK — NAPRZÓD'
                  : 'Твій наступний крок — уперед'}
            </span>
            <h1>{hero}</h1>
            <p>
              {locale === 'en'
                ? 'The right teacher can change more than your grades — they can change how you feel about learning. Let’s find that person.'
                : locale === 'pl'
                  ? 'Dobry nauczyciel może zmienić nie tylko Twoje oceny, ale także podejście do nauki. Pomożemy Ci go znaleźć.'
                  : 'Правильний викладач може змінити не тільки твої оцінки, а й ставлення до навчання. Ми допоможемо знайти саме такого.'}
            </p>
            <button className="button primary" onClick={begin}>
              {t('Знайти репетитора')}
              <ArrowUpRight size={20} />
            </button>
            <div className="hero-proof">
              <div className="avatar-stack">
                <Image
                  width={800}
                  height={800}
                  unoptimized
                  src="/images/sofia.jpg"
                  alt=""
                />
                <Image
                  width={800}
                  height={800}
                  unoptimized
                  src="/images/maksym.jpg"
                  alt=""
                />
                <Image
                  width={800}
                  height={800}
                  unoptimized
                  src="/images/mariia.jpg"
                  alt=""
                />
              </div>
              <div>
                <span className="proof-stars">★★★★★</span>
                <span className="proof-text">
                  Свій викладач. Твій темп. Твій результат.
                </span>
              </div>
            </div>
          </div>
          <div className="hero-art photo-art">
            <div className="hero-photo hero-photo-one">
              <Image
                width={800}
                height={800}
                unoptimized
                src="/images/sofia.jpg"
                alt="Усміхнена викладачка"
              />
              <div className="hero-photo-caption">
                <span>Софія</span>
                <small>
                  Українська мова <Badge />
                </small>
              </div>
            </div>
            <div className="hero-photo hero-photo-two">
              <Image
                width={800}
                height={800}
                unoptimized
                src="/images/maksym.jpg"
                alt="Викладач програмування"
              />
              <div className="hero-photo-caption">
                <span>Максим</span>
                <small>
                  Програмування <Badge />
                </small>
              </div>
            </div>
            <div className="floating-match">
              <span className="ai-icon">
                <Sparkles size={21} />
              </span>
              <div>
                <strong>Це твій match!</strong>
                <small>Навчання починається з контакту</small>
              </div>
            </div>
            <div className="floating-note">
              <span className="green-check">
                <Check size={20} />
              </span>
              <div>
                <strong>«Ось тепер зрозуміло!»</strong>
                <small>Твоє улюблене відчуття після заняття</small>
              </div>
            </div>
            <span className="hero-spark">
              <Sparkles size={37} strokeWidth={1.3} />
            </span>
          </div>
        </section>
        <SearchBox />
        <section id="tutors" className="featured">
          <div className="section-heading">
            <div>
              <span className="eyebrow">ЛЮДИ, ЯКІ НАДИХАЮТЬ</span>
              <h2>{t('Твій викладач десь поруч')}</h2>
            </div>
            <Link href="/explore">
              {t('Усі репетитори')}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="subject-chips">
            {['', ...subjects].map((s, i) => (
              <button
                className={subject === s ? 'active' : ''}
                key={s}
                onClick={() => setSubject(s)}
              >
                {s ? subjectIcons[i - 1] + ' ' + t(s) : t('Усі предмети')}
              </button>
            ))}
          </div>
          <div className="tutor-grid">
            {allTutors
              .filter((t) => !subject || t.subject === subject)
              .slice(0, 4)
              .map((t) => (
                <TutorCard key={t.id} tutor={t} />
              ))}
          </div>
          <p className="catalog-note">
            Демонстраційний каталог: імена, оцінки та досвід вигадані. Фото —
            ілюстративні.
          </p>
        </section>
        <section id="about" className="about">
          <div>
            <span className="eyebrow">ЩО ЦЕ ЗА ПЛАТФОРМА?</span>
            <h2>
              Навчання починається
              <br />з контакту.
            </h2>
          </div>
          <p>
            Mentorly — відкрита платформа для учнів, студентів та викладачів.
            Шукай за предметом, бюджетом, досвідом і форматом. Знайомся,
            порівнюй та обирай свого репетитора.
          </p>
        </section>
        <section className="how-steps">
          {[
            [
              '01',
              'Розкажи про свою мету',
              'Обери предмет і фільтри або просто опиши, що тобі потрібно.',
            ],
            [
              '02',
              'Знайди свою людину',
              'Переглянь профілі, збережи обраних і порівняй викладачів.',
            ],
            [
              '03',
              'Зроби перший крок',
              'Напиши викладачу та обери зручний час для знайомства.',
            ],
          ].map(([n, title, desc]) => (
            <div key={n}>
              <span>{n}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </section>
        <section className="teach-banner">
          <div>
            <span className="eyebrow">ЗНАННЯМИ ВАРТО ДІЛИТИСЯ</span>
            <h2>Комусь потрібен саме твій досвід.</h2>
            <p>Створи профіль викладача та допоможи іншим полюбити навчання.</p>
          </div>
          <Link href="/become-tutor" className="button dark-btn">
            {t('Стати репетитором')}
            <GraduationCap size={20} />
          </Link>
        </section>
      </main>
      <footer className="landing-footer">
        <Brand />
        <span>Навчання, яке підходить тобі.</span>
        <div>
          <Link href="/profile">Налаштування</Link>
          <Link href="/explore">Знайти викладача</Link>
          <span>© 2026 Mentorly</span>
        </div>
      </footer>
    </div>
  );
}
function Badge() {
  return <Check size={12} />;
}
