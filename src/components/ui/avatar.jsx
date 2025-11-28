import * as React from "react";

const Avatar = ({ className, children, ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

const AvatarImage = ({ src, alt, ...props }) => <img src={src} alt={alt} {...props} />;

const AvatarFallback = ({ children, ...props }) => <div {...props}>{children}</div>;

export { Avatar, AvatarImage, AvatarFallback };
