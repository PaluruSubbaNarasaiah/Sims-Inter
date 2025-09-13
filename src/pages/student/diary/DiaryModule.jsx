// src/pages/student/diary/DiaryModule.jsx
import React, { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';

const DiaryModule = () => {
    // Mock Student ID
    const currentStudentId = "student_S001"; 
    const [homeworkEntries, setHomeworkEntries] = useState([
        {
            id: 'hw1',
            lecturerId: 'lecturer_F123',
            date: '2025-06-27',
            homeworkItems: [
                { subject: 'Mathematics', homework: 'Complete differential calculus problems from Chapter 6 - Applications of derivatives (Ex 6.1 to 6.3).' },
                { subject: 'Physics', homework: 'Solve numerical problems on Laws of Motion - Force and acceleration (Chapter 5, Q.1-15).' }
            ]
        },
        {
            id: 'hw2',
            lecturerId: 'lecturer_F124',
            date: '2025-06-26',
            homeworkItems: [
                { subject: 'Chemistry', homework: 'Write chemical equations for organic reactions - Alkenes and Alkynes (Chapter 13).' },
                { subject: 'Biology', homework: 'Draw labeled diagrams of plant cell structure and write functions of organelles.' }
            ]
        },
        {
            id: 'hw3',
            lecturerId: 'lecturer_F125',
            date: '2025-06-25',
            homeworkItems: [
                { subject: 'Commerce', homework: 'Prepare journal entries for partnership firm transactions (Chapter 8 - Partnership Accounts).' },
                { subject: 'Economics', homework: 'Analyze demand and supply curves with real-world examples from Indian market.' }
            ]
        },
        {
            id: 'hw4',
            lecturerId: 'lecturer_F126',
            date: '2025-06-24',
            homeworkItems: [
                { subject: 'Civics', homework: 'Write essay on Indian Constitution - Fundamental Rights and Duties (500 words).' },
                { subject: 'History', homework: 'Prepare timeline of Indian Independence Movement from 1857 to 1947.' }
            ]
        },
        {
            id: 'hw5',
            lecturerId: 'lecturer_F127',
            date: '2025-06-23',
            homeworkItems: [
                { subject: 'JEE Coaching', homework: 'Solve JEE Main previous year questions - Coordinate Geometry (2020-2023 papers).' },
                { subject: 'NEET Coaching', homework: 'Practice NEET Biology MCQs - Human Physiology and Plant Physiology (100 questions).' }
            ]
        }
    ]);

    // --- Mock data for student's enrolled classes/lecturers ---
    // This simulates the relationship: which lecturer members' homework should this student see.
    // In a real system, this would be determined by the student's actual class enrollments.
    const [studentAssociatedlecturerIds] = useState(['lecturer_F123', 'lecturer_F124', 'lecturer_F125', 'lecturer_F126', 'lecturer_F127']); // Student gets homework from all subject teachers

    // Filter and sort homework entries for display based on the student's associated lecturers
    const displayedHomeworkEntries = useMemo(() => {
        return homeworkEntries
            .filter(entry => studentAssociatedlecturerIds.includes(entry.lecturerId)) // Only show homework from assigned lecturer
            .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()); // Sort by date descending
    }, [homeworkEntries, studentAssociatedlecturerIds]);

    return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Homework Diary</h1>
            </div>

            {/* No tabs needed as only Homework Diary is shown */}

            {/* Content Area for Home Work Diary */}
            <div className="space-y-4">
                {displayedHomeworkEntries.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">No homework assignments found from your lecturer members.</div>
                ) : (
                    <div className="space-y-4">
                        {displayedHomeworkEntries.map(entry => (
                            <div key={entry.id} className="border border-gray-200 rounded-md p-4 bg-gray-50 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500">{format(parseISO(entry.date), 'MMM dd, yyyy')}</p>
                                        {/* You might want to display the lecturer member's name here, if available */}
                                        {/* <p className="text-xs text-gray-400">Assigned by: [lecturer Name based on {entry.lecturerId}]</p> */}
                                    </div>
                                    {/* No edit/delete buttons for students */}
                                </div>
                                <div className="space-y-2 text-sm text-gray-700 mt-2">
                                    {entry.homeworkItems.map((item, idx) => (
                                        <div key={idx} className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                            <p><span className="font-semibold">{item.subject}:</span> {item.homework}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default DiaryModule;