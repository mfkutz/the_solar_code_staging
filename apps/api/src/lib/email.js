import { Resend } from 'resend';

const FROM = process.env.EMAIL_FROM || 'The Solar Code <noreply@resend.dev>';
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

export async function sendPasswordReset({ to, token, name }) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const link = `${APP_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Recuperá tu contraseña — The Solar Code',
    html: `
      <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;color:#1a1a2e;padding:32px 24px">
        <div style="text-align:center;margin-bottom:28px">
          <span style="font-size:32px;color:#c9a84c">☉</span>
          <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:26px;margin:12px 0 4px;color:#1a1a2e">
            The Solar Code
          </h1>
        </div>

        <p style="font-size:16px;line-height:1.6;margin-bottom:16px">
          Hola${name ? ` ${name}` : ''},
        </p>
        <p style="font-size:15px;line-height:1.6;color:#444;margin-bottom:28px">
          Recibimos una solicitud para restablecer la contraseña de tu cuenta.
          Hacé clic en el botón para elegir una nueva:
        </p>

        <div style="text-align:center;margin-bottom:28px">
          <a href="${link}"
             style="display:inline-block;background:#c9a84c;color:#fff;font-size:15px;font-weight:600;
                    padding:14px 32px;border-radius:8px;text-decoration:none;letter-spacing:.04em">
            Restablecer contraseña
          </a>
        </div>

        <p style="font-size:13px;color:#888;line-height:1.6;margin-bottom:8px">
          Este enlace expira en <strong>1 hora</strong>. Si no pediste este cambio, ignorá este email — tu contraseña no se modificará.
        </p>
        <p style="font-size:12px;color:#aaa">
          O copiá este enlace en tu navegador:<br/>
          <span style="color:#c9a84c;word-break:break-all">${link}</span>
        </p>
      </div>
    `,
  });
}
