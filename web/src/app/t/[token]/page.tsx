import { TableSession } from "@/components/cafe/TableSession";

type Props = { params: Promise<{ token: string }> };

export default async function TablePage({ params }: Props) {
  const { token } = await params;
  return <TableSession token={token} />;
}
