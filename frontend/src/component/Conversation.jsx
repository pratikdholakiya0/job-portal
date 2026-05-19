import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../store/AuthContext';
import { Loader2, MessageSquareText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const ConversationList = () => {
    const { token, user, BASE_URL} = useAuth();
    const [conversations, setConversations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { id: currentConversationId } = useParams();

    const getAuthHeaders = useCallback(() => {
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }, [token]);

    const fetchConversations = useCallback(async () => {
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const url = `${BASE_URL}/conversation/my`;
            const response = await axios.get(url, {
                headers: getAuthHeaders()
            });

            // Assuming response.data is List<Conversation>
            setConversations(response.data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
            setConversations([]);
        } finally {
            setIsLoading(false);
        }
    }, [token, getAuthHeaders]);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    const handleSelectConversation = (conversationId) => {
        // Navigate to the chat route for the selected conversation
        navigate(`/chat/${conversationId}`);
    };
    
    // Helper function to determine the display name (e.g., the other user)
    // NOTE: You'll likely need to fetch/store participant names for a better display
    const getConversationDisplayName = (conversation) => {
        // A simple placeholder logic: display the first 10 characters of the ID
        return `Chat ${conversation.id.substring(0, 10)}...`;
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-4">
                <Loader2 className="animate-spin w-6 h-6 text-indigo-500" />
            </div>
        );
    }
    
    if (conversations.length === 0) {
        return (
            <p className="p-4 text-center text-gray-500">No conversations found.</p>
        );
    }

    return (
        <div className="space-y-1 p-2">
            {conversations.map((conv) => (
                <div
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition duration-150 ease-in-out ${
                        conv.id === currentConversationId
                            ? 'bg-indigo-100 text-indigo-800 font-semibold shadow-inner'
                            : 'hover:bg-gray-100 text-gray-700'
                    }`}
                >
                    <MessageSquareText className="w-5 h-5 flex-shrink-0" />
                    <span className="flex-1 truncate text-sm">
                        {getConversationDisplayName(conv)}
                    </span>
                    {/* Optionally show last message snippet or unread count */}
                </div>
            ))}
        </div>
    );
};

export default ConversationList;