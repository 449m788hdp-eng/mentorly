import {
  db,
  identity,
  fail,
  textValue,
  assertOrigin,
  body,
  bucket,
  numberValue,
  strings,
  uploadPath,
} from '@/lib/server';
import { tutors, subjects, defaultLists, type Tutor } from '@/lib/tutors';
export async function GET(req: Request) {
  try {
    const u = identity(req),
      d = db();
    const [p, f, l, m, b, t, r] = await Promise.all([
      d
        .prepare('SELECT data FROM profiles WHERE user_id=?')
        .bind(u)
        .first<{ data: string }>(),
      d
        .prepare('SELECT tutor_id,list FROM favorites WHERE user_id=?')
        .bind(u)
        .all(),
      d
        .prepare('SELECT name FROM lists WHERE user_id=?')
        .bind(u)
        .all<{ name: string }>(),
      d
        .prepare('SELECT * FROM messages WHERE user_id=? ORDER BY created_at')
        .bind(u)
        .all(),
      d
        .prepare('SELECT * FROM bookings WHERE user_id=? ORDER BY slot')
        .bind(u)
        .all(),
      d.prepare('SELECT data FROM tutor_profiles').all<{ data: string }>(),
      d.prepare('SELECT * FROM reviews ORDER BY created_at DESC').all(),
    ]);
    return Response.json({
      profile: p ? JSON.parse(p.data) : null,
      favorites: f.results,
      lists: [...defaultLists, ...l.results.map((x) => x.name)],
      messages: m.results,
      bookings: b.results,
      tutors: t.results.map((x) => JSON.parse(x.data)),
      reviews: r.results,
    });
  } catch (e) {
    return fail(e);
  }
}
export async function POST(req: Request) {
  try {
    assertOrigin(req);
    const u = identity(req),
      b = await body(req),
      d = db(),
      now = new Date().toISOString(),
      id = crypto.randomUUID();
    if (JSON.stringify(b).length > 60000) throw new Error('Забагато даних');
    if (b.action === 'profile') {
      const p = b.data as Record<string, unknown>;
      if (!p || typeof p !== 'object') throw new Error('Невірний профіль');
      const name = textValue(p.name, 100),
        email = textValue(p.email, 200);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        throw new Error('Вкажи коректний email');
      const previous = await d
        .prepare('SELECT data FROM profiles WHERE user_id=?')
        .bind(u)
        .first<{ data: string }>();
      const role = previous ? JSON.parse(previous.data).role : 'Student';
      const data = {
        name,
        email,
        role,
        phone: typeof p.phone === 'string' ? p.phone.slice(0, 30) : '',
        image: uploadPath(p.image),
        subjects: strings(p.subjects || [], subjects),
        budget: p.budget === undefined ? 500 : numberValue(p.budget, 50, 10000),
        format: ['Онлайн', 'Офлайн', 'Гібрид'].includes(String(p.format))
          ? p.format
          : 'Онлайн',
        city: typeof p.city === 'string' ? p.city.slice(0, 100) : '',
        goal: typeof p.goal === 'string' ? p.goal.slice(0, 100) : '',
        onboarded: !!p.onboarded,
        notifications:
          typeof p.notifications === 'object' ? p.notifications : {},
        private: p.private !== false,
        blocked: strings(p.blocked || []),
        viewed: strings(p.viewed || []),
      };
      await d
        .prepare(
          'INSERT INTO profiles(user_id,data) VALUES(?,?) ON CONFLICT(user_id) DO UPDATE SET data=excluded.data',
        )
        .bind(u, JSON.stringify(data))
        .run();
      return Response.json({ ok: true });
    }
    if (b.action === 'delete') {
      const files = await d
        .prepare('SELECT id FROM uploads WHERE user_id=?')
        .bind(u)
        .all<{ id: string }>();
      if (files.results.length)
        await bucket().delete(files.results.map((f) => f.id));
      await d.batch(
        [
          'profiles',
          'favorites',
          'lists',
          'messages',
          'bookings',
          'tutor_profiles',
          'reviews',
          'uploads',
        ].map((table) =>
          d.prepare(`DELETE FROM ${table} WHERE user_id=?`).bind(u),
        ),
      );
      return Response.json({ ok: true });
    }
    if (b.action === 'list') {
      const name = textValue(b.name, 60);
      if (defaultLists.includes(name))
        throw new Error('Такий список уже існує');
      const exists = await d
        .prepare('SELECT id FROM lists WHERE user_id=? AND name=?')
        .bind(u, name)
        .first();
      if (exists) throw new Error('Такий список уже існує');
      await d
        .prepare('INSERT INTO lists(id,user_id,name) VALUES(?,?,?)')
        .bind(id, u, name)
        .run();
      return Response.json({ ok: true });
    }
    if (b.action === 'tutor') {
      const t = b.data as Tutor;
      const name = textValue(t.name, 100);
      textValue(t.description, 3000);
      textValue(t.method, 3000);
      textValue(t.education, 400);
      textValue(t.city, 100);
      strings(t.additionalSubjects || [], subjects);
      numberValue(t.experience, 0, 60);
      numberValue(t.price, 50, 10000);
      if (![30, 45, 60, 90].includes(t.duration))
        throw new Error('Перевір тривалість');
      strings(t.languages, ['Українська', 'English', 'Polski']);
      strings(t.days, ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']);
      strings(t.times, ['10:00', '14:00', '17:00', '19:00']);
      strings(t.levels, ['Початковий', 'Середній', 'Просунутий']);
      strings(t.goals, [
        'НМТ',
        'Шкільна програма',
        'Розмовна практика',
        'Університетські предмети',
        'Підготовка до вступу',
      ]);
      uploadPath(t.image);
      for (const c of t.certificates || []) {
        textValue(c.name, 200);
        uploadPath(c.url);
      }
      if (
        !subjects.includes(t.subject) ||
        !Number.isFinite(t.price) ||
        t.price < 50 ||
        t.price > 10000 ||
        !t.days?.length ||
        !t.times?.length
      )
        throw new Error('Перевір предмет, ціну та графік');
      const existing = await d
        .prepare('SELECT id FROM tutor_profiles WHERE user_id=?')
        .bind(u)
        .first<{ id: string }>();
      const tid = existing?.id || id;
      const data = {
        ...t,
        id: tid,
        name,
        verified: false,
        rating: 0,
        reviews: 0,
        students: 0,
        isNew: true,
      };
      await d
        .prepare(
          'INSERT INTO tutor_profiles(id,user_id,data) VALUES(?,?,?) ON CONFLICT(user_id) DO UPDATE SET data=excluded.data',
        )
        .bind(tid, u, JSON.stringify(data))
        .run();
      const p = await d
        .prepare('SELECT data FROM profiles WHERE user_id=?')
        .bind(u)
        .first<{ data: string }>();
      if (p)
        await d
          .prepare('UPDATE profiles SET data=? WHERE user_id=?')
          .bind(JSON.stringify({ ...JSON.parse(p.data), role: 'Tutor' }), u)
          .run();
      return Response.json({ ok: true, id: tid });
    }
    const tid = textValue(b.tutorId, 100),
      extra = await d
        .prepare('SELECT data FROM tutor_profiles WHERE id=?')
        .bind(tid)
        .first<{ data: string }>(),
      t =
        tutors.find((t) => t.id === tid) ||
        (extra ? JSON.parse(extra.data) : null);
    if (!t) throw new Error('Викладача не знайдено');
    if (b.action === 'favorite') {
      if (b.saved)
        await d
          .prepare(
            'INSERT INTO favorites(id,user_id,tutor_id,list) VALUES(?,?,?,?) ON CONFLICT(user_id,tutor_id) DO UPDATE SET list=excluded.list',
          )
          .bind(
            id,
            u,
            tid,
            typeof b.list === 'string'
              ? textValue(b.list, 60)
              : 'Хочу написати',
          )
          .run();
      else
        await d
          .prepare('DELETE FROM favorites WHERE user_id=? AND tutor_id=?')
          .bind(u, tid)
          .run();
    } else if (b.action === 'message')
      await d
        .prepare(
          'INSERT INTO messages(id,user_id,tutor_id,body,created_at) VALUES(?,?,?,?,?)',
        )
        .bind(id, u, tid, textValue(b.body, 4000), now)
        .run();
    else if (b.action === 'booking') {
      const slot = textValue(b.slot, 100),
        date = new Date(slot);
      if (
        isNaN(+date) ||
        date <= new Date() ||
        date.getTime() > Date.now() + 35 * 86400000
      )
        throw new Error('Обери доступну майбутню дату');
      const day = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][date.getUTCDay()];
      const time = slot.slice(11, 16);
      if (!t.days.includes(day) || !t.times.includes(time))
        throw new Error('Час недоступний');
      const clash = await d
        .prepare('SELECT id FROM bookings WHERE user_id=? AND slot=?')
        .bind(u, slot)
        .first();
      if (clash) throw new Error('На цей час уже є запис');
      await d
        .prepare(
          'INSERT INTO bookings(id,user_id,tutor_id,slot,created_at) VALUES(?,?,?,?,?)',
        )
        .bind(id, u, tid, slot, now)
        .run();
    } else if (b.action === 'cancel')
      await d
        .prepare('DELETE FROM bookings WHERE id=? AND user_id=?')
        .bind(textValue(b.id), u)
        .run();
    else if (b.action === 'review') {
      const rating = Number(b.rating);
      if (!Number.isInteger(rating) || rating < 1 || rating > 5)
        throw new Error('Оцінка від 1 до 5');
      const p = await d
        .prepare('SELECT data FROM profiles WHERE user_id=?')
        .bind(u)
        .first<{ data: string }>();
      await d
        .prepare(
          'INSERT INTO reviews(id,user_id,tutor_id,rating,body,name,created_at) VALUES(?,?,?,?,?,?,?)',
        )
        .bind(
          id,
          u,
          tid,
          rating,
          textValue(b.body, 2000),
          p ? JSON.parse(p.data).name : 'Учень',
          now,
        )
        .run();
    } else throw new Error('Невідома дія');
    return Response.json({ ok: true, id });
  } catch (e) {
    return fail(e);
  }
}
