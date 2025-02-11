"use client";

import React from "react";
import { useTheme } from "next-themes";

export const Logo = ({ className }: { className?: string }) => {
  const { theme } = useTheme();

  // Determine colors based on the current theme
  // For light mode: logo color white, background black;
  // For dark mode: logo color black, background white;
  const isLight = theme === "light" || theme === "system";
  const iconColor = isLight ? "#fff" : "#000";
  const bgColor = isLight ? "black" : "white";

  return (
    <div
      className={className}
      style={{
        width: "34px",
        height: "34px",
        backgroundColor: bgColor,
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <g fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <path d="M2 6h4m-4 4h4m-4 4h4m-4 4h4"/>
        <rect width="16" height="20" x="4" y="2" rx="2"/>
        <path d="M9.5 8h5m-5 4H16m-6.5 4H14"/>
    </g>
</svg></div>
  );
};

export default Logo;