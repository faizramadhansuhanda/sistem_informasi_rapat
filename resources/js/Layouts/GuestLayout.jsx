import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    const logoUrl = import.meta.env.VITE_APP_LOGO_URL;
    return (
       <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-yellow-100 via-lime-100 to-lime-200 px-4 py-8">
            <div className="w-full max-w-lg rounded-3xl bg-white px-8 py-8 shadow-xl">
                <div className="flex flex-col items-center text-center">
                    <Link href="/" className="inline-flex items-center justify-center">
                        {logoUrl ? (
                            <img
                                src={logoUrl}
                                alt="Logo"
                                className="h-15 w-60 rounded-full object-contain"
                            />
                        ) : (
                            <ApplicationLogo className="h-16 w-16 fill-current text-gray-500" />
                        )}
                    </Link>
                    <p className="mt-4 text-sm font-semibold text-gray-600">
                        Welcome to PLN NUSANTARA POWER Managing System, Admin
                    </p>
                </div>
                 <div className="mt-6">{children}</div>
            </div>
        </div>
    );
}
