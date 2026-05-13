import ClientPage from "./ClientPage";
import { VIRUSES } from "../_data/viruses";

export function generateStaticParams() {
  return VIRUSES.map(v => ({ slug: v.id }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ClientPage slug={slug} />;
}
