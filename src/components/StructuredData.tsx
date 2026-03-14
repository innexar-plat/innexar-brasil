import React from 'react'

interface StructuredDataProps {
  organization: object
  website: object
  localBusiness?: object
  breadcrumb?: object
}

export default function StructuredData({ organization, website, localBusiness, breadcrumb }: StructuredDataProps) {
  return (
    <>
      <script
        id="structured-data-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        id="structured-data-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      {localBusiness != null && (
        <script
          id="structured-data-local-business"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
        />
      )}
      {breadcrumb != null && (
        <script
          id="structured-data-breadcrumb"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
        />
      )}
    </>
  )
}
