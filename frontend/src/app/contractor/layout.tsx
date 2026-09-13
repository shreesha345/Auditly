import { AppShell } from "@/components/app-shell";

export default function ContractorLayout({ children }: LayoutProps<"/contractor">) {
  return <AppShell role="contractor">{children}</AppShell>;
}
