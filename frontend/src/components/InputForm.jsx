import { useState } from 'react';
import { Play, UploadCloud } from 'lucide-react';

function InputForm({ onSubmit, loading }) {
    const [resumeText, setResumeText] = useState('');
    const [jdText, setJdText] = useState('');
    const [transcriptText, setTranscriptText] = useState('');
    const [selectedRoles, setSelectedRoles] = useState([]);
    const PREDEFINED_ROLES = [
        "Full Stack Developer", "Backend Engineer", "Frontend Developer",
        "Data Scientist", "DevOps Engineer", "QA Engineer", "Product Manager", "UI/UX Designer"
    ];
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('resumePdf', file);

        try {
            const response = await fetch('http://localhost:5000/api/parse-pdf', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (data.text) {
                setResumeText(data.text);
            } else {
                alert('Failed to extract text from PDF.');
            }
        } catch (error) {
            console.error('Error uploading PDF:', error);
            alert('Error parsing PDF file.');
        } finally {
            setIsUploading(false);
            e.target.value = null; // reset input
        }
    };

    const handleRoleToggle = (role) => {
        if (selectedRoles.includes(role)) {
            setSelectedRoles(selectedRoles.filter(r => r !== role));
        } else {
            setSelectedRoles([...selectedRoles, role]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ resumeText, jdText, transcriptText, availableRolesText: selectedRoles.join(', ') });
    };

    const inputClass = "w-full text-sm border-white/10 rounded-xl shadow-sm focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.3)] focus:outline-none min-h-[100px] p-4 border mb-4 bg-white/5 text-white placeholder-white/40 backdrop-blur-md outline-none transition-all";
    const labelClass = "block text-sm font-semibold text-white/90 mb-2 drop-shadow-sm";

    return (
        <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-slate-900/60 backdrop-blur-[16px] border border-white/10 shadow-2xl shadow-black/10">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                Candidate Data Input
            </h2>

            <div>
                <label className={labelClass}>Job Description</label>
                <textarea className={inputClass} value={jdText} onChange={(e) => setJdText(e.target.value)} placeholder="Paste Job Description here..." />
            </div>

            <div>
                <label className={labelClass}>Select Available Roles for Re-Assignment</label>
                <div className="flex flex-wrap gap-2 mb-6">
                    {PREDEFINED_ROLES.map(role => {
                        const isSelected = selectedRoles.includes(role);
                        return (
                            <button
                                key={role}
                                type="button"
                                onClick={() => handleRoleToggle(role)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border hover:scale-[1.02] duration-300 ${isSelected
                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 border-transparent text-white shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                                        : 'bg-white/10 border-white/30 text-white/80 hover:bg-white/20 hover:border-white/50'
                                    }`}
                            >
                                {role}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div>
                <label className={labelClass}>Candidate Resume</label>
                <div className="relative group cursor-pointer w-full border-2 border-dashed border-white/40 rounded-xl p-8 flex flex-col items-center justify-center text-white/70 hover:border-cyan-300 hover:bg-white/10 hover:text-cyan-300 transition-all mb-4 bg-white/5 backdrop-blur-sm">
                    <UploadCloud className="w-10 h-10 mb-3 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-sm font-medium">{isUploading ? 'Extracting text...' : 'Drag & Drop Resume or Click to Upload'}</span>
                    <input type="file" accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileUpload} disabled={isUploading} />
                </div>
                <div className="flex items-center gap-4 mb-4 mt-2">
                    <div className="h-px bg-white/10 flex-1"></div>
                    <span className="text-white/40 text-xs font-bold uppercase tracking-wider">or enter manually</span>
                    <div className="h-px bg-white/10 flex-1"></div>
                </div>
                <textarea className={inputClass} value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder="Enter candidate resume text here..." />
            </div>

            <div>
                <label className={labelClass}>Interview Transcript</label>
                <textarea className={inputClass} value={transcriptText} onChange={(e) => setTranscriptText(e.target.value)} placeholder="Paste Interview Transcript here..." style={{ minHeight: '140px' }} />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-4 px-4 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 flex justify-center items-center text-lg mt-6">
                {loading ? 'Evaluating Candidate...' : <><Play className="mr-2" /> Start AI Evaluation</>}
            </button>
        </form>
    );
}

export default InputForm;
