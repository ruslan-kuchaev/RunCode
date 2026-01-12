interface BgPointProps {
    bgRGABFont: string;
    bgHEXPoint: string;
}

export const BgPoint: React.FC<BgPointProps> = ({bgRGABFont, bgHEXPoint}) => {
    return (
        <>
            <div 
                style={{backgroundColor: `rgba(${bgRGABFont}, 0.4)`}}
                className="p-1 rounded-full mt-0.5 transition-all duration-300 hover:scale-125 cursor-pointer group"
                onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 12px ${bgHEXPoint}80`;
                    e.currentTarget.style.backgroundColor = `rgba(${bgRGABFont}, 0.6)`;
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.backgroundColor = `rgba(${bgRGABFont}, 0.4)`;
                }}
            >
                <div 
                    style={{backgroundColor: bgHEXPoint}}
                    className="w-2 h-2 rounded-full transition-all duration-300 group-hover:scale-110"
                ></div>
            </div>
        </>
    );
};