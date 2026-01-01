import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { VitalSignsChart } from './VitalSignsChart';
import { Heart, Users, AlertTriangle, MessageSquare, FileText, TrendingUp, LogOut, Globe, Activity, Droplet, Thermometer } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// Mock patient data
const mockPatients = [
  { 
    id: '1', 
    name: 'Ahmed Hassan', 
    age: 68, 
    lastReading: '2 hours ago',
    status: 'normal',
    alerts: 0,
    vitals: {
      bloodPressure: '120/75',
      heartRate: 74,
      glucose: 100,
      temperature: 36.7
    }
  },
  { 
    id: '2', 
    name: 'Fatima Ali', 
    age: 72, 
    lastReading: '5 hours ago',
    status: 'warning',
    alerts: 1,
    vitals: {
      bloodPressure: '145/90',
      heartRate: 82,
      glucose: 125,
      temperature: 36.8
    }
  },
  { 
    id: '3', 
    name: 'Mohammed Ibrahim', 
    age: 65, 
    lastReading: '1 day ago',
    status: 'normal',
    alerts: 0,
    vitals: {
      bloodPressure: '118/72',
      heartRate: 70,
      glucose: 95,
      temperature: 36.6
    }
  },
];

const mockAlerts = [
  {
    id: '1',
    patient: 'Fatima Ali',
    type: 'abnormal',
    message: 'Blood pressure reading: 145/90 mmHg (High)',
    time: '2 hours ago',
    severity: 'warning'
  },
  {
    id: '2',
    patient: 'Ahmed Hassan',
    type: 'medication',
    message: 'Missed Metformin dose at 12:00 PM',
    time: '5 hours ago',
    severity: 'info'
  },
];

const mockVitalHistory = {
  bloodPressure: [
    { date: '12/18', systolic: 145, diastolic: 92 },
    { date: '12/19', systolic: 142, diastolic: 88 },
    { date: '12/20', systolic: 148, diastolic: 95 },
    { date: '12/21', systolic: 140, diastolic: 86 },
    { date: '12/22', systolic: 143, diastolic: 89 },
    { date: '12/23', systolic: 141, diastolic: 87 },
    { date: '12/24', systolic: 145, diastolic: 90 },
  ],
  heartRate: [
    { date: '12/18', value: 78 },
    { date: '12/19', value: 80 },
    { date: '12/20', value: 85 },
    { date: '12/21', value: 76 },
    { date: '12/22', value: 79 },
    { date: '12/23', value: 77 },
    { date: '12/24', value: 82 },
  ],
  glucose: [
    { date: '12/18', value: 120 },
    { date: '12/19', value: 128 },
    { date: '12/20', value: 115 },
    { date: '12/21', value: 122 },
    { date: '12/22', value: 130 },
    { date: '12/23', value: 118 },
    { date: '12/24', value: 125 },
  ],
  temperature: [
    { date: '12/18', value: 36.7 },
    { date: '12/19', value: 36.9 },
    { date: '12/20', value: 36.8 },
    { date: '12/21', value: 36.7 },
    { date: '12/22', value: 36.8 },
    { date: '12/23', value: 36.7 },
    { date: '12/24', value: 36.8 },
  ],
};

