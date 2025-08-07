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
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingResult ? 'Loading...' : 'Search'}
            </button>
          </div>
        </div>
      </div>

      {/* Initial Loading State */}
      {isLoading && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
            <p className="text-gray-600">Loading available semesters...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-sm">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </p>
        </div>
      )}

      {/* Student Information Card */}
      {resultData && !isLoadingResult && (
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
      )}

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

      {/* Result Loading State */}
      {isLoadingResult && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
            <p className="text-gray-600">Loading result data...</p>
          </div>
        </div>
      )}

      {/* Result Table */}
      {resultData && !isLoadingResult && (
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
      )}

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