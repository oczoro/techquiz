import { cn } from "@/lib/utils";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import IonHelpCircle from "~icons/ion/help-circle";

const InfoIcon = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <Popover className="relative">
      <PopoverButton className="flex items-center outline-none">
        <IonHelpCircle className="size-6 text-slate-400" />
      </PopoverButton>
      <PopoverPanel
        anchor="bottom"
        className={cn(
          "input-shadow rounded-md border border-slate-300 bg-gradient-to-br from-slate-400/80 to-slate-600/80 p-4 text-sm font-light tracking-wider text-white backdrop-blur",
          className,
        )}
      >
        {children}
      </PopoverPanel>
    </Popover>
  );
};

export default InfoIcon;
