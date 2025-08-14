import { Separator } from "@/components/ui/separator";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <h1 className="text-lg font-semibold">All creatures</h1>
      <Separator className="mb-4" />
      {children}
    </div>
  );
}