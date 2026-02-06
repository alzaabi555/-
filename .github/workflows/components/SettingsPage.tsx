import React, { useRef } from 'react';
import { SchoolSettings } from '../types';
import { Settings, Upload, X, Shield, PenTool, Stamp, AlertTriangle } from 'lucide-react';

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
    icon: Icon 
  }: { 
    title: string, 
    settingKey: keyof SchoolSettings, 
    icon: any 
  }) => {
    const fileRef = useRef<HTMLInputElement>(null);
    const imageSrc = settings[settingKey];

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center text-center hover:shadow-md transition-shadow duration-300">
        <div className="bg-blue-50 p-4 rounded-full mb-4 ring-4 ring-blue-50/50">
          <Icon className="text-blue-600" size={28} />
        </div>
        <h3 className="font-bold text-gray-800 mb-4 text-lg">{title}</h3>
        
        <div className="w-full h-40 mb-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden relative group transition-colors hover:border-blue-400">
          {imageSrc ? (
            <>
                <img src={imageSrc} alt={title} className="max-h-full max-w-full object-contain p-2" />
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button 
                        onClick={() => removeImage(settingKey)}
                        className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 hover:scale-110 transition-transform shadow-lg"
                    >
                        <X size={24} />
                    </button>
                </div>
            </>
          ) : (
            <div className="flex flex-col items-center text-gray-400 gap-2">
                <Upload size={24} className="opacity-50" />
                <span className="text-sm">لا توجد صورة</span>
            </div>
          )}
        </div>

        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileRef}
          onChange={(e) => handleImageUpload(settingKey, e)} 
        />
        
        <button 
          onClick={() => fileRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 hover:border-blue-300 font-bold py-3 rounded-lg transition-all duration-200 shadow-sm"
        >
          <Upload size={18} />
          <span>رفع الصورة</span>
        </button>
        <p className="text-[10px] text-gray-400 mt-3">يفضل استخدام صور بصيغة PNG وخلفية شفافة</p>
      </div>
    );
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-gray-50 w-full">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200">
                <Settings className="text-blue-600" size={32} />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-gray-800">إعدادات المدرسة</h1>
                <p className="text-gray-500 mt-1">ضبط الشعارات والأختام والتواقيع الرسمية للوثائق</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UploadCard 
                title="شعار الوزارة (الهيدر)" 
                settingKey="ministryLogo" 
                icon={Shield} 
            />
            
            <UploadCard 
                title="ختم المدرسة الرسمي" 
                settingKey="schoolStamp" 
                icon={Stamp} 
            />

            <UploadCard 
                title="توقيع مدير المدرسة" 
                settingKey="principalSignature" 
                icon={PenTool} 
            />

            <UploadCard 
                title="توقيع رئيس لجنة شؤون الطلاب" 
                settingKey="committeeHeadSignature" 
                icon={PenTool} 
            />
        </div>

        <div className="mt-8 bg-amber-50 border border-amber-200 p-4 rounded-xl text-sm text-amber-800 flex items-start gap-3">
             <AlertTriangle className="flex-shrink-0 mt-0.5" size={18} />
             <div>
                <strong>ملاحظة هامة:</strong> يتم حفظ هذه الصور في المتصفح محلياً فقط (IndexedDB). إذا قمت بمسح بيانات المتصفح، قد تحتاج لرفع الصور مرة أخرى.
             </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;