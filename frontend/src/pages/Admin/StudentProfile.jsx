import { useEffect, useState } from "react";
import { Eye, EyeOff, UserCircle, Camera, X } from "lucide-react";
import api from "../../utils/api";
import ConfirmSaveModal from "../../components/modals/ConfirmSaveModal.jsx";
import { compressImage } from "../../utils/imageOptimizer";

const StudentProfile = ({ student, isNew, onClose, onUpdated }) => {
    const BASE_URL = api.defaults.baseURL;
    const token = localStorage.getItem("token");

    const today = new Date().toISOString().split("T")[0];

    const [courses, setCourses] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);

    const fullNameInitial = student?.firstname
        ? `${student.firstname} ${student.lastname || ""}`.trim()
        : "";

    const [form, setForm] = useState({
        fullname: fullNameInitial,
        name_bn: student?.name_bn || "",
        rollnumber: student?.rollnumber || "",
        emailid: student?.emailid || "",
        contactnumber: student?.contactnumber || "",
        dateofbirth: student?.dateofbirth || "",
        gender: student?.gender || "Female",
        state: student?.state || "Rangpur",
        city: student?.city || "Nilphamari",
        fathername: student?.fathername || "",
        fathername_bn: student?.fathername_bn || "",
        fatheroccupation: student?.fatheroccupation || "",
        mothername: student?.mothername || "",
        mothername_bn: student?.mothername_bn || "",
        motheroccupation: student?.motheroccupation || "",
        Courcecode: student?.Courcecode || "",
        academic_year: student?.academic_year || "2026",
        semoryear: student?.semoryear || "1",
        optionalsubject: student?.optionalsubject || "",
        admissiondate: student?.admissiondate || today,
        password: ""
    });

    /* ================= Logic Preservation ================= */
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await api.get("/api/courses", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCourses(res.data || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCourses();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // Prevent English in Bengali fields
    const handleBengaliChange = (field, e) => {
        const val = e.target.value.replace(/[a-zA-Z]/g, "");
        setForm(prev => ({ ...prev, [field]: val }));
    };

    // Prevent Bengali in English fields
    const handleEnglishChange = (field, e) => {
        const val = e.target.value.replace(/[\u0980-\u09FF]/g, "");
        setForm(prev => ({ ...prev, [field]: val }));
    };

    const isClass9Or10 = Boolean(
        form.Courcecode && (
            form.Courcecode.includes("9") ||
            form.Courcecode.includes("10") ||
            form.Courcecode.toLowerCase().includes("nine") ||
            form.Courcecode.toLowerCase().includes("ten")
        )
    );

    const isScienceStream = Boolean(
        form.Courcecode && (
            form.Courcecode.toUpperCase().includes("SCI") ||
            form.Courcecode.toLowerCase().includes("science") ||
            form.Courcecode.toLowerCase().includes("বিজ্ঞান")
        )
    );

    const handleCourseChange = (e) => {
        const selectedCourse = e.target.value;
        const isTarget9or10 = selectedCourse.includes("9") || selectedCourse.includes("10");
        setForm(prev => ({
            ...prev,
            Courcecode: selectedCourse,
            optionalsubject: isTarget9or10 ? prev.optionalsubject : ""
        }));
    };

    const getOptionalOptions = () => {
        if (!isClass9Or10) {
            return [{ value: "", label: "প্রযোজ্য নয় (৬ষ্ঠ-৮ম শ্রেণিতে ঐচ্ছিক বিষয় নেই)" }];
        }
        if (isScienceStream) {
            return [
                { value: "", label: "ঐচ্ছিক বিষয় নির্বাচন করুন (Select Optional Subject) *" },
                { value: "Higher Mathematics (উচ্চতর গণিত)", label: "Higher Mathematics (উচ্চতর গণিত)" },
                { value: "Biology (জীববিজ্ঞান)", label: "Biology (জীববিজ্ঞান)" },
                { value: "Agriculture Studies (কৃষি শিক্ষা)", label: "Agriculture Studies (কৃষি শিক্ষা)" },
                { value: "Home Science (গার্হস্থ্য বিজ্ঞান)", label: "Home Science (গার্হস্থ্য বিজ্ঞান)" }
            ];
        }
        return [
            { value: "", label: "ঐচ্ছিক বিষয় নির্বাচন করুন (Select Optional Subject) *" },
            { value: "Agriculture Studies (কৃষি শিক্ষা)", label: "Agriculture Studies (কৃষি শিক্ষা)" },
            { value: "Home Science (গার্হস্থ্য বিজ্ঞান)", label: "Home Science (গার্হস্থ্য বিজ্ঞান)" }
        ];
    };

    const handleSave = async () => {
        setError("");

        if (!form.fullname || !form.fullname.trim()) {
            setError("শিক্ষার্থীর ইংরেজি নাম (English Name) পূরণ করা আবশ্যক।");
            return;
        }
        if (!form.name_bn || !form.name_bn.trim()) {
            setError("শিক্ষার্থীর বাংলা নাম পূরণ করা আবশ্যক।");
            return;
        }
        if (!form.rollnumber) {
            setError("শিক্ষার্থীর রোল নম্বর আবশ্যক।");
            return;
        }
        if (!form.contactnumber || !/^\d{11}$/.test(form.contactnumber.trim())) {
            setError("মোবাইল নম্বর অবশ্যই ঠিক ১১ ডিজিটের হতে হবে (যেমন: 017xxxxxxxx)।");
            return;
        }
        if (!form.dateofbirth) {
            setError("জন্মতারিখ নির্বাচন করুন।");
            return;
        }
        if (!form.fathername || !form.fathername.trim()) {
            setError("পিতার ইংরেজি নাম (Father's Name in English) আবশ্যক।");
            return;
        }
        if (!form.mothername || !form.mothername.trim()) {
            setError("মাতার ইংরেজি নাম (Mother's Name in English) আবশ্যক।");
            return;
        }
        if (!form.Courcecode) {
            setError("শিক্ষার্থীর শ্রেণি (Class) নির্বাচন করুন।");
            return;
        }
        if (isClass9Or10 && (!form.optionalsubject || !form.optionalsubject.trim())) {
            setError("৯ম ও ১০ম শ্রেণির শিক্ষার্থীদের জন্য ৪র্থ/ঐচ্ছিক বিষয় (Optional Subject) নির্বাচন করা আবশ্যক।");
            return;
        }

        const formData = new FormData();

        Object.keys(form).forEach((key) => {
            if (key !== "password") {
                formData.append(key, form[key]);
            }
        });

        // Always ensure semoryear is set for compatibility
        if (!formData.has("semoryear")) {
            formData.append("semoryear", "1");
        }

        // Default password = @Student123@ if blank on creation
        if (isNew) {
            const finalPassword = form.password && form.password.trim() ? form.password.trim() : "@Student123@";
            formData.append("password", finalPassword);
        } else if (form.password && form.password.trim()) {
            formData.append("password", form.password.trim());
        }

        if (selectedFile) {
            formData.append("profilepic", selectedFile);
        }

        try {
            if (isNew) {
                await api.post("/api/student", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                });
            } else {
                await api.put(`/api/student/${student.sr_no}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                });
            }

            onUpdated();
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to save student.");
        }
    };

    const genderOptions = [
        { value: "Female", label: "Female (ছাত্রী)" },
        { value: "Male", label: "Male (ছাত্র)" },
        { value: "Other", label: "Other" }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative bg-white dark:bg-slate-900 w-full max-w-5xl rounded-[2rem] shadow-2xl z-10 overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                            <UserCircle size={22} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                                {isNew ? "নতুন শিক্ষার্থী যোগ করুন (Add Student)" : "শিক্ষার্থীর তথ্য সংশোধন (Edit Student)"}
                            </h3>
                            <p className="text-[11px] text-slate-500">ডিমলা সরকারি বালিকা উচ্চ বিদ্যালয় • একাডেমিক প্রোফাইল</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-xs font-semibold border border-red-100 dark:border-red-800">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Notice Banner */}
                    <div className="bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl p-3.5 text-xs text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                        <span>ℹ️</span>
                        <span>
                            শিক্ষার্থী তার <strong>মোবাইল নম্বর</strong> বা রোল দিয়ে লগইন করতে পারবে। ডিফল্ট পাসওয়ার্ড: <code className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded font-mono font-bold text-indigo-600 dark:text-indigo-300">@Student123@</code>
                        </span>
                    </div>

                    {/* Profile Picture */}
                    <div className="flex flex-col items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="relative group">
                            <div className="h-28 w-28 rounded-full border-4 border-white dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-950 shadow-md">
                                {selectedFile ? (
                                    <img src={URL.createObjectURL(selectedFile)} alt="preview" className="h-full w-full object-cover" />
                                ) : student?.profilepic ? (
                                    <img src={student.profilepic.startsWith("http") ? student.profilepic : `${BASE_URL}/uploads/students/${student.profilepic}`} alt="profile" className="h-full w-full object-cover" />
                                ) : (
                                    <img src={`${BASE_URL}/uploads/students/default.png`} alt="default" className="h-full w-full object-cover" />
                                )}
                            </div>
                            <label className="absolute -bottom-1 -right-1 p-2 bg-indigo-600 text-white rounded-full shadow-lg cursor-pointer hover:bg-indigo-700 transition-all border-2 border-white dark:border-slate-900">
                                <Camera size={15} />
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
                        <span className="text-[11px] font-medium text-slate-500">শিক্ষার্থীর ছবি আপলোড করুন</span>
                    </div>

                    {/* Form Grid */}
                    <form
                        autoComplete="off"
                        onSubmit={(e) => {
                            e.preventDefault();
                            setShowSaveModal(true);
                        }}
                    >
                        {/* Hidden decoy fields */}
                        <input type="text" name="chrome_decoy_user" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
                        <input type="password" name="chrome_decoy_pass" style={{ display: "none" }} tabIndex={-1} autoComplete="new-password" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {/* Student English Name */}
                            <Input
                                required
                                label="শিক্ষার্থীর নাম (English Name)"
                                name="fullname"
                                value={form.fullname}
                                onChange={(e) => handleEnglishChange("fullname", e)}
                                placeholder="e.g. Fatema Tuj Johura"
                            />

                            {/* Student Bangla Name */}
                            <Input
                                required
                                label="শিক্ষার্থীর নাম (বাংলা নাম)"
                                name="name_bn"
                                value={form.name_bn}
                                onChange={(e) => handleBengaliChange("name_bn", e)}
                                placeholder="ফাতেমা তুজ জোহরা"
                            />

                            {/* Roll Number */}
                            <Input
                                required
                                type="number"
                                label="রোল নম্বর (Roll Number)"
                                name="rollnumber"
                                value={form.rollnumber}
                                onChange={handleChange}
                                placeholder="e.g. 101"
                            />

                            {/* Contact Number (Mobile) */}
                            <Input
                                required
                                label="মোবাইল নম্বর (Contact Number - লগইনে ব্যবহৃত)"
                                name="contactnumber"
                                value={form.contactnumber}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, "").slice(0, 11);
                                    setForm(prev => ({ ...prev, contactnumber: val }));
                                }}
                                maxLength={11}
                                placeholder="017xxxxxxxx"
                            />

                            {/* Email */}
                            <Input
                                label="ইমেইল (Email - ঐচ্ছিক / Optional)"
                                name="emailid"
                                type="email"
                                value={form.emailid}
                                onChange={handleChange}
                                placeholder="student@gmail.com"
                            />

                            {/* Date of Birth */}
                            <Input
                                required
                                type="date"
                                label="জন্মতারিখ (Date of Birth)"
                                name="dateofbirth"
                                value={form.dateofbirth}
                                onChange={handleChange}
                            />

                            {/* Father's Name (English - Compulsory) */}
                            <Input
                                required
                                label="পিতার নাম (Father's Name - English)"
                                name="fathername"
                                value={form.fathername}
                                onChange={(e) => handleEnglishChange("fathername", e)}
                                placeholder="e.g. Md. Rafiqul Islam"
                            />

                            {/* Father's Name (Bangla - Optional) */}
                            <Input
                                label="পিতার নাম (বাংলা - ঐচ্ছিক)"
                                name="fathername_bn"
                                value={form.fathername_bn}
                                onChange={(e) => handleBengaliChange("fathername_bn", e)}
                                placeholder="মোঃ রফিকুল ইসলাম"
                            />

                            {/* Father's Occupation */}
                            <Input
                                label="পিতার পেশা (Father Occupation)"
                                name="fatheroccupation"
                                value={form.fatheroccupation}
                                onChange={handleChange}
                                placeholder="e.g. Business / Service"
                            />

                            {/* Mother's Name (English - Compulsory) */}
                            <Input
                                required
                                label="মাতার নাম (Mother's Name - English)"
                                name="mothername"
                                value={form.mothername}
                                onChange={(e) => handleEnglishChange("mothername", e)}
                                placeholder="e.g. Parvin Begum"
                            />

                            {/* Mother's Name (Bangla - Optional) */}
                            <Input
                                label="মাতার নাম (বাংলা - ঐচ্ছিক)"
                                name="mothername_bn"
                                value={form.mothername_bn}
                                onChange={(e) => handleBengaliChange("mothername_bn", e)}
                                placeholder="পারভীন বেগম"
                            />

                            {/* Mother's Occupation */}
                            <Input
                                label="মাতার পেশা (Mother Occupation)"
                                name="motheroccupation"
                                value={form.motheroccupation}
                                onChange={handleChange}
                                placeholder="e.g. Homemaker"
                            />

                            {/* Gender - Default Female */}
                            <Select
                                required
                                label="লিঙ্গ (Gender)"
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                                options={genderOptions}
                            />

                            {/* Class (renamed from Course) */}
                            <Select
                                required
                                label="শ্রেণি (Class)"
                                name="Courcecode"
                                value={form.Courcecode}
                                onChange={handleCourseChange}
                                options={[
                                    { value: "", label: "শ্রেণি নির্বাচন করুন (Select Class) *" },
                                    ...courses.map(c => ({
                                        value: c.course_code,
                                        label: `${c.course_name} (${c.course_code})`
                                    }))
                                ]}
                            />

                            {/* Academic Year */}
                            <Select
                                required
                                label="শিক্ষাবর্ষ (Academic Year)"
                                name="academic_year"
                                value={form.academic_year || "2026"}
                                onChange={handleChange}
                                options={[
                                    { value: "2026", label: "২০২৬ শিক্ষাবর্ষ (2026)" },
                                    { value: "2025", label: "২০২৫ শিক্ষাবর্ষ (2025)" },
                                    { value: "2024", label: "২০২৪ শিক্ষাবর্ষ (2024)" },
                                    { value: "2027", label: "২০২৭ শিক্ষাবর্ষ (2027)" },
                                    { value: "2028", label: "২০২৮ শিক্ষাবর্ষ (2028)" }
                                ]}
                            />

                            {/* Optional Subject (Dropdown for 9/10, Disabled for 6-8) */}
                            {isClass9Or10 ? (
                                <Select
                                    required
                                    label="৪র্থ / ঐচ্ছিক বিষয় (Optional Subject - বাধ্যতামূলক)"
                                    name="optionalsubject"
                                    value={form.optionalsubject}
                                    onChange={handleChange}
                                    options={getOptionalOptions()}
                                />
                            ) : (
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-gray-500 dark:text-gray-400">
                                        ৪র্থ / ঐচ্ছিক বিষয় (Optional Subject)
                                    </label>
                                    <input
                                        disabled
                                        value="ঐচ্ছিক বিষয় নেই (৬ষ্ঠ-৮ম শ্রেণিতে প্রযোজ্য নয়)"
                                        className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 px-3 py-2 rounded-xl text-xs cursor-not-allowed"
                                    />
                                </div>
                            )}

                            {/* Admission Date */}
                            <Input
                                type="date"
                                label="ভর্তির তারিখ (Admission Date)"
                                name="admissiondate"
                                value={form.admissiondate}
                                onChange={handleChange}
                            />

                            {/* Password - Default @Student123@ */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-600 dark:text-gray-300 font-medium flex items-center justify-between">
                                    <span>পাসওয়ার্ড (Password)</span>
                                    <span className="text-[10px] text-indigo-500 font-mono">ডিফল্ট: @Student123@</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="@Student123@"
                                        autoComplete="new-password"
                                        data-lpignore="true"
                                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 px-3 py-2 pr-10 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowPassword(!showPassword);
                                        }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* State */}
                            <Input label="জেলা / বিভাগ (State)" name="state" value={form.state} onChange={handleChange} placeholder="Rangpur" />

                            {/* City */}
                            <Input label="উপজেলা / শহর (City)" name="city" value={form.city} onChange={handleChange} placeholder="Nilphamari" />
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-end gap-3 transition-colors">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-semibold hover:bg-gray-300 transition-all cursor-pointer"
                    >
                        বাতিল (Cancel)
                    </button>

                    <button
                        onClick={() => setShowSaveModal(true)}
                        className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all active:scale-95 cursor-pointer"
                    >
                        {isNew ? "শিক্ষার্থী তৈরি করুন (Create Student)" : "পরিবর্তন সংরক্ষণ করুন (Save Changes)"}
                    </button>
                </div>
            </div>

            <ConfirmSaveModal
                show={showSaveModal}
                title={isNew ? "শিক্ষার্থী তৈরির অনুমোদন" : "তথ্য সংরক্ষণের অনুমোদন"}
                message={
                    isNew
                        ? "আপনি কি নিশ্চিত যে আপনি এই নতুন শিক্ষার্থীকে যুক্ত করতে চান?"
                        : "আপনি কি নিশ্চিত যে আপনি এই তথ্য সংরক্ষণ করতে চান?"
                }
                confirmText={isNew ? "হ্যাঁ, তৈরি করুন" : "হ্যাঁ, সংরক্ষণ করুন"}
                onCancel={() => setShowSaveModal(false)}
                onConfirm={async () => {
                    await handleSave();
                    setShowSaveModal(false);
                }}
            />
        </div>
    );
};

const Input = ({ label, required, autoComplete = "off", ...props }) => (
    <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-600 dark:text-gray-300 font-medium">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            autoComplete={autoComplete}
            {...props}
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 px-3 py-2 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
        />
    </div>
);

const Select = ({ label, options, required, ...props }) => (
    <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-600 dark:text-gray-300 font-medium">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
            {...props}
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 px-3 py-2 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
        >
            {options.map((opt, index) => {
                if (typeof opt === "object") {
                    return (
                        <option key={index} value={opt.value}>
                            {opt.label}
                        </option>
                    );
                }
                return (
                    <option key={opt || "empty"} value={opt}>
                        {opt === "" ? "নির্বাচন করুন (Select)" : opt}
                    </option>
                );
            })}
        </select>
    </div>
);

export default StudentProfile;
