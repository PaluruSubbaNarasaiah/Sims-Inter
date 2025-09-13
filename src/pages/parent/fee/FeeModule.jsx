import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    CreditCard,
    Banknote,
    QrCode,
    Loader2,
    CheckCircle,
    IndianRupee,
    AlertCircle,
    User,
    Clipboard, // Import Clipboard icon
    GraduationCap,
    Download,
    X
} from 'lucide-react';
import { FaUsers, FaCheckCircle } from "react-icons/fa";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


// Import QR code images directly since they are in the same folder
import hdfcQrCode from './hdfc_qr.png';
import iciciQrCode from './icici_qr.png';
import axisQrCode from './axis_qr.png';
// import upiQrCode from './upi_qr.png'; // This import is no longer strictly needed if using bank-specific QRs for UPI

const FeeModule = () => {
    // Mock data for parent and children (similar to other modules)
    const [parentInfo] = useState({
        children: [
            {
                id: 'child1',
                name: 'Arjun Kumar',
                rollNumber: 'MPC23001',
                studentId: 'S001',
                course: 'MPC Stream - 2nd Year',
                section: 'A',
                profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80",
            },
            {
                id: 'child2',
                name: 'Priya Reddy',
                rollNumber: 'BPC24002',
                studentId: 'S002',
                course: 'BiPC Stream - 1st Year',
                section: 'B',
                profilePic: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80",
            },
            {
                id: 'child3',
                name: 'Kiran Sharma',
                rollNumber: 'CEC23003',
                studentId: 'S003',
                course: 'CEC Stream - 2nd Year',
                section: 'A',
                profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80",
            }
        ]
    });

    // Mock fee data for each child - Initial status changed to 'Due'
    const [allStudentFeeData, setAllStudentFeeData] = useState({
        'child1': [
            { term: '1st Year', feeType: 'Tuition Fee', amount: 35000, dueDate: '2024-06-15', status: 'Due' },
            { term: '1st Year', feeType: 'JEE Coaching Fee', amount: 25000, dueDate: '2024-07-15', status: 'Due' },
            { term: '2nd Year', feeType: 'Tuition Fee', amount: 35000, dueDate: '2024-12-15', status: 'Due' },
            { term: '2nd Year', feeType: 'Lab & Practical Fee', amount: 8000, dueDate: '2024-12-20', status: 'Due' }
        ],
        'child2': [
            { term: '1st Year', feeType: 'Tuition Fee', amount: 32000, dueDate: '2024-07-01', status: 'Due' },
            { term: '1st Year', feeType: 'NEET Coaching Fee', amount: 28000, dueDate: '2024-07-15', status: 'Due' },
            { term: '1st Year', feeType: 'Lab & Practical Fee', amount: 12000, dueDate: '2024-08-01', status: 'Due' }
        ],
        'child3': [
            { term: '1st Year', feeType: 'Tuition Fee', amount: 28000, dueDate: '2024-06-20', status: 'Due' },
            { term: '2nd Year', feeType: 'Tuition Fee', amount: 28000, dueDate: '2024-12-20', status: 'Due' },
            { term: '2nd Year', feeType: 'CA Foundation Fee', amount: 15000, dueDate: '2024-08-15', status: 'Due' },
            { term: '2nd Year', feeType: 'Commerce Practical Fee', amount: 5000, dueDate: '2024-09-01', status: 'Due' }
        ]
    });

    const [selectedChildId, setSelectedChildId] = useState(null);
    const [selectedTerms, setSelectedTerms] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [selectedBank, setSelectedBank] = useState(''); // Stores the currently selected bank for QR display
    const [selectedGateway, setSelectedGateway] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [transactionIdSubmitted, setTransactionIdSubmitted] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [amountPaidForReceipt, setAmountPaidForReceipt] = useState(0);

    // New state for randomly selected UPI bank details
    const [randomUpiBank, setRandomUpiBank] = useState(null);
    const [copiedText, setCopiedText] = useState(''); // State to show 'Copied!' feedback

    // State for unique Invoice ID
    const [invoiceId, setInvoiceId] = useState('');

    // New state to store terms paid in the current transaction for receipt
    const [termsPaidInCurrentTransaction, setTermsPaidInCurrentTransaction] = useState([]);

    // New state to store recent payment history
    const [recentPayments, setRecentPayments] = useState([]);
    
    // New states for QR code generation and payment status
    const [generatedQrCode, setGeneratedQrCode] = useState('');
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [paymentPopupType, setPaymentPopupType] = useState(''); // 'success' or 'error'
    const [paymentPopupMessage, setPaymentPopupMessage] = useState('');


    const receiptRef = useRef(); // This ref is now only for the *current* transaction's receipt preview

    useEffect(() => {
        if (parentInfo.children && parentInfo.children.length > 0) {
            setSelectedChildId(parentInfo.children[0].id);
        }
    }, [parentInfo.children]);

    // Effect to set random UPI bank details when UPI is selected
    useEffect(() => {
        if (paymentMethod === 'UPI') {
            const banks = [
                {
                    name: 'HDFC Bank',
                    qrCode: hdfcQrCode,
                    accountName: 'College Name Trust',
                    accountNumber: '50100XXXXXXX',
                    ifscCode: 'HDFC000XXXX',
                    upiId: 'hdfccollege@upi' // Added UPI ID
                },
                {
                    name: 'ICICI Bank',
                    qrCode: iciciQrCode,
                    accountName: 'College Name Trust',
                    accountNumber: '00010XXXXXXX',
                    ifscCode: 'ICIC000XXXX',
                    upiId: 'icicollege@upi' // Added UPI ID
                },
                {
                    name: 'AXIS Bank',
                    qrCode: axisQrCode,
                    accountName: 'College Name Trust',
                    accountNumber: '90000XXXXXXX',
                    ifscCode: 'UTIB000XXXX',
                    upiId: 'axiscollege@upi' // Added UPI ID
                }
            ];
            const randomIndex = Math.floor(Math.random() * banks.length);
            setRandomUpiBank(banks[randomIndex]);
        } else {
            setRandomUpiBank(null); // Clear when UPI is not selected
        }
    }, [paymentMethod]);


    const studentData = useMemo(() => {
        return parentInfo.children.find(child => child.id === selectedChildId);
    }, [selectedChildId, parentInfo.children]);

    const feeDetails = useMemo(() => {
        return allStudentFeeData[selectedChildId] || [];
    }, [selectedChildId, allStudentFeeData]);

    const totalAmountToPay = useMemo(() => {
        return feeDetails
            .filter(fee => selectedTerms.includes(fee.term))
            .reduce((sum, fee) => sum + fee.amount, 0);
    }, [selectedTerms, feeDetails]);


    const handleTermSelect = (term) => {
        setPaymentMethod('');
        setSelectedBank('');
        setSelectedGateway('');
        setTransactionId('');
        setTransactionIdSubmitted(false);
        setShowReceipt(false);
        setPaymentSuccess(false);
        setAmountPaidForReceipt(0);
        setCopiedText(''); // Clear copied text feedback
        setInvoiceId(''); // Clear invoice ID when terms change
        setTermsPaidInCurrentTransaction([]); // Clear terms paid in current transaction
        setGeneratedQrCode(''); // Clear generated QR code

        setSelectedTerms(prevSelectedTerms => {
            if (prevSelectedTerms.includes(term)) {
                return prevSelectedTerms.filter(t => t !== term);
            } else {
                return [...prevSelectedTerms, term];
            }
        });
    };

    const handleChildSelect = (childId) => {
        setSelectedChildId(childId);
        setSelectedTerms([]);
        setPaymentMethod('');
        setSelectedBank('');
        setSelectedGateway('');
        setTransactionId('');
        setTransactionIdSubmitted(false);
        setShowReceipt(false);
        setPaymentSuccess(false);
        setIsProcessing(false);
        setAmountPaidForReceipt(0);
        setRandomUpiBank(null); // Clear random UPI bank when child changes
        setCopiedText(''); // Clear copied text feedback
        setInvoiceId(''); // Clear invoice ID when child changes
        setTermsPaidInCurrentTransaction([]); // Clear terms paid in current transaction
        setGeneratedQrCode(''); // Clear generated QR code
        setShowPaymentPopup(false); // Clear payment popup
    };

    // Function to generate a unique invoice ID
    const generateInvoiceId = () => {
        // Simple unique ID based on timestamp and a random string
        return `INV-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    };

    // Refactored downloadReceipt to take payment data
    const downloadPaymentReceipt = async (paymentData) => {
        const studentInfo = parentInfo.children.find(child => child.studentId === paymentData.studentId);
        if (!studentInfo) {
            console.error("Student data not found for receipt generation.");
            alert("Could not generate receipt: Student data missing.");
            return;
        }

        // Create a temporary div to render the receipt content
        const receiptContentDiv = document.createElement('div');
        receiptContentDiv.style.width = '210mm'; // A4 width
        receiptContentDiv.style.padding = '20mm'; // Some padding
        receiptContentDiv.style.boxSizing = 'border-box';
        receiptContentDiv.style.background = 'white';
        receiptContentDiv.style.fontFamily = 'sans-serif'; // Ensure font is consistent

        // Construct the inner HTML for the receipt
        receiptContentDiv.innerHTML = `
            <div style="text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 1rem; margin-bottom: 1rem;">
                <div style="font-size: 2.25rem; font-weight: 800; color: #4338ca; margin-bottom: 0.5rem;">College Name</div>
                <p style="font-size: 0.875rem; color: #4b5563; margin-bottom: 0.25rem;">123 College Lane, Education City, 560001</p>
                <p style="font-size: 0.875rem; color: #4b5563;">contact@collegename.edu | +91-9876543210</p>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h3 style="font-size: 1.5rem; font-weight: 700; color: #1f2937;">Payment Receipt</h3>
                <div style="text-align: right;">
                    <p style="font-size: 0.875rem; font-weight: 600; color: #374151;">Invoice ID:</p>
                    <p style="font-size: 1.125rem; font-weight: 800; color: #2563eb;">${paymentData.invoiceId}</p>
                </div>
            </div>

            <div style="margin-bottom: 1.5rem; padding: 1rem; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
                <h4 style="font-size: 1.125rem; font-weight: 600; color: #1f2937; margin-bottom: 0.75rem;">Student Details</h4>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; font-size: 0.875rem; color: #374151;">
                    <p><span style="font-weight: 500;">Name:</span> ${paymentData.studentName}</p>
                    <p><span style="font-weight: 500;">Student ID:</span> ${paymentData.studentId}</p>
                    <p><span style="font-weight: 500;">Class:</span> ${studentInfo.class}-${studentInfo.section}</p>
                </div>
            </div>

            <div style="margin-bottom: 1.5rem; padding: 1rem; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
                <h4 style="font-size: 1.125rem; font-weight: 600; color: #1f2937; margin-bottom: 0.75rem;">Payment Information</h4>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; font-size: 0.875rem; color: #374151;">
                    <p><span style="font-weight: 500;">Payment Date:</span> ${new Date(paymentData.paymentDate).toLocaleDateString()}</p>
                    <p><span style="font-weight: 500;">Payment Method:</span> ${paymentData.paymentMethod}</p>
                    <p style="grid-column: span 2;"><span style="font-weight: 500;">Transaction ID:</span> <span style="font-family: monospace; color: #1f2937;">${paymentData.transactionId}</span></p>
                </div>
            </div>

            <div style="margin-bottom: 1.5rem;">
                <h4 style="font-weight: 600; color: #1f2937; font-size: 1.125rem; margin-bottom: 0.75rem;">Terms with Payment Under Verification:</h4>
                <ul style="list-style: disc; padding-left: 1.25rem; font-size: 1rem; color: #374151; margin-top: 0;">
                    ${paymentData.termsPaid.map(term => `
                        <li>${term.term} - ${term.feeType}: <span style="font-weight: 700;">₹${term.amount.toLocaleString()}</span></li>
                    `).join('')}
                </ul>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 2px solid #d1d5db;">
                <span style="font-size: 1.25rem; font-weight: 700; color: #1f2937;">Total Amount Paid (Under Verification):</span>
                <span style="font-size: 1.5rem; font-weight: 800; color: #10b981;">₹${paymentData.amount.toLocaleString()}</span>
            </div>

            <div style="margin-top: 2rem; text-align: center; color: #6b7280; font-size: 0.875rem;">
                <p>Thank you for your timely payment!</p>
                <p style="margin-top: 0.5rem;">This is a system-generated receipt and does not require a signature.</p>
            </div>
        `;

        // Append to body temporarily for html2canvas to render
        document.body.appendChild(receiptContentDiv);

        try {
            const canvas = await html2canvas(receiptContentDiv, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const pageHeight = 297;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            pdf.save(`Fee_Payment_Receipt_${paymentData.studentName.replace(/\s/g, '_')}_${paymentData.invoiceId}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF receipt. Please try again.");
        } finally {
            // Clean up: remove the temporary div
            document.body.removeChild(receiptContentDiv);
        }
    };




    // Generate payment UPI string for QR code
    const generatePaymentQrCode = async () => {
        try {
            const payeeUpiId = randomUpiBank ? randomUpiBank.upiId : 'college@upi';
            const payeeName = 'College Name Fees';
            const transactionRef = `FEE${studentData.studentId}${Date.now()}`;
            const transactionNote = `Fee Payment for ${studentData.name} - Terms: ${selectedTerms.join(', ')}`;
            
            const upiString = `upi://pay?pa=${payeeUpiId}&pn=${encodeURIComponent(payeeName)}&am=${totalAmountToPay}.00&cu=INR&tr=${transactionRef}&tn=${encodeURIComponent(transactionNote)}`;
            
            // For now, we'll use a placeholder QR code or generate via external service
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(upiString)}`;
            
            setGeneratedQrCode(qrCodeUrl);
            return qrCodeUrl;
        } catch (error) {
            console.error('Error generating QR code:', error);
            return null;
        }
    };

    // Simulate payment verification (in real app, this would be an API call)
    const simulatePaymentVerification = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // 80% success rate for demo
                const isSuccess = Math.random() > 0.2;
                resolve(isSuccess);
            }, 2000);
        });
    };

    // Show payment popup
    const showPaymentStatus = (type, message) => {
        setPaymentPopupType(type);
        setPaymentPopupMessage(message);
        setShowPaymentPopup(true);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            setShowPaymentPopup(false);
        }, 5000);
    };

    // Function to copy text to clipboard
    const copyToClipboard = (text, identifier) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedText(identifier);
            setTimeout(() => setCopiedText(''), 2000); // Clear feedback after 2 seconds
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy text. Please copy manually.');
        });
    };


    return (
        <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
            {/* Header */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-2 mb-4 sm:mb-0 text-center sm:text-left">
                <IndianRupee className="mr-3 text-indigo-600 size-7 sm:size-8" />
                Junior College Fee Payment Portal
            </h1>

            {/* Children Selector */}
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {parentInfo.children.map(child => (
                        <div
                            key={child.id}
                            className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 ease-in-out
                                    ${selectedChildId === child.id ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm'}`}
                            onClick={() => handleChildSelect(child.id)}
                        >
                            <img
                                src={child.profilePic}
                                alt={child.name}
                                className="rounded-full mr-3 border border-gray-200"
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                            <div className="flex-grow">
                                <h6 className="mb-0 font-semibold text-gray-800 text-base">{child.name}</h6>
                                <small className="text-gray-500 text-xs sm:text-sm">
                                    {child.course} {child.rollNumber && `• Roll No: ${child.rollNumber}`}
                                </small>
                            </div>
                            {selectedChildId === child.id && (
                                <FaCheckCircle className="text-indigo-500 ml-auto" size={20} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Display message if no child is selected or no children exist */}
            {!selectedChildId && (
                <div className="bg-blue-50 p-4 rounded-lg text-blue-800 flex items-center justify-center mb-6 shadow-sm text-sm sm:text-base">
                    <AlertCircle className="mr-2" size={20} />
                    Please select a child to view their fee details.
                </div>
            )}

            {selectedChildId && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    {/* Left Section: Student Information & Fee Details */}
                    <div>
                        {/* Student Information */}
                        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 mb-6 shadow-md">
                            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-5 text-gray-800 flex items-center">
                                <User className="mr-2 text-blue-600 size-5 sm:size-6" /> Student Information
                            </h2>
                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex items-center bg-gray-50 p-2 rounded-md border border-gray-200">
                                    <span className="text-sm sm:text-base text-gray-900 font-medium">{studentData.name}</span>
                                </div>
                                <div className="flex items-center bg-gray-50 p-2 rounded-md border border-gray-200">
                                    <Clipboard className="text-gray-500 mr-2 size-4 sm:size-5" />
                                    <span className="text-sm sm:text-base text-gray-900">ID: <span className="font-medium">{studentData.studentId}</span></span>
                                </div>
                                <div className="flex items-center bg-gray-50 p-2 rounded-md border border-gray-200">
                                    <GraduationCap className="text-gray-500 mr-2 size-4 sm:size-5" />
                                    <span className="text-sm sm:text-base text-gray-900">Course: <span className="font-medium">{studentData.course}</span></span>
                                </div>
                            </div>
                        </div>

                        {/* Fee Details List */}
                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200">
                            <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
                                <Banknote className="mr-2 text-green-600 size-5 sm:size-6" /> Junior College Fee Details
                            </h2>

                            {feeDetails.length === 0 ? (
                                <div className="text-center text-gray-500 py-4 text-sm sm:text-base">No fee records found for this child.</div>
                            ) : (
                                feeDetails.map((fee) => (
                                    <div
                                        key={fee.term}
                                        className={`border rounded-lg p-3 sm:p-4 mb-3 transition-all duration-200 ease-in-out transform hover:scale-[1.01]
                                                ${fee.status === 'Paid' // Keeping 'Paid' class for future proofing, though not actively used now
                                                ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200 text-gray-600 cursor-not-allowed opacity-90'
                                                : fee.status === 'Pending'
                                                    ? 'bg-blue-50 border-blue-200 text-gray-600 cursor-not-allowed opacity-90' // New style for Pending
                                                    : 'bg-white cursor-pointer hover:shadow-md'
                                            } ${selectedTerms.includes(fee.term) ? 'border-indigo-500 bg-indigo-50 shadow-md ring-1 ring-indigo-500' : 'border-gray-200'}`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center flex-grow">
                                                {fee.status === 'Due' && ( // Only allow selection if status is 'Due'
                                                    <input
                                                        type="checkbox"
                                                        className="form-checkbox h-5 w-5 text-indigo-600 mr-3"
                                                        checked={selectedTerms.includes(fee.term)}
                                                        onChange={() => handleTermSelect(fee.term)}
                                                    />
                                                )}
                                                <div>
                                                    <h3 className="font-medium text-sm sm:text-base text-gray-800">{fee.term} - {fee.feeType}</h3>
                                                    <p className={`text-xs sm:text-sm ${fee.status === 'Overdue' ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
                                                        Due: {fee.dueDate}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-2">
                                                <p className="font-bold text-base sm:text-lg text-gray-900">₹{fee.amount.toLocaleString()}</p>
                                                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                                                    fee.status === 'Paid'
                                                        ? 'bg-green-200 text-green-800'
                                                        : fee.status === 'Overdue'
                                                            ? 'bg-red-200 text-red-800'
                                                            : fee.status === 'Pending' // New color for Pending
                                                                ? 'bg-blue-200 text-blue-800'
                                                                : 'bg-yellow-200 text-yellow-800' // Default for 'Due'
                                                    }`}>
                                                    {fee.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Section: Payment Method & Form */}
                    <div className="flex flex-col">
                        <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-5 text-gray-800 flex items-center">
                            <CreditCard className="mr-2 text-purple-600 size-5 sm:size-6" /> Payment Method
                        </h2>
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 sm:space-y-6 flex-grow flex flex-col">
                            {/* Payment Method Buttons */}
                            <div className="space-y-3">
                                <button
                                    type="button"
                                    onClick={() => { setPaymentMethod('Bank Transfer'); setSelectedBank(''); setSelectedGateway(''); setTransactionId(''); setTransactionIdSubmitted(false); setAmountPaidForReceipt(0); setCopiedText(''); }}
                                    disabled={selectedTerms.length === 0 || isProcessing}
                                    className={`w-full p-3 sm:p-4 border rounded-lg flex items-center justify-start text-base sm:text-lg font-medium transition-all duration-200 transform hover:scale-[1.01]
                                            ${paymentMethod === 'Bank Transfer'
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md ring-1 ring-indigo-500'
                                            : 'border-gray-300 bg-white text-gray-800 hover:border-indigo-400 hover:shadow-sm'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    <Banknote className="mr-3 size-5 sm:size-6" />
                                    Bank Transfer
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setPaymentMethod('UPI'); setSelectedBank(''); setSelectedGateway(''); setTransactionId(''); setTransactionIdSubmitted(false); setAmountPaidForReceipt(0); setCopiedText(''); }}
                                    disabled={selectedTerms.length === 0 || isProcessing}
                                    className={`w-full p-3 sm:p-4 border rounded-lg flex items-center justify-start text-base sm:text-lg font-medium transition-all duration-200 transform hover:scale-[1.01]
                                            ${paymentMethod === 'UPI'
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md ring-1 ring-indigo-500'
                                            : 'border-gray-300 bg-white text-gray-800 hover:border-indigo-400 hover:shadow-sm'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    <QrCode className="mr-3 size-5 sm:size-6" />
                                    UPI
                                </button>
                            </div>

                            {/* Conditional sections based on payment method */}
                            {selectedTerms.length > 0 && (paymentMethod === 'Bank Transfer' || paymentMethod === 'UPI') && !paymentSuccess && (
                                <div className="space-y-4 sm:space-y-6 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-inner">
                                    {/* Bank Transfer QR Codes and Account Info */}
                                    {paymentMethod === 'Bank Transfer' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-3">Select Bank to View QR & Account Details</label>

                                            {/* Bank Selection Thumbnails */}
                                            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4">
                                                {['HDFC Bank', 'ICICI Bank', 'AXIS Bank'].map((bankName) => (
                                                    <div
                                                        key={bankName}
                                                        className={`flex flex-col items-center p-2 sm:p-3 border rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-[1.03]
                                                                ${selectedBank === bankName ? 'border-indigo-500 ring-2 ring-indigo-500 bg-white shadow-md' : 'border-gray-300 bg-white hover:border-gray-400'}`}
                                                        onClick={() => setSelectedBank(bankName)}
                                                    >
                                                        <img
                                                            src={
                                                                bankName === 'HDFC Bank' ? hdfcQrCode :
                                                                    bankName === 'ICICI Bank' ? iciciQrCode :
                                                                        axisQrCode
                                                            }
                                                            alt={`${bankName} QR Code`}
                                                            className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-2"
                                                        />
                                                        <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">{bankName}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Selected QR Code Display Area */}
                                            {selectedBank && (
                                                <div
                                                    key={selectedBank} // Forces re-mount and re-application of transitions when bank changes
                                                    className="flex flex-col items-center w-full bg-gray-50 rounded-lg text-sm sm:text-base"
                                                >
                                                    <h4 className="text-lg font-semibold text-gray-800 mb-4">{selectedBank} QR Code</h4>
                                                    <img
                                                        src={
                                                            selectedBank === 'HDFC Bank' ? hdfcQrCode :
                                                                selectedBank === 'ICICI Bank' ? iciciQrCode :
                                                                        axisQrCode
                                                        }
                                                        alt={`${selectedBank} QR Code`}
                                                        className="w-40 h-40 sm:w-56 sm:h-56 object-contain mb-6 transition-transform duration-300 ease-in-out transform hover:scale-105"
                                                    />
                                                    <p className="text-center text-sm sm:text-base text-gray-600 mb-4">
                                                        Scan this QR code with your bank's app to make the payment.
                                                    </p>

                                                    {/* Account Details */}
                                                    <div className="w-full p-4 bg-gray-50 border border-gray-100 rounded-lg text-sm sm:text-base">
                                                        <p className="font-semibold text-gray-800 mb-2">{selectedBank} Account Details:</p>
                                                        <p className="text-gray-700 flex items-center justify-between">
                                                            <span>Account Name: College Name Trust</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => copyToClipboard('College Name Trust', 'bankName')}
                                                                className="ml-2 p-1 rounded-md hover:bg-gray-200 transition-colors"
                                                                title="Copy Account Name"
                                                            >
                                                                <Clipboard className="size-4 text-gray-600" />
                                                            </button>
                                                        </p>
                                                        <p className="text-gray-700 flex items-center justify-between">
                                                            <span>Account Number: <span className="font-mono select-all">{selectedBank === 'HDFC Bank' ? '50100XXXXXXX' : selectedBank === 'ICICI Bank' ? '00010XXXXXXX' : '90000XXXXXXX'}</span></span>
                                                            <button
                                                                type="button"
                                                                onClick={() => copyToClipboard(selectedBank === 'HDFC Bank' ? '50100XXXXXXX' : selectedBank === 'ICICI Bank' ? '00010XXXXXXX' : '90000XXXXXXX', 'bankAccountNumber')}
                                                                className="ml-2 p-1 rounded-md hover:bg-gray-200 transition-colors"
                                                                title="Copy Account Number"
                                                            >
                                                                <Clipboard className="size-4 text-gray-600" />
                                                            </button>
                                                        </p>
                                                        <p className="text-gray-700 flex items-center justify-between">
                                                            <span>IFSC Code: <span className="font-mono select-all">{selectedBank === 'HDFC Bank' ? 'HDFC000XXXX' : selectedBank === 'ICICI Bank' ? 'ICIC000XXXX' : 'UTIB000XXXX'}</span></span>
                                                            <button
                                                                type="button"
                                                                onClick={() => copyToClipboard(selectedBank === 'HDFC Bank' ? 'HDFC000XXXX' : selectedBank === 'ICICI Bank' ? 'ICIC000XXXX' : 'UTIB000XXXX', 'bankIfscCode')}
                                                                className="ml-2 p-1 rounded-md hover:bg-gray-200 transition-colors"
                                                                title="Copy IFSC Code"
                                                            >
                                                                <Clipboard className="size-4 text-gray-600" />
                                                            </button>
                                                        </p>
                                                        {copiedText.startsWith('bank') && (
                                                            <span className="text-xs text-green-600 font-semibold mt-1">Copied!</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            {!selectedBank && (
                                                <div className="text-center text-gray-500 py-4 text-sm sm:text-base">Please select a bank above to view its QR code and account details.</div>
                                            )}
                                        </div>
                                    )}

                                    {/* UPI QR Code and Random Bank Details */}
                                    {paymentMethod === 'UPI' && randomUpiBank && (
                                        <div className="text-center">
                                            <label className="block text-sm font-medium text-gray-700 mb-3">Scan QR Code</label>
                                            <div className="flex justify-center mb-4">
                                                <img src={randomUpiBank.qrCode} alt={`${randomUpiBank.name} QR Code`} className="w-32 h-32 sm:w-48 sm:h-48 object-contain border border-gray-300 rounded-lg p-2 bg-white shadow-md" />
                                            </div>
                                            <p className="text-sm text-gray-700 font-medium text-center mb-4 flex items-center justify-center">
                                                <span>UPI ID: <span className="font-mono">{randomUpiBank.upiId}</span></span>
                                                <button
                                                    type="button"
                                                    onClick={() => copyToClipboard(randomUpiBank.upiId, 'upiId')}
                                                    className="ml-2 p-1 rounded-md hover:bg-gray-200 transition-colors"
                                                    title="Copy UPI ID"
                                                >
                                                    <Clipboard className="size-4 text-gray-600" />
                                                </button>
                                                {copiedText === 'upiId' && (
                                                    <span className="text-xs text-green-600 font-semibold ml-1">Copied!</span>
                                                )}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                (Scan this QR code with your preferred UPI app to pay.)
                                            </p>
                                            {/* Displaying random bank details under UPI QR */}
                                            <div className="w-full p-4 bg-gray-50 border border-gray-100 rounded-lg text-sm sm:text-base mt-4">
                                                <p className="font-semibold text-gray-800 mb-2">{randomUpiBank.name} Account Details:</p>
                                                <p className="text-gray-700 flex items-center justify-between">
                                                    <span>Account Name: {randomUpiBank.accountName}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => copyToClipboard(randomUpiBank.accountName, 'upiAccountName')}
                                                        className="ml-2 p-1 rounded-md hover:bg-gray-200 transition-colors"
                                                        title="Copy Account Name"
                                                    >
                                                        <Clipboard className="size-4 text-gray-600" />
                                                    </button>
                                                </p>
                                                <p className="text-gray-700 flex items-center justify-between">
                                                    <span>Account Number: <span className="font-mono select-all">{randomUpiBank.accountNumber}</span></span>
                                                    <button
                                                        type="button"
                                                        onClick={() => copyToClipboard(randomUpiBank.accountNumber, 'upiAccountNumber')}
                                                        className="ml-2 p-1 rounded-md hover:bg-gray-200 transition-colors"
                                                        title="Copy Account Number"
                                                    >
                                                        <Clipboard className="size-4 text-gray-600" />
                                                    </button>
                                                </p>
                                                <p className="text-gray-700 flex items-center justify-between">
                                                    <span>IFSC Code: <span className="font-mono select-all">{randomUpiBank.ifscCode}</span></span>
                                                    <button
                                                        type="button"
                                                        onClick={() => copyToClipboard(randomUpiBank.ifscCode, 'upiIfscCode')}
                                                        className="ml-2 p-1 rounded-md hover:bg-gray-200 transition-colors"
                                                        title="Copy IFSC Code"
                                                    >
                                                        <Clipboard className="size-4 text-gray-600" />
                                                    </button>
                                                </p>
                                                {copiedText.startsWith('upiAccount') || copiedText.startsWith('upiIfsc') ? (
                                                    <span className="text-xs text-green-600 font-semibold mt-1">Copied!</span>
                                                ) : null}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Transaction ID Input (after payment is simulated, before submission) */}
                            {paymentSuccess && !transactionIdSubmitted && (
                                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm text-sm sm:text-base">
                                    <label htmlFor="transactionId" className="block font-medium text-green-800 mb-1">
                                        Enter Confirmed Transaction ID
                                    </label>
                                    <input
                                        type="text"
                                        id="transactionId"
                                        className="w-full border border-green-300 rounded-md p-2 sm:p-3 text-green-900 bg-white focus:ring-green-500 focus:border-green-500 focus:outline-none"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        placeholder="e.g., ABC123XYZ789"
                                    />
                                    <p className="text-xs text-green-700 mt-2 mb-3">Please enter the 12 Digit transaction ID provided by your bank/gateway to confirm payment and view receipt.</p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (transactionId.trim().length !== 12) { // Changed validation
                                                alert('Please enter a valid 12-digit transaction ID.');
                                                return;
                                            }
                                            setTransactionIdSubmitted(true);
                                            // Generate unique invoice ID upon successful transaction ID submission
                                            const newInvoiceId = generateInvoiceId();
                                            setInvoiceId(newInvoiceId);
                                            // Capture the terms that were just paid for the receipt
                                            setTermsPaidInCurrentTransaction([...selectedTerms]); // Deep copy to prevent future changes

                                            // Add this payment to recent payments list
                                            const paidTermsDetails = feeDetails.filter(fee => selectedTerms.includes(fee.term));
                                            const newPaymentRecord = {
                                                invoiceId: newInvoiceId,
                                                studentId: studentData.studentId,
                                                studentName: studentData.name,
                                                transactionId: transactionId,
                                                amount: amountPaidForReceipt,
                                                paymentDate: new Date().toISOString(), // Use ISO string for consistent date storage
                                                paymentMethod: paymentMethod,
                                                termsPaid: paidTermsDetails.map(term => ({ term: term.term, feeType: term.feeType, amount: term.amount })),
                                                status: 'Verification Pending'
                                            };
                                            setRecentPayments(prevPayments => [newPaymentRecord, ...prevPayments]);


                                            // Update fee status for all paid terms for the specific child from 'Due' to 'Pending'
                                            setAllStudentFeeData(prevData => ({
                                                ...prevData,
                                                [selectedChildId]: prevData[selectedChildId].map(fee =>
                                                    selectedTerms.includes(fee.term) ? { ...fee, status: 'Pending' } : fee
                                                )
                                            }));
                                            // Clear selected terms after successful transaction ID submission
                                            setSelectedTerms([]);
                                        }}
                                        disabled={!transactionId.trim()}
                                        className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-md text-sm font-semibold flex items-center justify-center hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
                                    >
                                        Submit Transaction ID
                                    </button>
                                </div>
                            )}

                            {/* Payment Success Message (appears after transaction ID is submitted for both methods) */}
                            {paymentSuccess && transactionIdSubmitted && (
                                <div className="bg-green-100 text-green-800 p-4 rounded-lg flex items-center justify-center text-center font-medium mt-6 text-sm sm:text-base shadow-sm">
                                    <CheckCircle className="mr-2 size-5" />
                                    Payment successful for the selected terms! Receipt is now available. Your payment is under verification.
                                </div>
                            )}


                            {/* Toggle to show receipt (now depends on transactionIdSubmitted) */}
                            {paymentSuccess && transactionIdSubmitted && transactionId && invoiceId && (
                                <div className="flex items-center mt-4">
                                    <input
                                        type="checkbox"
                                        id="receiptCheck"
                                        checked={showReceipt}
                                        onChange={(e) => setShowReceipt(e.target.checked)}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        disabled={!paymentSuccess || !transactionIdSubmitted || !transactionId.trim() || !invoiceId}
                                    />
                                    <label htmlFor="receiptCheck" className="ml-2 block text-sm text-gray-900">
                                        Show Payment Receipt
                                    </label>
                                </div>
                            )}


                            {/* This section will be the receipt content to be downloaded */}
                            {showReceipt && paymentSuccess && transactionIdSubmitted && transactionId && invoiceId && (
                                <div ref={receiptRef} className="mt-6 p-6 bg-white border border-gray-300 rounded-xl shadow-lg font-sans">
                                    {/* Receipt Header */}
                                    <div className="flex flex-col items-center justify-center border-b pb-4 mb-4">
                                        <div className="text-3xl font-extrabold text-indigo-700 mb-2">Junior College Name</div>
                                        <p className="text-sm text-gray-600 mb-1">123 Junior College Road, Hyderabad, Andhra Pradesh, 500001</p>
                                        <p className="text-sm text-gray-600">contact@juniorcollege.edu | +91-9876543210</p>
                                    </div>

                                    {/* Invoice Details */}
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-2xl font-bold text-gray-800">Payment Receipt</h3>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-gray-700">Invoice ID:</p>
                                            <p className="text-lg font-extrabold text-blue-600">{invoiceId}</p>
                                        </div>
                                    </div>

                                    {/* Student Information */}
                                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Student Details</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                                            <p><span className="font-medium">Name:</span> {studentData.name}</p>
                                            <p><span className="font-medium">Student ID:</span> {studentData.studentId}</p>
                                            <p><span className="font-medium">Class:</span> {studentData.class}-{studentData.section}</p>
                                        </div>
                                    </div>

                                    {/* Payment Details */}
                                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Payment Information</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                                            <p><span className="font-medium">Payment Date:</span> {new Date().toLocaleDateString()}</p>
                                            <p><span className="font-medium">Payment Method:</span> {paymentMethod} {selectedGateway && `(${selectedGateway})`}</p>
                                            <p className="col-span-2"><span className="font-medium">Transaction ID:</span> <span className="font-mono text-gray-900">{transactionId}</span></p>
                                        </div>
                                    </div>

                                    {/* Terms with Payment Under Verification - UPDATED */}
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-gray-800 text-lg mb-3">Semesters with Payment Under Verification:</h4>
                                        <ul className="list-disc pl-5 text-base text-gray-700 space-y-1">
                                            {feeDetails
                                                .filter(fee => termsPaidInCurrentTransaction.includes(fee.term)) // Filter based on terms paid in THIS transaction
                                                .map((fee) => (
                                                    <li key={fee.term}>{fee.term} - {fee.feeType}: <span className="font-bold">₹{fee.amount.toLocaleString()}</span></li>
                                                ))}
                                        </ul>
                                    </div>

                                    {/* Total Amount Paid */}
                                    <div className="flex justify-between items-center pt-4 border-t-2 border-gray-300">
                                        <span className="text-xl font-bold text-gray-900">Total College Fee Paid (Under Verification):</span>
                                        <span className="text-2xl font-extrabold text-green-600">₹{amountPaidForReceipt.toLocaleString()}</span>
                                    </div>

                                    {/* Receipt Footer */}
                                    <div className="mt-8 text-center text-gray-500 text-sm">
                                        <p>Thank you for your timely payment!</p>
                                        <p className="mt-2">This is a system-generated receipt and does not require a signature.</p>
                                    </div>
                                </div>
                            )}

                            {/* Download Receipt Button for current transaction*/}
                            {showReceipt && paymentSuccess && transactionIdSubmitted && transactionId && invoiceId && (
                                <button
                                    type="button"
                                    // Pass the current transaction's relevant data to the download function
                                    onClick={() => downloadPaymentReceipt({
                                        invoiceId: invoiceId,
                                        studentId: studentData.studentId,
                                        studentName: studentData.name,
                                        transactionId: transactionId,
                                        amount: amountPaidForReceipt,
                                        paymentDate: new Date().toISOString(),
                                        paymentMethod: paymentMethod,
                                        termsPaid: termsPaidInCurrentTransaction.map(term => feeDetails.find(f => f.term === term)), // Get full fee details for terms
                                    })}
                                    className="mt-4 w-full bg-indigo-600 text-white py-3 px-6 rounded-lg text-lg font-semibold flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-md"
                                >
                                    <Download className="mr-3 size-6" />
                                    Download Receipt
                                </button>
                            )}

                            {/* The primary 'Pay' / 'Submit Transaction' button */}
                            <div className="mt-auto pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={async () => {
                                        if (totalAmountToPay === 0) {
                                            alert('Please select at least one term to pay.');
                                            return;
                                        }
                                        if (!paymentMethod) {
                                            alert('Please select a payment method.');
                                            return;
                                        }

                                        setIsProcessing(true);
                                        setPaymentSuccess(false);
                                        setTransactionId('');
                                        setTransactionIdSubmitted(false);
                                        setShowReceipt(false);
                                        setAmountPaidForReceipt(0);
                                        setInvoiceId(''); // Clear invoice ID before new payment process
                                        setTermsPaidInCurrentTransaction([]); // Clear terms paid in current transaction


                                        if (paymentMethod === 'UPI') {
                                            // Generate QR code if not already generated
                                            if (!generatedQrCode) {
                                                await generatePaymentQrCode();
                                            }
                                            
                                            // Simulate payment process
                                            setTimeout(async () => {
                                                const paymentResult = await simulatePaymentVerification();
                                                setIsProcessing(false);
                                                
                                                if (paymentResult) {
                                                    setPaymentSuccess(true);
                                                    setAmountPaidForReceipt(totalAmountToPay);
                                                    showPaymentStatus('success', `Payment of ₹${totalAmountToPay.toLocaleString()} successful! Please enter your transaction ID to complete the process.`);
                                                } else {
                                                    showPaymentStatus('error', 'Payment failed! Please try again or contact support.');
                                                }
                                            }, 3000);
                                        } else if (paymentMethod === 'Bank Transfer') {
                                            setTimeout(async () => {
                                                const paymentResult = await simulatePaymentVerification();
                                                setIsProcessing(false);
                                                
                                                if (paymentResult) {
                                                    setPaymentSuccess(true);
                                                    setAmountPaidForReceipt(totalAmountToPay);
                                                    showPaymentStatus('success', `Bank transfer initiated successfully! Amount: ₹${totalAmountToPay.toLocaleString()}. Please enter your transaction ID.`);
                                                } else {
                                                    showPaymentStatus('error', 'Bank transfer failed! Please check your account details and try again.');
                                                }
                                            }, 1500);
                                        }
                                    }}
                                    disabled={selectedTerms.length === 0 || !paymentMethod || isProcessing || paymentSuccess}
                                    className={`w-full py-3 px-6 rounded-lg text-lg font-semibold flex items-center justify-center transition-colors
                                            ${selectedTerms.length === 0 || !paymentMethod || isProcessing || paymentSuccess
                                            ? 'bg-indigo-300 text-white cursor-not-allowed'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                                        }`}
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="mr-3 animate-spin size-6" />
                                            Processing...
                                        </>
                                    ) : (
                                        // The button text for Bank Transfer needs to be "Submit Transaction" only after paymentSuccess is true
                                        paymentMethod === 'Bank Transfer' && !paymentSuccess ? 'Initiate Bank Transfer' : `Pay ₹${totalAmountToPay.toLocaleString()}`
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Payment Status Popup */}
            {showPaymentPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative animate-pulse">
                        <button
                            onClick={() => setShowPaymentPopup(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>
                        
                        <div className="text-center">
                            {paymentPopupType === 'success' ? (
                                <div className="mb-4">
                                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                                        <CheckCircle className="h-8 w-8 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Successful!</h3>
                                </div>
                            ) : (
                                <div className="mb-4">
                                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                                        <AlertCircle className="h-8 w-8 text-red-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Failed!</h3>
                                </div>
                            )}
                            
                            <p className="text-gray-600 mb-6">{paymentPopupMessage}</p>
                            
                            <button
                                onClick={() => setShowPaymentPopup(false)}
                                className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                                    paymentPopupType === 'success'
                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                        : 'bg-red-600 text-white hover:bg-red-700'
                                }`}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Payments List Section - NEWLY ADDED */}
            {recentPayments.length > 0 && (
                <div className="mt-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 flex items-center">
                        <IndianRupee className="mr-3 text-purple-600 size-6 sm:size-7" /> Recent Payments
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Invoice ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Terms Paid
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th> {/* New column for actions */}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentPayments.map((payment, index) => (
                                    <tr key={payment.invoiceId || index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                            {payment.invoiceId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {payment.studentName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                            ₹{payment.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {payment.termsPaid.map(t => `${t.term} (${t.feeType})`).join(', ')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {new Date(payment.paymentDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                payment.status === 'Verification Pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-green-100 text-green-800' // Assuming verified status would be green
                                            }`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => downloadPaymentReceipt(payment)}
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                title="Download Receipt"
                                            >
                                                <Download className="mr-1.5 size-4" />
                                                Receipt
                                            </button>
                                        </td> {/* Button for each payment */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeeModule;