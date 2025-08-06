import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import studentService from '../services/paymentService';

const StudentProfile = () => {
  const [paymentData, setPaymentData] = useState(null);
  const [personalData, setPersonalData] = useState(null);
  const [academicData, setAcademicData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
    <div className="flex justify-between items-center py-2 border-b border-gray-100">
      <span className="text-gray-600 font-medium">{label}:</span>
      {isStatus ? (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      ) : (
        <span className="text-gray-900">{value}</span>
      )}
    </div>
  );

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'complete':
        return 'success';
      case 'partial':
      case 'pending':
        return 'warning';
      case 'overdue':
      case 'unpaid':
        return 'error';
      default:
        return 'success';
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '৳0.00';
    return `৳${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div>
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
        <p className="text-gray-600">Personal Information & Academic Details</p>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <i className="fas fa-user text-white text-3xl"></i>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {personalData?.name || studentData.studentName}
            </h2>
            <p className="text-gray-600">Student ID: {userInfo?.studentId || studentData.studentId}</p>
            <p className="text-gray-600">{studentData.department} • {studentData.program}</p>
            <div className="flex items-center mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <i className="fas fa-circle text-green-400 mr-1"></i>
                {studentData.status}
              </span>
            </div>
          </div>
          <div className="text-right">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
              <i className="fas fa-edit mr-2"></i>Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <i className="fas fa-user-circle text-blue-500 mr-2"></i>
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
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

        {/* Academic Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <i className="fas fa-graduation-cap text-green-500 mr-2"></i>
            <h3 className="text-lg font-semibold text-gray-900">Academic Information</h3>
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
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Emergency Contact */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <i className="fas fa-phone text-red-500 mr-2"></i>
            <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
          </div>
          
          <div className="space-y-4">
            <InfoRow label="Guardian Name" value={personalData?.guardian_name || studentData.guardianName} />
            <InfoRow label="Guardian Phone" value={personalData?.guardian_phone || studentData.guardianPhone} />
            <InfoRow label="Relationship" value={personalData?.guardian_relation || studentData.guardianRelation} />
          </div>
        </div>

        {/* Financial Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
            <i className="fas fa-dollar-sign text-yellow-500 mr-2"></i>
            <h3 className="text-lg font-semibold text-gray-900">Financial Summary</h3>
            </div>
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            )}
          </div>
          
          {error ? (
            <div className="text-red-600 text-sm mb-4">
              <i className="fas fa-exclamation-circle mr-1"></i>
              {error}
            </div>
          ) : null}
          
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

          {/* Payment Progress Bar */}
          {paymentData && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Payment Progress</span>
                <span>{Math.round((paymentData.total_paid / paymentData.total_payable) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min((paymentData.total_paid / paymentData.total_payable) * 100, 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile; 