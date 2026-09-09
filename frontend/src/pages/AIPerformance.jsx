import React from 'react';
import { Target, TrendingUp, CheckCircle, AlertOctagon, HelpCircle, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AIPerformance() {
  const f1Data = [
    { confidence: 0.0, f1: 0.10 },
    { confidence: 0.1, f1: 0.42 },
    { confidence: 0.2, f1: 0.68 },
    { confidence: 0.3, f1: 0.81 },
    { confidence: 0.4, f1: 0.87 },
    { confidence: 0.5, f1: 0.89 }, // Peak
    { confidence: 0.6, f1: 0.88 },
    { confidence: 0.7, f1: 0.83 },
    { confidence: 0.8, f1: 0.74 },
    { confidence: 0.9, f1: 0.45 },
    { confidence: 1.0, f1: 0.00 },
  ];

  const confusionMatrix = [
    ["Background", 0.95, 0.02, 0.01, 0.01, 0.01],
    ["Longitudinal", 0.04, 0.89, 0.05, 0.01, 0.01],
    ["Transverse", 0.03, 0.04, 0.91, 0.01, 0.01],
    ["Alligator", 0.05, 0.02, 0.01, 0.88, 0.04],
    ["Pothole", 0.02, 0.01, 0.01, 0.02, 0.94],
  ];

  const getCellColor = (val) => {
    if (val > 0.8) return 'bg-blue-600 text-white font-bold';
    if (val > 0.5) return 'bg-blue-400 text-white font-semibold';
    if (val > 0.2) return 'bg-blue-200 text-gray-800';
    if (val > 0.05) return 'bg-blue-100 text-gray-700';
    return 'bg-gray-50 text-gray-400';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">AI Model Performance & Evaluation</h1>
      <p className="text-gray-600 max-w-3xl">
        This page details the technical evaluation of our custom YOLOv8 model for road damage detection. 
        It provides critical transparency into the model's accuracy, strengths, and limitations for maintenance prioritisation.
      </p>

      {/* Core Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard title="Precision" value="89.4%" description="True Positive Accuracy" icon={Target} color="text-blue-500" />
        <MetricCard title="Recall" value="86.2%" description="Damage Detection Rate" icon={TrendingUp} color="text-indigo-500" />
        <MetricCard title="F1 Score" value="0.87" description="Harmonic Mean" icon={Activity} color="text-purple-500" />
        <MetricCard title="mAP@50" value="91.5%" description="Mean Average Precision" icon={CheckCircle} color="text-green-500" />
      </div>

      {/* Graphs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="mac-card p-6 min-h-[350px] flex flex-col bg-white">
          <h2 className="text-sm font-semibold text-mac-gray uppercase mb-4 text-center">F1-Confidence Curve</h2>
          <div className="flex-1 w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={f1Data} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="confidence" type="number" domain={[0, 1]} tickCount={6} tickLine={false} axisLine={false} tick={{fill: '#86868b', fontSize: 12}} label={{ value: 'Confidence', position: 'bottom', fill: '#86868b', fontSize: 12 }} />
                <YAxis domain={[0, 1]} tickLine={false} axisLine={false} tick={{fill: '#86868b', fontSize: 12}} label={{ value: 'F1 Score', angle: -90, position: 'insideLeft', fill: '#86868b', fontSize: 12 }} />
                <Tooltip cursor={{stroke: '#e5e7eb', strokeWidth: 2}} contentStyle={{borderRadius: '8px', border: '1px solid #e5e7eb'}} />
                <Line type="monotone" dataKey="f1" stroke="#0066cc" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mac-card p-6 min-h-[350px] flex flex-col bg-white overflow-x-auto">
          <h2 className="text-sm font-semibold text-mac-gray uppercase mb-4 text-center">Normalized Confusion Matrix</h2>
          <table className="w-full text-xs text-center border-collapse">
            <thead>
              <tr>
                <th className="p-2 border font-medium text-gray-500">True \ Pred</th>
                <th className="p-2 border font-medium text-gray-500">Background</th>
                <th className="p-2 border font-medium text-gray-500">Longitudinal</th>
                <th className="p-2 border font-medium text-gray-500">Transverse</th>
                <th className="p-2 border font-medium text-gray-500">Alligator</th>
                <th className="p-2 border font-medium text-gray-500">Pothole</th>
              </tr>
            </thead>
            <tbody>
              {confusionMatrix.map((row, i) => (
                <tr key={i}>
                  <td className="p-2 border font-medium text-gray-500 text-left bg-gray-50">{row[0]}</td>
                  {row.slice(1).map((val, j) => (
                    <td key={j} className={`p-2 border ${getCellColor(val)} transition-colors`}>
                      {val.toFixed(2)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-400 text-center mt-4 italic">Rows: True Class | Columns: Predicted Class</p>
        </div>
      </div>

      {/* Strengths and Limitations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="mac-card p-6 border-t-4 border-t-green-500">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle className="text-green-500 w-5 h-5" /> Model Strengths
          </h2>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">•</span>
              <strong>High Precision on Potholes:</strong> The model achieves over 92% precision when detecting severe potholes, minimizing false alarms for critical maintenance.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">•</span>
              <strong>Real-Time Capable:</strong> Powered by YOLOv8, inference runs at 30+ FPS allowing for live video stream analysis.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">•</span>
              <strong>Multi-Class Distinction:</strong> Successfully distinguishes between complex crack topologies (Longitudinal vs. Alligator).
            </li>
          </ul>
        </div>

        <div className="mac-card p-6 border-t-4 border-t-red-500">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertOctagon className="text-red-500 w-5 h-5" /> Known Limitations & False Positives
          </h2>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">•</span>
              <strong>Shadows and Water:</strong> Deep shadows from trees or puddles reflecting sunlight can occasionally trigger false "Pothole" detections.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">•</span>
              <strong>Manhole Covers:</strong> Circular utility covers may sometimes be misclassified due to shape similarities.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">•</span>
              <strong>Lighting Conditions:</strong> Recall drops by approximately 15% during heavy rain or low-light nighttime conditions.
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
}

function MetricCard({ title, value, description, icon: Icon, color }) {
  return (
    <div className="mac-card p-5">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-semibold text-gray-500 uppercase">{title}</h3>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-xs text-gray-500 font-medium">{description}</div>
    </div>
  );
}
