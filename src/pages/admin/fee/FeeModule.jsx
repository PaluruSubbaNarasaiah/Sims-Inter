// FeeModule.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  IndianRupee,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  Edit,
  // Trash2,
  ListChecks // New icon for View Payments button
} from 'lucide-react';
import { feeRecordsData } from './FeeData'; // Importing mock data from FeeData.jsx
import AddEditFee from './AddEditFee';
import ViewPayments from './ViewPayments'; // Import the new ViewPayments component

// Custom Hook for counting up animation
const useCountUp = (targetValue, duration = 2000) => {
  const [count, setCount] = useState(0);
  const animationFrameRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    setCount(0); // Reset count when targetValue changes
    startTimeRef.current = null;

    const animate = (currentTime) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }
      const elapsedTime = currentTime - startTimeRef.current;
      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = progress; // Linear for simplicity, could use easing functions

      const currentCount = Math.floor(easedProgress * targetValue);
      setCount(currentCount);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(targetValue); // Ensure it hits the exact target value
      }
    };

    if (targetValue > 0) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
        setCount(0); // If target is 0, just set it to 0 immediately
    }


    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetValue, duration]);

  return count;
};


const FeeModule = () => {
  // State for fee records
  const [feeRecords, setFeeRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state for Add/Edit Modal
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    program: '',
    semester: '',
    amount: '', // This will be the total fee for the student
    term1Paid: false,
    term1Status: 'Pending',
    term1PaymentDate: '',
    term1PaymentMethod: '',
    term1DueDate: '', // Added term1DueDate
    term2Paid: false,
    term2Status: 'Pending',
    term2PaymentDate: '',
    term2PaymentMethod: '',
    term2DueDate: '', // Added term2DueDate
    term3Paid: false,
    term3Status: 'Pending',
    term3PaymentDate: '',
    term3PaymentMethod: '',
    term3DueDate: '', // Added term3DueDate
  });

  // Filter state
  const [filters, setFilters] = useState({
    program: '',
    semester: '',
    paymentStatus: ''
  });

  // State for dynamic filter options
  const [availablePrograms, setAvailablePrograms] = useState([]);
  const [availableSemesters, setAvailableSemesters] = useState([]);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  // Stats state (kept in FeeModule as it pertains to the overall data display)
  const [stats, setStats] = useState({
    totalFees: 0,
    paidFees: 0,
    termStats: {
      '1st Term': { total: 0, paid: 0 },
      '2nd Term': { total: 0, paid: 0 },
      '3rd Term': { total: 0, paid: 0 }
    }
  });

  // New state to control visibility of ViewPayments component
  const [showViewPayments, setShowViewPayments] = useState(false);

  // Fetch fee records from mock data
  useEffect(() => {
    const fetchFeeRecords = () => {
      setLoading(true);
      setError(null);
      try {
        setTimeout(() => {
          // Calculate initial overall status for each record
          const recordsWithStatus = feeRecordsData.map(record => {
            // Determine term status based on payment presence and date vs due date (if needed)
            const getTermStatus = (paid, dueDate, paymentDate) => {
              if (paid) return 'Paid';
              if (dueDate && new Date(dueDate) < new Date() && !paid) return 'Overdue';
              return 'Pending';
            };

            const term1Status = getTermStatus(record.term1Paid, record.term1DueDate, record.term1PaymentDate);
            const term2Status = getTermStatus(record.term2Paid, record.term2DueDate, record.term2PaymentDate);
            const term3Status = getTermStatus(record.term3Paid, record.term3DueDate, record.term3PaymentDate);

            // Determine overall status based on term statuses
            let overallStatus;
            if (term1Status === 'Paid' && term2Status === 'Paid' && term3Status === 'Paid') {
              overallStatus = 'Paid';
            } else if (term1Status === 'Overdue' || term2Status === 'Overdue' || term3Status === 'Overdue') {
              overallStatus = 'Overdue';
            } else {
              overallStatus = 'Pending';
            }

            return {
              ...record,
              term1Status,
              term2Status,
              term3Status,
              status: overallStatus // overall status
            };
          });
          setFeeRecords(recordsWithStatus);
          calculateStats(recordsWithStatus);

          // Extract unique programs and semesters
          const programs = [...new Set(recordsWithStatus.map(record => record.program))].sort();
          const semesters = [...new Set(recordsWithStatus.map(record => record.semester))].sort((a, b) => a - b);
          setAvailablePrograms(programs);
          setAvailableSemesters(semesters);

          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to fetch fee records.");
        setLoading(false);
      }
    };
    fetchFeeRecords();
  }, []);

  // Recalculate dynamic filter options whenever feeRecords change (e.g., after add/delete)
  useEffect(() => {
    const programs = [...new Set(feeRecords.map(record => record.program))].sort();
    const semesters = [...new Set(feeRecords.map(record => record.semester))].sort((a, b) => a - b);
    setAvailablePrograms(programs);
    setAvailableSemesters(semesters);
  }, [feeRecords]);

  // Calculate statistics whenever feeRecords changes
  useEffect(() => {
    calculateStats(feeRecords);
  }, [feeRecords]);

  const calculateStats = (records) => {
    let totalFees = 0;
    let paidFees = 0;
    const termStats = {
      '1st Term': { total: 0, paid: 0 },
      '2nd Term': { total: 0, paid: 0 },
      '3rd Term': { total: 0, paid: 0 }
    };

    records.forEach(record => {
      totalFees += record.amount; // Use 'amount' as the total fee for the student

      // Sum paid fees from individual terms
      if (record.term1Status === 'Paid') {
        paidFees += record.term1Amount;
        termStats['1st Term'].paid += record.term1Amount;
      }
      termStats['1st Term'].total += record.term1Amount;

      if (record.term2Status === 'Paid') {
        paidFees += record.term2Amount;
        termStats['2nd Term'].paid += record.term2Amount;
      }
      termStats['2nd Term'].total += record.term2Amount;

      if (record.term3Status === 'Paid') {
        paidFees += record.term3Amount;
        termStats['3rd Term'].paid += record.term3Amount;
      }
      termStats['3rd Term'].total += record.term3Amount;
    });

    setStats({
      totalFees,
      paidFees,
      termStats
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTermCheckboxChange = (e) => {
    const { name, checked } = e.target; // e.g., name='term1Paid', checked=true/false
    const termIndex = name.replace('term', '').replace('Paid', ''); // '1', '2', '3'

    setFormData(prev => {
      const newFormData = { ...prev, [name]: checked }; // Update termXPaid boolean

      if (checked) {
        newFormData[`term${termIndex}Status`] = 'Paid';
        // Set current date if checkbox is checked AND no date is already set
        if (!newFormData[`term${termIndex}PaymentDate`]) {
          newFormData[`term${termIndex}PaymentDate`] = new Date().toISOString().slice(0, 10);
        }
        // Set payment method to 'Cash' if checkbox is checked and no method is already set
        if (!newFormData[`term${termIndex}PaymentMethod`]) {
          newFormData[`term${termIndex}PaymentMethod`] = 'Cash';
        }
      } else {
        // If unchecked, set status to pending, clear date and method
        newFormData[`term${termIndex}Status`] = 'Pending';
        newFormData[`term${termIndex}PaymentDate`] = '';
        newFormData[`term${termIndex}PaymentMethod`] = '';
      }

      // Recalculate overall status for the current record in edit mode
      // This logic is mostly for immediate UI feedback in the modal
      if (showEditModal) {
        const currentRecordUpdated = { ...currentRecord, ...newFormData };
        const getTermStatusForRecalculation = (paid, dueDate) => { // Simplified to avoid paymentDate as it's set on check
            if (paid) return 'Paid';
            if (dueDate && new Date(dueDate) < new Date()) return 'Overdue';
            return 'Pending';
        };

        const term1Status = getTermStatusForRecalculation(newFormData.term1Paid, newFormData.term1DueDate);
        const term2Status = getTermStatusForRecalculation(newFormData.term2Paid, newFormData.term2DueDate);
        const term3Status = getTermStatusForRecalculation(newFormData.term3Paid, newFormData.term3DueDate);

        let overallStatus;
        if (term1Status === 'Paid' && term2Status === 'Paid' && term3Status === 'Paid') {
          overallStatus = 'Paid';
        } else if (term1Status === 'Overdue' || term2Status === 'Overdue' || term3Status === 'Overdue') {
          overallStatus = 'Overdue';
        } else {
          overallStatus = 'Pending';
        }
        newFormData.status = overallStatus; // Update overall status in form data
        newFormData.term1Status = term1Status;
        newFormData.term2Status = term2Status;
        newFormData.term3Status = term3Status;
      }

      return newFormData;
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const validateForm = () => {
    const { studentId, studentName, program, semester, amount } = formData;
    if (!studentId || !studentName || !program || !semester || !amount) {
      alert("Please fill in all required fields (Student ID, Student Name, Program, Semester, Total Fee).");
      return false;
    }
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Total Fee must be a positive number.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (showAddModal) {
      const totalAmount = Number(formData.amount);
      const termAmount = totalAmount > 0 ? Math.round(totalAmount / 3) : 0;
      const term1DisplayAmount = termAmount;
      const term2DisplayAmount = termAmount;
      const term3DisplayAmount = totalAmount - (term1DisplayAmount + term2DisplayAmount);

      const newRecord = {
        id: feeRecords.length > 0 ? Math.max(...feeRecords.map(r => r.id)) + 1 : 1,
        studentId: formData.studentId,
        studentName: formData.studentName,
        program: formData.program,
        semester: formData.semester,
        amount: totalAmount, // This is the total fee for the student

        term1Amount: term1DisplayAmount,
        term1Paid: false, // Initially false for new records, updated via edit if paid
        term1Status: 'Pending',
        term1PaymentDate: '',
        term1PaymentMethod: '',
        term1DueDate: formData.term1DueDate, // Use due date from form

        term2Amount: term2DisplayAmount,
        term2Paid: false,
        term2Status: 'Pending',
        term2PaymentDate: '',
        term2PaymentMethod: '',
        term2DueDate: formData.term2DueDate, // Use due date from form

        term3Amount: term3DisplayAmount,
        term3Paid: false,
        term3Status: 'Pending',
        term3PaymentDate: '',
        term3PaymentMethod: '',
        term3DueDate: formData.term3DueDate, // Use due date from form
      };
      // Overall status for new record is always 'Pending'
      newRecord.status = 'Pending'; // This will be calculated in useEffect for initial load

      setFeeRecords([...feeRecords, newRecord]);
      alert("Fee record added successfully!");

    } else { // It's an edit
      const updatedRecords = feeRecords.map(record => {
        if (record.id === currentRecord.id) {
          // Use formData directly from state, which has been updated by handleInputChange/handleTermCheckboxChange
          const updatedRecord = {
            ...record, // Keep existing record details not touched by the form
            studentId: formData.studentId,
            studentName: formData.studentName,
            program: formData.program,
            semester: formData.semester,
            amount: Number(currentRecord.amount), // Total amount is read-only in edit mode, preserve it from original record

            term1Paid: formData.term1Paid,
            term1Status: formData.term1Status,
            term1PaymentDate: formData.term1PaymentDate,
            term1PaymentMethod: formData.term1PaymentMethod,
            term1DueDate: formData.term1DueDate, // Update due date in edit mode

            term2Paid: formData.term2Paid,
            term2Status: formData.term2Status,
            term2PaymentDate: formData.term2PaymentDate,
            term2PaymentMethod: formData.term2PaymentMethod,
            term2DueDate: formData.term2DueDate, // Update due date in edit mode

            term3Paid: formData.term3Paid,
            term3Status: formData.term3Status,
            term3PaymentDate: formData.term3PaymentDate,
            term3PaymentMethod: formData.term3PaymentMethod,
            term3DueDate: formData.term3DueDate, // Update due date in edit mode
          };
          // Recalculate overall status
          const getTermStatus = (paid, dueDate) => { // Simplified
            if (paid) return 'Paid';
            if (dueDate && new Date(dueDate) < new Date()) return 'Overdue';
            return 'Pending';
          };
          updatedRecord.term1Status = getTermStatus(updatedRecord.term1Paid, updatedRecord.term1DueDate);
          updatedRecord.term2Status = getTermStatus(updatedRecord.term2Paid, updatedRecord.term2DueDate);
          updatedRecord.term3Status = getTermStatus(updatedRecord.term3Paid, updatedRecord.term3DueDate);

          if (updatedRecord.term1Status === 'Paid' && updatedRecord.term2Status === 'Paid' && updatedRecord.term3Status === 'Paid') {
            updatedRecord.status = 'Paid';
          } else if (updatedRecord.term1Status === 'Overdue' || updatedRecord.term2Status === 'Overdue' || updatedRecord.term3Status === 'Overdue') {
            updatedRecord.status = 'Overdue';
          } else {
            updatedRecord.status = 'Pending';
          }
          return updatedRecord;
        }
        return record;
      });
      setFeeRecords(updatedRecords);
      alert("Fee record updated successfully!");
    }
    // Reset form after submit
    setFormData({
      studentId: '', studentName: '', program: '', semester: '', amount: '',
      term1Paid: false, term1Status: 'Pending', term1PaymentDate: '', term1PaymentMethod: '', term1DueDate: '',
      term2Paid: false, term2Status: 'Pending', term2PaymentDate: '', term2PaymentMethod: '', term2DueDate: '',
      term3Paid: false, term3Status: 'Pending', term3PaymentDate: '', term3PaymentMethod: '', term3DueDate: '',
    });
    setShowAddModal(false);
    setShowEditModal(false);
  };

  const handleAddClick = () => {
    setFormData({ // Reset form data for add mode with new structure
      studentId: '', studentName: '', program: '', semester: '', amount: '', // amount is total fee
      term1Amount: '', term1Paid: false, term1Status: 'Pending', term1PaymentDate: '', term1PaymentMethod: '', term1DueDate: '',
      term2Amount: '', term2Paid: false, term2Status: 'Pending', term2PaymentDate: '', term2PaymentMethod: '', term2DueDate: '',
      term3Amount: '', term3Paid: false, term3Status: 'Pending', term3PaymentDate: '', term3PaymentMethod: '', term3DueDate: '',
    });
    setShowAddModal(true);
  };

  const handleEdit = (record) => {
    setCurrentRecord(record);
    // Populate formData for edit modal
    setFormData({
      studentId: record.studentId,
      studentName: record.studentName,
      program: record.program,
      semester: record.semester,
      amount: record.amount, // Total fee for this record

      term1Amount: record.term1Amount, // Pass individual term amounts for display
      term1Paid: record.term1Paid || false,
      term1Status: record.term1Status || 'Pending',
      term1PaymentDate: record.term1PaymentDate || '',
      term1PaymentMethod: record.term1PaymentMethod || '',
      term1DueDate: record.term1DueDate || '', // Populate due date for edit

      term2Amount: record.term2Amount,
      term2Paid: record.term2Paid || false,
      term2Status: record.term2Status || 'Pending',
      term2PaymentDate: record.term2PaymentDate || '',
      term2PaymentMethod: record.term2PaymentMethod || '',
      term2DueDate: record.term2DueDate || '', // Populate due date for edit

      term3Amount: record.term3Amount,
      term3Paid: record.term3Paid || false,
      term3Status: record.term3Status || 'Pending',
      term3PaymentDate: record.term3PaymentDate || '',
      term3PaymentMethod: record.term3PaymentMethod || '',
      term3DueDate: record.term3DueDate || '', // Populate due date for edit
    });
    setShowEditModal(true);
  };

  // const handleDelete = (id) => {
  //   if (window.confirm('Are you sure you want to delete this fee record?')) {
  //     setFeeRecords(feeRecords.filter(record => record.id !== id));
  //     alert("Fee record deleted successfully!");
  //   }
  // };

  const filteredRecords = feeRecords.filter(record => {
    const matchesSearch = searchTerm === '' ||
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.studentId.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      matchesSearch &&
      (filters.program === '' || record.program === filters.program) &&
      (filters.semester === '' || record.semester === parseInt(filters.semester)) &&
      (filters.paymentStatus === '' || record.status === filters.paymentStatus)
    );
  });

  // Function to determine all paid terms
  const generateLastPaidTerm = (record) => {
    const paidTermsNames = [];
    if (record.term1Status === 'Paid') {
      paidTermsNames.push('1st Term');
    }
    if (record.term2Status === 'Paid') {
      paidTermsNames.push('2nd Term');
    }
    if (record.term3Status === 'Paid') {
      paidTermsNames.push('3rd Term');
    }

    if (paidTermsNames.length === 0) {
      return 'N/A';
    }

    return paidTermsNames.join(', ');
  };

// Helper function to get the most recent payment date
const getMostRecentPaymentDate = (record) => {
  const dates = [];
  if (record.term1PaymentDate && record.term1Status === 'Paid') dates.push({ date: new Date(record.term1PaymentDate), term: 1 });
  if (record.term2PaymentDate && record.term2Status === 'Paid') dates.push({ date: new Date(record.term2PaymentDate), term: 2 });
  if (record.term3PaymentDate && record.term3Status === 'Paid') dates.push({ date: new Date(record.term3PaymentDate), term: 3 });

  if (dates.length === 0) {
    return 'N/A';
  }

  // Sort dates in descending order to find the most recent one. If dates are equal, sort by term number (descending)
  dates.sort((a, b) => {
    const dateDiff = b.date.getTime() - a.date.getTime();
    if (dateDiff === 0) {
      return b.term - a.term; // If dates are the same, the higher term number is considered more recent
    }
    return dateDiff;
  });

  return dates[0].date.toISOString().slice(0, 10); // Return in YYYY-MM-DD format
};

// Helper function to get the payment method of the most recent payment
const getMostRecentPaymentMethod = (record) => {
  const payments = [];
  if (record.term1PaymentDate && record.term1PaymentMethod && record.term1Status === 'Paid') {
    payments.push({ date: new Date(record.term1PaymentDate), method: record.term1PaymentMethod, term: 1 });
  }
  if (record.term2PaymentDate && record.term2PaymentMethod && record.term2Status === 'Paid') {
    payments.push({ date: new Date(record.term2PaymentDate), method: record.term2PaymentMethod, term: 2 });
  }
  if (record.term3PaymentDate && record.term3PaymentMethod && record.term3Status === 'Paid') {
    payments.push({ date: new Date(record.term3PaymentDate), method: record.term3PaymentMethod, term: 3 });
  }

  if (payments.length === 0) {
    return 'N/A';
  }

  // Sort payments in descending order by date. If dates are equal, sort by term number (descending)
  payments.sort((a, b) => {
    const dateDiff = b.date.getTime() - a.date.getTime();
    if (dateDiff === 0) {
      return b.term - a.term; // If dates are the same, the higher term number is considered more recent
    }
    return dateDiff;
  });

  return payments[0].method;
};

  // Use the custom hook for animated stats
  const animatedTotalFees = useCountUp(stats.totalFees, 1500);
  const animatedPaidFees = useCountUp(stats.paidFees, 1500);
  const animatedPendingFees = useCountUp(stats.totalFees - stats.paidFees, 1500);


  // --- Export Functionality ---
  const handleExport = () => {
    const headers = [
      "Student ID", "Student Name", "Program", "Semester", "Total Fee", "Paid Fee", "Overall Status",
      "1st Term Amount", "1st Term Status", "1st Term Payment Date", "1st Term Payment Method", "1st Term Due Date",
      "2nd Term Amount", "2nd Term Status", "2nd Term Payment Date", "2nd Term Payment Method", "2nd Term Due Date",
      "3rd Term Amount", "3rd Term Status", "3rd Term Payment Date", "3rd Term Payment Method", "3rd Term Due Date",
      "Paid Terms",
      "Most Recent Payment Date",
      "Most Recent Payment Method" // Added for clarity in export
    ];
    const rows = filteredRecords.map(record => {
      const paidFeeDisplay = (record.term1Status === 'Paid' ? record.term1Amount : 0) +
        (record.term2Status === 'Paid' ? record.term2Amount : 0) +
        (record.term3Status === 'Paid' ? record.term3Amount : 0);
      return [
        record.studentId,
        record.studentName,
        record.program,
        record.semester,
        record.amount, // total fee
        paidFeeDisplay, // sum of paid terms
        record.status, // overall status
        record.term1Amount, record.term1Status, record.term1PaymentDate, record.term1PaymentMethod, record.term1DueDate,
        record.term2Amount, record.term2Status, record.term2PaymentDate, record.term2PaymentMethod, record.term2DueDate,
        record.term3Amount, record.term3Status, record.term3PaymentDate, record.term3PaymentMethod, record.term3DueDate,
        generateLastPaidTerm(record), // All paid terms
        getMostRecentPaymentDate(record), // Most recent payment date
        getMostRecentPaymentMethod(record) // Most recent payment method
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(field => `"${field !== null && field !== undefined ? String(field).replace(/"/g, '""') : ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'fee_records.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  // --- Print Functionality ---
  const handlePrint = () => {
    const printContent = document.getElementById('fee-records-table').outerHTML;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Fee Records</title>
            <style>
              body { font-family: 'Arial', sans-serif; margin: 20px; }
              h1 { text-align: center; margin-bottom: 20px; color: #333; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
              th { background-color: #f2f2f2; font-weight: bold; }
              .status-paid { color: green; font-weight: bold; }
              .status-pending { color: orange; font-weight: bold; }
              .status-overdue { color: red; font-weight: bold; } /* Added for overdue status */
              .no-print { display: none; }
            </style>
          </head>
          <body>
            <h1>Fee Records Report</h1>
            ${printContent}
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      alert("Please allow pop-ups for printing functionality.");
    }
  };


  if (showViewPayments) {
    return <ViewPayments onBackToFeeManagement={() => setShowViewPayments(false)} />;
  }

  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center mb-4 sm:mb-0">
          <IndianRupee className="mr-3 text-indigo-600" size={32} /> Fee Management
        </h1>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <button
                onClick={() => setShowViewPayments(true)}
                className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-xl flex items-center justify-center shadow-lg transition duration-300 ease-in-out transform hover:scale-105 text-base font-semibold"
            >
                <ListChecks size={20} className="mr-2" /> View Payments
            </button>
            <button
                onClick={handleAddClick}
                className="bg-indigo-700 hover:bg-indigo-800 text-white px-6 py-3 rounded-xl flex items-center justify-center shadow-lg transition duration-300 ease-in-out transform hover:scale-105 text-base font-semibold"
            >
                <Plus size={20} className="mr-2" /> Add New Fee
            </button>
        </div>
      </div>

      {/* Stats Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Fee Badge */}
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white p-6 rounded-xl shadow-lg flex items-center justify-between transform transition duration-300 hover:scale-105">
          <div>
            <p className="text-sm font-medium opacity-90">Total Fees</p>
            <p className="text-3xl font-bold mt-1">₹{animatedTotalFees.toLocaleString()}</p>
          </div>
          <IndianRupee size={40} className="opacity-50" />
        </div>

        {/* Collected Fee Badge */}
        <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white p-6 rounded-xl shadow-lg flex items-center justify-between transform transition duration-300 hover:scale-105">
          <div>
            <p className="text-sm font-medium opacity-90">Collected Fees</p>
            <p className="text-3xl font-bold mt-1">₹{animatedPaidFees.toLocaleString()}</p>
          </div>
          <IndianRupee size={40} className="opacity-50" />
        </div>

        {/* Pending Fee Badge */}
        <div className="bg-gradient-to-br from-orange-600 to-red-700 text-white p-6 rounded-xl shadow-lg flex items-center justify-between transform transition duration-300 hover:scale-105">
          <div>
            <p className="text-sm font-medium opacity-90">Pending Fees</p>
            <p className="text-3xl font-bold mt-1">₹{animatedPendingFees.toLocaleString()}</p>
          </div>
          <IndianRupee size={40} className="opacity-50" />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Filter size={18} className="mr-2 text-gray-600" /> Filter Options
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stream</label>
            <select
              name="program"
              value={filters.program}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Streams</option>
              {availablePrograms.map(prog => (
                <option key={prog} value={prog}>{prog}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select
              name="semester"
              value={filters.semester}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Years</option>
              {availableSemesters.map(sem => (
                <option key={sem} value={sem}>Year {sem}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="paymentStatus"
              value={filters.paymentStatus}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
        <div className="mt-4 sm:mt-6 flex justify-end">
          <button
            onClick={() => setFilters({
              program: '',
              semester: '',
              paymentStatus: ''
            })}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-gray-300 transition duration-200"
          >
            <Filter size={14} className="mr-1" /> Reset Filters
          </button>
        </div>
      </div>

      {/* Fee Records Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by ID or Name..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full text-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <button
              onClick={handleExport}
              className="flex items-center justify-center text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition duration-200 w-full sm:w-auto"
            >
              <Download size={16} className="mr-2" /> Export CSV
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition duration-200 w-full sm:w-auto"
            >
              <Printer size={16} className="mr-2" /> Print Report
            </button>
          </div>
        </div>

        {error && (
          <div className="p-8 text-center text-red-500 font-medium">
            Error: {error}
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 mx-auto"></div>
            Loading fee records...
          </div>
        ) : (
          <div className="overflow-x-auto" id="fee-records-table">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6 sm:py-3">
                    Student ID
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6 sm:py-3">
                    Student Name
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6 sm:py-3">
                    Stream/Year
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6 sm:py-3">
                    Full Fee
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6 sm:py-3">
                    Paid Fee
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6 sm:py-3">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6 sm:py-3">
                    Last Payment Date
                  </th>
                  {/* NEW: Payment Type Column Header */}
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6 sm:py-3">
                    Payment Type
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6 sm:py-3">
                    Paid Terms
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider no-print sm:px-6 sm:py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900 sm:px-6 sm:py-4 sm:text-sm">
                        {record.studentId}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-800 sm:px-6 sm:py-4 sm:text-sm">
                        {record.studentName}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600 sm:px-6 sm:py-4 sm:text-sm">
                        {record.program}/Year {record.semester}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900 sm:px-6 sm:py-4 sm:text-sm">
                        ₹{record.amount.toLocaleString()}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900 sm:px-6 sm:py-4 sm:text-sm">
                        ₹{((record.term1Status === 'Paid' ? record.term1Amount : 0) +
                          (record.term2Status === 'Paid' ? record.term2Amount : 0) +
                          (record.term3Status === 'Paid' ? record.term3Amount : 0)).toLocaleString()}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap sm:px-6 sm:py-4">
                        <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${record.status === 'Paid' ? 'bg-green-100 text-green-800' :
                            record.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600 sm:px-6 sm:py-4 sm:text-sm">
                        {getMostRecentPaymentDate(record)}
                      </td>
                      {/* NEW: Payment Type Column Data */}
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600 sm:px-6 sm:py-4 sm:text-sm">
                        {getMostRecentPaymentMethod(record)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600 sm:px-6 sm:py-4 sm:text-sm">
                        {generateLastPaidTerm(record)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right text-xs font-medium no-print sm:px-6 sm:py-4 sm:text-sm">
                        <button
                          onClick={() => handleEdit(record)}
                          className="text-indigo-600 hover:text-indigo-900 mr-2 p-0.5 sm:mr-3 sm:p-1 rounded-md hover:bg-gray-100 transition duration-150"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        {/* <button
                          onClick={() => handleDelete(record.id)}
                          className="text-red-600 hover:text-red-900 p-0.5 sm:p-1 rounded-md hover:bg-gray-100 transition duration-150"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button> */}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="px-6 py-8 text-center text-sm text-gray-500 sm:text-md">
                      No fee records found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Fee Modal */}
      <AddEditFee
        showModal={showAddModal}
        isEditMode={false}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        onClose={() => {
          setShowAddModal(false);
          setFormData({ /* Reset form data for Add */ 
            studentId: '', studentName: '', program: '', semester: '', amount: '',
            term1Amount: '', term1Paid: false, term1Status: 'Pending', term1PaymentDate: '', term1PaymentMethod: '', term1DueDate: '',
            term2Amount: '', term2Paid: false, term2Status: 'Pending', term2PaymentDate: '', term2PaymentMethod: '', term2DueDate: '',
            term3Amount: '', term3Paid: false, term3Status: 'Pending', term3PaymentDate: '', term3PaymentMethod: '', term3DueDate: '',
          });
        }}
        handleTermCheckboxChange={handleTermCheckboxChange}
      />

      {/* Edit Fee Modal */}
      <AddEditFee
        showModal={showEditModal}
        isEditMode={true}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        onClose={() => {
          setShowEditModal(false);
          setFormData({ /* Reset form data for Edit */ 
            studentId: '', studentName: '', program: '', semester: '', amount: '',
            term1Amount: '', term1Paid: false, term1Status: 'Pending', term1PaymentDate: '', term1PaymentMethod: '', term1DueDate: '',
            term2Amount: '', term2Paid: false, term2Status: 'Pending', term2PaymentDate: '', term2PaymentMethod: '', term2DueDate: '',
            term3Amount: '', term3Paid: false, term3Status: 'Pending', term3PaymentDate: '', term3PaymentMethod: '', term3DueDate: '',
          });
        }}
        handleTermCheckboxChange={handleTermCheckboxChange}
      />
    </div>
  );
};

export default FeeModule;