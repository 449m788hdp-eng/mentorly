import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
  index,
} from 'drizzle-orm/sqlite-core';
export const profiles = sqliteTable('profiles', {
  userId: text('user_id').primaryKey(),
  data: text('data').notNull(),
});
export const favorites = sqliteTable(
  'favorites',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    tutorId: text('tutor_id').notNull(),
    list: text('list').notNull(),
  },
  (t) => [uniqueIndex('idx_favorites_user_tutor').on(t.userId, t.tutorId)],
);
export const lists = sqliteTable(
  'lists',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    name: text('name').notNull(),
  },
  (t) => [index('idx_lists_user').on(t.userId)],
);
export const messages = sqliteTable(
  'messages',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    tutorId: text('tutor_id').notNull(),
    body: text('body').notNull(),
    createdAt: text('created_at').notNull(),
  },
  (t) => [index('idx_messages_user').on(t.userId)],
);
export const bookings = sqliteTable(
  'bookings',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    tutorId: text('tutor_id').notNull(),
    slot: text('slot').notNull(),
    createdAt: text('created_at').notNull(),
  },
  (t) => [
    uniqueIndex('idx_bookings_user_tutor_slot').on(t.userId, t.tutorId, t.slot),
  ],
);
export const tutorProfiles = sqliteTable('tutor_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique(),
  data: text('data').notNull(),
});
export const reviews = sqliteTable(
  'reviews',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    tutorId: text('tutor_id').notNull(),
    rating: integer('rating').notNull(),
    body: text('body').notNull(),
    name: text('name').notNull(),
    createdAt: text('created_at').notNull(),
  },
  (t) => [index('idx_reviews_tutor').on(t.tutorId)],
);
export const uploads = sqliteTable('uploads', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  type: text('type').notNull(),
});
