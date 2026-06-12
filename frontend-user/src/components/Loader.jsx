export default function Loader({ fullScreen = false }) {
  const loaderContent = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-[var(--color-primary-500)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-3 h-3 bg-[var(--color-primary-400)] rounded-full animate-bounce" style={{ animationDelay: '150ms', backgroundColor: '#4ade80' }}></div>
        <div className="w-3 h-3 bg-[var(--color-primary-300)] rounded-full animate-bounce" style={{ animationDelay: '300ms', backgroundColor: '#86efac' }}></div>
      </div>
      <p className="text-sm font-medium text-[var(--color-text-muted)] animate-pulse">Loading amazing toys...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {loaderContent}
      </div>
    );
  }

  return (
    <div className="w-full py-12 flex items-center justify-center">
      {loaderContent}
    </div>
  );
}
