import { Printer, X, CheckCircle2 } from "lucide-react";

export default function MoneyReceiptModal({ isOpen, onClose, receipt }) {
  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* MODAL CONTROLS */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> মানি রসিদ (Money Receipt)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" /> প্রিন্ট করুন (Print)
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEIPT CONTENT */}
        <div id="printable-receipt" className="p-6 sm:p-8 space-y-5 bg-white text-slate-900">
          
          {/* Institutional Header */}
          <div className="text-center border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black tracking-tight text-slate-900">
              ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয়
            </h2>
            <p className="text-xs font-semibold text-slate-600">
              Dimla Government Girls' High School, Nilphamari
            </p>
            <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-700 mt-1">
              ফি আদায় মানি রসিদ (Official Money Receipt)
            </p>
          </div>

          {/* Receipt Meta */}
          <div className="flex items-center justify-between text-xs border-b border-dashed border-slate-200 pb-3">
            <div>
              <span className="text-slate-500 font-medium">রসিদ নং: </span>
              <strong className="font-mono font-bold text-slate-800">{receipt.receipt_no}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-medium">তারিখ: </span>
              <strong className="font-bold text-slate-800">
                {receipt.payment_date ? new Date(receipt.payment_date).toLocaleDateString("bn-BD") : "N/A"}
              </strong>
            </div>
          </div>

          {/* Student Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">শিক্ষার্থীর নাম</span>
              <strong className="text-slate-800 font-bold">{receipt.student_name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">শ্রেণি ও রোল</span>
              <strong className="text-slate-800 font-bold">{receipt.course_name || receipt.course_code} (রোল: {receipt.student_rollnumber})</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">শিক্ষাবর্ষ</span>
              <strong className="text-slate-800">{receipt.academic_year || "2026"}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">পদ্ধতি</span>
              <strong className="text-slate-800 uppercase font-semibold">{receipt.payment_method || "নগদ (Cash)"}</strong>
            </div>
          </div>

          {/* Payment Particulars */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-slate-100 font-bold text-slate-700">
                <tr>
                  <th className="px-3 py-2 text-left">বিবরণ (Particulars)</th>
                  <th className="px-3 py-2 text-center">মাস / টার্ম</th>
                  <th className="px-3 py-2 text-right">টাকা (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {receipt.items && receipt.items.length > 0 ? (
                  receipt.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-3 py-2 font-semibold text-slate-800">
                        {item.fee_name || item.fee_type}
                        {Number(item.discount_waiver) > 0 && (
                          <span className="block text-[10px] text-emerald-600 font-bold">
                            (বৃত্তি/উপবৃত্তি মওকুফ: ৳{Number(item.discount_waiver)})
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center text-slate-600">
                        {item.month_name || "বাৎসরিক / এককালীন"}
                      </td>
                      <td className="px-3 py-2 text-right font-mono font-bold text-slate-900">
                        ৳ {Number(item.amount_paid).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-3 py-2.5 font-semibold text-slate-800">
                      {receipt.fee_name || receipt.fee_type}
                    </td>
                    <td className="px-3 py-2.5 text-center text-slate-600">
                      {receipt.month_name || "বাৎসরিক / এককালীন"}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono font-bold text-slate-900">
                      ৳ {Number(receipt.amount_paid).toFixed(2)}
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200 font-bold text-slate-900">
                <tr>
                  <td colSpan="2" className="px-3 py-2 text-right">সর্বমোট আদায়:</td>
                  <td className="px-3 py-2 text-right font-mono text-sm text-indigo-700 font-black">
                    ৳ {Number(receipt.total_paid || receipt.amount_paid).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {receipt.notes && (
            <p className="text-[11px] text-slate-500 italic">
              মন্তব্য: {receipt.notes}
            </p>
          )}

          {/* Signatures */}
          <div className="pt-8 flex items-end justify-between text-xs text-slate-600">
            <div className="text-center">
              <div className="w-28 border-t border-slate-300 mb-1"></div>
              <span className="text-[10px] font-semibold text-slate-500">শিক্ষার্থী / অভিভাবক</span>
            </div>
            <div className="text-center">
              <div className="w-36 border-t border-slate-300 mb-1"></div>
              <strong className="block text-[11px] font-bold text-slate-800">
                {receipt.collected_by_name || "শ্রেণি শিক্ষক / অ্যাডমিন"}
              </strong>
              <span className="text-[10px] text-slate-500">
                ({receipt.collected_by_role || "আদায়কারী কর্মকর্তা"})
              </span>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-[9px] text-slate-400">
              * ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয় অটোমেশন সিস্টেম কর্তৃক প্রস্তুতকৃত ডিজিটাল মানি রসিদ *
            </p>
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-950/60 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            বন্ধ করুন (Close)
          </button>
        </div>

      </div>
    </div>
  );
}
