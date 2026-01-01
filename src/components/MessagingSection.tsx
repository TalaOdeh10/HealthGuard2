import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { MessageSquare, Send, UserCircle2, Stethoscope, HeartHandshake } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Message {
  id: string;
  from: string;
  fromRole: 'doctor' | 'caregiver' | 'patient';
  to: string;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const mockMessages: Message[] = [
  {
    id: '1',
    from: 'Dr. Sarah Smith',
    fromRole: 'doctor',
    to: 'Ahmed Hassan',
    subject: 'Blood Test Results',
    message: 'Your latest blood test results look good. Keep up with your medication schedule. Your glucose levels are well controlled.',
    timestamp: '2 hours ago',
    read: true,
  },
  {
    id: '2',
    from: 'Fatima Ali',
    fromRole: 'caregiver',
    to: 'Ahmed Hassan',
    subject: 'Medication Reminder',
    message: 'Hi Dad, just checking if you took your evening medication. Please let me know. Love you!',
    timestamp: '5 hours ago',
    read: true,
  },
  {
    id: '3',
    from: 'Dr. Sarah Smith',
    fromRole: 'doctor',
    to: 'Ahmed Hassan',
    subject: 'Appointment Confirmation',
    message: 'Your appointment is scheduled for December 26 at 10:00 AM. Please bring your latest medication list.',
    timestamp: '1 day ago',
    read: false,
  },
  {
    id: '4',
    from: 'Fatima Ali',
    fromRole: 'caregiver',
    to: 'Ahmed Hassan',
    subject: 'Weekly Check-in',
    message: 'How are you feeling this week? I noticed your blood pressure readings have been good. Keep it up!',
    timestamp: '2 days ago',
    read: false,
  },
];

export function MessagingSection() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  
  // Compose message states
  const [recipient, setRecipient] = useState<'doctor' | 'caregiver'>('doctor');
  const [subject, setSubject] = useState('');
  const [messageText, setMessageText] = useState('');

  const handleMarkAsRead = (id: string) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, read: true } : msg
    ));
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    toast.success(t('common.success'));
    setReplyText('');
    setSelectedMessage(null);
  };

  const handleSendMessage = () => {
    if (!subject.trim() || !messageText.trim()) {
      toast.error(language === 'en' ? 'Please fill all fields' : 'يرجى ملء جميع الحقول');
      return;
    }
    toast.success(t('common.success'));
    setSubject('');
    setMessageText('');
    setComposeOpen(false);
  };

  const unreadCount = messages.filter(m => !m.read).length;
  const doctorMessages = messages.filter(m => m.fromRole === 'doctor');
  const caregiverMessages = messages.filter(m => m.fromRole === 'caregiver');

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'doctor':
        return <Stethoscope className="h-5 w-5 text-blue-600" />;
      case 'caregiver':
        return <HeartHandshake className="h-5 w-5 text-green-600" />;
      default:
        return <UserCircle2 className="h-5 w-5 text-gray-600" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'doctor':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{t('auth.doctor')}</Badge>;
      case 'caregiver':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{t('auth.caregiver')}</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{t('msg.inbox')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>{messages.length}</div>
              {unreadCount > 0 && (
                <Badge variant="destructive">{unreadCount} {language === 'en' ? 'unread' : 'غير مقروء'}</Badge>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{language === 'en' ? 'From Doctor' : 'من الطبيب'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-blue-600" />
              <span>{doctorMessages.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{language === 'en' ? 'From Caregiver' : 'من مقدم الرعاية'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <HeartHandshake className="h-4 w-4 text-green-600" />
              <span>{caregiverMessages.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compose Message Button */}
      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            <Send className="h-4 w-4 mr-2" />
            {t('msg.compose')}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('msg.compose')}</DialogTitle>
            <DialogDescription>
              {language === 'en' 
                ? 'Send a message to your doctor or caregiver' 
                : 'أرسل رسالة إلى طبيبك أو مقدم الرعاية'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('msg.to')}</Label>
              <Select value={recipient} onValueChange={(value) => setRecipient(value as 'doctor' | 'caregiver')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="doctor">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4" />
                      {language === 'en' ? 'Dr. Sarah Smith' : 'د. سارة سميث'}
                    </div>
                  </SelectItem>
                  <SelectItem value="caregiver">
                    <div className="flex items-center gap-2">
                      <HeartHandshake className="h-4 w-4" />
                      {language === 'en' ? 'Fatima Ali (Caregiver)' : 'فاطمة علي (مقدمة رعاية)'}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('msg.subject')}</Label>
              <Input
                placeholder={language === 'en' ? 'Enter subject...' : 'أدخل الموضوع...'}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('msg.message')}</Label>
              <Textarea
                placeholder={language === 'en' ? 'Type your message here...' : 'اكتب رسالتك هنا...'}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setComposeOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
              <Send className="h-4 w-4 mr-2" />
              {t('common.send')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Messages List */}
      <Card>
        <CardHeader>
          <CardTitle>{t('msg.inbox')}</CardTitle>
          <CardDescription>
            {language === 'en' 
              ? 'Messages from your doctor and caregiver' 
              : 'رسائل من طبيبك ومقدم الرعاية'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>{t('msg.noMessages')}</p>
            </div>
          ) : (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-3">
                {messages.map((message) => (
                  <Dialog key={message.id}>
                    <DialogTrigger asChild>
                      <div
                        className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                          !message.read ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                        onClick={() => {
                          setSelectedMessage(message);
                          handleMarkAsRead(message.id);
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {getRoleIcon(message.fromRole)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium truncate">{message.from}</p>
                                {getRoleBadge(message.fromRole)}
                              </div>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {message.timestamp}
                              </span>
                            </div>
                            <p className="text-sm font-medium mb-1">{message.subject}</p>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {message.message}
                            </p>
                          </div>
                          {!message.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                          )}
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <div className="flex items-center gap-2 mb-2">
                          {getRoleIcon(message.fromRole)}
                          <DialogTitle>{message.from}</DialogTitle>
                          {getRoleBadge(message.fromRole)}
                        </div>
                        <DialogDescription>
                          {message.timestamp}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="mb-2">{message.subject}</h4>
                          <p className="text-muted-foreground">{message.message}</p>
                        </div>
                        <div className="border-t pt-4">
                          <Label className="mb-2 block">{t('msg.reply')}</Label>
                          <Textarea
                            placeholder={language === 'en' ? 'Type your reply...' : 'اكتب ردك...'}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={4}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                          {t('common.close')}
                        </Button>
                        <Button onClick={handleReply} className="bg-blue-600 hover:bg-blue-700">
                          <Send className="h-4 w-4 mr-2" />
                          {t('msg.reply')}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
