import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables immediately
dotenv.config();

import { sql, initDb } from "./src/lib/db";

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "default_secret_clan_ordem";

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    console.log(`[API Request] ${req.method} ${req.url}`);
  }
  next();
});

// --- API ROUTES ---

let dbInitialized = false;
async function ensureDb() {
  if (!dbInitialized) {
    await initDb().catch(err => console.error('[Database] Init failed:', err));
    dbInitialized = true;
  }
}

// Health check endpoint
app.get("/api/health", async (req, res) => {
  await ensureDb();
  res.json({ status: "ok", message: "Server is running", timestamp: new Date().toISOString() });
});

// Check DB connection
app.get("/api/db-status", async (req, res) => {
  try {
    await sql`SELECT 1`;
    res.json({ status: "connected" });
  } catch (err: any) {
    res.status(503).json({ status: "disconnected", error: err.message });
  }
});

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "Token não fornecido" });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: "Token inválido ou expirado" });
    req.user = user;
    next();
  });
};

// Login Route (Nickname + Password only)
app.post("/api/auth/login", async (req, res) => {
  await ensureDb();
  let { nickname, password } = req.body;
  if (!nickname) return res.status(400).json({ error: "Apelido é obrigatório" });
  if (!password) return res.status(400).json({ error: "Senha é obrigatória" });

  try {
    // Check if user exists as a member (using nickname/name)
    const members = await sql`SELECT * FROM members WHERE name = ${nickname}`;
    if (members.length === 0) {
      return res.status(404).json({ error: "Apelido não encontrado. Por favor, cadastre-se." });
    }

    const member = members[0];
    const email = member.user_id; // Still use email as internal unique ID (stored in user_id)

    // Check password
    const SITE_PASSWORD = process.env.SITE_PASSWORD || "shadow2034";
    const storedPassword = member.password || SITE_PASSWORD;

    if (password !== storedPassword) {
      return res.status(401).json({ error: "Senha de acesso incorreta" });
    }

    // Check if banned
    const banned = await sql`SELECT user_id FROM bans WHERE user_id = ${email}`;
    if (banned.length > 0) return res.status(403).json({ error: "Sua conta está banida" });

    const token = jwt.sign({ uid: email, email: member.email || email, name: member.name }, JWT_SECRET);
    res.json({ token, user: { uid: email, email: member.email || email, name: member.name } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// Registration Route (Email + Nickname + Password)
app.post("/api/auth/register", async (req, res) => {
  await ensureDb();
  let { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json({ error: "Preencha todos os campos: email, nick e senha." });
  }

  email = email.toLowerCase().trim();

  try {
    // Check if user already exists
    const existing = await sql`SELECT user_id FROM members WHERE user_id = ${email}`;
    if (existing.length > 0) {
      return res.status(400).json({ error: "Este email já possui uma conta ativa." });
    }

    // Check if nick is taken
    const nickTaken = await sql`SELECT name FROM members WHERE name = ${name}`;
    if (nickTaken.length > 0) {
      return res.status(400).json({ error: "Este Nickname já está em uso por outro guerreiro." });
    }

    // Create new member
    const isLeader = email === 'ryankevyn3000@gmail.com';
    const role = isLeader ? 'leader' : 'warrior';
    const initialMissions = JSON.stringify(['first_login']);
    
    // Using email as user_id for simplicity in this auth flow
    await sql`
      INSERT INTO members (id, user_id, name, role, completed_missions, xp, password) 
      VALUES (${email}, ${email}, ${name}, ${role}, ${initialMissions}, 15, ${password})
    `;

    const token = jwt.sign({ uid: email, email, name }, JWT_SECRET);
    res.json({ token, user: { uid: email, email, name } });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: "Erro ao criar conta" });
  }
});

// Auth Middleware - Optional version
const optionalAuthenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    next();
    return;
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (!err) {
      req.user = user;
    }
    next();
  });
};

