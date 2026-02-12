import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, LayoutDashboard, Shield, Activity, Users, Building2, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { USSDSimulator } from '@/components/USSDSimulator';
import { PatientCard } from '@/components/PatientCard';
import { DashboardStats } from '@/components/DashboardStats';
import { RegionalIndicator } from '@/components/RegionalIndicator';
import { FeedbackPanel } from '@/components/FeedbackPanel';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { mockPatients, localMalariaStats, addNewPatient } from '@/data/mockPatients';
import { calculateRiskScore, getActionPackage } from '@/lib/riskCalculator';
import type { Patient, USSDData } from '@/types/patient';
import { toast } from 'sonner';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { type Language, t } from '@/lib/translations';

const Index = () => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [newPatientId, setNewPatientId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [language, setLanguage] = useState<Language>('en');

  const handleUSSDSubmit = (name: string, village: string, age: number, ussdData: USSDData) => {
    // Create new patient from USSD data
    const newPatient = addNewPatient(name, village, age, ussdData);
    
    // Calculate risk score
    const { score, level, explainability } = calculateRiskScore(
      ussdData,
      newPatient.trustData,
      newPatient.pregnancyWeek,
      newPatient.ancVisits,
      localMalariaStats
    );
    
    // Get action package
    const actions = getActionPackage(level, name);
    
    // Update patient with calculated values
    newPatient.riskScore = score;
    newPatient.riskLevel = level;
    newPatient.explainabilityVector = explainability;
    newPatient.actionsTaken = actions.map(a => ({
      ...a,
      type: a.type as any,
      status: 'completed' as const,
      timestamp: new Date(),
    }));

    // Add to patients list
    setPatients(prev => [newPatient, ...prev]);
    setNewPatientId(newPatient.id);
    
    // Show toast and switch to dashboard
    toast.success(`${name} added to priority queue`, {
      description: `Risk Level: ${level.toUpperCase()} (Score: ${score})`,
    });
    
    setTimeout(() => {
      setActiveTab('dashboard');
    }, 2000);

    // Clear new patient highlight after some time
    setTimeout(() => {
      setNewPatientId(null);
    }, 10000);
  };

  const sortedPatients = [...patients].sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="dashboard-header text-primary-foreground">
        <div className="container py-6">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-foreground/20 rounded-lg">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{t('dash.title', language)}</h1>
                <p className="text-primary-foreground/80 text-sm">{t('dash.subtitle', language)}</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />
              <Link to="/install">
                <Button variant="secondary" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Install
                </Button>
              </Link>
              <Link to="/hc2">
                <Button variant="secondary" size="sm" className="gap-2">
                  <Building2 className="w-4 h-4" />
                  HC II
                </Button>
              </Link>
              <Link to="/vht">
                <Button variant="secondary" size="sm" className="gap-2">
                  <Users className="w-4 h-4" />
                  VHT View
                </Button>
              </Link>
            </div>
          </div>
          <p className="text-sm text-primary-foreground/70 mt-2 max-w-2xl">
            {t('dash.description', language)}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              {t('dash.doctorDashboard', language)}
            </TabsTrigger>
            <TabsTrigger value="ussd" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              {t('dash.ussdSimulator', language)}
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6 animate-fade-in">
            {/* Stats Overview */}
            <DashboardStats patients={patients} localStats={localMalariaStats} language={language} />

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Patient Priority Queue */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    {t('dash.priorityQueue', language)}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {patients.length} {t('dash.patients', language)}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {sortedPatients.map((patient) => (
                    <PatientCard 
                      key={patient.id} 
                      patient={patient}
                      isNew={patient.id === newPatientId}
                    />
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <RegionalIndicator stats={localMalariaStats} language={language} />
                <FeedbackPanel 
                  totalPredictions={24}
                  confirmedPositive={18}
                  showedUp={21}
                  avgTimeToShowUp={1.5}
                  language={language}
                />
                
                {/* Legend */}
                <div className="healthcare-card p-4">
                  <h3 className="font-semibold text-sm mb-3">{t('dash.trustLegend', language)}</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-trust-high" />
                      <span><strong>{t('dash.highTrust', language)}:</strong> {t('dash.facilityVerified', language)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-trust-medium" />
                      <span><strong>{t('dash.mediumTrust', language)}:</strong> {t('dash.ussdVht', language)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-trust-environmental" />
                      <span><strong>{t('dash.environmental', language)}:</strong> {t('dash.localTrends', language)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 text-xs text-muted-foreground">
                  <p className="font-medium mb-1">⚠ {t('dash.clinicalAdvisory', language)}</p>
                  <p>{t('dash.disclaimer', language)}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* USSD Simulator Tab */}
          <TabsContent value="ussd" className="animate-fade-in">
            <div className="max-w-lg mx-auto space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold">{t('dash.ussdTitle', language)}</h2>
                <p className="text-muted-foreground text-sm">
                  {t('dash.ussdDesc', language)}
                </p>
              </div>
              
              <USSDSimulator onSubmit={handleUSSDSubmit} language={language} onLanguageChange={setLanguage} />
              
              <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground space-y-2">
                <p className="font-medium">How it works:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>User dials *161# and enters name + village</li>
                  <li>Binary symptom check: fever, headache, body aches, fatigue</li>
                  <li>Bed-net usage verification</li>
                  <li>Data weighted by trust level and calculated into risk score</li>
                  <li>Automatic action package triggered based on priority tier</li>
                </ol>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container py-4 text-center text-xs text-muted-foreground">
          <p>Autonomous Malaria Risk Prioritization Agent • Mukono HC III • Uganda</p>
          <p className="mt-1">No diagnosis or prescription. Hierarchy-aligned coordination.</p>
        </div>
      </footer>

      {/* Offline Indicator */}
      <OfflineIndicator />
    </div>
  );
};

export default Index;
