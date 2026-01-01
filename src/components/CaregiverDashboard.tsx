import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { VitalSignsChart } from './VitalSignsChart';
import { Heart, Activity, Droplet, Thermometer, Pill, Calendar, AlertTriangle, MessageSquare, LogOut, Globe, Bell } from 'lucide-react';

// Mock patient data (the person being cared for)
const mockPatient = {
  name: 'Ahmed Hassan',
  age: 68,
  relation: 'Father',
  status: 'normal',
  lastUpdate: '2 hours ago',
};

const mockVitalSigns = {
  bloodPressure: [
    { date: '12/18', systolic: 128, diastolic: 82 },
    { date: '12/19', systolic: 125, diastolic: 80 },
    { date: '12/20', systolic: 130, diastolic: 85 },
    { date: '12/21', systolic: 122, diastolic: 78 },
    { date: '12/22', systolic: 126, diastolic: 81 },
    { date: '12/23', systolic: 124, diastolic: 79 },
    { date: '12/24', systolic: 120, diastolic: 75 },
  ],
  heartRate: [
    { date: '12/18', value: 72 },
    { date: '12/19', value: 75 },
    { date: '12/20', value: 78 },
    { date: '12/21', value: 70 },
    { date: '12/22', value: 73 },
    { date: '12/23', value: 71 },
    { date: '12/24', value: 74 },
  ],
  glucose: [
    { date: '12/18', value: 105 },
    { date: '12/19', value: 110 },
    { date: '12/20', value: 98 },
    { date: '12/21', value: 102 },
    { date: '12/22', value: 108 },
    { date: '12/23', value: 95 },
    { date: '12/24', value: 100 },
  ],
  temperature: [
    { date: '12/18', value: 36.5 },
    { date: '12/19', value: 36.7 },
    { date: '12/20', value: 36.6 },
    { date: '12/21', value: 36.8 },
    { date: '12/22', value: 36.5 },
    { date: '12/23', value: 36.6 },
    { date: '12/24', value: 36.7 },
  ],
};

const mockMedications = [
  { id: '1', name: 'Aspirin', dosage: '100mg', time: '08:00', taken: true },
  { id: '2', name: 'Metformin', dosage: '500mg', time: '12:00', taken: false },
  { id: '3', name: 'Lisinopril', dosage: '10mg', time: '20:00', taken: false },
];

const mockAppointments = [
  { id: '1', doctor: 'Dr. Sarah Smith', date: '2024-12-26', time: '10:00 AM', reason: 'Regular Checkup' },
  { id: '2', doctor: 'Dr. John Davis', date: '2024-12-28', time: '02:00 PM', reason: 'Blood Test Results' },
];

const mockAlerts = [
  {
    id: '1',
    type: 'medication',
    message: 'Missed Metformin dose at 12:00 PM',
    time: '5 hours ago',
    severity: 'warning'
  },
];

