import { AppShell } from "@/components/app-shell";

export default function GovLayout({ children }: LayoutProps<"/gov">) {
  return <AppShell role="gov">{children}</AppShell>;
}
