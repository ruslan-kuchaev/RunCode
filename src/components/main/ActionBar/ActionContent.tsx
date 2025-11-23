import { useActionBarStore } from "@/store";
import {
  AboutContent,
  CommunityContent,
  FeaturesContent,
  GettingStartedContent,
} from "./content";

function ActionContent() {
  const { openedSections } = useActionBarStore();

  if (openedSections.length === 0) {
    return null;
  }

  const contentMap = {
    about: <AboutContent />,
    features: <FeaturesContent />,
    "getting-started": <GettingStartedContent />,
    community: <CommunityContent />,
  };

  return (
    <div className="mt-8 space-y-6">
      {openedSections.map((section) => (
        <div key={section} className="animate-fade-in">
          {contentMap[section]}
        </div>
      ))}
    </div>
  );
}

export default ActionContent;
