import React, { useState } from 'react';
import { ArchiveRecord, FORM_TITLES, FormType } from '../types';
import { Search, Trash2, Eye, History, FileText, Calendar, Filter } from 'lucide-react';

interface Props {
  records: ArchiveRecord[];
  onDelete: (id: string) => void;
  onRestore: (record: ArchiveRecord) => void;
}

const RecordsPage: React.FC<Props> = ({ records, onDelete, onRestore }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Filter Logic
  const filteredRecords = records.filter(r => {
    const matchesSearch = 
        r.studentName.includes(searchTerm) || 
        r.grade.includes(searchTerm) || 
        r.data.civilId.includes(searchTerm);
    
    const matchesType = filterType === 'all' || r.formType === filterType;

    return matchesSearch && matchesType;
  }).sort((a, b) => b.timestamp - a.timestamp); // Newest first

  return (
    <div className="p-8 h-full overflow-y-auto bg-gray-50 w-full">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200">
                <History className="text-blue-600" size={32} />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-gray-800">سجل المخالفات والإجراءات</h1>
                <p className="text-gray-500 mt-1">أرشيف كامل لجميع الاستمارات التي تم إصدارها للطلاب</p>
            </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <input 
                    type="text" 
                    placeholder="بحث باسم الطالب، الصف، أو الرقم المدني..." 
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-4 top-3.5 text-gray-400" size={20} />
            </div>
            
            <div className="relative min-w-[280px]">
                <select 
                    value={filterType} 
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full pl-12 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white cursor-pointer"
                >
                    <option value="all">جميع أنواع النماذج</option>
                    {Object.entries(FORM_TITLES).map(([key, title]) => (
                        <option key={key} value={key}>{title}</option>
                    ))}
                </select>
                <Filter className="absolute right-4 top-3.5 text-gray-400" size={20} />
            </div>
        </div>

        {/* Records Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
            <table className="w-full text-right">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="py-4 px-6 text-sm font-bold text-gray-700">التاريخ</th>
                        <th className="py-4 px-6 text-sm font-bold text-gray-700">اسم الطالب</th>
                        <th className="py-4 px-6 text-sm font-bold text-gray-700">نوع الإجراء</th>
                        <th className="py-4 px-6 text-sm font-bold text-gray-700">ملخص السبب</th>
                        <th className="py-4 px-6 text-sm font-bold text-gray-700">خيارات</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredRecords.length > 0 ? (
                        filteredRecords.map((record) => (
                            <tr key={record.id} className="hover:bg-blue-50/50 transition duration-150 group">
                                <td className="py-4 px-6 text-gray-600 font-mono text-sm whitespace-nowrap">
                                    <div className="flex items-center gap-2 font-medium">
                                        <Calendar size={14} className="text-gray-400" />
                                        {new Date(record.timestamp).toLocaleDateString('en-GB')}
                                    </div>
                                    <div className="text-xs text-gray-400 mr-6 mt-1">
                                        {new Date(record.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{record.studentName}</div>
                                    <div className="text-xs text-gray-500 bg-gray-100 inline-block px-2 py-0.5 rounded mt-1 border border-gray-200">
                                        {record.grade}
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-gray-700">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                                        record.formType.includes('annex') 
                                            ? 'bg-red-50 text-red-700 border-red-100' 
                                            : 'bg-blue-50 text-blue-700 border-blue-100'
                                    }`}>
                                        <FileText size={12} />
                                        {FORM_TITLES[record.formType]}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-600 max-w-xs truncate">
                                    {record.details || '-'}
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => onRestore(record)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 rounded-lg transition-all shadow-sm text-xs font-bold"
                                            title="عرض / طباعة"
                                        >
                                            <Eye size={14} />
                                            <span>عرض</span>
                                        </button>
                                        <button 
                                            onClick={() => onDelete(record.id)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-200 rounded-lg transition-all shadow-sm text-xs font-bold"
                                            title="حذف من السجل"
                                        >
                                            <Trash2 size={14} />
                                            <span>حذف</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="py-20 text-center text-gray-500">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="bg-gray-100 p-4 rounded-full">
                                        <History size={32} className="text-gray-400" />
                                    </div>
                                    <p className="font-medium text-lg">لا توجد سجلات محفوظة.</p>
                                    <p className="text-sm text-gray-400">قم بحفظ الاستمارات عند إصدارها لتظهر هنا.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default RecordsPage;