// app/secret/[id]/page.tsx
import SecretClientWrapper from "./SecretClientView";

export default function SecretPage({ params }: { params: { id: string } }) {
  return <SecretClientWrapper id={params.id} />;
}
