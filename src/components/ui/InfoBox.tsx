import React from 'react';

interface InfoBoxProps {
  children: React.ReactNode;
  className?: string;
}

export default function InfoBox({ children, className }: InfoBoxProps) {
  return (
    <div className={`rounded bg-gray-100 p-4 ${className || ''}`}>
      {children}
    </div>
  );
}
