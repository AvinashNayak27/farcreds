import { useState, useEffect } from 'react';

export function useDarkMode() {
  // Always use light mode
  const isDarkMode = false;

  // Theme classes helper - always light mode
  const getThemeClasses = () => ({
    background: "bg-white",
    cardBg: "bg-gray-50",
    cardBorder: "border-gray-200",
    text: "text-gray-900",
    textSecondary: "text-gray-600",
    textMuted: "text-gray-500",
    footerBg: "bg-white/95",
    footerBorder: "border-gray-200",
  });

  return {
    isDarkMode,
    themeClasses: getThemeClasses(),
  };
} 