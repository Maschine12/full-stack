import React from "react";

interface FooterElementProps {
    href: string;
    text: string;
    activeView?: string;
    setView?: (view: string) => void;
}

const FooterElement: React.FC<FooterElementProps> = ({ href, text, activeView, setView }) => {
    const isActive = activeView === href;

    return (
        <a
            href={href}
            className={`text-gray-300 hover:text-white border-b-4 text-lg transition-colors duration-300 ${isActive ? 'border-white' : 'border-transparent'}`}
        >
            {text}
        </a>
    );
};

export default FooterElement;
