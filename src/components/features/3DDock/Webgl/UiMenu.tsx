// components/features/3DDock/Webgl/UiMenu/index.tsx
"use client";

import { useEffect, useRef, useState } from 'react';

export function UiMenu() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedCell, setSelectedCell] = useState<[number, number]>([0, 0]);
    const [zoom, setZoom] = useState(1.0);

    // Добавляем состояние для камеры
    const cameraRef = useRef({
        x: 0,  // позиция камеры по X
        y: 0,  // позиция камеры по Y
        zoom: 1.0,  // масштаб (1 = нормальный вид)
        targetX: 0,  // целевая позиция для плавного движения
        targetY: 0,
        targetZoom: 0.5
    });

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

        if (!gl) {
            console.error('WebGL not supported');
            return;
        }

        // Настройка WebGL
        gl.clearColor(0, 0.1, 0.15, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // ОБНОВЛЕННЫЙ вершинный шейдер с поддержкой камеры
        const vertexShaderSource = `
            attribute vec2 aPosition;
            attribute vec3 aColor;
            uniform vec2 uCameraPosition;
            uniform float uZoom;
            varying vec3 vColor;
            
            void main() {
                // Применяем трансформации камеры:
                // 1. Смещаем по позиции камеры
                // 2. Масштабируем
                vec2 position = (aPosition - uCameraPosition) * uZoom;
                gl_Position = vec4(position, 0.0, 1.0);
                vColor = aColor;
            }
        `;

        const fragmentShaderSource = `
            precision mediump float;
            varying vec3 vColor;
            void main() {
                gl_FragColor = vec4(vColor, 1.0);
            }
        `;

        // Функция компиляции шейдеров
        function compileShader(source: string, type: number): WebGLShader | null {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader error:', gl.getShaderInfoLog(shader));
                return null;
            }
            return shader;
        }

        const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
        const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program error:', gl.getProgramInfoLog(program));
            return;
        }
        gl.useProgram(program);

        // Получаем расположение атрибутов и юниформов
        const aPosition = gl.getAttribLocation(program, 'aPosition');
        const aColor = gl.getAttribLocation(program, 'aColor');
        const uCameraPosition = gl.getUniformLocation(program, 'uCameraPosition');
        const uZoom = gl.getUniformLocation(program, 'uZoom');

        // Создаем сетку с выделенным прямоугольником
        function create2DGrid(cellsX: number, cellsY: number, selectedX: number, selectedY: number) {
            const vertices = [];
            const colors = [];

            const gridColor = [0.4, 0.4, 0.5];  // Цвет сетки
            const selectedColor = [1.0, 0.5, 0.2];  // Оранжевый для выделенного
            const centerColor = [0.8, 0.8, 1.0];  // Голубоватый для центральных осей

            // Создаем вертикальные линии
            for (let i = 0; i <= cellsX; i++) {
                const x = -1 + (2 * i) / cellsX;

                vertices.push(x, -1, x, 1);

                // Проверяем, является ли это центральной осью или выделенной линией
                let color = gridColor;
                if (i === Math.floor(cellsX / 2)) {
                    color = centerColor;
                } else if (i === selectedX || i === selectedX + 1) {
                    color = selectedColor;
                }

                colors.push(color[0], color[1], color[2]);
                colors.push(color[0], color[1], color[2]);
            }

            // Создаем горизонтальные линии
            for (let j = 0; j <= cellsY; j++) {
                const y = -1 + (2 * j) / cellsY;

                vertices.push(-1, y, 1, y);

                let color = gridColor;
                if (j === Math.floor(cellsY / 2)) {
                    color = centerColor;
                } else if (j === selectedY || j === selectedY + 1) {
                    color = selectedColor;
                }

                colors.push(color[0], color[1], color[2]);
                colors.push(color[0], color[1], color[2]);
            }

            // ДОБАВЛЯЕМ ВЫДЕЛЕННЫЙ ПРЯМОУГОЛЬНИК (4 линии)
            const cellWidth = 2 / cellsX;
            const cellHeight = 2 / cellsY;

            // Координаты выделенного прямоугольника
            const rectX1 = -1 + selectedX * cellWidth;
            const rectX2 = -1 + (selectedX + 1) * cellWidth;
            const rectY1 = -1 + selectedY * cellHeight;
            const rectY2 = -1 + (selectedY + 1) * cellHeight;

            // Линии прямоугольника (более толстые)
            for (let k = 0; k < 2; k++) { // Рисуем дважды для толщины
                // Левая сторона
                vertices.push(rectX1, rectY1, rectX1, rectY2);
                // Правая сторона
                vertices.push(rectX2, rectY1, rectX2, rectY2);
                // Верхняя сторона
                vertices.push(rectX1, rectY2, rectX2, rectY2);
                // Нижняя сторона
                vertices.push(rectX1, rectY1, rectX2, rectY1);

                colors.push(1.0, 0.8, 0.0, 1.0, 0.8, 0.0);  // Желтый
                colors.push(1.0, 0.8, 0.0, 1.0, 0.8, 0.0);
                colors.push(1.0, 0.8, 0.0, 1.0, 0.8, 0.0);
                colors.push(1.0, 0.8, 0.0, 1.0, 0.8, 0.0);
            }

            return {
                vertices: new Float32Array(vertices),
                colors: new Float32Array(colors),
                vertexCount: vertices.length / 2
            };
        }

        // Функция для вычисления центра прямоугольника
        function getCellCenter(cellsX: number, cellsY: number, cellX: number, cellY: number) {
            const cellWidth = 2 / cellsX;
            const cellHeight = 2 / cellsY;
            const centerX = -1 + cellX * cellWidth + cellWidth / 2;
            const centerY = -1 + cellY * cellHeight + cellHeight / 2;
            return { x: centerX, y: centerY };
        }

        // Инициализируем с выделенным центральным прямоугольником
        const cellsX = 9;
        const cellsY = 9;
        const initialSelectedX = Math.floor(cellsX / 2);
        const initialSelectedY = Math.floor(cellsY / 2);

        // Устанавливаем начальную позицию камеры на центр выделенного прямоугольника
        const initialCenter = getCellCenter(cellsX, cellsY, initialSelectedX, initialSelectedY);
        cameraRef.current = {
            x: initialCenter.x,
            y: initialCenter.y,
            zoom: 2.0,  // Начальный зум для приближения
            targetX: initialCenter.x,
            targetY: initialCenter.y,
            targetZoom: 2.0
        };

        let grid = create2DGrid(cellsX, cellsY, initialSelectedX, initialSelectedY);
        setSelectedCell([initialSelectedX, initialSelectedY]);

        // Создаем буферы
        const vertexBuffer = gl.createBuffer();
        const colorBuffer = gl.createBuffer();

        // Функция обновления буферов
        function updateGrid(selectedX: number, selectedY: number) {
            grid = create2DGrid(cellsX, cellsY, selectedX, selectedY);

            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, grid.vertices, gl.STATIC_DRAW);

            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, grid.colors, gl.STATIC_DRAW);
        }

        updateGrid(initialSelectedX, initialSelectedY);

        // Анимация плавного движения камеры
        function animateCamera() {
            const camera = cameraRef.current;
            const smoothing = 0.1;

            camera.x += (camera.targetX - camera.x) * smoothing;
            camera.y += (camera.targetY - camera.y) * smoothing;
            camera.zoom += (camera.targetZoom - camera.zoom) * smoothing;

            // Обновляем юниформы камеры
            gl.uniform2f(uCameraPosition, camera.x, camera.y);
            gl.uniform1f(uZoom, camera.zoom);

            render();
            requestAnimationFrame(animateCamera);
        }



        // Обработчики мыши
        function handleMouseMove(e: MouseEvent) {
            if (!canvasRef.current) return;
            if (e.button === 2) {
                console.log('Правая кнопка мыши нажата!');
                // Здесь можно добавить логику для начала "удержания"
                // Например, начать таймер или флаг
            }
            console.log(e.clientX, e.clientY);
            const rect = canvasRef.current.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;

            // Преобразуем координаты мыши в координаты сетки
            const worldX = x / cameraRef.current.zoom + cameraRef.current.x;
            const worldY = -y / cameraRef.current.zoom + cameraRef.current.y;  // Инвертируем Y

            // Находим ячейку под курсором
            const cellX = Math.floor((worldX + 1) * cellsX / 2);
            const cellY = Math.floor((worldY + 1) * cellsY / 2);

            // Ограничиваем диапазон
            if (cellX >= 0 && cellX < cellsX && cellY >= 0 && cellY < cellsY) {
                // Можно добавить подсветку при наведении
            }
        }



        function handleWheel(e: WheelEvent) {
            e.preventDefault();

            if (e.deltaY < 0) {
                cameraRef.current.targetZoom = Math.min(cameraRef.current.targetZoom * 1.2, 5.0);
            } else {
                cameraRef.current.targetZoom = Math.max(cameraRef.current.targetZoom / 1.2, 0.5);
            }
        }

        function render() {
            gl.clear(gl.COLOR_BUFFER_BIT);

            // Настраиваем атрибуты
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aPosition);

            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aColor);

            gl.drawArrays(gl.LINES, 0, grid.vertexCount);
        }

        function handleResize() {
            if (!canvasRef.current) return;

            const dpr = window.devicePixelRatio || 1;
            const rect = canvasRef.current.getBoundingClientRect();

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            gl.viewport(0, 0, canvas.width, canvas.height);
        }

        // Инициализация
        handleResize();

        // Устанавливаем начальные значения камеры
        gl.uniform2f(uCameraPosition, cameraRef.current.x, cameraRef.current.y);
        gl.uniform1f(uZoom, cameraRef.current.zoom);

        // Запускаем анимацию камеры
        const animationId = requestAnimationFrame(animateCamera);


        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('wheel', handleWheel);
        window.addEventListener('resize', handleResize);



        // Очистка
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('wheel', handleWheel);

            gl.deleteProgram(program);
            gl.deleteBuffer(vertexBuffer);
            gl.deleteBuffer(colorBuffer);
        };

    }, []);

    return (
        <div className="w-full h-full relative">
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full cursor-pointer"
            />
            <div className="absolute top-4 left-4 text-white bg-black/50 p-3 rounded text-sm">
                <div className="font-bold mb-1">2D Grid Navigation</div>
                <div className="text-xs opacity-80">
                    <div>• Click: Select and zoom to cell</div>
                    <div>• Ctrl+Click: Zoom out to full view</div>
                    <div>• Mouse wheel: Zoom in/out</div>
                    <div>• Arrow keys: Navigate between cells</div>
                    <div>• Space: Return to overview</div>
                </div>
                <div className="mt-2 text-xs">
                    Selected: Cell [{selectedCell[0]}, {selectedCell[1]}]
                </div>
            </div>
        </div>
    );
}