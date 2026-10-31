import { useState, useEffect, useMemo } from "react";
import api from "../../utils/api";
import AdminPageHeader from "../../components/ui/AdminPageHeader.jsx";
import Toast from "../../components/ui/Toast.jsx";
import ConfirmDeleteModal from "../../components/modals/ConfirmDeleteModal.jsx";
import { 
  ShieldCheck, 
  UserPlus, 
  Shield, 
  Trash2, 
  Lock, 
  KeyRound, 
  Mail, 
  Phone, 
  CheckCircle2, 
  AlertCircle,
  X,
  UserCheck
} from "lucide-react";

export default function ManageAdmins() {
  const token = localStorage.getItem("token");
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  // Add Admin Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    emailid: "",
    contactnumber: "",
    password: "",
    role: "admin",
    is_super_admin: false
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Delete Admin State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Role Edit State
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [selectedRole, setSelectedRole] = useState("admin");

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/admin/all-admins", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const list = Array.isArray(res.data)
        ? res.data
        : (Array.isArray(res.data?.admins) ? res.data.admins : []);
      setAdmins(list);
    } catch (err) {
      console.error("Fetch admins error:", err);
      setError(err.response?.data?.message || "অ্যাডমিনদের তালিকা লোড করতে ব্যর্থ হয়েছে।");
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [token]);

  const handlePhoneInput = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 11);
    setFormData(prev => ({ ...prev, contactnumber: val }));
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim()) {
      setFormError("অ্যাডমিনের পুরো নাম লিখুন।");
      return;
    }
    if (!formData.emailid.trim() || !formData.emailid.includes("@")) {
      setFormError("সঠিক ইমেইল এড্রেস লিখুন।");
      return;
    }
    if (!formData.contactnumber || !/^\d{11}$/.test(formData.contactnumber.trim())) {
      setFormError("মোবাইল নম্বর অবশ্যই ঠিক ১১ ডিজিটের হতে হবে (যেমন: 017xxxxxxxx)।");
      return;
    }

    try {
      setFormSubmitting(true);
      const res = await api.post("/api/admin/create-admin", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setToast({ type: "success", message: res.data?.message || "নতুন অ্যাডমিন সফলভাবে তৈরি হয়েছে!" });
      setShowAddModal(false);
      setFormData({
        name: "",
        emailid: "",
        contactnumber: "",
        password: "",
        role: "admin",
        is_super_admin: false
      });
      fetchAdmins();
    } catch (err) {
      console.error("Create admin error:", err);
      setFormError(err.response?.data?.message || "অ্যাডমিন তৈরি করতে ব্যর্থ হয়েছে।");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleUpdateRole = async (adminId, newRole) => {
    try {
      await api.put(`/api/admin/update-admin-role/${adminId}`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setToast({ type: "success", message: "অ্যাডমিন রোল সফলভাবে আপডেট হয়েছে।" });
      setEditingAdmin(null);
      fetchAdmins();
    } catch (err) {
      setToast({ type: "error", message: err.response?.data?.message || "রোল আপডেট করতে সমস্যা হয়েছে।" });
    }
  };

  const handleDeleteAdmin = async () => {
    if (!adminToDelete) return;
    try {
      setDeleteLoading(true);
      const res = await api.delete(`/api/admin/delete-admin/${adminToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setToast({ type: "success", message: res.data?.message || "অ্যাডমিন সফলভাবে ডিলিট করা হয়েছে।" });
      setShowDeleteModal(false);
      setAdminToDelete(null);
      fetchAdmins();
    } catch (err) {
      setToast({ type: "error", message: err.response?.data?.message || "অ্যাডমিন ডিলিট করতে সমস্যা হয়েছে।" });
    } finally {
      setDeleteLoading(false);
    }
  };

  const roleNameMap = {
    super_admin: "সুপার অ্যাডমিন (Super Admin)",
    admin: "সাধারণ অ্যাডমিন (Admin)",
    academic_head: "একাডেমিক প্রধান (Academic Head)",
    exam_controller: "পরীক্ষা নিয়ন্ত্রক (Exam Controller)"
  };

  const safeAdmins = useMemo(() => (Array.isArray(admins) ? admins : []), [admins]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in">
      
      {/* HEADER */}
      <AdminPageHeader
        badge="সুপার অ্যাডমিন • কন্ট্রোল প্যানেল"
        badgeIcon={ShieldCheck}
        title="সুপার অ্যাডমিন কন্ট্রোল ও অ্যাডমিন ব্যবস্থাপনা"
        subtitle="সিস্টেমের সকল অ্যাডমিন তৈরি, পদমর্যাদা (Role) পরিবর্তন এবং পরিচালনা করুন"
      >
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>নতুন অ্যাডমিন যোগ করুন</span>
        </button>
      </AdminPageHeader>

      {/* SUPER ADMIN PROTECTION BANNER */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border border-emerald-500/30 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 flex-shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                প্রধান সুপার অ্যাডমিন নিরাপত্তা কবচ (Permanent Super Admin)
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                সুরক্ষিত
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              আপনার অ্যাকাউন্ট (<strong className="text-emerald-300 font-mono">psayem0@gmail.com</strong>) স্থায়ীভাবে <strong>সুপার অ্যাডমিন</strong> হিসেবে নিবন্ধিত। আপনি যে কাউকে অ্যাডমিন বানাতে, তার রোল পরিবর্তন বা ডিলিট করতে পারবেন—কিন্তু আপনাকে কেউ ডিলিট বা পরিবর্তন করতে পারবে না।
            </p>
          </div>
        </div>
      </div>

      {/* ERROR NOTICE */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ADMINS TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-500" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
              নিবন্ধিত অ্যাডমিনদের তালিকা ({safeAdmins.length} জন)
            </h4>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3.5">অ্যাডমিনের নাম</th>
                <th className="px-4 py-3.5">ইমেইল (লগইন আইডি)</th>
                <th className="px-4 py-3.5">মোবাইল নম্বর</th>
                <th className="px-4 py-3.5">বর্তমান পদমর্যাদা (Role)</th>
                <th className="px-4 py-3.5 text-center">নিরাপত্তা স্ট্যাটাস</th>
                <th className="px-4 py-3.5 text-right">কার্যক্রম (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    <div className="w-7 h-7 border-3 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin mx-auto mb-2"></div>
                    অ্যাডমিন তালিকা লোড হচ্ছে...
                  </td>
                </tr>
              ) : safeAdmins.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    কোনো অ্যাডমিন রেকর্ড পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                safeAdmins.map((adm) => {
                  const isPrimarySuperAdmin = adm.emailid === "psayem0@gmail.com" || adm.is_super_admin;
                  return (
                    <tr 
                      key={adm.id} 
                      className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors ${
                        isPrimarySuperAdmin ? "bg-emerald-50/30 dark:bg-emerald-950/10" : ""
                      }`}
                    >
                      {/* NAME */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            isPrimarySuperAdmin 
                              ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/30" 
                              : "bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300"
                          }`}>
                            {adm.name ? adm.name.charAt(0).toUpperCase() : "A"}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block text-sm">
                              {adm.name || "System Admin"}
                            </span>
                            {isPrimarySuperAdmin && (
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> মাস্টার কন্ট্রোলার
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* EMAIL */}
                      <td className="px-4 py-3.5 font-mono text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{adm.emailid}</span>
                        </div>
                      </td>

                      {/* PHONE */}
                      <td className="px-4 py-3.5 font-mono text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{adm.contactnumber || "017xxxxxxxx"}</span>
                        </div>
                      </td>

                      {/* ROLE */}
                      <td className="px-4 py-3.5">
                        {isPrimarySuperAdmin ? (
                          <span className="px-3 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1.5 w-fit">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            সুপার অ্যাডমিন (Super Admin)
                          </span>
                        ) : (
                          <select
                            value={adm.role || "admin"}
                            onChange={(e) => handleUpdateRole(adm.id, e.target.value)}
                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                          >
                            <option value="admin">সাধারণ অ্যাডমিন (Admin)</option>
                            <option value="academic_head">একাডেমিক প্রধান (Academic Head)</option>
                            <option value="exam_controller">পরীক্ষা নিয়ন্ত্রক (Exam Controller)</option>
                            <option value="super_admin">সুপার অ্যাডমিন (Super Admin)</option>
                          </select>
                        )}
                      </td>

                      {/* SECURITY STATUS */}
                      <td className="px-4 py-3.5 text-center">
                        {isPrimarySuperAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black bg-emerald-100/80 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300/50">
                            <Lock className="w-3 h-3 text-emerald-600" />
                            চিরতরে সুরক্ষিত (Immune)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            পরিবর্তনযোগ্য
                          </span>
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-4 py-3.5 text-right">
                        {isPrimarySuperAdmin ? (
                          <button
                            disabled
                            className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800/50 cursor-not-allowed flex items-center gap-1.5 ml-auto border border-dashed border-slate-300 dark:border-slate-700"
                            title="সুপার অ্যাডমিন অ্যাকাউন্ট কোনোভাবেই ডিলিট করা সম্ভব নয়"
                          >
                            <Lock className="w-3.5 h-3.5 text-emerald-600" />
                            <span>ডিলিট নিষিদ্ধ</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setAdminToDelete(adm);
                              setShowDeleteModal(true);
                            }}
                            className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-red-600 dark:text-red-400 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 transition-all flex items-center gap-1.5 ml-auto active:scale-95 cursor-pointer"
                            title="এই অ্যাডমিন ডিলিট করুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>ডিলিট (Delete)</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD ADMIN MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-500/20">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    নতুন অ্যাডমিন নিয়োগ / তৈরি করুন
                  </h3>
                  <p className="text-xs text-slate-500">
                    সিস্টেমের জন্য নতুন প্রশাসনিক একাউন্ট তৈরি করুন
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="p-4 sm:p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  অ্যাডমিনের পুরো নাম <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="যেমন: মোঃ শাইক পারভেজ"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ইমেইল এড্রেস (লগইন ইউজারনেম) <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="email"
                  placeholder="admin@school.edu.bd"
                  value={formData.emailid}
                  onChange={(e) => setFormData(prev => ({ ...prev, emailid: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  মোবাইল নম্বর (১১ ডিজিট আবশ্যক) <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  maxLength={11}
                  placeholder="017xxxxxxxx"
                  value={formData.contactnumber}
                  onChange={handlePhoneInput}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  লগইন পাসওয়ার্ড (খালি রাখলে ডিফল্ট: @Admin123@)
                </label>
                <input
                  type="text"
                  placeholder="@Admin123@"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  অ্যাডমিন পদমর্যাদা (Role) <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => {
                    const r = e.target.value;
                    setFormData(prev => ({ ...prev, role: r, is_super_admin: r === "super_admin" }));
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer font-bold"
                >
                  <option value="admin">সাধারণ অ্যাডমিন (Admin)</option>
                  <option value="academic_head">একাডেমিক প্রধান (Academic Head)</option>
                  <option value="exam_controller">পরীক্ষা নিয়ন্ত্রক (Exam Controller)</option>
                  <option value="super_admin">সুপার অ্যাডমিন (Super Admin)</option>
                </select>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {formSubmitting ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>অ্যাডমিন অ্যাকাউন্ট তৈরি করুন</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmDeleteModal
        show={showDeleteModal}
        title="অ্যাডমিন ডিলিট নিশ্চিতকরণ"
        message={`আপনি কি নিশ্চিতভাবে অ্যাডমিন "${adminToDelete?.name}" (${adminToDelete?.emailid}) কে সিস্টেম থেকে মুছে ফেলতে চান?`}
        loading={deleteLoading}
        onCancel={() => {
          setShowDeleteModal(false);
          setAdminToDelete(null);
        }}
        onConfirm={handleDeleteAdmin}
      />

      {/* TOAST NOTIFICATION */}
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

    </div>
  );
}
