'use client';

export function PageIdentifier({ pageName, className = '' }: { pageName: string, className?: string }) {
  if (process.env.NODE_ENV === 'production') return null;
  
  return (
    <div 
      className={`fixed bottom-0 left-0 bg-black/80 text-white px-2 py-1 text-xs font-mono z-[9999] ${className}`}
      data-page-id={pageName}
    >
      {pageName}
    </div>
  );
}