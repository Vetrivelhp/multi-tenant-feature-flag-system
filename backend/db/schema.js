const { sqliteTable, int, text, integer } = require('drizzle-orm/sqlite-core');

const organizations = sqliteTable('organizations', {
  id:   integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
});

const users = sqliteTable('users', {
  id:             integer('id').primaryKey({ autoIncrement: true }),
  email:          text('email').notNull().unique(),
  password:       text('password').notNull(),
  role:           text('role').notNull(),
  organizationId: integer('organization_id').references(() => organizations.id),
});

const featureFlags = sqliteTable('feature_flags', {
  id:             integer('id').primaryKey({ autoIncrement: true }),
  featureKey:     text('feature_key').notNull(),
  enabled:        integer('enabled', { mode: 'boolean' }).notNull().default(false),
  organizationId: integer('organization_id').notNull().references(() => organizations.id),
});

module.exports = { organizations, users, featureFlags };