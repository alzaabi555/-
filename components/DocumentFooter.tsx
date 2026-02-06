import React from 'react';
import { StudentData, SchoolSettings } from '../types';

interface Props {
  data: StudentData;
  settings?: SchoolSettings;
  showSocialWorker?: boolean;
}

const DocumentFooter: React.FC<Props> = ({ data, settings, showSocialWorker = true }) => {
  return (
    <div className="mt-auto pt-6 pb-2">
      <div className="text-center mb-6">
        <p className="font-bold underline text-lg">شاكرين لكم حسن تعاونكم معنا</p>
      </div>

      <div className="flex justify-between items-end px-4 relative min-h-[120px]">
        {showSocialWorker && (
          <div className="text-center relative w-1/3">
            <p className="font-bold mb-8 text-lg">أخصائي شؤون الطلاب</p>
            <p className="text-gray-900 text-lg font-medium">{data.socialWorkerName}</p>
            
            {/* Committee Head Signature Overlay */}
            {settings?.committeeHeadSignature && (
                <img 
                    src={settings.committeeHeadSignature} 
                    alt="Signature" 
                    className="absolute bottom-6 left-1/2 transform -translate-x-1/2 h-16 opacity-90 object-contain pointer-events-none mix-blend-multiply" 
                />
            )}
          </div>
        )}

        <div className="text-center relative w-1/3">
            <p className="font-bold mb-8 text-lg">مدير المدرسة</p>
            <p className="text-gray-600 text-base">يعتمد،،</p>

            {/* Principal Signature Overlay */}
            {settings?.principalSignature && (
                <img 
                    src={settings.principalSignature} 
                    alt="Signature" 
                    className="absolute bottom-6 left-1/2 transform -translate-x-1/2 h-20 opacity-90 object-contain pointer-events-none mix-blend-multiply" 
                />
            )}
            
            {/* School Stamp Overlay */}
            {settings?.schoolStamp && (
                <img 
                    src={settings.schoolStamp} 
                    alt="Stamp" 
                    className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-0 h-24 opacity-80 object-contain pointer-events-none mix-blend-multiply rotate-[-10deg]" 
                />
            )}
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-400 text-center print:text-black">
        <p>نسخة إلى: ملف الطالب</p>
      </div>
    </div>
  );
};

export default DocumentFooter;