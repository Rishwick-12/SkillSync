export const proficiencyOrder = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
};

export function meetsRequirement(userProficiency, requiredProficiency) {
  if (!userProficiency) return false;
  const userRank = proficiencyOrder[userProficiency] || 0;
  const reqRank = proficiencyOrder[requiredProficiency] || 1;
  return userRank >= reqRank;
}

export function getMatchColor(percentage) {
  if (percentage >= 75) return 'green';
  if (percentage >= 50) return 'yellow';
  if (percentage >= 25) return 'orange';
  return 'red';
}

export function getMatchLabel(percentage) {
  if (percentage >= 85) return 'Exceptional Match';
  if (percentage >= 70) return 'Strong Match';
  if (percentage >= 50) return 'Moderate Match';
  if (percentage >= 30) return 'Emerging Match';
  return 'Skill Gap';
}

/**
 * Categorizes a role's required and preferred skills against the user's skill set.
 * Returns:
 * - have: skills user has meeting or exceeding required proficiency
 * - improve: skills user has but below required proficiency
 * - missing: skills user doesn't possess at all
 */
export function categorizeSkills(userSkills = [], role) {
  const userSkillMap = new Map();
  userSkills.forEach((s) => {
    userSkillMap.set(s.skillId?.toLowerCase() || s.id?.toLowerCase() || s.name.toLowerCase(), s);
  });

  const have = [];
  const improve = [];
  const missing = [];

  const allRoleSkills = [
    ...(role.requiredSkills || []).map((s) => ({ ...s, isRequired: true })),
    ...(role.preferredSkills || []).map((s) => ({ ...s, isRequired: false })),
  ];

  allRoleSkills.forEach((reqSkill) => {
    const key = reqSkill.skillId?.toLowerCase() || reqSkill.name.toLowerCase();
    const userSkill = userSkillMap.get(key);

    const enriched = {
      ...reqSkill,
      userProficiency: userSkill ? userSkill.proficiency : null,
      hasSkill: !!userSkill,
    };

    if (!userSkill) {
      missing.push(enriched);
    } else if (meetsRequirement(userSkill.proficiency, reqSkill.proficiency)) {
      have.push(enriched);
    } else {
      improve.push(enriched);
    }
  });

  return { have, improve, missing };
}

/**
 * Calculates match percentage strictly using the project prompt formula:
 * Match Percentage = (Matching Required Skills / Total Required Skills) * 100
 * A skill is counted as matching if the user has it.
 */
export function calculateMatch(userSkills = [], role) {
  if (!role || !role.requiredSkills || role.requiredSkills.length === 0) {
    return {
      percentage: 0,
      matchingCount: 0,
      totalRequired: 0,
      matchingRequiredSkills: [],
      missingRequiredSkills: [],
      improvableSkills: [],
      have: [],
      improve: [],
      missing: [],
    };
  }

  const { have, improve, missing } = categorizeSkills(userSkills, role);

  const totalRequired = role.requiredSkills.length;
  // Matching required skills: skills the user possesses (whether meeting proficiency or needing improvement)
  const userSkillKeySet = new Set(
    userSkills.map((s) => s.skillId?.toLowerCase() || s.id?.toLowerCase() || s.name.toLowerCase())
  );

  const matchingRequiredSkills = role.requiredSkills.filter((req) => {
    const key = req.skillId?.toLowerCase() || req.name.toLowerCase();
    return userSkillKeySet.has(key);
  });

  const missingRequiredSkills = role.requiredSkills.filter((req) => {
    const key = req.skillId?.toLowerCase() || req.name.toLowerCase();
    return !userSkillKeySet.has(key);
  });

  const rawPercentage = (matchingRequiredSkills.length / totalRequired) * 100;
  const percentage = Math.round(rawPercentage);

  return {
    percentage,
    matchingCount: matchingRequiredSkills.length,
    totalRequired,
    matchingRequiredSkills,
    missingRequiredSkills,
    have,
    improve,
    missing,
  };
}
