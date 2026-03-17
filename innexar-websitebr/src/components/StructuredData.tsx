interface StructuredDataProps {
  organization?: object;
  website?: object;
  localBusiness?: object;
  breadcrumb?: object;
  [key: string]: object | undefined;
}

export default function StructuredData({ organization, website, localBusiness, breadcrumb, ...rest }: StructuredDataProps) {
  const schemas = [organization, website, localBusiness, breadcrumb, ...Object.values(rest)].filter(Boolean);

  if (schemas.length === 0) return null;

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
