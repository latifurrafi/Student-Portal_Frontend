import React from 'react';

const StudentProfile = () => {
  const studentData = {
    studentName: 'MD. LATIFUR RAHMAN',
    studentId: '024231000510145',
    department: 'Computer Science & Engineering',
    program: 'BSc in CSE',
    status: 'Active',
    email: 'latifur.rahman@student.diu.edu.bd',
    phone: '+880 1712345678',
    dateOfBirth: '15 March 2000',
    gender: 'Male',
    bloodGroup: 'B+',
    address: 'Dhaka, Bangladesh',
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
    totalPayable: '603,900.00',
    totalPaid: '558,400.00',
    totalDue: '45,500.00',
    paymentStatus: 'Partial',
  };

  const recentActivities = [
    {
      title: 'Course Registration Completed',
      description: 'Successfully registered for 5th semester courses',
      timeAgo: '2 hours ago',
      color: 'green',
    },
    {
      title: 'Payment Made',
      description: 'Tuition fee payment of ৳45,000 completed',
      timeAgo: '1 day ago',
      color: 'blue',
    },
    {
      title: 'Result Published',
      description: '4th semester results are now available',
      timeAgo: '3 days ago',
      color: 'yellow',
    },
  ];

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
            <h2 className="text-2xl font-bold text-gray-900">{studentData.studentName}</h2>
            <p className="text-gray-600">Student ID: {studentData.studentId}</p>
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
            <InfoRow label="Full Name" value={studentData.studentName} />
            <InfoRow label="Student ID" value={studentData.studentId} />
            <InfoRow label="Email" value={studentData.email} />
            <InfoRow label="Phone" value={studentData.phone} />
            <InfoRow label="Date of Birth" value={studentData.dateOfBirth} />
            <InfoRow label="Gender" value={studentData.gender} />
            <InfoRow label="Blood Group" value={studentData.bloodGroup} />
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 font-medium">Address:</span>
              <span className="text-gray-900 text-right">{studentData.address}</span>
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
            <InfoRow label="Department" value={studentData.department} />
            <InfoRow label="Program" value={studentData.program} />
            <InfoRow label="Batch" value={studentData.batch} />
            <InfoRow label="Current Semester" value={studentData.currentSemester} />
            <InfoRow label="Credit Completed" value={`${studentData.creditCompleted} / ${studentData.totalCredits}`} />
            <InfoRow label="CGPA" value={studentData.cgpa} />
            <InfoRow label="Academic Status" value={studentData.academicStatus} isStatus={true} statusType="success" />
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 font-medium">Admission Date:</span>
              <span className="text-gray-900">{studentData.admissionDate}</span>
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
            <InfoRow label="Guardian Name" value={studentData.guardianName} />
            <InfoRow label="Guardian Phone" value={studentData.guardianPhone} />
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 font-medium">Relationship:</span>
              <span className="text-gray-900">{studentData.guardianRelation}</span>
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <i className="fas fa-dollar-sign text-yellow-500 mr-2"></i>
            <h3 className="text-lg font-semibold text-gray-900">Financial Summary</h3>
          </div>
          
          <div className="space-y-4">
            <InfoRow label="Total Payable" value={`৳${studentData.totalPayable}`} />
            <InfoRow label="Total Paid" value={`৳${studentData.totalPaid}`} />
            <InfoRow label="Total Due" value={`৳${studentData.totalDue}`} />
            <InfoRow label="Payment Status" value={studentData.paymentStatus} isStatus={true} statusType="success" />
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <div className="flex items-center mb-4">
          <i className="fas fa-history text-purple-500 mr-2"></i>
          <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
        </div>
        
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 bg-${activity.color}-400 rounded-full`}></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-xs text-gray-500">{activity.description}</p>
              </div>
              <span className="text-xs text-gray-400">{activity.timeAgo}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile; 