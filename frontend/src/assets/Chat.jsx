import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Client } from '@stomp/stompjs'; 
import SockJS from 'sockjs-client'; 
import axios from 'axios'; 
import { Loader2, Send, MessageSquare } from 'lucide-react'; 
import { useParams } from 'react-router-dom'; 
import { useAuth } from '../store/AuthContext';

const BASE_URL = 'http://localhost:8080';
const WEBSOCKET_ENDPOINT = '/chat';
const MESSAGES_PER_PAGE = 20; 

const Chat = () => {
    const { token, user } = useAuth(); 
    
    const currentUsername = user;

    const [stompClient, setStompClient] = useState(null); 
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    
    const [isConnected, setIsConnected] = useState(false);
    const [isWsConnecting, setIsWsConnecting] = useState(true); 
    
    const [currentPage, setCurrentPage] = useState(0); 
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const clientRef = useRef(null);
    const messageAreaRef = useRef(null);
    const isInitialLoadRef = useRef(true);
    
    const scrollToBottom = useCallback(() => {
        if (messageAreaRef.current) {
            requestAnimationFrame(() => {
                messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
            });
        }
    }, []);

    const getAuthHeaders = useCallback(() => {
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }, [token]);

    // Memoize and sort messages by timestamp
    const sortedMessages = useMemo(() => {
        // Sort by timestamp in ascending order (oldest first).
        return [...messages].sort((a, b) => {
            const timeA = new Date(a.timestamp || 0).getTime();
            const timeB = new Date(b.timestamp || 0).getTime();
            return timeA - timeB; 
        });
    }, [messages]);

    const fetchMessages = useCallback(async (pageToLoad) => {
        if (isLoading || (!hasMoreMessages && pageToLoad > 0) || !token || !conversationId) return;

        setIsLoading(true);
        const url = `${BASE_URL}/api/v1/conversation/${conversationId}/getMessages`;
        
        try {
            const response = await axios.get(url, {
                params: { 
                    page: pageToLoad, 
                    size: MESSAGES_PER_PAGE 
                },
                headers: getAuthHeaders()
            });

            const newMessages = response.data; 
            
            if (newMessages.length < MESSAGES_PER_PAGE) {
                setHasMoreMessages(false);
            }
            
            setMessages(prevMessages => 
                pageToLoad > 0 ? [...newMessages, ...prevMessages] : newMessages
            );

        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setIsLoading(false);
            setCurrentPage(pageToLoad);
        }
    }, [isLoading, hasMoreMessages, getAuthHeaders, token, conversationId]);

    useEffect(() => {
        setMessages([]);
        setCurrentPage(0);
        setHasMoreMessages(true);
        isInitialLoadRef.current = true;
        
        if (token && conversationId) {
            fetchMessages(0); 
        }
    }, [token, conversationId]);

    
    useEffect(() => {
        if (!token || !conversationId) {
            setIsConnected(false);
            setIsWsConnecting(false);
            if (clientRef.current && clientRef.current.connected) clientRef.current.deactivate();
            return;
        }

        setIsWsConnecting(true);

        const connect = () => {
            const socketFactory = () => new SockJS(BASE_URL + WEBSOCKET_ENDPOINT);

            const client = new Client({
                webSocketFactory: socketFactory,
                reconnectDelay: 5000, 
                forceBinary: false, 
                
                connectHeaders: getAuthHeaders(),
                
                onConnect: (frame) => {
                    console.log('Connected to STOMP: ' + frame);
                    setIsConnected(true);
                    setIsWsConnecting(false);

                    client.subscribe(
                        `/topic/conversation/${conversationId}`, 
                        (message) => {
                            const receivedMessage = JSON.parse(message.body);
                            setMessages(prevMessages => [...prevMessages, receivedMessage]);
                            setTimeout(scrollToBottom, 50); 
                        },
                        {} 
                    );
                },

                onStompError: (frame) => {
                    console.error('Broker reported error: ' + frame.headers['message']);
                    setIsWsConnecting(false);
                    setIsConnected(false);
                },

                onDisconnect: () => {
                    console.log('Disconnected from STOMP');
                    setIsConnected(false);
                    setIsWsConnecting(false);
                }
            });

            client.activate();
            clientRef.current = client;
        };

        if (clientRef.current) {
            clientRef.current.deactivate();
        }

        connect();

        return () => {
            if (clientRef.current && clientRef.current.connected) {
                clientRef.current.deactivate();
            }
        };
    }, [token, getAuthHeaders, scrollToBottom, conversationId]); 
    
    useEffect(() => {
        setStompClient(clientRef.current);
    }, [clientRef.current]); 


    useEffect(() => {
        if (messages.length > 0 && isInitialLoadRef.current && !isLoading) {
            scrollToBottom();
            isInitialLoadRef.current = false;
        }
    }, [messages, isLoading, scrollToBottom]);


    const handleScroll = () => {
        if (messageAreaRef.current.scrollTop === 0 && !isLoading && hasMoreMessages) {
            fetchMessages(currentPage + 1);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (stompClient && isConnected && messageInput.trim() !== '' && token && conversationId) {
            const destination = `/app/send-message/${conversationId}`; 

            const messagePayload = {
                senderId : user,
                content: messageInput.trim(), 
            };

            stompClient.publish({
                destination: destination,
                body: JSON.stringify(messagePayload),
                headers: {
                    'content-type': 'application/json',
                    ...getAuthHeaders() 
                } 
            });

            setMessageInput('');
        }
    };
    
    const renderMessage = (msg, index) => {
        // ⭐ This determines which side the message is on
        const isCurrentUser = msg.senderId === user; 
        
        return (
            <div 
                key={index} 
                // ⭐ justify-end for sender (right), justify-start for receiver (left)
                className={`flex w-full mt-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
                <div 
                    className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl shadow-md text-sm ${
                        isCurrentUser 
                            ? 'bg-indigo-600 text-white rounded-br-none' 
                            : 'bg-gray-200 text-gray-800 rounded-tl-none'
                    }`}
                >
                    {!isCurrentUser && (
                        <span className="text-xs font-semibold block mb-0.5 text-indigo-500">
                            {msg.senderId ? 'User' : 'User'}
                        </span>
                    )}
                    {msg.content}
                </div>
            </div>
        );
    };

    if (!conversationId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-xl text-red-500">Error: Conversation ID is missing.</p>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gray-100 py-12 px-3 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto h-[70vh] flex flex-col">
                
                <div className="flex-1 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border-t-8 border-indigo-600">
                    
                    <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center bg-white">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center space-x-2">
                            <MessageSquare className="w-6 h-6 text-indigo-600" />
                            <span>Conversation: {conversationId.substring(0, 10)}...</span>
                        </h1>
                        <span className={`text-sm font-medium px-3 py-1 rounded-full ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {isWsConnecting ? 'Connecting...' : (isConnected ? 'Online' : 'Offline')}
                        </span>
                    </div>

                    <div 
                        ref={messageAreaRef}
                        onScroll={handleScroll} 
                        className="flex-1 overflow-y-auto p-4 flex flex-col-reverse space-y-reverse space-y-2 bg-gray-50"
                    >
                        {isLoading && (
                            <div className="flex justify-center py-2">
                                <Loader2 className="animate-spin w-5 h-5 text-indigo-500" />
                            </div>
                        )}
                        
                        {!hasMoreMessages && sortedMessages.length > 0 && (
                            <p className="text-center text-xs text-gray-500 pt-4 pb-2">--- Start of Conversation ---</p>
                        )}

                        {sortedMessages.length === 0 && !isLoading && !isWsConnecting && (
                            <p className="text-center text-gray-500 pt-20">Start a new conversation!</p>
                        )}
                        
                        {/* Iterate over sortedMessages and reverse for bottom-up display */}
                        {sortedMessages.slice().reverse().map(renderMessage)}
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                        <div className="flex items-center space-x-3">
                            <input
                                type="text"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                placeholder={isConnected ? "Type your message..." : "Connecting..."}
                                disabled={!isConnected || isWsConnecting || !token}
                                className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                            <button 
                                type="submit"
                                disabled={!isConnected || messageInput.trim() === '' || !token}
                                className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-300 disabled:shadow-none"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                        {!token && (
                            <p className="text-xs text-red-500 mt-2 text-center">
                                Please log in to send and receive messages.
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chat;