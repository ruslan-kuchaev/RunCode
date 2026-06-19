'use client';

import { useActionBarStore } from '@/store';
import {
    AboutContent,
    CommunityContent,
    FeaturesContent,
    GettingStartedContent,
} from './content';
import { AnimatedSection } from '@/components/animate/AnimatedSection';
import { useRef } from 'react';

const contentMap = {
    about: <AboutContent />,
    features: <FeaturesContent />,
    'getting-started': <GettingStartedContent />,
    community: <CommunityContent />,
} as const;

type SectionKey = keyof typeof contentMap;

function ActionContent() {
    const { openedSections, activeSection } = useActionBarStore();
    // track how many times each section was toggled to force re-mount
    const toggleCountRef = useRef<Record<string, number>>({});

    if (openedSections.length === 0) return null;

    return (
        <div className="mt-8 space-y-6">
            {openedSections
                .filter((section): section is SectionKey => Boolean(section))
                .map((section, index) => {
                    // bump counter when this section is the freshly activated one
                    if (activeSection === section) {
                        toggleCountRef.current[section] =
                            (toggleCountRef.current[section] ?? 0) + 1;
                    }
                    const key = `${section}-${toggleCountRef.current[section] ?? 0}`;

                    return (
                        <AnimatedSection
                            key={key}
                            isVisible={true}
                            delay={index * 0.05}
                        >
                            {contentMap[section]}
                        </AnimatedSection>
                    );
                })}
        </div>
    );
}

export default ActionContent;
