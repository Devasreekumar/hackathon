import * as React from "react";

import { cn } from "./utils";

const Badge = ({ className, children, variant = "default", ...props }) => {
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", className)} {...props}>
      {children}
    </span>
  );
};

export { Badge };
