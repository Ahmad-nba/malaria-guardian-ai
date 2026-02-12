import { Cloud, Droplets, MapPin, TrendingUp } from 'lucide-react';
import type { LocalMalariaStats } from '@/types/patient';
import type { Language } from '@/lib/translations';
import { t } from '@/lib/translations';

interface RegionalIndicatorProps {
  stats: LocalMalariaStats;
  language: Language;
}

export function RegionalIndicator({ stats, language }: RegionalIndicatorProps) {
  return (
    <div className="healthcare-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-sm">{stats.region}</h3>
        <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
          stats.seasonalRisk === 'high' ? 'risk-high' :
          stats.seasonalRisk === 'moderate' ? 'risk-medium' :
          'risk-low'
        }`}>
          {stats.seasonalRisk.toUpperCase()} {t('dash.season', language)}
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="trust-environmental rounded-lg p-2">
          <TrendingUp className="w-4 h-4 mx-auto mb-1" />
          <p className="text-xs font-medium">{stats.weeklyTrend}</p>
          <p className="text-[10px] opacity-70">{t('dash.caseTrend', language)}</p>
        </div>
        <div className="trust-environmental rounded-lg p-2">
          <Cloud className="w-4 h-4 mx-auto mb-1" />
          <p className="text-xs font-medium">{stats.rainfallIndex}%</p>
          <p className="text-[10px] opacity-70">{t('dash.rainfall', language)}</p>
        </div>
        <div className="trust-environmental rounded-lg p-2">
          <Droplets className="w-4 h-4 mx-auto mb-1" />
          <p className="text-xs font-medium">{stats.currentCases}</p>
          <p className="text-[10px] opacity-70">{t('dash.weeklyCases', language)}</p>
        </div>
      </div>
    </div>
  );
}
