import ClientPage from "./ClientPage";
import { RARE_SPECIES } from "../_data/species";

export function generateStaticParams() {
  return RARE_SPECIES.map(s => ({ slug: s.id }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ClientPage slug={slug} />;
}
