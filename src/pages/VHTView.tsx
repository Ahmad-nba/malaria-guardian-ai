import { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  AlertTriangle,
  Navigation,
  MessageSquare,
  Baby,
  ChevronRight,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface Assignment {
  id: string;
  patientName: string;
  village: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  pregnancyWeek: number;
  phone?: string;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed';
  symptoms: string[];
}

const mockAssignments: Assignment[] = [
  {
    id: 'A001',
    patientName: 'Amina Nakato',
    village: 'Kigungu Village',
    priority: 'high',
    reason: 'URGENT: High malaria risk - escort to HC III if needed',
    pregnancyWeek: 32,
    phone: '+256 700 123 456',
    deadline: 'Today',
    status: 'pending',
    symptoms: ['Fever', 'Headache', 'No Bed-Net'],
  },
  {
    id: 'A002',
    patientName: 'Jane Kyomuhendo',
    village: 'Nama Village',
    priority: 'high',
    reason: 'URGENT: First trimester with fever - immediate visit required',
    pregnancyWeek: 8,
    phone: '+256 700 234 567',
    deadline: 'Today',
    status: 'pending',
    symptoms: ['Fever', 'Body Aches', 'Fatigue'],
  },
  {
    id: 'A003',
    patientName: 'Sarah Namugga',
    village: 'Buwama Village',
    priority: 'medium',
    reason: 'Follow-up visit - check symptoms and bed-net usage',
    pregnancyWeek: 24,
    phone: '+256 700 345 678',
    deadline: 'Within 48 hours',
    status: 'in_progress',
    symptoms: ['Headache'],
  },
];

export default function VHTView() {
  const [assignments, setAssignments] = useState(mockAssignments);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [visitNotes, setVisitNotes] = useState('');
  const [showVisitForm, setShowVisitForm] = useState(false);

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high': return 'risk-high';
      case 'medium': return 'risk-medium';
      case 'low': return 'risk-low';
      default: return '';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': 
        return <Badge variant="outline" className="bg-risk-medium-bg text-risk-medium border-risk-medium/30">Pending</Badge>;
      case 'in_progress': 
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">In Progress</Badge>;
      case 'completed': 
        return <Badge variant="outline" className="bg-risk-low-bg text-risk-low border-risk-low/30">Completed</Badge>;
    }
  };

  const handleStartVisit = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setAssignments(prev => prev.map(a => 
      a.id === assignment.id ? { ...a, status: 'in_progress' as const } : a
    ));
    toast.info(`Visit started for ${assignment.patientName}`);
  };

  const handleCompleteVisit = () => {
    if (!selectedAssignment) return;
    
    setAssignments(prev => prev.map(a => 
      a.id === selectedAssignment.id ? { ...a, status: 'completed' as const } : a
    ));
    
    toast.success('Visit completed!', {
      description: `Notes submitted for ${selectedAssignment.patientName}`,
    });
    
    setShowVisitForm(false);
    setVisitNotes('');
    setSelectedAssignment(null);
  };

  const pendingCount = assignments.filter(a => a.status === 'pending').length;
  const urgentCount = assignments.filter(a => a.priority === 'high' && a.status !== 'completed').length;

  // Visit Form View
  if (showVisitForm && selectedAssignment) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-card border-b border-border">
          <div className="flex items-center gap-3 p-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowVisitForm(false)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="font-semibold">Log Visit</h1>
              <p className="text-sm text-muted-foreground">{selectedAssignment.patientName}</p>
            </div>
          </div>
        </header>

        <main className="p-4 space-y-4">
          {/* Patient Summary */}
          <div className="healthcare-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getPriorityClass(selectedAssignment.priority)}`}>
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">{selectedAssignment.patientName}</h3>
                <p className="text-sm text-muted-foreground">{selectedAssignment.village}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {selectedAssignment.symptoms.map((s, i) => (
                <span key={i} className="text-xs px-2 py-1 rounded-full bg-muted">{s}</span>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-auto py-3 flex flex-col items-center gap-1"
              onClick={() => toast.info('Patient found at home')}
            >
              <CheckCircle2 className="w-5 h-5 text-risk-low" />
              <span className="text-xs">Found at Home</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-3 flex flex-col items-center gap-1"
              onClick={() => toast.warning('Marked as not home - will retry')}
            >
              <Clock className="w-5 h-5 text-risk-medium" />
              <span className="text-xs">Not Home</span>
            </Button>
          </div>

          {/* Visit Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Visit Notes</label>
            <Textarea 
              placeholder="Describe the visit... (patient condition, observations, any concerns)"
              value={visitNotes}
              onChange={(e) => setVisitNotes(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          {/* Quick Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Quick Add:</label>
            <div className="flex gap-2 flex-wrap">
              {[
                'Patient looks well',
                'Advised to visit HC',
                'Gave bed-net',
                'Referred to HC III',
                'Symptoms improved',
                'Still has fever',
              ].map((note, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setVisitNotes(prev => prev ? `${prev}\n• ${note}` : `• ${note}`)}
                >
                  + {note}
                </Button>
              ))}
            </div>
          </div>

          {/* Referral Option */}
          <div className="healthcare-card p-4 border-risk-high/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-risk-high flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-sm">Needs Urgent Referral?</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  If patient shows danger signs, escort them to HC III immediately.
                </p>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => {
                    setVisitNotes(prev => prev + '\n⚠️ URGENT REFERRAL: Escorting patient to HC III');
                    toast.error('Urgent referral flagged - HC III notified');
                  }}
                >
                  Flag Urgent Referral
                </Button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button 
            className="w-full"
            size="lg"
            onClick={handleCompleteVisit}
            disabled={!visitNotes.trim()}
          >
            <Send className="w-4 h-4 mr-2" />
            Submit Visit Report
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 dashboard-header text-primary-foreground">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="font-bold">VHT Dashboard</h1>
              <p className="text-sm text-primary-foreground/80">Mukono HC III</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-xs text-primary-foreground/70">pending</p>
            </div>
          </div>
        </div>

        {/* Urgent Alert */}
        {urgentCount > 0 && (
          <div className="bg-risk-high/90 px-4 py-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">{urgentCount} urgent visit(s) today</span>
          </div>
        )}
      </header>

      {/* Quick Stats */}
      <div className="p-4 grid grid-cols-3 gap-3">
        <div className="healthcare-card p-3 text-center">
          <p className="text-xl font-bold text-risk-high">{assignments.filter(a => a.priority === 'high').length}</p>
          <p className="text-xs text-muted-foreground">High Priority</p>
        </div>
        <div className="healthcare-card p-3 text-center">
          <p className="text-xl font-bold text-risk-medium">{assignments.filter(a => a.status === 'in_progress').length}</p>
          <p className="text-xs text-muted-foreground">In Progress</p>
        </div>
        <div className="healthcare-card p-3 text-center">
          <p className="text-xl font-bold text-risk-low">{assignments.filter(a => a.status === 'completed').length}</p>
          <p className="text-xs text-muted-foreground">Completed</p>
        </div>
      </div>

      {/* Assignments List */}
      <main className="p-4 space-y-3">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Today's Assignments
        </h2>

        {assignments.map((assignment) => (
          <div 
            key={assignment.id}
            className={`healthcare-card overflow-hidden ${
              assignment.priority === 'high' && assignment.status !== 'completed' 
                ? 'border-risk-high/30' 
                : ''
            }`}
          >
            {/* Priority Bar */}
            <div className={`h-1 ${getPriorityClass(assignment.priority)}`} />
            
            <div className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getPriorityClass(assignment.priority)}`}>
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{assignment.patientName}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {assignment.village}
                    </div>
                  </div>
                </div>
                {getStatusBadge(assignment.status)}
              </div>

              {/* Info */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <Baby className="w-4 h-4 text-muted-foreground" />
                  <span>Week {assignment.pregnancyWeek}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className={assignment.deadline === 'Today' ? 'font-medium text-risk-high' : ''}>
                    {assignment.deadline}
                  </span>
                </div>
              </div>

              {/* Reason */}
              <p className={`text-sm mb-3 ${
                assignment.priority === 'high' ? 'text-risk-high font-medium' : 'text-muted-foreground'
              }`}>
                {assignment.reason}
              </p>

              {/* Symptoms */}
              <div className="flex gap-2 flex-wrap mb-4">
                {assignment.symptoms.map((s, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-full bg-muted">{s}</span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {assignment.phone && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                    onClick={() => window.open(`tel:${assignment.phone}`)}
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                  onClick={() => toast.info('Opening maps...')}
                >
                  <Navigation className="w-4 h-4 mr-1" />
                  Navigate
                </Button>
                {assignment.status === 'pending' ? (
                  <Button 
                    size="sm"
                    className="flex-1"
                    onClick={() => handleStartVisit(assignment)}
                  >
                    Start Visit
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : assignment.status === 'in_progress' ? (
                  <Button 
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setSelectedAssignment(assignment);
                      setShowVisitForm(true);
                    }}
                  >
                    Log Visit
                    <MessageSquare className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button 
                    variant="outline"
                    size="sm"
                    className="flex-1 text-risk-low"
                    disabled
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Done
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Bottom Nav Placeholder */}
      <div className="h-20" />
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 flex justify-around">
        <Button variant="ghost" className="flex-col h-auto py-2">
          <User className="w-5 h-5" />
          <span className="text-xs mt-1">Assignments</span>
        </Button>
        <Button variant="ghost" className="flex-col h-auto py-2 text-muted-foreground">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-xs mt-1">Completed</span>
        </Button>
        <Button variant="ghost" className="flex-col h-auto py-2 text-muted-foreground">
          <MessageSquare className="w-5 h-5" />
          <span className="text-xs mt-1">Messages</span>
        </Button>
      </nav>
    </div>
  );
}
