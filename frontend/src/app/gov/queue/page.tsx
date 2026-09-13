import { QueueTable } from "@/components/queue-table";
import { PageHeader } from "@/components/ui";

export default function QueuePage() {
  return (
    <>
      <PageHeader
        title="Investigation queue"
        subtitle="Contracts with post-award changes, ranked by financial variation (35%), evidence gaps (30%), relationship signals (25%) and timeline slippage (10%). Every score comes with a plain-language reason."
      />
      <QueueTable />
    </>
  );
}
