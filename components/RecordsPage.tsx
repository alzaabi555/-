import React, { useState } from 'react';
import { ArchiveRecord, FORM_TITLES, FormType } from '../types';
import { Search, Trash2, Eye, History, FileText, Calendar, Filter, Archive } from 'lucide-react';

interface Props {
  records: ArchiveRecord[];
  onDelete: (id: string) => void;
  onRestore: (record: ArchiveRecord) => void;
}

const RecordsPage: React.FC<Props> = ({ records, onDelete, onRestore }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredRecords = records.filter(r => {
    const matchesSearch = 
        r.studentName.includes(searchTerm) || 
        r.grade.includes(searchTerm) || 
        r.data.civilId.includes(searchTerm);
    const matchesType = filterType === 'all' || r.formType === filterType;
    return matchesSearch && matchesType;
  }).sort((a, b) => b.timestamp - a.timestamp);

  const getBadgeStyle = (type: FormType) => {
      if (type.includes('invitation')) return 'bg-blue-50 text-blue-700 border-blue-200';
      if (type.includes('pledge')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      if (type === FormType.ANNEX_14_SUSPENSION) return 'bg-rose-50 text-rose-700 border-rose-200';
      return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 w-full p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-6">
            <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight flex items-center gap-4">
                    <div className="bg-emerald-600 p-3 rounded-2xl shadow-lg shadow-emerald-200 text-white">
                        <History size={32} />
                    </div>
                    <span>سجل الإجراءات</span>
                </h1>
                <p className="text-slate-500 mt-3 text-lg font-medium mr-20">الأرشيف الرقمي للمخالفات والمراسلات الصادرة</p>
            </div>
            
            <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center min-w-[140px]">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">إجمالي السجلات</span>
                <span className="text-3xl font-black text-slate-800">{records.length}</span>
            </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-5 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
                <input 
                    type="text" 
                    placeholder="بحث في السجل (اسم، صف، رقم مدني)..." 
                    className="w-full pl-10 pr-12 py-3.5 bg-slate-50 border-2 border-slate-100 focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all duration-300 text-slate-700 font-bold placeholder-slate-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
            </div>
            
            <div className="relative min-w-[250px]">
                <select 
                    value={filterType} 
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full pl-10 pr-10 py-3.5 bg-slate-50 border-2 border-slate-100 focus:border-emerald-500 focus:bg-white rounded-2xl outline-none appearance-none cursor-pointer font-bold text-slate-700 transition-all duration-300"
                >
                    <option value="all">كل النماذج</option>
                    {Object.entries(FORM_TITLES).map(([key, title]) => (
                        <option key={key} value={key}>{title}</option>
                    ))}
                </select>
                <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>
        </div>

        {/* Cards / List View */}
        <div className="space-y-3">
            {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                    <div 
                        key={record.id} 
                        className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-emerald-200 transition-all duration-200 flex flex-col md:flex-row items-start md:items-center gap-6 group"
                    >
                        {/* Date Block */}
                        <div className="flex md:flex-col items-center gap-2 md:gap-0 bg-slate-50 px-4 py-2 rounded-xl min-w-[100px] text-center border border-slate-100">
                            <span className="text-xl font-black text-slate-700 font-mono">{new Date(record.timestamp).getDate()}</span>
                            <span className="text-xs font-bold text-slate-400 uppercase">{new Date(record.timestamp).toLocaleString('en-US', { month: 'short', year: 'numeric' })}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getBadgeStyle(record.formType)}`}>
                                    {FORM_TITLES[record.formType]}
                                </span>
                                <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                    <Calendar size={12} />
                                    <span dir="ltr">{new Date(record.timestamp).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}</span>
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">{record.studentName}</h3>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span>{record.grade}</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span className="truncate max-w-md">{record.details}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 self-end md:self-center">
                             <button 
                                onClick={() => onRestore(record)}
                                className="flex items-center gap-2 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 px-4 py-2 rounded-xl transition-colors text-sm font-bold"
                             >
                                <Eye size={16} />
                                <span>عرض</span>
                             </button>
                             <button 
                                onClick={() => onDelete(record.id)}
                                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                title="حذف"
                             >
                                <Trash2 size={18} />
                             </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-20">
                    <div className="inline-block p-6 rounded-full bg-slate-100 mb-4">
                        <Archive size={40} className="text-slate-400" />
                    </div>
                    <p className="text-lg font-bold text-slate-500">لا توجد سجلات مطابقة</p>
                    <p className="text-sm text-slate-400">حاول تغيير خيارات البحث أو التصفية</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default RecordsPage;