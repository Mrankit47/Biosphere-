import ClientPage from "./ClientPage";
import { ORGANISMS } from "../_data/organisms";

export function generateStaticParams() {
  return ORGANISMS.map(o => ({ slug: o.id }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ClientPage slug={slug} />;
}
