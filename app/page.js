import React, { useState, useMemo } from 'react';
import { Search, Award, TrendingUp } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';

const StudentDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // PASTE YOUR CSV DATA HERE - Just copy all rows from Excel/Sheets
  const csvData = `10/17/2025 19:56:13,simransahoo.95@gmail.com,Simran Sahoo,Aryan Choksi,4 - Good,5 - Excellent,3 - Average,4 - Good,4 - Good,4 - Good,Average - Needs practice in key areas,Aryan has a good and go to attitude that makes him seem like a goal oriented person. A good quality to have in the corporate. There is a need to work on structuring the answers and having clarity of thought.
10/17/2025 20:01:19,simransahoo.95@gmail.com,Simran Sahoo,Akansha Marwah,4 - Good,4 - Good,3 - Average,3 - Average,3 - Average,4 - Good,Average - Needs practice in key areas,Akansha has got content but needs to know how to sell it. Being in the IMCC, her own CV cannot have flaws which need to be looked into. Subject matter knowledge needs to be brushed upon not a strong forte as of now. A lot of fillers are being used while speaking making her sound verbose.`;

  // Parse CSV and convert to data
  const parseRating = (ratingStr) => {
    const match = ratingStr.match(/^(\d+)/);
    return match ? parseInt(match[1]) : 3;
  };

  const studentsData = useMemo(() => {
    return csvData.trim().split('\n').map(row => {
      const cols = row.split(',');
      return {
        timestamp: cols[0],
        email: cols[1],
        panelistName: cols[2],
        studentName: cols[3],
        communication: parseRating(cols[4]),
        bodyLanguage: parseRating(cols[5]),
        domainKnowledge: parseRating(cols[6]),
        analyticalThinking: parseRating(cols[7]),
        leadership: parseRating(cols[8]),
        culturalFit: parseRating(cols[9]),
        overall: cols[10],
        feedback: cols.slice(11).join(',')
      };
    });
  }, [csvData]);

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return [];
    return studentsData.filter(student =>
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, studentsData]);

  const getChartData = (student) => [
    { skill: 'Communication', value: student.communication, fullMark: 5 },
    { skill: 'Body Language', value: student.bodyLanguage, fullMark: 5 },
    { skill: 'Domain Knowledge', value: student.domainKnowledge, fullMark: 5 },
    { skill: 'Analytical Thinking', value: student.analyticalThinking, fullMark: 5 },
    { skill: 'Leadership', value: student.leadership, fullMark: 5 },
    { skill: 'Cultural Fit', value: student.culturalFit, fullMark: 5 }
  ];

  const getAverageScore = (student) => {
    const total = student.communication + student.bodyLanguage + 
                  student.domainKnowledge + student.analyticalThinking + 
                  student.leadership + student.culturalFit;
    return (total / 6).toFixed(1);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-blue-600';
    if (rating >= 2.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Career Mentorship Program 8.0
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Student Performance Dashboard
              </p>
            </div>
            <Award className="h-12 w-12 text-indigo-600" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for a student by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </div>
          
          {/* Search Results Dropdown */}
          {searchTerm && filteredStudents.length > 0 && (
            <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
              {filteredStudents.map((student, idx) => (
                <button
                  key={idx}
                  onClick={() => handleStudentSelect(student)}
                  className="w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <p className="font-semibold text-gray-900">{student.studentName}</p>
                  <p className="text-sm text-gray-500">
                    Average Score: {getAverageScore(student)}/5.0 • Evaluated by {student.panelistName}
                  </p>
                </button>
              ))}
            </div>
          )}

          {searchTerm && filteredStudents.length === 0 && (
            <div className="mt-2 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-500">No students found matching "{searchTerm}"</p>
            </div>
          )}
        </div>

        {/* Student Details */}
        {selectedStudent ? (
          <div className="space-y-6">
            {/* Student Header Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {selectedStudent.studentName}
                  </h2>
                  <p className="text-sm text-gray-500 mt-2">
                    Evaluated by: <span className="font-medium">{selectedStudent.panelistName}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {selectedStudent.timestamp}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-bold ${getRatingColor(parseFloat(getAverageScore(selectedStudent)))}`}>
                    {getAverageScore(selectedStudent)}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Average Score</p>
                  <div className="flex items-center justify-end mt-2 text-xs text-gray-400">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    out of 5.0
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Performance Metrics
              </h3>
              <ResponsiveContainer width="100%" height={450}>
                <RadarChart data={getChartData(selectedStudent)}>
                  <PolarGrid stroke="#e5e7eb" strokeWidth={1.5} />
                  <PolarAngleAxis 
                    dataKey="skill" 
                    tick={{ fill: '#374151', fontSize: 13, fontWeight: 500 }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 5]} 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    tickCount={6}
                  />
                  <Radar
                    name="Rating"
                    dataKey="value"
                    stroke="#4f46e5"
                    fill="#4f46e5"
                    fillOpacity={0.5}
                    strokeWidth={2}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                </RadarChart>
              </ResponsiveContainer>

              {/* Rating Breakdown */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                {getChartData(selectedStudent).map((item, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">{item.skill}</p>
                    <p className={`text-2xl font-bold ${getRatingColor(item.value)}`}>
                      {item.value}/5
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Overall Performance */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Overall Interview Performance
              </h3>
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-indigo-600 p-5 rounded-lg">
                <p className="text-indigo-900 font-medium text-lg">
                  {selectedStudent.overall}
                </p>
              </div>
            </div>

            {/* Feedback */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Qualitative Feedback & Comments
              </h3>
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <p className="text-gray-700 leading-relaxed text-base">
                  {selectedStudent.feedback}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Search for a Student
            </h3>
            <p className="text-gray-500">
              Use the search bar above to find and view student performance data
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;