export function DoctorDashboard() {
  const { t, language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [instructionText, setInstructionText] = useState('');

  const handleSendInstructions = () => {
    toast.success(t('common.success'));
    setInstructionText('');
  };

  const handleGenerateReport = () => {
    toast.success(t('report.download'));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-blue-600">{t('app.name')}</h2>
                <p className="text-sm text-muted-foreground">{t('dashboard.welcome')}, {user?.fullName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              >
                <Globe className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="overview">{t('nav.dashboard')}</TabsTrigger>
            <TabsTrigger value="patients">{t('nav.patients')}</TabsTrigger>
            <TabsTrigger value="alerts">{t('nav.alerts')}</TabsTrigger>
            <TabsTrigger value="messages">{t('nav.messages')}</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm">{t('doctor.patients')}</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div>{mockPatients.length}</div>
                  <p className="text-xs text-muted-foreground">{language === 'en' ? 'Active patients' : 'مرضى نشطون'}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm">{t('nav.alerts')}</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div>{mockAlerts.length}</div>
                  <p className="text-xs text-muted-foreground">{language === 'en' ? 'Pending alerts' : 'تنبيهات معلقة'}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm">{t('nav.messages')}</CardTitle>
                  <MessageSquare className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div>5</div>
                  <p className="text-xs text-muted-foreground">{language === 'en' ? 'Unread messages' : 'رسائل غير مقروءة'}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm">{t('nav.reports')}</CardTitle>
                  <FileText className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div>12</div>
                  <p className="text-xs text-muted-foreground">{language === 'en' ? 'This month' : 'هذا الشهر'}</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>{t('caregiver.recentAlerts')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <AlertTriangle className={`h-5 w-5 mt-1 ${alert.severity === 'warning' ? 'text-orange-600' : 'text-blue-600'}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p>{alert.patient}</p>
                          <span className="text-xs text-muted-foreground">{alert.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                      </div>
                      <Badge variant={alert.severity === 'warning' ? 'destructive' : 'outline'}>
                        {alert.type === 'abnormal' ? t('alert.abnormalReading') : t('alert.missedMedication')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Patient Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.overview')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPatients.map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          patient.status === 'normal' ? 'bg-green-100' : 'bg-orange-100'
                        }`}>
                          <TrendingUp className={`h-5 w-5 ${
                            patient.status === 'normal' ? 'text-green-600' : 'text-orange-600'
                          }`} />
                        </div>
                        <div>
                          <p>{patient.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {language === 'en' ? `Age ${patient.age}` : `العمر ${patient.age}`} • {patient.lastReading}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {patient.alerts > 0 && (
                          <Badge variant="destructive">{patient.alerts} {language === 'en' ? 'alerts' : 'تنبيهات'}</Badge>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedPatient(patient)}>
                              {t('common.view')}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{patient.name}</DialogTitle>
                              <DialogDescription>
                                {language === 'en' ? `Patient Details and Health History` : 'تفاصيل المريض والسجل الصحي'}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              {/* Current Vitals */}
                              <div className="grid gap-4 md:grid-cols-2">
                                <Card>
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-sm">{t('vitals.bloodPressure')}</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="flex items-center gap-2">
                                      <Activity className="h-4 w-4 text-blue-600" />
                                      <span>{patient.vitals.bloodPressure} mmHg</span>
                                    </div>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-sm">{t('vitals.heartRate')}</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="flex items-center gap-2">
                                      <Heart className="h-4 w-4 text-red-600" />
                                      <span>{patient.vitals.heartRate} bpm</span>
                                    </div>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-sm">{t('vitals.bloodGlucose')}</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="flex items-center gap-2">
                                      <Droplet className="h-4 w-4 text-orange-600" />
                                      <span>{patient.vitals.glucose} mg/dL</span>
                                    </div>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-sm">{t('vitals.temperature')}</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="flex items-center gap-2">
                                      <Thermometer className="h-4 w-4 text-green-600" />
                                      <span>{patient.vitals.temperature}°C</span>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>

                              {/* Historical Charts */}
                              <div className="grid gap-4">
                                <VitalSignsChart type="bloodPressure" data={mockVitalHistory.bloodPressure} />
                              </div>

                              {/* Send Instructions */}
                              <div className="space-y-2">
                                <Label>{t('doctor.sendInstructions')}</Label>
                                <Textarea
                                  placeholder={language === 'en' ? 'Enter instructions for the patient...' : 'أدخل التعليمات للمريض...'}
                                  value={instructionText}
                                  onChange={(e) => setInstructionText(e.target.value)}
                                  rows={4}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={handleGenerateReport}>
                                <FileText className="h-4 w-4 mr-2" />
                                {t('report.generate')}
                              </Button>
                              <Button onClick={handleSendInstructions} className="bg-blue-600 hover:bg-blue-700">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                {t('common.send')}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('doctor.patients')}</CardTitle>
                <CardDescription>{mockPatients.length} {language === 'en' ? 'active patients' : 'مرضى نشطون'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPatients.map((patient) => (
                    <div key={patient.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3>{patient.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {language === 'en' ? `Age ${patient.age}` : `العمر ${patient.age}`}
                          </p>
                        </div>
                        <Badge variant={patient.status === 'normal' ? 'outline' : 'destructive'}>
                          {patient.status === 'normal' ? t('vitals.normal') : t('vitals.high')}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <p className="text-xs text-muted-foreground">{t('vitals.bloodPressure')}</p>
                          <p className="font-medium">{patient.vitals.bloodPressure}</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <p className="text-xs text-muted-foreground">{t('vitals.heartRate')}</p>
                          <p className="font-medium">{patient.vitals.heartRate} bpm</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <p className="text-xs text-muted-foreground">{t('vitals.bloodGlucose')}</p>
                          <p className="font-medium">{patient.vitals.glucose} mg/dL</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <p className="text-xs text-muted-foreground">{t('vitals.temperature')}</p>
                          <p className="font-medium">{patient.vitals.temperature}°C</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('nav.alerts')}</CardTitle>
                <CardDescription>{mockAlerts.length} {language === 'en' ? 'active alerts' : 'تنبيهات نشطة'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAlerts.map((alert) => (
                    <div key={alert.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className={`h-5 w-5 ${alert.severity === 'warning' ? 'text-orange-600' : 'text-blue-600'}`} />
                          <div>
                            <p>{alert.patient}</p>
                            <span className="text-xs text-muted-foreground">{alert.time}</span>
                          </div>
                        </div>
                        <Badge variant={alert.severity === 'warning' ? 'destructive' : 'outline'}>
                          {alert.type === 'abnormal' ? t('alert.abnormalReading') : t('alert.missedMedication')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground ml-8">{alert.message}</p>
                      <div className="flex gap-2 mt-3 ml-8">
                        <Button size="sm" variant="outline">
                          {t('msg.reply')}
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          {t('common.view')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('msg.inbox')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="h-5 w-5 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p>Ahmed Hassan</p>
                          <span className="text-xs text-muted-foreground">1 hour ago</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {language === 'en' 
                            ? 'Doctor, I have been feeling dizzy after taking my medication. Should I be concerned?' 
                            : 'دكتور، أشعر بالدوار بعد تناول الدواء. هل يجب أن أقلق؟'}
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          {t('msg.reply')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium">{children}</label>;
}
