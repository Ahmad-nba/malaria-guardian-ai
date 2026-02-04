export type RiskLevel = 'low' | 'medium' | 'high';
export type TrustLevel = 'high' | 'medium' | 'environmental';

export interface USSDData {
  fever: boolean;
  headache: boolean;
  bodyAches: boolean;
  fatigue: boolean;
  bedNetUsage: boolean;
  submittedAt: Date;
}

export interface TrustWeightedData {
  level: TrustLevel;
  label: string;
  value: string;
  weight: number;
}

export interface Patient {
  id: string;
  name: string;
  village: string;
  healthCentre: string;
  age?: number;
  pregnancyWeek: number;
  ancVisits: number;
  lastANCDate: Date;
  ussdData?: USSDData;
  trustData: TrustWeightedData[];
  riskScore: number;
  riskLevel: RiskLevel;
  explainabilityVector: string[];
  actionsTaken: ActionItem[];
  feedbackData?: FeedbackData;
}

export interface ActionItem {
  type: 'sms' | 'vht_notify' | 'hc2_alert' | 'dashboard_flag' | 'urgent_sms';
  description: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
}

export interface FeedbackData {
  labTestConfirmed?: boolean;
  showedUpForTesting?: boolean;
  timeToShowUp?: number; // days
  outcomeDate?: Date;
}

export interface LocalMalariaStats {
  region: string;
  currentCases: number;
  weeklyTrend: 'increasing' | 'stable' | 'decreasing';
  seasonalRisk: 'low' | 'moderate' | 'high';
  rainfallIndex: number;
}
