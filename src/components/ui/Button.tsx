import React from "react";
import Link from "next/link";

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    href?: string; // Prop para redirección
}

export function Button({ label, href, ...props }: CustomButtonProps) {
    if (href) {
        return (
            <Link href={href} passHref>
                <button
                    className={`text-lg px-6 py-3 hover:bg-[#8442db] bg-[#1a35b0] text-white tracking-wide text-[12px] rounded-full cursor-pointer ${props.className} transition duration-300`}
                    {...props}
                >
                    {label}
                </button>
            </Link>
        );
    }

    return (
        <button
            className={`text-lg px-6 py-3 hover:bg-[#8442db] bg-[#1a35b0] text-white tracking-wide text-[12px] rounded-full cursor-pointer ${props.className} transition duration-300`}
            {...props}
        >
            {label}
        </button>
    );
}
