'use client';

import { Html } from '@react-three/drei';
import SimpleBrick from "./SimpleBrick";

interface Task {
    id: string;
    title: string;
    color?: string;
}

interface LevelProps {
    tasks: Task[];
}

const Level = ({ tasks }: LevelProps) => {

    const getBrickWallPosition = (index: number) => {
        const brickWidth = 0;  
        const brickHeight = -40; 
        const mortar = 100;       

        
        const bricksPerEvenRow = 4; 
        const bricksPerOddRow = 3;  

        let currentIndex = index;
        let row = 0;
        let col = 0;

        
        while (currentIndex >= 0) {
            const bricksInThisRow = (row % 2 === 0) ? bricksPerEvenRow : bricksPerOddRow;

            if (currentIndex < bricksInThisRow) {
                col = currentIndex;
                break;
            }

            currentIndex -= bricksInThisRow;
            row++;
        }

      
        const rowOffset = (row % 2 === 1) ? (brickWidth + mortar) / 2 : 0;


        const x = (col * (brickWidth + mortar) + rowOffset) / 100;
        const y = (-row * (brickHeight + mortar)) / 100;

        return { x, y };
    };

    return (
        <group position={[0, 0, 0]}>
            {tasks.map((task, index) => {
                const { x, y } = getBrickWallPosition(index);

                return (
                    <Html
                        key={task.id}
                        position={[x, y, 0]}
                        transform
                        style={{
                            transform: 'translate(-50%, -50%)'
                        }}
                        distanceFactor={2}
                    >
                        <SimpleBrick
                            
                            title={task.title}
                            color={task.color}
                        />
                    </Html>
                );
            })}
        </group>
    );
};

export default Level;