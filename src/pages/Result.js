import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import studentService from '../services/paymentService';

const Result = () => {
  const [selectedSemester, setSelectedSemester] = useState('Spring 2025, 251');
  const [resultData, setResultData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const userInfo = authService.getUserInfo();

  // Mock data for demonstration - replace with API call
  const mockResultData = {
    studentName: 'MD. LATIFUR RAHMAN',
    studentId: '0242310005101451',
    regId: '0242310005101451',
    program: 'B.Sc. in Computer Science & Engineering',
    batch: '64',
    sgpa: '2.59',
    semester: 'Spring 2025',
    courses: [
      {
        sl: 1,
        courseCode: 'CSE321',
        courseTitle: 'Computer Networks',
        credit: 3.00,
        grade: 'C+',
        gradePoint: 2.50
      },
      {
        sl: 2,
        courseCode: 'CSE322',
        courseTitle: 'Computer Networks Lab',
        credit: 1.50,
        grade: 'B',
        gradePoint: 3.00
      },
      {
        sl: 3,
        courseCode: 'CSE311',
        courseTitle: 'Database Management System',
        credit: 3.00,
        grade: 'C+',
        gradePoint: 2.50
      },
      {
        sl: 4,
        courseCode: 'CSE312',
        courseTitle: 'Database Management System Lab',
        credit: 1.50,
        grade: 'B-',
        gradePoint: 2.75
      },
      {
        sl: 5,
        courseCode: 'ACT327',
        courseTitle: 'Financial and Managerial Accounting',
        credit: 3.00,
        grade: 'C+',
        gradePoint: 2.50
      }
    ],
    totalCredit: 12.00
  };

  const gradingSystem = [
    { marks: '80-100', grade: 'A+', gradePoint: '4.00', remarks: 'Outstanding' },
    { marks: '75-79', grade: 'A', gradePoint: '3.75', remarks: 'Excellent' },
    { marks: '70-74', grade: 'A-', gradePoint: '3.50', remarks: 'Very Good' },
    { marks: '65-69', grade: 'B+', gradePoint: '3.25', remarks: 'Good' },
    { marks: '60-64', grade: 'B', gradePoint: '3.00', remarks: 'Satisfactory' },
    { marks: '55-59', grade: 'B-', gradePoint: '2.75', remarks: 'Above Average' },
    { marks: '50-54', grade: 'C+', gradePoint: '2.50', remarks: 'Average' },
    { marks: '45-49', grade: 'C', gradePoint: '2.25', remarks: 'Below Average' },
    { marks: '40-44', grade: 'D', gradePoint: '2.00', remarks: 'Pass' },
    { marks: '00-39', grade: 'F', gradePoint: '0.00', remarks: 'Fail' }
  ];

  const semesters = [
    'Spring 2025, 251',
    'Fall 2024, 241',
    'Spring 2024, 242',
    'Fall 2023, 231',
    'Spring 2023, 232'
  ];

  useEffect(() => {
    // Load result data when component mounts
    setResultData(mockResultData);
  }, []);

  const handleSemesterChange = (semester) => {
    setSelectedSemester(semester);
    // Here you would typically make an API call to fetch result for the selected semester
    // For now, we'll just use the mock data
  };

  const getGradeColor = (grade) => {
    if (grade === 'A+' || grade === 'A') return 'text-green-600';
    if (grade === 'A-' || grade === 'B+') return 'text-blue-600';
    if (grade === 'B' || grade === 'B-') return 'text-yellow-600';
    if (grade === 'C+' || grade === 'C') return 'text-orange-600';
    if (grade === 'D') return 'text-red-500';
    if (grade === 'F') return 'text-red-700';
    return 'text-gray-600';
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Academic Result</h1>
        <p className="text-gray-600">View your semester-wise academic performance</p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Semester
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => handleSemesterChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {semesters.map((semester) => (
                <option key={semester} value={semester}>
                  {semester}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Student Information Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-2">
              {resultData?.studentName || 'Student Name'}
            </p>
            <p className="text-gray-600">{resultData?.program}</p>
            <p className="text-gray-600">Batch: {resultData?.batch}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">Student ID: {resultData?.studentId}</p>
            <p className="text-gray-600">Reg ID: {resultData?.regId}</p>
            <p className="text-lg font-semibold text-blue-600">
              SGPA of {resultData?.semester}: {resultData?.sgpa}
            </p>
          </div>
        </div>
      </div>

      {/* UGC Uniform Grading System */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">UGC Uniform Grading System</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left font-medium">Marks (%)</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-medium">Grade</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-medium">Grade Point</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-medium">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {gradingSystem.map((grade, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-300 px-4 py-2">{grade.marks}</td>
                  <td className="border border-gray-300 px-4 py-2 font-medium">{grade.grade}</td>
                  <td className="border border-gray-300 px-4 py-2">{grade.gradePoint}</td>
                  <td className="border border-gray-300 px-4 py-2">{grade.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600 mt-2">Effective from Summer Semester 2007</p>
      </div>

      {/* Result Table */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Result of {resultData?.semester}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left font-medium">SL</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-medium">Course Code</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-medium">Course Title</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-medium">Credit</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-medium">Grade</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-medium">Grade Point</th>
              </tr>
            </thead>
            <tbody>
              {resultData?.courses?.map((course) => (
                <tr key={course.sl} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{course.sl}</td>
                  <td className="border border-gray-300 px-4 py-2 font-medium">{course.courseCode}</td>
                  <td className="border border-gray-300 px-4 py-2">{course.courseTitle}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{course.credit}</td>
                  <td className={`border border-gray-300 px-4 py-2 text-center font-bold ${getGradeColor(course.grade)}`}>
                    {course.grade}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{course.gradePoint}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-blue-50 font-semibold">
                <td colSpan="3" className="border border-gray-300 px-4 py-2 text-right">
                  Total Credit:
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {resultData?.totalCredit}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  SGPA:
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center font-bold text-blue-600">
                  {resultData?.sgpa}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Important Note */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700 text-sm">
          <strong>N.B.:</strong> If you see Teaching Evaluation Pending in any course. Please complete Teaching Evaluation.
        </p>
      </div>
    </div>
  );
};

export default Result; 