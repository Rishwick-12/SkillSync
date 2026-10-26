export const skillCategories = {
  'Programming Languages': { color: 'blue', icon: 'Code' },
  'Web Development': { color: 'purple', icon: 'Globe' },
  'Databases': { color: 'green', icon: 'Database' },
  'DSA & CS Fundamentals': { color: 'orange', icon: 'Cpu' },
  'AI & Machine Learning': { color: 'pink', icon: 'Brain' },
  'Cloud & DevOps': { color: 'cyan', icon: 'Cloud' },
  'Mobile Development': { color: 'indigo', icon: 'Smartphone' },
  'Soft Skills': { color: 'yellow', icon: 'Users' },
  'Tools & Version Control': { color: 'gray', icon: 'Tool' },
  'Data Science': { color: 'teal', icon: 'BarChart' },
  'Cybersecurity': { color: 'red', icon: 'Shield' },
  'Design': { color: 'rose', icon: 'Pen' },
};

export const skillsCatalog = [
  // Programming Languages
  { id: 'javascript', name: 'JavaScript', category: 'Web Development', aliases: ['JS', 'ES6', 'ES2015', 'ECMAScript'] },
  { id: 'typescript', name: 'TypeScript', category: 'Web Development', aliases: ['TS'] },
  { id: 'python', name: 'Python', category: 'Programming Languages', aliases: ['py', 'Python3'] },
  { id: 'java', name: 'Java', category: 'Programming Languages', aliases: ['Java SE', 'JDK'] },
  { id: 'cpp', name: 'C++', category: 'Programming Languages', aliases: ['CPP', 'C Plus Plus'] },
  { id: 'c', name: 'C', category: 'Programming Languages', aliases: ['C Language'] },
  { id: 'csharp', name: 'C#', category: 'Programming Languages', aliases: ['C Sharp', 'dotnet', '.NET'] },
  { id: 'go', name: 'Go', category: 'Programming Languages', aliases: ['Golang'] },
  { id: 'rust', name: 'Rust', category: 'Programming Languages', aliases: ['Rust Lang'] },
  { id: 'scala', name: 'Scala', category: 'Programming Languages', aliases: ['Scala Lang'] },
  { id: 'r', name: 'R', category: 'Data Science', aliases: ['R Language', 'R Programming'] },
  { id: 'kotlin', name: 'Kotlin', category: 'Mobile Development', aliases: ['Kotlin Lang'] },
  { id: 'swift', name: 'Swift', category: 'Mobile Development', aliases: ['Swift Lang', 'Apple Swift'] },

  // Web Development
  { id: 'html', name: 'HTML', category: 'Web Development', aliases: ['HTML5', 'HyperText Markup Language'] },
  { id: 'css', name: 'CSS', category: 'Web Development', aliases: ['CSS3', 'Cascading Style Sheets', 'SCSS', 'Sass'] },
  { id: 'react', name: 'React', category: 'Web Development', aliases: ['React.js', 'ReactJS', 'React Native Web'] },
  { id: 'nodejs', name: 'Node.js', category: 'Web Development', aliases: ['NodeJS', 'Node', 'Express.js', 'Express'] },
  { id: 'angular', name: 'Angular', category: 'Web Development', aliases: ['AngularJS', 'Angular 2+'] },
  { id: 'vue', name: 'Vue.js', category: 'Web Development', aliases: ['Vue', 'VueJS', 'Vue 3'] },
  { id: 'nextjs', name: 'Next.js', category: 'Web Development', aliases: ['NextJS', 'Next'] },
  { id: 'graphql', name: 'GraphQL', category: 'Web Development', aliases: ['GQL'] },
  { id: 'rest-api', name: 'REST APIs', category: 'Web Development', aliases: ['RESTful API', 'REST', 'HTTP API'] },
  { id: 'webpack', name: 'Webpack', category: 'Web Development', aliases: ['Bundler', 'Vite'] },
  { id: 'testing', name: 'Testing (Jest/RTL)', category: 'Tools & Version Control', aliases: ['Jest', 'React Testing Library', 'Unit Testing', 'Selenium', 'PyTest'] },

  // Databases
  { id: 'sql', name: 'SQL', category: 'Databases', aliases: ['Structured Query Language', 'RDBMS'] },
  { id: 'postgresql', name: 'PostgreSQL', category: 'Databases', aliases: ['Postgres', 'pg'] },
  { id: 'mysql', name: 'MySQL', category: 'Databases', aliases: ['MySQL DB'] },
  { id: 'mongodb', name: 'MongoDB', category: 'Databases', aliases: ['Mongo', 'NoSQL', 'Document DB'] },
  { id: 'redis', name: 'Redis', category: 'Databases', aliases: ['Redis Cache', 'In-memory DB'] },
  { id: 'sqlite', name: 'SQLite', category: 'Databases', aliases: ['SQLite3'] },
  { id: 'elasticsearch', name: 'Elasticsearch', category: 'Databases', aliases: ['ElasticSearch', 'ELK'] },
  { id: 'cassandra', name: 'Apache Cassandra', category: 'Databases', aliases: ['Cassandra', 'NoSQL'] },

  // DSA & CS Fundamentals
  { id: 'data-structures', name: 'Data Structures', category: 'DSA & CS Fundamentals', aliases: ['DSA', 'Arrays', 'LinkedList', 'Trees', 'Graphs', 'Heap'] },
  { id: 'algorithms', name: 'Algorithms', category: 'DSA & CS Fundamentals', aliases: ['Sorting', 'Searching', 'Dynamic Programming', 'DP', 'BFS', 'DFS'] },
  { id: 'system-design', name: 'System Design', category: 'DSA & CS Fundamentals', aliases: ['HLD', 'LLD', 'High Level Design', 'Low Level Design', 'Distributed Systems'] },
  { id: 'os', name: 'Operating Systems', category: 'DSA & CS Fundamentals', aliases: ['OS Concepts', 'Process Management', 'Memory Management'] },
  { id: 'networking', name: 'Networking', category: 'DSA & CS Fundamentals', aliases: ['TCP/IP', 'HTTP', 'DNS', 'Computer Networks'] },
  { id: 'oops', name: 'OOP Concepts', category: 'DSA & CS Fundamentals', aliases: ['Object Oriented Programming', 'OOP', 'OOPS'] },
  { id: 'dbms', name: 'DBMS', category: 'DSA & CS Fundamentals', aliases: ['Database Management System', 'ACID', 'Transactions', 'Normalization'] },

  // AI & Machine Learning
  { id: 'machine-learning', name: 'Machine Learning', category: 'AI & Machine Learning', aliases: ['ML', 'Supervised Learning', 'Unsupervised Learning'] },
  { id: 'deep-learning', name: 'Deep Learning', category: 'AI & Machine Learning', aliases: ['DL', 'Neural Networks', 'CNN', 'RNN', 'Transformer'] },
  { id: 'tensorflow', name: 'TensorFlow', category: 'AI & Machine Learning', aliases: ['TF', 'Keras'] },
  { id: 'pytorch', name: 'PyTorch', category: 'AI & Machine Learning', aliases: ['Torch'] },
  { id: 'scikit-learn', name: 'Scikit-Learn', category: 'AI & Machine Learning', aliases: ['sklearn', 'scikit'] },
  { id: 'pandas', name: 'Pandas', category: 'AI & Machine Learning', aliases: ['pd', 'Python Pandas'] },
  { id: 'numpy', name: 'NumPy', category: 'AI & Machine Learning', aliases: ['np', 'Numerical Python'] },
  { id: 'statistics', name: 'Statistics & Probability', category: 'AI & Machine Learning', aliases: ['Stats', 'Probability', 'Statistical Analysis', 'Bayesian'] },
  { id: 'nlp', name: 'Natural Language Processing', category: 'AI & Machine Learning', aliases: ['NLP', 'Text Processing', 'BERT', 'GPT', 'LLM'] },
  { id: 'computer-vision', name: 'Computer Vision', category: 'AI & Machine Learning', aliases: ['CV', 'Image Processing', 'Object Detection', 'OpenCV'] },
  { id: 'data-visualization', name: 'Data Visualization', category: 'Data Science', aliases: ['Matplotlib', 'Seaborn', 'Plotly', 'Tableau', 'Power BI'] },

  // Cloud & DevOps
  { id: 'aws', name: 'AWS', category: 'Cloud & DevOps', aliases: ['Amazon Web Services', 'EC2', 'S3', 'Lambda', 'SageMaker'] },
  { id: 'gcp', name: 'GCP', category: 'Cloud & DevOps', aliases: ['Google Cloud Platform', 'BigQuery', 'Dataflow', 'GKE'] },
  { id: 'azure', name: 'Azure', category: 'Cloud & DevOps', aliases: ['Microsoft Azure', 'Azure DevOps'] },
  { id: 'docker', name: 'Docker', category: 'Cloud & DevOps', aliases: ['Containerization', 'Docker Compose', 'Dockerfile'] },
  { id: 'kubernetes', name: 'Kubernetes', category: 'Cloud & DevOps', aliases: ['K8s', 'Helm', 'Kubectl'] },
  { id: 'linux', name: 'Linux', category: 'Cloud & DevOps', aliases: ['Unix', 'Ubuntu', 'Shell', 'Bash', 'Terminal'] },
  { id: 'bash', name: 'Bash Scripting', category: 'Cloud & DevOps', aliases: ['Shell Scripting', 'Bash', 'Zsh'] },
  { id: 'ci-cd', name: 'CI/CD', category: 'Cloud & DevOps', aliases: ['Jenkins', 'GitHub Actions', 'GitLab CI', 'CircleCI', 'Continuous Integration'] },
  { id: 'terraform', name: 'Terraform', category: 'Cloud & DevOps', aliases: ['IaC', 'Infrastructure as Code', 'Ansible'] },
  { id: 'monitoring', name: 'Monitoring & Observability', category: 'Cloud & DevOps', aliases: ['Prometheus', 'Grafana', 'Datadog', 'CloudWatch', 'ELK Stack'] },
  { id: 'spark', name: 'Apache Spark', category: 'Cloud & DevOps', aliases: ['PySpark', 'Spark Streaming'] },
  { id: 'kafka', name: 'Apache Kafka', category: 'Cloud & DevOps', aliases: ['Message Queue', 'Event Streaming', 'Pub/Sub'] },

  // Mobile Development
  { id: 'android', name: 'Android Development', category: 'Mobile Development', aliases: ['Android SDK', 'Android Studio', 'MVVM Android'] },
  { id: 'ios', name: 'iOS Development', category: 'Mobile Development', aliases: ['iOS SDK', 'UIKit', 'Xcode'] },
  { id: 'react-native', name: 'React Native', category: 'Mobile Development', aliases: ['RN', 'Cross Platform Mobile'] },
  { id: 'flutter', name: 'Flutter', category: 'Mobile Development', aliases: ['Dart', 'Flutter SDK'] },

  // Soft Skills
  { id: 'communication', name: 'Communication', category: 'Soft Skills', aliases: ['Verbal Communication', 'Written Communication', 'Presentation'] },
  { id: 'teamwork', name: 'Teamwork', category: 'Soft Skills', aliases: ['Collaboration', 'Team Player', 'Leadership'] },
  { id: 'problem-solving', name: 'Problem Solving', category: 'Soft Skills', aliases: ['Critical Thinking', 'Debugging', 'Troubleshooting'] },
  { id: 'analytical-thinking', name: 'Analytical Thinking', category: 'Soft Skills', aliases: ['Data-driven', 'Research Skills', 'Root Cause Analysis'] },
  { id: 'agile', name: 'Agile / Scrum', category: 'Soft Skills', aliases: ['Scrum', 'Kanban', 'Sprint Planning', 'Agile Methodology'] },
  { id: 'time-management', name: 'Time Management', category: 'Soft Skills', aliases: ['Productivity', 'Prioritization', 'Deadline Management'] },

  // Tools & Version Control
  { id: 'git', name: 'Git', category: 'Tools & Version Control', aliases: ['GitHub', 'GitLab', 'Bitbucket', 'Version Control'] },
  { id: 'jira', name: 'Jira', category: 'Tools & Version Control', aliases: ['Project Management', 'Issue Tracker', 'Confluence'] },
  { id: 'figma', name: 'Figma', category: 'Design', aliases: ['Figma Design', 'Sketch', 'Adobe XD'] },

  // Cybersecurity
  { id: 'security', name: 'Information Security', category: 'Cybersecurity', aliases: ['InfoSec', 'Cybersecurity', 'Network Security'] },
  { id: 'security-protocols', name: 'Security Protocols', category: 'Cybersecurity', aliases: ['TLS/SSL', 'OAuth', 'HTTPS', 'JWT'] },
];
