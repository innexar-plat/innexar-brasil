"""Email templates and URL builders for customer/staff transactional emails."""

from app.core.config import settings

# Logo URL for email header (hosted on your domain; change if needed)
EMAIL_LOGO_URL = "https://innexar.com.br/logo.png"
DEFAULT_PORTAL_URL = "https://portal.innexar.com.br"
DEFAULT_WORKSPACE_URL = "https://app.innexar.com.br"
SUPPORTED_LOCALES = {"pt", "en", "es"}


def normalize_locale(locale: str | None, default: str = "pt") -> str:
    """Normalize locale to a safe value supported by frontend apps."""
    if not locale:
        return default
    normalized = locale.strip().lower()
    return normalized if normalized in SUPPORTED_LOCALES else default


def _normalize_base_url(url: str | None, fallback: str) -> str:
    """Normalize URL used in templates (avoid empty/trailing slash values)."""
    value = (url or "").strip()
    if not value:
        return fallback
    return value.rstrip("/")


def get_portal_base_url() -> str:
    """Return canonical portal base URL for customer links."""
    if settings.PORTAL_URL:
        return _normalize_base_url(settings.PORTAL_URL, DEFAULT_PORTAL_URL)

    frontend_url = _normalize_base_url(
        getattr(settings, "FRONTEND_URL", None), DEFAULT_PORTAL_URL
    )
    if "portal." in frontend_url:
        return frontend_url
    return DEFAULT_PORTAL_URL


def get_workspace_base_url() -> str:
    """Return canonical workspace app URL for staff links."""
    workspace_url = getattr(settings, "WORKSPACE_URL", None)
    if workspace_url:
        return _normalize_base_url(workspace_url, DEFAULT_WORKSPACE_URL)

    frontend_url = _normalize_base_url(
        getattr(settings, "FRONTEND_URL", None), DEFAULT_WORKSPACE_URL
    )
    if "app." in frontend_url:
        return frontend_url
    return DEFAULT_WORKSPACE_URL


def build_portal_login_url(locale: str | None = None) -> str:
    """Build customer portal login URL."""
    return f"{get_portal_base_url()}/{normalize_locale(locale)}/login"


def build_portal_site_briefing_url(locale: str | None = None) -> str:
    """Build customer portal site briefing URL."""
    return f"{get_portal_base_url()}/{normalize_locale(locale)}/site-briefing"


def build_portal_reset_password_url(token: str, locale: str | None = None) -> str:
    """Build customer portal reset password URL."""
    return f"{get_portal_base_url()}/{normalize_locale(locale)}/reset-password?token={token}"


def build_workspace_reset_password_url(token: str, locale: str | None = None) -> str:
    """Build workspace app reset password URL for staff."""
    return f"{get_workspace_base_url()}/{normalize_locale(locale)}/reset-password?token={token}"


def portal_credentials_email(
    login_url: str,
    recipient_email: str,
    temporary_password: str,
    *,
    after_payment: bool = False,
    briefing_url: str | None = None,
) -> tuple[str, str, str]:
    """Return (subject, plain, html) for customer portal invitation email."""
    subject = "Innexar - Seus dados de acesso ao portal do cliente"
    body_plain = (
        "Olá,\n\n"
        + ("Seu pagamento foi aprovado. " if after_payment else "")
        + "Segue seu acesso ao portal da Innexar:\n\n"
        f"Acesse: {login_url}\n"
        f"E-mail: {recipient_email}\n"
        f"Senha temporária: {temporary_password}\n\n"
        "Recomendamos alterar a senha após o primeiro acesso.\n\n"
    )
    if after_payment and briefing_url:
        body_plain += (
            f"Próximo passo: preencha os dados do seu site em {briefing_url}\n\n"
        )
    body_plain += "- Equipe Innexar"
    body_html = _portal_credentials_html(
        login_url=login_url,
        recipient_email=recipient_email,
        temporary_password=temporary_password,
        after_payment=after_payment,
        briefing_url=briefing_url,
    )
    return subject, body_plain, body_html


def portal_reset_password_email(reset_link: str) -> tuple[str, str, str]:
    """Return (subject, plain, html) for customer reset password email."""
    subject = "Innexar - Redefinição de senha do portal"
    body_plain = (
        "Olá,\n\n"
        "Recebemos uma solicitação para redefinir a senha do seu portal.\n\n"
        "Use o link abaixo para criar uma nova senha (válido por 24 horas):\n"
        f"{reset_link}\n\n"
        "Se você não solicitou esta alteração, ignore este e-mail.\n\n"
        "- Equipe Innexar"
    )
    body_html = _password_reset_html(
        title="Redefinição de senha do portal",
        intro="Recebemos uma solicitação para redefinir sua senha no portal da Innexar.",
        button_label="Redefinir senha",
        reset_link=reset_link,
    )
    return subject, body_plain, body_html


def workspace_reset_password_email(reset_link: str) -> tuple[str, str, str]:
    """Return (subject, plain, html) for staff reset password email."""
    subject = "Innexar - Redefinição de senha do painel administrativo"
    body_plain = (
        "Olá,\n\n"
        "Recebemos uma solicitação para redefinir a senha do painel administrativo.\n\n"
        "Use o link abaixo para criar uma nova senha (válido por 24 horas):\n"
        f"{reset_link}\n\n"
        "Se você não solicitou esta alteração, ignore este e-mail.\n\n"
        "- Equipe Innexar"
    )
    body_html = _password_reset_html(
        title="Redefinição de senha do painel",
        intro="Recebemos uma solicitação para redefinir sua senha no painel administrativo.",
        button_label="Criar nova senha",
        reset_link=reset_link,
    )
    return subject, body_plain, body_html


