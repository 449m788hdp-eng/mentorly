import { filterTutors, type Filters, type Tutor } from './tutors';
export type SearchResult = { tutor: Tutor; score: number; reasons: string[] };
export interface SearchProvider {
  search(
    query: string,
    tutors: Tutor[],
    filters: Filters,
  ): Promise<{
    mode: string;
    filters: Filters;
    results: SearchResult[];
    unparsed: string[];
  }>;
}
export function parseQuery(query: string): Filters {
  const q = query.toLowerCase();
  const f: Filters = {};
  const patterns: [string, RegExp][] = [
    ['Англійська', /англ|english/],
    ['Математика', /матем|алгеб|геом|math/],
    ['Українська мова', /українськ|украинск/],
    ['Фізика', /фізик|physics/],
    ['Програмування', /програм|python|javascript|coding/],
  ];
  for (const [s, re] of patterns) if (re.test(q)) f.subject = s;
  const max = q.match(/(?:до|under|бюджет(?:ом)?(?:\s+до)?)\s*(\d{2,5})/);
  if (max) f.max = Number(max[1]);
  if (/онлайн|online/.test(q)) f.format = 'Онлайн';
  else if (/офлайн|offline/.test(q)) f.format = 'Офлайн';
  if (/нмт|нмт|nmt/.test(q)) f.goal = 'НМТ';
  else if (/розмов|подорож|спілку|conversation/.test(q))
    f.goal = 'Розмовна практика';
  else if (/університет/.test(q)) f.goal = 'Університетські предмети';
  else if (/шкіл/.test(q)) f.goal = 'Шкільна програма';
  else if (/вступ/.test(q)) f.goal = 'Підготовка до вступу';
  for (const [word, city] of [
    ['киє', 'Київ'],
    ['київ', 'Київ'],
    ['льв', 'Львів'],
    ['одес', 'Одеса'],
    ['харков', 'Харків'],
    ['харків', 'Харків'],
    ['дніпр', 'Дніпро'],
  ])
    if (q.includes(word)) f.city = city;
  const ds: [RegExp, string][] = [
    [/понеділ/, 'Пн'],
    [/вівтор/, 'Вт'],
    [/серед/, 'Ср'],
    [/четвер/, 'Чт'],
    [/п.ятниц/, 'Пт'],
    [/субот/, 'Сб'],
    [/неділ/, 'Нд'],
  ];
  for (const [re, d] of ds) if (re.test(q)) f.day = d;
  if (/вечір|увечері/.test(q)) f.time = '19:00';
  const tm = q.match(/\b(10|14|17|19):00\b/);
  if (tm) f.time = tm[0];
  return f;
}
export const demoSearch: SearchProvider = {
  async search(query, items, manual) {
    const inferred = parseQuery(query),
      filters = {
        ...inferred,
        ...Object.fromEntries(
          Object.entries(manual).filter(
            ([, v]) => v !== '' && v !== undefined && v !== 0,
          ),
        ),
      };
    const results = filterTutors(items, filters).map((t) => ({
      tutor: t,
      score: 100,
      reasons: [
        filters.subject ? `Викладає: ${filters.subject || t.subject}` : '',
        filters.max ? `У бюджеті до ${filters.max} грн` : '',
        filters.goal ? `Працює з метою: ${filters.goal}` : '',
        filters.format ? `Формат: ${t.format}` : '',
        filters.day ? `Доступний день: ${filters.day}` : '',
      ].filter(Boolean),
    }));
    return {
      mode: 'demo',
      filters,
      results,
      unparsed: query
        ? [
            'Демо-пошук розпізнає предмет, бюджет, мету, місто, формат, день та час. Частоту занять і додаткові побажання уточни з викладачем.',
          ]
        : [],
    };
  },
};
