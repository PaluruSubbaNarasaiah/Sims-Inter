import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award } from 'lucide-react'; // Icon for grades

const data = [
    {
        name: 'B.Sc CS',
        grade: 85,
    },
    {
        name: 'B.Sc Phy',
        grade: 78,
    },
    {
        name: 'B.Sc Che',
        grade: 92,
    },
    {
        name: 'B.Sc Mat',
        grade: 70,
    },
    {
        name: 'B.Com',
        grade: 88,
    },
    {
        name: 'M.A Eng',
        grade: 95,
    },
    {
        name: 'B.A His',
        grade: 80,
    },
];

function LecturerGradeChart() {
    return (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 h-full flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award size={24} className="text-blue-600" /> Student Grades Overview
            </h2>
            <p className="text-sm text-gray-600 mb-4">Average grades per program</p>
            <div className="flex-grow w-full h-full"> {/* Ensure responsive container fills parent */}
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs text-gray-600" />
                        <YAxis axisLine={false} tickLine={false} className="text-xs text-gray-600" domain={[0, 100]} />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                            labelStyle={{ fontWeight: 'bold', color: '#333' }}
                            itemStyle={{ color: '#555' }}
                            formatter={(value) => [`${value}%`, 'Grade']}
                        />
                        <Bar dataKey="grade" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default LecturerGradeChart;
