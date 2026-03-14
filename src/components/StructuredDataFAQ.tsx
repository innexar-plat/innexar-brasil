import React from 'react'

export interface FAQItem {
  question: string
  answer: string
}

interface StructuredDataFAQProps {
  items: FAQItem[]
  locale: string
  baseUrl: string
  pagePath: string
}

export default function StructuredDataFAQ({ items }: StructuredDataFAQProps) {
  if (items.length === 0) return null

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <script
      id="structured-data-faq"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  )
}
