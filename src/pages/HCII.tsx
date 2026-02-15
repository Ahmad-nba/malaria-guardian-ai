import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  UserPlus, 
  Activity, 
  ThermometerSun, 
  Heart, 
  Scale, 
  Stethoscope,
  Send,
  Check,
  ArrowLeft,
  FileText,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { mockPatients } from '@/data/mockPatients';
import type { Patient } from '@/types/patient';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

interface VitalsRecord {
  id: string;
  patientId: string;
  patientName: string;
  temperature: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  weight: number;
  heartRate: number;
  notes: string;
  recordedAt: Date;
  reportedToHCIII: boolean;
}

interface OnboardingForm {
  name: string;
  age: string;
  village: string;
  pregnancyWeek: string;
  phoneNumber: string;
  nextOfKin: string;
  nextOfKinPhone: string;
}

const HCII = () => {
  const [activeTab, setActiveTab] = useState('patients');
  const { language, setLanguage } = useLanguage();
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [vitalsRecords, setVitalsRecords] = useState<VitalsRecord[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showVitalsForm, setShowVitalsForm] = useState(false);
  
  // Onboarding form state
  const [onboardingForm, setOnboardingForm] = useState<OnboardingForm>({
    name: '',
    age: '',
    village: '',
    pregnancyWeek: '',
    phoneNumber: '',
    nextOfKin: '',
    nextOfKinPhone: '',
  });

  // Vitals form state
  const [vitalsForm, setVitalsForm] = useState({
    temperature: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    weight: '',
    heartRate: '',
    notes: '',
  });

  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPatient: Patient = {
      id: `P${String(patients.length + 1).padStart(3, '0')}`,
      name: onboardingForm.name,
      village: onboardingForm.village,
      healthCentre: 'Mukono HC II',
      age: parseInt(onboardingForm.age),
      pregnancyWeek: parseInt(onboardingForm.pregnancyWeek),
      ancVisits: 1,
      lastANCDate: new Date(),
      trustData: [
        { level: 'high', label: 'HC II Registered', value: `Week ${onboardingForm.pregnancyWeek}, First ANC`, weight: 0 },
      ],
      riskScore: 15,
      riskLevel: 'low',
      explainabilityVector: ['Newly registered at HC II', 'Initial ANC visit complete'],
      actionsTaken: [
        { type: 'sms', description: 'Welcome SMS sent', status: 'completed', timestamp: new Date() },
      ],
    };

    setPatients(prev => [newPatient, ...prev]);
    
    toast.success('Patient registered successfully', {
      description: `${onboardingForm.name} has been added to the system`,
    });
    
    setOnboardingForm({
      name: '',
      age: '',
      village: '',
      pregnancyWeek: '',
      phoneNumber: '',
      nextOfKin: '',
      nextOfKinPhone: '',
    });
    
    setActiveTab('patients');
  };

  const handleVitalsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatient) return;

    const newVitals: VitalsRecord = {
      id: `V${String(vitalsRecords.length + 1).padStart(3, '0')}`,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      temperature: parseFloat(vitalsForm.temperature),
      bloodPressureSystolic: parseInt(vitalsForm.bloodPressureSystolic),
      bloodPressureDiastolic: parseInt(vitalsForm.bloodPressureDiastolic),
      weight: parseFloat(vitalsForm.weight),
      heartRate: parseInt(vitalsForm.heartRate),
      notes: vitalsForm.notes,
      recordedAt: new Date(),
      reportedToHCIII: false,
    };

    setVitalsRecords(prev => [newVitals, ...prev]);
    
    toast.success('Vitals recorded', {
      description: `Vitals for ${selectedPatient.name} have been saved`,
    });
    
    setVitalsForm({
      temperature: '',
      bloodPressureSystolic: '',
      bloodPressureDiastolic: '',
      weight: '',
      heartRate: '',
      notes: '',
    });
    setShowVitalsForm(false);
    setSelectedPatient(null);
  };

  const handleReportToHCIII = (vitalsId: string) => {
    setVitalsRecords(prev => 
      prev.map(v => v.id === vitalsId ? { ...v, reportedToHCIII: true } : v)
    );
    
    toast.success('Reported to HC III', {
      description: 'Vitals have been sent to Mukono HC III',
    });
  };

  const getTemperatureStatus = (temp: number) => {
    if (temp >= 38) return { label: 'Fever', variant: 'destructive' as const };
    if (temp >= 37.5) return { label: 'Elevated', variant: 'outline' as const };
    return { label: 'Normal', variant: 'secondary' as const };
  };

  const getBPStatus = (systolic: number, diastolic: number) => {
    if (systolic >= 140 || diastolic >= 90) return { label: 'High', variant: 'destructive' as const };
    if (systolic <= 90 || diastolic <= 60) return { label: 'Low', variant: 'outline' as const };
    return { label: 'Normal', variant: 'secondary' as const };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground">
        <div className="container py-6">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              <Link to="/" className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="p-2 bg-white/20 rounded-lg">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Health Centre II</h1>
                <p className="text-white/80 text-sm">Mukono Sub-County</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />
              <Link to="/vht">
                <Button variant="secondary" size="sm" className="gap-2">
                  <Users className="w-4 h-4" />
                  VHT
                </Button>
              </Link>
              <Link to="/">
                <Button variant="secondary" size="sm" className="gap-2">
                  <Stethoscope className="w-4 h-4" />
                  HC III
                </Button>
              </Link>
            </div>
          </div>
          <p className="text-sm text-white/70 mt-2 max-w-2xl">
            Patient onboarding, vitals monitoring, and reporting to Mukono HC III.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-3 mx-auto">
            <TabsTrigger value="patients" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Patients
            </TabsTrigger>
            <TabsTrigger value="onboarding" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Register
            </TabsTrigger>
            <TabsTrigger value="vitals" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Vitals Log
            </TabsTrigger>
          </TabsList>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Registered Patients</h2>
              <Badge variant="secondary">{patients.length} patients</Badge>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {patients.map((patient) => (
                <Card key={patient.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{patient.name}</CardTitle>
                        <CardDescription>{patient.village}</CardDescription>
                      </div>
                      <Badge 
                        variant={patient.riskLevel === 'high' ? 'destructive' : 'secondary'}
                      >
                        {patient.riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Age:</span>
                        <span className="font-medium text-foreground">{patient.age || 'N/A'} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pregnancy Week:</span>
                        <span className="font-medium text-foreground">Week {patient.pregnancyWeek}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ANC Visits:</span>
                        <span className="font-medium text-foreground">{patient.ancVisits}</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-4" 
                      variant="outline"
                      onClick={() => {
                        setSelectedPatient(patient);
                        setShowVitalsForm(true);
                      }}
                    >
                      <ThermometerSun className="w-4 h-4 mr-2" />
                      Record Vitals
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Onboarding Tab */}
          <TabsContent value="onboarding" className="animate-fade-in">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Register New Patient
                </CardTitle>
                <CardDescription>
                  Onboard pregnant women for ANC services and malaria monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleOnboardingSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={onboardingForm.name}
                        onChange={(e) => setOnboardingForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age (years) *</Label>
                      <Input
                        id="age"
                        type="number"
                        min="15"
                        max="50"
                        value={onboardingForm.age}
                        onChange={(e) => setOnboardingForm(prev => ({ ...prev, age: e.target.value }))}
                        placeholder="Enter age"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="village">Village *</Label>
                      <Input
                        id="village"
                        value={onboardingForm.village}
                        onChange={(e) => setOnboardingForm(prev => ({ ...prev, village: e.target.value }))}
                        placeholder="Enter village name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pregnancyWeek">Pregnancy Week *</Label>
                      <Input
                        id="pregnancyWeek"
                        type="number"
                        min="1"
                        max="42"
                        value={onboardingForm.pregnancyWeek}
                        onChange={(e) => setOnboardingForm(prev => ({ ...prev, pregnancyWeek: e.target.value }))}
                        placeholder="Week of pregnancy"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={onboardingForm.phoneNumber}
                        onChange={(e) => setOnboardingForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        placeholder="0770123456"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nextOfKin">Next of Kin</Label>
                      <Input
                        id="nextOfKin"
                        value={onboardingForm.nextOfKin}
                        onChange={(e) => setOnboardingForm(prev => ({ ...prev, nextOfKin: e.target.value }))}
                        placeholder="Name of next of kin"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    <Check className="w-4 h-4 mr-2" />
                    Register Patient
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vitals Log Tab */}
          <TabsContent value="vitals" className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Vitals Log</h2>
              <Badge variant="secondary">{vitalsRecords.length} records</Badge>
            </div>

            {vitalsRecords.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No vitals recorded yet.</p>
                  <p className="text-sm">Select a patient to record their vitals.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {vitalsRecords.map((record) => (
                  <Card key={record.id}>
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{record.patientName}</h3>
                            <span className="text-xs text-muted-foreground">
                              {record.recordedAt.toLocaleDateString()} at {record.recordedAt.toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <ThermometerSun className="w-4 h-4 text-muted-foreground" />
                              <span>{record.temperature}°C</span>
                              <Badge variant={getTemperatureStatus(record.temperature).variant} className="text-xs">
                                {getTemperatureStatus(record.temperature).label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Heart className="w-4 h-4 text-muted-foreground" />
                              <span>{record.bloodPressureSystolic}/{record.bloodPressureDiastolic} mmHg</span>
                              <Badge variant={getBPStatus(record.bloodPressureSystolic, record.bloodPressureDiastolic).variant} className="text-xs">
                                {getBPStatus(record.bloodPressureSystolic, record.bloodPressureDiastolic).label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Scale className="w-4 h-4 text-muted-foreground" />
                              <span>{record.weight} kg</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Activity className="w-4 h-4 text-muted-foreground" />
                              <span>{record.heartRate} bpm</span>
                            </div>
                          </div>
                          {record.notes && (
                            <p className="text-sm text-muted-foreground mt-2 italic">"{record.notes}"</p>
                          )}
                        </div>
                        {record.reportedToHCIII ? (
                          <Badge variant="outline" className="text-trust-high border-trust-high">
                            <Check className="w-3 h-3 mr-1" />
                            Reported
                          </Badge>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleReportToHCIII(record.id)}
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Report to HC III
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Vitals Recording Modal */}
      {showVitalsForm && selectedPatient && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ThermometerSun className="w-5 h-5" />
                Record Vitals
              </CardTitle>
              <CardDescription>
                Recording vitals for {selectedPatient.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVitalsSubmit} className="space-y-4">
                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature (°C) *</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      min="35"
                      max="42"
                      value={vitalsForm.temperature}
                      onChange={(e) => setVitalsForm(prev => ({ ...prev, temperature: e.target.value }))}
                      placeholder="36.5"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heartRate">Heart Rate (bpm) *</Label>
                    <Input
                      id="heartRate"
                      type="number"
                      min="40"
                      max="200"
                      value={vitalsForm.heartRate}
                      onChange={(e) => setVitalsForm(prev => ({ ...prev, heartRate: e.target.value }))}
                      placeholder="80"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="bpSystolic">BP Systolic (mmHg) *</Label>
                    <Input
                      id="bpSystolic"
                      type="number"
                      min="60"
                      max="200"
                      value={vitalsForm.bloodPressureSystolic}
                      onChange={(e) => setVitalsForm(prev => ({ ...prev, bloodPressureSystolic: e.target.value }))}
                      placeholder="120"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bpDiastolic">BP Diastolic (mmHg) *</Label>
                    <Input
                      id="bpDiastolic"
                      type="number"
                      min="40"
                      max="130"
                      value={vitalsForm.bloodPressureDiastolic}
                      onChange={(e) => setVitalsForm(prev => ({ ...prev, bloodPressureDiastolic: e.target.value }))}
                      placeholder="80"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg) *</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    min="30"
                    max="200"
                    value={vitalsForm.weight}
                    onChange={(e) => setVitalsForm(prev => ({ ...prev, weight: e.target.value }))}
                    placeholder="65.5"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={vitalsForm.notes}
                    onChange={(e) => setVitalsForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any additional observations..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setShowVitalsForm(false);
                      setSelectedPatient(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    <Check className="w-4 h-4 mr-2" />
                    Save Vitals
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container py-4 text-center text-xs text-muted-foreground">
          <p>Mukono Health Centre II • Reporting to Mukono HC III • Uganda</p>
        </div>
      </footer>
    </div>
  );
};

export default HCII;
