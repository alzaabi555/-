import React, { useState, useRef } from 'react';
import readXlsxFile from 'read-excel-file';
import { ImportedStudent } from '../types';
import { Search, Upload, Trash2, Users, ChevronLeft, ChevronRight, Phone, FilePlus } from 'lucide-react';

interface Props {
  students: ImportedStudent[];
  setStudents: (students: ImportedStudent[] | ((prev: ImportedStudent[]) => ImportedStudent[])) => void;
}

const ITEMS_PER_PAGE = 20;

const StudentsPage: React.FC<Props> = ({ students, setStudents }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredStudents = students.filter(s => 
    s.name.includes(searchTerm) || s.grade.includes(searchTerm) || (s.guardianPhone && s.guardianPhone.includes(searchTerm))
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    let totalNewStudents: ImportedStudent[] = [];
    let successFiles = 0;
    let errorFiles = 0;

    const promises = Array.from(files).map(async (file: File) => {
        try {
            const rows = await readXlsxFile(file);
            const fileStudents: ImportedStudent[] = [];
            
            rows.forEach((row, index) => {
                // Skip header row if it looks like a header
                if (index === 0 && (row[0] === 'الاسم' || row[0] === 'Name')) return;

                const name = row[0]?.toString().trim();
                const grade = row[1]?.toString().trim();
                const phone = row[2]?.toString().trim(); // Column 3 for Phone

                if (name && name.length > 2) {
                    fileStudents.push({ 
                        name, 
                        grade: grade || '',
                        guardianPhone: phone || '' 
                    });
                }
            });

            if (fileStudents.length > 0) {
                successFiles++;
                return fileStudents;
            }
        } catch (err) {
            console.error(`Error reading file ${file.name}:`, err);
            errorFiles++;
        }
        return [];
    });

    try {
        const results = await Promise.all(promises);
        results.forEach(batch => {
            totalNewStudents = [...totalNewStudents, ...batch];
        });

        if (totalNewStudents.length > 0) {
            setStudents(prev => [...prev, ...totalNewStudents]);
            alert(`تمت العملية بنجاح:\n- تم استيراد ${totalNewStudents.length} طالب.\n- من ${successFiles} ملفات.\n${errorFiles > 0 ? `- فشل قراءة ${errorFiles} ملفات.` : ''}`);
        } else {
            alert('لم يتم العثور على بيانات صالحة في الملفات المحددة.');
        }
    } catch (error) {
        console.error("Batch import error:", error);
        alert("حدث خطأ غير متوقع أثناء المعالجة.");
    } finally {
        setIsProcessing(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const clearAll = () => {
    if (confirm('هل أنت متأكد من حذف جميع بيانات الطلاب؟')) {
        setStudents([]);
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-gray-50 w-full">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                        <Users size={32} />
                    </div>
                    قاعدة بيانات الطلاب
                </h1>
                <p className="text-gray-500 mt-2 mr-14">إدارة أسماء الطلاب وفصولهم لاستخدامها في النماذج</p>
            </div>

            <div className="flex gap-3">
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    className="hidden" 
                    accept=".xlsx, .xls"
                    multiple // Allow multiple files
                />
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className={`flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 font-bold ${isProcessing ? 'opacity-70 cursor-wait' : ''}`}
                >
                    {isProcessing ? (
                        <span className="animate-pulse">جاري المعالجة...</span>
                    ) : (
                        <>
                            <FilePlus size={20} />
                            <span>استيراد ملفات Excel</span>
                        </>
                    )}
                </button>
                
                {students.length > 0 && (
                    <button 
                        onClick={clearAll}
                        className="flex items-center gap-2 bg-white text-red-600 px-5 py-2.5 rounded-xl border border-red-200 hover:bg-red-50 hover:border-red-300 shadow-sm transition-all duration-200 font-bold"
                    >
                        <Trash2 size={20} />
                        <span>حذف الكل</span>
                    </button>
                )}
            </div>
        </div>

        {/* Search & Stats */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-6 flex justify-between items-center">
            <div className="relative w-full max-w-lg">
                <input 
                    type="text" 
                    placeholder="بحث عن طالب، صف، أو رقم هاتف..." 
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // Reset to first page on search
                    }}
                />
                <Search className="absolute right-4 top-3.5 text-gray-400" size={20} />
            </div>
            <div className="text-gray-600 font-medium bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                العدد الكلي: <span className="text-blue-700 font-bold text-lg">{students.length}</span> طالب
            </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
            <table className="w-full text-right">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="py-4 px-6 text-sm font-bold text-gray-700">#</th>
                        <th className="py-4 px-6 text-sm font-bold text-gray-700">اسم الطالب</th>
                        <th className="py-4 px-6 text-sm font-bold text-gray-700">الصف / الشعبة</th>
                        <th className="py-4 px-6 text-sm font-bold text-gray-700">هاتف ولي الأمر</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {paginatedStudents.length > 0 ? (
                        paginatedStudents.map((student, index) => (
                            <tr key={index} className="hover:bg-blue-50/50 transition duration-150">
                                <td className="py-4 px-6 text-gray-500 font-mono">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                                <td className="py-4 px-6 font-bold text-gray-800">{student.name}</td>
                                <td className="py-4 px-6 text-gray-600">
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-bold shadow-sm">
                                        {student.grade}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-gray-600 font-mono text-sm">
                                    {student.guardianPhone ? (
                                        <span className="flex items-center gap-2 bg-gray-50 w-fit px-2 py-1 rounded text-gray-700">
                                            <Phone size={14} className="text-gray-400" />
                                            {student.guardianPhone}
                                        </span>
                                    ) : (
                                        <span className="text-gray-300">-</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="py-16 text-center text-gray-500">
                                {students.length === 0 
                                    ? <div className="flex flex-col items-center gap-2"><FilePlus className="text-gray-300" size={48} /><p>لا توجد بيانات. قم باستيراد ملفات Excel لبدء العمل.</p></div> 
                                    : "لا توجد نتائج مطابقة للبحث."}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 gap-4">
                <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2.5 border border-gray-300 rounded-lg hover:bg-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none bg-gray-50 transition-all"
                >
                    <ChevronRight size={20} className="text-gray-600" />
                </button>
                
                <span className="text-sm font-bold text-gray-700 bg-white px-4 py-2 rounded-lg shadow-sm border">
                    صفحة {currentPage} من {totalPages}
                </span>

                <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2.5 border border-gray-300 rounded-lg hover:bg-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none bg-gray-50 transition-all"
                >
                    <ChevronLeft size={20} className="text-gray-600" />
                </button>
            </div>
        )}
        
        <div className="mt-6 text-xs text-gray-400 text-center bg-yellow-50 p-3 rounded-lg border border-yellow-100 max-w-2xl mx-auto">
            <span className="font-bold text-yellow-700">ملاحظة:</span> تنسيق Excel المطلوب: العمود الأول (الاسم)، العمود الثاني (الصف)، العمود الثالث (هاتف ولي الأمر).
            <br />
            يمكنك تحديد أكثر من ملف في وقت واحد.
        </div>
      </div>
    </div>
  );
};

export default StudentsPage;