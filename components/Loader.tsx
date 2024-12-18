import { cn } from "@/lib/utils";

const Loader = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex gap-1 text-2xl text-slate-500", className)}>
      <span>Loading</span>
      <span className="text-gradient-brand animate-[bounce_1s_0s_infinite]">
        .
      </span>
      <span className="text-gradient-brand animate-[bounce_1s_100ms_infinite]">
        .
      </span>
      <span className="text-gradient-brand animate-[bounce_1s_200ms_infinite]">
        .
      </span>
    </div>
  );
};

export default Loader;
