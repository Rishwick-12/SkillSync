import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  GraduationCap,
  Briefcase,
  Target,
  Edit2,
  Check,
  X,
  Building2,
  Code2,
  MapPin,
  Linkedin,
  Github,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import SkillTag from '../components/ui/SkillTag';

export default function ProfilePage() {
  const { user, updateUser, userSkills } = useApp();
  const { updateProfile } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Alex Johnson',
    email: user?.email || 'demo@skillsync.app',
    headline: user?.headline || 'Aspiring Full Stack Engineer & Computer Science Student',
    education: user?.education || 'B.Tech in Computer Science and Engineering',
    experience: user?.experience || 'Fresher (0-1 yrs)',
    bio: user?.bio || 'Passionate about frontend architecture, responsive design, and algorithms.',
    location: user?.location || 'Bengaluru, Karnataka, India',
    linkedin: user?.linkedin || 'https://linkedin.com/in/alexjohnson-demo',
    github: user?.github || 'https://github.com/alexjohnson-demo',
    careerInterests: user?.careerInterests?.join(', ') || 'Frontend Development, Full Stack Development, Cloud Computing',
    targetCompanies: user?.targetCompanies?.join(', ') || 'Google, Microsoft, Amazon, Flipkart',
    targetRoles: user?.targetRoles?.join(', ') || 'Frontend Developer, Full Stack Developer, Software Engineer',
  });

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...formData,
      careerInterests: formData.careerInterests.split(',').map((s) => s.trim()).filter(Boolean),
      targetCompanies: formData.targetCompanies.split(',').map((s) => s.trim()).filter(Boolean),
      targetRoles: formData.targetRoles.split(',').map((s) => s.trim()).filter(Boolean),
    };

    updateUser(updated);
    if (updateProfile) updateProfile(updated);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header Card */}
      <div className="card border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-3xl font-extrabold shadow-sm flex-shrink-0">
              {user?.name?.charAt(0) || 'A'}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name || 'Alex Johnson'}</h1>
                <span className="badge badge-blue text-[10px]">Candidate</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
                {user?.headline || 'Aspiring Software Developer'}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1.5 pt-0.5">
                <MapPin size={13} /> {user?.location || 'Bengaluru, India'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-secondary self-start sm:self-auto text-xs font-semibold"
          >
            {isEditing ? <X size={15} /> : <Edit2 size={15} />}
            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {isEditing ? (
        /* Edit Profile Form */
        <form onSubmit={handleSave} className="card space-y-6 animate-slide-up">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
            <h2 className="section-title">Edit Candidate Profile</h2>
            <span className="text-xs text-slate-400">Updates saved to browser localStorage</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Professional Headline</label>
              <input
                type="text"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                className="input-field"
                placeholder="e.g. Aspiring Full Stack Engineer & CS Student"
              />
            </div>

            <div>
              <label className="label">Education & Degree</label>
              <input
                type="text"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                className="input-field"
                placeholder="e.g. B.Tech in Computer Science"
              />
            </div>

            <div>
              <label className="label">Experience Level</label>
              <select
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="input-field"
              >
                <option value="Student (Undergrad)">Student (Undergrad)</option>
                <option value="Fresher (0-1 yrs)">Fresher (0-1 yrs)</option>
                <option value="Junior (1-3 yrs)">Junior (1-3 yrs)</option>
                <option value="Mid-Level (3-5 yrs)">Mid-Level (3-5 yrs)</option>
                <option value="Senior (5+ yrs)">Senior (5+ yrs)</option>
              </select>
            </div>

            <div>
              <label className="label">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="label">LinkedIn URL</label>
              <input
                type="text"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Short Bio / Summary</label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Career Interests (comma separated)</label>
              <input
                type="text"
                value={formData.careerInterests}
                onChange={(e) => setFormData({ ...formData, careerInterests: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Target Companies (comma separated)</label>
              <input
                type="text"
                value={formData.targetCompanies}
                onChange={(e) => setFormData({ ...formData, targetCompanies: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Target Job Roles (comma separated)</label>
              <input
                type="text"
                value={formData.targetRoles}
                onChange={(e) => setFormData({ ...formData, targetRoles: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary text-xs">
              <Check size={14} /> Save Profile Changes
            </button>
          </div>
        </form>
      ) : (
        /* View Profile Details */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            {/* About / Bio */}
            <div className="card space-y-3">
              <h3 className="section-title">About & Summary</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {user?.bio || 'No bio provided. Click edit profile to add your professional summary.'}
              </p>
            </div>

            {/* Target Career & Companies */}
            <div className="card space-y-4">
              <h3 className="section-title">Career Goals & Aspirations</h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-slate-500 block mb-1">
                    Specialization Interests:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(user?.careerInterests || []).map((interest, i) => (
                      <span key={i} className="badge badge-purple text-xs">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-500 block mb-1">
                    Target Employers:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(user?.targetCompanies || []).map((comp, i) => (
                      <span key={i} className="badge badge-blue text-xs">
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-500 block mb-1">
                    Target Job Roles:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(user?.targetRoles || []).map((r, i) => (
                      <span key={i} className="badge badge-green text-xs">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Verified Skills Summary */}
            <div className="card space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="section-title">Active Skill Set ({userSkills.length})</h3>
                <button
                  onClick={() => navigate('/skills')}
                  className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  Manage Skills <ArrowRight size={13} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {userSkills.map((s) => (
                  <SkillTag key={s.id} skill={s} size="sm" />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="card space-y-4">
              <h3 className="section-title">Academic & Professional</h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <GraduationCap size={16} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-slate-400 block">Education</span>
                    <strong className="text-slate-800 dark:text-white font-semibold">
                      {user?.education || 'Computer Science'}
                    </strong>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Briefcase size={16} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-slate-400 block">Experience</span>
                    <strong className="text-slate-800 dark:text-white font-semibold">
                      {user?.experience || 'Fresher'}
                    </strong>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail size={16} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-slate-400 block">Email</span>
                    <strong className="text-slate-800 dark:text-white font-semibold">
                      {user?.email || 'demo@skillsync.app'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="card space-y-3">
              <h3 className="section-title">Social & Portfolios</h3>
              <div className="space-y-2 text-xs">
                {user?.linkedin && (
                  <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-indigo-600 hover:underline"
                  >
                    <Linkedin size={14} />
                    <span>LinkedIn Profile</span>
                  </a>
                )}
                {user?.github && (
                  <a
                    href={user.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200 hover:underline"
                  >
                    <Github size={14} />
                    <span>GitHub Repositories</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
