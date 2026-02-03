import { useState, useEffect } from 'react';
import { Phone, Send } from 'lucide-react';
import type { USSDData } from '@/types/patient';

type USSDStep = 
  | 'idle'
  | 'welcome'
  | 'name'
  | 'village'
  | 'fever'
  | 'headache'
  | 'bodyaches'
  | 'fatigue'
  | 'bednet'
  | 'confirmation'
  | 'complete';

interface USSDSimulatorProps {
  onSubmit: (name: string, village: string, data: USSDData) => void;
}

export function USSDSimulator({ onSubmit }: USSDSimulatorProps) {
  const [step, setStep] = useState<USSDStep>('idle');
  const [input, setInput] = useState('');
  const [displayLines, setDisplayLines] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Form data
  const [patientName, setPatientName] = useState('');
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
      '  MALARIA RISK AGENT',
      '  Mukono HC III',
      '════════════════════════',
      '',
      'Welcome to the Malaria',
      'Risk Reporting Service.',
      '',
      'Press 1 to report symptoms',
      'Press 2 for health tips',
      '',
    ]);
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
            'STEP 1: IDENTIFICATION',
            '────────────────────────',
            '',
            'Enter your full name:',
            '',
          ]);
        } else if (value === '2') {
          typeMessage([
            '',
            '• Sleep under treated nets',
            '• Visit ANC regularly',
            '• Report fever early',
            '',
            'Press 1 to report symptoms',
          ]);
        }
        break;

      case 'name':
        setPatientName(value);
        setStep('village');
        typeMessage([
          '',
          `Name: ${value} ✓`,
          '',
          'Enter your village name:',
          '',
        ]);
        break;

      case 'village':
        setVillage(value);
        setStep('fever');
        typeMessage([
          '',
          `Village: ${value} ✓`,
          '',
          '────────────────────────',
          'STEP 2: SYMPTOMS CHECK',
          '────────────────────────',
          '',
          'Do you have FEVER?',
          '(1 = Yes, 2 = No)',
          '',
        ]);
        break;

      case 'fever':
        setSymptoms(s => ({ ...s, fever: value === '1' }));
        setStep('headache');
        typeMessage([
          '',
          `Fever: ${value === '1' ? 'Yes ⚠' : 'No ✓'}`,
          '',
          'Do you have HEADACHE?',
          '(1 = Yes, 2 = No)',
          '',
        ]);
        break;

      case 'headache':
        setSymptoms(s => ({ ...s, headache: value === '1' }));
        setStep('bodyaches');
        typeMessage([
          '',
          `Headache: ${value === '1' ? 'Yes ⚠' : 'No ✓'}`,
          '',
          'Do you have BODY ACHES?',
          '(1 = Yes, 2 = No)',
          '',
        ]);
        break;

      case 'bodyaches':
        setSymptoms(s => ({ ...s, bodyAches: value === '1' }));
        setStep('fatigue');
        typeMessage([
          '',
          `Body Aches: ${value === '1' ? 'Yes ⚠' : 'No ✓'}`,
          '',
          'Do you feel very TIRED?',
          '(1 = Yes, 2 = No)',
          '',
        ]);
        break;

      case 'fatigue':
        setSymptoms(s => ({ ...s, fatigue: value === '1' }));
        setStep('bednet');
        typeMessage([
          '',
          `Fatigue: ${value === '1' ? 'Yes ⚠' : 'No ✓'}`,
          '',
          '────────────────────────',
          'STEP 3: PREVENTION',
          '────────────────────────',
          '',
          'Are you sleeping under a',
          'treated mosquito net?',
          '(1 = Yes, 2 = No)',
          '',
        ]);
        break;

      case 'bednet':
        const bedNetUsage = value === '1';
        setSymptoms(s => ({ ...s, bedNetUsage }));
        setStep('confirmation');
        typeMessage([
          '',
          `Bed-Net: ${bedNetUsage ? 'Yes ✓' : 'No ⚠'}`,
          '',
          '════════════════════════',
          '    CONFIRM SUBMISSION',
          '════════════════════════',
          '',
          `Name: ${patientName}`,
          `Village: ${village}`,
          '',
          'Press 1 to SUBMIT',
          'Press 2 to CANCEL',
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
            '     ✓ SUBMITTED',
            '════════════════════════',
            '',
            'Information received.',
            'Your health team at',
            'Mukono HC III has been',
            'notified.',
            '',
            'If you feel worse,',
            'visit the nearest',
            'health centre.',
            '',
            'Stay healthy! 💚',
            '════════════════════════',
          ]);
          
          // Trigger the callback after animation
          setTimeout(() => {
            onSubmit(patientName, village, ussdData);
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
            <span>●●●●○</span>
          </div>
          
          {/* USSD Display */}
          <div className="h-[420px] overflow-y-auto px-4 pb-4 font-mono text-sm leading-relaxed">
            {step === 'idle' ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Phone className="w-12 h-12 mb-4 ussd-accent" />
                <p className="ussd-text mb-2">Dial *161# to start</p>
                <p className="ussd-dim text-xs">Malaria Risk Reporting</p>
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
            ) : (
              <>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={step === 'complete' ? 'Complete' : 'Type response...'}
                  disabled={step === 'complete' || isTyping}
                  className="flex-1 bg-terminal-text/10 text-terminal-text placeholder:text-terminal-dim/50 px-4 py-3 rounded-lg font-mono text-sm focus:outline-none focus:ring-1 focus:ring-terminal-accent disabled:opacity-50"
                />
                <button
                  onClick={handleInput}
                  disabled={step === 'complete' || isTyping || !input.trim()}
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
