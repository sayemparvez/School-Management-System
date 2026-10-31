import {
    LayoutDashboard,
    BookOpen,
    Users,
    ClipboardCheck,
    GraduationCap,
    BarChart3,
    User,
    Award,
    Banknote,
    Globe
} from "lucide-react";

export const adminNavigation = [
    {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/admin/dashboard",
    },
    {
        name: "Academic",
        icon: BookOpen,
        children: [
            { name: "Classes", path: "/admin/courses" },
            { name: "Class Routine (ক্লাস রুটিন)", path: "/admin/class-routine" },
            { name: "Class Teachers (শ্রেণি শিক্ষক)", path: "/admin/class-teachers" },
            { name: "Subjects", path: "/admin/subjects" },
            { name: "Assign Subjects", path: "/admin/assign-subjects" },
        ],
    },
    {
        name: "Users",
        icon: Users,
        children: [
            { name: "Students", path: "/admin/students" },
            { name: "Ex-Students (প্রাক্তন শিক্ষার্থী)", path: "/admin/ex-students" },
            { name: "Promote Students", path: "/admin/promote-students" },
            { name: "Teachers", path: "/admin/faculties" },
            { name: "Staff (কর্মকর্তা ও কর্মচারী)", path: "/admin/staff" },
            { name: "Admins (অ্যাডমিন কন্ট্রোল)", path: "/admin/manage-admins" },
        ],
    },
    {
        name: "Attendance",
        icon: ClipboardCheck,
        children: [
            { name: "Take Attendance", path: "/admin/take-attendance" },
            { name: "Edit Attendance", path: "/admin/edit-attendance" },
        ],
    },
    {
        name: "Marks",
        icon: GraduationCap,
        children: [
            { name: "Enter Marks", path: "/admin/enter-marks" },
            { name: "Edit Marks", path: "/admin/edit-marks" },
            { name: "Publish Result", path: "/admin/publish-result" },
        ],
    },
    {
        name: "Fees (ফি ব্যবস্থাপনা)",
        icon: Banknote,
        children: [
            { name: "Fee Collection (ফি সংগ্রহ)", path: "/admin/fee-collection" },
            { name: "Fee Structure (ফি কাঠামো)", path: "/admin/fee-structure" },
            { name: "Fee Report (ফি রিপোর্ট)", path: "/admin/fee-report" },
        ],
    },
    {
        name: "Reports",
        icon: BarChart3,
        children: [
            { name: "Attendance Report", path: "/admin/attendance-report" },
            { name: "Marks Report", path: "/admin/marks-report" },
            { name: "Fee Report", path: "/admin/fee-report" },
            { name: "Print Marksheet", path: "/admin/print-marksheet" },
        ],
    },
    {
        name: "Website CMS (ওয়েবসাইট কন্ট্রোল)",
        icon: Globe,
        path: "/cms/dashboard",
    },
    {
        name: "Account",
        icon: User,
        children: [
            { name: "Profile", path: "/admin/profile" },
        ],
    },
];

export const facultyNavigation = [
    {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/faculty/dashboard",
    },
    {
        name: "Attendance",
        icon: ClipboardCheck,
        children: [
            { name: "Take Attendance", path: "/faculty/take-attendance" },
            { name: "Edit Attendance", path: "/faculty/edit-attendance" },
        ],
    },
    {
        name: "Marks",
        icon: GraduationCap,
        children: [
            { name: "Enter Marks", path: "/faculty/enter-marks" },
            { name: "Publish Result", path: "/faculty/publish-result" },
        ],
    },
    {
        name: "Fees (ফি সংগ্রহ)",
        icon: Banknote,
        children: [
            { name: "Fee Collection (ফি আদায়)", path: "/faculty/fee-collection" },
            { name: "Fee Report (ফি রিপোর্ট)", path: "/faculty/fee-report" },
        ],
    },
    {
        name: "Reports",
        icon: BarChart3,
        children: [
            { name: "Attendance Report", path: "/faculty/attendance-report" },
            { name: "Marks Report", path: "/faculty/marks-report" },
            { name: "Fee Report", path: "/faculty/fee-report" },
        ],
    },
    {
        name: "Account",
        icon: User,
        children: [
            { name: "Profile", path: "/faculty/profile" },
        ],
    },
];

export const studentNavigation = [
    {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/student/dashboard",
    },
    {
        name: "Attendance",
        icon: ClipboardCheck,
        path: "/student/attendance",
    },
    {
        name: "Marksheet",
        icon: GraduationCap,
        path: "/student/marksheet",
    },
    {
        name: "My Fees (আমার ফি)",
        icon: Banknote,
        path: "/student/fees",
    },
    {
        name: "Account",
        icon: User,
        children: [
            { name: "My Profile", path: "/student/profile" },
        ],
    },
];

export const navigationByRole = {
    admin: adminNavigation,
    faculty: facultyNavigation,
    student: studentNavigation,
};
