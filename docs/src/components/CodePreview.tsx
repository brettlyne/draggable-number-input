interface CodePreviewProps {
    react: string;
    svelte: string;
    mode: {
        codeMode: 'react' | 'svelte';
        setCodeMode: (mode: 'react' | 'svelte') => void;
    };
}

const CodePreview: React.FC<CodePreviewProps> = ({ react, svelte, mode }) => {
    return (
        <div className="code-preview">
            <div className="code-preview_controls">
                <button
                    className={mode.codeMode === 'react' ? 'active' : ''}
                    onClick={() => mode.setCodeMode("react")}
                >
                    React
                </button>
                <button
                    className={mode.codeMode === 'svelte' ? 'active' : ''}
                    onClick={() => mode.setCodeMode("svelte")}
                >
                    Svelte
                </button>
            </div>

            <div>
                <pre>
                    <code>
                        {mode.codeMode === 'react' ? react.trim() : svelte.trim()}
                    </code>
                </pre>
            </div>
        </div>
    );
};

export default CodePreview;
