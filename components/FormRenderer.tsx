import React from 'react';
import { FormType, StudentData, SchoolSettings } from '../types';
import DocumentHeader from './DocumentHeader';
import DocumentFooter from './DocumentFooter';

interface Props {
  type: FormType;
  data: StudentData;
  settings?: SchoolSettings;
}

const CheckBox: React.FC<{ checked: boolean }> = ({ checked }) => (
  <span className={`inline-block font-sans text-lg font-bold ml-2 w-5 text-center`}>{checked ? '( ✔ )' : '(   )'}</span>
);

const SquareBox: React.FC<{ checked: boolean }> = ({ checked }) => (
  <span className={`inline-block border border-black w-4 h-4 ml-2 align-middle leading-none text-center ${checked ? 'bg-black' : ''}`}></span>
);

// Improved DottedLine: Compacts appropriately
const DottedLine: React.FC<{ text?: string, className?: string, width?: string }> = ({ text, className, width }) => (
    <span className={`border-b border-dotted border-black inline-block px-1 text-center leading-normal ${width ? width : 'min-w-[40px]'} ${className}`}>
        {text || ''}&nbsp;
    </span>
);

const FormRenderer: React.FC<Props> = ({ type, data, settings }) => {
  
  // Standard Salutation
  const Salutation = () => (
     <div className="text-lg font-bold mb-2 mt-1">
        <div className="flex flex-wrap items-baseline gap-2 mb-1">
            <span>الفاضل ولي أمر الطالب /</span>
            <DottedLine text={data.guardianName} className="flex-1 font-normal min-w-[200px]" />
            <span>المحترم</span>
        </div>
        <p className="text-base font-normal mt-1">السلام عليكم ورحمة الله وبركاته ،،،</p>
     </div>
  );

  // --- SPECIFIC FORMS ---

  if (type === FormType.INVITATION_GENERAL) {
    return (
      <div className="h-full flex flex-col font-serif">
         <DocumentHeader logoUrl={settings?.ministryLogo} />
         
         <div className="text-center mb-4">
            <h1 className="text-xl font-bold border-b-2 border-black inline-block pb-1">دعوة ولي أمر لحضور المدرسة لأمر يتعلق بالطالب</h1>
         </div>

         <div className="px-1 text-base font-bold leading-normal flex-1">
            <div className="mb-2 text-sm flex items-center">
                <span className="ml-4 font-bold">تاريخ الدعوة :</span>
                <span className="mx-2 font-mono text-base" dir="ltr">{data.incidentDate}</span>
            </div>
            
            <div className="mb-2 flex flex-wrap items-baseline">
                <span>الفاضل ولي أمر الطالب : </span>
                <DottedLine text={data.studentName} className="flex-1 min-w-[250px]" />
            </div>

            <div className="mb-2 flex flex-wrap items-baseline">
                <span>المقيد بالصف : </span>
                <DottedLine text={data.grade} className="min-w-[150px]" />
            </div>

            <div className="mb-2 text-base">
                <p>السلام عليكم ورحمة الله وبركاته</p>
            </div>

            <div className="text-justify leading-relaxed mb-4 font-normal text-base">
                <p>
                    نظراً لأهمية التعاون بين المدرسة وولي الأمر فيما يخدم مصلحة الطالب ، ويحقق له النجاح ، ونأمل منكم الحضور إلى المدرسة لبحث بعض الأمور المتعلقة بابنكم ، ولنا في حضوركم أمل بهدف التعاون بين البيت والمدرسة لتحقيق الرسالة التربوية الهادفة التي نسعى إليها ، وتأمل المدرسة حضوركم في أقرب فرصة ممكنة لديكم ، بحيث لا تتجاوز :
                </p>
            </div>

            <div className="flex justify-between items-center px-8 mb-6 text-base">
                 <div className="flex items-center gap-2">
                    <SquareBox checked={data.invitationDeadline === '1'} />
                    <span>يوماً واحداً</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <SquareBox checked={data.invitationDeadline === '2'} />
                    <span>يومين</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <SquareBox checked={data.invitationDeadline === '3'} />
                    <span>ثلاثة أيام</span>
                 </div>
            </div>

            <div className="flex flex-col items-end mb-4">
                 <p className="font-bold underline text-lg pl-6">ومراجعة لجنة شؤون الطلاب</p>
            </div>
            
            <DocumentFooter data={data} settings={settings} />
         </div>
      </div>
    );
  }

  if (type === FormType.INVITATION_TEACHER) {
    return (
      <div className="h-full flex flex-col font-serif">
         <DocumentHeader logoUrl={settings?.ministryLogo} />
         
         <div className="text-center mb-4">
            <h1 className="text-xl font-bold border-b-2 border-black inline-block pb-1">دعوة ولي أمر لحضور المدرسة لأمر يتعلق بالطالب</h1>
         </div>

         <div className="px-1 text-base font-bold leading-normal flex-1">
            <div className="mb-2 text-sm flex items-center">
                <span className="ml-4">تاريخ الدعوة :</span>
                <span className="mx-2 font-mono text-base" dir="ltr">{data.incidentDate}</span>
            </div>
            
            <div className="mb-2 flex flex-wrap items-baseline">
                <span>الفاضل ولي أمر الطالب : </span>
                <DottedLine text={data.guardianName || ''} className="flex-1 min-w-[250px]" />
            </div>

            <div className="mb-2 flex flex-wrap items-baseline">
                <span>المقيد بالصف : </span>
                <DottedLine text={data.grade} className="min-w-[150px]" />
            </div>

            <div className="mb-2 text-base">
                <p>السلام عليكم ورحمة الله وبركاته</p>
            </div>

            <div className="text-justify leading-relaxed mb-4 font-normal text-base">
                <p>
                    نظراً لأهمية التعاون بين المدرسة وولي الأمر فيما يخدم مصلحة الطالب ، ويحقق له النجاح ، ونأمل منكم الحضور إلى المدرسة لبحث بعض الأمور المتعلقة بابنكم ، ولنا في حضوركم أمل بهدف التعاون بين البيت والمدرسة لتحقيق الرسالة التربوية الهادفة التي نسعى إليها ، وتأمل المدرسة حضوركم في أقرب فرصة ممكنة لديكم ، بحيث لا تتجاوز :
                </p>
            </div>

            <div className="flex justify-between items-center px-8 mb-6 text-base">
                 <div className="flex items-center gap-2">
                    <span>يوماً واحداً</span>
                    <SquareBox checked={data.invitationDeadline === '1'} />
                 </div>
                 <div className="flex items-center gap-2">
                    <span>يومين</span>
                    <SquareBox checked={data.invitationDeadline === '2'} />
                 </div>
                 <div className="flex items-center gap-2">
                    <span>ثلاثة أيام</span>
                    <SquareBox checked={data.invitationDeadline === '3'} />
                 </div>
            </div>

            {/* Teacher and Subject fields */}
            <div className="flex justify-between items-center px-4 mb-8 text-lg font-bold">
                 <div className="flex items-baseline w-1/2">
                    <span>المادة : </span>
                    <DottedLine text={data.subjectName} className="flex-1 mr-2" />
                 </div>
                 <div className="flex items-baseline w-1/2">
                    <span>المعلم : </span>
                    <DottedLine text={data.teacherName} className="flex-1 mr-2" />
                 </div>
            </div>
            
            <DocumentFooter data={data} settings={settings} />
         </div>
      </div>
    );
  }

  if (type === FormType.ANNEX_3_ADVICE) {
    return (
        <div className="h-full flex flex-col font-serif relative pt-0">
             <div className="flex justify-between items-start mb-2 text-sm">
                <div className="text-right w-1/3 pt-1">
                    <p className="mb-1 text-center font-bold text-base">ملحق رقم ( 3 )</p>
                    <div className="space-y-1 pr-2 text-xs">
                        <div className="flex gap-2"><span className="font-bold">الرقم :</span>.........</div>
                        <div className="flex gap-2"><span className="font-bold">التاريخ :</span><span dir="ltr">{data.incidentDate}</span></div>
                    </div>
                </div>
                <div className="text-left w-1/3 pl-2 text-xs font-bold leading-normal">
                    <p>سلطنة عمان</p>
                    <p>وزارة التعليم</p>
                    <p>المديرية العامة للتعليم بمحافظة شمال الباطنة</p>
                    <p>مدرسة الإبداع للبنين (5-8)</p>
                </div>
            </div>

            <h1 className="text-xl font-bold text-center mb-3 underline">استمارة إخطار ولي الأمر بنصح الطالب</h1>

            <div className="px-1 text-base leading-normal flex-1">
                <div className="mb-1 flex flex-wrap items-baseline">
                    <span>الفاضل ولي أمر الطالب / الطالبة : </span>
                    <DottedLine text={data.studentName} className="flex-1 font-bold min-w-[200px]" />
                    <span>المسجل / المسجلة</span>
                </div>
                <div className="mb-2 flex flex-wrap items-baseline">
                    <span>بالصف : </span>
                    <DottedLine text={data.grade} className="min-w-[100px] font-bold" />
                </div>
                
                <p className="mb-1">السلام عليكم ورحمة الله وبركاته .. وبعد ...</p>

                <div className="text-justify leading-relaxed">
                    <span>عملاً بالمادة رقم ( </span>
                    <DottedLine text={data.annex3_articleNo} className="min-w-[30px] text-center" />
                    <span>) من لائحة شؤون الطلاب بالمدارس الحكومية ، نفيدكم بأن إدارة المدرسة قد قامت بتقديم النصح للطالب ، وذلك بسبب :</span>
                </div>

                <div className="mt-2 space-y-1">
                    <div>
                        <div className="flex items-baseline">
                            <CheckBox checked={data.reasonLateness} />
                            <span className="font-bold mr-2 text-base">التأخر عن موعد بدء اليوم الدراسي بدون عذر في الأيام الموافقة للتواريخ الآتية:</span>
                        </div>
                        <div className="mr-8 mt-1">
                             <DottedLine text={data.reasonLateness ? data.latenessDates : ''} className="w-full text-sm" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-baseline">
                            <CheckBox checked={data.reasonAbsence} />
                            <span className="font-bold mr-2 text-base">التغيب عن المدرسة بدون عذر مقبول في الأيام الموافقة للتوايرخ الآتية :</span>
                        </div>
                        <div className="mr-8 mt-1">
                             <DottedLine text={data.reasonAbsence ? data.absenceDates : ''} className="w-full text-sm" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-baseline">
                            <CheckBox checked={data.reasonBehavior} />
                            <span className="font-bold mr-2 text-base">إتيان السلوكيات الآتية :</span>
                        </div>
                        <div className="mr-8 mt-1">
                             <DottedLine text={data.reasonBehavior ? data.behaviorDetails : ''} className="w-full text-sm" />
                        </div>
                    </div>
                </div>

                <div className="mt-2 text-justify font-bold leading-normal text-sm">
                    <p className="mb-1">
                        وقد قامت إدارة المدرسة بتوجيه الطالب شفوياً وإرشاده إلى عدم تكرار التأخير / الغياب / السلوك.
                    </p>
                    <p className="text-center mt-2 text-base">وتفضلوا بقبول فائق الاحترام والتقدير ....</p>
                </div>

                {/* Signatures Compact */}
                <div className="mt-3 mb-2 relative h-14">
                    <div className="absolute left-0 top-0 text-center w-full flex justify-between px-6">
                        <div className="text-center relative pt-1">
                             <p className="text-sm font-bold mb-2">عضو لجنة شؤون الطلاب</p>
                             {/* Signature Overlay */}
                             {settings?.committeeHeadSignature && (
                                <img src={settings.committeeHeadSignature} className="absolute top-5 left-1/2 transform -translate-x-1/2 h-12 opacity-90 mx-auto mix-blend-multiply" alt="Sig" />
                             )}
                        </div>
                        <div className="text-center relative pt-1">
                             <p className="text-sm font-bold mb-2">يعتمد مدير المدرسة</p>
                             {/* Principal Signature */}
                             {settings?.principalSignature && (
                                <img src={settings.principalSignature} className="absolute top-5 left-1/2 transform -translate-x-1/2 h-14 opacity-90 mx-auto mix-blend-multiply" alt="Sig" />
                             )}
                             {/* Stamp */}
                             {settings?.schoolStamp && (
                                <img src={settings.schoolStamp} className="absolute top-6 left-0 h-14 opacity-80 mix-blend-multiply rotate-[-10deg]" alt="Stamp" />
                             )}
                        </div>
                    </div>
                </div>

                {/* Recipient Info Compact */}
                <div className="ml-auto w-full mt-auto text-xs leading-normal font-bold border-t border-gray-300 pt-1" dir="rtl">
                    <div className="grid grid-cols-2 gap-x-4">
                         <div className="flex mb-1 items-baseline">
                            <span className="min-w-[80px]">اسم المتسلم :</span>
                            <DottedLine text={data.annex5_recipientName} className="flex-1" />
                        </div>
                        <div className="flex mb-1 items-baseline">
                            <span className="min-w-[80px]">الرقم المدني :</span>
                            <DottedLine text={data.annex5_recipientCivilId} className="flex-1" />
                        </div>
                        <div className="flex mb-1 items-baseline">
                            <span className="min-w-[80px]">صلته بالطالب :</span>
                            <DottedLine text={data.annex5_recipientRelation} className="flex-1" />
                        </div>
                        <div className="flex mb-1 items-baseline">
                            <span className="min-w-[80px]">رقم الهاتف :</span>
                            <DottedLine text={data.annex5_recipientPhone} className="flex-1 text-left" />
                        </div>
                    </div>
                    <div className="flex justify-between mt-1">
                        <div className="flex flex-1 items-baseline">
                             <span className="min-w-[50px]">التاريخ :</span>
                             <span dir="ltr" className="flex-1 text-center font-mono border-b border-dotted border-black max-w-[150px]">  /  /  </span>
                        </div>
                        <div className="flex flex-1 items-baseline">
                            <span className="min-w-[50px]">التوقيع :</span>
                            <DottedLine className="flex-1 max-w-[150px]" />
                        </div>
                    </div>
                </div>

                <div className="mt-1 font-bold text-[10px]">
                     <div className="flex gap-2">
                        <span>نسخة إلى :</span>
                        <span>- ملف الطالب</span>
                     </div>
                </div>

            </div>
        </div>
    );
  }

  if (type === FormType.ANNEX_4_ALERT) {
    return (
        <div className="h-full flex flex-col font-serif relative pt-0">
            <div className="flex justify-between items-start mb-2 text-sm">
                <div className="text-right w-1/3 pt-1">
                    <p className="mb-1 text-center font-bold text-base">ملحق رقم ( 4 )</p>
                    <div className="space-y-1 pr-2 text-xs">
                        <div className="flex gap-2"><span className="font-bold">الرقم :</span>.........</div>
                        <div className="flex gap-2"><span className="font-bold">التاريخ :</span><span dir="ltr">{data.incidentDate}</span></div>
                    </div>
                </div>
                <div className="text-left w-1/3 pl-2 text-xs font-bold leading-normal">
                    <p>سلطنة عمان</p>
                    <p>وزارة التعليم</p>
                    <p>المديرية العامة للتعليم بمحافظة شمال الباطنة</p>
                    <p>مدرسة الإبداع للبنين (5-8)</p>
                </div>
            </div>

            <h1 className="text-xl font-bold text-center mb-3 underline">استمارة تنبيه طالب</h1>

            <div className="px-1 text-base leading-normal flex-1">
                <div className="mb-1 flex flex-wrap items-baseline">
                    <span>الفاضل ولي أمر الطالب / الطالبة : </span>
                    <DottedLine text={data.studentName} className="flex-1 font-bold min-w-[200px]" />
                    <span>المسجل / المسجلة</span>
                </div>
                <div className="mb-2 flex flex-wrap items-baseline">
                    <span>بالصف : </span>
                    <DottedLine text={data.grade} className="min-w-[100px] font-bold" />
                    <span className="ml-4">المحترم</span>
                </div>

                <p className="mb-1">السلام عليكم ورحمة الله وبركاته .. وبعد ...</p>

                <div className="text-justify leading-relaxed">
                    <span>إلحاقاً برسالتنا رقم ( </span>
                    <DottedLine text={data.annex4_letterNo} className="min-w-[30px] text-center" />
                    <span>) بتاريخ : </span>
                    <DottedLine text={data.annex4_letterDate} className="min-w-[80px] text-center" />
                    <span>، بشأن </span>
                    <DottedLine text={data.annex4_regarding} className="min-w-[120px] text-center" />
                    <span>، وعملاً بالمادة ( </span>
                    <DottedLine text={data.annex4_articleNo} className="min-w-[30px] text-center" />
                    <span>) من لائحة شؤون الطلاب، نفيدكم بأن لجنة شؤون الطلاب قد قامت بتنبيه الطالب، وذلك بسبب :</span>
                </div>

                <div className="mt-2 space-y-1">
                    <div>
                        <div className="flex items-baseline">
                            <CheckBox checked={data.reasonLateness} />
                            <span className="font-bold mr-2 text-base">التأخر عن موعد بدء اليوم الدراسي بدون عذر :</span>
                        </div>
                        <div className="mr-8 mt-1">
                             <DottedLine text={data.reasonLateness ? data.latenessDates : ''} className="w-full text-sm" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-baseline">
                            <CheckBox checked={data.reasonAbsence} />
                            <span className="font-bold mr-2 text-base">التغيب عن المدرسة بدون عذر مقبول :</span>
                        </div>
                        <div className="mr-8 mt-1">
                             <DottedLine text={data.reasonAbsence ? data.absenceDates : ''} className="w-full text-sm" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-baseline">
                            <CheckBox checked={data.reasonBehavior} />
                            <span className="font-bold mr-2 text-base">إتيان السلوكيات الآتية :</span>
                        </div>
                        <div className="mr-8 mt-1">
                             <DottedLine text={data.reasonBehavior ? data.behaviorDetails : ''} className="w-full text-sm" />
                        </div>
                    </div>
                </div>

                <div className="mt-2 text-justify font-bold leading-normal text-sm">
                    <p className="mb-1">
                        وقد قامت إدارة المدرسة بتوجيه الطالب كتابةً وإحاطته علماً بنتائج المخالفة.
                    </p>
                    <p className="text-center mt-2 text-base">وتفضلوا بقبول فائق الاحترام والتقدير ....</p>
                </div>

                {/* Signatures */}
                <div className="mt-3 mb-2 relative h-14">
                     <div className="absolute left-0 top-0 text-center w-full flex justify-between px-6">
                        <div className="text-center relative pt-1">
                             <p className="text-sm font-bold mb-2">عضو لجنة شؤون الطلاب</p>
                             {settings?.committeeHeadSignature && (
                                <img src={settings.committeeHeadSignature} className="absolute top-5 left-1/2 transform -translate-x-1/2 h-12 opacity-90 mx-auto mix-blend-multiply" alt="Sig" />
                             )}
                        </div>
                        <div className="text-center relative pt-1">
                             <p className="text-sm font-bold mb-2">يعتمد مدير المدرسة</p>
                             {settings?.principalSignature && (
                                <img src={settings.principalSignature} className="absolute top-5 left-1/2 transform -translate-x-1/2 h-14 opacity-90 mx-auto mix-blend-multiply" alt="Sig" />
                             )}
                             {settings?.schoolStamp && (
                                <img src={settings.schoolStamp} className="absolute top-6 left-0 h-14 opacity-80 mix-blend-multiply rotate-[-10deg]" alt="Stamp" />
                             )}
                        </div>
                    </div>
                </div>

                {/* Recipient */}
                <div className="ml-auto w-full mt-auto text-xs leading-normal font-bold border-t border-gray-300 pt-1" dir="rtl">
                    <div className="grid grid-cols-2 gap-x-4">
                        <div className="flex mb-1 items-baseline">
                            <span className="min-w-[80px]">اسم المتسلم :</span>
                            <DottedLine text={data.annex5_recipientName} className="flex-1" />
                        </div>
                        <div className="flex mb-1 items-baseline">
                            <span className="min-w-[80px]">الرقم المدني :</span>
                            <DottedLine text={data.annex5_recipientCivilId} className="flex-1" />
                        </div>
                        <div className="flex mb-1 items-baseline">
                            <span className="min-w-[80px]">صلته بالطالب :</span>
                            <DottedLine text={data.annex5_recipientRelation} className="flex-1" />
                        </div>
                        <div className="flex mb-1 items-baseline">
                            <span className="min-w-[80px]">رقم الهاتف :</span>
                            <DottedLine text={data.annex5_recipientPhone} className="flex-1 text-left" />
                        </div>
                    </div>
                    <div className="flex justify-between mt-1">
                        <div className="flex flex-1 items-baseline">
                             <span className="min-w-[50px]">التاريخ :</span>
                             <span dir="ltr" className="flex-1 text-center font-mono border-b border-dotted border-black max-w-[150px]">  /  /  </span>
                        </div>
                        <div className="flex flex-1 items-baseline">
                            <span className="min-w-[50px]">التوقيع :</span>
                            <DottedLine className="flex-1 max-w-[150px]" />
                        </div>
                    </div>
                </div>

                <div className="mt-1 font-bold text-[10px]">
                     <div className="flex gap-2">
                        <span>نسخة إلى :</span>
                        <span>- ملف الطالب</span>
                     </div>
                </div>
            </div>
        </div>
    );
  }

  if (type === FormType.ANNEX_5_WARNING) {
    return (
        <div className="h-full flex flex-col font-serif relative pt-0">
            <div className="flex justify-between items-start mb-2 text-sm">
                <div className="text-right w-1/3 pt-1">
                    <p className="mb-1 text-center font-bold text-base">ملحق رقم ( 5 )</p>
                    <div className="space-y-1 pr-2 text-xs">
                        <div className="flex gap-2"><span className="font-bold">الرقم :</span>.........</div>
                        <div className="flex gap-2"><span className="font-bold">التاريخ :</span><span dir="ltr">{data.incidentDate}</span></div>
                    </div>
                </div>
                <div className="text-left w-1/3 pl-2 text-xs font-bold leading-normal">
                    <p>سلطنة عمان</p>
                    <p>وزارة التعليم</p>
                    <p>المديرية العامة للتعليم بمحافظة شمال الباطنة</p>
                    <p>مدرسة الإبداع للبنين (5-8)</p>
                </div>
            </div>

            <h1 className="text-xl font-bold text-center mb-3 underline">استمارة إنذار طالب</h1>

            <div className="px-1 text-base leading-normal flex-1">
                <div className="mb-1 flex flex-wrap items-baseline">
                    <span>الفاضل ولي أمر الطالب / الطالبة : </span>
                    <DottedLine text={data.studentName} className="flex-1 font-bold min-w-[200px]" />
                    <span>المسجل / المسجلة</span>
                </div>
                <div className="mb-2 flex flex-wrap items-baseline">
                    <span>بالصف : </span>
                    <DottedLine text={data.grade} className="min-w-[100px] font-bold" />
                    <span className="ml-4">المحترم</span>
                </div>

                <p className="mb-1">السلام عليكم ورحمة الله وبركاته .. وبعد ...</p>

                <div className="text-justify leading-relaxed">
                    <span>إلحاقاً برسالتنا رقم ( </span>
                    <DottedLine text={data.annex5_letter1No} className="min-w-[30px] text-center" />
                    <span>) بتاريخ : </span>
                    <DottedLine text={data.annex5_letter1Date} className="min-w-[80px] text-center" />
                    <span>، وبرسالتنا رقم ( </span>
                    <DottedLine text={data.annex5_letter2No} className="min-w-[30px] text-center" />
                    <span>) بتاريخ : </span>
                    <DottedLine text={data.annex5_letter2Date} className="min-w-[80px] text-center" />
                    <span>بشأن</span>
                    <br />
                    <span>وعملاً بالمادة ( </span>
                    <DottedLine text={data.annex5_articleNo} className="min-w-[30px] text-center" />
                    <span>) من لائحة شؤون الطلاب، نفيدكم بأن إدارة المدرسة قد أنذرت الطالب المذكور، وذلك بسبب :</span>
                </div>

                <div className="mt-2 space-y-1">
                     <div>
                        <div className="flex items-baseline">
                            <CheckBox checked={data.reasonLateness} />
                            <span className="font-bold mr-2 text-base">التأخر عن موعد بدء اليوم الدراسي بدون عذر :</span>
                        </div>
                        <div className="mr-8 mt-1">
                             <DottedLine text={data.reasonLateness ? data.latenessDates : ''} className="w-full text-sm" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-baseline">
                            <CheckBox checked={data.reasonAbsence} />
                            <span className="font-bold mr-2 text-base">التغيب عن المدرسة بدون عذر مقبول :</span>
                        </div>
                        <div className="mr-8 mt-1">
                             <DottedLine text={data.reasonAbsence ? data.absenceDates : ''} className="w-full text-sm" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-baseline">
                            <CheckBox checked={data.reasonBehavior} />
                            <span className="font-bold mr-2 text-base">إتيان السلوكيات الآتية :</span>
                        </div>
                        <div className="mr-8 mt-1">
                             <DottedLine text={data.reasonBehavior ? data.behaviorDetails : ''} className="w-full text-sm" />
                        </div>
                    </div>
                </div>

                <div className="mt-3 text-center font-bold text-sm bg-gray-50 p-2 border border-gray-300 rounded">
                    <p>عليه ، يرجى التكرم بمراجعة إدارة المدرسة في مدة لا تتجاوز ( 7 ) سبعة أيام من تاريخه</p>
                    <p>لمناقشة موضوع الطالب واستكمال بقية الاجراءات.</p>
                </div>
                 <p className="text-center mt-2 text-base font-bold">وتفضلوا بقبول فائق الاحترام والتقدير ....</p>

                <div className="mt-3 mb-2 relative h-14">
                    <div className="absolute left-0 top-0 text-center w-full flex justify-between px-6">
                        <div className="text-center relative pt-1">
                             <p className="text-sm font-bold mb-2">عضو لجنة شؤون الطلاب</p>
                             {settings?.committeeHeadSignature && (
                                <img src={settings.committeeHeadSignature} className="absolute top-5 left-1/2 transform -translate-x-1/2 h-12 opacity-90 mx-auto mix-blend-multiply" alt="Sig" />
                             )}
                        </div>
                        <div className="text-center relative pt-1">
                             <p className="text-sm font-bold mb-2">يعتمد مدير المدرسة</p>
                             {settings?.principalSignature && (
                                <img src={settings.principalSignature} className="absolute top-5 left-1/2 transform -translate-x-1/2 h-14 opacity-90 mx-auto mix-blend-multiply" alt="Sig" />
                             )}
                             {settings?.schoolStamp && (
                                <img src={settings.schoolStamp} className="absolute top-6 left-0 h-14 opacity-80 mix-blend-multiply rotate-[-10deg]" alt="Stamp" />
                             )}
                        </div>
                    </div>
                </div>

                <div className="ml-auto w-full mt-auto text-xs leading-normal font-bold border-t border-gray-300 pt-1" dir="rtl">
                    <div className="grid grid-cols-2 gap-x-4">
                        <div className="flex mb-1 items-baseline">
                            <span className="min-w-[80px]">اسم المتسلم :</span>
                            <DottedLine text={data.annex5_recipientName} className="flex-1" />
                        </div>
                        <div className="flex mb-1 items-baseline">
                            <span className="min-w-[80px]">الرقم المدني :</span>
                            <DottedLine text={data.annex5_recipientCivilId} className="flex-1" />
                        </div>
                        <div className="flex mb-1 items-baseline">
                            <span className="min-w-[80px]">صلته بالطالب :</span>
                            <DottedLine text={data.annex5_recipientRelation} className="flex-1" />
                        </div>
                         <div className="flex mb-1 items-baseline">
                             <span className="min-w-[80px]">رقم الهاتف :</span>
                             <DottedLine text={data.annex5_recipientPhone} className="flex-1 text-left" />
                         </div>
                    </div>
                    <div className="flex justify-between mt-1">
                        <div className="flex flex-1 items-baseline">
                             <span className="min-w-[50px]">التاريخ :</span>
                             <span dir="ltr" className="flex-1 text-center font-mono border-b border-dotted border-black max-w-[150px]">  /  /  </span>
                        </div>
                        <div className="flex flex-1 items-baseline">
                            <span className="min-w-[50px]">التوقيع :</span>
                            <DottedLine className="flex-1 max-w-[150px]" />
                        </div>
                    </div>
                </div>

                <div className="mt-1 font-bold text-[10px]">
                     <div className="flex gap-2">
                        <span>نسخة إلى :</span>
                        <span>- ملف الطالب</span>
                     </div>
                </div>

            </div>
        </div>
    );
  }

  if (type === FormType.INVITATION_SUSPENSION) {
    return (
      <div className="h-full flex flex-col justify-between">
        <div>
            <DocumentHeader logoUrl={settings?.ministryLogo} />
            <div className="text-center mb-4">
                <h1 className="text-xl font-bold underline">استدعاء ولي أمر</h1>
            </div>
            
            <div className="flex justify-between items-center mb-4 px-4 text-base">
                <div>التاريخ: {data.incidentDate}</div>
                <div>الموافق: ....................</div>
            </div>

            <Salutation />

            <div className="mt-2 text-lg leading-relaxed text-justify px-2">
                <p className="font-bold mb-3 text-center text-lg underline">
                    الموضوع: طلب حضور لمناقشة مستوى الطالب / سلوك الطالب
                </p>
                <p className="indent-8 mb-3">
                    نهديكم أطيب التحيات، ونظراً لأهمية التواصل المستمر بين البيت والمدرسة لما فيه مصلحة الطالب ومستقبله الدراسي والسلوكي.
                </p>
                <p className="indent-8">
                    عليه، يرجى التكرم بالحضور إلى مبنى المدرسة لمقابلة لجنة شؤون الطلاب وذلك يوم .................... الموافق .................... في تمام الساعة .................... صباحاً.
                </p>
                
                 <p className="mt-4 font-bold text-red-800 indent-8">
                    وذلك لمناقشة بعض المخالفات السلوكية الصادرة من الطالب واتخاذ الإجراءات التربوية اللازمة.
                 </p>

                <p className="mt-5 text-center font-bold">
                    شاكرين لكم حسن تعاونكم واهتمامكم ،،،
                </p>
            </div>
        </div>

        <DocumentFooter data={data} settings={settings} />

        <div className="border-t-2 border-dashed border-gray-400 pt-2 mt-4 text-sm no-print">
            <p className="text-center font-bold mb-2">إقرار ولي الأمر (يتم تعبئته وإعادته للمدرسة)</p>
            <p>أنا ولي أمر الطالب ................................. أقر باستلامي الدعوة وسأقوم بالحضور في الموعد المحدد.</p>
            <div className="flex justify-end mt-2 ml-10">التوقيع: ....................</div>
        </div>
      </div>
    );
  }

  if (type === FormType.ANNEX_6_PLEDGE) {
     return (
        <div className="h-full flex flex-col font-serif pt-2">
            <div className="flex justify-between items-start mb-2 text-base">
                 <div className="text-right w-1/3"></div>
                 <div className="w-1/3 text-center">
                     <p className="font-bold text-lg mb-1">ملحق رقم ( 6 )</p>
                 </div>
                 <div className="w-1/3"></div>
            </div>

            <div className="flex justify-between items-start mb-2 text-sm">
                <div className="text-right w-1/3 order-1 leading-normal font-bold">
                    <p>سلطنة عمان</p>
                    <p>وزارة التعليم</p>
                    <p>المديرية العامة للتعليم بمحافظة شمال الباطنة</p>
                    <p>مدرسة الإبداع للبنين (5-8)</p>
                </div>
                
                <div className="w-1/3 order-2 flex justify-center -mt-4">
                    {settings?.ministryLogo && (
                        <img 
                            src={settings.ministryLogo} 
                            alt="Ministry Logo" 
                            className="h-16 w-auto object-contain opacity-80" 
                        />
                    )}
                </div>

                <div className="text-left w-1/3 order-3 pl-2 font-bold pt-4">
                    <div className="flex justify-end gap-2 items-center text-sm">
                        <span>العام الدراسي :</span>
                        <span dir="ltr">{data.academicYear}</span>
                    </div>
                </div>
            </div>

            <h1 className="text-xl font-bold text-center mb-4 underline">استمارة تعهد الطالب وولي أمره</h1>

            <div className="px-1 text-base leading-relaxed flex-1">
                
                <div className="mb-2 text-justify flex flex-wrap items-baseline">
                    <span>حضر إلى المدرسة الفاضل / الفاضلة : </span>
                    <DottedLine text={data.guardianName} className="flex-1 font-bold min-w-[200px]" />
                    <span>الرقم المدني ( </span>
                    <DottedLine text={data.guardianCivilId} className="min-w-[100px] text-center" />
                    <span>)</span>
                </div>

                <div className="mb-2 text-justify flex flex-wrap items-baseline">
                    <span>ولي أمر الطالب / الطالبة : </span>
                    <DottedLine text={data.studentName} className="flex-1 font-bold min-w-[200px]" />
                    <span>المسجل بالصف : </span>
                    <DottedLine text={data.grade} className="min-w-[80px] text-center" />
                </div>

                <div className="mb-3 text-justify flex flex-wrap items-baseline">
                    <span>يوم : ............. الموافق : </span>
                    <span dir="ltr" className="mx-2 font-mono">{data.incidentDate}</span>
                    <span>، لمناقشة موضوع الإنذار الموجه إلى ابنه.</span>
                </div>

                <p className="font-bold mb-3 mt-2">وقد تعهد الطالب وولي أمره بـ :</p>

                <div className="space-y-2 mb-4 text-lg">
                     <div className="flex items-center justify-end" dir="ltr">
                        <span className="text-right mr-2 flex-1">عدم التأخر عن موعد بدء اليوم الدراسي بدون عذر مقبول .</span>
                        <CheckBox checked={data.reasonLateness} />
                     </div>
                     <div className="flex items-center justify-end" dir="ltr">
                        <span className="text-right mr-2 flex-1">عدم الغياب عن المدرسة بدون عذر مقبول .</span>
                        <CheckBox checked={data.reasonAbsence} />
                     </div>
                     <div className="flex items-center justify-end" dir="ltr">
                        <span className="text-right mr-2 flex-1">عدم تكرار السلوكيات المنسوبة إليه، والالتزام بأنظمة وقواعد الانضباط السلوكي.</span>
                        <CheckBox checked={data.reasonBehavior} />
                     </div>
                </div>

                <p className="text-justify font-bold mb-4 text-sm leading-normal">
                    وأنه في حال عدم التزامه ستقوم إدارة المدرسة باتخاذ الإجراء الذي تراه مناسباً وفق لائحة شؤون الطلاب.
                </p>

                <div className="flex justify-between items-start mt-4 mb-6 relative text-sm">
                     <div className="w-full flex">
                         <div className="w-1/2 flex flex-col justify-end pb-8 relative">
                             <p className="font-bold mb-4">توقيع عضو لجنة شؤون الطلاب المسؤول :</p>
                            {settings?.committeeHeadSignature && (
                                <img src={settings.committeeHeadSignature} className="absolute bottom-4 left-1/2 transform -translate-x-1/2 h-14 opacity-90 mx-auto mix-blend-multiply" alt="Sig" />
                            )}
                         </div>

                         <div className="w-1/2 flex flex-col items-end gap-2 pl-4">
                             <div className="flex gap-2 w-full justify-end items-baseline">
                                 <span>: توقيع الطالب</span>
                                 <DottedLine className="w-32" />
                             </div>
                             <div className="flex gap-2 w-full justify-end items-baseline">
                                 <span>: توقيع ولي الأمر</span>
                                 <DottedLine className="w-32" />
                             </div>
                             <div className="flex gap-2 w-full justify-end items-baseline">
                                 <span dir="ltr">{data.guardianPhone}</span>
                                 <span>: رقم الهاتف</span>
                                 <DottedLine className="w-24" />
                             </div>
                             <div className="flex gap-2 w-full justify-end items-baseline">
                                 <span dir="ltr">{data.guardianCivilId}</span>
                                 <span>: الرقم المدني</span>
                                 <DottedLine className="w-24" />
                             </div>
                             <div className="flex gap-2 w-full justify-end items-baseline">
                                 <span dir="ltr">{data.incidentDate}</span>
                                 <span>: التاريخ</span>
                                 <div className="w-8"></div>
                             </div>
                         </div>
                     </div>
                </div>

                <div className="flex justify-between items-end mt-auto relative">
                     <div className="text-center font-bold relative text-sm">
                        <p className="mb-2">يعتمد مدير المدرسة</p>
                         {settings?.principalSignature && (
                            <img src={settings.principalSignature} className="h-16 opacity-90 mx-auto mix-blend-multiply" alt="Sig" />
                        )}
                        {settings?.schoolStamp && (
                            <img src={settings.schoolStamp} className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-2 h-16 opacity-80 mix-blend-multiply rotate-[-10deg]" alt="Stamp" />
                        )}

                     </div>

                     <div className="text-right font-bold text-xs">
                        <p>: نسخة إلى</p>
                        <p>ملف الطالب -</p>
                     </div>
                </div>
            </div>
        </div>
     )
  }

  if (type === FormType.ANNEX_14_SUSPENSION) {
    return (
        <div className="h-full flex flex-col font-serif relative pt-0">
             <div className="flex justify-between items-start mb-2 text-sm">
                <div className="text-right w-1/3 pt-1">
                    <p className="mb-1 text-center font-bold text-base">ملحق رقم ( ١٤ )</p>
                    <div className="space-y-1 pr-2 text-xs">
                        <div className="flex gap-2"><span className="font-bold">الرقم :</span>.........</div>
                        <div className="flex gap-2"><span className="font-bold">التاريخ :</span><span dir="ltr">{data.incidentDate}</span></div>
                    </div>
                </div>
                <div className="text-left w-1/3 pl-2 text-xs font-bold leading-normal">
                    <p>سلطنة عمان</p>
                    <p>وزارة التعليم</p>
                    <p>المديرية العامة للتعليم بمحافظة شمال الباطنة</p>
                    <p>مدرسة الإبداع للبنين (5-8)</p>
                </div>
            </div>

            <h1 className="text-xl font-bold text-center mb-4 underline">استمارة فصل مؤقت لطالب</h1>

            <div className="px-1 text-base leading-normal flex-1">
                <div className="mb-1 flex flex-wrap items-baseline">
                    <span>الفاضل ولي أمر الطالب / الطالبة : </span>
                    <DottedLine text={data.studentName} className="flex-1 font-bold min-w-[200px]" />
                    <span>المسجل / المسجلة</span>
                </div>
                <div className="mb-2 flex flex-wrap items-baseline">
                    <span>بالصف : </span>
                    <DottedLine text={data.grade} className="min-w-[100px] font-bold" />
                    <span className="ml-4">المحترم</span>
                </div>

                <p className="mb-2">السلام عليكم ورحمة الله وبركاته .. وبعد ...</p>

                <div className="text-justify leading-relaxed">
                    <span>إلحاقاً برسالتنا رقم ( </span>
                    <DottedLine text={data.annex14_letter1No} className="min-w-[30px] text-center" />
                    <span>) بتاريخ : </span>
                    <DottedLine text={data.annex14_letter1Date} className="min-w-[80px] text-center" />
                    <span>، بشأن </span>
                    <DottedLine text={data.annex14_letter1Subj} className="min-w-[120px] text-center" />
                    <br />
                    <span>وبرسالتنا رقم ( </span>
                    <DottedLine text={data.annex14_letter2No} className="min-w-[30px] text-center" />
                    <span>) بتاريخ : </span>
                    <DottedLine text={data.annex14_letter2Date} className="min-w-[80px] text-center" />
                    <span>بشأن </span>
                    <DottedLine text={data.annex14_letter2Subj} className="min-w-[120px] text-center" />
                    <br />
                    <span>وعملاً بالمادة ( </span>
                    <DottedLine text={data.annex14_articleNo} className="min-w-[30px] text-center" />
                    <span>) من لائحة شؤون الطلاب، نفيدكم بأن لجنة شؤون الطلاب قد قررت فصل الطالب المذكور مؤقتاً لمدة ( </span>
                    <DottedLine text={data.annex14_suspensionDays} className="min-w-[30px] text-center" />
                    <span>) أيام ، وذلك بسبب إتيان السلوكيات الآتية :</span>
                </div>

                <div className="mt-3 mb-3 space-y-2">
                     {data.behaviorDetails ? (
                         <div className="border-b-2 border-dotted border-black leading-loose min-h-[60px] whitespace-pre-wrap text-sm">
                             {data.behaviorDetails}
                         </div>
                     ) : (
                        <>
                             <DottedLine className="w-full" />
                             <DottedLine className="w-full" />
                             <DottedLine className="w-full" />
                        </>
                     )}
                </div>

                <div className="mt-2 text-center font-bold text-sm bg-gray-50 p-2 border border-gray-300 rounded">
                    <p>عليه ، يرجى التكرم بمراجعة إدارة المدرسة خلال مدة الفصل، لمناقشة موضوع الطالب واستكمال بقية الاجراءات.</p>
                </div>
                 <p className="text-center mt-2 text-base font-bold">وتفضلوا بقبول فائق الاحترام والتقدير ....</p>

                <div className="mt-3 mb-3 relative">
                    <div className="flex justify-between items-start">
                        <div className="text-right w-1/2 pl-4 relative pt-2">
                            <p className="mb-2 text-sm font-bold">توقيع عضو لجنة شؤون الطلاب المسؤول :</p>
                            {settings?.committeeHeadSignature && (
                                <img src={settings.committeeHeadSignature} className="absolute top-8 left-1/2 transform -translate-x-1/2 h-14 opacity-90 mx-auto mix-blend-multiply" alt="Sig" />
                            )}
                        </div>
                        <div className="text-left w-1/2 pr-4 relative pt-2">
                            <p className="font-bold mb-2 text-sm">يعتمد مدير المدرسة</p>
                             {settings?.principalSignature && (
                                <img src={settings.principalSignature} className="absolute top-8 left-1/4 h-16 opacity-90 mx-auto mix-blend-multiply" alt="Sig" />
                             )}
                             {settings?.schoolStamp && (
                                <img src={settings.schoolStamp} className="absolute bottom-0 left-0 h-16 opacity-80 mix-blend-multiply rotate-[-10deg]" alt="Stamp" />
                             )}
                        </div>
                    </div>
                </div>

                 <div className="ml-auto w-full mt-auto text-xs leading-normal font-bold border-t border-gray-300 pt-1" dir="rtl">
                    <div className="grid grid-cols-2 gap-x-4">
                        <div className="flex mb-1 items-baseline">
                            <span className="min-w-[80px]">اسم المتسلم :</span>
                            <DottedLine text={data.annex5_recipientName} className="flex-1" />
                        </div>
                        <div className="flex mb-1 items-baseline">
                            <span className="min-w-[80px]">صلته بالطالب :</span>
                            <DottedLine text={data.annex5_recipientRelation} className="flex-1" />
                        </div>
                        <div className="flex mb-1 items-baseline">
                            <span className="min-w-[80px]">الرقم المدني :</span>
                            <DottedLine text={data.annex5_recipientCivilId} className="flex-1" />
                        </div>
                         <div className="flex mb-1 items-baseline">
                             <span className="min-w-[80px]">رقم الهاتف :</span>
                             <DottedLine text={data.annex5_recipientPhone} className="flex-1 text-left" />
                         </div>
                    </div>
                    <div className="flex justify-between mt-1">
                        <div className="flex flex-1 items-baseline">
                             <span className="min-w-[50px]">التاريخ :</span>
                             <span dir="ltr" className="flex-1 text-center font-mono border-b border-dotted border-black max-w-[150px]">  /  /  </span>
                        </div>
                        <div className="flex flex-1 items-baseline">
                            <span className="min-w-[50px]">التوقيع :</span>
                            <DottedLine className="flex-1 max-w-[150px]" />
                        </div>
                    </div>
                     <div className="flex mb-1">
                         <span className="min-w-[90px] text-[10px]">نسخة إلى : ملف الطالب</span>
                    </div>
                </div>

            </div>
        </div>
    );
  }

  return <div>Document Not Found</div>;
};

export default FormRenderer;