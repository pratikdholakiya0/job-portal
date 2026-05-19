import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import { Loader2, Send, ArrowLeft } from 'lucide-react'; 
import { useAuth } from '../store/AuthContext'; 

const BASE_URL = 'https://jobportalbackend-z91i.onrender.com';
const WEBSOCKET_ENDPOINT = '/chat';
const MESSAGES_PER_PAGE = 20;

const ChatWindow = ({ activeConversation, onBack }) => {
    // Destructure AuthContext values
    const { token, user } = useAuth(); 
    const conversationId = activeConversation.id;
     
    // Local state for messages and input
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
     
    // WebSocket states
    const [isConnected, setIsConnected] = useState(false);
    const [isWsConnecting, setIsWsConnecting] = useState(true);
     
    // Pagination states
    const [currentPage, setCurrentPage] = useState(0); 
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Refs
    const clientRef = useRef(null);
    const messagesEndRef = useRef(null); // Anchor for scrolling to bottom
    const messageAreaRef = useRef(null); // Anchor for scroll-up pagination detection
    const isInitialLoadRef = useRef(true); // Flag to control initial scroll behavior

    // --- Helper Functions ---

    const getAuthHeaders = useCallback(() => {
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }, [token]);

    // FIX: Reliable scroll-to-bottom function with 0ms timeout to wait for DOM update
    const scrollToBottom = useCallback((behavior = "smooth") => { 
        setTimeout(() => { 
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: behavior });
            }
        }, 0); 
    }, []);

    // Memoize and sort messages by timestamp (oldest first)
    const sortedMessages = useMemo(() => {
        return [...messages].sort((a, b) => {
            const timeA = new Date(a.timestamp || 0).getTime();
            const timeB = new Date(b.timestamp || 0).getTime();
            return timeA - timeB;  
        });
    }, [messages]);

    // --- Message Fetching (Pagination) ---

    const fetchMessages = useCallback(async (pageToLoad) => {
        if (isLoading || (!hasMoreMessages && pageToLoad > 0) || !token || !conversationId) return;

        setIsLoading(true);
        const url = `${BASE_URL}/api/v1/conversation/${conversationId}/getMessages`;
        // Store previous scroll height before new messages are loaded
        const previousScrollHeight = messageAreaRef.current?.scrollHeight; 
         
        try {
            const response = await axios.get(url, {
                params: { 
                    page: pageToLoad, 
                    size: MESSAGES_PER_PAGE 
                },
                headers: getAuthHeaders()
            });

            const newMessages = response.data.map(msg => ({
                ...msg,
                id: msg.id || `${msg.senderId}-${msg.timestamp}-${Math.random()}`, 
                displayTime: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
             
            if (newMessages.length < MESSAGES_PER_PAGE) {
                setHasMoreMessages(false);
            }
             
            const existingMessagesMap = new Map(
                newMessages.map(msg => [msg.id, msg])
            );

            // Step 2: Merge new messages into the map, overwriting duplicates (which shouldn't happen
            // for fetched history, but is safe).
            newMessages.forEach(msg => {
                existingMessagesMap.set(msg.id, msg);
            });

            // Step 3: Convert the Map values back to an array.
            // The Map preserves insertion order, but since we are merging fetched history,
            // the only correct final order is to sort by timestamp.
            const mergedMessages = Array.from(existingMessagesMap.values());

            // Step 4: Sort the merged array by timestamp to ensure correct chronological order.
            const finalMessages = mergedMessages.sort((a, b) => {
                const timeA = new Date(a.timestamp || 0).getTime();
                const timeB = new Date(b.timestamp || 0).getTime();
                return timeA - timeB;
            });

            setMessages(finalMessages);
             
            setCurrentPage(pageToLoad);

            // Logic to maintain scroll position when paginating up
            if (pageToLoad > 0 && messageAreaRef.current) {
                setTimeout(() => {
                    const newScrollHeight = messageAreaRef.current.scrollHeight;
                    messageAreaRef.current.scrollTop = newScrollHeight - previousScrollHeight;
                }, 0);
            }
             
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setIsLoading(false);
        }
    }, [conversationId, getAuthHeaders, isLoading, hasMoreMessages, token]);


    // Effect to handle initial load/conversation change
    useEffect(() => {
        // Reset all conversation-specific state when ID changes
        setMessages([]);
        setCurrentPage(0);
        setHasMoreMessages(true);
        isInitialLoadRef.current = true;
        
        if (token && conversationId) {
            fetchMessages(0); // Load first page
        }
        
    }, [conversationId]);

    // FIX: Scroll to bottom on initial load only after messages are loaded
    useEffect(() => {
        if (messages.length > 0 && isInitialLoadRef.current && !isLoading) {
            scrollToBottom('auto'); // Use 'auto' for instant, non-jarring scroll
            isInitialLoadRef.current = false;
        }
    }, [messages, isLoading, scrollToBottom]);


    // Effect to handle WebSocket connection and subscription
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
                            const newMessage = {
                                ...receivedMessage,
                                text: receivedMessage.content, 
                                id: receivedMessage.id || `${receivedMessage.senderId}-${receivedMessage.timestamp}-${Math.random()}`,
                                displayTime: new Date(receivedMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            };
                             
                            setMessages(prevMessages => [...prevMessages, newMessage]);
                            // Call directly, the 0ms delay inside scrollToBottom handles DOM update timing
                            scrollToBottom(); 
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

    const stompClient = clientRef.current;


    // --- Scroll Handler for Pagination ---
    const handleScroll = () => {
        if (messageAreaRef.current && messageAreaRef.current.scrollTop === 0 && !isLoading && hasMoreMessages) {
            fetchMessages(currentPage + 1);
        }
    };
     
    // --- Message Sending ---
    const handleSend = (e) => {
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

    // Safely determine the chat partner name for the header
    const chatPartnerName = activeConversation.employerId===user ? activeConversation.applicantName : activeConversation.employerName;
     
    // Message rendering component
    const renderMessage = (msg, index) => {
        const isCurrentUser = msg.senderId === user; 
        const timestamp = msg.displayTime || new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return (
            <div 
                key={msg.id || index} 
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
                <div className={`max-w-[80%] md:max-w-[70%] lg:max-w-[60%] flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                    <div className={`
                        p-3 rounded-2xl shadow-md
                        ${isCurrentUser 
                            ? 'bg-blue-600 text-white rounded-br-md' 
                            : 'bg-white text-gray-800 rounded-bl-md'}
                    `}>
                        {msg.content || msg.text} 
                    </div>
                    <span className={`text-xs mt-1 ${isCurrentUser ? 'text-gray-400' : 'text-gray-500'}`}>
                        {timestamp}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <main className="flex flex-col flex-1 bg-gray-50 h-full">
            {/* Chat Header */}
            <header className="flex justify-between items-center p-4 border-b bg-white shadow-sm flex-shrink-0">
                <div className="flex items-center">
                    {/* Internal Mobile Back Button */}
                    <button 
                        onClick={onBack} 
                        className="sm:hidden text-gray-600 hover:text-blue-600 mr-2 p-2 rounded-full hover:bg-gray-100 transition"
                        aria-label="Back to conversations"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="flex flex-col">
                        <h4 className="text-lg font-semibold text-gray-800">
                            {chatPartnerName} 
                        </h4>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {isWsConnecting ? 'Connecting...' : (isConnected ? 'Online' : 'Offline')}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition hidden sm:block">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition hidden sm:block">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M18 12a6 6 0 11-12 0 6 6 0 0112 0z"></path></svg>
                    </button>
                </div>
            </header>

            {/* Message Area */}
            <div 
                ref={messageAreaRef}
                onScroll={handleScroll}
                // flex-col-reverse makes children stack from bottom up
                className="flex-1 p-6 overflow-y-auto space-y-4 flex flex-col-reverse" 
            >
                
                {/* Scroll-up Pagination Loading Indicator */}
                {isLoading && (
                    <div className="flex justify-center py-2 flex-shrink-0">
                        <Loader2 className="animate-spin w-5 h-5 text-blue-500" />
                    </div>
                )}
                
                {/* Start of Conversation Indicator */}
                {!hasMoreMessages && sortedMessages.length > 0 && (
                    <p className="text-center text-xs text-gray-500 pt-4 pb-2 flex-shrink-0">--- Start of Conversation ---</p>
                )}
                
                {/* No Messages Indicator */}
                {sortedMessages.length === 0 && !isLoading && !isWsConnecting && (
                    <p className="text-center text-gray-500 pt-20 flex-shrink-0">Start a new conversation!</p>
                )}

                {/* Render Messages in reverse order to place the latest message at the bottom (due to flex-col-reverse) */}
                {sortedMessages.map(renderMessage).reverse()} 
                
                {/* Anchor for ScrollToBottom */}
                <div className='fixed bottom-0 w-0 h-0' ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <footer className="flex p-4 border-t bg-white items-center flex-shrink-0">
                <button className="text-gray-400 hover:text-blue-500 mr-3 p-2 rounded-full hover:bg-gray-100 transition">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a2 2 0 102.828 2.828l6.586-6.586"></path></svg>
                </button>
                <input
                    type="text"
                    placeholder={isConnected ? "Type a message..." : "Connecting..."}
                    className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend(e)}
                    disabled={!isConnected || isWsConnecting || !token}
                />
                <button 
                    className="ml-3 p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition duration-150 shadow-md disabled:bg-blue-300 disabled:shadow-none"
                    onClick={handleSend}
                    disabled={!isConnected || messageInput.trim() === '' || !token}
                >
                    <Send className="w-6 h-6" />
                </button>
            </footer>
        </main>
    );
};

export default ChatWindow;
