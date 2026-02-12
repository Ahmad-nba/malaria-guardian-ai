import { AlertTriangle, TrendingUp, Users, Activity } from 'lucide-react';
import type { Patient, LocalMalariaStats } from '@/types/patient';
import type { Language } from '@/lib/translations';
import { t } from '@/lib/translations';

interface DashboardStatsProps {
  patients: Patient[];
  localStats: LocalMalariaStats;
  language: Language;
}

export function DashboardStats({ patients, localStats, language }: DashboardStatsProps) {
  const highRisk = patients.filter(p => p.riskLevel === 'high').length;
  const mediumRisk = patients.filter(p => p.riskLevel === 'medium').length;
  const lowRisk = patients.filter(p => p.riskLevel === 'low').length;

  const stats = [
    {
      label: t('dash.highPriority', language),
      value: highRisk,
      icon: AlertTriangle,
      className: 'risk-high',
      sublabel: t('dash.immediateAttention', language),
    },
    {
      label: t('dash.mediumPriority', language),
      value: mediumRisk,
      icon: Activity,
      className: 'risk-medium',
      sublabel: t('dash.followUp', language),
    },
    {
      label: t('dash.lowPriority', language),
      value: lowRisk,
      icon: Users,
      className: 'risk-low',
      sublabel: t('dash.preventiveCare', language),
    },
    {
      label: t('dash.regionalTrend', language),
      value: localStats.weeklyTrend === 'increasing' ? '↑' : localStats.weeklyTrend === 'decreasing' ? '↓' : '→',
      icon: TrendingUp,
      className: localStats.weeklyTrend === 'increasing' ? 'risk-high' : 'risk-low',
      sublabel: `${localStats.currentCases} ${t('dash.casesThisWeek', language)}`,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div 
          key={i} 
          className="healthcare-card p-4 animate-fade-in"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`p-2 rounded-lg ${stat.className}`}>
              <stat.icon className="w-4 h-4" />
            </span>
            <span className="text-2xl font-bold text-foreground">{stat.value}</span>
          </div>
          <p className="font-medium text-sm text-foreground">{stat.label}</p>
          <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
        </div>
      ))}
    </div>
  );
}
