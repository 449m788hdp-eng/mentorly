import { env } from 'cloudflare:workers';
export function db() {
  return (env as unknown as { DB: D1Database }).DB;
}
export function bucket() {
  return (env as unknown as { BUCKET: R2Bucket }).BUCKET;
}
export function identity(req: Request) {
  const user = req.headers.get('oai-authenticated-user-id');
  if (!user) throw new Error('UNAUTHORIZED');
  return user;
}
export function assertOrigin(req: Request) {
  const origin = req.headers.get('origin');
  if (origin && origin !== new URL(req.url).origin)
    throw new Error('FORBIDDEN');
}
export function fail(e: unknown) {
  const m = e instanceof Error ? e.message : 'Помилка сервера';
  const message =
    m === 'UNAUTHORIZED'
      ? 'Увійди для збереження змін'
      : m === 'FORBIDDEN'
        ? 'Доступ заборонено'
        : m.startsWith('D1_')
          ? 'Не вдалося зберегти дані. Спробуй ще раз.'
          : m;
  return Response.json(
    { error: message },
    { status: m === 'UNAUTHORIZED' ? 401 : m === 'FORBIDDEN' ? 403 : 400 },
  );
}
export function textValue(v: unknown, max = 300) {
  if (typeof v !== 'string' || !v.trim() || v.length > max)
    throw new Error('Перевір введені дані');
  return v.trim();
}
export async function body(req: Request): Promise<Record<string, unknown>> {
  const raw = await req.text();
  if (raw.length > 60000) throw new Error('Забагато даних');
  const v: unknown = JSON.parse(raw);
  if (!v || typeof v !== 'object' || Array.isArray(v))
    throw new Error('Невірний запит');
  return v as Record<string, unknown>;
}
export function numberValue(v: unknown, min: number, max: number) {
  if (typeof v !== 'number' || !Number.isFinite(v) || v < min || v > max)
    throw new Error('Перевір числові значення');
  return v;
}
export function strings(v: unknown, allowed?: string[], max = 40) {
  if (
    !Array.isArray(v) ||
    v.length > max ||
    v.some(
      (x) =>
        typeof x !== 'string' ||
        x.length > 150 ||
        (allowed && !allowed.includes(x)),
    )
  )
    throw new Error('Перевір обрані значення');
  return [...new Set(v)] as string[];
}
export function uploadPath(v: unknown) {
  if (v === undefined || v === '') return '';
  if (typeof v !== 'string' || !/^\/api\/upload\?id=[a-f0-9-]{36}$/.test(v))
    throw new Error('Додай файл через завантаження');
  return v;
}
