require('dotenv').config();
const express = require('express'), helmet = require('helmet'), compression = require('compression'),
    rateLimit = require('express-rate-limit'), { Pool } = require('pg'), crypto = require('crypto'), fs = require('fs'), path = require('path');
const { DATABASE_URL, ADMIN_PASSWORD, SESSION_SECRET, TURNSTILE_SECRET, TURNSTILE_SITE_KEY, PORT = 3000 } = process.env;
if (!DATABASE_URL || !ADMIN_PASSWORD || !SESSION_SECRET) { console.error('Set DATABASE_URL, ADMIN_PASSWORD, SESSION_SECRET (see .env.example)'); process.exit(1); }
const pool = new Pool({ connectionString: DATABASE_URL, ssl: /localhost|127\.0\.0\.1/.test(DATABASE_URL) ? false : { rejectUnauthorized: false } });
const app = express(); app.set('trust proxy', 1);
const ts = !!TURNSTILE_SECRET;
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"], scriptSrc: ["'self'", ...(ts ? ['https://challenges.cloudflare.com'] : [])],
            frameSrc: ts ? ['https://challenges.cloudflare.com'] : ["'none'"], connectSrc: ["'self'"], imgSrc: ["'self'", "data:"], styleSrc: ["'self'"], styleSrcAttr: ["'unsafe-inline'"], fontSrc: ["'self'"], objectSrc: ["'none'"]
        }
    }
}));
app.use(compression()); app.use(express.json({ limit: '20kb' }));

// ---------- helpers ----------
const b64 = s => Buffer.from(s).toString('base64url');
const hmac = s => crypto.createHmac('sha256', SESSION_SECRET).update(s).digest('base64url');
const sign = o => { const p = b64(JSON.stringify(o)); return p + '.' + hmac(p) };
const verify = t => {
    if (typeof t !== 'string') return null; const [p, s] = t.split('.'); if (!p || !s) return null;
    const a = Buffer.from(hmac(p)), b = Buffer.from(s); if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    try { return JSON.parse(Buffer.from(p, 'base64url').toString()) } catch { return null }
};
const cookie = (req, n) => ((req.headers.cookie || '').split(/;\s*/).find(c => c.startsWith(n + '=')) || '').slice(n.length + 1);
const isAdmin = req => { const v = verify(cookie(req, 'ew_admin')); return !!(v && v.exp > Date.now()) };
const safeEq = (a, b) => { const x = crypto.createHash('sha256').update(a).digest(), y = crypto.createHash('sha256').update(b).digest(); return crypto.timingSafeEqual(x, y) };
const needAdmin = (req, res, next) => isAdmin(req) ? next() : res.status(401).json({ error: 'Unauthorized' });

(async () => {
    await pool.query(`CREATE TABLE IF NOT EXISTS leads(
id SERIAL PRIMARY KEY,created_at TIMESTAMPTZ DEFAULT now(),name TEXT NOT NULL,email TEXT NOT NULL,phone TEXT NOT NULL,
company TEXT,city TEXT,service TEXT NOT NULL,budget TEXT,message TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'new',notes TEXT DEFAULT '',ip TEXT);
CREATE INDEX IF NOT EXISTS leads_created ON leads(created_at DESC);`); console.log('DB ready');
})().catch(e => { console.error('DB error', e.message); process.exit(1) });

app.get('/api/config', (q, r) => r.json({ turnstileSiteKey: ts ? (TURNSTILE_SITE_KEY || '') : '' }));
app.get('/api/admin/me', (q, r) => { r.set('Cache-Control', 'no-store'); r.json({ admin: isAdmin(q) }) });
app.get('/robots.txt', (q, r) => r.type('text').send('User-agent: *\nDisallow: /admin\nAllow: /'));
// ---------- public API ----------
app.get('/api/form-token', (req, res) => { res.set('Cache-Control', 'no-store'); res.json({ token: sign({ t: Date.now() }) }) });
const leadLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 5, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many enquiries from your network. Please try again in an hour or WhatsApp us.' } });
const SERVICES = ['AI Receptionist & WhatsApp Agents', 'AI Automation', 'Website Design & Development', 'Web Applications', 'CRM & Integrations', 'SEO & Local SEO', 'Ads & Performance Marketing', 'Maintenance & Support', 'Not sure yet'];
const BUDGETS = ['Under ₹50,000', '₹50,000 – ₹2 lakh', '₹2 – ₹5 lakh', '₹5 lakh+', 'Not decided'];
const clean = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, n);
app.post('/api/leads', leadLimiter, async (req, res) => {
    try {
        const b = req.body || {};
        // spam layer 1: honeypot (bots fill it; we pretend success)
        if (clean(b.website, 100)) return res.json({ ok: true });
        // spam layer 2: signed time-trap token (needs 3s–2h fill time)
        const t = verify(b.token); if (!t || Date.now() - t.t < 3000 || Date.now() - t.t > 7200000) return res.status(400).json({ error: 'Form expired or submitted too fast. Please reload and try again.' });
        // spam layer 3 (optional): Cloudflare Turnstile
        if (ts) {
            const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: new URLSearchParams({ secret: TURNSTILE_SECRET, response: clean(b['cf-turnstile-response'], 2048), remoteip: req.ip }) }).then(r => r.json()).catch(() => ({}));
            if (!r.success) return res.status(400).json({ error: 'Spam check failed. Please try again.' });
        }
        const d = {
            name: clean(b.name, 100), email: clean(b.email, 150).toLowerCase(), phone: clean(b.phone, 20).replace(/[\s-]/g, ''), company: clean(b.company, 120), city: clean(b.city, 80),
            service: clean(b.service, 80), budget: clean(b.budget, 40), message: clean(b.message, 2000)
        };
        const errors = {};
        if (d.name.length < 2) errors.name = 'Please enter your name.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) errors.email = 'Enter a valid email address.';
        if (!/^(\+91|91|0)?[6-9]\d{9}$/.test(d.phone)) errors.phone = 'Enter a valid 10-digit Indian mobile number.';
        if (!SERVICES.includes(d.service)) errors.service = 'Please choose a service.';
        if (d.budget && !BUDGETS.includes(d.budget)) errors.budget = 'Invalid budget option.';
        if (d.message.length < 10) errors.message = 'Tell us a little more (10+ characters).';
        if (b.consent !== true) errors.consent = 'Please accept the privacy notice to continue.';
        if (Object.keys(errors).length) return res.status(422).json({ error: 'Please fix the highlighted fields.', errors });
        d.phone = '+91' + d.phone.slice(-10);
        await pool.query('INSERT INTO leads(name,email,phone,company,city,service,budget,message,ip) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)', [d.name, d.email, d.phone, d.company, d.city, d.service, d.budget, d.message, req.ip]);
        res.json({ ok: true });
    } catch (e) { console.error(e); res.status(500).json({ error: 'Something went wrong on our side. Please WhatsApp or email us.' }) }
});

