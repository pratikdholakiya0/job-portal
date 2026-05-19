// src/component/ConversationItem.jsx

import React from 'react';
import { ArrowLeft } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom'; // Required for external back button

// ConversationItem component (unchanged)
export const ConversationItem = ({ convo, isActive, onClick, user }) => {
    const partnerName = convo.employerId === user ? convo.applicantName : convo.employerName;
    const partnerInitial = partnerName ? partnerName.charAt(0).toUpperCase() : 'U';

    return (
        <li 
            className={`flex items-center p-4 cursor-pointer border-b border-gray-100 transition duration-150 ease-in-out ${
                isActive ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-50'
            }`}
            onClick={() => onClick(convo)}
        >
            <div className="w-11 h-11 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600 mr-3 flex-shrink-0">
                {partnerInitial}
            </div>
            
            <div className="flex flex-col flex-grow overflow-hidden">
                <span className="font-medium text-gray-900 truncate">{partnerName}</span> 
                <span className="text-sm text-gray-500 truncate">{convo.lastMessage || 'Start conversation...'}</span>
            </div>
            
            <div className="flex flex-col items-end flex-shrink-0 ml-2">
                <span className="text-xs text-gray-400 mb-1">{convo.time || ''}</span>
                {convo.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {convo.unreadCount}
                    </span>
                )}
            </div>
        </li>
    );
};

// Sidebar component is updated to include the external back button
export const Sidebar = ({ conversations, activeConvoId, setActiveConversation, user }) => {
    const conversationList = conversations || []; 
    const navigate = useNavigate(); 
    
    const handleGoBack = () => {
        navigate(-1); // Navigate one step back in history
    };

    return (
        <aside className="w-full h-full flex flex-col bg-white flex-shrink-0"> 
            <header className="flex justify-between items-center p-4 border-b flex-shrink-0">
                
                {/* External Back Button + Title */}
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={handleGoBack}
                        className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100 transition"
                        aria-label="Go back to previous page"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h3 className="text-xl font-bold text-gray-800">Chats</h3>
                </div>
                
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition duration-150 shadow-sm">
                    + New
                </button>
            </header>
            
            <ul className="overflow-y-auto flex-1">
                {conversationList.map(convo => (
                    <ConversationItem 
                        key={convo.id}
                        convo={convo}
                        isActive={convo.id === activeConvoId}
                        onClick={setActiveConversation}
                        user={user} 
                    />
                ))}
            </ul>
        </aside>
    );
};