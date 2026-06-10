const adminEmails = () =>
  (process.env.ADMIN_EMAIL || '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);

export function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'No autenticado' });
  if (!adminEmails().includes(req.user.email.toLowerCase())) {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  next();
}
