'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Code, Database, Server, Smartphone, Globe, Wrench } from 'lucide-react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface Skill {
    id: number;
    name: string;
    level: number;
    experience: number;
    maxExperience: number;
    category: 'frontend' | 'backend' | 'database' | 'devops' | 'mobile' | 'other';
}

interface SkillsChartProps {
    skills: Skill[];
}

export default function SkillsChart({ skills }: SkillsChartProps) {
    const skillsRef = useRef<HTMLDivElement>(null);

    const getCategoryIcon = (category: Skill['category']) => {
        switch (category) {
            case 'frontend':
                return <Globe className="w-4 h-4" />;
            case 'backend':
                return <Server className="w-4 h-4" />;
            case 'database':
                return <Database className="w-4 h-4" />;
            case 'devops':
                return <Wrench className="w-4 h-4" />;
            case 'mobile':
                return <Smartphone className="w-4 h-4" />;
            default:
                return <Code className="w-4 h-4" />;
        }
    };

    const getCategoryColor = (category: Skill['category']) => {
        switch (category) {
            case 'frontend':
                return 'text-blue-400';
            case 'backend':
                return 'text-green-400';
            case 'database':
                return 'text-purple-400';
            case 'devops':
                return 'text-orange-400';
            case 'mobile':
                return 'text-pink-400';
            default:
                return 'text-gray-400';
        }
    };

    const getCategoryLabel = (category: Skill['category']) => {
        switch (category) {
            case 'frontend':
                return 'Frontend';
            case 'backend':
                return 'Backend';
            case 'database':
                return 'База данных';
            case 'devops':
                return 'DevOps';
            case 'mobile':
                return 'Мобильная';
            default:
                return 'Другое';
        }
    };

    const getSkillColor = (level: number) => {
        if (level >= 8) return 'from-purple-500 to-pink-500';
        if (level >= 6) return 'from-blue-500 to-cyan-500';
        if (level >= 4) return 'from-green-500 to-emerald-500';
        if (level >= 2) return 'from-yellow-500 to-orange-500';
        return 'from-gray-500 to-gray-600';
    };

    const groupedSkills = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) {
            acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
    }, {} as Record<Skill['category'], Skill[]>);

    useGSAP(() => {
        if (!skillsRef.current) return;

        const skillBars = skillsRef.current.querySelectorAll('.skill-bar');
        const skillProgress = skillsRef.current.querySelectorAll('.skill-progress');
        
        gsap.set(skillBars, { opacity: 0, x: -20 });
        gsap.set(skillProgress, { width: '0%' });

        ScrollTrigger.create({
            trigger: skillsRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            onEnter: () => {
                gsap.to(skillBars, {
                    opacity: 1,
                    x: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.out',
                });

                skillProgress.forEach((progress, index) => {
                    const skill = skills[index];
                    const progressPercent = (skill.experience / skill.maxExperience) * 100;
                    
                    gsap.to(progress, {
                        width: `${progressPercent}%`,
                        duration: 1.5,
                        delay: index * 0.1 + 0.3,
                        ease: 'power2.out',
                    });
                });
            },
            onLeaveBack: () => {
                gsap.to(skillBars, {
                    opacity: 0,
                    x: -20,
                    duration: 0.3,
                    ease: 'power2.in',
                });
                gsap.set(skillProgress, { width: '0%' });
            }
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.trigger && skillsRef.current?.contains(trigger.trigger)) {
                    trigger.kill();
                }
            });
        };
    }, { dependencies: [skills.length] });

    return (
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <Code className="w-5 h-5 text-cyan-400" />
                <span>Навыки</span>
            </h3>

            <div ref={skillsRef} className="space-y-6">
                {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                    <div key={category} className="space-y-3">
                        <div className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                            <span className={getCategoryColor(category as Skill['category'])}>
                                {getCategoryIcon(category as Skill['category'])}
                            </span>
                            <span>{getCategoryLabel(category as Skill['category'])}</span>
                        </div>
                        
                        <div className="space-y-3 ml-6">
                            {categorySkills.map((skill, index) => {
                                const progressPercent = (skill.experience / skill.maxExperience) * 100;
                                const skillIndex = skills.findIndex(s => s.id === skill.id);
                                
                                return (
                                    <div key={skill.id} className="skill-bar space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <span className="font-medium text-white">{skill.name}</span>
                                                <span className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full">
                                                    Уровень {skill.level}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {skill.experience} / {skill.maxExperience} XP
                                            </span>
                                        </div>
                                        
                                        <div className="relative">
                                            <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                                                <div 
                                                    className={`skill-progress h-full bg-gradient-to-r ${getSkillColor(skill.level)} rounded-full transition-all duration-300`}
                                                    style={{ width: '0%' }}
                                                />
                                            </div>
                                            
                                            {/* Level markers */}
                                            <div className="absolute top-0 left-0 w-full h-2 flex justify-between">
                                                {Array.from({ length: 10 }, (_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-0.5 h-full ${
                                                            i < skill.level ? 'bg-white/30' : 'bg-gray-600/30'
                                                        }`}
                                                        style={{ marginLeft: i === 0 ? '0' : '-1px' }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>Новичок</span>
                                            <span>Эксперт</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Overall stats */}
            <div className="mt-6 pt-6 border-t border-gray-700/50">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-cyan-400">
                            {Math.round(skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length)}
                        </div>
                        <div className="text-xs text-gray-400">Средний уровень</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-green-400">
                            {skills.reduce((sum, skill) => sum + skill.experience, 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400">Общий опыт</div>
                    </div>
                </div>
            </div>
        </div>
    );
}