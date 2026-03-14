import React from 'react'

export interface BreadcrumbItem {
  name: string
  slug: string
}

interface StructuredDataBreadcrumbProps {
  baseUrl: string
  locale: string
  items: BreadcrumbItem[]
}

export default function StructuredDataBreadcrumb({ baseUrl, locale, items }: StructuredDataBreadcrumbProps) {
  const homeUrl = `${baseUrl}/${locale}`
  const itemListElement = [
    {
      '@type': 'ListItem' as const,
      position: 1,
      name: 'Home',
      item: homeUrl,
    },
    ...items.map((item, index) => ({
      '@type': 'ListItem' as const,
      position: index + 2,
      name: item.name,
      item: `${baseUrl}/${locale}${item.slug ? `/${item.slug}` : ''}`,
    })),
  ]

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  }

  return (
    <script
      id="structured-data-breadcrumb-page"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
