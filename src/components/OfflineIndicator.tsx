import { usePWA } from "@/hooks/usePWA";
import { WifiOff, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const OfflineIndicator = () => {
  const { isOnline, isInstallable, isInstalled } = usePWA();
  const navigate = useNavigate();

  if (isOnline && isInstalled) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex flex-col gap-2 max-w-md mx-auto">
      {!isOnline && (
        <div className="bg-amber-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
          <WifiOff className="w-4 h-4" />
          <span>Offline - Changes will sync when connected</span>
        </div>
      )}
      
      {isInstallable && !isInstalled && (
        <Button 
          onClick={() => navigate('/install')}
          className="bg-primary hover:bg-primary/90 shadow-lg"
        >
          <Download className="w-4 h-4 mr-2" />
          Install App for Offline Use
        </Button>
      )}
    </div>
  );
};
