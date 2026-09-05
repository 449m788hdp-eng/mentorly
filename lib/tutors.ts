export type Tutor = {
  id: string;
  name: string;
  subject: string;
  additionalSubjects?: string[];
  image: string;
  price: number;
  rating: number;
  reviews: number;
  experience: number;
  students: number;
  city: string;
  format: string;
  languages: string[];
  gender: string;
  goals: string[];
  levels: string[];
  days: string[];
  times: string[];
  duration: number;
  description: string;
  education: string;
  method: string;
  verified: boolean;
  isNew?: boolean;
  certificates?: { name: string; url: string }[];
};
const common = {
  languages: ['Українська', 'English'],
  levels: ['Початковий', 'Середній', 'Просунутий'],
  days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
  times: ['10:00', '14:00', '17:00', '19:00'],
  duration: 60,
  verified: true,
};
export const tutors: Tutor[] = [
  {
    ...common,
    id: 'olena',
    name: 'Олена Коваль',
    subject: 'Англійська',
    image: '/images/olena.jpg',
    price: 450,
    rating: 4.9,
    reviews: 48,
    experience: 7,
    students: 126,
    city: 'Київ',
    format: 'Онлайн',
    gender: 'Жінка',
    goals: ['НМТ', 'Розмовна практика', 'Підготовка до вступу'],
    description:
      'Допоможу заговорити англійською впевнено. Без нудних правил, зі зрозумілим планом і підтримкою на кожному кроці.',
    education: 'КНУ ім. Тараса Шевченка · Англійська філологія',
    method:
      'Працюємо з реальними ситуаціями, відео й інтерактивними вправами. Після першої зустрічі складаємо особистий план. Для НМТ — регулярна практика тестів та робота над прогалинами.',
  },
  {
    ...common,
    id: 'andrii',
    name: 'Андрій Мельник',
    subject: 'Математика',
    image: '/images/andrii.jpg',
    price: 400,
    rating: 5,
    reviews: 36,
    experience: 5,
    students: 89,
    city: 'Львів',
    format: 'Гібрид',
    gender: 'Чоловік',
    goals: ['НМТ', 'Шкільна програма', 'Університетські предмети'],
    description:
      'Математика, яка нарешті стає зрозумілою. Готуємося до НМТ, розбираємо складні задачі та вчимося мислити.',
    education: 'ЛНУ ім. Івана Франка · Прикладна математика',
    method:
      'Від інтуїції до формули: пояснюю на простих прикладах, разом розв’язуємо задачі й закріплюємо матеріал короткою практикою.',
  },
  {
    ...common,
    id: 'sofia',
    name: 'Софія Бондар',
    subject: 'Українська мова',
    image: '/images/sofia.jpg',
    price: 350,
    rating: 4.9,
    reviews: 62,
    experience: 8,
    students: 154,
    city: 'Київ',
    format: 'Онлайн',
    gender: 'Жінка',
    goals: ['НМТ', 'Шкільна програма', 'Підготовка до вступу'],
    description:
      'Закохую в українську мову. Допомагаю легко запам’ятати правила й упевнено підготуватися до іспитів.',
    education: 'Києво-Могилянська академія · Українська філологія',
    method:
      'Візуальні конспекти, асоціації та багато практики. Кожне заняття має зрозумілу мету й невеликий підсумок.',
  },
  {
    ...common,
    id: 'maksym',
    name: 'Максим Шевченко',
    subject: 'Програмування',
    image: '/images/maksym.jpg',
    price: 650,
    rating: 4.9,
    reviews: 29,
    experience: 6,
    students: 71,
    city: 'Дніпро',
    format: 'Онлайн',
    gender: 'Чоловік',
    goals: ['Університетські предмети', 'Підготовка до вступу'],
    description:
      'Перший рядок коду — перший власний проєкт. Python, JavaScript і зрозумілий шлях від основ до практики.',
    education: 'КПІ ім. Ігоря Сікорського · Комп’ютерні науки',
    method:
      'Навчаємося через власні проєкти. Розбираємо код, практикуємо алгоритми та збираємо перше портфоліо.',
  },
  {
    ...common,
    id: 'mariia',
    name: 'Марія Савчук',
    subject: 'Англійська',
    image: '/images/mariia.jpg',
    price: 550,
    rating: 4.8,
    reviews: 21,
    experience: 4,
    students: 54,
    city: 'Одеса',
    format: 'Гібрид',
    gender: 'Жінка',
    goals: ['Розмовна практика', 'Шкільна програма'],
    description:
      'Англійська для життя, подорожей і нових знайомств. Живе спілкування з першого заняття.',
    education: 'ОНУ ім. І. І. Мечникова · Переклад',
    method:
      'Комунікативний підхід: говоримо, слухаємо та використовуємо нові слова одразу. Підлаштовую темп під тебе.',
    isNew: true,
  },
  {
    ...common,
    id: 'dmytro',
    name: 'Дмитро Ткаченко',
    subject: 'Фізика',
    image: '/images/dmytro.jpg',
    price: 400,
    rating: 4.8,
    reviews: 18,
    experience: 3,
    students: 42,
    city: 'Харків',
    format: 'Онлайн',
    gender: 'Чоловік',
    goals: ['НМТ', 'Шкільна програма', 'Університетські предмети'],
    description:
      'Пояснюю фізику через те, що нас оточує. Розберемося з формулами, задачами й підготовкою до НМТ.',
    education: 'ХНУ ім. В. Н. Каразіна · Фізика',
    method:
      'Поєднуємо експерименти, симуляції та задачі. Вчимося бачити фізику в повсякденному житті.',
    isNew: true,
  },
];
export const subjects = [
  'Англійська',
  'Математика',
  'Українська мова',
  'Фізика',
  'Програмування',
];
export const subjectIcons = ['🇬🇧', '📐', '🇺🇦', '⚛', '💻'];
export const defaultLists = [
  'Хочу написати',
  'Англійська',
  'Математика',
  'Порівняти',
];
export type Filters = {
  subject?: string;
  min?: number;
  max?: number;
  city?: string;
  format?: string;
  gender?: string;
  language?: string;
  experience?: number;
  rating?: number;
  day?: string;
  time?: string;
  duration?: number;
  level?: string;
  goal?: string;
};
export function filterTutors(items: Tutor[], f: Filters) {
  return items.filter(
    (t) =>
      (!f.subject ||
        t.subject === f.subject ||
        !!t.additionalSubjects?.includes(f.subject)) &&
      (!f.min || t.price >= f.min) &&
      (!f.max || t.price <= f.max) &&
      (!f.city || t.city.toLowerCase().includes(f.city.toLowerCase())) &&
      (!f.format || t.format === f.format || t.format === 'Гібрид') &&
      (!f.gender || t.gender === f.gender) &&
      (!f.language || t.languages.includes(f.language)) &&
      (!f.experience || t.experience >= f.experience) &&
      (!f.rating || t.rating >= f.rating) &&
      (!f.day || t.days.includes(f.day)) &&
      (!f.time || t.times.includes(f.time)) &&
      (!f.duration || t.duration === f.duration) &&
      (!f.level || t.levels.includes(f.level)) &&
      (!f.goal || t.goals.includes(f.goal)),
  );
}
