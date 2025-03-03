import FooterElement from "./components/FooterElement";

const links = [
    { href: "/about", text: "Nosotros" },
    { href: "/services", text: "Servicios" },
    { href: "/contact", text: "Contacto" },
];

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 items-center">
                    {/* Información */}
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Ryderh Fintech</h3>
                        <p>Brindando servicios financieros confiables desde 2019.</p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Enlaces</h3>
                        <ul className="space-y-1">
                            {links.map((link) => (
                                <li key={link.href}>
                                    <FooterElement href={link.href} text={link.text} />
                                    <FooterElement href={link.href} text={link.text} />
                                    <FooterElement href={link.href} text={link.text} />
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Contáctanos</h3>
                        <p>RYDEHR FINTECH S.A.C.</p>
                        <p>Dirección: Jr. Ricardo Palma Nro. 113</p>
                        <p>Provincia: Andahuaylas</p>
                        <p>Región: Apurímac</p>
                        <p>País: Perú</p>
                        <p>Teléfono: 999 888 777</p>
                        <p>Email: ryderh-a@gmail.com</p>
                        <div className="flex space-x-4 mt-4">
                            <a
                                href="https://www.facebook.com/p/Rydehr-Fintech-100054365508369"
                                className="hover:text-gray-400 transition-colors"
                                title="Facebook"
                                aria-label="Facebook"
                            >
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        fillRule="evenodd"
                                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copy */}
                <div className="mt-8 border-t border-gray-700 pt-3 text-center">
                    <p>&copy; {new Date().getFullYear()} Ryderh Fintech. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