// Get Clan Info
app.get("/api/clan/:id", async (req, res) => {
  await ensureDb();
  try {
    const clan = await sql`SELECT * FROM clans WHERE id = ${req.params.id}`;
    if (clan.length === 0) return res.status(404).json({ error: "Clan not found" });
    const c = clan[0];
    res.json({
      ...c,
      displayId: c.display_id,
      ownerId: c.owner_id,
      trophyCount: c.trophy_count,
      logoUrl: c.logo_url,
      guideImagePost1: c.guide_image_post1
    });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// Update Clan Info
app.patch("/api/clan/:id", authenticateToken, async (req: any, res: any) => {
  await ensureDb();
  const { logo_url, guide_image_post1 } = req.body;
  // Simplified permission check: check if user is leader in next turn
  try {
    // Basic leader check (hardcoded for user's email)
    const isLeader = req.user.email === 'ryankevyn3000@gmail.com';
    if (!isLeader) return res.status(403).json({ error: "Unauthorized" });

    if (logo_url !== undefined) {
      await sql`UPDATE clans SET logo_url = ${logo_url} WHERE id = ${req.params.id}`;
    }
    if (guide_image_post1 !== undefined) {
      await sql`UPDATE clans SET guide_image_post1 = ${guide_image_post1} WHERE id = ${req.params.id}`;
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// Get Members
app.get("/api/clan/:id/members", optionalAuthenticateToken, async (req: any, res: any) => {
  await ensureDb();
  try {
    const members = await sql`
      SELECT * FROM members 
      ORDER BY 
        CASE 
          WHEN role = 'leader' THEN 1 
          WHEN role = 'diplomat' THEN 2 
          WHEN role = 'military_leader' THEN 3
          WHEN role = 'recruiter' THEN 4
          WHEN role = 'muse' THEN 5
          ELSE 6 
        END,
        trophies DESC
    `;

    const requesterUid = req.user?.uid;
    const mappedMembers = [];
    
    for (const m of members) {
      let completed = [];
      try {
        completed = typeof m.completed_missions === 'string' ? JSON.parse(m.completed_missions || '[]') : (m.completed_missions || []);
      } catch (e) {
        completed = [];
      }

      // Lazy-award "Primeiro Contato" ONLY for the requester to keep it fast
      if (requesterUid === m.user_id && !completed.includes('first_login')) {
        completed.push('first_login');
        const newXp = (m.xp || 0) + 15;
        await sql`UPDATE members SET completed_missions = ${JSON.stringify(completed)}, xp = ${newXp} WHERE user_id = ${m.user_id}`;
      }

      mappedMembers.push({
        ...m,
        userId: m.user_id,
        heroPower: m.hero_power,
        completedMissions: completed,
        level: (() => {
          const xp = Number(m.xp || 0);
          if (xp >= 5500) return 10;
          if (xp >= 4500) return 9;
          if (xp >= 3600) return 8;
          if (xp >= 2800) return 7;
          if (xp >= 2100) return 6;
          if (xp >= 1500) return 5;
          if (xp >= 1000) return 4;
          if (xp >= 600) return 3;
          if (xp >= 300) return 2;
          if (xp >= 100) return 1;
          return 0;
        })(),
        visitedMissionsBoard: m.visited_missions_board,
        lastDailyBonus: m.last_daily_bonus,
        avatarUrl: m.avatar_url,
        joinedAt: m.joined_at,
        premiumPass: m.premium_pass,
        appTheme: m.app_theme,
        chatTheme: m.chat_theme,
        lastCelebratedLevel: m.last_celebrated_level,
        updateRewardClaimed: m.update_reward_claimed,
        profileBg: m.profile_bg,
        profileBorder: m.profile_border,
        opacityLevel: m.opacity_level
      });
    }

    res.json(mappedMembers);
  } catch (err) {
    console.error('Error fetching members:', err);
    res.status(500).json({ error: "Database error" });
  }
});

// Upsert Member (Join or update)
app.post("/api/members", authenticateToken, async (req: any, res: any) => {
  await ensureDb();
  const { name } = req.body;
  const userId = req.user.uid;

  try {
    const existing = await sql`SELECT user_id FROM members WHERE user_id = ${userId}`;
    if (existing.length === 0) {
      // Create new member
      const isLeader = req.user.email === 'ryankevyn3000@gmail.com';
      const role = isLeader ? 'leader' : 'warrior';
      
      // Auto-award "Primeiro Contato" mission for new members
      const initialMissions = JSON.stringify(['first_login']);
      
      await sql`
        INSERT INTO members (id, user_id, name, role, completed_missions, xp) 
        VALUES (${userId}, ${userId}, ${name}, ${role}, ${initialMissions}, 15)
      `;
    } else {
      // Update name if changed
      await sql`UPDATE members SET name = ${name} WHERE user_id = ${userId}`;
      
      // Check if they have the mission, if not award it (for existing users who haven't got it)
      const member = await sql`SELECT completed_missions, xp FROM members WHERE user_id = ${userId}`;
      if (member.length > 0) {
        const completed = JSON.parse(member[0].completed_missions || '[]');
        if (!completed.includes('first_login')) {
          completed.push('first_login');
          const newXp = (member[0].xp || 0) + 15;
          await sql`UPDATE members SET completed_missions = ${JSON.stringify(completed)}, xp = ${newXp} WHERE user_id = ${userId}`;
        }
      }
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// Update Member Data
app.patch("/api/members/me", authenticateToken, async (req: any, res: any) => {
  await ensureDb();
  const userId = req.user.uid;
  const updates = req.body;
  
  // This is a simplified direct update. In a real app, you'd validate each field.
  const fields = Object.keys(updates);
  if (fields.length === 0) return res.json({ success: true });

  try {
    // Map cammelCase to snake_case for some fields if needed, 
    // but here we use cammelCase in frontend and snake_case in DB
    // I'll keep them simple for this example.
    
    for (const field of fields) {
      let val = updates[field];
      if (field === 'completedMissions') {
         await sql`UPDATE members SET completed_missions = ${JSON.stringify(val)} WHERE user_id = ${userId}`;
         continue;
      }

      const mapping: Record<string, string> = {
        xp: 'xp',
        trophies: 'trophies',
        donations: 'donations',
        heroPower: 'hero_power',
        diamonds: 'diamonds',
        boxes: 'boxes',
        coins: 'coins',
        status: 'status',
        appTheme: 'app_theme',
        chatTheme: 'chat_theme',
        lastDailyBonus: 'last_daily_bonus',
        visitedMissionsBoard: 'visited_missions_board',
        updateRewardClaimed: 'update_reward_claimed',
        lastCelebratedLevel: 'last_celebrated_level',
        avatarUrl: 'avatar_url',
        profileBg: 'profile_bg',
        profileBorder: 'profile_border',
        opacityLevel: 'opacity_level'
      };
      
      const dbField = mapping[field];
      if (dbField) {
        try {
          if (dbField === 'xp') {
             await sql`UPDATE members SET xp = ${val} WHERE user_id = ${userId}`;
             // Also update level immediately in DB to keep it in sync
             let newLevel = 0;
             const xp = Number(val);
             if (xp >= 5500) newLevel = 10;
             else if (xp >= 4500) newLevel = 9;
             else if (xp >= 3600) newLevel = 8;
             else if (xp >= 2800) newLevel = 7;
             else if (xp >= 2100) newLevel = 6;
             else if (xp >= 1500) newLevel = 5;
             else if (xp >= 1000) newLevel = 4;
             else if (xp >= 600) newLevel = 3;
             else if (xp >= 300) newLevel = 2;
             else if (xp >= 100) newLevel = 1;
             await sql`UPDATE members SET level = ${newLevel} WHERE user_id = ${userId}`;
          }
          else if (dbField === 'trophies') await sql`UPDATE members SET trophies = ${val} WHERE user_id = ${userId}`;
          else if (dbField === 'donations') await sql`UPDATE members SET donations = ${val} WHERE user_id = ${userId}`;
          else if (dbField === 'hero_power') await sql`UPDATE members SET hero_power = ${val} WHERE user_id = ${userId}`;
          else if (dbField === 'diamonds') await sql`UPDATE members SET diamonds = ${val} WHERE user_id = ${userId}`;
          else if (dbField === 'boxes') await sql`UPDATE members SET boxes = ${val} WHERE user_id = ${userId}`;
          else if (dbField === 'coins') await sql`UPDATE members SET coins = ${val} WHERE user_id = ${userId}`;
          else if (dbField === 'status') await sql`UPDATE members SET status = ${val} WHERE user_id = ${userId}`;
          else if (dbField === 'app_theme') await sql`UPDATE members SET app_theme = ${val} WHERE user_id = ${userId}`;
          else if (dbField === 'chat_theme') await sql`UPDATE members SET chat_theme = ${val} WHERE user_id = ${userId}`;
          else if (dbField === 'last_daily_bonus') await sql`UPDATE members SET last_daily_bonus = ${val} WHERE user_id = ${userId}`;
          else if (dbField === 'visited_missions_board') await sql`UPDATE members SET visited_missions_board = ${val} WHERE user_id = ${userId}`;
          else if (dbField === 'update_reward_claimed') await sql`UPDATE members SET update_reward_claimed = ${val} WHERE user_id = ${userId}`;
          else if (dbField === 'last_celebrated_level') await sql`UPDATE members SET last_celebrated_level = ${val} WHERE user_id = ${userId}`;
          else if (dbField === 'avatar_url') await sql`UPDATE members SET avatar_url = ${val} WHERE user_id = ${userId}`;
          else if (dbField === 'profile_bg') await sql`UPDATE members SET profile_bg = ${val} WHERE user_id = ${userId}`;
          else if (dbField === 'profile_border') await sql`UPDATE members SET profile_border = ${val} WHERE user_id = ${userId}`;
          else if (dbField === 'opacity_level') await sql`UPDATE members SET opacity_level = ${val} WHERE user_id = ${userId}`;
        } catch (e) {
          console.error(`Error updating field ${dbField}:`, e);
        }
      }
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Theft Reports
app.get("/api/reports", authenticateToken, async (req: any, res: any) => {
  try {
    const isLeader = req.user.email === 'ryankevyn3000@gmail.com';
    if (!isLeader) return res.status(403).json({ error: "Unauthorized" });

    const reports = await sql`SELECT * FROM theft_reports ORDER BY timestamp DESC`;
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/reports", authenticateToken, async (req: any, res: any) => {
  try {
    const { name, message } = req.body;
    await sql`
      INSERT INTO theft_reports (reporter_id, reporter_name, message) 
      VALUES (${req.user.uid}, ${name || 'Guerreiro'}, ${message || ''})
    `;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

app.delete("/api/reports/:id", authenticateToken, async (req: any, res: any) => {
  try {
    const isLeader = req.user.email === 'ryankevyn3000@gmail.com';
    if (!isLeader) return res.status(403).json({ error: "Unauthorized" });

    await sql`DELETE FROM theft_reports WHERE id = ${req.params.id}`;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// Ban management
app.post("/api/bans", authenticateToken, async (req: any, res: any) => {
  const { userId, reason } = req.body;
  try {
    const isLeader = req.user.email === 'ryankevyn3000@gmail.com';
    if (!isLeader) return res.status(403).json({ error: "Unauthorized" });

    await sql`INSERT INTO bans (user_id, banned_by, reason) VALUES (${userId}, ${req.user.uid}, ${reason})`;
    await sql`DELETE FROM members WHERE user_id = ${userId}`;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// Role Management
app.patch("/api/members/:id/role", authenticateToken, async (req: any, res: any) => {
  const { role } = req.body;
  try {
    const isLeader = req.user.email === 'ryankevyn3000@gmail.com';
    if (!isLeader) return res.status(403).json({ error: "Unauthorized" });

    // Enforce that only ryankevyn3000@gmail.com can be leader
    // If someone tries to promote someone else to leader, we might want to block it
    // or ensure if the leader transfers his power, it's intentional.
    // The user said: "não é para ninguém ser líder além da pessoa que tem o email ryankevyn3000@gmail.com"
    if (role === 'leader' && req.params.id !== 'ryankevyn3000@gmail.com') {
      return res.status(400).json({ error: "Apenas Skadir pode ser o Líder Supremo." });
    }

    await sql`UPDATE members SET role = ${role} WHERE user_id = ${req.params.id}`;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// Delete My Account
app.delete("/api/members/me", authenticateToken, async (req: any, res: any) => {
  const userId = req.user.uid;
  try {
    // Check if leader - user didn't specify what happens if leader deletes account,
    // usually leaders shouldn't be able to delete account before transferring leadership
    // but I'll allow it for now or just delete.
    const isLeader = req.user.email === 'ryankevyn3000@gmail.com';
    if (isLeader) {
      return res.status(400).json({ error: "O Líder Supremo não pode deletar a conta. Transfira a liderança primeiro." });
    }

    await sql`DELETE FROM members WHERE user_id = ${userId}`;
    res.json({ success: true });
  } catch (err) {
    console.error('Delete account error:', err);
    res.status(500).json({ error: "Erro ao deletar conta" });
  }
});

// Catch-all for API routes
app.all("/api/*", (req, res) => {
  res.status(404).json({ 
    error: "API endpoint not found", 
    message: `Attempted to ${req.method} ${req.url}`,
    timestamp: new Date().toISOString()
  });
});

// --- SERVER STARTUP ---

export default app;

async function startServer() {
  if (process.env.VERCEL) {
     return;
  }

  console.log("[Server] Starting initialization sequence...");

  try {
    // Initialize DB in background to not block server startup
    initDb().then(() => {
      console.log("[Database] Initialized successfully.");
    }).catch(err => {
      console.error('[Database] Failed to initialize:', err);
    });

    // Vite or Static file middleware
    if (process.env.NODE_ENV !== "production") {
      console.log("[Server] Configuring Vite middleware (Development)...");
      try {
        const vite = await createViteServer({
          server: { middlewareMode: true },
          appType: "spa",
        });
        app.use(vite.middlewares);
        console.log("[Server] Vite middleware attached.");
      } catch (viteErr) {
        console.error("[Server] Failed to create Vite server:", viteErr);
      }
    } else if (!process.env.VERCEL) {
      console.log("[Server] Configuring static file serving (Production)...");
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    // Global Error Handler
    app.use((err: any, req: any, res: any, next: any) => {
      console.error('[Global Error Handler]:', err);
      if (res.headersSent) return next(err);
      res.status(500).json({ 
        error: "Internal Server Error", 
        message: process.env.NODE_ENV === 'production' ? "Erro interno" : err.message 
      });
    });

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`[Server] ONLINE and listening on http://localhost:${PORT}`);
    });

    server.on('error', (err: any) => {
      console.error('[Server Error]:', err);
    });

  } catch (err) {
    console.error("[Server] Critical failure during startup:", err);
    process.exit(1);
  }
}

// Global process error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Unhandled Rejection] at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception] thrown:', err);
});

startServer();
