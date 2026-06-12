import { Resend } from 'resend';

const FROM = process.env.EMAIL_FROM || 'The Solar Code <noreply@resend.dev>';
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

const COPY = {
  es: {
    subject: 'Recuperá tu contraseña — The Solar Code',
    greeting: (name) => `Hola${name ? ` ${name}` : ''},`,
    body: 'Recibimos una solicitud para restablecer la contraseña de tu cuenta. Hacé clic en el botón para elegir una nueva:',
    btn: 'Restablecer contraseña',
    expiry: 'Este enlace expira en <strong>1 hora</strong>. Si no pediste este cambio, ignorá este email — tu contraseña no se modificará.',
    copy: 'O copiá este enlace en tu navegador:',
  },
  en: {
    subject: 'Reset your password — The Solar Code',
    greeting: (name) => `Hi${name ? ` ${name}` : ''},`,
    body: 'We received a request to reset the password for your account. Click the button below to choose a new one:',
    btn: 'Reset password',
    expiry: 'This link expires in <strong>1 hour</strong>. If you didn\'t request this, you can safely ignore this email — your password won\'t change.',
    copy: 'Or copy this link into your browser:',
  },
};

export async function sendPasswordReset({ to, token, name, lang = 'es' }) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const link = `${APP_URL}/reset-password?token=${token}`;
  const c = COPY[lang] || COPY.es;

  await resend.emails.send({
    from: FROM,
    to,
    subject: c.subject,
    html: `
      <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;color:#1a1a2e;padding:32px 24px">
        <div style="text-align:center;margin-bottom:28px">
          <span style="font-size:32px;color:#c9a84c">☉</span>
          <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:26px;margin:12px 0 4px;color:#1a1a2e">
            The Solar Code
          </h1>
        </div>

        <p style="font-size:16px;line-height:1.6;margin-bottom:16px">
          ${c.greeting(name)}
        </p>
        <p style="font-size:15px;line-height:1.6;color:#444;margin-bottom:28px">
          ${c.body}
        </p>

        <div style="text-align:center;margin-bottom:28px">
          <a href="${link}"
             style="display:inline-block;background:#c9a84c;color:#fff;font-size:15px;font-weight:600;
                    padding:14px 32px;border-radius:8px;text-decoration:none;letter-spacing:.04em">
            ${c.btn}
          </a>
        </div>

        <p style="font-size:13px;color:#888;line-height:1.6;margin-bottom:8px">
          ${c.expiry}
        </p>
        <p style="font-size:12px;color:#aaa">
          ${c.copy}<br/>
          <span style="color:#c9a84c;word-break:break-all">${link}</span>
        </p>
      </div>
    `,
  });
}
