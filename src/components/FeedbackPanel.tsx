import { CheckCircle2, XCircle, Clock, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface FeedbackPanelProps {
  totalPredictions: number;
  confirmedPositive: number;
  showedUp: number;
  avgTimeToShowUp: number;
}

export function FeedbackPanel({ 
  totalPredictions, 
  confirmedPositive, 
  showedUp,
  avgTimeToShowUp 
}: FeedbackPanelProps) {
  const accuracy = totalPredictions > 0 ? Math.round((confirmedPositive / totalPredictions) * 100) : 0;
  const showUpRate = totalPredictions > 0 ? Math.round((showedUp / totalPredictions) * 100) : 0;

  return (
    <div className="healthcare-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-sm">Learning Loop Feedback</h3>
      </div>

      <div className="space-y-4">
        {/* Prediction Accuracy */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-risk-low" />
              Lab-Confirmed Accuracy
            </span>
            <span className="font-semibold text-sm">{accuracy}%</span>
          </div>
          <Progress value={accuracy} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {confirmedPositive} of {totalPredictions} high-risk flagged patients tested positive
          </p>
        </div>

        {/* Show-up Rate */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-risk-medium" />
              Testing Compliance
            </span>
            <span className="font-semibold text-sm">{showUpRate}%</span>
          </div>
          <Progress value={showUpRate} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {showedUp} patients showed up for testing within expected window
          </p>
        </div>

        {/* Average Response Time */}
        <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
          <span className="text-sm text-muted-foreground">Avg. Time to Testing</span>
          <span className="font-semibold">{avgTimeToShowUp} days</span>
        </div>
      </div>
    </div>
  );
}
