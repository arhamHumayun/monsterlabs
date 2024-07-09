import CreateCreature from "@/components/create-creature";

export default function Home() {

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-stretch px-4 sm:px-6">
      <CreateCreature />
    </div>
  );
}
