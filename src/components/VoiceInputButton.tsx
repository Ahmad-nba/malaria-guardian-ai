import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import type { Language } from '@/lib/translations';
import { t } from '@/lib/translations';
import { cn } from '@/lib/utils';

interface VoiceInputButtonProps {
  language: Language;
  onResult: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

export function VoiceInputButton({ 
  language, 
  onResult, 
  disabled = false,
  className 
}: VoiceInputButtonProps) {
  const { isListening, isSupported, startListening } = useVoiceInput(language, onResult);

  if (!isSupported) {
    return (
      <Button 
        variant="ghost" 
        size="icon"
        disabled
        className={cn("opacity-30", className)}
        title={t('ussd.voiceNotSupported', language)}
      >
        <MicOff className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={startListening}
      disabled={disabled || isListening}
      className={cn(
        "transition-all",
        isListening && "bg-risk-high/20 animate-pulse",
        className
      )}
      title={isListening ? t('ussd.speakNow', language) : t('ussd.tapToSpeak', language)}
    >
      {isListening ? (
        <Mic className="w-5 h-5 text-risk-high" />
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </Button>
  );
}
