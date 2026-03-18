import { Button, Spinner } from "flowbite-react";
import { HiRefresh } from "react-icons/hi";
import { useState, useEffect } from "react";

const RefreshButton = ({ onRefresh, isLoading }) => {
  const [lastVerified, setLastVerified] = useState(new Date());
  const [timeAgo, setTimeAgo] = useState("à l'instant");

  useEffect(() => {
    const updateLabel = () => {
      const now = new Date();
      const diffMs = now - lastVerified;
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins === 0) setTimeAgo("à l'instant");
      else setTimeAgo(`il y a ${diffMins} min`);
    };

    const interval = setInterval(updateLabel, 60000);
    updateLabel();

    return () => clearInterval(interval);
  }, [lastVerified]);

  const handleRefresh = () => {
    if (isLoading) return;
    onRefresh();
    setLastVerified(new Date());
    setTimeAgo("à l'instant");
  };

  return (
    <div className="flex flex-col items-center mt-10 mb-6 animate-premium" style={{ animationDelay: '0.05s' }}>
      <button 
        onClick={handleRefresh} 
        disabled={isLoading}
        className={`group relative flex items-center justify-center space-x-3 px-8 py-4 rounded-3xl font-black text-sm uppercase tracking-widest transition-all duration-500 overflow-hidden ${isLoading ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-black hover:scale-105 active:scale-95 shadow-2xl shadow-slate-900/30'}`}
      >
        <div className="relative z-10 flex items-center">
          {isLoading ? (
            <Spinner aria-label="Loading" size="sm" className="mr-3" />
          ) : (
            <HiRefresh className={`mr-3 h-5 w-5 transition-transform duration-700 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
          )}
          <span>{isLoading ? "Vérification..." : "Vérifier maintenant"}</span>
        </div>
        
        {/* Animated background hint */}
        {!isLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
        )}
      </button>
      
      <div className="mt-4 flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-300">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-200 animate-pulse"></span>
        <span>Dernière vérif : {timeAgo}</span>
      </div>
    </div>
  );
};

export default RefreshButton;
