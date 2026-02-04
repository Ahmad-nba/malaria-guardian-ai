import { useState } from 'react';
import { Phone, Send } from 'lucide-react';
import type { USSDData } from '@/types/patient';
import type { Language } from '@/lib/translations';
import { t } from '@/lib/translations';
import { LanguageSwitcher } from './LanguageSwitcher';
import { VoiceInputButton } from './VoiceInputButton';

type USSDStep = 
  | 'idle'
  | 'welcome'
  | 'name'
  | 'age'
  | 'village'
  | 'fever'
  | 'headache'
  | 'bodyaches'
  | 'fatigue'
  | 'bednet'
  | 'confirmation'
  | 'complete';

interface USSDSimulatorProps {
  onSubmit: (name: string, village: string, age: number, data: USSDData) => void;
}

export function USSDSimulator({ onSubmit }: USSDSimulatorProps) {
  const [step, setStep] = useState<USSDStep>('idle');
  const [input, setInput] = useState('');
  const [displayLines, setDisplayLines] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  
  // Form data
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState(0);
  const [village, setVillage] = useState('');
  const [symptoms, setSymptoms] = useState({
    fever: false,
    headache: false,
    bodyAches: false,
    fatigue: false,
    bedNetUsage: false,
  });

  const addLine = (text: string, delay = 0) => {
    setTimeout(() => {
      setDisplayLines(prev => [...prev, text]);
      setIsTyping(false);
    }, delay);
  };

  const typeMessage = (lines: string[]) => {
    setIsTyping(true);
    lines.forEach((line, i) => {
      addLine(line, i * 100);
    });
  };

  const handleDial = () => {
    setDisplayLines([]);
    setStep('welcome');
    typeMessage([
      '════════════════════════',
      `  ${t('ussd.title', language)}`,
      `  ${t('ussd.subtitle', language)}`,
      '════════════════════════',
      '',
      t('ussd.welcome', language),
      '',
      t('ussd.press1', language),
      t('ussd.press2', language),
      '',
    ]);
  };

  const handleVoiceResult = (transcript: string) => {
    // Parse voice input for yes/no responses
    const lower = transcript.toLowerCase();
    let value = transcript;
    
    // Handle yes/no in multiple languages
    if (lower.includes('yes') || lower.includes('yee') || lower.includes('ndiyo') || lower.includes('one') || lower === '1') {
      value = '1';
    } else if (lower.includes('no') || lower.includes('nedda') || lower.includes('hapana') || lower.includes('two') || lower === '2') {
      value = '2';
    }
    
    setInput(value);
  };

  const handleInput = () => {
    if (!input.trim()) return;
    
    const value = input.trim();
    setDisplayLines(prev => [...prev, `> ${value}`]);
    setInput('');

    switch (step) {
      case 'welcome':
        if (value === '1') {
          setStep('name');
          typeMessage([
            '',
            '────────────────────────',
            t('ussd.step1', language),
            '────────────────────────',
            '',
            t('ussd.enterName', language),
            '',
          ]);
        } else if (value === '2') {
          typeMessage([
            '',
            `• ${t('ussd.tipNets', language)}`,
            `• ${t('ussd.tipANC', language)}`,
            `• ${t('ussd.tipFever', language)}`,
            '',
            t('ussd.press1', language),
          ]);
        }
        break;

      case 'name':
        setPatientName(value);
        setStep('age');
        typeMessage([
          '',
          `${t('ussd.name', language)}: ${value} ✓`,
          '',
          t('ussd.enterAge', language),
          '',
        ]);
        break;

      case 'age':
        const age = parseInt(value, 10);
        if (isNaN(age) || age < 10 || age > 60) {
          typeMessage([
            '',
            '⚠ Please enter a valid age (10-60)',
            '',
            t('ussd.enterAge', language),
            '',
          ]);
        } else {
          setPatientAge(age);
          setStep('village');
          typeMessage([
            '',
            `${t('ussd.age', language)}: ${age} ✓`,
            '',
            t('ussd.enterVillage', language),
            '',
          ]);
        }
        break;

      case 'village':
        setVillage(value);
        setStep('fever');
        typeMessage([
          '',
          `${t('ussd.village', language)}: ${value} ✓`,
          '',
          '────────────────────────',
          t('ussd.step2', language),
          '────────────────────────',
          '',
          t('ussd.haveFever', language),
          t('ussd.yesNo', language),
          '',
        ]);
        break;

      case 'fever':
        setSymptoms(s => ({ ...s, fever: value === '1' }));
        setStep('headache');
        typeMessage([
          '',
          `${t('ussd.fever', language)}: ${value === '1' ? `${t('ussd.yes', language)} ⚠` : `${t('ussd.no', language)} ✓`}`,
          '',
          t('ussd.haveHeadache', language),
          t('ussd.yesNo', language),
          '',
        ]);
        break;

      case 'headache':
        setSymptoms(s => ({ ...s, headache: value === '1' }));
        setStep('bodyaches');
        typeMessage([
          '',
          `${t('ussd.headache', language)}: ${value === '1' ? `${t('ussd.yes', language)} ⚠` : `${t('ussd.no', language)} ✓`}`,
          '',
          t('ussd.haveBodyAches', language),
          t('ussd.yesNo', language),
          '',
        ]);
        break;

      case 'bodyaches':
        setSymptoms(s => ({ ...s, bodyAches: value === '1' }));
        setStep('fatigue');
        typeMessage([
          '',
          `${t('ussd.bodyAches', language)}: ${value === '1' ? `${t('ussd.yes', language)} ⚠` : `${t('ussd.no', language)} ✓`}`,
          '',
          t('ussd.haveFatigue', language),
          t('ussd.yesNo', language),
          '',
        ]);
        break;

      case 'fatigue':
        setSymptoms(s => ({ ...s, fatigue: value === '1' }));
        setStep('bednet');
        typeMessage([
          '',
          `${t('ussd.fatigue', language)}: ${value === '1' ? `${t('ussd.yes', language)} ⚠` : `${t('ussd.no', language)} ✓`}`,
          '',
          '────────────────────────',
          t('ussd.step3', language),
          '────────────────────────',
          '',
          t('ussd.bedNet', language),
          t('ussd.yesNo', language),
          '',
        ]);
        break;

      case 'bednet':
        const bedNetUsage = value === '1';
        setSymptoms(s => ({ ...s, bedNetUsage }));
        setStep('confirmation');
        typeMessage([
          '',
          `${t('ussd.bedNetLabel', language)}: ${bedNetUsage ? `${t('ussd.yes', language)} ✓` : `${t('ussd.no', language)} ⚠`}`,
          '',
          '════════════════════════',
          `    ${t('ussd.confirm', language)}`,
          '════════════════════════',
          '',
          `${t('ussd.name', language)}: ${patientName}`,
          `${t('ussd.age', language)}: ${patientAge}`,
          `${t('ussd.village', language)}: ${village}`,
          '',
          t('ussd.submit', language),
          t('ussd.cancel', language),
          '',
        ]);
        break;

      case 'confirmation':
        if (value === '1') {
          setStep('complete');
          const ussdData: USSDData = {
            ...symptoms,
            bedNetUsage: symptoms.bedNetUsage,
            submittedAt: new Date(),
          };
          
          typeMessage([
            '',
            '════════════════════════',
            `     ✓ ${t('ussd.submitted', language)}`,
            '════════════════════════',
            '',
            t('ussd.received', language),
            t('ussd.notified', language),
            '',
            t('ussd.ifWorse', language),
            '',
            `${t('ussd.stayHealthy', language)} 💚`,
            '════════════════════════',
          ]);
          
          // Trigger the callback after animation
          setTimeout(() => {
            onSubmit(patientName, village, patientAge, ussdData);
          }, 1500);
        } else {
          setStep('idle');
          setDisplayLines([]);
        }
        break;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInput();
    }
  };

  const resetSimulator = () => {
    setStep('idle');
    setInput('');
    setDisplayLines([]);
    setPatientName('');
    setPatientAge(0);
    setVillage('');
    setSymptoms({
      fever: false,
      headache: false,
      bodyAches: false,
      fatigue: false,
      bedNetUsage: false,
    });
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Phone Frame */}
      <div className="relative bg-foreground rounded-[2.5rem] p-3 shadow-2xl">
        {/* Speaker */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-muted-foreground/30 rounded-full" />
        
        {/* Screen */}
        <div className="ussd-terminal rounded-[2rem] overflow-hidden">
          {/* Status Bar */}
          <div className="flex items-center justify-between px-4 py-2 ussd-dim text-xs">
            <span>MTN UG</span>
            <div className="flex items-center gap-2">
              <LanguageSwitcher 
                currentLanguage={language} 
                onLanguageChange={setLanguage}
                variant="compact"
              />
              <span>●●●●○</span>
            </div>
          </div>
          
          {/* USSD Display */}
          <div className="h-[420px] overflow-y-auto px-4 pb-4 font-mono text-sm leading-relaxed">
            {step === 'idle' ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Phone className="w-12 h-12 mb-4 ussd-accent" />
                <p className="ussd-text mb-2">{t('ussd.dialToStart', language)}</p>
                <p className="ussd-dim text-xs">{t('ussd.malariaReporting', language)}</p>
              </div>
            ) : (
              <div className="space-y-0.5">
                {displayLines.map((line, i) => (
                  <div 
                    key={i} 
                    className={`typing-effect ${
                      line.includes('✓') ? 'ussd-text' : 
                      line.includes('⚠') ? 'ussd-accent' :
                      line.includes('═') || line.includes('─') ? 'ussd-dim' :
                      'ussd-text'
                    }`}
                  >
                    {line || '\u00A0'}
                  </div>
                ))}
                {isTyping && <span className="cursor-blink ussd-accent">▌</span>}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-terminal-dim/30 p-3 flex gap-2">
            {step === 'idle' ? (
              <button
                onClick={handleDial}
                className="flex-1 bg-terminal-accent/20 hover:bg-terminal-accent/30 text-terminal-accent font-mono py-3 rounded-lg transition-colors font-semibold"
              >
                *161#
              </button>
            ) : step === 'complete' ? (
              <button
                onClick={resetSimulator}
                className="flex-1 bg-terminal-accent/20 hover:bg-terminal-accent/30 text-terminal-accent font-mono py-3 rounded-lg transition-colors font-semibold"
              >
                {t('ussd.complete', language)} ✓
              </button>
            ) : (
              <>
                <VoiceInputButton
                  language={language}
                  onResult={handleVoiceResult}
                  disabled={isTyping}
                  className="text-terminal-accent hover:bg-terminal-accent/20"
                />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('ussd.typeResponse', language)}
                  disabled={isTyping}
                  className="flex-1 bg-terminal-text/10 text-terminal-text placeholder:text-terminal-dim/50 px-4 py-3 rounded-lg font-mono text-sm focus:outline-none focus:ring-1 focus:ring-terminal-accent disabled:opacity-50"
                />
                <button
                  onClick={handleInput}
                  disabled={isTyping || !input.trim()}
                  className="bg-terminal-accent/20 hover:bg-terminal-accent/30 text-terminal-accent p-3 rounded-lg transition-colors disabled:opacity-30"
                >
                  <Send className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Home Button */}
        <div className="mt-3 flex justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-muted-foreground/20" />
        </div>
      </div>
    </div>
  );
}
