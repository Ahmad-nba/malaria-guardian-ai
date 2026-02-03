import type { Patient, RiskLevel, USSDData, TrustWeightedData, LocalMalariaStats } from '@/types/patient';

// Trust level weights
const TRUST_WEIGHTS = {
  high: 1.0,      // Facility-verified data
  medium: 0.7,   // USSD-reported / VHT observations
  environmental: 0.5, // Local trends
};

// Symptom weights for risk calculation
const SYMPTOM_WEIGHTS = {
  fever: 30,
  headache: 15,
  bodyAches: 10,
  fatigue: 10,
  noBedNet: 15,
};

// Pregnancy risk modifiers
const PREGNANCY_MODIFIERS = {
  firstTrimester: 1.2,  // weeks 1-12
  secondTrimester: 1.0, // weeks 13-27
  thirdTrimester: 1.3,  // weeks 28+
};

export function calculateRiskScore(
  ussdData: USSDData | undefined,
  trustData: TrustWeightedData[],
  pregnancyWeek: number,
  ancVisits: number,
  localStats?: LocalMalariaStats
): { score: number; level: RiskLevel; explainability: string[] } {
  let score = 0;
  const explainability: string[] = [];

  // Base score from USSD symptoms (medium trust)
  if (ussdData) {
    if (ussdData.fever) {
      score += SYMPTOM_WEIGHTS.fever * TRUST_WEIGHTS.medium;
      explainability.push(`Fever reported via USSD (+${(SYMPTOM_WEIGHTS.fever * TRUST_WEIGHTS.medium).toFixed(0)} pts, medium trust)`);
    }
    if (ussdData.headache) {
      score += SYMPTOM_WEIGHTS.headache * TRUST_WEIGHTS.medium;
      explainability.push(`Headache reported via USSD (+${(SYMPTOM_WEIGHTS.headache * TRUST_WEIGHTS.medium).toFixed(0)} pts, medium trust)`);
    }
    if (ussdData.bodyAches) {
      score += SYMPTOM_WEIGHTS.bodyAches * TRUST_WEIGHTS.medium;
      explainability.push(`Body aches reported via USSD (+${(SYMPTOM_WEIGHTS.bodyAches * TRUST_WEIGHTS.medium).toFixed(0)} pts, medium trust)`);
    }
    if (ussdData.fatigue) {
      score += SYMPTOM_WEIGHTS.fatigue * TRUST_WEIGHTS.medium;
      explainability.push(`Fatigue reported via USSD (+${(SYMPTOM_WEIGHTS.fatigue * TRUST_WEIGHTS.medium).toFixed(0)} pts, medium trust)`);
    }
    if (!ussdData.bedNetUsage) {
      score += SYMPTOM_WEIGHTS.noBedNet * TRUST_WEIGHTS.medium;
      explainability.push(`No bed-net usage reported (+${(SYMPTOM_WEIGHTS.noBedNet * TRUST_WEIGHTS.medium).toFixed(0)} pts, medium trust)`);
    }
  }

  // Add weighted trust data contributions
  trustData.forEach(data => {
    const contribution = data.weight * TRUST_WEIGHTS[data.level];
    if (contribution > 0) {
      score += contribution;
      explainability.push(`${data.label}: ${data.value} (+${contribution.toFixed(0)} pts, ${data.level} trust)`);
    }
  });

  // Pregnancy stage modifier
  let pregnancyModifier = PREGNANCY_MODIFIERS.secondTrimester;
  let trimesterLabel = 'second trimester';
  
  if (pregnancyWeek <= 12) {
    pregnancyModifier = PREGNANCY_MODIFIERS.firstTrimester;
    trimesterLabel = 'first trimester';
  } else if (pregnancyWeek >= 28) {
    pregnancyModifier = PREGNANCY_MODIFIERS.thirdTrimester;
    trimesterLabel = 'third trimester';
  }

  if (pregnancyModifier !== 1.0) {
    explainability.push(`Pregnancy stage: ${trimesterLabel} (×${pregnancyModifier} modifier, high trust)`);
  }
  score *= pregnancyModifier;

  // ANC attendance factor (high trust - facility verified)
  if (ancVisits < 2) {
    score += 10 * TRUST_WEIGHTS.high;
    explainability.push(`Low ANC attendance (<2 visits) (+10 pts, high trust)`);
  }

  // Environmental factors
  if (localStats) {
    if (localStats.seasonalRisk === 'high') {
      score += 15 * TRUST_WEIGHTS.environmental;
      explainability.push(`High seasonal malaria risk in region (+${(15 * TRUST_WEIGHTS.environmental).toFixed(0)} pts, environmental)`);
    } else if (localStats.seasonalRisk === 'moderate') {
      score += 8 * TRUST_WEIGHTS.environmental;
      explainability.push(`Moderate seasonal risk (+${(8 * TRUST_WEIGHTS.environmental).toFixed(0)} pts, environmental)`);
    }

    if (localStats.weeklyTrend === 'increasing') {
      score += 10 * TRUST_WEIGHTS.environmental;
      explainability.push(`Increasing local case trend (+${(10 * TRUST_WEIGHTS.environmental).toFixed(0)} pts, environmental)`);
    }
  }

  // Normalize score to 0-100
  const normalizedScore = Math.min(100, Math.max(0, score));

  // Determine risk level
  let level: RiskLevel = 'low';
  if (normalizedScore >= 60) {
    level = 'high';
  } else if (normalizedScore >= 35) {
    level = 'medium';
  }

  return {
    score: Math.round(normalizedScore),
    level,
    explainability,
  };
}

export function getActionPackage(riskLevel: RiskLevel, patientName: string): { type: string; description: string }[] {
  const actions = [];

  switch (riskLevel) {
    case 'low':
      actions.push({
        type: 'sms',
        description: `Automated SMS sent to ${patientName} with preventive tips: bed-net usage, recognizing danger signs`,
      });
      break;

    case 'medium':
      actions.push({
        type: 'vht_notify',
        description: `VHT notified for follow-up home visit within 48 hours`,
      });
      actions.push({
        type: 'hc2_alert',
        description: `HC II alerted to prepare RDT testing capacity`,
      });
      actions.push({
        type: 'sms',
        description: `SMS sent to ${patientName}: "Please visit your nearest health centre for a check-up within 2 days"`,
      });
      break;

    case 'high':
      actions.push({
        type: 'dashboard_flag',
        description: `URGENT: Flagged on HC III dashboard for immediate clinical review`,
      });
      actions.push({
        type: 'urgent_sms',
        description: `URGENT SMS sent to ${patientName}: "Please visit HC II or HC III TODAY for malaria testing"`,
      });
      actions.push({
        type: 'vht_notify',
        description: `VHT dispatched for immediate home visit and escort to facility if needed`,
      });
      break;
  }

  return actions;
}