def _email_header_html(logo_url: str) -> str:
    """Professional header with logo for transactional emails."""
    return f"""
    <tr>
      <td style="padding: 28px 28px 24px; background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%); text-align: center;">
        <a href="https://innexar.com.br" style="text-decoration: none;">
          <img src="{logo_url}" alt="Innexar" width="140" height="40" style="display: inline-block; max-width: 140px; height: auto; border: 0;" />
        </a>
      </td>
    </tr>"""


def _email_footer_html() -> str:
    """Professional footer: signature, company info, legal."""
    return """
    <tr>
      <td style="padding: 24px 28px; background: #f8fafc; border-top: 1px solid #e2e8f0;">
        <p style="margin:0 0 8px; font-size: 14px; font-weight: 600; color: #0f172a;">Equipe Innexar</p>
        <p style="margin:0 0 4px; font-size: 13px; color: #475569;">
          <a href="https://innexar.com.br" style="color: #2563eb; text-decoration: none;">innexar.com.br</a>
        </p>
        <p style="margin: 12px 0 0; font-size: 11px; color: #94a3b8; line-height: 1.4;">
          Este e-mail foi enviado porque você é cliente ou solicitou acesso ao portal. Em caso de dúvidas, responda esta mensagem.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px 28px; background: #f1f5f9; text-align: center;">
        <p style="margin:0; font-size: 11px; color: #94a3b8;">© Innexar. Todos os direitos reservados.</p>
      </td>
    </tr>"""


def _portal_credentials_html(
    login_url: str,
    recipient_email: str,
    temporary_password: str,
    after_payment: bool,
    briefing_url: str | None = None,
) -> str:
    intro = (
        "Seu pagamento foi aprovado. Segue seu acesso ao portal:"
        if after_payment
        else "Segue seu acesso ao portal da Innexar:"
    )
    header = _email_header_html(EMAIL_LOGO_URL)
    footer = _email_footer_html()
    return (
        f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Acesso ao portal</title>
</head>
<body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f1f5f9; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9;">
    <tr>
      <td style="padding: 32px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden;">
          {header}
          <tr>
            <td style="padding: 28px;">
              <p style="margin:0 0 16px; font-size: 15px; line-height: 1.5; color: #475569;">Olá,</p>
              <p style="margin:0 0 24px; font-size: 15px; line-height: 1.5; color: #475569;">{intro}</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin:0 0 12px; font-size: 13px; color: #64748b;">Acesse o portal</p>
                    <p style="margin:0 0 16px; font-size: 15px;"><a href="{login_url}" style="color: #2563eb; text-decoration: none; font-weight: 500;">{login_url}</a></p>
                    <p style="margin:0 0 8px; font-size: 13px; color: #64748b;">E-mail</p>
                    <p style="margin:0 0 16px; font-size: 15px; color: #1e293b;">{recipient_email}</p>
                    <p style="margin:0 0 8px; font-size: 13px; color: #64748b;">Senha temporária</p>
                    <p style="margin:0; font-size: 15px; font-family: ui-monospace, monospace; color: #1e293b; letter-spacing: 0.02em;">{temporary_password}</p>
                  </td>
                </tr>
              </table>
              <p style="margin: 20px 0 0; font-size: 14px; color: #64748b;">Recomendamos alterar a senha após o primeiro acesso.</p>
              <p style="margin: 28px 0 0;">
                <a href="{login_url}" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 500; border-radius: 8px;">Acessar portal</a>
              </p>
              """
        + (
            f'<p style="margin: 24px 0 0; font-size: 14px; color: #475569;">Próximo passo: <a href="{briefing_url}" style="color: #2563eb;">preencha os dados do seu site</a> (nome, serviços, fotos) para começarmos a construção.</p>'
            if briefing_url
            else ""
        )
        + """
            </td>
          </tr>
          """
        + footer
        + """
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""
    )


def _password_reset_html(
    *,
    title: str,
    intro: str,
    button_label: str,
    reset_link: str,
) -> str:
    """Reusable professional HTML template for password reset emails."""
    header = _email_header_html(EMAIL_LOGO_URL)
    footer = _email_footer_html()
    return f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
</head>
<body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f1f5f9; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9;">
    <tr>
      <td style="padding: 32px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden;">
          {header}
          <tr>
            <td style="padding: 28px;">
              <p style="margin:0 0 12px; font-size: 18px; font-weight: 700; color: #0f172a;">{title}</p>
              <p style="margin:0 0 20px; font-size: 15px; line-height: 1.5; color: #475569;">{intro}</p>
              <p style="margin:0 0 20px; font-size: 14px; color: #64748b;">Este link expira em 24 horas.</p>
              <p style="margin: 0 0 20px;">
                <a href="{reset_link}" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 8px;">{button_label}</a>
              </p>
              <p style="margin:0 0 12px; font-size: 13px; color: #64748b;">Se o botão não funcionar, copie e cole este link no navegador:</p>
              <p style="margin:0; font-size: 13px; line-height: 1.4;"><a href="{reset_link}" style="color: #2563eb; text-decoration: none; word-break: break-all;">{reset_link}</a></p>
            </td>
          </tr>
          {footer}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""
