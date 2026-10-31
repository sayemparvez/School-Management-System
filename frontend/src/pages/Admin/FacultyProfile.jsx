import { useState } from "react";
import { Eye, EyeOff, Camera, X, Info, User, CheckCircle2 } from "lucide-react";
import api from "../../utils/api";
import ConfirmSaveModal from "../../components/modals/ConfirmSaveModal.jsx";
import { compressImage } from "../../utils/imageOptimizer";

const SCHOOL_SUBJECTS = [
    "বাংলা (Bangla)",
    "ইংরেজি (English)",
    "গণিত (Mathematics)",
    "ভৌত বিজ্ঞান (Physical Science)",
    "সাধারণ বিজ্ঞান (General Science)",
    "পদার্থবিজ্ঞান (Physics)",
    "রসায়ন (Chemistry)",
    "জীববিজ্ঞান (Biology)",
    "উচ্চতর গণিত (Higher Mathematics)",
    "বাংলাদেশ ও বিশ্বপরিচয় (BGS / Social Science)",
    "তথ্য ও যোগাযোগ প্রযুক্তি (ICT)",
    "ইসলাম ও নৈতিক শিক্ষা (Islamic Studies)",
    "হিন্দুধর্ম ও নৈতিক শিক্ষা (Hindu Religion)",
    "ব্যবসায় শিক্ষা / হিসাববিজ্ঞান (Business Studies)",
    "কৃষি শিক্ষা (Agriculture)",
    "গার্হস্থ্য বিজ্ঞান (Home Science)",
    "চারু ও কারুকলা (Arts & Crafts)",
    "শারীরিক শিক্ষা ও স্বাস্থ্য (Physical Education)",
    "সাধারণ / শ্রেণি শিক্ষক (General / All)",
    "অন্যান্য (Custom)"
];

const POSITION_OPTIONS = [
    "সহকারী শিক্ষক (Assistant Teacher)",
    "সিনিয়র শিক্ষক (Senior Teacher)",
    "সহকারী প্রধান শিক্ষক (Assistant Headmaster)",
    "প্রধান শিক্ষক (ভারপ্রাপ্ত) (Acting Headmaster)",
    "প্রধান শিক্ষক (Headmaster)",
    "অতিথি শিক্ষক (Guest Teacher)",
    "খণ্ডকালীন শিক্ষক (Part-time Teacher)"
];

const GENDER_OPTIONS = ["", "Female", "Male", "Other"];

