import React from "react";
import { Avatar } from "antd";
import fallbackSrc from "./paldoc.svg"; // Import the fallback image

const OptimizedAvatar = ({ src, size = 50, alt = "avatar" }) => {
  const handleError = (e) => {
    e.target.src = fallbackSrc;
  };

  return (
    <Avatar
      size={size}
      src={
        <img
          src={src || fallbackSrc} // Use fallback if src is missing
          alt={alt}
          style={{
            width: size,
            height: size,
            objectFit: "cover",
            display: "block",
            background: "transparent"
          }}
          onError={handleError} // Handle broken image links
        />
      }
    />
  );
};

export default OptimizedAvatar;
