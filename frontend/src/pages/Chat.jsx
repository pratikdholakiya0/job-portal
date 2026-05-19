import React, { useEffect, useState } from 'react';
import { Sidebar } from '../component/ConversationItem';
import ChatWindow from './ChatWindow'; 
import { useAuth } from '../store/AuthContext'; 

const ChatPage = () => {
    const [allConversation, setAllConversation] = useState([]);
    // Mock user data for testing if auth fails
    const { token, BASE_URL, user } = useAuth() || { token: 'mock-token', BASE_URL: 'http://localhost:3000/api', user: 'mock-user-id' };
    const [isLoading, setIsLoading] = useState(true);

    const [activeConversation, setActiveConversation] = useState({
        'id': '',
        'employerId': '',
        'employerName': '',
        'applicantId': '',
        'applicantName': '',
        'applicationId': ''
    });

    const loadAllConversation = async () =>{
        try{
            const resp = await fetch(`${BASE_URL}/conversation/my`, {
                method: "GET",
                headers: {
                    "Authorization" : `Bearer ${token}`
                }
            })

            const data = await resp.json();
            if(resp.ok){
                setAllConversation(data)
            }
        }catch(error){
            console.error("Error fetching conversations:", error);            
        }
        setIsLoading(false); 
    }

    useEffect(()=>{
        loadAllConversation();
    }, [token, BASE_URL]) 

    const handleSetActive = (convo) => {
        setActiveConversation(convo);
    };
    
    const handleClearActive = () => {
        setActiveConversation({
            'id': '',
            'employerId': '',
            'employerName': '',
            'applicantId': '',
            'applicantName': '',
            'applicationId': ''
        });
    };

    if(isLoading){
        return(
            <div className='flex justify-center items-center h-screen bg-gray-200'>
                <p className="text-xl text-gray-700">Chats are being fetched...</p>
            </div>
        )
    }

    const isConversationActive = !!activeConversation.id;

    return (
        // Main container: full screen height, removes padding on small screens (mobile view)
        <div className="flex h-screen bg-gray-200 p-0 sm:p-4">
            {/* Inner Container: Centered, single card look on desktop */}
            <div className="flex flex-1 max-w-7xl mx-auto rounded-none sm:rounded-xl overflow-hidden shadow-2xl bg-white">
                
                {/* 1. Sidebar Component Wrapper: Hides on mobile if a conversation is active */}
                <div className={`w-full sm:w-80 flex-shrink-0 border-r ${isConversationActive ? 'hidden sm:block' : 'block'}`}>
                    <Sidebar 
                        conversations={allConversation}
                        activeConvoId={activeConversation.id}
                        setActiveConversation={handleSetActive}
                        user={user}
                    />
                </div>
                
                {/* 2. ChatWindow Component Wrapper: Takes full width on mobile when active */}
                <div className={`flex-1 ${isConversationActive ? 'block' : 'hidden sm:block'}`}>
                    {isConversationActive ? (
                        <ChatWindow 
                            activeConversation={activeConversation}
                            onBack={handleClearActive} // Internal back button handler
                        />
                    ) : (
                        // Placeholder view: Ensure h-full for perfect centering
                        <div className="flex-1 flex items-center justify-center bg-gray-50 h-full"> 
                            <p className="text-gray-500 text-lg">
                                👋 Select a conversation to start chatting.
                            </p>
                        </div>
                    )}
                </div>
                
            </div>
        </div>
    );
};

export default ChatPage;