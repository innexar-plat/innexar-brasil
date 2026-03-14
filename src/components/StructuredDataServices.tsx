import React from 'react'

export interface ServiceItem {
  name: string
  description: string
}

interface StructuredDataServicesProps {
  baseUrl: string
  locale: string
  services: ServiceItem[]
}

export default function StructuredDataServices({ baseUrl, locale, services }: StructuredDataServicesProps) {
  if (services.length === 0) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Serviços Innexar',
    description: 'Criação de sites, aplicativos e soluções com inteligência artificial.',
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: service.name,
        description: service.description,
        provider: {
          '@type': 'Organization',
          name: 'Innexar',
          url: baseUrl,
        },
      },
    })),
  }

  return (
    <script
      id="structured-data-services"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
