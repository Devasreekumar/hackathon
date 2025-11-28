import * as React from "react";

const AspectRatio = ({ ratio = 16 / 9, style, className, children, ...props }) => {
  const padding = `${100 / (ratio)}%`;
  return (
    <div className={className} style={{ position: "relative", paddingTop: padding, ...style }} {...props}>
      <div style={{ position: "absolute", inset: 0 }}>{children}</div>
    </div>
  );
};

export { AspectRatio };
