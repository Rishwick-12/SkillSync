import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  X,
  Filter,
  Trash2,
  Edit2,
  Check,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Layers,
} from 'lucide-react';

import { useApp } from '../context/AppContext';
import { skillsCatalog } from '../data/skills';
import EmptyState from '../components/ui/EmptyState';

const CATEGORIES = [
  'All',
  'Web Development',
  'Programming Languages',
  'Databases',
  'DSA & CS Fundamentals',
  'AI & Machine Learning',
  'Cloud & DevOps',
  'Mobile Development',
  'Soft Skills',
  'Tools & Version Control',
];

const PROFICIENCIES = ['Beginner', 'Intermediate', 'Advanced'];

export default function SkillsPage() {
  const {
    userSkills,
    addSkill,
    removeSkill,
    updateSkillProficiency,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProficiency, setSelectedProficiency] = useState('All');

  const [showAddForm, setShowAddForm] = useState(false);
  const [addQuery, setAddQuery] = useState('');
  const [selectedCatalogSkill, setSelectedCatalogSkill] = useState(null);
  const [addCategory, setAddCategory] = useState('Web Development');
  const [addProficiency, setAddProficiency] = useState('Intermediate');

  const [editingSkillId, setEditingSkillId] = useState(null);
  const [editingProficiency, setEditingProficiency] = useState('Intermediate');

  const [savingSkill, setSavingSkill] = useState(false);
  const [pageError, setPageError] = useState('');

  // Filter existing skills
  const filteredUserSkills = useMemo(() => {
    return userSkills.filter((s) => {
      const matchesSearch = s.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || s.category === selectedCategory;

      const matchesProficiency =
        selectedProficiency === 'All' ||
        s.proficiency === selectedProficiency;

      return matchesSearch && matchesCategory && matchesProficiency;
    });
  }, [userSkills, searchTerm, selectedCategory, selectedProficiency]);

  // Catalog search suggestions
  const catalogSuggestions = useMemo(() => {
    if (!addQuery.trim()) return [];

    const q = addQuery.toLowerCase();
    const existingNames = new Set(
      userSkills.map((s) => s.name.toLowerCase())
    );

    return skillsCatalog
      .filter((s) => {
        const matches =
          s.name.toLowerCase().includes(q) ||
          (s.aliases &&
            s.aliases.some((a) => a.toLowerCase().includes(q)));

        return matches && !existingNames.has(s.name.toLowerCase());
      })
      .slice(0, 6);
  }, [addQuery, userSkills]);

  // Select a skill from suggestions
  const handleSelectSuggestion = (s) => {
    setSelectedCatalogSkill(s);
    setAddQuery(s.name);
    if (s.category) {
      setAddCategory(s.category);
    }
  };

  // Save a new skill
  const handleAddSkillSubmit = async (e) => {
    e.preventDefault();

    if (savingSkill || !addQuery.trim()) return;

    const skillName = selectedCatalogSkill
      ? selectedCatalogSkill.name
      : addQuery.trim();

    const skillCategory = selectedCatalogSkill
      ? selectedCatalogSkill.category
      : addCategory;

    const skillId = selectedCatalogSkill
      ? selectedCatalogSkill.id
      : skillName.toLowerCase().replace(/[^a-z0-9]/g, '-');

    setSavingSkill(true);
    setPageError('');

    try {
      await addSkill({
        id: skillId,
        skillId,
        name: skillName,
        category: skillCategory,
        proficiency: addProficiency,
      });

      setAddQuery('');
      setSelectedCatalogSkill(null);
      setSearchTerm('');
      setSelectedCategory('All');
      setSelectedProficiency('All');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding skill:', error);
      setPageError(
        error.message || 'Unable to save skill. Please try again.'
      );
    } finally {
      setSavingSkill(false);
    }
  };

  // Start editing proficiency
  const handleStartEdit = (skill) => {
    setEditingSkillId(skill.id);
    setEditingProficiency(skill.proficiency);
    setPageError('');
  };

  // Save edited proficiency
  const handleSaveEdit = async (skillId) => {
    try {
      setPageError('');
      await updateSkillProficiency(skillId, editingProficiency);
      setEditingSkillId(null);
    } catch (error) {
      console.error('Error updating proficiency:', error);
      setPageError(error.message || 'Unable to update proficiency.');
    }
  };

  // Remove a skill
  const handleRemoveSkill = async (skillId) => {
    try {
      setPageError('');
      await removeSkill(skillId);
    } catch (error) {
      console.error('Error removing skill:', error);
      setPageError(error.message || 'Unable to remove skill.');
    }
  };

  // Group skills by category
  const groupedSkills = useMemo(() => {
    const groups = {};

    filteredUserSkills.forEach((skill) => {
      const cat = skill.category || 'General';
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(skill);
    });

    return groups;
  }, [filteredUserSkills]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight">
              My Skills
            </h1>
            <span className="badge badge-gray font-mono text-[11px]">
              {userSkills.length} Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Maintain your technical skills inventory to automatically compute role compatibility.
          </p>
        </div>

        <button
          onClick={() => {
            setPageError('');
            setShowAddForm(true);
          }}
          className="btn-primary self-start sm:self-auto text-xs px-3 py-1.5 gap-1.5"
        >
          <Plus size={14} />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Error Alert */}
      {pageError && (
        <div 
          className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between"
          role="alert"
        >
          <span>{pageError}</span>
          <button onClick={() => setPageError('')} className="p-1 hover:opacity-75">
            <X size={13} />
          </button>
        </div>
      )}

      {/* Add Skill Panel (Linear-style embedded drawer) */}
      {showAddForm && (
        <div className="card p-5 border border-brand-200/80 dark:border-brand-900/40 bg-brand-50/20 dark:bg-brand-950/10 animate-slide-up space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-brand-600 dark:text-brand-400" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Add Skill to Inventory
              </h3>
            </div>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              disabled={savingSkill}
              aria-label="Cancel"
            >
              <X size={15} />
            </button>
          </div>

          <form onSubmit={handleAddSkillSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Skill Name Input */}
              <div className="relative">
                <label className="label">Skill Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={addQuery}
                    onChange={(e) => {
                      setAddQuery(e.target.value);
                      setSelectedCatalogSkill(null);
                      setPageError('');
                    }}
                    placeholder="e.g. React, Python, PostgreSQL..."
                    className="input-field text-xs py-2 pr-8"
                    autoFocus
                    required
                  />
                  {addQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setAddQuery('');
                        setSelectedCatalogSkill(null);
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Autocomplete Suggestions */}
                {!selectedCatalogSkill && catalogSuggestions.length > 0 && (
                  <div className="absolute z-30 left-0 right-0 mt-1 bg-white dark:bg-[#12151B] rounded-lg shadow-xl border border-slate-200/80 dark:border-white/[0.1] max-h-48 overflow-y-auto p-1">
                    {catalogSuggestions.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectSuggestion(s);
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-xs rounded-md hover:bg-slate-100 dark:hover:bg-white/[0.06] flex items-center justify-between text-slate-800 dark:text-slate-200"
                      >
                        <span className="font-medium">{s.name}</span>
                        <span className="text-[10px] text-slate-400">{s.category}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="label">Category</label>
                <select
                  value={addCategory}
                  onChange={(e) => setAddCategory(e.target.value)}
                  className="input-field text-xs py-2 bg-white dark:bg-[#12151B]"
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Proficiency Segmented Selector */}
              <div>
                <label className="label">Proficiency Level</label>
                <div className="flex rounded-lg bg-slate-100 dark:bg-white/[0.05] p-0.5 border border-slate-200/60 dark:border-white/[0.06]">
                  {PROFICIENCIES.map((prof) => (
                    <button
                      key={prof}
                      type="button"
                      onClick={() => setAddProficiency(prof)}
                      className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${
                        addProficiency === prof
                          ? 'bg-white dark:bg-[#181C24] text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {prof}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-2 pt-1 border-t border-slate-200/40 dark:border-white/[0.04]">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn-secondary text-xs px-3 py-1.5"
                disabled={savingSkill}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={savingSkill || !addQuery.trim()}
                className="btn-primary text-xs px-3.5 py-1.5 gap-1.5"
              >
                {savingSkill ? (
                  <>
                    <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Plus size={13} />
                    <span>Save Skill</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="card p-3 sm:p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search skills..."
              className="input-field pl-8 py-1.5 text-xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Proficiency Filter */}
          <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
            <span className="text-[11px] font-mono text-slate-400 mr-1 flex items-center gap-1 flex-shrink-0">
              <Filter size={11} />
              Level:
            </span>
            {['All', ...PROFICIENCIES].map((prof) => (
              <button
                key={prof}
                onClick={() => setSelectedProficiency(prof)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  selectedProficiency === prof
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/[0.04]'
                }`}
              >
                {prof}
              </button>
            ))}
          </div>
        </div>

        {/* Category Horizontal Filter Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 dark:border-white/[0.06] no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-0.5 rounded-md text-xs whitespace-nowrap transition-all font-medium ${
                selectedCategory === cat
                  ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800/40'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Display Grid */}
      {filteredUserSkills.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No skills found"
          description={
            searchTerm || selectedCategory !== 'All' || selectedProficiency !== 'All'
              ? 'Try clearing active filters to see your added skills.'
              : 'Add your first skill to compute compatibility with top tech roles.'
          }
          action={
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary text-xs px-3.5 py-1.5"
            >
              <Plus size={14} />
              <span>Add Skill Now</span>
            </button>
          }
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSkills).map(([category, skills]) => (
            <div key={category} className="space-y-2.5">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200/80 dark:border-white/[0.08]">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2 font-mono">
                  <span>{category}</span>
                  <span className="badge badge-gray text-[10px] font-mono">
                    {skills.length}
                  </span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="card p-3.5 card-hover flex flex-col justify-between border border-slate-200/80 dark:border-white/[0.06]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">
                          {skill.name}
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          {skill.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => handleStartEdit(skill)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                          title="Edit proficiency"
                          aria-label={`Edit ${skill.name} proficiency`}
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleRemoveSkill(skill.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                          title="Remove skill"
                          aria-label={`Remove ${skill.name}`}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-white/[0.04] flex items-center justify-between">
                      {editingSkillId === skill.id ? (
                        <div className="flex items-center gap-1.5 w-full">
                          <select
                            value={editingProficiency}
                            onChange={(e) => setEditingProficiency(e.target.value)}
                            className="input-field py-0.5 px-2 text-xs flex-1"
                          >
                            {PROFICIENCIES.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleSaveEdit(skill.id)}
                            className="p-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-md hover:opacity-90"
                            aria-label="Save"
                          >
                            <Check size={12} />
                          </button>
                          <button
                            onClick={() => setEditingSkillId(null)}
                            className="p-1.5 bg-slate-100 dark:bg-white/[0.06] text-slate-500 rounded-md"
                            aria-label="Cancel"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <span
                            className={`badge text-[10px] font-semibold ${
                              skill.proficiency === 'Advanced'
                                ? 'badge-green'
                                : skill.proficiency === 'Intermediate'
                                ? 'badge-yellow'
                                : 'badge-blue'
                            }`}
                          >
                            {skill.proficiency}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Verified
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
