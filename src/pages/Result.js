import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import studentService from '../services/paymentService';

const Result = () => {
  const [selectedSemester, setSelectedSemester] = useState('');
  const [resultData, setResultData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingResult, setIsLoadingResult] = useState(false);
  const [error, setError] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [activeTab, setActiveTab] = useState('result');
  const [showGradingSystem, setShowGradingSystem] = useState(false);
  const userInfo = authService.getUserInfo();

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

  // Fetch available semesters when component mounts
  useEffect(() => {
    const fetchAvailableSemesters = async () => {
      if (!userInfo?.studentId) {
        setError('No student ID available');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await studentService.getAvailableSemesters(userInfo.studentId);
        
        if (result.success) {
          // Handle both array and object formats
          const semesterData = Array.isArray(result.data) ? result.data : [result.data];
          setSemesters(semesterData);
          // Auto-select first semester if available
          if (semesterData.length > 0) {
            setSelectedSemester(semesterData[0].id);
          }
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError('Failed to fetch available semesters');
        console.error('Semester fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableSemesters();
  }, [userInfo?.studentId]);

  // Fetch result data when semester changes
  useEffect(() => {
    if (selectedSemester && userInfo?.studentId) {
      fetchResultData();
    }
  }, [selectedSemester, userInfo?.studentId]);

  const fetchResultData = async () => {
    if (!userInfo?.studentId || !selectedSemester) return;

    setIsLoadingResult(true);
    setError(null);

    try {
      const result = await studentService.getStudentResult(userInfo.studentId, selectedSemester);
      
      if (result.success) {
        // Handle array of courses format
        const courses = Array.isArray(result.data) ? result.data : [result.data];
        
        // Create a result object with the courses
        const resultData = {
          studentName: userInfo?.studentName || 'Student',
          studentId: userInfo?.studentId,
          program: 'B.Sc. in Computer Science & Engineering', // You might want to get this from another API
          batch: '64', // You might want to get this from another API
          sgpa: calculateSGPA(courses),
          semester: `Semester ${selectedSemester}`,
          courses: courses.map((course, index) => ({
            sl: index + 1,
            courseCode: course.course_code,
            courseTitle: course.course_title,
            credit: course.credit,
            grade: course.grade,
            gradePoint: course.grade_point
          })),
          totalCredit: courses.reduce((sum, course) => sum + course.credit, 0)
        };
        
        setResultData(resultData);
      } else {
        setError(result.message);
        setResultData(null);
      }
    } catch (err) {
      setError('Failed to fetch result data');
      console.error('Result fetch error:', err);
      setResultData(null);
    } finally {
      setIsLoadingResult(false);
    }
  };

  const handleSemesterChange = (semesterId) => {
    setSelectedSemester(semesterId);
  };

  const calculateSGPA = (courses) => {
    if (!courses || courses.length === 0) return '0.00';
    
    const totalPoints = courses.reduce((sum, course) => {
      return sum + (course.grade_point * course.credit);
    }, 0);
    
    const totalCredits = courses.reduce((sum, course) => {
      return sum + course.credit;
    }, 0);
    
    if (totalCredits === 0) return '0.00';
    
    return (totalPoints / totalCredits).toFixed(2);
  };

  const getGradeColor = (grade) => {
    if (grade === 'A+' || grade === 'A') return 'text-green-600 bg-green-50';
    if (grade === 'A-' || grade === 'B+') return 'text-blue-600 bg-blue-50';
    if (grade === 'B' || grade === 'B-') return 'text-yellow-600 bg-yellow-50';
    if (grade === 'C+' || grade === 'C') return 'text-orange-600 bg-orange-50';
    if (grade === 'D') return 'text-red-500 bg-red-50';
    if (grade === 'F') return 'text-red-700 bg-red-100';
    return 'text-gray-600 bg-gray-50';
  };

  const getSGPAStatus = (sgpa) => {
    const num = parseFloat(sgpa);
    if (num >= 3.75) return { status: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (num >= 3.50) return { status: 'Very Good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (num >= 3.25) return { status: 'Good', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (num >= 3.00) return { status: 'Satisfactory', color: 'text-orange-600', bg: 'bg-orange-50' };
    if (num >= 2.00) return { status: 'Pass', color: 'text-red-500', bg: 'bg-red-50' };
    return { status: 'Needs Improvement', color: 'text-red-700', bg: 'bg-red-100' };
  };

  const sgpaStatus = resultData ? getSGPAStatus(resultData.sgpa) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      {/* Page Header with Animation */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Academic Result
            </h1>
            <p className="text-gray-600 mt-1">View your semester-wise academic performance</p>
          </div>
        </div>
      </div>

      {/* Interactive Search Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 transform hover:scale-[1.02] transition-all duration-300 border border-gray-100">
        <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6">
          <div className="flex-1 w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Select Semester
              </span>
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => handleSemesterChange(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
            >
              {semesters.map((semester) => (
                <option key={semester.id} value={semester.id}>
                  {semester.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button 
              onClick={fetchResultData}
              disabled={isLoadingResult}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2"
            >
              {isLoadingResult ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Search Result</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading States with Better Animation */}
      {isLoading && (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-center py-12">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 animate-spin" style={{ animationDelay: '0.5s' }}></div>
            </div>
            <div className="ml-6">
              <p className="text-lg font-semibold text-gray-700">Loading available semesters...</p>
              <p className="text-gray-500">Please wait while we fetch your data</p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Error State */}
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

      {/* Enhanced Student Information Card */}
      {resultData && !isLoadingResult && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-xl p-8 mb-8 border border-blue-100">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mr-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Student Information</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Info</h3>
              <p className="text-2xl font-bold text-gray-900 mb-2">
                {resultData?.studentName || 'Student Name'}
              </p>
              <p className="text-gray-600">{resultData?.program}</p>
              <p className="text-gray-600">Batch: {resultData?.batch}</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Academic Details</h3>
              <p className="text-gray-600">Student ID: {resultData?.studentId}</p>
              <p className="text-gray-600">Reg ID: {resultData?.regId}</p>
              <p className="text-gray-600">{resultData?.semester}</p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <h3 className="text-lg font-semibold mb-3">Performance</h3>
              <div className="text-center">
                <p className="text-3xl font-bold mb-2">{resultData?.sgpa}</p>
                <p className="text-lg">SGPA</p>
                {sgpaStatus && (
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${sgpaStatus.bg} ${sgpaStatus.color}`}>
                    {sgpaStatus.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Tabs */}
      <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('result')}
            className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-300 ${
              activeTab === 'result'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Result Details
            </span>
          </button>
          <button
            onClick={() => setActiveTab('grading')}
            className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-300 ${
              activeTab === 'grading'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Grading System
            </span>
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'result' && (
            <>
              {/* Result Loading State */}
              {isLoadingResult && (
                <div className="flex items-center justify-center py-12">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 animate-spin" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                  <div className="ml-6">
                    <p className="text-lg font-semibold text-gray-700">Loading result data...</p>
                    <p className="text-gray-500">Please wait while we fetch your results</p>
                  </div>
                </div>
              )}

              {/* Enhanced Result Table */}
              {resultData && !isLoadingResult && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Result of {resultData?.semester}
                  </h2>
                  <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-lg">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                          <th className="px-6 py-4 text-left font-semibold">SL</th>
                          <th className="px-6 py-4 text-left font-semibold">Course Code</th>
                          <th className="px-6 py-4 text-left font-semibold">Course Title</th>
                          <th className="px-6 py-4 text-center font-semibold">Credit</th>
                          <th className="px-6 py-4 text-center font-semibold">Grade</th>
                          <th className="px-6 py-4 text-center font-semibold">Grade Point</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resultData?.courses?.map((course, index) => (
                          <tr 
                            key={course.sl} 
                            className={`hover:bg-gray-50 transition-colors duration-200 ${
                              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }`}
                          >
                            <td className="px-6 py-4 font-medium text-gray-900">{course.sl}</td>
                            <td className="px-6 py-4 font-semibold text-blue-600">{course.courseCode}</td>
                            <td className="px-6 py-4 text-gray-700">{course.courseTitle}</td>
                            <td className="px-6 py-4 text-center font-medium">{course.credit}</td>
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-block px-3 py-1 rounded-full font-bold text-sm ${getGradeColor(course.grade)}`}>
                                {course.grade}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center font-semibold">{course.gradePoint}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gradient-to-r from-gray-100 to-gray-200 font-bold">
                          <td colSpan="3" className="px-6 py-4 text-right text-gray-700">
                            Total Credit:
                          </td>
                          <td className="px-6 py-4 text-center text-gray-700">
                            {resultData?.totalCredit}
                          </td>
                          <td className="px-6 py-4 text-center text-gray-700">
                            SGPA:
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold">
                              {resultData?.sgpa}
                            </span>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'grading' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                UGC Uniform Grading System
              </h2>
              <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-lg">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                      <th className="px-6 py-4 text-left font-semibold">Marks (%)</th>
                      <th className="px-6 py-4 text-left font-semibold">Grade</th>
                      <th className="px-6 py-4 text-left font-semibold">Grade Point</th>
                      <th className="px-6 py-4 text-left font-semibold">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gradingSystem.map((grade, index) => (
                      <tr 
                        key={index} 
                        className={`hover:bg-gray-50 transition-colors duration-200 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="px-6 py-4 font-medium">{grade.marks}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full font-bold text-sm ${getGradeColor(grade.grade)}`}>
                            {grade.grade}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold">{grade.gradePoint}</td>
                        <td className="px-6 py-4 text-gray-700">{grade.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-gray-600 mt-4 italic">Effective from Summer Semester 2007</p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Important Note */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-xl p-6 shadow-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-red-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-red-700 font-semibold">
              <strong>Important Notice:</strong> If you see Teaching Evaluation Pending in any course, please complete the Teaching Evaluation.
            </p>
            <p className="text-red-600 text-sm mt-2">
              This is mandatory for accessing your complete academic records.
            </p>
          </div>
        </div>
      </div>

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

export default Result;