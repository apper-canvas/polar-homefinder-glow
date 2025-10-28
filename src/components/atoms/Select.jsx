import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <select
      className={cn(
        "flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;