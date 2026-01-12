import {useActionBarStore} from "@/store";
import {
    AboutContent, CommunityContent, FeaturesContent, GettingStartedContent,
} from "./content";
import {AnimatedSection} from "@/components/animate/AnimatedSection";

function ActionContent() {
    const {openedSections} = useActionBarStore();

    if (openedSections.length === 0) {
        return null;
    }

    const contentMap = {
        about: <AboutContent/>,
        features: <FeaturesContent/>,
        "getting-started": <GettingStartedContent/>,
        community: <CommunityContent/>,
    } as const;

    type SectionKey = keyof typeof contentMap;

    return (<div className="mt-8 space-y-6">
            {openedSections
                .filter((section): section is SectionKey => Boolean(section))
                .map((section, index) => (<AnimatedSection
                        key={section}
                        isVisible={true}
                        animationOrigin="left"
                        delay={index * 0.1}
                    >
                        {contentMap[section]}
                    </AnimatedSection>))}
        </div>);
}

export default ActionContent;
