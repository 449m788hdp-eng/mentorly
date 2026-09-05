import { bucket, db, identity, assertOrigin, fail } from '@/lib/server';
export async function POST(req: Request) {
  try {
    assertOrigin(req);
    const u = identity(req),
      form = await req.formData(),
      file = form.get('file');
    if (
      !(file instanceof File) ||
      file.size > 5 * 1024 * 1024 ||
      !['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(
        file.type,
      )
    )
      throw new Error('Додай JPG, PNG, WebP або PDF до 5 МБ');
    const id = crypto.randomUUID();
    await bucket().put(id, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type },
    });
    await db()
      .prepare('INSERT INTO uploads(id,user_id,name,type) VALUES(?,?,?,?)')
      .bind(id, u, file.name, file.type)
      .run();
    return Response.json({ name: file.name, url: '/api/upload?id=' + id });
  } catch (e) {
    return fail(e);
  }
}
export async function GET(req: Request) {
  try {
    identity(req);
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return new Response('Not found', { status: 404 });
    const row = await db()
      .prepare('SELECT type,name FROM uploads WHERE id=?')
      .bind(id)
      .first<{ type: string; name: string }>();
    const file = row ? await bucket().get(id) : null;
    if (!file) return new Response('Not found', { status: 404 });
    return new Response(file.body, {
      headers: {
        'Content-Type': row!.type,
        'X-Content-Type-Options': 'nosniff',
        'Content-Disposition':
          row!.type === 'application/pdf' ? 'attachment' : 'inline',
      },
    });
  } catch (e) {
    return fail(e);
  }
}
