import type { Patient, LocalMalariaStats } from '@/types/patient';

export const localMalariaStats: LocalMalariaStats = {
  region: 'Mukono District',
  currentCases: 847,
  weeklyTrend: 'increasing',
  seasonalRisk: 'high',
  rainfallIndex: 78,
};

export const mockPatients: Patient[] = [
  {
    id: 'P001',
    name: 'Amina Nakato',
    village: 'Kigungu Village',
    healthCentre: 'Mukono HC III',
    pregnancyWeek: 32,
    ancVisits: 4,
    lastANCDate: new Date('2024-01-15'),
    ussdData: {
      fever: true,
      headache: true,
      bodyAches: false,
      fatigue: true,
      bedNetUsage: false,
      submittedAt: new Date(),
    },
    trustData: [
      { level: 'high', label: 'ANC Verified Pregnancy', value: 'Week 32, 4 visits', weight: 0 },
      { level: 'high', label: 'Last Facility Visit', value: '3 weeks ago', weight: 5 },
    ],
    riskScore: 72,
    riskLevel: 'high',
    explainabilityVector: [
      'Fever reported via USSD (+21 pts, medium trust)',
      'Headache reported via USSD (+10.5 pts, medium trust)',
      'Fatigue reported via USSD (+7 pts, medium trust)',
      'No bed-net usage reported (+10.5 pts, medium trust)',
      'Pregnancy stage: third trimester (×1.3 modifier, high trust)',
      'High seasonal malaria risk in region (+7.5 pts, environmental)',
      'Increasing local case trend (+5 pts, environmental)',
    ],
    actionsTaken: [
      { type: 'dashboard_flag', description: 'URGENT: Flagged for immediate review', status: 'completed', timestamp: new Date() },
      { type: 'urgent_sms', description: 'Urgent SMS sent', status: 'completed', timestamp: new Date() },
    ],
  },
  {
    id: 'P002',
    name: 'Sarah Namugga',
    village: 'Buwama Village',
    healthCentre: 'Mukono HC III',
    pregnancyWeek: 24,
    ancVisits: 3,
    lastANCDate: new Date('2024-01-20'),
    ussdData: {
      fever: false,
      headache: true,
      bodyAches: false,
      fatigue: false,
      bedNetUsage: true,
      submittedAt: new Date(Date.now() - 3600000),
    },
    trustData: [
      { level: 'high', label: 'ANC Verified Pregnancy', value: 'Week 24, 3 visits', weight: 0 },
    ],
    riskScore: 42,
    riskLevel: 'medium',
    explainabilityVector: [
      'Headache reported via USSD (+10.5 pts, medium trust)',
      'Bed-net in use (protective factor)',
      'Pregnancy stage: second trimester (baseline)',
      'High seasonal malaria risk in region (+7.5 pts, environmental)',
      'Increasing local case trend (+5 pts, environmental)',
    ],
    actionsTaken: [
      { type: 'vht_notify', description: 'VHT notified for follow-up', status: 'pending', timestamp: new Date() },
    ],
  },
  {
    id: 'P003',
    name: 'Grace Namutebi',
    village: 'Seeta Village',
    healthCentre: 'Mukono HC III',
    pregnancyWeek: 18,
    ancVisits: 2,
    lastANCDate: new Date('2024-01-25'),
    ussdData: {
      fever: false,
      headache: false,
      bodyAches: false,
      fatigue: false,
      bedNetUsage: true,
      submittedAt: new Date(Date.now() - 7200000),
    },
    trustData: [
      { level: 'high', label: 'ANC Verified Pregnancy', value: 'Week 18, 2 visits', weight: 0 },
    ],
    riskScore: 18,
    riskLevel: 'low',
    explainabilityVector: [
      'No symptoms reported via USSD',
      'Bed-net in use (protective factor)',
      'Pregnancy stage: second trimester (baseline)',
      'Moderate environmental risk factors',
    ],
    actionsTaken: [
      { type: 'sms', description: 'Preventive tips SMS sent', status: 'completed', timestamp: new Date() },
    ],
  },
  {
    id: 'P004',
    name: 'Jane Kyomuhendo',
    village: 'Nama Village',
    healthCentre: 'Mukono HC III',
    pregnancyWeek: 8,
    ancVisits: 1,
    lastANCDate: new Date('2024-01-10'),
    ussdData: {
      fever: true,
      headache: false,
      bodyAches: true,
      fatigue: true,
      bedNetUsage: false,
      submittedAt: new Date(Date.now() - 1800000),
    },
    trustData: [
      { level: 'high', label: 'ANC Verified Pregnancy', value: 'Week 8, 1 visit', weight: 0 },
      { level: 'medium', label: 'VHT Observation', value: 'Looked pale during home visit', weight: 8 },
    ],
    riskScore: 68,
    riskLevel: 'high',
    explainabilityVector: [
      'Fever reported via USSD (+21 pts, medium trust)',
      'Body aches reported via USSD (+7 pts, medium trust)',
      'Fatigue reported via USSD (+7 pts, medium trust)',
      'No bed-net usage (+10.5 pts, medium trust)',
      'Pregnancy stage: first trimester (×1.2 modifier, high trust)',
      'Low ANC attendance (<2 visits) (+10 pts, high trust)',
      'VHT Observation: Looked pale (+5.6 pts, medium trust)',
    ],
    actionsTaken: [
      { type: 'dashboard_flag', description: 'Flagged for urgent review', status: 'completed', timestamp: new Date() },
    ],
  },
];

export function addNewPatient(
  name: string,
  village: string,
  age: number,
  ussdData: Patient['ussdData']
): Patient {
  const id = `P${String(mockPatients.length + 1).padStart(3, '0')}`;
  
  const newPatient: Patient = {
    id,
    name,
    village,
    healthCentre: 'Mukono HC III',
    pregnancyWeek: 20, // Default for new USSD registrations
    ancVisits: 0,
    lastANCDate: new Date(),
    age,
    ussdData,
    trustData: [
      { level: 'medium', label: 'USSD Self-Report', value: 'Unverified pregnancy', weight: 5 },
    ],
    riskScore: 0,
    riskLevel: 'low',
    explainabilityVector: [],
    actionsTaken: [],
  };

  return newPatient;
}
