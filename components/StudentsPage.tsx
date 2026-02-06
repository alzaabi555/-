import React, { useState, useRef } from 'react';
import readXlsxFile from 'read-excel-file';
import { ImportedStudent } from '../types';
import { Search, Upload, Trash2, Users, ChevronLeft, ChevronRight, Phone, FilePlus, Database, UserCheck, GraduationCap } from 'lucide-react';

interface Props {
  students: ImportedStudent[];
  setStudents: (students: ImportedStudent[] | ((prev: ImportedStudent[]) => ImportedStudent[])) => void;
}

const ITEMS_PER_PAGE = 15;

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
                if (index === 0 && (row[0] === 'الاسم' || row[0] === 'Name')) return; // Skip header

                const name = row[0]?.toString().trim();
                const grade = row[1]?.toString().trim();
                const phone = row[2]?.toString().trim();

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
            alert(`✅ تم استيراد ${totalNewStudents.length} طالب بنجاح.`);
        } else {
            alert('⚠️ لم يتم العثور على بيانات صالحة.');
        }
    } catch (error) {
        console.error("Batch import error:", error);
        alert("حدث خطأ غير متوقع.");
    } finally {
        setIsProcessing(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const clearAll = () => {
    if (confirm('⚠️ تحذير: هل أنت متأكد من حذف قاعدة البيانات بالكامل؟ لا يمكن التراجع عن هذا الإجراء.')) {
        setStudents([]);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 w-full font-sans p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section with Stats */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-6">
            <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight flex items-center gap-4">
                    <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-200 text-white">
                        <Database size={32} />
                    </div>
                    <span>قاعدة بيانات الطلاب</span>
                </h1>
                <p className="text-slate-500 mt-3 text-lg font-medium mr-20">إدارة مركزية لبيانات الطلاب لاستخدامها في النماذج</p>
            </div>

            <div className="flex gap-4">
                <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center min-w-[140px]">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">إجمالي الطلاب</span>
                    <span className="text-3xl font-black text-slate-800">{students.length.toLocaleString()}</span>
                </div>
            </div>
        </div>

        {/* Controls Card */}
        <div className="bg-white p-5 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full group">
                <input 
                    type="text" 
                    placeholder="ابحث عن اسم، صف، أو رقم هاتف..." 
                    className="w-full pl-10 pr-12 py-4 bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all duration-300 text-slate-700 font-bold placeholder-slate-400"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={22} />
            </div>

            <div className="flex gap-3 w-full lg:w-auto">
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".xlsx, .xls" multiple />
                
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl shadow-lg shadow-slate-900/20 transition-all duration-300 transform hover:-translate-y-1 font-bold"
                >
                    {isProcessing ? <span className="animate-pulse">جاري المعالجة...</span> : <><FilePlus size={20} /><span>استيراد Excel</span></>}
                </button>
                
                {students.length > 0 && (
                    <button 
                        onClick={clearAll}
                        className="flex-none flex items-center justify-center gap-2 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 px-6 py-4 rounded-2xl transition-all duration-300 font-bold"
                        title="حذف الكل"
                    >
                        <Trash2 size={20} />
                    </button>
                )}
            </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-sm uppercase tracking-wider">
                            <th className="py-6 px-8 font-bold">#</th>
                            <th className="py-6 px-8 font-bold">الاسم</th>
                            <th className="py-6 px-8 font-bold">الصف</th>
                            <th className="py-6 px-8 font-bold">ولي الأمر</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {paginatedStudents.length > 0 ? (
                            paginatedStudents.map((student, index) => (
                                <tr key={index} className="hover:bg-indigo-50/40 transition-colors duration-200 group">
                                    <td className="py-5 px-8 text-slate-400 font-mono text-sm group-hover:text-indigo-500">
                                        {((currentPage - 1) * ITEMS_PER_PAGE + index + 1).toString().padStart(3, '0')}
                                    </td>
                                    <td className="py-5 px-8 font-bold text-slate-800 text-lg group-hover:text-indigo-900">
                                        {student.name}
                                    </td>
                                    <td className="py-5 px-8">
                                        <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 text-sm px-3 py-1 rounded-lg font-bold group-hover:bg-white group-hover:shadow-md transition-all">
                                            <GraduationCap size={14} />
                                            {student.grade}
                                        </span>
                                    </td>
                                    <td className="py-5 px-8">
                                        {student.guardianPhone ? (
                                            <span className="inline-flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg text-sm font-mono font-bold border border-emerald-100">
                                                <Phone size={14} />
                                                <span dir="ltr">{student.guardianPhone}</span>
                                            </span>
                                        ) : (
                                            <span className="text-slate-300 text-xs italic">--</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-4 opacity-50">
                                        <Database size={64} className="text-slate-300" />
                                        <p className="text-xl font-bold text-slate-400">لا توجد بيانات</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="bg-slate-50 px-8 py-5 border-t border-slate-100 flex justify-between items-center">
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight size={20} /> السابق
                    </button>
                    <span className="bg-white px-4 py-1 rounded-lg shadow-sm text-sm font-bold text-slate-700 border border-slate-200">
                        {currentPage} / {totalPages}
                    </span>
                    <button 
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        التالي <ChevronLeft size={20} />
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default StudentsPage;