import { neon } from '@neondatabase/serverless';

const getSql = () => {
  if (!process.env.DATABASE_URL) {
    return null;
  }
  return neon(process.env.DATABASE_URL);
};

export const sql: any = (...args: any[]) => {
  const instance = getSql();
  if (!instance) {
    throw new Error('Database not configured. Please set DATABASE_URL in the Settings menu (Secrets panel).');
  }
  return (instance as any)(...args);
};

// Add helper for raw identifiers if needed (Neon specific)
sql.fromList = (list: string[]) => {
  const instance = getSql();
  if (!instance) throw new Error('Database not configured');
  return (instance as any).fromList(list);
};

  // Helper to initialize tables
export async function initDb() {
  const db = getSql();
  if (!db) {
    console.warn('Skipping DB init: DATABASE_URL not set.');
    return;
  }
  
  // Create tables first
  await sql`
    CREATE TABLE IF NOT EXISTS clans (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tag TEXT,
      display_id TEXT,
      level INTEGER DEFAULT 1,
      description TEXT,
      capacity INTEGER DEFAULT 50,
      owner_id TEXT,
      trophy_count INTEGER DEFAULT 0,
      logo_url TEXT,
      guide_image_post1 TEXT
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'warrior',
      trophies INTEGER DEFAULT 0,
      donations INTEGER DEFAULT 0,
      hero_power INTEGER DEFAULT 0,
      diamonds INTEGER DEFAULT 0,
      boxes INTEGER DEFAULT 0,
      coins INTEGER DEFAULT 0,
      xp INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      completed_missions TEXT DEFAULT '[]',
      visited_missions_board BOOLEAN DEFAULT FALSE,
      last_daily_bonus TEXT,
      status TEXT DEFAULT 'offline',
      avatar_url TEXT,
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      premium_pass BOOLEAN DEFAULT FALSE,
      app_theme TEXT DEFAULT 'dark',
      chat_theme TEXT DEFAULT 'dark',
      last_celebrated_level INTEGER DEFAULT 0,
      update_reward_claimed BOOLEAN DEFAULT FALSE,
      profile_bg TEXT,
      profile_border TEXT,
      opacity_level INTEGER DEFAULT 80
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS theft_reports (
      id SERIAL PRIMARY KEY,
      reporter_id TEXT NOT NULL,
      reporter_name TEXT NOT NULL,
      message TEXT,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS bans (
      user_id TEXT PRIMARY KEY,
      banned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      banned_by TEXT,
      reason TEXT
    );
  `;

  // Ensure new columns exist for existing tables
  try {
    const membersCols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'members'`;
    const colNames = membersCols.map((c: any) => c.column_name);

    if (!colNames.includes('premium_pass')) await sql`ALTER TABLE members ADD COLUMN premium_pass BOOLEAN DEFAULT FALSE`;
    if (!colNames.includes('app_theme')) await sql`ALTER TABLE members ADD COLUMN app_theme TEXT DEFAULT 'dark'`;
    if (!colNames.includes('chat_theme')) await sql`ALTER TABLE members ADD COLUMN chat_theme TEXT DEFAULT 'dark'`;
    if (!colNames.includes('last_celebrated_level')) await sql`ALTER TABLE members ADD COLUMN last_celebrated_level INTEGER DEFAULT 0`;
    if (!colNames.includes('update_reward_claimed')) await sql`ALTER TABLE members ADD COLUMN update_reward_claimed BOOLEAN DEFAULT FALSE`;
    if (!colNames.includes('profile_bg')) await sql`ALTER TABLE members ADD COLUMN profile_bg TEXT`;
    if (!colNames.includes('profile_border')) await sql`ALTER TABLE members ADD COLUMN profile_border TEXT`;
    if (!colNames.includes('opacity_level')) await sql`ALTER TABLE members ADD COLUMN opacity_level INTEGER DEFAULT 80`;
    if (!colNames.includes('password')) await sql`ALTER TABLE members ADD COLUMN password TEXT`;
    
    const clansCols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'clans'`;
    const clanColNames = clansCols.map((c: any) => c.column_name);
    if (!clanColNames.includes('logo_url')) await sql`ALTER TABLE clans ADD COLUMN logo_url TEXT`;
    if (!clanColNames.includes('guide_image_post1')) await sql`ALTER TABLE clans ADD COLUMN guide_image_post1 TEXT`;

    const theftCols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'theft_reports'`;
    if (!theftCols.map((c: any) => c.column_name).includes('message')) {
      await sql`ALTER TABLE theft_reports ADD COLUMN message TEXT`;
    }
  } catch (e) {
    console.error('Error altering tables:', e);
  }

  await sql`
    CREATE TABLE IF NOT EXISTS bans (
      user_id TEXT PRIMARY KEY,
      banned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      banned_by TEXT,
      reason TEXT
    );
  `;

  // Create default clan if not exists
  const clan = await sql`SELECT id FROM clans WHERE id = 'main-clan'`;
  if (clan.length === 0) {
    await sql`
      INSERT INTO clans (id, name, tag, description) 
      VALUES ('main-clan', 'Ordem Suprema', 'ORDM', 'Clã principal da Ordem Suprema')
    `;
  } else {
    // Force update tag to ORDM if it was OS
    await sql`UPDATE clans SET tag = 'ORDM' WHERE id = 'main-clan' AND (tag = 'OS' OR tag IS NULL)`;
  }
}
