export type Locale = 'en' | 'zh';

export const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.skills': 'Skills',
    'nav.projects': 'Projects',
    'nav.blog': 'Blog',
    'nav.experience': 'Experience',
    'nav.contact': 'Contact',
    // Hero
    'hero.badge': 'Open to Collaboration',
    'hero.title1': 'AI Engineer',
    'hero.title2': 'Drone Intelligence',
    'hero.desc': 'Specializing in deep learning model training, edge deployment, and performance optimization for unmanned aerial systems. Building intelligent perception and decision-making pipelines that fly.',
    'hero.btnProjects': 'View Projects',
    'hero.btnContact': 'Get in Touch',
    'hero.stat1': 'Years in AI/ML',
    'hero.stat2': 'Models Deployed',
    'hero.stat3': 'Drone Projects',
    'hero.stat4': 'Avg. Inference Speedup',
    // About
    'about.label': 'About',
    'about.title': 'Bridging AI and Aerial Robotics',
    'about.p1': 'As an AI engineer deeply embedded in the drone industry, I focus on designing and deploying intelligent systems that enable unmanned aerial vehicles to perceive, reason, and act autonomously in complex environments.',
    'about.p2': 'My work spans the full machine learning lifecycle: from data collection and annotation pipeline design, through model architecture research and distributed training, to on-device optimization and real-time inference on edge hardware such as NVIDIA Jetson and Qualcomm platforms.',
    'about.p3': 'I am passionate about pushing the boundaries of what autonomous aerial systems can achieve — from real-time object detection and semantic segmentation for obstacle avoidance, to multi-sensor fusion and path planning algorithms that operate reliably in GPS-denied environments.',
    // Skills
    'skills.label': 'Technical Skills',
    'skills.title': 'Core Competencies',
    'skills.desc': 'End-to-end AI engineering capabilities, from research prototyping to production-grade deployment on aerial platforms.',
    'skills.viewAll': 'View All Skills',
    // Projects
    'projects.label': 'Projects',
    'projects.title': 'Featured Work',
    'projects.desc': 'Selected projects demonstrating AI engineering expertise applied to unmanned aerial systems.',
    'projects.viewAll': 'View All Projects',
    'projects.viewDetail': 'View Details',
    // Blog
    'blog.label': 'Blog',
    'blog.title': 'Latest Articles',
    'blog.desc': 'Technical insights and learnings from the intersection of AI and drone systems.',
    'blog.viewAll': 'View All Articles',
    'blog.readMore': 'Read More',
    // Experience
    'exp.label': 'Experience',
    'exp.title': 'Professional Journey',
    // Contact
    'contact.label': 'Contact',
    'contact.title': "Let's Connect",
    'contact.desc': 'Interested in collaboration on drone AI, edge computing, or autonomous systems? Feel free to reach out.',
    // Footer
    'footer.text': '© 2025 AI Engineer Portfolio. Built with passion for intelligent aerial systems.',
    // Common
    'common.back': 'Back',
    'common.techStack': 'Tech Stack',
    'common.keyResults': 'Key Results',
    'common.relatedProjects': 'Related Projects',
    'common.overview': 'Overview',
    'common.tags': 'Tags',
  },
  zh: {
    // Nav
    'nav.home': '首页',
    'nav.about': '关于',
    'nav.skills': '技能',
    'nav.projects': '项目',
    'nav.blog': '博客',
    'nav.experience': '经历',
    'nav.contact': '联系',
    // Hero
    'hero.badge': '开放合作',
    'hero.title1': 'AI 工程师',
    'hero.title2': '无人机智能',
    'hero.desc': '专注于无人机系统的深度学习模型训练、边缘部署与性能优化。构建能够飞行的智能感知与决策管线。',
    'hero.btnProjects': '查看项目',
    'hero.btnContact': '联系我',
    'hero.stat1': 'AI/ML 从业年限',
    'hero.stat2': '部署模型数',
    'hero.stat3': '无人机项目',
    'hero.stat4': '平均推理加速',
    // About
    'about.label': '关于我',
    'about.title': '连接 AI 与航空机器人',
    'about.p1': '作为深耕无人机行业的 AI 工程师，我专注于设计和部署智能系统，使无人机能够在复杂环境中自主感知、推理和行动。',
    'about.p2': '我的工作覆盖机器学习的全生命周期：从数据采集和标注管线设计，到模型架构研究和分布式训练，再到 NVIDIA Jetson 和高通等边缘硬件上的端侧优化和实时推理。',
    'about.p3': '我热衷于推动自主航空系统的边界——从用于避障的实时目标检测和语义分割，到在 GPS 拒止环境中可靠运行的多传感器融合和路径规划算法。',
    // Skills
    'skills.label': '技术技能',
    'skills.title': '核心能力',
    'skills.desc': '端到端 AI 工程能力，从研究原型到航空平台生产级部署。',
    'skills.viewAll': '查看全部技能',
    // Projects
    'projects.label': '项目',
    'projects.title': '精选作品',
    'projects.desc': '精选项目，展示应用于无人机系统的 AI 工程专业能力。',
    'projects.viewAll': '查看全部项目',
    'projects.viewDetail': '查看详情',
    // Blog
    'blog.label': '博客',
    'blog.title': '最新文章',
    'blog.desc': '来自 AI 与无人机系统交叉领域的技术洞察与学习心得。',
    'blog.viewAll': '查看全部文章',
    'blog.readMore': '阅读更多',
    // Experience
    'exp.label': '工作经历',
    'exp.title': '职业历程',
    // Contact
    'contact.label': '联系我',
    'contact.title': '联系我',
    'contact.desc': '对无人机 AI、边缘计算或自主系统合作感兴趣？欢迎联系。',
    // Footer
    'footer.text': '© 2025 AI 工程师个人主页。以对智能航空系统的热爱而构建。',
    // Common
    'common.back': '返回',
    'common.techStack': '技术栈',
    'common.keyResults': '关键成果',
    'common.relatedProjects': '相关项目',
    'common.overview': '概述',
    'common.tags': '标签',
  },
};
