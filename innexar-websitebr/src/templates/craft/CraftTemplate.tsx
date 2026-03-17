import type { TemplateConfig } from '../types';

interface CraftTemplateProps {
  config: TemplateConfig;
}

export function CraftTemplate({ config }: CraftTemplateProps) {
  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: config.colors.background }}>
      <header style={{ background: config.colors.primary, color: '#fff', padding: '1rem 2rem' }}>
        <h1>{config.businessName}</h1>
      </header>
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2>{config.hero.title}</h2>
        <p>{config.hero.subtitle}</p>
      </main>
      <footer style={{ background: config.colors.secondary, color: '#fff', padding: '1rem', textAlign: 'center' }}>
        <p>{config.footer.copyright}</p>
      </footer>
    </div>
  );
}

export const defaultCraftConfig: Partial<TemplateConfig> = {
  templateId: 'craft',
  templateName: 'Craft',
  colors: {
    primary: '#059669',
    secondary: '#059669cc',
    accent: '#05966999',
    background: '#ffffff',
    backgroundAlt: '#f8fafc',
    text: '#1f2937',
    textMuted: '#6b7280',
  },
};
