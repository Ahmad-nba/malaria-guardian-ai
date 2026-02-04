import { usePWA } from "@/hooks/usePWA";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, CheckCircle2, Wifi, WifiOff, Smartphone, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Install = () => {
  const { isInstallable, isInstalled, isOnline, installApp } = usePWA();
  const navigate = useNavigate();

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl text-primary-foreground font-bold">M</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Mukono Health</h1>
          <p className="text-muted-foreground mt-2">Malaria Risk Prioritization System</p>
        </div>

        {/* Connection Status */}
        <div className={`flex items-center justify-center gap-2 mb-6 px-4 py-2 rounded-full w-fit mx-auto ${
          isOnline ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          <span className="text-sm font-medium">
            {isOnline ? 'Connected' : 'Offline Mode Available'}
          </span>
        </div>

        {/* Main Install Card */}
        <Card className="mb-6 shadow-lg border-0">
          <CardHeader className="text-center pb-2">
            <CardTitle className="flex items-center justify-center gap-2">
              {isInstalled ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  App Installed
                </>
              ) : (
                <>
                  <Download className="w-6 h-6 text-primary" />
                  Install App
                </>
              )}
            </CardTitle>
            <CardDescription>
              {isInstalled 
                ? "The app is ready to use offline"
                : "Install for quick access and offline use"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isInstalled ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-green-700 font-medium">✓ App is installed on your device</p>
                <p className="text-green-600 text-sm mt-1">You can close this browser and use the app icon</p>
              </div>
            ) : isInstallable ? (
              <Button 
                onClick={handleInstall}
                className="w-full h-12 text-lg font-semibold"
                size="lg"
              >
                <Download className="w-5 h-5 mr-2" />
                Install Now
              </Button>
            ) : (
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground text-center mb-3">
                  To install on your device:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">1</span>
                    <span><strong>iPhone:</strong> Tap Share → "Add to Home Screen"</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">2</span>
                    <span><strong>Android:</strong> Tap menu (⋮) → "Install app" or "Add to Home Screen"</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features */}
        <div className="space-y-3">
          <h3 className="font-semibold text-center text-muted-foreground">Why Install?</h3>
          
          <div className="grid gap-3">
            <div className="flex items-center gap-3 bg-card p-4 rounded-lg border">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <WifiOff className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Works Offline</p>
                <p className="text-sm text-muted-foreground">Access patient data without internet</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-card p-4 rounded-lg border">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Instant Access</p>
                <p className="text-sm text-muted-foreground">Launch from home screen like any app</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-card p-4 rounded-lg border">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Secure & Private</p>
                <p className="text-sm text-muted-foreground">Data stays on your device</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-card p-4 rounded-lg border">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium">Full Screen</p>
                <p className="text-sm text-muted-foreground">No browser bars, just the app</p>
              </div>
            </div>
          </div>
        </div>

        {/* Continue to App */}
        <div className="mt-8 text-center">
          <Button variant="ghost" onClick={() => navigate('/')}>
            Continue to Dashboard →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Install;
