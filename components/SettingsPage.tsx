import React, { useRef } from 'react';
import { SchoolSettings } from '../types';
import { Settings, Upload, X, Shield, PenTool, Stamp, AlertTriangle, Image as ImageIcon } from 'lucide-react';

interface Props {
  settings: SchoolSettings;
  setSettings: (settings: SchoolSettings) => void;
}

const SettingsPage: React.FC<Props> = ({ settings, setSettings }) => {
  
  const handleImageUpload = (key: keyof SchoolSettings, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings({
          ...settings,
          [key]: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (key: keyof SchoolSettings) => {
    if (confirm('هل أنت متأكد من إزالة هذه الصورة؟')) {
        setSettings({
        ...settings,
        [key]: null
        });
    }
  };

  const UploadCard = ({ 
    title, 
    settingKey, 
    icon: Icon,
    description
  }: { 
    title: string, 
    settingKey: keyof SchoolSettings, 
    icon: any,
    description: string
  }) => {
      const fileRef = useRef<HTMLInputElement>(null);
      const hasImage = !!settings[settingKey];

      return (
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center transition-transform hover:-translate-y-1 duration-300">
             <div className="bg-slate-50 p-4 rounded-2xl mb-4 border border-slate-100">
                <Icon size={32} className="text-slate-700" />
             </div>
             
             <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
             <p className="text-sm text-slate-400 mb-6 font-medium leading-relaxed px-4">{description}</p>

             <div className="w-full flex-1 flex flex-col items-center justify-center">
                 {hasImage ? (
                     <div className="relative group w-full h-48 bg-slate-50 rounded-2xl border-2 border-slate-200 overflow-hidden flex items-center justify-center">
                         <img 
                            src={settings[settingKey] as string} 
                            alt={title} 
                            className="max-h-full max-w-full object-contain p-2" 
                         />
                         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                             <button 
                                onClick={() => removeImage(settingKey)}
                                className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md transition-all transform hover:scale-110"
                             >
                                 <X size={24} />
                             </button>
                         </div>
                     </div>
                 ) : (
                    <div 
                        onClick={() => fileRef.current?.click()}
                        className="w-full h-48 rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/30 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 group"
                    >
                        <Upload size={32} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                        <span className="text-sm font-bold text-slate-400 group-hover:text-indigo-600">اختر صورة للرفع</span>
                    </div>
                 )}
                 <input 
                    type="file" 
                    ref={fileRef}
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => handleImageUpload(settingKey, e)} 
                 />
             </div>
        </div>
      );
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 w-full font-sans p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-200">
             <div className="bg-slate-800 p-3 rounded-2xl shadow-lg shadow-slate-300 text-white">
                <Settings size={32} />
             </div>
             <div>
                 <h1 className="text-3xl font-extrabold text-slate-800">إعدادات المدرسة</h1>
                 <p className="text-slate-500 mt-1 font-medium">تخصيص الشعارات والتواقيع الرسمية للنماذج</p>
             </div>
        </div>

        {/* Warning Banner */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
             <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
             <p className="text-sm text-amber-800 font-bold leading-relaxed">
                ملاحظة: يتم حفظ هذه الصور محلياً في متصفحك (IndexedDB). تأكد من استخدام صور بخلفية شفافة (PNG) للحصول على أفضل النتائج عند الطباعة.
             </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            
            <UploadCard 
                title="شعار الوزارة" 
                settingKey="ministryLogo" 
                icon={Shield}
                description="يظهر في أعلى يمين جميع الوثائق الرسمية"
            />

            <UploadCard 
                title="الختم المدرسي" 
                settingKey="schoolStamp" 
                icon={Stamp}
                description="يظهر أسفل يسار الوثائق فوق التوقيع"
            />

            <UploadCard 
                title="توقيع المدير" 
                settingKey="principalSignature" 
                icon={PenTool}
                description="يعتمد مدير المدرسة (أسفل اليسار)"
            />

            <UploadCard 
                title="توقيع الأخصائي" 
                settingKey="committeeHeadSignature" 
                icon={PenTool}
                description="لجنة شؤون الطلاب (أسفل اليمين)"
            />

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;