export function CaregiverDashboard() {
  const { t, language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const medicationAdherence = (mockMedications.filter(m => m.taken).length / mockMedications.length) * 100;

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
        {/* Patient Info Header */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-white border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2>{mockPatient.name}</h2>
                <p className="text-muted-foreground">
                  {language === 'en' ? `${mockPatient.relation} • Age ${mockPatient.age}` : `${mockPatient.relation} • العمر ${mockPatient.age}`}
                </p>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {t('vitals.normal')}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  {language === 'en' ? 'Last update' : 'آخر تحديث'}: {mockPatient.lastUpdate}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="overview">{t('nav.dashboard')}</TabsTrigger>
            <TabsTrigger value="vitals">{t('nav.vitals')}</TabsTrigger>
            <TabsTrigger value="medications">{t('nav.medications')}</TabsTrigger>
            <TabsTrigger value="appointments">{t('nav.appointments')}</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm">{t('vitals.bloodPressure')}</CardTitle>
                  <Activity className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div>120/75</div>
                  <p className="text-xs text-muted-foreground">{t('vitals.normal')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm">{t('vitals.heartRate')}</CardTitle>
                  <Heart className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div>74 bpm</div>
                  <p className="text-xs text-muted-foreground">{t('vitals.normal')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm">{t('vitals.bloodGlucose')}</CardTitle>
                  <Droplet className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div>100 mg/dL</div>
                  <p className="text-xs text-muted-foreground">{t('vitals.normal')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm">{t('vitals.temperature')}</CardTitle>
                  <Thermometer className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div>36.7°C</div>
                  <p className="text-xs text-muted-foreground">{t('vitals.normal')}</p>
                </CardContent>
              </Card>
            </div>

            {/* Alerts */}
            {mockAlerts.length > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    {t('caregiver.recentAlerts')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-start justify-between p-3 bg-white border border-orange-200 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm">{alert.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                        </div>
                        <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200">
                          {t('alert.missedMedication')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Medication Adherence */}
            <Card>
              <CardHeader>
                <CardTitle>{t('meds.adherence')}</CardTitle>
                <CardDescription>{t('stats.today')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>{Math.round(medicationAdherence)}%</span>
                    <span className="text-sm text-muted-foreground">
                      {mockMedications.filter(m => m.taken).length}/{mockMedications.length} {language === 'en' ? 'taken' : 'مأخوذ'}
                    </span>
                  </div>
                  <Progress value={medicationAdherence} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Today's Medications */}
            <Card>
              <CardHeader>
                <CardTitle>{t('meds.schedule')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockMedications.map((med) => (
                    <div key={med.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${med.taken ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <Pill className={`h-4 w-4 ${med.taken ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <div>
                          <p className="text-sm">{med.name} - {med.dosage}</p>
                          <p className="text-xs text-muted-foreground">{med.time}</p>
                        </div>
                      </div>
                      <Badge variant={med.taken ? 'outline' : 'secondary'} className={med.taken ? 'bg-green-50 text-green-700 border-green-200' : ''}>
                        {med.taken ? t('meds.taken') : t('meds.upcoming')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>{t('appt.upcoming')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAppointments.map((appt) => (
                    <div key={appt.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm">{appt.doctor}</p>
                          <p className="text-xs text-muted-foreground">
                            {appt.date} • {appt.time}
                          </p>
                        </div>
                      </div>
                      <Badge>{appt.reason}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vitals Tab */}
          <TabsContent value="vitals" className="space-y-6">
            {/* Current Vitals */}
            <Card>
              <CardHeader>
                <CardTitle>{t('vitals.lastReading')}</CardTitle>
                <CardDescription>{language === 'en' ? 'December 24, 2024' : '٢٤ ديسمبر ٢٠٢٤'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <div>
                      <p>{t('vitals.bloodPressure')}</p>
                      <p className="text-sm text-muted-foreground">120/75 mmHg</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {t('vitals.normal')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-red-600" />
                    <div>
                      <p>{t('vitals.heartRate')}</p>
                      <p className="text-sm text-muted-foreground">74 bpm</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {t('vitals.normal')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Droplet className="h-5 w-5 text-orange-600" />
                    <div>
                      <p>{t('vitals.bloodGlucose')}</p>
                      <p className="text-sm text-muted-foreground">100 mg/dL</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {t('vitals.normal')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Thermometer className="h-5 w-5 text-green-600" />
                    <div>
                      <p>{t('vitals.temperature')}</p>
                      <p className="text-sm text-muted-foreground">36.7°C</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {t('vitals.normal')}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              <VitalSignsChart type="bloodPressure" data={mockVitalSigns.bloodPressure} />
              <VitalSignsChart type="heartRate" data={mockVitalSigns.heartRate} />
              <VitalSignsChart type="glucose" data={mockVitalSigns.glucose} />
              <VitalSignsChart type="temperature" data={mockVitalSigns.temperature} />
            </div>
          </TabsContent>

          {/* Medications Tab */}
          <TabsContent value="medications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('meds.schedule')}</CardTitle>
                <CardDescription>{t('stats.today')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockMedications.map((med) => (
                    <div key={med.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${med.taken ? 'bg-green-100' : 'bg-blue-100'}`}>
                          <Pill className={`h-5 w-5 ${med.taken ? 'text-green-600' : 'text-blue-600'}`} />
                        </div>
                        <div>
                          <p>{med.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {med.dosage} • {med.time}
                          </p>
                        </div>
                      </div>
                      <Badge className={med.taken ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700'}>
                        {med.taken ? t('meds.taken') : t('meds.upcoming')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Adherence Stats */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>{t('stats.thisWeek')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>85%</div>
                  <Progress value={85} className="h-2 mt-2" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{t('stats.thisMonth')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>92%</div>
                  <Progress value={92} className="h-2 mt-2" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{t('meds.missed')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>3</div>
                  <p className="text-sm text-muted-foreground">{language === 'en' ? 'This month' : 'هذا الشهر'}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('appt.upcoming')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAppointments.map((appt) => (
                    <div key={appt.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p>{appt.doctor}</p>
                          <p className="text-sm text-muted-foreground">
                            {appt.date} • {appt.time}
                          </p>
                          <p className="text-xs text-muted-foreground">{appt.reason}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        {t('common.view')}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}