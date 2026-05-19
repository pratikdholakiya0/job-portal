import { useNavigate } from "react-router";

import React from 'react';
import Header from "../component/Header";

const DeveloperPage = () => {
    // Helper component for social icons
    const SocialIcon = ({ href, src, alt, width }) => (
        <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block hover:scale-105 transition duration-300 transform"
        >
            <img 
                src={src} 
                alt={alt} 
                style={{ width: `${width}px` }} 
                className="rounded-full border border-gray-200"
            />
        </a>
    );

    // Helper component for tools/language icons
    const ToolIcon = ({ src, alt }) => (
        <div className="flex flex-col items-center p-3 bg-white rounded-xl shadow-md transition duration-300 hover:shadow-lg hover:scale-[1.03]">
            <img src={src} alt={alt} className="w-10 h-10 object-contain" />
            <span className="text-xs text-gray-600 mt-2 font-medium">{alt}</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-indigo-50 py-16 px-4 mt-12 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-xl mx-auto">
                <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-3xl overflow-hidden border-t-8 border-indigo-600">
                    <div className="text-center mb-10">
                        <img 
                            src="https://avatars.githubusercontent.com/u/158017664?v=4" 
                            alt="Pratik Dholakiya Profile Avatar"
                            className="w-36 h-36 rounded-full mx-auto mb-6 border-4 border-indigo-600 shadow-2xl object-cover"
                        />
                        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Hi 👋, I'm Pratik Dholakiya</h1>
                        <h3 className="text-lg font-medium text-indigo-600 mb-6">A passionate developer</h3>

                        <div className="flex flex-col items-center space-y-2 text-gray-700">
                            <p className="flex items-center text-md">
                                <span className="text-md mr-3 text-green-500">🌱</span>
                                Deep diving into Java and modern web architectures.
                            </p>
                            <p className="flex items-center text-md">
                                <span className="text-md mr-3 text-red-500">📧</span>
                                **dholakiya225@gmail.com**
                            </p>
                        </div>
                    </div>

                    {/* --- Connect with Me Section --- */}
                    <div className="pt-8 border-t border-gray-200 mb-10">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Connect with me</h2>
                        <div className="flex justify-center space-x-6">
                            <SocialIcon 
                                href="https://www.linkedin.com/in/pratik-dholakiya" 
                                src="https://pngimg.com/uploads/linkedIn/linkedIn_PNG8.png" 
                                alt="LinkedIn" 
                                width={45} 
                            />
                            <SocialIcon 
                                href="https://x.com/Pratiikxd" 
                                src="https://static.vecteezy.com/system/resources/previews/034/800/663/original/x-new-twitter-logo-free-png.png" 
                                alt="X" 
                                width={50} 
                            />
                            <SocialIcon 
                                href="https://www.instagram.com/saiyaaangoku" 
                                src="https://logopng.com.br/logos/instagram-40.png" 
                                alt="Instagram" 
                                width={45} 
                            />
                            <SocialIcon 
                                href="https://leetcode.com/u/gokuXdsa" 
                                src="https://cdn.iconscout.com/icon/free/png-512/leetcode-3628885-3030025.png" 
                                alt="LeetCode" 
                                width={45} 
                            />
                        </div>
                    </div>

                    {/* --- Languages and Tools Section --- */}
                    <div className="pt-8 border-t border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Languages and Tools</h2>
                        <div className="flex flex-wrap justify-center items-center gap-4">
                            <ToolIcon src="https://logodownload.org/wp-content/uploads/2016/10/html5-logo-8.png" alt="HTML5" />
                            <ToolIcon src="https://logospng.org/download/css-3/logo-css-3-2048.png" alt="CSS3" />
                            <ToolIcon src="https://th.bing.com/th/id/OIP.0qThwGUlnULLAz8MTnN9QwHaHa?rs=1&pid=ImgDetMain" alt="JavaScript" />
                            <ToolIcon src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React" />
                            <ToolIcon src="https://cdn.freebiesupply.com/logos/large/2x/java-logo-png-transparent.png" alt="Java" />
                            <ToolIcon src="https://miro.medium.com/max/500/1*AbiX4LwtSNozoyfypcKvEg.png" alt="Spring Boot" />
                            <ToolIcon src="https://pngimg.com/uploads/mysql/mysql_PNG23.png" alt="MySQL" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeveloperPage;
