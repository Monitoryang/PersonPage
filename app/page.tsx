'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n-context';
import { projects } from '@/data/projects';
import { skills } from '@/data/skills';
import { posts } from '@/data/posts';
import { Locale } from '@/lib/i18n';

export default function Home() {
  const { t, locale } = useI18n();
  const l = locale as Locale;

  return (
    <>
      {/* Hero */}
      <section className="min-h-screen flex items-center px-6 relative overflow-hidden">
        <div className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute -bottom-[100px] -left-[100px] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.06)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.2)] text-[13px] font-medium text-primary-light mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-dot" />
            {t('hero.badge')}
          </div>
          <h1 className="text-[clamp(40px,6vw,72px)] font-bold leading-[1.1] mb-6">
            {t('hero.title1')}<br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('hero.title2')}
            </span>
          </h1>
          <p className="text-[clamp(16px,2vw,20px)] text-text-secondary max-w-[580px] leading-[1.7] mb-10">
            {t('hero.desc')}
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/projects" className="inline-flex items-center gap-2 px-7 py-3 rounded-lg bg-primary text-white font-semibold text-[15px] shadow-[0_4px_16px_rgba(124,58,237,0.3)] hover:bg-[#6D28D9] hover:-translate-y-0.5 transition-all cursor-pointer">
              {t('hero.btnProjects')}
            </Link>
            <Link href="#contact" className="inline-flex items-center gap-2 px-7 py-3 rounded-lg bg-transparent text-text border border-border font-semibold text-[15px] hover:border-primary-light hover:bg-[rgba(124,58,237,0.05)] transition-all cursor-pointer">
              {t('hero.btnContact')}
            </Link>
          </div>
          <div className="flex gap-12 mt-16 pt-10 border-t border-border flex-wrap">
            {[
              { num: '5+', label: t('hero.stat1') },
              { num: '20+', label: t('hero.stat2') },
              { num: '10+', label: t('hero.stat3') },
              { num: '3x', label: t('hero.stat4') },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-[32px] font-bold tabular-nums">{s.num}</div>
                <div className="text-[13px] text-text-muted mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[2px] text-primary-light mb-3">{t('about.label')}</p>
          <h2 className="text-[clamp(28px,4vw,40px)] font-bold leading-[1.2] mb-5">{t('about.title')}</h2>
          <div className="grid md:grid-cols-2 gap-16 mt-12">
            <div className="space-y-4">
              <p className="text-text-secondary leading-[1.8] text-[15px]">{t('about.p1')}</p>
              <p className="text-text-secondary leading-[1.8] text-[15px]">{t('about.p2')}</p>
              <p className="text-text-secondary leading-[1.8] text-[15px]">{t('about.p3')}</p>
            </div>
            <div className="space-y-4">
              {[
                { title: locale === 'en' ? 'Model Training' : '模型训练', desc: locale === 'en' ? 'Large-scale distributed training with PyTorch, mixed-precision, and custom data augmentation pipelines.' : '基于 PyTorch 的大规模分布式训练、混合精度训练以及自定义数据增强管线。' },
                { title: locale === 'en' ? 'Edge Deployment' : '边缘部署', desc: locale === 'en' ? 'TensorRT, ONNX Runtime, and custom quantization for real-time inference on Jetson Orin and embedded GPUs.' : '基于 TensorRT、ONNX Runtime 和自定义量化方案，在 Jetson Orin 和嵌入式 GPU 上实现实时推理。' },
                { title: locale === 'en' ? 'Performance Optimization' : '性能优化', desc: locale === 'en' ? 'Profiling-driven optimization: pruning, knowledge distillation, and architecture search for latency-critical applications.' : '驱动型性能分析优化：模型剪枝、知识蒸馏和架构搜索，服务于延迟敏感型应用。' },
              ].map((item) => (
                <div key={item.title} className="p-5 rounded-xl bg-bg-card border border-border transition-all hover:border-[rgba(124,58,237,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.15)]">
                  <h4 className="text-[15px] font-semibold mb-1.5">{item.title}</h4>
                  <p className="text-[13px] text-text-muted leading-[1.6]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Preview */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[2px] text-primary-light mb-3">{t('skills.label')}</p>
          <h2 className="text-[clamp(28px,4vw,40px)] font-bold leading-[1.2] mb-2">{t('skills.title')}</h2>
          <p className="text-base text-text-secondary max-w-[600px] leading-[1.7] mb-12">{t('skills.desc')}</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <Link
                key={skill.slug}
                href={`/skills/${skill.slug}`}
                className="group p-8 rounded-xl bg-bg-card border border-border transition-all hover:border-[rgba(124,58,237,0.3)] hover:bg-bg-card-hover hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] hover:-translate-y-0.5 cursor-pointer block"
              >
                <h3 className="text-lg font-semibold mb-2.5">{skill.title[l]}</h3>
                <p className="text-sm text-text-secondary leading-[1.7] mb-4">{skill.description[l]}</p>
                <div className="flex flex-wrap gap-2">
                  {skill.technologies.slice(0, 4).map((tech) => (
                    <span key={tech} className="px-3 py-1 rounded-full text-xs font-medium bg-[rgba(124,58,237,0.08)] text-primary-light border border-[rgba(124,58,237,0.15)]">
                      {tech}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/skills" className="text-primary-light font-medium text-sm hover:text-accent transition-colors">
              {t('skills.viewAll')} &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Projects Preview */}
      <section className="py-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[2px] text-primary-light mb-3">{t('projects.label')}</p>
          <h2 className="text-[clamp(28px,4vw,40px)] font-bold leading-[1.2] mb-2">{t('projects.title')}</h2>
          <p className="text-base text-text-secondary max-w-[600px] leading-[1.7] mb-12">{t('projects.desc')}</p>
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group rounded-xl bg-bg-card border border-border overflow-hidden transition-all hover:border-[rgba(124,58,237,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] hover:-translate-y-0.5 cursor-pointer block"
              >
                <div className="w-full h-[180px] bg-gradient-to-br from-surface to-bg-card flex items-center justify-center relative">
                  <div className="w-12 h-12 rounded-full bg-[rgba(124,58,237,0.1)] flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-[11px] font-semibold uppercase tracking-[1.5px] text-primary-light mb-2">{project.category[l]}</div>
                  <h3 className="text-xl font-semibold mb-2.5">{project.title[l]}</h3>
                  <p className="text-sm text-text-secondary leading-[1.7] mb-4">{project.description[l]}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.slice(0, 4).map((t) => (
                      <span key={t} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-surface text-text-muted border border-border">{t}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/projects" className="text-primary-light font-medium text-sm hover:text-accent transition-colors">
              {t('projects.viewAll')} &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[2px] text-primary-light mb-3">{t('blog.label')}</p>
          <h2 className="text-[clamp(28px,4vw,40px)] font-bold leading-[1.2] mb-2">{t('blog.title')}</h2>
          <p className="text-base text-text-secondary max-w-[600px] leading-[1.7] mb-12">{t('blog.desc')}</p>
          <div className="grid md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group p-6 rounded-xl bg-bg-card border border-border transition-all hover:border-[rgba(124,58,237,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] hover:-translate-y-0.5 cursor-pointer block"
              >
                <div className="text-[11px] text-text-muted mb-3">{post.date}</div>
                <h3 className="text-base font-semibold mb-2 leading-snug">{post.title[l]}</h3>
                <p className="text-sm text-text-secondary leading-[1.6] mb-4">{post.summary[l]}</p>
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-medium bg-[rgba(124,58,237,0.08)] text-primary-light">{tag}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/blog" className="text-primary-light font-medium text-sm hover:text-accent transition-colors">
              {t('blog.viewAll')} &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="py-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[2px] text-primary-light mb-3">{t('exp.label')}</p>
          <h2 className="text-[clamp(28px,4vw,40px)] font-bold leading-[1.2] mb-12">{t('exp.title')}</h2>
          <div className="relative pl-8 border-l-2 border-border space-y-10">
            {[
              { date: '2023 - Present', title: locale === 'en' ? 'Senior AI Engineer' : '高级 AI 工程师', org: locale === 'en' ? 'Drone Intelligence Division' : '无人机智能事业部', desc: locale === 'en' ? 'Leading the AI perception team, architecting real-time detection and tracking pipelines for next-generation UAV platforms. Deployed models across Jetson Orin fleet serving 50+ active drones.' : '领导 AI 感知团队，为下一代无人机平台设计实时检测和跟踪管线。在 Jetson Orin 机群上部署模型，服务 50+ 架活跃无人机。' },
              { date: '2021 - 2023', title: locale === 'en' ? 'AI Engineer' : 'AI 工程师', org: locale === 'en' ? 'Autonomous Systems Lab' : '自主系统实验室', desc: locale === 'en' ? 'Developed visual SLAM and depth estimation models for GPS-denied navigation. Built automated training pipelines reducing experiment turnaround by 60%.' : '开发用于 GPS 拒止导航的视觉 SLAM 和深度估计模型。构建自动化训练管线，将实验周转时间缩短 60%。' },
              { date: '2019 - 2021', title: locale === 'en' ? 'Machine Learning Engineer' : '机器学习工程师', org: locale === 'en' ? 'Computer Vision Startup' : '计算机视觉创业公司', desc: locale === 'en' ? 'Built object detection and semantic segmentation models for industrial inspection drones. Achieved SOTA results on custom aerial datasets.' : '为工业巡检无人机构建目标检测和语义分割模型。在自定义航拍数据集上达到 SOTA 水平。' },
            ].map((item) => (
              <div key={item.date} className="relative">
                <div className="absolute -left-[41px] top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-bg shadow-[0_0_0_3px_rgba(124,58,237,0.2)]" />
                <div className="text-xs font-semibold text-primary-light uppercase tracking-[1px] mb-1.5">{item.date}</div>
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <h4 className="text-sm font-medium text-text-muted mb-2.5">{item.org}</h4>
                <p className="text-sm text-text-secondary leading-[1.7]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-6 text-center bg-surface">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[2px] text-primary-light mb-3">{t('contact.label')}</p>
          <h2 className="text-[clamp(28px,4vw,40px)] font-bold leading-[1.2] mb-5">{t('contact.title')}</h2>
          <p className="text-base text-text-secondary max-w-[600px] mx-auto leading-[1.7] mb-10">{t('contact.desc')}</p>
          <div className="flex justify-center gap-4 flex-wrap">
            {[
              { href: 'https://github.com/Monitoryang', label: 'GitHub' },
              { href: 'mailto:contact@example.com', label: 'Email' },
              { href: '#', label: 'LinkedIn' },
            ].map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-lg bg-bg-card border border-border text-text text-sm font-medium transition-all hover:border-[rgba(124,58,237,0.3)] hover:bg-bg-card-hover hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] hover:-translate-y-0.5 cursor-pointer">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
