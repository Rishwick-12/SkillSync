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
  const { userSkills, addSkill, removeSkill, updateSkillProficiency } = useApp();

  // Search & filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProficiency, setSelectedProficiency] = useState('All');

  // Add / Edit Skill modal states
  const [showAddForm, setShowAddForm] = useState(false);
  const [addQuery, setAddQuery] = useState('');
  const [selectedCatalogSkill, setSelectedCatalogSkill] = useState(null);
  const [addCategory, setAddCategory] = useState('Web Development');
  const [addProficiency, setAddProficiency] = useState('Intermediate');
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [editingProficiency, setEditingProficiency] = useState('Intermediate');

  // Filter existing skills
  const filteredUserSkills = useMemo(() => {
    return userSkills.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || s.category === selectedCategory;
      const matchesProficiency =
        selectedProficiency === 'All' || s.proficiency === selectedProficiency;
      return matchesSearch && matchesCategory && matchesProficiency;
    });
  }, [userSkills, searchTerm, selectedCategory, selectedProficiency]);

  // Catalog search suggestions when adding
  const catalogSuggestions = useMemo(() => {
    if (!addQuery.trim()) return [];
    const q = addQuery.toLowerCase();
    const existingNames = new Set(userSkills.map((s) => s.name.toLowerCase()));

    return skillsCatalog
      .filter((s) => {
        const matches =
          s.name.toLowerCase().includes(q) ||
          (s.aliases && s.aliases.some((a) => a.toLowerCase().includes(q)));
        return matches && !existingNames.has(s.name.toLowerCase());
      })
      .slice(0, 6);
  }, [addQuery, userSkills]);

  const handleSelectSuggestion = (s) => {
    setSelectedCatalogSkill(s);
    setAddQuery(s.name);
    if (s.category) setAddCategory(s.category);
  };

  const handleAddSkillSubmit = (e) => {
    e.preventDefault();
    if (!addQuery.trim()) return;

    const skillName = selectedCatalogSkill ? selectedCatalogSkill.name : addQuery.trim();
    const skillCategory = selectedCatalogSkill ? selectedCatalogSkill.category : addCategory;
    const skillId = selectedCatalogSkill
      ? selectedCatalogSkill.id
      : skillName.toLowerCase().replace(/[^a-z0-9]/g, '-');

    addSkill({
      id: skillId,
      skillId,
      name: skillName,
      category: skillCategory,
      proficiency: addProficiency,
    });

    setAddQuery('');
    setSelectedCatalogSkill(null);
    setShowAddForm(false);
  };

  const handleStartEdit = (skill) => {
    setEditingSkillId(skill.id);
    setEditingProficiency(skill.proficiency);
  };

  const handleSaveEdit = (skillId) => {
    updateSkillProficiency(skillId, editingProficiency);
    setEditingSkillId(null);
  };

  // Group user skills by category
  const groupedSkills = useMemo(() => {
    const groups = {};
    filteredUserSkills.forEach((skill) => {
      const cat = skill.category || 'General';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(skill);
    });
    return groups;
  }, [filteredUserSkills]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            My Skills
            <span className="badge badge-blue">{userSkills.length} Verified</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Add the skills you have learned. SkillSync automatically updates your job compatibility scores.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary self-start sm:self-auto text-xs"
        >
          <Plus size={16} />
          Add Skill
        </button>
      </div>

      {/* Add Skill Panel */}
      {showAddForm && (
        <div className="card border-2 border-blue-200 dark:border-blue-800 bg-blue-50/40 dark:bg-slate-800/90 animate-slide-up p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles size={18} className="text-blue-600" />
              Add a Skill to Your Profile
            </h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleAddSkillSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Skill Input with suggestions */}
              <div className="relative">
                <label className="label">Skill Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={addQuery}
                    onChange={(e) => {
                      setAddQuery(e.target.value);
                      setSelectedCatalogSkill(null);
                    }}
                    placeholder="e.g. React, Python, SQL..."
                    className="input-field"
                    autoFocus
                  />
                  {addQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setAddQuery('');
                        setSelectedCatalogSkill(null);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {catalogSuggestions.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 max-h-48 overflow-y-auto p-1">
                    {catalogSuggestions.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleSelectSuggestion(s)}
                        className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 flex items-center justify-between text-slate-800 dark:text-white"
                      >
                        <span className="font-semibold">{s.name}</span>
                        <span className="text-[11px] text-slate-400">{s.category}</span>
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
                  className="input-field text-xs"
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Proficiency Level */}
              <div>
                <label className="label">Your Proficiency</label>
                <div className="flex rounded-xl bg-slate-100 dark:bg-slate-700 p-1">
                  {PROFICIENCIES.map((prof) => (
                    <button
                      key={prof}
                      type="button"
                      onClick={() => setAddProficiency(prof)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        addProficiency === prof
                          ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {prof}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary text-xs">
                <Plus size={14} />
                Save Skill
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your skills..."
              className="input-field pl-9 py-2 text-xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Filter size={12} /> Level:
            </span>
            {['All', ...PROFICIENCIES].map((prof) => (
              <button
                key={prof}
                onClick={() => setSelectedProficiency(prof)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedProficiency === prof
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {prof}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-700/60 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Display */}
      {filteredUserSkills.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No skills found"
          description={
            searchTerm || selectedCategory !== 'All' || selectedProficiency !== 'All'
              ? 'Try clearing your filters or search term to see your skills.'
              : 'Add your first skill to begin matching with companies and job roles.'
          }
          action={
            <button onClick={() => setShowAddForm(true)} className="btn-primary text-xs">
              <Plus size={16} /> Add Skill Now
            </button>
          }
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSkills).map(([category, skills]) => (
            <div key={category} className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span>{category}</span>
                  <span className="badge badge-gray text-[10px]">{skills.length}</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="card p-4 card-hover flex flex-col justify-between border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {skill.name}
                        </h4>
                        <span className="text-[11px] text-slate-400">{skill.category}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEdit(skill)}
                          className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                          title="Edit proficiency"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => removeSkill(skill.id)}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                          title="Remove skill"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                      {editingSkillId === skill.id ? (
                        <div className="flex items-center gap-2 w-full">
                          <select
                            value={editingProficiency}
                            onChange={(e) => setEditingProficiency(e.target.value)}
                            className="input-field py-1 text-xs"
                          >
                            {PROFICIENCIES.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleSaveEdit(skill.id)}
                            className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            <Check size={13} />
                          </button>
                          <button
                            onClick={() => setEditingSkillId(null)}
                            className="p-1.5 bg-slate-200 dark:bg-slate-700 text-slate-600 rounded-lg"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <span
                            className={`badge text-[11px] font-semibold ${
                              skill.proficiency === 'Advanced'
                                ? 'badge-green'
                                : skill.proficiency === 'Intermediate'
                                ? 'badge-yellow'
                                : 'badge-blue'
                            }`}
                          >
                            {skill.proficiency}
                          </span>
                          <span className="text-[10px] text-slate-400">
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
