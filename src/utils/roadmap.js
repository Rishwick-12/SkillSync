import { learningResources } from '../data/resources';

/**
 * Generates structured 5-phase personalized roadmap for a given role and missing/improvable skills.
 */
export function generateRoadmap(role, missingSkills = [], improvableSkills = [], company = null) {
  const roadmapId = `rm-${role.id}-${Date.now()}`;
  const skillsToLearn = [...missingSkills, ...improvableSkills];

  // Helper to pick resources
  const getResourceForSkill = (skillKey, defaultName) => {
    const list = learningResources[skillKey] || [];
    if (list.length > 0) {
      return list[0];
    }
    return {
      title: `${defaultName} Official Learning Guide`,
      url: `https://www.google.com/search?q=${encodeURIComponent(defaultName + ' tutorial documentation')}`,
      type: 'Documentation',
      duration: '15 hours',
      free: true,
    };
  };

  // Divide skills or create tasks per phase
  const fundamentalsTasks = [];
  const coreTasks = [];
  const advancedTasks = [];

  skillsToLearn.forEach((s, idx) => {
    const skillKey = s.skillId || s.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const resource = getResourceForSkill(skillKey, s.name);
    const isHigh = s.isEssential !== false;

    const taskObj = {
      id: `task-${skillKey}-${idx}`,
      skillId: skillKey,
      skillName: s.name,
      description: `Understand principles, syntax, and foundational patterns of ${s.name} required for ${role.title}.`,
      resource,
      duration: resource.duration || '12-16 hours',
      priority: isHigh ? 'High' : 'Medium',
      completed: false,
    };

    if (idx % 3 === 0) {
      fundamentalsTasks.push({
        ...taskObj,
        title: `Master ${s.name} Fundamentals`,
        description: `Deep-dive into foundational mechanics and core concepts of ${s.name}.`,
      });
    } else if (idx % 3 === 1) {
      coreTasks.push({
        ...taskObj,
        title: `Core ${s.name} Implementation`,
        description: `Build hands-on modules and apply real-world patterns in ${s.name}.`,
      });
    } else {
      advancedTasks.push({
        ...taskObj,
        title: `Advanced ${s.name} Patterns & Optimization`,
        description: `Explore edge cases, performance benchmarks, and architectural design for ${s.name}.`,
      });
    }
  });

  // Ensure every phase has at least 1-2 realistic tasks even if few skills are missing
  if (fundamentalsTasks.length === 0) {
    fundamentalsTasks.push({
      id: `task-fund-base`,
      skillName: 'CS & Architecture Review',
      title: 'Review System & Computing Fundamentals',
      description: `Refresh essential computational complexity, memory management, and clean code principles.`,
      resource: {
        title: 'TeachYourselfCS Guide',
        url: 'https://teachyourselfcs.com',
        type: 'Curated Guide',
        duration: '20 hours',
        free: true,
      },
      duration: '20 hours',
      priority: 'High',
      completed: false,
    });
  }

  if (coreTasks.length === 0) {
    coreTasks.push({
      id: `task-core-base`,
      skillName: `${role.title} Core Stack`,
      title: `Hands-on Core Stack Mastery`,
      description: `Integrate standard toolchains and production pipelines for ${role.title}.`,
      resource: {
        title: `${role.title} Developer Roadmap`,
        url: 'https://roadmap.sh',
        type: 'Roadmap',
        duration: '25 hours',
        free: true,
      },
      duration: '25 hours',
      priority: 'High',
      completed: false,
    });
  }

  if (advancedTasks.length === 0) {
    advancedTasks.push({
      id: `task-adv-base`,
      skillName: 'Production Readiness',
      title: 'Enterprise Architecture & Cloud Optimization',
      description: `Understand scaling, caching strategies, distributed resilience, and micro-frontend/service setups.`,
      resource: {
        title: 'High Scalability Architecture Patterns',
        url: 'http://highscalability.com',
        type: 'Article Series',
        duration: '15 hours',
        free: true,
      },
      duration: '15 hours',
      priority: 'Medium',
      completed: false,
    });
  }

  const projectTasks = [
    {
      id: `task-proj-1`,
      skillName: 'Capstone Project',
      title: `Build Full-featured ${role.title} Portfolio Project`,
      description: `Architect and deploy an end-to-end application simulating ${company ? company.name : 'enterprise'} real-world scale with automated testing.`,
      resource: {
        title: 'Production Ready Project Checklist',
        url: 'https://github.com',
        type: 'Repository Blueprint',
        duration: '35 hours',
        free: true,
      },
      duration: '35 hours',
      priority: 'High',
      completed: false,
    },
    {
      id: `task-proj-2`,
      skillName: 'CI/CD & Documentation',
      title: 'Deployment, CI/CD Pipeline & Technical Documentation',
      description: 'Setup GitHub Actions CI/CD pipeline, write comprehensive README, API specs, and architecture diagrams.',
      resource: {
        title: 'GitHub Actions Documentation',
        url: 'https://docs.github.com/actions',
        type: 'Documentation',
        duration: '10 hours',
        free: true,
      },
      duration: '10 hours',
      priority: 'Medium',
      completed: false,
    },
  ];

  const interviewTasks = [
    {
      id: `task-int-1`,
      skillName: 'DSA & Coding rounds',
      title: 'Technical Problem Solving & DSA Drills',
      description: 'Solve top 50 company-specific algorithms, data structures, and edge-case coding problems.',
      resource: {
        title: 'LeetCode Curated Blind 75',
        url: 'https://leetcode.com',
        type: 'Interactive Platform',
        duration: '40 hours',
        free: true,
      },
      duration: '40 hours',
      priority: 'High',
      completed: false,
    },
    {
      id: `task-int-2`,
      skillName: 'Behavioral & System Design',
      title: 'Mock Technical & Behavioral Interviews',
      description: `Simulate mock interviews focusing on STAR method, leadership principles${company ? ` at ${company.name}` : ''}, and system design walkthroughs.`,
      resource: {
        title: 'Pramp Mock Technical Interviews',
        url: 'https://www.pramp.com',
        type: 'Mock Platform',
        duration: '15 hours',
        free: true,
      },
      duration: '15 hours',
      priority: 'High',
      completed: false,
    },
  ];

  const phases = [
    {
      id: 'phase-1',
      number: 1,
      title: 'Fundamentals',
      description: 'Core concepts, syntax, and foundational requirements.',
      tasks: fundamentalsTasks,
    },
    {
      id: 'phase-2',
      number: 2,
      title: 'Core Technical Skills',
      description: 'Production standards, library deep-dives, and data flows.',
      tasks: coreTasks,
    },
    {
      id: 'phase-3',
      number: 3,
      title: 'Frameworks and Advanced Concepts',
      description: 'Advanced architecture, performance optimization, and internals.',
      tasks: advancedTasks,
    },
    {
      id: 'phase-4',
      number: 4,
      title: 'Projects and Practical Experience',
      description: 'Build enterprise-grade capstone and demonstrate real outcomes.',
      tasks: projectTasks,
    },
    {
      id: 'phase-5',
      number: 5,
      title: 'Interview Preparation',
      description: 'DSA coding sprints, live system design, and behavioral drills.',
      tasks: interviewTasks,
    },
  ];

  const totalTasks = phases.reduce((acc, p) => acc + p.tasks.length, 0);

  return {
    id: roadmapId,
    roleId: role.id,
    roleTitle: role.title,
    companyId: company ? company.id : null,
    companyName: company ? company.name : null,
    createdAt: new Date().toISOString(),
    targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString().split('T')[0], // 60 days default
    totalTasks,
    phases,
  };
}

export function getRoadmapProgress(roadmap, completedTaskIds = []) {
  if (!roadmap || !roadmap.phases) {
    return { total: 0, completed: 0, percentage: 0 };
  }
  const allTasks = [];
  roadmap.phases.forEach((p) => {
    (p.tasks || []).forEach((t) => allTasks.push(t));
  });

  const total = allTasks.length;
  const completedSet = new Set(completedTaskIds || []);
  const completed = allTasks.filter((t) => completedSet.has(t.id)).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, completed, percentage };
}
