import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import studentService from '../services/paymentService';

const StudentProfile = () => {
  const [paymentData, setPaymentData] = useState(null);
  const [personalData, setPersonalData] = useState(null);
  const [academicData, setAcademicData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const userInfo = authService.getUserInfo();

  const studentData = {
    studentName: 'MD. LATIFUR RAHMAN',
    studentId: '024231000510145',
    department: 'Computer Science & Engineering',
    program: 'BSc in CSE',
    status: 'Active',
    batch: '2023',
    currentSemester: '5th Semester',
    creditCompleted: '75',
    totalCredits: '140',
    cgpa: '3.15',
    academicStatus: 'Good Standing',
    admissionDate: '15 January 2023',
    guardianName: 'Abdul Rahman',
    guardianPhone: '+880 1812345678',
    guardianRelation: 'Father',
  };

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      if (!userInfo?.studentId) {
        setError('No student ID available');
        setIsLoading(false);
        return;
      }

      try {
        // Fetch payment data
        const paymentResult = await studentService.getStudentPaymentInfo(userInfo.studentId);
        if (paymentResult.success) {
          setPaymentData(paymentResult.data);
        }

        // Fetch personal data
        const personalResult = await studentService.getStudentPersonalInfo(userInfo.studentId);
        if (personalResult.success) {
          setPersonalData(personalResult.data);
        }

        // Fetch academic data
        const academicResult = await studentService.getStudentAcademicInfo(userInfo.studentId);
        if (academicResult.success) {
          setAcademicData(academicResult.data);
        }

        // Set error if all failed
        if (!paymentResult.success && !personalResult.success && !academicResult.success) {
          setError('Failed to fetch data');
        }
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Data fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userInfo?.studentId]);


  const InfoRow = ({ label, value, isStatus = false, statusType = '' }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 rounded-lg px-2">
      <span className="text-gray-600 font-medium">{label}:</span>
      {isStatus ? (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
          statusType.bg ? `${statusType.bg} ${statusType.text} ${statusType.border}` : 'bg-green-100 text-green-800 border-green-200'
        }`}>
          {value}
        </span>
      ) : (
        <span className="text-gray-900 font-medium">{value}</span>
      )}
    </div>
  );

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'complete':
        return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
      case 'partial':
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' };
      case 'overdue':
      case 'unpaid':
        return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
      default:
        return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '৳0.00';
    return `৳${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  const getCGPAStatus = (cgpa) => {
    const num = parseFloat(cgpa);
    if (num >= 3.75) return { status: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (num >= 3.50) return { status: 'Very Good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (num >= 3.25) return { status: 'Good', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (num >= 3.00) return { status: 'Satisfactory', color: 'text-orange-600', bg: 'bg-orange-50' };
    if (num >= 2.00) return { status: 'Pass', color: 'text-red-500', bg: 'bg-red-50' };
    return { status: 'Needs Improvement', color: 'text-red-700', bg: 'bg-red-100' };
  };

  const cgpaStatus = academicData?.cgpa ? getCGPAStatus(academicData.cgpa) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      {/* Page Header with Animation */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Student Profile
            </h1>
            <p className="text-gray-600 mt-1">Personal Information & Academic Details</p>
          </div>
        </div>
      </div>

      {/* Enhanced Profile Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-xl p-8 mb-8 border border-blue-100">
        <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {personalData?.name || studentData.studentName}
            </h2>
            <p className="text-lg text-gray-600 mb-2">Student ID: {userInfo?.studentId || studentData.studentId}</p>
            <p className="text-gray-600 mb-4">{studentData.department} • {studentData.program}</p>
            <div className="flex items-center justify-center lg:justify-start space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                {studentData.status}
              </span>
              {cgpaStatus && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${cgpaStatus.bg} ${cgpaStatus.color} border`}>
                  CGPA: {academicData?.cgpa || studentData.cgpa} ({cgpaStatus.status})
                </span>
              )}
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>{isEditing ? 'Save' : 'Edit Profile'}</span>
            </button>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-xl border-2 border-blue-600 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-300 ${
              activeTab === 'personal'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Info
            </span>
          </button>
          <button
            onClick={() => setActiveTab('academic')}
            className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-300 ${
              activeTab === 'academic'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              Academic Info
            </span>
          </button>
          <button
            onClick={() => setActiveTab('financial')}
            className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-300 ${
              activeTab === 'financial'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Financial Info
            </span>
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                </div>
                
                <div className="space-y-4">
                  <InfoRow label="Full Name" value={personalData?.name || studentData.studentName} />
                  <InfoRow label="Student ID" value={userInfo?.studentId || studentData.studentId} />
                  <InfoRow label="Email" value={personalData?.email || 'N/A'} />
                  <InfoRow label="Phone" value={personalData?.phone || 'N/A'} />
                  <InfoRow label="Date of Birth" value={personalData?.date_of_birth || 'N/A'} />
                  <InfoRow label="Gender" value={personalData?.gender || 'N/A'} />
                  <InfoRow label="Blood Group" value={personalData?.blood_group || 'N/A'} />
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">Address:</span>
                    <span className="text-gray-900 text-right">{personalData?.address || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-100">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Emergency Contact</h3>
                </div>
                
                <div className="space-y-4">
                  <InfoRow label="Guardian Name" value={personalData?.guardian_name || studentData.guardianName} />
                  <InfoRow label="Guardian Phone" value={personalData?.guardian_phone || studentData.guardianPhone} />
                  <InfoRow label="Relationship" value={personalData?.guardian_relation || studentData.guardianRelation} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'academic' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Academic Information */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Academic Information</h3>
                </div>
                
                <div className="space-y-4">
                  <InfoRow label="Department" value={academicData?.department || studentData.department} />
                  <InfoRow label="Program" value={academicData?.program || studentData.program} />
                  <InfoRow label="Batch" value={academicData?.batch || studentData.batch} />
                  <InfoRow label="Current Semester" value={academicData?.current_semester || studentData.currentSemester} />
                  <InfoRow label="Credit Completed" value={academicData ? `${academicData.credit_completed || 0} / ${academicData.total_credits || 0}` : `${studentData.creditCompleted} / ${studentData.totalCredits}`} />
                  <InfoRow label="CGPA" value={academicData?.cgpa || studentData.cgpa} />
                  <InfoRow label="Academic Status" value={academicData?.academic_status || studentData.academicStatus} isStatus={true} statusType="success" />
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">Admission Date:</span>
                    <span className="text-gray-900">{academicData?.admission_date || studentData.admissionDate}</span>
                  </div>
                </div>
              </div>

              {/* Academic Progress */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Academic Progress</h3>
                </div>
                
                <div className="space-y-6">
                  {/* Credit Progress */}
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Credit Completion</span>
                      <span>{Math.round((academicData?.credit_completed || studentData.creditCompleted) / (academicData?.total_credits || studentData.totalCredits) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${Math.min((academicData?.credit_completed || studentData.creditCompleted) / (academicData?.total_credits || studentData.totalCredits) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {academicData?.credit_completed || studentData.creditCompleted} of {academicData?.total_credits || studentData.totalCredits} credits completed
                    </p>
                  </div>

                  {/* CGPA Display */}
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <p className="text-2xl font-bold text-gray-900">{academicData?.cgpa || studentData.cgpa}</p>
                    <p className="text-sm text-gray-600">Current CGPA</p>
                    {cgpaStatus && (
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${cgpaStatus.bg} ${cgpaStatus.color}`}>
                        {cgpaStatus.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'financial' && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Financial Summary</h3>
                </div>
                {isLoading && (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                )}
              </div>
              
              {error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              ) : null}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <InfoRow 
                    label="Total Payable" 
                    value={formatCurrency(paymentData?.total_payable || '0')} 
                  />
                  <InfoRow 
                    label="Total Paid" 
                    value={formatCurrency(paymentData?.total_paid || '0')} 
                  />
                  <InfoRow 
                    label="Total Due" 
                    value={formatCurrency(paymentData?.total_due || '0')} 
                  />
                  <InfoRow 
                    label="Payment Status" 
                    value={paymentData?.payment_status || 'N/A'} 
                    isStatus={true} 
                    statusType={getPaymentStatusColor(paymentData?.payment_status)} 
                  />
                </div>

                {/* Payment Progress */}
                {paymentData && (
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Progress</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Payment Completion</span>
                          <span>{Math.round((paymentData.total_paid / paymentData.total_payable) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
                            style={{ 
                              width: `${Math.min((paymentData.total_paid / paymentData.total_payable) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-lg font-bold text-green-600">{formatCurrency(paymentData.total_paid)}</p>
                          <p className="text-xs text-green-600">Paid</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-3">
                          <p className="text-lg font-bold text-red-600">{formatCurrency(paymentData.total_due)}</p>
                          <p className="text-xs text-red-600">Due</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-center py-12">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 animate-spin" style={{ animationDelay: '0.5s' }}></div>
            </div>
            <div className="ml-6">
              <p className="text-lg font-semibold text-gray-700">Loading student profile...</p>
              <p className="text-gray-500">Please wait while we fetch your information</p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-xl p-6 mb-8 animate-bounce">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-red-700 font-semibold">{error}</p>
              <p className="text-red-600 text-sm mt-1">Please try again or contact support if the issue persists.</p>
            </div>
          </div>
        </div>
      )}

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StudentProfile; 