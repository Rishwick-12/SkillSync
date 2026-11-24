import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  GraduationCap,
  Briefcase,
  Edit2,
  Check,
  X,
  MapPin,
  Linkedin,
  Github,
  ArrowRight,
  AlertCircle,
  Sparkles,
  User,
} from 'lucide-react';

import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import SkillTag from '../components/ui/SkillTag';

export default function ProfilePage() {
  const { user, updateUser, userSkills } = useApp();
  const { currentUser, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Supabase Auth is the source of truth for account identity.
  const profileUser = {
    ...user,
    ...currentUser,
    careerInterests:
      user?.careerInterests || currentUser?.careerInterests || [],
    targetCompanies:
      user?.targetCompanies || currentUser?.targetCompanies || [],
    targetRoles:
      user?.targetRoles || currentUser?.targetRoles || [],
  };

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    headline: '',
    education: '',
    experience: '',
    bio: '',
    location: '',
    linkedin: '',
    github: '',
    careerInterests: '',
    targetCompanies: '',
    targetRoles: '',
  });

  // Load the latest profile data when the authenticated user changes.
  useEffect(() => {
    setFormData({
      name: profileUser.name || '',
      email: profileUser.email || '',
      headline: profileUser.headline || '',
      education: profileUser.education || '',
      experience: profileUser.experience || '',
      bio: profileUser.bio || '',
      location: profileUser.location || '',
      linkedin: profileUser.linkedin || '',
      github: profileUser.github || '',
      careerInterests: (profileUser.careerInterests || []).join(', '),
      targetCompanies: (profileUser.targetCompanies || []).join(', '),
      targetRoles: (profileUser.targetRoles || []).join(', '),
    });
  }, [
    currentUser?.id,
    currentUser?.name,
    currentUser?.email,
    user?.headline,
    user?.education,
    user?.experience,
    user?.bio,
    user?.location,
    user?.linkedin,
    user?.github,
  ]);

  const handleSave = async (e) => {
    e.preventDefault();

    setSaving(true);
    setSaveError('');
    setSaveSuccess('');

    const updated = {
      name: formData.name.trim(),
      email: formData.email,
      headline: formData.headline.trim(),
      education: formData.education.trim(),
      experience: formData.experience,
      bio: formData.bio.trim(),
      location: formData.location.trim(),
      linkedin: formData.linkedin.trim(),
      github: formData.github.trim(),
      careerInterests: formData.careerInterests
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      targetCompanies: formData.targetCompanies
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      targetRoles: formData.targetRoles
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      // Save the profile to Supabase first.
      await updateProfile(updated);

      // Update the existing application context after database success.
      updateUser(updated);

      setIsEditing(false);
      setSaveSuccess('Your profile has been updated successfully.');
    } catch (error) {
      console.error('Profile update failed:', error);
      setSaveError(error.message || 'Unable to save your profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setSaveError('');
    setIsEditing(false);

    setFormData({
      name: profileUser.name || '',
      email: profileUser.email || '',
      headline: profileUser.headline || '',
      education: profileUser.education || '',
      experience: profileUser.experience || '',
      bio: profileUser.bio || '',
      location: profileUser.location || '',
      linkedin: profileUser.linkedin || '',
      github: profileUser.github || '',
      careerInterests: (profileUser.careerInterests || []).join(', '),
      targetCompanies: (profileUser.targetCompanies || []).join(', '),
      targetRoles: (profileUser.targetRoles || []).join(', '),
    });
  };

  const handleChange = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header Card */}
      <div className="card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center text-2xl font-bold shadow-xs flex-shrink-0">
              {profileUser.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight truncate">
                  {profileUser.name || 'Your Name'}
                </h1>
                <span className="badge badge-blue text-[10px] font-mono">
                  Candidate
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 truncate">
                {profileUser.headline || 'Add your professional headline'}
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-0.5">
                <MapPin size={12} className="text-slate-400" />
                <span>{profileUser.location || 'Add your location'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (isEditing) {
                handleCancel();
              } else {
                setSaveSuccess('');
                setIsEditing(true);
              }
            }}
            className="btn-secondary self-start sm:self-auto text-xs font-medium py-1.5"
            disabled={saving}
          >
            {isEditing ? <X size={14} /> : <Edit2 size={14} />}
            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
          <Check size={14} />
          {saveSuccess}
        </div>
      )}

      {isEditing ? (
        /* Edit Profile Form */
        <form onSubmit={handleSave} className="card p-5 sm:p-6 space-y-5 animate-slide-up">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Edit Candidate Profile
            </h2>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
              Auto-syncs to account
            </span>
          </div>

          {saveError && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-lg border border-rose-200 dark:border-rose-800/40 flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs">
              <AlertCircle size={14} className="flex-shrink-0" />
              {saveError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="input-field text-xs"
                required
              />
            </div>

            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                value={formData.email}
                className="input-field text-xs opacity-70 cursor-not-allowed"
                readOnly
              />
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                Account email is linked to authentication credentials.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="label">Professional Headline</label>
              <input
                type="text"
                value={formData.headline}
                onChange={(e) => handleChange('headline', e.target.value)}
                className="input-field text-xs"
                placeholder="e.g. Aspiring Full Stack Engineer & Computer Science Graduate"
              />
            </div>

            <div>
              <label className="label">Education & Degree</label>
              <input
                type="text"
                value={formData.education}
                onChange={(e) => handleChange('education', e.target.value)}
                className="input-field text-xs"
                placeholder="e.g. B.Tech in Computer Science"
              />
            </div>

            <div>
              <label className="label">Experience Level</label>
              <select
                value={formData.experience}
                onChange={(e) => handleChange('experience', e.target.value)}
                className="input-field text-xs"
              >
                <option value="">Select experience level</option>
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
                onChange={(e) => handleChange('location', e.target.value)}
                className="input-field text-xs"
                placeholder="e.g. Bengaluru, India"
              />
            </div>

            <div>
              <label className="label">LinkedIn URL</label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => handleChange('linkedin', e.target.value)}
                className="input-field text-xs"
                placeholder="https://linkedin.com/in/your-profile"
              />
            </div>

            <div>
              <label className="label">GitHub URL</label>
              <input
                type="url"
                value={formData.github}
                onChange={(e) => handleChange('github', e.target.value)}
                className="input-field text-xs"
                placeholder="https://github.com/your-username"
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Short Bio / Professional Summary</label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                className="input-field text-xs"
                placeholder="Tell employers about your goals and technical interests..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Career Interests (comma separated)</label>
              <input
                type="text"
                value={formData.careerInterests}
                onChange={(e) => handleChange('careerInterests', e.target.value)}
                className="input-field text-xs"
                placeholder="Frontend Development, Cloud Computing, System Design"
              />
            </div>

            <div>
              <label className="label">Target Companies (comma separated)</label>
              <input
                type="text"
                value={formData.targetCompanies}
                onChange={(e) => handleChange('targetCompanies', e.target.value)}
                className="input-field text-xs"
                placeholder="Google, Microsoft, Amazon"
              />
            </div>

            <div>
              <label className="label">Target Job Roles (comma separated)</label>
              <input
                type="text"
                value={formData.targetRoles}
                onChange={(e) => handleChange('targetRoles', e.target.value)}
                className="input-field text-xs"
                placeholder="Frontend Developer, Software Engineer"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
            <button
              type="button"
              onClick={handleCancel}
              className="btn-secondary text-xs"
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary text-xs"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={13} />
                  Save Profile Changes
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* View Profile Details */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-5">
            {/* About / Bio */}
            <div className="card p-5 space-y-2.5">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                About & Summary
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {profileUser.bio || 'No bio provided. Click edit profile to add your professional summary.'}
              </p>
            </div>

            {/* Target Career & Companies */}
            <div className="card p-5 space-y-3.5">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Career Goals & Aspirations
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-medium text-slate-500 dark:text-slate-400 block mb-1.5">
                    Specialization Interests:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(profileUser.careerInterests || []).length > 0 ? (
                      (profileUser.careerInterests || []).map((interest, i) => (
                        <span key={i} className="badge badge-purple text-xs">
                          {interest}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 italic">No interests specified</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="font-medium text-slate-500 dark:text-slate-400 block mb-1.5">
                    Target Employers:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(profileUser.targetCompanies || []).length > 0 ? (
                      (profileUser.targetCompanies || []).map((company, i) => (
                        <span key={i} className="badge badge-blue text-xs">
                          {company}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 italic">No target companies specified</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="font-medium text-slate-500 dark:text-slate-400 block mb-1.5">
                    Target Job Roles:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(profileUser.targetRoles || []).length > 0 ? (
                      (profileUser.targetRoles || []).map((role, i) => (
                        <span key={i} className="badge badge-green text-xs">
                          {role}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 italic">No target roles specified</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Verified Skills Summary */}
            <div className="card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Active Skill Set <span className="font-mono text-slate-400 font-normal">({userSkills.length})</span>
                </h3>

                <button
                  onClick={() => navigate('/skills')}
                  className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
                >
                  Manage Skills <ArrowRight size={12} />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {userSkills.map((skill) => (
                  <SkillTag key={skill.id} skill={skill} size="sm" />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-5">
            <div className="card p-5 space-y-3.5">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Academic & Professional
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <GraduationCap size={15} className="text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Education</span>
                    <strong className="text-slate-800 dark:text-white font-medium">
                      {profileUser.education || 'Not specified'}
                    </strong>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Briefcase size={15} className="text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Experience</span>
                    <strong className="text-slate-800 dark:text-white font-medium">
                      {profileUser.experience || 'Not specified'}
                    </strong>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail size={15} className="text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Email</span>
                    <strong className="text-slate-800 dark:text-white font-medium break-all">
                      {profileUser.email || 'No email available'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-5 space-y-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Social & Portfolios
              </h3>

              <div className="space-y-2 text-xs">
                {profileUser.linkedin ? (
                  <a
                    href={profileUser.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-canvas-subtle border border-slate-200/60 dark:border-white/[0.08] text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
                  >
                    <Linkedin size={14} />
                    <span className="truncate">LinkedIn Profile</span>
                  </a>
                ) : (
                  <p className="text-slate-400 dark:text-slate-500 text-xs italic">No LinkedIn profile connected</p>
                )}

                {profileUser.github ? (
                  <a
                    href={profileUser.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-canvas-subtle border border-slate-200/60 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 hover:text-slate-900 transition-colors"
                  >
                    <Github size={14} />
                    <span className="truncate">GitHub Repositories</span>
                  </a>
                ) : (
                  <p className="text-slate-400 dark:text-slate-500 text-xs italic">No GitHub profile connected</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