const FacultyProfile = ({ faculty, onClose, onUpdated }) => {
    const BASE_URL = api.defaults.baseURL;
    const token = localStorage.getItem("token");
    const isNew = !faculty?.sr_no;
    const today = new Date().toISOString().split("T")[0];

    // Extract separate Bengali & English name if already combined as 'বাংলা (English)' or separate fields
    const rawName = faculty?.facultyname || "";
    const nameMatch = rawName.match(/^(.+?)\s*\((.+?)\)$/);
    const initialNameBn = faculty?.name_bn || (nameMatch ? nameMatch[1].trim() : (/[a-zA-Z]/.test(rawName) ? "" : rawName));
    const initialNameEn = nameMatch ? nameMatch[2].trim() : (/[a-zA-Z]/.test(rawName) ? rawName : "");

    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [isCustomSubject, setIsCustomSubject] = useState(
        Boolean(faculty?.subject && !SCHOOL_SUBJECTS.includes(faculty.subject) && faculty.subject !== "NOT ASSIGNED")
    );

    const [form, setForm] = useState({
        pdsid: faculty?.pdsid || "",
        facultyid: faculty?.facultyid || "",
        name_bn: initialNameBn,
        name_en: initialNameEn,
        state: faculty?.state || "Rangpur",
        city: faculty?.city || "Nilphamari",
        emailid: faculty?.emailid || "",
        contactnumber: faculty?.contactnumber || "",
        qualification: faculty?.qualification && faculty.qualification !== "প্রযোজ্য নয়" ? faculty.qualification : "",
        experience: faculty?.experience || "প্রযোজ্য নয়",
        birthdate: faculty?.birthdate ? String(faculty.birthdate).split("T")[0] : "",
        gender: faculty?.gender || "Female",
        courcecode: "NOT ASSIGNED",
        semoryear: 0,
        subject: faculty?.subject || "বাংলা (Bangla)",
        position: faculty?.position || "সহকারী শিক্ষক (Assistant Teacher)",
        joineddate: faculty?.joineddate ? String(faculty.joineddate).split("T")[0] : today,
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleBengaliNameChange = (e) => {
        // Prevent typing or pasting English letters into Bengali field
        const val = e.target.value.replace(/[a-zA-Z]/g, "");
        setForm((prev) => ({ ...prev, name_bn: val }));
    };

    const handleEnglishNameChange = (e) => {
        // Prevent typing or pasting Bengali characters into English field
        const val = e.target.value.replace(/[\u0980-\u09FF]/g, "");
        setForm((prev) => ({ ...prev, name_en: val }));
    };

    const handleSubjectSelect = (e) => {
        const val = e.target.value;
        if (val === "অন্যান্য (Custom)") {
            setIsCustomSubject(true);
            setForm((prev) => ({ ...prev, subject: "" }));
        } else {
            setIsCustomSubject(false);
            setForm((prev) => ({ ...prev, subject: val }));
        }
    };

    const handleSave = async () => {
        setError("");

        if (
            !form.name_en ||
            !form.name_en.trim() ||
            !form.emailid ||
            !form.contactnumber ||
            !form.birthdate ||
            !form.gender
        ) {
            setError("শিক্ষকের ইংরেজি নাম (English Name), ইমেইল, মোবাইল নম্বর, জন্মতারিখ ও লিঙ্গ আবশ্যক।");
            return;
        }

        if (!/^\d{11}$/.test(form.contactnumber.trim())) {
            setError("মোবাইল নম্বর অবশ্যই ঠিক ১১ ডিজিটের হতে হবে (যেমন: 017xxxxxxxx)।");
            return;
        }

        const formData = new FormData();

        formData.append("facultyname", form.name_en.trim());
        formData.append("name_bn", form.name_bn ? form.name_bn.trim() : "");
        formData.append("pdsid", form.pdsid || "");
        formData.append("facultyid", form.facultyid || "");
        formData.append("state", form.state || "Rangpur");
        formData.append("city", form.city || "Nilphamari");
        formData.append("emailid", form.emailid.trim());
        formData.append("contactnumber", form.contactnumber.trim());
        formData.append("qualification", (form.qualification && form.qualification.trim()) ? form.qualification.trim() : "প্রযোজ্য নয়");
        formData.append("experience", form.experience || "প্রযোজ্য নয়");
        formData.append("birthdate", form.birthdate);
        formData.append("gender", form.gender);
        formData.append("courcecode", "NOT ASSIGNED");
        formData.append("semoryear", 0);
        formData.append("subject", form.subject || "বাংলা (Bangla)");
        formData.append("position", form.position || "সহকারী শিক্ষক (Assistant Teacher)");
        formData.append("joineddate", form.joineddate || today);

        // Default password = @DGGHS123@ if blank on creation
        if (isNew) {
            const finalPassword = form.password && form.password.trim() ? form.password.trim() : "@DGGHS123@";
            formData.append("password", finalPassword);
        } else if (form.password && form.password.trim()) {
            formData.append("password", form.password.trim());
        }

        if (selectedFile) {
            formData.append("profilepic", selectedFile);
        }

        try {
            if (isNew) {
                await api.post(
                    "/api/faculty",
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                await api.put(
                    `/api/faculty/${faculty.sr_no}`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            onUpdated();
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "শিক্ষকের তথ্য সংরক্ষণ করতে ব্যর্থ হয়েছে।");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl z-10 overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 sm:px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/70 dark:bg-slate-900/70">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
                                {isNew ? "নতুন শিক্ষক যোগ করুন (Add Teacher)" : "শিক্ষকের তথ্য সম্পাদনা (Edit Teacher)"}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয় • শিক্ষক পরিচিতি ও লগইন ব্যবস্থাপনা
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Body - Note: form has autoComplete="off" and dummy inputs to block browser autofill */}
                <form
                    autoComplete="off"
                    onSubmit={(e) => { e.preventDefault(); setShowSaveModal(true); }}
                    className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {/* Dummy inputs to trap browser password managers */}
                    <input type="text" name="fakeusernameremembered" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
                    <input type="password" name="fakepasswordremembered" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

                    {/* Notice on Login Credentials & Password Changing */}
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800/40 rounded-2xl text-xs text-slate-700 dark:text-slate-300">
                        <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-500" />
                        <div className="space-y-1">
                            <div>
                                <span className="font-bold text-blue-900 dark:text-blue-300">লগইন আইডি:</span> শিক্ষক তাঁর <strong>ইমেইল</strong>, <strong>মোবাইল নম্বর</strong> অথবা <strong>PDS ID</strong> ব্যবহার করে লগইন করতে পারবেন।
                            </div>
                            <div>
                                <span className="font-bold text-indigo-900 dark:text-indigo-300">ডিফল্ট পাসওয়ার্ড:</span> <code className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">@DGGHS123@</code>। শিক্ষক লগইন করার পর তাঁর প্রোফাইল থেকে যেকোনো সময় পাসওয়ার্ড পরিবর্তন করে নিতে পারবেন।
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-xs font-semibold border border-red-100 dark:border-red-800">
                            {error}
                        </div>
                    )}

                    {/* Profile Picture Section */}
                    <div className="flex flex-col items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="relative group">
                            <div className="h-28 w-28 rounded-full border-4 border-white dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-950 shadow-md">
                                {selectedFile ? (
                                    <img src={URL.createObjectURL(selectedFile)} alt="preview" className="h-full w-full object-cover" />
                                ) : faculty?.profilepic ? (
                                    <img src={faculty.profilepic.startsWith("http") ? faculty.profilepic : `${BASE_URL}/uploads/faculties/${faculty.profilepic}`} alt="profile" className="h-full w-full object-cover" />
                                ) : (
                                    <img src={`${BASE_URL}/uploads/faculties/default.png`} alt="default" className="h-full w-full object-cover" />
                                )}
                            </div>
                            <label className="absolute -bottom-1 -right-1 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg cursor-pointer transition-all border-2 border-white dark:border-slate-900 active:scale-95">
                                <Camera size={16} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const optimized = await compressImage(file, { maxWidth: 500, maxHeight: 500 });
                                        setSelectedFile(optimized);
                                    }}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">শিক্ষকের ছবি আপলোড করুন</span>
                    </div>

                    {/* Main Fields Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        
                        {/* PDS ID */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                PDS ID (ঐচ্ছিক / সরকারি শিক্ষক কোড)
                            </label>
                            <input
                                type="text"
                                name="pdsid"
                                value={form.pdsid}
                                onChange={handleChange}
                                placeholder="2011050"
                                autoComplete="off"
                                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                        </div>

                        {/* Name (Bengali) - Optional, blocks English letters */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                                <span>শিক্ষকের নাম (বাংলা)</span>
                                <span className="text-[10px] text-slate-400 font-normal">ঐচ্ছিক / Optional</span>
                            </label>
                            <input
                                type="text"
                                name="name_bn"
                                value={form.name_bn}
                                onChange={handleBengaliNameChange}
                                placeholder="মোঃ শাইক পারভেজ"
                                autoComplete="off"
                                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                        </div>

                        {/* Name (English) - Compulsory, blocks Bengali characters */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                শিক্ষকের নাম (English) <span className="text-red-500">*</span>
                            </label>
                            <input
                                required
                                type="text"
                                name="name_en"
                                value={form.name_en}
                                onChange={handleEnglishNameChange}
                                placeholder="Md Shaik Parvez"
                                autoComplete="off"
                                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                        </div>

                        {/* Position / Designation */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                পদবি (Designation) <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="position"
                                value={form.position}
                                onChange={handleChange}
                                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                            >
                                {POSITION_OPTIONS.map((pos) => (
                                    <option key={pos} value={pos}>{pos}</option>
                                ))}
                            </select>
                        </div>

                        {/* Teaching Subject */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                পাঠদানের বিষয় (Teaching Subject) <span className="text-red-500">*</span>
                            </label>
                            {!isCustomSubject ? (
                                <select
                                    value={form.subject}
                                    onChange={handleSubjectSelect}
                                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                                >
                                    {SCHOOL_SUBJECTS.map((sub) => (
                                        <option key={sub} value={sub}>{sub}</option>
                                    ))}
                                </select>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        name="subject"
                                        value={form.subject}
                                        onChange={handleChange}
                                        placeholder="বিষয়ের নাম লিখুন (চারু ও কারুকলা)"
                                        autoComplete="off"
                                        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => { setIsCustomSubject(false); setForm((p) => ({ ...p, subject: "বাংলা (Bangla)" })); }}
                                        className="px-2.5 py-2.5 text-xs font-bold bg-slate-200 dark:bg-slate-700 rounded-xl hover:bg-slate-300"
                                        title="তালিকায় ফিরে যান"
                                    >
                                        তালিকা
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Qualification - Now Optional */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                                <span>শিক্ষাগত যোগ্যতা (Qualification)</span>
                                <span className="text-[10px] text-slate-400 font-normal">ঐচ্ছিক / Optional</span>
                            </label>
                            <input
                                type="text"
                                name="qualification"
                                value={form.qualification}
                                onChange={handleChange}
                                placeholder="বি.এসসি (গণিত), বি.এড"
                                autoComplete="off"
                                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                ইমেইল (Email - লগইনের কাজে ব্যবহৃত) <span className="text-red-500">*</span>
                            </label>
                            <input
                                required
                                type="email"
                                name="emailid"
                                value={form.emailid}
                                onChange={handleChange}
                                placeholder="teacher@school.edu.bd"
                                autoComplete="off"
                                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                        </div>

                        {/* Contact Number */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                মোবাইল নম্বর (Phone - লগইন করা যাবে) <span className="text-red-500">*</span>
                            </label>
                            <input
                                required
                                type="text"
                                name="contactnumber"
                                value={form.contactnumber}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, "").slice(0, 11);
                                    setForm(prev => ({ ...prev, contactnumber: val }));
                                }}
                                maxLength={11}
                                placeholder="017xxxxxxxx"
                                autoComplete="off"
                                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                        </div>

                        {/* Birth Date */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                জন্মতারিখ (Birth Date) <span className="text-red-500">*</span>
                            </label>
                            <input
                                required
                                type="date"
                                name="birthdate"
                                value={form.birthdate}
                                onChange={handleChange}
                                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                        </div>

                        {/* Gender */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                লিঙ্গ (Gender) <span className="text-red-500">*</span>
                            </label>
                            <select
                                required
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                            >
                                <option value="">নির্বাচন করুন</option>
                                <option value="Female">Female (মহিলা)</option>
                                <option value="Male">Male (পুরুষ)</option>
                                <option value="Other">Other (অন্যান্য)</option>
                            </select>
                        </div>

                        {/* Joined Date */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                যোগদানের তারিখ (Joined Date)
                            </label>
                            <input
                                type="date"
                                name="joineddate"
                                value={form.joineddate}
                                onChange={handleChange}
                                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                        </div>

                        {/* Password with Default: @DGGHS123@ */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                                <span>পাসওয়ার্ড (Password)</span>
                                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-900/40 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800/60">
                                    ডিফল্ট: @DGGHS123@
                                </span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="@DGGHS123@"
                                    autoComplete="new-password"
                                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 px-3.5 py-2.5 pr-10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                                />
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setShowPassword(!showPassword); }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                খালি রাখলে ডিফল্ট পাসওয়ার্ড <strong className="text-slate-700 dark:text-slate-300">@DGGHS123@</strong> সেট হবে।
                            </p>
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
                        >
                            বাতিল করুন (Cancel)
                        </button>
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-7 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
                        >
                            {isNew ? "শিক্ষক তৈরি করুন (Create Teacher)" : "সংরক্ষণ করুন (Save Changes)"}
                        </button>
                    </div>
                </form>
            </div>

            <ConfirmSaveModal
                show={showSaveModal}
                title={isNew ? "শিক্ষক সংরক্ষণের নিশ্চিতকরণ" : "শিক্ষক তথ্য পরিবর্তনের নিশ্চিতকরণ"}
                message={
                    isNew
                        ? `আপনি কি "${form.name_en || form.name_bn || 'এই শিক্ষক'}"-কে শিক্ষক তালিকায় অন্তর্ভুক্ত করতে চান?`
                        : "আপনি কি শিক্ষকের তথ্যের এই পরিবর্তনগুলো সংরক্ষণ করতে চান?"
                }
                confirmText={isNew ? "তৈরি করুন" : "সংরক্ষণ করুন"}
                onCancel={() => setShowSaveModal(false)}
                onConfirm={async () => {
                    await handleSave();
                    setShowSaveModal(false);
                }}
            />
        </div>
    );
};

export default FacultyProfile;
