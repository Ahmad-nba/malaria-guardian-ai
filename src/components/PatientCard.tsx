import { useState } from 'react';
import { 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  MapPin, 
  User, 
  Baby,
  CheckCircle2,
  Circle,
  XCircle,
  MessageSquare,
  Users,
  Building2,
  Flag
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Patient, ActionItem } from '@/types/patient';

interface PatientCardProps {
  patient: Patient;
  isNew?: boolean;
}

export function PatientCard({ patient, isNew }: PatientCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRiskBadgeClass = () => {
    switch (patient.riskLevel) {
      case 'high': return 'risk-high';
      case 'medium': return 'risk-medium';
      case 'low': return 'risk-low';
    }
  };

  const getRiskIcon = () => {
    if (patient.riskLevel === 'high') {
      return <AlertTriangle className="w-4 h-4" />;
    }
    return null;
  };

  const getActionIcon = (type: ActionItem['type']) => {
    switch (type) {
      case 'sms': return <MessageSquare className="w-4 h-4" />;
      case 'urgent_sms': return <MessageSquare className="w-4 h-4" />;
      case 'vht_notify': return <Users className="w-4 h-4" />;
      case 'hc2_alert': return <Building2 className="w-4 h-4" />;
      case 'dashboard_flag': return <Flag className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: ActionItem['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-risk-low" />;
      case 'pending': return <Circle className="w-4 h-4 text-risk-medium" />;
      case 'failed': return <XCircle className="w-4 h-4 text-risk-high" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div 
      className={`healthcare-card overflow-hidden transition-all duration-300 ${
        patient.riskLevel === 'high' ? 'pulse-high border-risk-high/30' : ''
      } ${isNew ? 'animate-fade-in ring-2 ring-accent' : ''}`}
    >
      {/* Header */}
      <div className="p-3 sm:p-4 flex items-start justify-between gap-2 sm:gap-4">
        <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
          {/* Risk Indicator */}
          <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-base sm:text-lg ${getRiskBadgeClass()}`}>
            {patient.riskScore}
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground truncate text-sm sm:text-base">{patient.name}</h3>
              <Badge className={`${getRiskBadgeClass()} flex items-center gap-1 text-[10px] sm:text-xs`}>
                {getRiskIcon()}
                {patient.riskLevel.toUpperCase()}
              </Badge>
              {isNew && (
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent text-[10px] sm:text-xs">
                  NEW
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-x-3 gap-y-0.5 mt-1 text-xs sm:text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1 min-w-0">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{patient.village}</span>
              </span>
              <span className="flex items-center gap-1 flex-shrink-0">
                <Baby className="w-3.5 h-3.5" />
                Week {patient.pregnancyWeek}
              </span>
              <span className="flex items-center gap-1 flex-shrink-0">
                <Clock className="w-3.5 h-3.5" />
                {patient.ussdData && formatTime(patient.ussdData.submittedAt)}
              </span>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-shrink-0 -mr-1 sm:mr-0"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>

      {/* USSD Symptoms Summary */}
      {patient.ussdData && (
        <div className="px-3 sm:px-4 pb-3 flex gap-1.5 sm:gap-2 flex-wrap">
          {patient.ussdData.fever && (
            <span className="text-xs px-2 py-1 rounded-full risk-high">Fever</span>
          )}
          {patient.ussdData.headache && (
            <span className="text-xs px-2 py-1 rounded-full risk-medium">Headache</span>
          )}
          {patient.ussdData.bodyAches && (
            <span className="text-xs px-2 py-1 rounded-full risk-medium">Body Aches</span>
          )}
          {patient.ussdData.fatigue && (
            <span className="text-xs px-2 py-1 rounded-full risk-medium">Fatigue</span>
          )}
          {!patient.ussdData.bedNetUsage && (
            <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">No Bed-Net</span>
          )}
        </div>
      )}

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-border animate-fade-in">
          {/* Explainability Vector */}
          <div className="p-4 bg-muted/30">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Risk Explainability
            </h4>
            <ul className="space-y-1">
              {patient.explainabilityVector.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Trust Data */}
          <div className="p-4 border-t border-border">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-trust-high" />
              Trust-Weighted Data Sources
            </h4>
            <div className="flex gap-2 flex-wrap">
              {patient.trustData.map((data, i) => (
                <div 
                  key={i} 
                  className={`text-xs px-3 py-1.5 rounded-full ${
                    data.level === 'high' ? 'trust-high' :
                    data.level === 'medium' ? 'trust-medium' :
                    'trust-environmental'
                  }`}
                >
                  <span className="font-medium">{data.label}:</span> {data.value}
                </div>
              ))}
            </div>
          </div>

          {/* Actions Taken */}
          <div className="p-4 border-t border-border">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Action Package
            </h4>
            <div className="space-y-2">
              {patient.actionsTaken.map((action, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  {getStatusIcon(action.status)}
                  <span className="text-muted-foreground">{getActionIcon(action.type)}</span>
                  <span className="flex-1">{action.description}</span>
                  <span className="text-xs text-muted-foreground">{formatTime(action.timestamp)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
