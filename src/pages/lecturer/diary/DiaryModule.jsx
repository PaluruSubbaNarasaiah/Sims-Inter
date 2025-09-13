// DiaryModule.jsx
import React, { useState, useMemo } from 'react';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import { CreateEditHomeworkModal, CreateEditPersonalDiaryModal } from './AddDiary';

const DiaryModule = () => {
    const tabs = ["Home Work Diary", "Personal Diary"];
    const [activeTab, setActiveTab] = useState(tabs[0]);

    const currentlecturerId = "lecturer_F123";

    // --- State for Home Work Diary ---
    const [homeworkEntries, setHomeworkEntries] = useState([
        {
            id: 'hw1',
            lecturerId: 'lecturer_F123',
            date: '2025-06-27',
            classSelected: 'MPC Year 1',
            sectionSelected: 'A',
            homeworkItems: [
                { subject: 'Mathematics', homework: 'Solve calculus problems on limits and derivatives (Chapter 5).' },
                { subject: 'Physics', homework: 'Complete mechanics problems on motion and force (Chapter 3).' }
            ]
        },
        {
            id: 'hw2',
            lecturerId: 'lecturer_F123',
            date: '2025-06-27',
            classSelected: 'BiPC Year 2',
            sectionSelected: 'B',
            homeworkItems: [
                { subject: 'Biology', homework: 'Prepare lab report on cell division and mitosis process.' }
            ]
        },
        {
            id: 'hw4',
            lecturerId: 'lecturer_F123',
            date: '2025-06-27',
            classSelected: 'MEC Year 1',
            sectionSelected: 'A',
            homeworkItems: [
                { subject: 'Economics', homework: 'Analyze demand and supply curves with real market examples.' }
            ]
        },
        {
            id: 'hw3',
            lecturerId: 'lecturer_F123',
            date: '2025-06-26',
            classSelected: 'HEC Year 2',
            sectionSelected: 'C',
            homeworkItems: [
                { subject: 'History', homework: 'Write essay on Indian independence movement leaders.' }
            ]
        },
    ]);
    const [showHomeworkModal, setShowHomeworkModal] = useState(false);
    const [editingHomework, setEditingHomework] = useState(null); // This will hold the single entry being edited

    // --- State for Personal Diary ---
    const [personalNotes, setPersonalNotes] = useState([
        { id: 'pn1', lecturerId: 'lecturer_F123', date: '2025-06-27', title: 'Faculty Meeting Notes', content: 'Discussed new assessment criteria for AP Board exams. Follow up with department head regarding MPC and BiPC stream curriculum updates.' },
        { id: 'pn2', lecturerId: 'lecturer_F123', date: '2025-06-26', title: 'To-Do List', content: '1. Prepare lecture slides for Mathematics class. 2. Email students about JEE coaching schedule. 3. Grade physics assignments.' },
        { id: 'pn3', lecturerId: 'lecturer_F124', date: '2025-06-27', title: 'Coaching Ideas', content: 'Explore new teaching methods for NEET preparation in BiPC stream.' },
    ]);
    const [showPersonalDiaryModal, setShowPersonalDiaryModal] = useState(false);
    const [editingPersonalNote, setEditingPersonalNote] = useState(null);

    const subjectOptions = [
        'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics',
        'Commerce', 'Civics', 'History', 'English', 'Telugu',
    ];

    // --- Home Work Diary Handlers ---
    const handleAddEditHomework = (entry = null) => {
        setEditingHomework(entry); // Set the entry if editing, otherwise null for adding
        setShowHomeworkModal(true);
    };

    const handleSaveHomework = (assignmentsFromModal) => {
        let updatedHomeworkEntries = [...homeworkEntries];
        const newEntriesToAdd = [];

        assignmentsFromModal.forEach(assignment => {
            if (editingHomework && assignment.id === editingHomework.id) {
                updatedHomeworkEntries = updatedHomeworkEntries.map(entry =>
                    entry.id === editingHomework.id ? { ...entry, ...assignment, lecturerId: currentlecturerId } : entry
                );
                console.log("Homework updated (original entry):", assignment);
            } else {
                const newEntry = {
                    ...assignment,
                    id: `hw${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                    lecturerId: currentlecturerId
                };
                newEntriesToAdd.push(newEntry);
                console.log("Homework added (new block from modal):", newEntry);
            }
        });

        setHomeworkEntries([...updatedHomeworkEntries, ...newEntriesToAdd]);
        setShowHomeworkModal(false);
        setEditingHomework(null);
    };

    const handleDeleteHomework = (id) => {
        if (window.confirm("Are you sure you want to delete this homework entry?")) {
            setHomeworkEntries(prev => prev.filter(e => e.id !== id));
            console.log("Homework deleted:", id);
        }
    };

    const filteredHomeworkEntries = useMemo(() => {
        return homeworkEntries
            .filter(entry => entry.lecturerId === currentlecturerId)
            .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
    }, [homeworkEntries, currentlecturerId]);

    // Group homework entries by date
    const groupedHomeworkEntries = useMemo(() => {
        const groups = {};
        filteredHomeworkEntries.forEach(entry => {
            if (!groups[entry.date]) {
                groups[entry.date] = [];
            }
            groups[entry.date].push(entry);
        });
        // Sort dates in descending order for display
        return Object.entries(groups).sort(([dateA], [dateB]) => parseISO(dateB).getTime() - parseISO(dateA).getTime());
    }, [filteredHomeworkEntries]);

    // --- Personal Diary Handlers (unchanged) ---
    const handleAddEditPersonalNote = (note = null) => {
        setEditingPersonalNote(note);
        setShowPersonalDiaryModal(true);
    };

    const handleSavePersonalNote = (data) => {
        if (editingPersonalNote) {
            setPersonalNotes(prev => prev.map(n => (n.id === editingPersonalNote.id ? { ...n, ...data } : n)));
            console.log("Personal note updated:", data);
        } else {
            const newNote = { ...data, id: `pn${Date.now()}`, lecturerId: currentlecturerId };
            setPersonalNotes(prev => [...prev, newNote]);
            console.log("Personal note added:", newNote);
        }
        setShowPersonalDiaryModal(false);
        setEditingPersonalNote(null);
    };

    const handleDeletePersonalNote = (id) => {
        if (window.confirm("Are you sure you want to delete this personal note?")) {
            setPersonalNotes(prev => prev.filter(n => n.id !== id));
            console.log("Personal note deleted:", id);
        }
    };

    const filteredPersonalNotes = useMemo(() => {
        return personalNotes
            .filter(note => note.lecturerId === currentlecturerId)
            .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
    }, [personalNotes, currentlecturerId]);

    return (
        <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">My Diary</h1>
                {activeTab === "Home Work Diary" && (
                    <button
                        onClick={() => handleAddEditHomework(null)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        <FiPlus className="mr-2 text-xl" />
                        Add Homework
                    </button>
                )}
                {activeTab === "Personal Diary" && (
                    <button
                        onClick={() => handleAddEditPersonalNote(null)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        <FiPlus className="mr-2 text-xl" />
                        Add Personal Note
                    </button>
                )}
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-1 border-b border-gray-200 mb-6 sticky top-0 bg-gray-50 z-10 p-1 -mx-6 w-[calc(100%+3rem)]">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 font-medium rounded-t-lg transition duration-200 ease-in-out text-sm md:text-base
                            ${activeTab === tab
                                ? 'text-blue-600 border-b-2 border-blue-600 bg-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content Area */}
            {activeTab === "Home Work Diary" && (
                <>
                    {Object.keys(groupedHomeworkEntries).length === 0 ? (
                        <div className="text-center text-gray-500 py-10">No homework assignments found. Click "Add Homework" to add one!</div>
                    ) : (
                        <div className="space-y-6"> 
                            {groupedHomeworkEntries.map(([date, entriesForDate]) => (
                                <div key={date} className="">
                                    <h3 className="text-xl font-bold text-blue-800 mb-4 pb-2 border-b border-blue-300">
                                        Homework for: {format(parseISO(date), 'MMM dd, yyyy')}
                                    </h3>
                                    <div className="space-y-4"> {/* Space between homework entries for the same date */}
                                        {entriesForDate.map(entry => (
                                            <div key={entry.id} className="border border-gray-200 rounded-md p-4 bg-white flex flex-col">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-base font-semibold text-gray-700">
                                                            Stream: {entry.classSelected}, Section: {entry.sectionSelected}
                                                        </h4>
                                                    </div>
                                                    <div className="flex-shrink-0 flex space-x-2">
                                                        <button
                                                            onClick={() => handleAddEditHomework(entry)}
                                                            className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded-md text-sm font-medium transition duration-200 flex items-center"
                                                        >
                                                            <FiEdit className="mr-1" /> Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteHomework(entry.id)}
                                                            className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-md text-sm font-medium transition duration-200 flex items-center"
                                                        >
                                                            <FiTrash2 className="mr-1" /> Delete
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 text-sm text-gray-700 mt-2">
                                                    {entry.homeworkItems.map((item, idx) => (
                                                        <div key={idx} className="bg-gray-50 p-3 rounded-md border border-gray-100 shadow-sm">
                                                            <p><span className="font-semibold">{item.subject}:</span> {item.homework}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {activeTab === "Personal Diary" && (
                <>
                    {filteredPersonalNotes.length === 0 ? (
                        <div className="text-center text-gray-500 py-10">No personal notes found. Click "Add Personal Note" to add one!</div>
                    ) : (
                        <div className="space-y-4">
                            {filteredPersonalNotes.map(note => (
                                <div key={note.id} className="border border-gray-200 rounded-md p-4 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <div className="flex-1 min-w-0 mb-2 sm:mb-0">
                                        <p className="text-xs text-gray-500">{format(parseISO(note.date), 'MMM dd, yyyy')}</p>
                                        <h3 className="text-lg font-semibold text-gray-800 truncate">{note.title}</h3>
                                        <p className="text-gray-700 text-sm break-words">{note.content}</p>
                                    </div>
                                    <div className="flex-shrink-0 flex space-x-2">
                                        <button
                                            onClick={() => handleAddEditPersonalNote(note)}
                                            className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded-md text-sm font-medium transition duration-200 flex items-center"
                                        >
                                            <FiEdit className="mr-1" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeletePersonalNote(note.id)}
                                            className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-md text-sm font-medium transition duration-200 flex items-center"
                                        >
                                            <FiTrash2 className="mr-1" /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Modals */}
            {showHomeworkModal && (
                <CreateEditHomeworkModal
                    initialData={editingHomework}
                    onClose={() => { setShowHomeworkModal(false); setEditingHomework(null); }}
                    onSave={handleSaveHomework}
                    subjectOptions={subjectOptions}
                />
            )}

            {showPersonalDiaryModal && (
                <CreateEditPersonalDiaryModal
                    initialData={editingPersonalNote}
                    onClose={() => { setShowPersonalDiaryModal(false); setEditingPersonalNote(null); }}
                    onSave={handleSavePersonalNote}
                />
            )}
        </div>
    );
};

export default DiaryModule;