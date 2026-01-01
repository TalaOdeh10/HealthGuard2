import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Common
    'app.name': 'Nabd',
    'app.tagline': 'Remote Health Monitoring for the Elderly',
    'common.login': 'Login',
    'common.register': 'Register',
    'common.logout': 'Logout',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.add': 'Add',
    'common.view': 'View',
    'common.send': 'Send',
    'common.close': 'Close',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    
    // Auth
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.fullName': 'Full Name',
    'auth.role': 'Role',
    'auth.patient': 'Patient',
    'auth.doctor': 'Doctor',
    'auth.caregiver': 'Caregiver',
    'auth.loginTitle': 'Login to Nabd',
    'auth.registerTitle': 'Create Account',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.vitals': 'Vital Signs',
    'nav.medications': 'Medications',
    'nav.appointments': 'Appointments',
    'nav.messages': 'Messages',
    'nav.reports': 'Reports',
    'nav.patients': 'Patients',
    'nav.alerts': 'Alerts',
    'nav.profile': 'Profile',
    
    // Dashboard
    'dashboard.welcome': 'Welcome',
    'dashboard.overview': 'Overview',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.quickActions': 'Quick Actions',
    
    // Vital Signs
    'vitals.title': 'Vital Signs',
    'vitals.bloodPressure': 'Blood Pressure',
    'vitals.heartRate': 'Heart Rate',
    'vitals.bloodGlucose': 'Blood Glucose',
    'vitals.temperature': 'Body Temperature',
    'vitals.systolic': 'Systolic',
    'vitals.diastolic': 'Diastolic',
    'vitals.addReading': 'Add Reading',
    'vitals.recordNew': 'Record New Reading',
    'vitals.history': 'History',
    'vitals.trends': 'Trends',
    'vitals.lastReading': 'Last Reading',
    'vitals.normal': 'Normal',
    'vitals.high': 'High',
    'vitals.low': 'Low',
    'vitals.critical': 'Critical',
    
    // Medications
    'meds.title': 'Medications',
    'meds.schedule': 'Schedule',
    'meds.adherence': 'Adherence',
    'meds.name': 'Medication Name',
    'meds.dosage': 'Dosage',
    'meds.frequency': 'Frequency',
    'meds.time': 'Time',
    'meds.instructions': 'Instructions',
    'meds.taken': 'Taken',
    'meds.missed': 'Missed',
    'meds.upcoming': 'Upcoming',
    'meds.addMedication': 'Add Medication',
    'meds.reminder': 'Reminder',
    'meds.markTaken': 'Mark as Taken',
    
    // Appointments
    'appt.title': 'Appointments',
    'appt.upcoming': 'Upcoming Appointments',
    'appt.past': 'Past Appointments',
    'appt.book': 'Book Appointment',
    'appt.with': 'With',
    'appt.date': 'Date',
    'appt.time': 'Time',
    'appt.reason': 'Reason',
    'appt.notes': 'Notes',
    'appt.cancel': 'Cancel Appointment',
    'appt.reschedule': 'Reschedule',
    
    // Messages
    'msg.title': 'Messages',
    'msg.compose': 'Compose Message',
    'msg.inbox': 'Inbox',
    'msg.sent': 'Sent',
    'msg.to': 'To',
    'msg.from': 'From',
    'msg.subject': 'Subject',
    'msg.message': 'Message',
    'msg.reply': 'Reply',
    'msg.noMessages': 'No messages',
    
    // Alerts
    'alert.emergency': 'Emergency Alert',
    'alert.requestHelp': 'Request Assistance',
    'alert.abnormalReading': 'Abnormal Reading',
    'alert.missedMedication': 'Missed Medication',
    'alert.criticalAlert': 'Critical Alert',
    'alert.sendAlert': 'Send Emergency Alert',
    'alert.alertSent': 'Alert sent successfully',
    
    // Reports
    'report.title': 'Health Reports',
    'report.generate': 'Generate Report',
    'report.weekly': 'Weekly Report',
    'report.monthly': 'Monthly Report',
    'report.custom': 'Custom Report',
    'report.download': 'Download Report',
    'report.view': 'View Report',
    
    // Doctor
    'doctor.patients': 'My Patients',
    'doctor.patientDetails': 'Patient Details',
    'doctor.healthHistory': 'Health History',
    'doctor.setThreshold': 'Set Alert Threshold',
    'doctor.sendInstructions': 'Send Instructions',
    'doctor.updateMedication': 'Update Medication',
    
    // Caregiver
    'caregiver.overview': 'Patient Overview',
    'caregiver.healthSummary': 'Health Summary',
    'caregiver.recentAlerts': 'Recent Alerts',
    
    // Stats
    'stats.today': 'Today',
    'stats.thisWeek': 'This Week',
    'stats.thisMonth': 'This Month',
    'stats.average': 'Average',
    'stats.min': 'Min',
    'stats.max': 'Max',
  },
  ar: {
    // Common
    'app.name': 'نبض',
    'app.tagline': 'مراقبة صحية عن بعد لكبار السن',
    'common.login': 'تسجيل الدخول',
    'common.register': 'إنشاء حساب',
    'common.logout': 'تسجيل الخروج',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.add': 'إضافة',
    'common.view': 'عرض',
    'common.send': 'إرسال',
    'common.close': 'إغلاق',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجاح',
    
    // Auth
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.confirmPassword': 'تأكيد كلمة المرور',
    'auth.fullName': 'الاسم الكامل',
    'auth.role': 'الدور',
    'auth.patient': 'مريض',
    'auth.doctor': 'طبيب',
    'auth.caregiver': 'مقدم رعاية',
    'auth.loginTitle': 'تسجيل الدخول إلى نبض',
    'auth.registerTitle': 'إنشاء حساب جديد',
    'auth.noAccount': 'ليس لديك حساب؟',
    'auth.hasAccount': 'لديك حساب بالفعل؟',
    
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.vitals': 'العلامات الحيوية',
    'nav.medications': 'الأدوية',
    'nav.appointments': 'المواعيد',
    'nav.messages': 'الرسائل',
    'nav.reports': 'التقارير',
    'nav.patients': 'المرضى',
    'nav.alerts': 'التنبيهات',
    'nav.profile': 'الملف الشخصي',
    
    // Dashboard
    'dashboard.welcome': 'مرحباً',
    'dashboard.overview': 'نظرة عامة',
    'dashboard.recentActivity': 'النشاط الأخير',
    'dashboard.quickActions': 'إجراءات سريعة',
    
    // Vital Signs
    'vitals.title': 'العلامات الحيوية',
    'vitals.bloodPressure': 'ضغط الدم',
    'vitals.heartRate': 'معدل نبضات القلب',
    'vitals.bloodGlucose': 'سكر الدم',
    'vitals.temperature': 'درجة حرارة الجسم',
    'vitals.systolic': 'الانقباضي',
    'vitals.diastolic': 'الانبساطي',
    'vitals.addReading': 'إضافة قراءة',
    'vitals.recordNew': 'تسجيل قراءة جديدة',
    'vitals.history': 'السجل',
    'vitals.trends': 'الاتجاهات',
    'vitals.lastReading': 'آخر قراءة',
    'vitals.normal': 'طبيعي',
    'vitals.high': 'مرتفع',
    'vitals.low': 'منخفض',
    'vitals.critical': 'حرج',
    
    // Medications
    'meds.title': 'الأدوية',
    'meds.schedule': 'الجدول',
    'meds.adherence': 'الالتزام',
    'meds.name': 'اسم الدواء',
    'meds.dosage': 'الجرعة',
    'meds.frequency': 'التكرار',
    'meds.time': 'الوقت',
    'meds.instructions': 'التعليمات',
    'meds.taken': 'تم الأخذ',
    'meds.missed': 'فائت',
    'meds.upcoming': 'قادم',
    'meds.addMedication': 'إضافة دواء',
    'meds.reminder': 'تذكير',
    'meds.markTaken': 'تحديد كمأخوذ',
    
    // Appointments
    'appt.title': 'المواعيد',
    'appt.upcoming': 'المواعيد القادمة',
    'appt.past': 'المواعيد السابقة',
    'appt.book': 'حجز موع��',
    'appt.with': 'مع',
    'appt.date': 'التاريخ',
    'appt.time': 'الوقت',
    'appt.reason': 'السبب',
    'appt.notes': 'ملاحظات',
    'appt.cancel': 'إلغاء الموعد',
    'appt.reschedule': 'إعادة جدولة',
    
    // Messages
    'msg.title': 'الرسائل',
    'msg.compose': 'إنشاء رسالة',
    'msg.inbox': 'البريد الوارد',
    'msg.sent': 'المرسل',
    'msg.to': 'إلى',
    'msg.from': 'من',
    'msg.subject': 'الموضوع',
    'msg.message': 'الرسالة',
    'msg.reply': 'رد',
    'msg.noMessages': 'لا توجد رسائل',
    
    // Alerts
    'alert.emergency': 'تنبيه طارئ',
    'alert.requestHelp': 'طلب المساعدة',
    'alert.abnormalReading': 'قراءة غير طبيعية',
    'alert.missedMedication': 'دواء فائت',
    'alert.criticalAlert': 'تنبيه حرج',
    'alert.sendAlert': 'إرسال تنبيه طارئ',
    'alert.alertSent': 'تم إرسال التنبيه بنجاح',
    
    // Reports
    'report.title': 'التقارير الصحية',
    'report.generate': 'إنشاء تقرير',
    'report.weekly': 'تقرير أسبوعي',
    'report.monthly': 'تقرير شهري',
    'report.custom': 'تقرير مخصص',
    'report.download': 'تنزيل التقرير',
    'report.view': 'عرض التقرير',
    
    // Doctor
    'doctor.patients': 'مرضاي',
    'doctor.patientDetails': 'تفاصيل المريض',
    'doctor.healthHistory': 'السجل الصحي',
    'doctor.setThreshold': 'تعيين عتبة التنبيه',
    'doctor.sendInstructions': 'إرسال تعليمات',
    'doctor.updateMedication': 'تحديث الدواء',
    
    // Caregiver
    'caregiver.overview': 'نظرة عامة على المريض',
    'caregiver.healthSummary': 'ملخص صحي',
    'caregiver.recentAlerts': 'التنبيهات الأخيرة',
    
    // Stats
    'stats.today': 'اليوم',
    'stats.thisWeek': 'هذا الأسبوع',
    'stats.thisMonth': 'هذا الشهر',
    'stats.average': 'المتوسط',
    'stats.min': 'الأدنى',
    'stats.max': 'الأعلى',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Set document direction based on language
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}