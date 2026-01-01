import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useLanguage } from '../contexts/LanguageContext';

interface VitalSignsChartProps {
  type: 'bloodPressure' | 'heartRate' | 'glucose' | 'temperature';
  data: any[];
}

export function VitalSignsChart({ type, data }: VitalSignsChartProps) {
  const { t } = useLanguage();

  const getTitleAndConfig = () => {
    switch (type) {
      case 'bloodPressure':
        return {
          title: t('vitals.bloodPressure'),
          lines: [
            { dataKey: 'systolic', stroke: '#ef4444', name: t('vitals.systolic') },
            { dataKey: 'diastolic', stroke: '#3b82f6', name: t('vitals.diastolic') },
          ],
          unit: 'mmHg',
        };
      case 'heartRate':
        return {
          title: t('vitals.heartRate'),
          lines: [{ dataKey: 'value', stroke: '#ef4444', name: t('vitals.heartRate') }],
          unit: 'bpm',
        };
      case 'glucose':
        return {
          title: t('vitals.bloodGlucose'),
          lines: [{ dataKey: 'value', stroke: '#f59e0b', name: t('vitals.bloodGlucose') }],
          unit: 'mg/dL',
        };
      case 'temperature':
        return {
          title: t('vitals.temperature'),
          lines: [{ dataKey: 'value', stroke: '#10b981', name: t('vitals.temperature') }],
          unit: '°C',
        };
    }
  };

  const config = getTitleAndConfig();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{config.title}</CardTitle>
        <CardDescription>{t('vitals.trends')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
              }}
            />
            <Legend />
            {config.lines.map((line) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.stroke}
                name={line.name}
                strokeWidth={2}
                dot={{ fill: line.stroke, r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