// ---------- admin API ----------
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, message: { error: 'Too many attempts. Try again in 15 minutes.' } });
app.post('/api/admin/login', loginLimiter, (req, res) => {
    if (!safeEq(String(req.body && req.body.password || ''), ADMIN_PASSWORD)) return res.status(401).json({ error: 'Incorrect password.' });
    const tok = sign({ exp: Date.now() + 8 * 3600 * 1000 });
    res.setHeader('Set-Cookie', `ew_admin=${tok}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`); res.json({ ok: true });
});
app.post('/api/admin/logout', (req, res) => { res.setHeader('Set-Cookie', 'ew_admin=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0'); res.json({ ok: true }) });
const STATUS = ['new', 'contacted', 'qualified', 'won', 'lost'];
app.get('/api/admin/leads', needAdmin, async (req, res) => {
    const w = [], p = []; if (STATUS.includes(req.query.status)) { p.push(req.query.status); w.push(`status=$${p.length}`) }
    if (req.query.q) { p.push('%' + clean(req.query.q, 60) + '%'); w.push(`(name ILIKE $${p.length} OR email ILIKE $${p.length} OR company ILIKE $${p.length} OR phone ILIKE $${p.length})`) }
    const r = await pool.query(`SELECT id,created_at,name,email,phone,company,city,service,budget,message,status,notes FROM leads ${w.length ? 'WHERE ' + w.join(' AND ') : ''} ORDER BY created_at DESC LIMIT 500`, p);
    const c = await pool.query('SELECT status,count(*)::int n FROM leads GROUP BY status'); res.set('Cache-Control', 'no-store'); res.json({ leads: r.rows, counts: c.rows });
});
app.patch('/api/admin/leads/:id', needAdmin, async (req, res) => {
    const id = parseInt(req.params.id, 10), { status, notes } = req.body || {}; if (!id || (status && !STATUS.includes(status))) return res.status(400).json({ error: 'Bad request' });
    const r = await pool.query('UPDATE leads SET status=COALESCE($2,status),notes=COALESCE($3,notes) WHERE id=$1 RETURNING id', [id, status || null, notes == null ? null : clean(notes, 2000)]);
    r.rowCount ? res.json({ ok: true }) : res.status(404).json({ error: 'Not found' });
});
app.delete('/api/admin/leads/:id', needAdmin, async (req, res) => { await pool.query('DELETE FROM leads WHERE id=$1', [parseInt(req.params.id, 10) || 0]); res.json({ ok: true }) });
app.get('/api/admin/export.csv', needAdmin, async (req, res) => {
    const r = await pool.query('SELECT created_at,name,email,phone,company,city,service,budget,status,message,notes FROM leads ORDER BY created_at DESC');
    const q = v => { let s = String(v == null ? '' : v instanceof Date ? v.toISOString() : v); if (/^[=+\-@]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"' };
    res.type('text/csv').attachment('ethixweb-leads.csv').send(['created_at,name,email,phone,company,city,service,budget,status,message,notes', ...r.rows.map(x => Object.values(x).map(q).join(','))].join('\n'));
});

// ---------- serve the built React app ----------
const dist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(dist)) {
    app.use('/assets', express.static(path.join(dist, 'assets'), { maxAge: '1y', immutable: true }));
    app.use(express.static(dist, { maxAge: '1h', index: false }));
    app.get(/^\/(?!api\/).*/, (req, res) => { if (req.path.startsWith('/admin')) res.set('X-Robots-Tag', 'noindex'); res.set('Cache-Control', 'no-cache'); res.sendFile(path.join(dist, 'index.html')) });
}
app.use((e, req, res, next) => { console.error(e); res.status(500).json({ error: 'Server error' }) });
app.listen(PORT, () => console.log('Ethixweb India on :' + PORT));
