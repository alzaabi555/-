import React from 'react';
import { StudentData, SchoolSettings } from '../types';

interface Props {
  data: StudentData;
  settings?: SchoolSettings;
  showSocialWorker?: boolean;
}

const DocumentFooter: React.FC<Props> = ({ data, settings, showSocialWorker = true }) => {
  return (
    <div className="mt-auto pt-2">
      <div className="text-center mb-2">
        <p className="font-bold underline text-base">شاكرين لكم حسن تعاونكم معنا</p>
      </div>

      <div className="flex justify-between items-end px-4 relative min-h-[80px]">
        {showSocialWorker && (
          <div className="text-center relative w-1/3">
            <p className="font-bold mb-6 text-base">أخصائي شؤون الطلاب</p>
            <p className="text-gray-900 text-sm font-medium">{data.socialWorkerName}</p>
            
            {/* Committee Head Signature Overlay */}
            {settings?.committeeHeadSignature && (
                <img 
                    src={settings.committeeHeadSignature} 
                    alt="Signature" 
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 h-14 opacity-90 object-contain pointer-events-none mix-blend-multiply" 
                />
            )}
          </div>
        )}

        <div className="text-center relative w-1/3">
            <p className="font-bold mb-6 text-base">مدير المدرسة</p>
            <p className="text-gray-600 text-sm">يعتمد،،</p>

            {/* Principal Signature Overlay */}
            {settings?.principalSignature && (
                <img 
                    src={settings.principalSignature} 
                    alt="Signature" 
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 h-14 opacity-90 object-contain pointer-events-none mix-blend-multiply" 
                />
            )}
            
            {/* School Stamp Overlay */}
            {settings?.schoolStamp && (
                <img 
                    src={settings.schoolStamp} 
                    alt="Stamp" 
                    className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-0 h-16 opacity-80 object-contain pointer-events-none mix-blend-multiply rotate-[-10deg]" 
                />
            )}
        </div>
      </div>
      
      <div className="mt-1 text-[10px] text-gray-400 text-center print:text-black">
        <p>نسخة إلى: ملف الطالب</p>
      </div>
    </div>
  );
};

export default DocumentFooter;