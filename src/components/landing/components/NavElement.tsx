interface NavElementProps {
    href: string;
    text: string;
    activeView: string;
    setView: (view: string) => void;
}

const NavElement: React.FC<NavElementProps> = ({ href, text, activeView, setView }) => {
    const isActive = activeView === href;

    return (
        <button
            onClick={() => setView(href)}
            className={`text-gray-800 hover:text-gray-600 border-b-4 text-lg ${isActive ? 'border-gray-600' : 'border-transparent'}`}
        >
            {text}
        </button>
    );
};

export default NavElement;
