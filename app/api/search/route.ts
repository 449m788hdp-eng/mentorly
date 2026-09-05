import { tutors, type Filters } from '@/lib/tutors';
import { demoSearch } from '@/lib/search';
import { db, fail, body } from '@/lib/server';
export async function POST(req: Request) {
  try {
    const b = await body(req);
    if (typeof b.query !== 'string' || b.query.length > 2000)
      throw new Error('Запит має бути до 2000 символів');
    const extra = await db()
      .prepare('SELECT data FROM tutor_profiles')
      .all<{ data: string }>();
    const items = [...tutors, ...extra.results.map((t) => JSON.parse(t.data))];
    return Response.json(
      await demoSearch.search(b.query, items, (b.filters || {}) as Filters),
    );
  } catch (e) {
    return fail(e);
  }
}
