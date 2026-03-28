import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings


def send_verification_email(to_email: str, user_name: str, token: str) -> None:
    verify_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"

    html = f"""
    <!DOCTYPE html>
    <html>
    <body style="font-family: sans-serif; background: #0a0b0f; color: #e2e8f0; padding: 40px; margin: 0;">
      <div style="max-width: 500px; margin: 0 auto; background: #111318; border: 1px solid #2e3347; border-radius: 16px; padding: 40px;">
        <h1 style="color: #f5c842; font-size: 24px; margin: 0 0 8px 0;">⚔️ StudyQuest</h1>
        <h2 style="color: #f1f5f9; font-size: 18px; margin: 0 0 24px 0;">Confirme seu email, {user_name}!</h2>
        <p style="color: #94a3b8; margin: 0 0 32px 0; line-height: 1.6;">
          Clique no botão abaixo para ativar sua conta e começar sua jornada de conhecimento.
        </p>
        <a href="{verify_url}"
           style="display: inline-block; background: #f5c842;
                  color: #0a0b0f; font-weight: bold; padding: 14px 32px;
                  border-radius: 8px; text-decoration: none; font-size: 16px;
                  font-family: sans-serif;">
          ⚔️ Verificar Email
        </a>
        <p style="color: #64748b; font-size: 12px; margin: 32px 0 0 0;">
          O link expira em 24 horas. Se você não criou uma conta, ignore este email.
        </p>
        <p style="color: #64748b; font-size: 11px; margin: 8px 0 0 0;">
          Se o botão não funcionar, copie e cole este link no navegador:<br>
          <span style="color: #a78bfa;">{verify_url}</span>
        </p>
      </div>
    </body>
    </html>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "⚔️ Confirme seu email — StudyQuest"
    msg["From"] = f"StudyQuest <{settings.GMAIL_USER}>"
    msg["To"] = to_email
    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(settings.GMAIL_USER, settings.GMAIL_APP_PASSWORD)
        server.sendmail(settings.GMAIL_USER, to_email, msg.as_string())