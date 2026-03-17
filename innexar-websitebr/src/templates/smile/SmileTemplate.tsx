'use client';

import type { TemplateConfig } from '../types';

interface SmileTemplateProps {
  config: TemplateConfig;
}

export function SmileTemplate({ config }: SmileTemplateProps) {
  return (
    <div style={{ fontFamily: config.fontFamily || 'system-ui', minHeight: '100vh', backgroundColor: config.colors.background }}>
      {/* Header */}
      <header style={{ backgroundColor: config.colors.primary, color: '#fff', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>{config.businessName}</h1>
        <nav style={{ display: 'flex', gap: '1.5rem' }}>
          {config.navigation.map((item) => (
            <a key={item.href} href={item.href} style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>{item.label}</a>
          ))}
        </nav>
      </header>

      {/* Hero */}
      <section style={{ backgroundColor: config.colors.primary, color: '#fff', padding: '5rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>{config.hero.title}</h2>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }}>{config.hero.subtitle}</p>
        <a href={config.hero.cta.href} style={{ backgroundColor: config.colors.accent, color: '#fff', padding: '0.875rem 2rem', borderRadius: '0.75rem', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>{config.hero.cta.text}</a>
      </section>

      {/* Services */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2rem', color: config.colors.text }}>{config.services.title}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {config.services.items.map((service, i) => (
            <div key={i} style={{ backgroundColor: config.colors.backgroundAlt, borderRadius: '1rem', padding: '1.5rem', border: `1px solid ${config.colors.primary}20` }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{service.icon}</div>
              <h3 style={{ color: config.colors.primary, marginBottom: '0.5rem' }}>{service.title}</h3>
              <p style={{ color: config.colors.textMuted, fontSize: '0.9rem' }}>{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section style={{ padding: '4rem 2rem', backgroundColor: config.colors.backgroundAlt }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', color: config.colors.text, marginBottom: '1rem' }}>{config.about.title}</h2>
          <p style={{ color: config.colors.textMuted, lineHeight: 1.7 }}>{config.about.content}</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: config.colors.secondary || config.colors.primary, color: '#fff', padding: '2rem', textAlign: 'center' }}>
        <p style={{ margin: 0, opacity: 0.8 }}>{config.footer.copyright}</p>
      </footer>
    </div>
  );
}

export const defaultSmileConfig: Partial<TemplateConfig> = {
  templateId: 'smile',
  templateName: 'Smile',
  colors: {
    primary: '#0891B2',
    secondary: '#0891B2dd',
    accent: '#0891B2bb',
    background: '#ffffff',
    backgroundAlt: '#f8fafc',
    text: '#1f2937',
    textMuted: '#6b7280',
  },
};
