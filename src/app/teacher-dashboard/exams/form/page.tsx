'use client';
import { useEffect, useState, Suspense } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/utils/api';
import { Menu, ChevronDown, CheckCircle, ArrowLeft, UploadCloud, X, Eye, Plus } from 'lucide-react';
import Cookies from 'js-cookie';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';

function ExamFormInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('id');

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [teacherName, setTeacherName] = useState('Teacher Name');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [students, setStudents] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        studentId: '',
        classInfo: '',
        phoneInfo: '',
        subject: '',
        examMonth: '',
        examDate: new Date().toISOString().split('T')[0],
        marks: '',
        maxMarks: '',
        paperImage: '',
        paperImages: [] as string[],
        progressNote: ''
    });

    const [uploadProgressText, setUploadProgressText] = useState('');

    useEffect(() => {
        const userStr = Cookies.get('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.name) setTeacherName(user.name);
            } catch (e) { }
        }

        // Fetch meta data
        Promise.all([
            api.get('/students'),
            api.get('/subjects')
        ]).then(([resSt, resSu]) => {
            setStudents(resSt.data);
            setSubjects(resSu.data);

            if (editId) {
                // Fetch editing details
                api.get(`/exams/${editId}`).then((res) => {
                    const e = res.data;
                    const existingImages: string[] = Array.isArray(e.paperImages) && e.paperImages.length > 0
                        ? e.paperImages
                        : (e.paperImage ? [e.paperImage] : []);

                    setFormData({
                        studentId: e.studentId?._id || '',
                        classInfo: e.studentId?.class || '',
                        phoneInfo: e.studentId?.phone || e.studentId?.contactNumber || '',
                        subject: e.subject || '',
                        examMonth: e.examMonth || '',
                        examDate: e.examDate ? new Date(e.examDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                        marks: e.marks || '',
                        maxMarks: e.maxMarks || '',
                        paperImage: existingImages[0] || '',
                        paperImages: existingImages,
                        progressNote: e.progressNote || ''
                    });
                }).catch(() => toast.error("Failed to load edit payload"));
            }
        }).catch(console.error);
    }, [editId]);

    const handleStudentChange = (id: string) => {
        const student = students.find(s => s._id === id);
        if (student) {
            setFormData({
                ...formData,
                studentId: id,
                classInfo: student.class || '-',
                phoneInfo: student.contactNumber || student.phone || '-',
            });
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const fileList = Array.from(files);
        setIsUploading(true);
        const uploadedUrls: string[] = [];

        try {
            for (let i = 0; i < fileList.length; i++) {
                const file = fileList[i];
                setUploadProgressText(`Uploading page ${i + 1} of ${fileList.length}...`);

                const formDataCloud = new FormData();
                formDataCloud.append('file', file);
                formDataCloud.append('upload_preset', 'brightpath-exam-papers');

                const res = await fetch('https://api.cloudinary.com/v1_1/dfetresky/image/upload', {
                    method: 'POST',
                    body: formDataCloud,
                });

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(errorData.error?.message || `Upload failed for ${file.name}`);
                }

                const data = await res.json();
                if (data.secure_url) {
                    uploadedUrls.push(data.secure_url);
                }
            }

            if (uploadedUrls.length > 0) {
                setFormData(prev => {
                    const combined = [...prev.paperImages, ...uploadedUrls];
                    return {
                        ...prev,
                        paperImages: combined,
                        paperImage: combined[0] || ''
                    };
                });
                toast.success(`${uploadedUrls.length} paper page(s) uploaded!`);
            }
        } catch (error: any) {
            console.error('Cloudinary Upload Error:', error);
            toast.error(error.message || 'Failed to upload images');
        } finally {
            setIsUploading(false);
            setUploadProgressText('');
            if (e.target) e.target.value = '';
        }
    };

    const removeImage = (indexToRemove: number) => {
        setFormData(prev => {
            const updated = prev.paperImages.filter((_, idx) => idx !== indexToRemove);
            return {
                ...prev,
                paperImages: updated,
                paperImage: updated[0] || ''
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.studentId) return toast.error('Please select a student');
        if (!formData.subject) return toast.error('Please select a subject');
        if (!formData.examDate) return toast.error('Please select an exam date');

        try {
            setIsLoading(true);
            const payload = {
                studentId: formData.studentId,
                subject: formData.subject,
                marks: Number(formData.marks),
                maxMarks: Number(formData.maxMarks),
                examMonth: new Date(formData.examDate).toLocaleString('en-US', { month: 'long' }),
                examDate: formData.examDate,
                progressNote: formData.progressNote,
                paperImages: formData.paperImages,
                paperImage: formData.paperImages[0] || formData.paperImage || 'https://via.placeholder.com/600x400'
            };

            if (editId) {
                await api.put(`/exams/${editId}`, payload);
                toast.success('Exam record updated!');
            } else {
                await api.post('/exams', payload);
                toast.success('Exam record created!');
            }

            // Redirect back after a short delay
            setTimeout(() => {
                router.push('/teacher-dashboard/exams');
            }, 1000);

        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit exam markings');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex bg-gray-50 min-h-screen font-sans">
            <Toaster position="top-center" toastOptions={{
                duration: 3000,
                style: { background: '#fff', color: '#45308D', fontWeight: 'bold', borderRadius: '9999px' },
            }} />

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <Sidebar role="teacher" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen overflow-x-hidden">
                {/* Header for Mobile */}
                <header className="fixed top-0 left-0 right-0 lg:left-64 flex items-center justify-between p-4 bg-white/80 backdrop-blur-md shadow-sm z-30 lg:hidden">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-3 bg-white border border-gray-100 rounded-2xl text-primary shadow-sm active:scale-95 transition-all"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="text-right">
                        <h2 className="text-xl font-black text-primary italic uppercase tracking-tighter leading-none">Entry Portal</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{teacherName}</p>
                    </div>
                </header>

                <div className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full flex flex-col mt-20 lg:mt-6">

                    {/* Desktop Title & Back Nav */}
                    <div className="flex items-center justify-between mb-8 w-full mt-4 lg:mt-0">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.push('/teacher-dashboard/exams')}
                                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#45308D] hover:border-[#45308D] transition-all shadow-sm"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-[#45308D] tracking-tight">{editId ? 'Edit Exam Record' : 'Exam Mark Entry'}</h1>
                            </div>
                        </div>
                    </div>

                    {/* The Entry Form */}
                    <div className="w-full bg-white rounded-3xl shadow-xl shadow-[#45308D]/5 p-6 md:p-10 border border-gray-100 relative overflow-hidden mb-20 md:mb-0">
                        {/* Decorative Top Accent */}
                        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#45308D] via-[#45308D]/80 to-[#FDC70B] opacity-90"></div>

                        <form onSubmit={handleSubmit} className="flex flex-col w-full flex-1 gap-6 relative z-10">

                            {/* Section 1: Student Information */}
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-5">
                                <h3 className="text-md font-bold text-[#45308D] flex items-center mb-2">
                                    <span className="w-6 h-6 rounded-full bg-[#45308D]/10 flex items-center justify-center text-xs mr-2">1</span>
                                    Student Details
                                </h3>

                                {/* Student Row */}
                                <div className="relative group w-full">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Select Student</label>
                                    <select
                                        className="w-full bg-white border-2 border-gray-200 p-4 pr-12 text-[16px] text-gray-800 font-medium appearance-none focus:outline-none focus:border-[#45308D] focus:ring-4 focus:ring-[#45308D]/10 transition-all rounded-xl cursor-pointer"
                                        value={formData.studentId}
                                        onChange={(e) => handleStudentChange(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>Select Student Name...</option>
                                        {students.map(student => (
                                            <option key={student._id} value={student._id}>{student.fullName}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-[42px] pointer-events-none text-gray-400 group-hover:text-[#45308D] transition-colors">
                                        <ChevronDown className="w-5 h-5" />
                                    </div>
                                </div>

                                {/* Class & Phone Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Class</label>
                                        <input
                                            type="text"
                                            placeholder="Class"
                                            className="w-full bg-gray-100/50 border-2 border-transparent p-4 text-[16px] text-gray-600 font-medium rounded-xl focus:outline-none cursor-not-allowed"
                                            value={formData.classInfo}
                                            readOnly disabled
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Phone / Contact</label>
                                        <input
                                            type="text"
                                            placeholder="Phone Number"
                                            className="w-full bg-gray-100/50 border-2 border-transparent p-4 text-[16px] text-gray-600 font-medium rounded-xl focus:outline-none cursor-not-allowed"
                                            value={formData.phoneInfo}
                                            readOnly disabled
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Exam Information */}
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-5 mt-2">
                                <h3 className="text-md font-bold text-[#45308D] flex items-center mb-2">
                                    <span className="w-6 h-6 rounded-full bg-[#45308D]/10 flex items-center justify-center text-xs mr-2">2</span>
                                    Exam & Result
                                </h3>

                                {/* Subject & Month Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                                    <div className="relative group w-full">
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Subject</label>
                                        <select
                                            className="w-full bg-white border-2 border-gray-200 p-4 pr-12 text-[16px] text-gray-800 font-medium appearance-none focus:outline-none focus:border-[#45308D] focus:ring-4 focus:ring-[#45308D]/10 transition-all rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            required
                                            disabled={!formData.studentId}
                                        >
                                            <option value="" disabled>{formData.studentId ? "Select Subject..." : "Select Student First"}</option>
                                            {formData.studentId && (() => {
                                                const student = students.find(s => s._id === formData.studentId);
                                                if (!student || !student.subjects) return null;
                                                return student.subjects.map((subjId: any) => {
                                                    const actualId = typeof subjId === 'object' ? subjId._id : subjId;
                                                    const sName = (typeof subjId === 'object' && (subjId.subjectName || subjId.name))
                                                        || (subjects.find(s => s._id === actualId)?.subjectName)
                                                        || actualId;
                                                    return <option key={actualId} value={sName}>{sName}</option>;
                                                });
                                            })()}
                                        </select>
                                        <div className="absolute right-4 top-[42px] pointer-events-none text-gray-400 group-hover:text-[#45308D] transition-colors">
                                            <ChevronDown className="w-5 h-5" />
                                        </div>
                                    </div>

                                    <div className="relative group w-full">
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Exam Date</label>
                                        <input
                                            type="date"
                                            className="w-full bg-white border-2 border-gray-200 p-4 text-[16px] text-gray-800 font-medium focus:outline-none focus:border-[#45308D] focus:ring-4 focus:ring-[#45308D]/10 transition-all rounded-xl cursor-pointer"
                                            value={formData.examDate}
                                            onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Mark & Max Row */}
                                <div className="grid grid-cols-2 gap-5 w-full pt-2">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Marks Obtained</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                placeholder="e.g. 85"
                                                className="w-full bg-white border-2 border-gray-200 p-4 text-[16px] text-[#45308D] font-bold focus:outline-none focus:border-[#45308D] focus:ring-4 focus:ring-[#45308D]/10 transition-all rounded-xl"
                                                value={formData.marks}
                                                onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Maximum Marks</label>
                                        <input
                                            type="number"
                                            placeholder="e.g. 100"
                                            className="w-full bg-white border-2 border-gray-200 p-4 text-[16px] text-gray-800 font-medium focus:outline-none focus:border-[#45308D] focus:ring-4 focus:ring-[#45308D]/10 transition-all rounded-xl"
                                            value={formData.maxMarks}
                                            onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Paper & Feedback */}
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-5 mt-2">
                                <h3 className="text-md font-bold text-[#45308D] flex items-center mb-2">
                                    <span className="w-6 h-6 rounded-full bg-[#45308D]/10 flex items-center justify-center text-xs mr-2">3</span>
                                    Paper & Feedback
                                </h3>

                                {/* Paper Images Box */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-bold text-gray-700 ml-1">
                                            Answer Paper Images {formData.paperImages.length > 0 && (
                                                <span className="text-xs font-semibold text-[#45308D] bg-[#45308D]/10 px-2.5 py-0.5 rounded-full ml-1">
                                                    {formData.paperImages.length} {formData.paperImages.length === 1 ? 'Page' : 'Pages'}
                                                </span>
                                            )}
                                        </label>
                                        {formData.paperImages.length > 0 && !isUploading && (
                                            <label
                                                htmlFor="paper-upload"
                                                className="cursor-pointer text-xs font-bold text-[#45308D] hover:underline flex items-center gap-1 bg-[#45308D]/5 hover:bg-[#45308D]/10 px-3 py-1.5 rounded-xl transition"
                                            >
                                                <Plus className="w-3.5 h-3.5" /> Add More Pages
                                            </label>
                                        )}
                                    </div>

                                    {/* Upload Progress Banner */}
                                    {isUploading && (
                                        <div className="mb-3 p-3.5 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-3 animate-pulse">
                                            <div className="w-5 h-5 border-2 border-[#45308D] border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                                            <span className="text-xs font-bold text-[#45308D]">
                                                {uploadProgressText || 'Uploading to BrightPath Cloud...'}
                                            </span>
                                        </div>
                                    )}

                                    {formData.paperImages.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                                            {formData.paperImages.map((imgUrl, index) => (
                                                <div 
                                                    key={index}
                                                    className="relative rounded-2xl overflow-hidden border-2 border-gray-200 bg-gray-900 group aspect-[3/4] shadow-sm flex flex-col justify-between p-2.5 transition-all hover:shadow-md hover:border-[#45308D]/40"
                                                >
                                                    <img 
                                                        src={imgUrl} 
                                                        alt={`Page ${index + 1}`} 
                                                        className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300" 
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 pointer-events-none"></div>
                                                    
                                                    {/* Top Bar: Badge & Remove */}
                                                    <div className="relative z-10 flex items-center justify-between">
                                                        <span className="bg-black/60 backdrop-blur-md text-white font-bold text-[10px] px-2.5 py-1 rounded-full border border-white/20 shadow-sm">
                                                            Page {index + 1}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="w-7 h-7 rounded-full bg-red-500/90 hover:bg-red-600 text-white flex items-center justify-center transition shadow-md hover:scale-105 active:scale-95"
                                                            title="Remove this page"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>

                                                    {/* Bottom Bar: Preview link */}
                                                    <div className="relative z-10">
                                                        <a
                                                            href={imgUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="w-full py-1.5 bg-white/95 hover:bg-white text-[#45308D] text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 shadow transition active:scale-95"
                                                        >
                                                            <Eye className="w-3 h-3" /> View Full
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Add more tile */}
                                            <label
                                                htmlFor="paper-upload"
                                                className="rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#45308D] bg-gray-50 hover:bg-[#45308D]/5 cursor-pointer aspect-[3/4] flex flex-col items-center justify-center gap-2 p-4 transition group text-center"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 group-hover:border-[#45308D] flex items-center justify-center text-[#45308D] shadow-sm transition">
                                                    <Plus className="w-5 h-5" />
                                                </div>
                                                <span className="text-xs font-bold text-gray-600 group-hover:text-[#45308D] transition">
                                                    Add More
                                                </span>
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="w-full bg-gray-50 border-2 border-dashed border-gray-300 hover:border-[#45308D] rounded-2xl min-h-[180px] sm:min-h-[220px] flex flex-col items-center justify-center gap-3 relative overflow-hidden transition-all p-6 text-center">
                                            <div className="w-14 h-14 rounded-2xl bg-[#45308D]/10 text-[#45308D] flex items-center justify-center">
                                                <UploadCloud className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-700">Upload Answer Paper Images</p>
                                                <p className="text-xs text-gray-400 mt-0.5">Select single or multiple pages at once</p>
                                            </div>
                                            <label
                                                htmlFor="paper-upload"
                                                className="mt-2 px-6 py-2.5 bg-white border-2 border-gray-200 text-[#45308D] font-bold text-sm rounded-xl cursor-pointer hover:border-[#45308D] hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                                            >
                                                Select Image Files
                                            </label>
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        id="paper-upload"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        disabled={isUploading}
                                    />
                                </div>

                                {/* Progress Component */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Progress Details / Teacher Comments</label>
                                    <textarea
                                        placeholder="Add notes about student performance..."
                                        className="w-full bg-white border-2 border-gray-200 p-4 text-[16px] text-gray-800 font-medium focus:outline-none focus:border-[#45308D] focus:ring-4 focus:ring-[#45308D]/10 transition-all rounded-xl min-h-[120px] resize-y"
                                        value={formData.progressNote}
                                        onChange={(e) => setFormData({ ...formData, progressNote: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Final Submit Form button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full mt-4 bg-[#45308D] hover:bg-[#45308D]/90 text-white p-5 rounded-2xl text-[18px] font-bold transition-all duration-300 shadow-lg shadow-[#45308D]/25 hover:shadow-[#45308D]/40 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 transform hover:-translate-y-1"
                            >
                                {isLoading ? 'Saving Record...' : 'Submit Mark Entry'}
                                {!isLoading && <CheckCircle className="w-5 h-5 text-[#FDC70B]" />}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ExamForm() {
    return (
        <Suspense fallback={<div className="p-12 text-center">Loading Entry Portal...</div>}>
            <ExamFormInner />
        </Suspense>
    );
}
