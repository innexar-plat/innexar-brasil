interface BreadcrumbItem {
  name: string;
  url?: string;
  slug?: string;
}

interface StructuredDataBreadcrumbProps {
  items: BreadcrumbItem[];
  baseUrl?: string;
  locale?: string;
}

export default function StructuredDataBreadcrumb({ items }: StructuredDataBreadcrumbProps) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}
