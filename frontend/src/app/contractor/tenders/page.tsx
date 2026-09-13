import { TenderList } from "@/components/tender-list";
import { PageHeader } from "@/components/ui";

export default function TendersPage() {
  return (
    <>
      <PageHeader
        title="Matched tenders"
        subtitle="Open tenders scored against your capability profile: work history, turnover, registration class, certifications, plant and operating regions."
      />
      <TenderList />
    </>
  );
}
