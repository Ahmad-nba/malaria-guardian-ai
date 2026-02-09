import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Language, languageNames } from '@/lib/translations';

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
  variant?: 'default' | 'compact';
}

export function LanguageSwitcher({ 
  currentLanguage, 
  onLanguageChange,
  variant = 'default'
}: LanguageSwitcherProps) {
  const languages: Language[] = ['en', 'lg', 'sw', 'nyn', 'ach', 'teo'];

  if (variant === 'compact') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1 text-xs bg-terminal-text/10 text-terminal-text hover:bg-terminal-text/20"
          >
            <Globe className="w-3 h-3" />
            {currentLanguage.toUpperCase()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-terminal-bg border-terminal-dim">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang}
              onClick={() => onLanguageChange(lang)}
              className={`text-terminal-text hover:bg-terminal-text/10 cursor-pointer ${
                currentLanguage === lang ? 'bg-terminal-accent/20' : ''
              }`}
            >
              {languageNames[lang]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" className="gap-2 bg-white text-primary font-semibold hover:bg-white/90">
          <Globe className="w-4 h-4" />
          {languageNames[currentLanguage]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => onLanguageChange(lang)}
            className={currentLanguage === lang ? 'bg-accent' : ''}
          >
            {languageNames[lang]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
