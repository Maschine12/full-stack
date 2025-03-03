import NavElement from "./components/NavElement";
import { Button } from "../ui/Button";
import Image from "next/image";

interface NavbarProps {
    view: string;
    setView: (view: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ view, setView }) => {
    return (
        <nav>
            <div className="container mx-auto px-8 py-4 flex justify-between items-center">
                <div className="flex items-center justify-center">
                    <button className="font-semibold text-gray-800 flex items-center justify-center" onClick={() => setView("home")}>
                        <Image src="/images/Tecnico1.png" alt="Rydehr Fintech" width={80} height={20} />
                        <span className="text-2xl">Ryderh Fintech</span>
                    </button>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                    <NavElement href="home" text="Inicio" activeView={view} setView={setView} />
                    <NavElement href="about" text="Acerca de" activeView={view} setView={setView} />
                    <NavElement href="contacto" text="Contacto" activeView={view} setView={setView} />
                </div>
                <div className="hidden md:flex items-center space-x-2">
                    <Button label="Registrarme" href="/register" />
                    <Button label="Ingresar" href="/login" />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
