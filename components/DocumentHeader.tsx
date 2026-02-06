import React from 'react';

interface Props {
  title?: string;
  subTitle?: string;
  logoUrl?: string | null;
}

const DocumentHeader: React.FC<Props> = ({ title, subTitle, logoUrl }) => {
  return (
    <div className="mb-2 text-center border-b-2 border-double border-gray-800 pb-1">
       {/* Title overlay for print if needed */}
       {title && <h2 className="text-right font-bold text-base absolute top-5 left-5 hidden print:block">{title}</h2>}
       
       <div className="flex justify-between items-start w-full mb-0 text-sm font-bold leading-snug">
          <div className="text-right w-1/3">
            <p>سلطنة عمان</p>
            <p>وزارة والتعليم</p>
            <p>المديرية العامة التعليم لمحافظة شمال الباطنة</p>
            <p>مدرسة الإبداع للبنين (5-8)</p>
          </div>
          
          <div className="flex flex-col items-center justify-center w-1/3 -mt-2">
             <img 
                src={logoUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Emblem_of_Oman.svg/1200px-Emblem_of_Oman.svg.png"} 
                alt="Oman Emblem" 
                className="h-16 w-auto mb-1 opacity-90 object-contain" 
             />
          </div>
          
          <div className="text-left w-1/3 pt-2 text-xs">
             {subTitle && <p>{subTitle}</p>}
          </div>
       </div>
    </div>
  );
};

export default DocumentHeader;
