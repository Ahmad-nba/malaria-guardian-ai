import { CheckCircle2, XCircle, Clock, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import type { Language } from '@/lib/translations';
import { t } from '@/lib/translations';

interface FeedbackPanelProps {
  totalPredictions: number;
  confirmedPositive: number;
  showedUp: number;
  avgTimeToShowUp: number;
  language: Language;
}

export function FeedbackPanel({ 
  totalPredictions, 
  confirmedPositive, 
  showedUp,
  avgTimeToShowUp,
  language
}: FeedbackPanelProps) {
  const accuracy = totalPredictions > 0 ? Math.round((confirmedPositive / totalPredictions) * 100) : 0;
  const showUpRate = totalPredictions > 0 ? Math.round((showedUp / totalPredictions) * 100) : 0;

  return (
    <div className="healthcare-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-sm">{t('dash.learningLoop', language)}</h3>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-risk-low" />
              {t('dash.labAccuracy', language)}
            </span>
            <span className="font-semibold text-sm">{accuracy}%</span>
          </div>
          <Progress value={accuracy} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {confirmedPositive} of {totalPredictions} high-risk flagged patients tested positive
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-risk-medium" />
              {t('dash.testingCompliance', language)}
            </span>
            <span className="font-semibold text-sm">{showUpRate}%</span>
          </div>
          <Progress value={showUpRate} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {showedUp} patients showed up for testing within expected window
          </p>
        </div>

        <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
          <span className="text-sm text-muted-foreground">{t('dash.avgTimeToTesting', language)}</span>
          <span className="font-semibold">{avgTimeToShowUp} {t('dash.days', language)}</span>
        </div>
      </div>
    </div>
  );
}
