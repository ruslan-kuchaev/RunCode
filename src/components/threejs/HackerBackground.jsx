import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function HackerBackground() {
    const meshRef = useRef()
    
    // Создаем сферическую геометрию для фона
    const sphereGeometry = useMemo(() => {
        return new THREE.SphereGeometry(100, 32, 32)
    }, [])
    
    // Создаем шейдерный материал для хакерского фона
    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                void main() {
                    vUv = uv;
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec2 resolution;
                varying vec2 vUv;
                varying vec3 vPosition;
                
                // Функция для генерации псевдослучайных чисел
                float random(vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
                }
                
                // Функция для генерации символов (матричный шрифт)
                float char(vec2 st, float n) {
                    st = fract(st);
                    st *= 5.0; // Уменьшаем размер символов
                    st = floor(st);
                    
                    float x = st.x;
                    float y = st.y;
                    
                    // Матричные паттерны символов 5x5
                    if (n < 0.1) return 0.0; // Пробел
                    if (n < 0.2) { // 0
                        return (step(1.0, x) * step(1.0, y) * step(x, 4.0) * step(y, 4.0)) * 
                               (1.0 - step(2.0, x) * step(2.0, y) * step(x, 3.0) * step(y, 3.0));
                    }
                    if (n < 0.3) { // 1
                        return step(2.0, x) * step(0.0, y) * step(x, 3.0) * step(y, 5.0);
                    }
                    if (n < 0.4) { // A
                        return (step(2.0, x) * step(0.0, y) * step(x, 3.0) * step(y, 1.0)) +
                               (step(1.0, x) * step(1.0, y) * step(x, 2.0) * step(y, 2.0)) +
                               (step(3.0, x) * step(1.0, y) * step(x, 4.0) * step(y, 2.0)) +
                               (step(0.0, x) * step(2.0, y) * step(x, 5.0) * step(y, 5.0));
                    }
                    if (n < 0.5) { // B
                        return (step(0.0, x) * step(0.0, y) * step(x, 1.0) * step(y, 5.0)) +
                               (step(1.0, x) * step(0.0, y) * step(x, 4.0) * step(y, 1.0)) +
                               (step(1.0, x) * step(2.0, y) * step(x, 4.0) * step(y, 3.0)) +
                               (step(1.0, x) * step(4.0, y) * step(x, 4.0) * step(y, 5.0)) +
                               (step(4.0, x) * step(1.0, y) * step(x, 5.0) * step(y, 2.0)) +
                               (step(4.0, x) * step(3.0, y) * step(x, 5.0) * step(y, 4.0));
                    }
                    if (n < 0.6) { // C
                        return (step(1.0, x) * step(1.0, y) * step(x, 4.0) * step(y, 2.0)) +
                               (step(1.0, x) * step(3.0, y) * step(x, 4.0) * step(y, 4.0)) +
                               (step(0.0, x) * step(2.0, y) * step(x, 1.0) * step(y, 3.0));
                    }
                    if (n < 0.7) { // D
                        return (step(0.0, x) * step(0.0, y) * step(x, 1.0) * step(y, 5.0)) +
                               (step(1.0, x) * step(0.0, y) * step(x, 3.0) * step(y, 1.0)) +
                               (step(1.0, x) * step(4.0, y) * step(x, 3.0) * step(y, 5.0)) +
                               (step(3.0, x) * step(1.0, y) * step(x, 4.0) * step(y, 4.0));
                    }
                    if (n < 0.8) { // E
                        return (step(0.0, x) * step(0.0, y) * step(x, 1.0) * step(y, 5.0)) +
                               (step(1.0, x) * step(0.0, y) * step(x, 4.0) * step(y, 1.0)) +
                               (step(1.0, x) * step(2.0, y) * step(x, 3.0) * step(y, 3.0)) +
                               (step(1.0, x) * step(4.0, y) * step(x, 4.0) * step(y, 5.0));
                    }
                    if (n < 0.9) { // F
                        return (step(0.0, x) * step(0.0, y) * step(x, 1.0) * step(y, 5.0)) +
                               (step(1.0, x) * step(0.0, y) * step(x, 4.0) * step(y, 1.0)) +
                               (step(1.0, x) * step(2.0, y) * step(x, 3.0) * step(y, 3.0));
                    }
                    // G
                    return (step(1.0, x) * step(1.0, y) * step(x, 4.0) * step(y, 2.0)) +
                           (step(1.0, x) * step(3.0, y) * step(x, 4.0) * step(y, 4.0)) +
                           (step(0.0, x) * step(2.0, y) * step(x, 1.0) * step(y, 3.0)) +
                           (step(3.0, x) * step(2.0, y) * step(x, 4.0) * step(y, 3.0));
                }
                
                void main() {
                    vec2 st = vUv;
                    
                    // Создаем сетку символов (увеличиваем плотность)
                    vec2 grid = st * 80.0;
                    vec2 gridId = floor(grid);
                    vec2 gridSt = fract(grid);
                    
                    // Генерируем случайные символы для каждой ячейки
                    float n = random(gridId + floor(time * 0.1));
                    
                    // Создаем эффект падающих символов
                    float fallSpeed = random(gridId) * 0.5 + 0.1;
                    float fallOffset = fract(time * fallSpeed + gridId.y * 0.1);
                    
                    // Показываем символ только если он "упал" достаточно далеко
                    if (fallOffset > 0.3) {
                        float charPattern = char(gridSt, n);
                        vec3 color = vec3(0.0, 1.0, 0.0) * charPattern;
                        
                        // Добавляем свечение
                        float glow = 1.0 - length(gridSt - 0.5) * 2.0;
                        glow = smoothstep(0.0, 1.0, glow);
                        color += vec3(0.0, 0.3, 0.0) * glow * 0.5;
                        
                        gl_FragColor = vec4(color, 0.8);
                    } else {
                        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
                    }
                }
            `,
            side: THREE.BackSide, // Рендерим внутреннюю сторону сферы
            transparent: true
        })
    }, [])
    
    // Анимация времени для шейдера
    useFrame((state) => {
        if (shaderMaterial.uniforms.time) {
            shaderMaterial.uniforms.time.value = state.clock.getElapsedTime()
        }
    })
    
    return (
        <mesh ref={meshRef} geometry={sphereGeometry} material={shaderMaterial} />
    )
}
