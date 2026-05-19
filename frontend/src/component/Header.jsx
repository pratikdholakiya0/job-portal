import { useState } from "react";
import { useAuth } from "../store/AuthContext";
import { useNavigate } from "react-router";

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, logout, role } = useAuth();

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Helper function to close both menus when navigating
    const handleNavigation = (path) => {
        navigate(path);
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
    };

    const ProfileDropdown = () => (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-50">
            <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu"
            >
                <button
                    onClick={() => handleNavigation('/user-profile')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    role="menuitem"
                >
                    Profile
                </button>

                <button
                    onClick={() => handleNavigation('/settings')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    role="menuitem"
                >
                    Settings
                </button>

                <button
                    onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-red-600"
                    role="menuitem"
                >
                    Log Out
                </button>
            </div>
        </div>
    );

    // Hamburger Icon Component
    const HamburgerIcon = ({ isOpen, onClick }) => (
        <button
            className="sm:hidden p-2 text-gray-600 hover:text-indigo-600 transition duration-150 focus:outline-none"
            onClick={onClick}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
            </svg>
        </button>
    );

    // Mobile Menu Links Structure
    const MobileNavLinks = ({ handleNavigation }) => (
        <div className="pt-2 pb-3 space-y-1">
            <button
                onClick={() => handleNavigation('/about-developer')}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
            >
                About Developer
            </button>
            
            {(role === "APPLICANT" && isAuthenticated) && (
                <button
                    onClick={() => handleNavigation('/')}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                >
                    Apply for Internship
                </button>
            )}

            {(role === "EMPLOYER" && isAuthenticated) && (
                <button
                    onClick={() => handleNavigation('/employer/dashboard')}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                >
                    Employer Dashboard
                </button>
            )}

            {isAuthenticated && (
                <button
                    onClick={() => handleNavigation('/chat')}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                >
                    Message
                </button>
            )}
            
            {!isAuthenticated && (
                <button
                    onClick={() => handleNavigation('/login')}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-indigo-600 border border-indigo-600 rounded-lg mt-2 hover:bg-indigo-50 transition duration-150"
                >
                    Sign In
                </button>
            )}

            {/* Logout button moved here for better mobile UX */}
            {isAuthenticated && (
                <div className="border-t border-gray-200 mt-2 pt-2">
                    <button
                        onClick={() => {
                            logout();
                            setIsMobileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-red-600"
                    >
                        Log Out
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-lg">
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                
                {/* *** ADJUSTMENT START *** Wrap the Hamburger Icon and Logo in a div and use flex 
                    to keep them aligned on the far left on small screens.
                */}
                <div className="flex items-center space-x-2"> 
                    {/* Hamburger Icon (Visible only on mobile) */}
                    <div className="sm:hidden">
                        <HamburgerIcon
                            isOpen={isMobileMenuOpen}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        />
                    </div>

                    {/* Logo */}
                    <button
                        onClick={() => handleNavigation('/')}
                        className="text-2xl font-bold text-indigo-600 tracking-wider hover:text-indigo-700 transition duration-150"
                    >
                        JobStream
                    </button>
                </div>
                {/* *** ADJUSTMENT END *** */}


                {/* Desktop Navigation & Profile (Hidden on mobile) */}
                <nav className="space-x-4 text-gray-600 font-medium hidden sm:flex items-center">
                    <button
                        onClick={() => handleNavigation('/about-developer')}
                        className="hover:text-indigo-600 transition duration-150"
                    >
                        About Developer
                    </button>
                    {
                        (role === "APPLICANT" && isAuthenticated) && (
                            <button
                                onClick={() => handleNavigation('/jobs')}
                                className="hover:text-indigo-600 transition duration-150"
                            >
                                Apply for Internship
                            </button>
                        )
                    }
                    {
                        (role === "EMPLOYER" && isAuthenticated) && (
                            <button
                                onClick={() => handleNavigation('/employer/dashboard')}
                                className="hover:text-indigo-600 transition duration-150"
                            >
                                Employer Dashboard
                            </button>
                        )
                    }

                    {
                        isAuthenticated && (
                            <button
                                onClick={() => handleNavigation('/chat')}
                                className="hover:text-indigo-600 transition duration-150"
                            >
                                Message
                            </button>
                        )
                    }

                    {isAuthenticated ? (
                        <div className='relative ml-4'>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className='w-10 aspect-square rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold'
                                aria-expanded={isDropdownOpen}
                                aria-controls="profile-dropdown"
                            >
                                {/** User initial or avatar **/}
                            </button>
                            {isDropdownOpen && <ProfileDropdown />}
                        </div>
                    ) : (
                        <button
                            onClick={() => handleNavigation('/login')}
                            className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition duration-150"
                        >
                            Sign In
                        </button>
                    )}
                </nav>

                {/* Profile/Sign-In on Mobile (Moved to the far right on mobile) */}
                <div className="sm:hidden flex items-center">
                    {isAuthenticated ? (
                        <div className='relative'>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className='w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold'
                            >
                            </button>
                            {isDropdownOpen && <ProfileDropdown />}
                        </div>
                    ) : (
                        <button 
                            onClick={() => handleNavigation('/login')} 
                            className="px-3 py-1 text-sm border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition duration-150"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </div>
            
            {/* Mobile Menu Content (Conditionally rendered across the full width) */}
            <div 
                className={`sm:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-96 opacity-100 py-3' : 'max-h-0 opacity-0'}`}
                id="mobile-menu"
            >
                <MobileNavLinks 
                    handleNavigation={handleNavigation}
                />
            </div>
        </header>
    );
};

export default Header;