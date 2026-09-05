import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const origin = 'http://localhost:3000';
const headers = {
  Cookie: '__sites_local_auth=1',
  'Content-Type': 'application/json',
  Origin: origin,
};
async function call(action, data = {}, status = 200) {
  const r = await fetch(origin + '/api/state', {
    method: 'POST',
    headers,
    body: JSON.stringify({ action, ...data }),
  });
  const v = await r.json();
  assert.equal(r.status, status, JSON.stringify(v));
  return v;
}
async function state() {
  const r = await fetch(origin + '/api/state', { headers });
  assert.equal(r.status, 200);
  return r.json();
}
let changed = false;
try {
  for (const path of [
    '/',
    '/explore',
    '/search',
    '/favorites',
    '/profile',
    '/become-tutor',
    '/tutors/olena',
  ]) {
    const r = await fetch(origin + path);
    assert.equal(r.status, 200, path);
  }
  assert.equal(
    (await fetch(origin + '/api/state')).status,
    401,
    'Anonymous ownership guard',
  );
  const invalidOrigin = await fetch(origin + '/api/state', {
    method: 'POST',
    headers: { ...headers, Origin: 'https://example.invalid' },
    body: JSON.stringify({ action: 'profile' }),
  });
  assert.equal(invalidOrigin.status, 403);
  const initial = await state();
  assert.equal(
    initial.profile,
    null,
    'Tests require an empty local demo profile',
  );
  let r = await fetch(origin + '/api/search', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query:
        'Мені потрібен репетитор з англійської для НМТ, онлайн, бюджет до 500 грн',
      filters: {},
    }),
  });
  let result = await r.json();
  assert.equal(r.status, 200, JSON.stringify(result));
  assert.equal(result.results.length, 1);
  assert.equal(result.results[0].tutor.id, 'olena');
  assert.equal(result.filters.max, 500);
  assert.equal(result.mode, 'demo');
  r = await fetch(origin + '/api/search', {
    method: 'POST',
    headers,
    body: JSON.stringify({ query: 'Математика до 100 грн', filters: {} }),
  });
  result = await r.json();
  assert.equal(result.results.length, 0);
  const profile = {
    name: 'Smoke Test Student',
    email: 'smoke@example.test',
    role: 'Admin',
    subjects: ['Англійська'],
    budget: 500,
    format: 'Онлайн',
    onboarded: true,
  };
  await call('profile', { data: profile });
  changed = true;
  assert.equal(
    (await state()).profile.role,
    'Student',
    'Client cannot self-promote',
  );
  await call('favorite', { tutorId: 'olena', saved: true });
  await call('favorite', { tutorId: 'andrii', saved: true });
  assert.equal((await state()).favorites.length, 2);
  await call('list', { name: 'Тестовий список' });
  await call('favorite', {
    tutorId: 'olena',
    saved: true,
    list: 'Тестовий список',
  });
  assert.equal(
    (await state()).favorites.find((f) => f.tutor_id === 'olena').list,
    'Тестовий список',
  );
  await call('message', {
    tutorId: 'olena',
    body: 'Привіт! Демонстраційна перевірка повідомлення.',
  });
  assert.equal((await state()).messages.length, 1);
  const date = new Date();
  do {
    date.setUTCDate(date.getUTCDate() + 1);
  } while ([0, 6].includes(date.getUTCDay()));
  const slot = date.toISOString().slice(0, 10) + 'T17:00:00Z';
  const book = await call('booking', { tutorId: 'olena', slot });
  assert.equal((await state()).bookings.length, 1);
  await call('booking', { tutorId: 'olena', slot }, 400);
  await call(
    'booking',
    { tutorId: 'olena', slot: '2020-01-01T17:00:00Z' },
    400,
  );
  await call('cancel', { tutorId: 'olena', id: book.id });
  assert.equal((await state()).bookings.length, 0);
  await call('review', {
    tutorId: 'olena',
    rating: 5,
    body: 'Тестовий відгук для перевірки збереження.',
  });
  assert.equal((await state()).reviews.length, 1);
  await call('review', { tutorId: 'olena', rating: 8, body: 'Invalid' }, 400);
  const form = new FormData();
  form.append(
    'file',
    new Blob([await readFile('public/images/sofia.jpg')], {
      type: 'image/jpeg',
    }),
    'portrait.jpg',
  );
  r = await fetch(origin + '/api/upload', {
    method: 'POST',
    headers: { Cookie: headers.Cookie, Origin: origin },
    body: form,
  });
  const asset = await r.json();
  assert.equal(r.status, 200, JSON.stringify(asset));
  assert.equal((await fetch(origin + asset.url, { headers })).status, 200);
  const teacher = {
    name: 'Тестовий викладач',
    subject: 'Англійська',
    image: asset.url,
    price: 300,
    rating: 5,
    reviews: 100,
    experience: 2,
    students: 100,
    city: 'Київ',
    format: 'Онлайн',
    languages: ['Українська'],
    gender: 'Жінка',
    goals: ['НМТ'],
    levels: ['Початковий'],
    days: ['Пн', 'Ср'],
    times: ['17:00'],
    duration: 60,
    description:
      'Тестовий опис викладача для перевірки повного сценарію платформи.',
    education: 'Тестовий університет · Філологія',
    method:
      'Тестова методика: приклади, вправи та зворотний зв’язок після кожного заняття.',
    verified: true,
    certificates: [],
  };
  const created = await call('tutor', { data: teacher });
  const final = await state();
  assert.equal(final.profile.role, 'Tutor');
  assert.equal(final.tutors[0].verified, false);
  assert.equal(final.tutors[0].reviews, 0);
  assert.equal((await fetch(origin + '/tutors/' + created.id)).status, 200);
  console.log(
    'PASS: 7 routes; auth and origin guards; natural-language matching; empty results; profile; server-owned roles; favorites/lists; messages; booking/cancel/invalid dates; review validation; upload; tutor publication.',
  );
} finally {
  if (changed) {
    await call('delete');
    const cleared = await state();
    assert.equal(cleared.profile, null);
    assert.equal(cleared.tutors.length, 0);
    console.log('PASS: demo test data removed.');
  }
}
