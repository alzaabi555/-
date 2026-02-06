import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  Share2, 
  FileText, 
  User, 
  Users, 
  AlertTriangle, 
  FileWarning, 
  Scroll, 
  Ban,
  Search,
  Database,
  Layout,
  Clock,
  BookOpen,
  Settings,
  History,
  Save,
  Loader2,
  ChevronLeft,
  Shield
} from 'lucide-react';
import { FormType, INITIAL_DATA, StudentData, FORM_TITLES, ImportedStudent, SchoolSettings, INITIAL_SETTINGS, ArchiveRecord } from './types';
import FormRenderer from './components/FormRenderer';
import StudentsPage from './components/StudentsPage';
import SettingsPage from './components/SettingsPage';
import RecordsPage from './components/RecordsPage';
import { 
    getSettingsFromDB, saveSettingsToDB, 
    getStudentsFromDB, saveStudentsToDB, 
    getArchiveFromDB, saveArchiveToDB,
    checkStorageUsage
} from './utils/db';

type ViewMode = 'forms' | 'students' | 'settings' | 'records';

function App() {
  const [view, setView] = useState<ViewMode>('forms');
  const [activeForm, setActiveForm] = useState<FormType>(FormType.INVITATION_GENERAL);
  
  // Data States
  const [formData, setFormData] = useState<StudentData>(INITIAL_DATA);
  const [importedStudents, setImportedStudents] = useState<ImportedStudent[]>([]);
  const [settings, setSettings] = useState<SchoolSettings>(INITIAL_SETTINGS);
  const [archive, setArchive] = useState<ArchiveRecord[]>([]);
  
  // UI States
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDBLoading, setIsDBLoading] = useState(true);
  const [storageInfo, setStorageInfo] = useState<{usage: string, quota: string} | null>(null);

  // --- INITIAL DATA LOADING (ASYNC) ---
  useEffect(() => {
    const loadData = async () => {
        setIsDBLoading(true);
        try {
            // Load Settings
            const dbSettings = await getSettingsFromDB();
            if (dbSettings) setSettings(dbSettings);

            // Load Students
            const dbStudents = await getStudentsFromDB();
            if (dbStudents) setImportedStudents(dbStudents);

            // Load Archive
            const dbArchive = await getArchiveFromDB();
            if (dbArchive) setArchive(dbArchive);
            
            // Check Storage
            const info = await checkStorageUsage();
            setStorageInfo(info);

        } catch (error) {
            console.error("Failed to load data from DB:", error);
            alert("حدث خطأ أثناء تحميل البيانات من قاعدة البيانات.");
        } finally {
            setIsDBLoading(false);
        }
    };

    loadData();
  }, []);

  // --- DATA SAVING (ASYNC) ---
  // We use a flag (isDBLoading) to prevent saving empty initial states over existing DB data
  
  useEffect(() => {
    if (!isDBLoading) {
        saveStudentsToDB(importedStudents).catch(console.error);
    }
  }, [importedStudents, isDBLoading]);

  useEffect(() => {
    if (!isDBLoading) {
        saveSettingsToDB(settings).catch(console.error);
    }
  }, [settings, isDBLoading]);

  useEffect(() => {
    if (!isDBLoading) {
        saveArchiveToDB(archive).catch(console.error);
        // Refresh storage info after archive update
        checkStorageUsage().then(setStorageInfo);
    }
  }, [archive, isDBLoading]);


  // Filter students for autocomplete in Form View
  const filteredStudents = importedStudents.filter(s => 
    s.name.includes(formData.studentName) && formData.studentName.length > 0 && formData.studentName !== s.name
  ).slice(0, 5);

  const handlePrint = () => {
    document.title = `${formData.studentName}_${activeForm}`;
    window.print();
  };

  const handleSaveToArchive = () => {
    if (!formData.studentName) {
        alert("يرجى اختيار طالب أولاً لحفظ السجل.");
        return;
    }

    let reasonSummary = "";
    if (formData.reasonLateness) reasonSummary += "تأخر، ";
    if (formData.reasonAbsence) reasonSummary += "غياب، ";
    if (formData.reasonBehavior) reasonSummary += "سلوك، ";
    if (activeForm === FormType.ANNEX_14_SUSPENSION) reasonSummary += "فصل مؤقت، ";
    reasonSummary = reasonSummary.replace(/، $/, '') || "إجراء عام";

    const newRecord: ArchiveRecord = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        studentName: formData.studentName,
        grade: formData.grade,
        formType: activeForm,
        details: reasonSummary,
        data: { ...formData }
    };

    setArchive(prev => [newRecord, ...prev]);
    alert("تم حفظ النسخة في السجل بنجاح (Database Updated) ✅");
  };

  const handleDeleteRecord = (id: string) => {
      if (confirm("هل أنت متأكد من حذف هذا السجل؟")) {
          setArchive(prev => prev.filter(r => r.id !== id));
      }
  };

  const handleRestoreRecord = (record: ArchiveRecord) => {
      setFormData(record.data);
      setActiveForm(record.formType);
      setView('forms'); 
  };

  const handleWhatsApp = () => {
    let phone = formData.guardianPhone.replace(/\D/g, '');
    if (!phone) {
        alert("يرجى إدخال رقم هاتف ولي الأمر");
        return;
    }
    if (phone.length === 8) {
        phone = '968' + phone;
    }
    const title = FORM_TITLES[activeForm];
    const student = formData.studentName;
    const message = `السلام عليكم ولي أمر الطالب ${student}. \nيرجى الاطلاع على المرفق الخاص بـ "${title}". \nنشكر تعاونكم.\nإدارة مدرسة الإبداع للبنين`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'studentName') {
      setShowSuggestions(true);
    }
  };

  const selectStudent = (student: ImportedStudent) => {
    setFormData(prev => ({
      ...prev,
      studentName: student.name,
      grade: student.grade,
      guardianPhone: student.guardianPhone || '' 
    }));
    setShowSuggestions(false);
  };

  const menuItems = [
    { id: FormType.INVITATION_GENERAL, label: 'دعوة ولي أمر (عام)', icon: <Users size={18} /> },
    { id: FormType.INVITATION_TEACHER, label: 'دعوة ولي أمر (معلم)', icon: <BookOpen size={18} /> },
    { id: FormType.INVITATION_SUSPENSION, label: 'دعوة (إجراءات)', icon: <Users size={18} /> },
    { id: FormType.ANNEX_3_ADVICE, label: 'إخطار بنصح (3)', icon: <FileText size={18} /> },
    { id: FormType.ANNEX_4_ALERT, label: 'تنبيه طالب (4)', icon: <AlertTriangle size={18} /> },
    { id: FormType.ANNEX_5_WARNING, label: 'استمارة إنذار (5)', icon: <FileWarning size={18} /> },
    { id: FormType.ANNEX_6_PLEDGE, label: 'تعهد طالب (6)', icon: <Scroll size={18} /> },
    { id: FormType.ANNEX_14_SUSPENSION, label: 'فصل مؤقت (14)', icon: <Ban size={18} /> },
  ];

  const isInvitation = activeForm === FormType.INVITATION_GENERAL || activeForm === FormType.INVITATION_TEACHER;
  const isAnnex5 = activeForm === FormType.ANNEX_5_WARNING;
  const isAnnex4 = activeForm === FormType.ANNEX_4_ALERT;
  const isAnnex3 = activeForm === FormType.ANNEX_3_ADVICE;
  const isAnnex6 = activeForm === FormType.ANNEX_6_PLEDGE;
  const isAnnex14 = activeForm === FormType.ANNEX_14_SUSPENSION;

  if (isDBLoading) {
      return (
          <div className="flex flex-col items-center justify-center h-screen bg-gray-50 gap-4">
              <Loader2 className="animate-spin text-blue-600" size={48} />
              <p className="text-gray-600 font-bold">جاري تحميل قاعدة البيانات الضخمة...</p>
          </div>
      );
  }

  // Styles helpers
  const navButtonClass = (isActive: boolean) => `
    flex items-center gap-3 px-4 py-3 rounded-xl text-right transition-all duration-200 group relative overflow-hidden
    ${isActive 
        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg font-bold scale-[1.02]' 
        : 'text-slate-400 hover:text-white hover:bg-slate-800'
    }
  `;

  const formButtonClass = (isActive: boolean) => `
    w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-right border
    ${isActive 
        ? 'bg-white border-blue-500 text-blue-700 shadow-md font-bold ring-1 ring-blue-500' 
        : 'bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
    }
  `;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-slate-900 text-white flex-shrink-0 flex flex-col overflow-y-auto no-print shadow-2xl z-20">
        <div className="p-6 border-b border-slate-800 bg-slate-900 sticky top-0 z-10">
            <div className="flex items-center justify-center gap-2 mb-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                    <Shield size={24} className="text-white" />
                </div>
            </div>
            <h1 className="text-xl font-bold text-center tracking-wide">لجنة شؤون الطلاب</h1>
            <p className="text-xs text-center text-slate-400 mt-2 font-light">مدرسة الإبداع للبنين (5-8)</p>
            {storageInfo && (
                <div className="mt-4 bg-slate-800/50 rounded-lg p-2 text-[10px] text-slate-400 text-center font-mono border border-slate-700">
                    <div className="flex justify-between px-2"><span>Used:</span> <span className="text-blue-400">{storageInfo.usage}</span></div>
                    <div className="flex justify-between px-2"><span>Cap:</span> <span className="text-green-400">{storageInfo.quota}</span></div>
                </div>
            )}
        </div>
        
        {/* Main Navigation Tabs */}
        <div className="flex flex-col p-4 space-y-2">
            <button onClick={() => setView('forms')} className={navButtonClass(view === 'forms')}>
                <Layout size={20} className={view === 'forms' ? 'animate-pulse' : ''} />
                <span>إصدار الوثائق</span>
                {view === 'forms' && <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/20"></div>}
            </button>
            <button onClick={() => setView('records')} className={navButtonClass(view === 'records')}>
                <History size={20} />
                <span>السجل والأرشيف</span>
            </button>
            <button onClick={() => setView('students')} className={navButtonClass(view === 'students')}>
                <Database size={20} />
                <span>قاعدة بيانات الطلاب</span>
            </button>
            <button onClick={() => setView('settings')} className={navButtonClass(view === 'settings')}>
                <Settings size={20} />
                <span>إعدادات المدرسة</span>
            </button>
        </div>

        {/* Forms Menu (Only visible in Forms view) */}
        {view === 'forms' && (
            <div className="flex-1 px-4 pb-4 space-y-2 overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-3 mt-4 px-2 uppercase tracking-wider">
                    <span>النماذج الرسمية</span>
                    <div className="h-px bg-slate-800 flex-1"></div>
                </div>
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveForm(item.id)}
                        className={formButtonClass(activeForm === item.id)}
                    >
                        <div className="flex items-center gap-3">
                            {item.icon}
                            <span className="text-sm">{item.label}</span>
                        </div>
                        {activeForm === item.id && <ChevronLeft size={16} className="text-blue-500" />}
                    </button>
                ))}
            </div>
        )}
        
        <div className="mt-auto p-4 border-t border-slate-800 bg-slate-900 text-[10px] text-slate-500 text-center">
            Student Affairs v2.2 (MaxDB)
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative shadow-inner">
        
        {/* VIEW 1: FORMS GENERATION */}
        {view === 'forms' && (
            <>
                {/* Input Form Panel */}
                <div className="w-full md:w-1/3 p-6 overflow-y-auto bg-white border-l border-gray-200 shadow-xl no-print z-10">
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                        <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                            <User size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">بيانات الطالب والإجراء</h2>
                    </div>
                    
                    <div className="space-y-5">
                        <div className="relative group">
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">اسم الطالب</label>
                            <div className="relative transition-all duration-200 focus-within:scale-[1.01]">
                                <input 
                                    type="text" 
                                    name="studentName" 
                                    value={formData.studentName} 
                                    onChange={handleInputChange} 
                                    autoComplete="off"
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pl-10 shadow-sm" 
                                    placeholder="ابحث عن اسم..." 
                                />
                                <Search className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-500" size={18} />
                            </div>
                            
                            {/* Autocomplete Dropdown */}
                            {showSuggestions && filteredStudents.length > 0 && (
                                <div className="absolute w-full bg-white border border-gray-200 rounded-xl shadow-2xl mt-2 z-50 max-h-56 overflow-y-auto ring-1 ring-black ring-opacity-5">
                                    {filteredStudents.map((s, idx) => (
                                        <div 
                                            key={idx} 
                                            onClick={() => selectStudent(s)}
                                            className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-0 transition-colors flex justify-between items-center group/item"
                                        >
                                            <div>
                                                <div className="font-bold text-gray-800 group-hover/item:text-blue-700">{s.name}</div>
                                                <div className="text-xs text-gray-500">{s.grade}</div>
                                            </div>
                                            {s.guardianPhone && (
                                                <div className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600 font-mono group-hover/item:bg-white">
                                                    {s.guardianPhone}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">الرقم المدني (للطالب)</label>
                                <input type="text" name="civilId" value={formData.civilId} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="1234..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">الصف</label>
                                <input type="text" name="grade" value={formData.grade} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="مثال: 5/1" />
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-5 mt-5">
                            <label className="block text-sm font-medium text-gray-700 mb-1">اسم ولي الأمر</label>
                            <input type="text" name="guardianName" value={formData.guardianName} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none mb-3" placeholder="الاسم الكامل" />
                            
                            <label className="block text-sm font-medium text-gray-700 mb-1">هاتف ولي الأمر (واتساب)</label>
                            <input type="tel" name="guardianPhone" value={formData.guardianPhone} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-left" dir="ltr" placeholder="968..." />
                        </div>

                        {/* Annex 6 Specific: Guardian Civil ID */}
                        {isAnnex6 && (
                            <div className="mt-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">الرقم المدني لولي الأمر</label>
                                <input type="text" name="guardianCivilId" value={formData.guardianCivilId} onChange={handleInputChange} className="w-full p-2.5 border rounded-lg" placeholder="الرقم المدني لولي الأمر..." />
                            </div>
                        )}

                        <div className="border-t border-gray-100 pt-5 mt-5">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {isInvitation ? 'تاريخ الدعوة' : 'تاريخ الإجراء / التحرير'}
                            </label>
                            <input type="date" name="incidentDate" value={formData.incidentDate} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>

                        {/* Invitation Teacher Specific Inputs */}
                        {activeForm === FormType.INVITATION_TEACHER && (
                            <div className="border-t pt-4 mt-4 bg-blue-50 p-4 rounded-xl border border-blue-200">
                                <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                                    <BookOpen size={18} />
                                    بيانات المعلم والمادة
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">اسم المعلم</label>
                                        <input type="text" name="teacherName" value={formData.teacherName} onChange={handleInputChange} className="w-full p-2 border border-blue-200 rounded text-sm focus:ring-1 focus:ring-blue-500" placeholder="أ. فلان الفلاني" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">المادة</label>
                                        <input type="text" name="subjectName" value={formData.subjectName} onChange={handleInputChange} className="w-full p-2 border border-blue-200 rounded text-sm focus:ring-1 focus:ring-blue-500" placeholder="مثال: الرياضيات" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Deadline Section for Invitations */}
                        {isInvitation && (
                            <div className="border-t pt-4 mt-4 bg-blue-50 p-4 rounded-xl border border-blue-200 mt-2">
                                <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                                    <Clock size={18} />
                                    مهلة الحضور
                                </h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">الحضور في أقرب فرصة لا تتجاوز:</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-blue-100 hover:border-blue-300 transition">
                                            <input 
                                                type="radio" 
                                                name="invitationDeadline" 
                                                value="1" 
                                                checked={formData.invitationDeadline === '1'} 
                                                onChange={handleInputChange}
                                                className="text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm font-medium">يوماً واحداً</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-blue-100 hover:border-blue-300 transition">
                                            <input 
                                                type="radio" 
                                                name="invitationDeadline" 
                                                value="2" 
                                                checked={formData.invitationDeadline === '2'} 
                                                onChange={handleInputChange}
                                                className="text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm font-medium">يومين</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-blue-100 hover:border-blue-300 transition">
                                            <input 
                                                type="radio" 
                                                name="invitationDeadline" 
                                                value="3" 
                                                checked={formData.invitationDeadline === '3'} 
                                                onChange={handleInputChange}
                                                className="text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm font-medium">3 أيام</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Annex 3 & Annex 4 & Annex 5 & Annex 6 & Annex 14 Specifics */}
                        {(isAnnex5 || isAnnex3 || isAnnex4 || isAnnex6 || isAnnex14) && (
                            <div className="border-t pt-4 mt-4 bg-amber-50 p-4 rounded-xl border border-amber-200">
                                <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                                    <FileWarning size={18} />
                                    بيانات إضافية
                                </h3>
                                
                                {isAnnex6 && (
                                    <div className="mb-3">
                                        <label className="block text-xs font-bold text-gray-600">العام الدراسي</label>
                                        <input type="text" name="academicYear" value={formData.academicYear} onChange={handleInputChange} className="w-full p-2 border border-amber-200 rounded text-sm bg-white" placeholder="YYYY / YYYY" />
                                    </div>
                                )}

                                {(isAnnex5 || isAnnex14) && (
                                    <>
                                        <div className="grid grid-cols-2 gap-3 mb-3">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-600">رسالة رقم (1)</label>
                                                <input type="text" name={isAnnex14 ? "annex14_letter1No" : "annex5_letter1No"} value={isAnnex14 ? formData.annex14_letter1No : formData.annex5_letter1No} onChange={handleInputChange} className="w-full p-2 border border-amber-200 rounded text-sm bg-white" placeholder="الرقم..." />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-600">تاريخها</label>
                                                <input type="text" name={isAnnex14 ? "annex14_letter1Date" : "annex5_letter1Date"} value={isAnnex14 ? formData.annex14_letter1Date : formData.annex5_letter1Date} onChange={handleInputChange} className="w-full p-2 border border-amber-200 rounded text-sm bg-white" placeholder="YYYY/MM/DD" />
                                            </div>
                                        </div>
                                        {isAnnex14 && (
                                            <div className="mb-3">
                                                <label className="block text-xs font-bold text-gray-600">بشأن (موضوع الرسالة 1)</label>
                                                <input type="text" name="annex14_letter1Subj" value={formData.annex14_letter1Subj} onChange={handleInputChange} className="w-full p-2 border border-amber-200 rounded text-sm bg-white" placeholder="الموضوع..." />
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-3 mb-3">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-600">رسالة رقم (2)</label>
                                                <input type="text" name={isAnnex14 ? "annex14_letter2No" : "annex5_letter2No"} value={isAnnex14 ? formData.annex14_letter2No : formData.annex5_letter2No} onChange={handleInputChange} className="w-full p-2 border border-amber-200 rounded text-sm bg-white" placeholder="الرقم..." />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-600">تاريخها</label>
                                                <input type="text" name={isAnnex14 ? "annex14_letter2Date" : "annex5_letter2Date"} value={isAnnex14 ? formData.annex14_letter2Date : formData.annex5_letter2Date} onChange={handleInputChange} className="w-full p-2 border border-amber-200 rounded text-sm bg-white" placeholder="YYYY/MM/DD" />
                                            </div>
                                        </div>
                                         {isAnnex14 && (
                                            <div className="mb-3">
                                                <label className="block text-xs font-bold text-gray-600">بشأن (موضوع الرسالة 2)</label>
                                                <input type="text" name="annex14_letter2Subj" value={formData.annex14_letter2Subj} onChange={handleInputChange} className="w-full p-2 border border-amber-200 rounded text-sm bg-white" placeholder="الموضوع..." />
                                            </div>
                                        )}
                                    </>
                                )}

                                {isAnnex4 && (
                                    <>
                                        <div className="grid grid-cols-2 gap-3 mb-3">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-600">رسالة مرجعية رقم</label>
                                                <input type="text" name="annex4_letterNo" value={formData.annex4_letterNo} onChange={handleInputChange} className="w-full p-2 border border-amber-200 rounded text-sm bg-white" placeholder="الرقم..." />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-600">تاريخها</label>
                                                <input type="text" name="annex4_letterDate" value={formData.annex4_letterDate} onChange={handleInputChange} className="w-full p-2 border border-amber-200 rounded text-sm bg-white" placeholder="YYYY/MM/DD" />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="block text-xs font-bold text-gray-600">بشأن (موضوع الرسالة)</label>
                                            <input type="text" name="annex4_regarding" value={formData.annex4_regarding} onChange={handleInputChange} className="w-full p-2 border border-amber-200 rounded text-sm bg-white" placeholder="الموضوع..." />
                                        </div>
                                    </>
                                )}
                                
                                {!isAnnex6 && (
                                    <div className="mb-3">
                                        <label className="block text-xs font-bold text-gray-600">رقم المادة (في اللائحة)</label>
                                        {isAnnex5 ? (
                                            <input type="text" name="annex5_articleNo" value={formData.annex5_articleNo} onChange={handleInputChange} className="w-full p-2 border border-amber-200 rounded text-sm bg-white" placeholder="مثال: 5" />
                                        ) : isAnnex4 ? (
                                            <input type="text" name="annex4_articleNo" value={formData.annex4_articleNo} onChange={handleInputChange} className="w-full p-2 border border-amber-200 rounded text-sm bg-white" placeholder="مثال: 5" />
                                        ) : isAnnex14 ? (
                                            <input type="text" name="annex14_articleNo" value={formData.annex14_articleNo} onChange={handleInputChange} className="w-full p-2 border border-amber-200 rounded text-sm bg-white" placeholder="مثال: 14" />
                                        ) : (
                                            <input type="text" name="annex3_articleNo" value={formData.annex3_articleNo} onChange={handleInputChange} className="w-full p-2 border border-amber-200 rounded text-sm bg-white" placeholder="مثال: 4" />
                                        )}
                                    </div>
                                )}
                                
                                {isAnnex14 && (
                                    <div className="mb-3">
                                        <label className="block text-xs font-bold text-gray-600">مدة الفصل (بالأيام)</label>
                                        <input type="text" name="annex14_suspensionDays" value={formData.annex14_suspensionDays} onChange={handleInputChange} className="w-full p-2 border border-amber-200 rounded text-sm bg-white" placeholder="3" />
                                    </div>
                                )}

                                <h3 className="font-bold text-gray-800 mt-4 mb-2 border-t border-amber-200 pt-2">
                                    {isAnnex6 ? 'أسباب التعهد' : isAnnex14 ? 'أسباب الفصل (السلوكيات)' : 'أسباب الإجراء (حدد واملأ التفاصيل)'}
                                </h3>
                                
                                {isAnnex14 ? (
                                     <textarea name="behaviorDetails" value={formData.behaviorDetails} onChange={handleInputChange} className="mt-1 w-full p-2 border border-amber-200 text-sm rounded h-24 bg-white" placeholder="اذكر السلوكيات التي أدت للفصل..." />
                                ) : (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="flex items-center gap-2 cursor-pointer hover:bg-amber-100 p-1 rounded transition">
                                                <input type="checkbox" name="reasonLateness" checked={formData.reasonLateness} onChange={handleInputChange} className="w-4 h-4 text-blue-600 rounded" />
                                                <span className="text-sm font-medium">{isAnnex6 ? 'عدم التأخر عن موعد بدء اليوم الدراسي بدون عذر مقبول' : 'التأخر الصباحي'}</span>
                                            </label>
                                            {formData.reasonLateness && !isAnnex6 && (
                                                <input type="text" name="latenessDates" value={formData.latenessDates} onChange={handleInputChange} className="mt-1 w-full p-2 border border-amber-200 text-sm rounded bg-white" placeholder="الأيام الموافقة للتواريخ الآتية..." />
                                            )}
                                        </div>
                                        <div>
                                            <label className="flex items-center gap-2 cursor-pointer hover:bg-amber-100 p-1 rounded transition">
                                                <input type="checkbox" name="reasonAbsence" checked={formData.reasonAbsence} onChange={handleInputChange} className="w-4 h-4 text-blue-600 rounded" />
                                                <span className="text-sm font-medium">{isAnnex6 ? 'عدم الغياب عن المدرسة بدون عذر مقبول' : 'التغيب بدون عذر'}</span>
                                            </label>
                                            {formData.reasonAbsence && !isAnnex6 && (
                                                <input type="text" name="absenceDates" value={formData.absenceDates} onChange={handleInputChange} className="mt-1 w-full p-2 border border-amber-200 text-sm rounded bg-white" placeholder="الأيام الموافقة للتواريخ الآتية..." />
                                            )}
                                        </div>
                                        <div>
                                            <label className="flex items-center gap-2 cursor-pointer hover:bg-amber-100 p-1 rounded transition">
                                                <input type="checkbox" name="reasonBehavior" checked={formData.reasonBehavior} onChange={handleInputChange} className="w-4 h-4 text-blue-600 rounded" />
                                                <span className="text-sm font-medium">{isAnnex6 ? 'عدم تكرار السلوكيات المنسوبة إليه' : 'سلوكيات أخرى'}</span>
                                            </label>
                                            {formData.reasonBehavior && !isAnnex6 && (
                                                <input type="text" name="behaviorDetails" value={formData.behaviorDetails} onChange={handleInputChange} className="mt-1 w-full p-2 border border-amber-200 text-sm rounded bg-white" placeholder="اذكر السلوكيات..." />
                                            )}
                                        </div>
                                    </div>
                                )}

                                {isAnnex5 || isAnnex3 || isAnnex4 || isAnnex14 ? (
                                    <>
                                        <h3 className="font-bold text-gray-800 mt-4 mb-2 border-t border-amber-200 pt-2">بيانات المتسلم (أسفل الصفحة)</h3>
                                        <div className="space-y-2">
                                            <input type="text" name="annex5_recipientName" value={formData.annex5_recipientName} onChange={handleInputChange} className="w-full p-2 border border-amber-200 rounded text-sm bg-white" placeholder="اسم المتسلم" />
                                            <input type="text" name="annex5_recipientRelation" value={formData.annex5_recipientRelation} onChange={handleInputChange} className="w-full p-2 border border-amber-200 rounded text-sm bg-white" placeholder="صلته بالطالب" />
                                            <input type="text" name="annex5_recipientCivilId" value={formData.annex5_recipientCivilId} onChange={handleInputChange} className="w-full p-2 border border-amber-200 rounded text-sm bg-white" placeholder="الرقم المدني" />
                                            <input type="text" name="annex5_recipientPhone" value={formData.annex5_recipientPhone} onChange={handleInputChange} className="w-full p-2 border border-amber-200 rounded text-sm bg-white" placeholder="رقم الهاتف" />
                                        </div>
                                    </>
                                ) : null}
                            </div>
                        )}

                        {/* Standard Reasons for other forms (excluding invitations and annex 5/4/3/6/14) */}
                        {!isInvitation && !isAnnex5 && !isAnnex4 && !isAnnex3 && !isAnnex6 && !isAnnex14 && (
                            <div className="border-t pt-4 mt-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <h3 className="font-bold text-gray-800 mb-3">أسباب الإجراء</h3>
                                
                                <div className="space-y-3">
                                    <div>
                                        <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded transition">
                                            <input type="checkbox" name="reasonLateness" checked={formData.reasonLateness} onChange={handleInputChange} className="w-4 h-4 text-blue-600 rounded" />
                                            <span className="text-sm font-medium">التأخر الصباحي</span>
                                        </label>
                                        {formData.reasonLateness && (
                                            <textarea name="latenessDates" value={formData.latenessDates} onChange={handleInputChange} className="mt-1 w-full p-2 border border-gray-300 text-sm rounded-lg h-16 bg-white" placeholder="الأيام والتواريخ..." />
                                        )}
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded transition">
                                            <input type="checkbox" name="reasonAbsence" checked={formData.reasonAbsence} onChange={handleInputChange} className="w-4 h-4 text-blue-600 rounded" />
                                            <span className="text-sm font-medium">الغياب بدون عذر</span>
                                        </label>
                                        {formData.reasonAbsence && (
                                            <textarea name="absenceDates" value={formData.absenceDates} onChange={handleInputChange} className="mt-1 w-full p-2 border border-gray-300 text-sm rounded-lg h-16 bg-white" placeholder="الأيام والتواريخ..." />
                                        )}
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded transition">
                                            <input type="checkbox" name="reasonBehavior" checked={formData.reasonBehavior} onChange={handleInputChange} className="w-4 h-4 text-blue-600 rounded" />
                                            <span className="text-sm font-medium">سلوكيات مخالفة (أخرى)</span>
                                        </label>
                                        {formData.reasonBehavior && (
                                            <textarea name="behaviorDetails" value={formData.behaviorDetails} onChange={handleInputChange} className="mt-1 w-full p-2 border border-gray-300 text-sm rounded-lg h-16 bg-white" placeholder="تفاصيل السلوك..." />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="border-t border-gray-100 pt-5 mt-5">
                            <label className="block text-sm font-medium text-gray-700 mb-1">أخصائي شؤون الطلاب</label>
                            <input type="text" name="socialWorkerName" value={formData.socialWorkerName} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm" placeholder="الاسم" />
                        </div>
                    </div>
                </div>

                {/* Preview Panel */}
                <div className="flex-1 bg-gray-100 overflow-y-auto p-4 md:p-8 flex flex-col items-center w-full relative">
                    
                    {/* Toolbar */}
                    <div className="w-full max-w-[210mm] flex justify-end gap-3 mb-6 no-print z-10 sticky top-0 bg-gray-100/90 backdrop-blur-sm py-2">
                        <button 
                            onClick={handleWhatsApp} 
                            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 font-bold text-sm"
                        >
                            <Share2 size={18} />
                            <span>إرسال واتساب</span>
                        </button>
                         <button 
                            onClick={handleSaveToArchive} 
                            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 font-bold text-sm"
                        >
                            <Save size={18} />
                            <span>حفظ في السجل</span>
                        </button>
                        <button 
                            onClick={handlePrint} 
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 font-bold text-sm"
                        >
                            <Printer size={18} />
                            <span>طباعة / PDF</span>
                        </button>
                    </div>

                    {/* Paper */}
                    <div className="a4-paper transform origin-top md:scale-95 lg:scale-100 transition-transform shadow-2xl border border-gray-200">
                        <div className="h-full flex flex-col text-black">
                            <FormRenderer type={activeForm} data={formData} settings={settings} />
                        </div>
                    </div>
                    
                    <p className="mt-6 text-gray-400 text-sm no-print font-medium">تأكد من إعدادات الطباعة: A4، بدون هوامش (Margins: None)</p>
                </div>
            </>
        )}

        {/* VIEW 2: STUDENTS DATABASE */}
        {view === 'students' && (
            <StudentsPage 
                students={importedStudents} 
                setStudents={setImportedStudents} 
            />
        )}
        
        {/* VIEW 3: SETTINGS */}
        {view === 'settings' && (
            <SettingsPage 
                settings={settings}
                setSettings={setSettings}
            />
        )}

         {/* VIEW 4: RECORDS (ARCHIVE) */}
        {view === 'records' && (
            <RecordsPage 
                records={archive}
                onDelete={handleDeleteRecord}
                onRestore={handleRestoreRecord}
            />
        )}

      </main>
    </div>
  );
}

export default App;