
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
      <div className="card border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-3xl font-extrabold shadow-sm flex-shrink-0">
              {profileUser.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {profileUser.name || 'Your Name'}
                </h1>
                <span className="badge badge-blue text-[10px]">
                  Candidate
                </span>
              </div>

              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
                {profileUser.headline || 'Add your professional headline'}
              </p>

              <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1.5 pt-0.5">
                <MapPin size={13} />
                {profileUser.location || 'Add your location'}
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
            className="btn-secondary self-start sm:self-auto text-xs font-semibold"
            disabled={saving}
          >
            {isEditing ? <X size={15} /> : <Edit2 size={15} />}
            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm">
          {saveSuccess}
        </div>
      )}

      {isEditing ? (
        /* Edit Profile Form */
        <form onSubmit={handleSave} className="card space-y-6 animate-slide-up">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
            <h2 className="section-title">Edit Candidate Profile</h2>
            <span className="text-xs text-slate-400">
              Changes saved to your account
            </span>
          </div>

          {saveError && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800 flex items-center gap-2 text-red-700 dark:text-red-300 text-sm">
              <AlertCircle size={16} className="flex-shrink-0" />
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
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                value={formData.email}
                className="input-field opacity-70 cursor-not-allowed"
                readOnly
              />
              <p className="text-xs text-slate-400 mt-1">
                Your account email is managed through authentication settings.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="label">Professional Headline</label>
              <input
                type="text"
                value={formData.headline}
                onChange={(e) => handleChange('headline', e.target.value)}
                className="input-field"
                placeholder="e.g. Aspiring Full Stack Engineer & CS Student"
              />
            </div>

            <div>
              <label className="label">Education & Degree</label>
              <input
                type="text"
                value={formData.education}
                onChange={(e) => handleChange('education', e.target.value)}
                className="input-field"
                placeholder="e.g. B.Tech in Computer Science"
              />
            </div>

            <div>
              <label className="label">Experience Level</label>
              <select
                value={formData.experience}
                onChange={(e) => handleChange('experience', e.target.value)}
                className="input-field"
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
                className="input-field"
                placeholder="e.g. Bengaluru, India"
              />
            </div>

            <div>
              <label className="label">LinkedIn URL</label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => handleChange('linkedin', e.target.value)}
                className="input-field"
                placeholder="https://linkedin.com/in/your-profile"
              />
            </div>

            <div>
              <label className="label">GitHub URL</label>
              <input
                type="url"
                value={formData.github}
                onChange={(e) => handleChange('github', e.target.value)}
                className="input-field"
                placeholder="https://github.com/your-username"
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Short Bio / Summary</label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                className="input-field"
                placeholder="Tell employers a little about yourself..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Career Interests (comma separated)</label>
              <input
                type="text"
                value={formData.careerInterests}
                onChange={(e) => handleChange('careerInterests', e.target.value)}
                className="input-field"
                placeholder="Frontend Development, Cloud Computing"
              />
            </div>

            <div>
              <label className="label">Target Companies (comma separated)</label>
              <input
                type="text"
                value={formData.targetCompanies}
                onChange={(e) => handleChange('targetCompanies', e.target.value)}
                className="input-field"
                placeholder="Google, Microsoft, Amazon"
              />
            </div>

            <div>
              <label className="label">Target Job Roles (comma separated)</label>
              <input
                type="text"
                value={formData.targetRoles}
                onChange={(e) => handleChange('targetRoles', e.target.value)}
                className="input-field"
                placeholder="Frontend Developer, Software Engineer"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
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
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={14} />
                  Save Profile Changes
                </>
              )}
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
                {profileUser.bio || 'No bio provided. Click edit profile to add your professional summary.'}
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
                    {(profileUser.careerInterests || []).map((interest, i) => (
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
                    {(profileUser.targetCompanies || []).map((company, i) => (
                      <span key={i} className="badge badge-blue text-xs">
                        {company}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-500 block mb-1">
                    Target Job Roles:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(profileUser.targetRoles || []).map((role, i) => (
                      <span key={i} className="badge badge-green text-xs">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Verified Skills Summary */}
            <div className="card space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="section-title">
                  Active Skill Set ({userSkills.length})
                </h3>

                <button
                  onClick={() => navigate('/skills')}
                  className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  Manage Skills <ArrowRight size={13} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {userSkills.map((skill) => (
                  <SkillTag key={skill.id} skill={skill} size="sm" />
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
                      {profileUser.education || 'Not specified'}
                    </strong>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Briefcase size={16} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-slate-400 block">Experience</span>
                    <strong className="text-slate-800 dark:text-white font-semibold">
                      {profileUser.experience || 'Not specified'}
                    </strong>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail size={16} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-slate-400 block">Email</span>
                    <strong className="text-slate-800 dark:text-white font-semibold break-all">
                      {profileUser.email || 'No email available'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="card space-y-3">
              <h3 className="section-title">Social & Portfolios</h3>

              <div className="space-y-2 text-xs">
                {profileUser.linkedin && (
                  <a
                    href={profileUser.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-indigo-600 hover:underline"
                  >
                    <Linkedin size={14} />
                    <span>LinkedIn Profile</span>
                  </a>
                )}

                {profileUser.github && (
                  <a
                    href={profileUser.github}
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
