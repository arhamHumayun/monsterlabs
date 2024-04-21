import { LandingForm } from "./landing-form";

export default function LandingPage() {

  return (
    <div className="flex flex-col items-center justify-center py-[12vh]">
      <h1 className="mb-3 text-4xl font-medium duration-1000 ease-in-out animate-in fade-in slide-in-from-bottom-3">
        Monster Lab
      </h1>
      <p className="mb-6 text-base text-center italic text-gray-400 duration-1200 ease-in-out animate-in fade-in slide-in-from-bottom-4 max-w-lg">
        Describe your creature and we will generate a stat block for you. It could be a monster, a hero, or anything in between.
      </p>

      <div className="w-full max-w-md space-y-4 duration-1200 ease-in-out animate-in fade-in slide-in-from-bottom-4" >
        <LandingForm/>
      </div>
    </div>
  );
}
