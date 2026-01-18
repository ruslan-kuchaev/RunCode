'use client';

import { useRef } from 'react';
import Editor from '@monaco-editor/react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Code, Maximize2, Settings } from 'lucide-react';

interface Language {
    id: number;
    name: string;
    icon: string;
    extension?: string; // Make extension optional
    monacoLanguage?: string; // Make monacoLanguage optional
}

interface CodeEditorProps {
    code: string;
    language: Language | null;
    onChange: (code: string) => void;
    theme?: string;
    readOnly?: boolean;
}

export default function CodeEditor({ 
    code, 
    language, 
    onChange, 
    theme = 'vs-dark',
    readOnly = false 
}: CodeEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (headerRef.current) {
            gsap.fromTo(headerRef.current,
                { opacity: 0, y: -10 },
                { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', delay: 0.2 }
            );
        }

        if (editorRef.current) {
            gsap.fromTo(editorRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.4 }
            );
        }
    }, []);

    const handleEditorDidMount = (editor: any, monaco: any) => {
        // Настройка темы
        monaco.editor.defineTheme('runcode-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
                { token: 'keyword', foreground: '569CD6' },
                { token: 'string', foreground: 'CE9178' },
                { token: 'number', foreground: 'B5CEA8' },
                { token: 'type', foreground: '4EC9B0' },
                { token: 'function', foreground: 'DCDCAA' },
            ],
            colors: {
                'editor.background': '#0f1419',
                'editor.foreground': '#e6e6e6',
                'editor.lineHighlightBackground': '#2d3748',
                'editor.selectionBackground': '#4a5568',
                'editorCursor.foreground': '#00ffff',
                'editorLineNumber.foreground': '#718096',
                'editorLineNumber.activeForeground': '#00ffff',
            }
        });

        monaco.editor.setTheme('runcode-dark');

        // Настройка автодополнения и других функций
        editor.updateOptions({
            fontSize: 14,
            fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
            lineHeight: 1.6,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            lineNumbers: 'on',
            glyphMargin: true,
            folding: true,
            renderLineHighlight: 'line',
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: readOnly,
            cursorStyle: 'line',
            mouseWheelZoom: true,
            contextmenu: true,
            quickSuggestions: {
                other: true,
                comments: false,
                strings: false
            },
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            tabCompletion: 'on',
            wordBasedSuggestions: 'matchingDocuments',
            parameterHints: {
                enabled: true
            }
        });

        // Горячие клавиши
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
            // Ctrl+S для сохранения (можно добавить логику сохранения)
            console.log('Save shortcut pressed');
        });

        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
            // Ctrl+Enter для запуска кода
            console.log('Run shortcut pressed');
        });
    };

    const getLanguageDisplayName = () => {
        if (!language) return 'Выберите язык';
        return `${language.icon} ${language.name}`;
    };

    return (
        <div className="h-full flex flex-col bg-gray-900">
            {/* Editor Header */}
            <div ref={headerRef} className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700/50">
                <div className="flex items-center space-x-3">
                    <Code className="w-5 h-5 text-cyan-400" />
                    <span className="text-white font-medium">Редактор кода</span>
                    <span className="text-gray-400 text-sm">({getLanguageDisplayName()})</span>
                </div>

                <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200">
                        <Settings className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200">
                        <Maximize2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Monaco Editor */}
            <div ref={editorRef} className="flex-1">
                <Editor
                    height="100%"
                    language={language?.monacoLanguage || 'javascript'}
                    value={code}
                    onChange={(value) => onChange(value || '')}
                    onMount={handleEditorDidMount}
                    theme={theme}
                    options={{
                        selectOnLineNumbers: true,
                        roundedSelection: false,
                        readOnly: readOnly,
                        cursorStyle: 'line',
                        automaticLayout: true,
                        glyphMargin: true,
                        useTabStops: false,
                        fontSize: 14,
                        fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
                        lineHeight: 1.6,
                        minimap: { enabled: true },
                        scrollBeyondLastLine: false,
                        tabSize: 2,
                        insertSpaces: true,
                        wordWrap: 'on',
                        lineNumbers: 'on',
                        folding: true,
                        renderLineHighlight: 'line',
                        mouseWheelZoom: true,
                        contextmenu: true,
                        quickSuggestions: {
                            other: true,
                            comments: false,
                            strings: false
                        },
                        suggestOnTriggerCharacters: true,
                        acceptSuggestionOnEnter: 'on',
                        tabCompletion: 'on',
                        wordBasedSuggestions: 'matchingDocuments',
                        parameterHints: {
                            enabled: true
                        }
                    }}
                    loading={
                        <div className="flex items-center justify-center h-full">
                            <div className="text-cyan-400">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                            </div>
                        </div>
                    }
                />
            </div>

            {/* Status bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800/30 border-t border-gray-700/50 text-sm text-gray-400">
                <div className="flex items-center space-x-4">
                    <span>Строк: {code.split('\n').length}</span>
                    <span>Символов: {code.length}</span>
                    <span>Язык: {language?.name || 'Не выбран'}</span>
                </div>
                
                <div className="flex items-center space-x-4">
                    <span>UTF-8</span>
                    <span>LF</span>
                    <span className="text-green-400">●</span>
                </div>
            </div>
        </div>
    );
}