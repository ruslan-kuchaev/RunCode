import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useAnimationStore } from "@/store/AnimationCenter"
import { ColorVariant, getColorScheme } from "@/config/ActionBarConfig"
import {Arrayicon} from "@/store/Arrayicon"




interface InformationBarProps {
    icon: number,
    title: string,
    description: string,
    color: ColorVariant,
}


    export const InformationBar = ({icon, title, description, color}: InformationBarProps ) => {
    const complet = useAnimationStore((state) => state.isScrolled)
    const ThisColor = getColorScheme(color)
    
    useGSAP(() => {
        if (!complet) return;



    }, {dependencies: [complet]})




    return (<div className="p-6">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 ${ThisColor.bgColor}`}>
                <span className="text-purple-400 text-xl">{Arrayicon[icon]?.icon}</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
              <p className="text-gray-400">
                {description}
              </p>
            </div>
            )
}