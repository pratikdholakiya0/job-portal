// src/mockData.js

export const conversations = [
    {
        id: 'c1',
        name: 'Project Alpha Team',
        lastMessage: 'You: Got the mockups, thanks!',
        time: '10:30 AM',
        unreadCount: 0,
        avatarInitial: 'PA',
        status: '4 members, online',
    },
    {
        id: 'c2',
        name: 'Sarah Johnson',
        lastMessage: "Let's connect tomorrow morning.",
        time: 'Yesterday',
        unreadCount: 2,
        avatarInitial: 'SJ',
        status: 'Online',
    },
    {
        id: 'c3',
        name: 'Bug Report #452',
        lastMessage: 'Admin: Ticket closed.',
        time: '2 days ago',
        unreadCount: 0,
        avatarInitial: 'BR',
        status: 'Offline',
    },
    {
        id: 'c4',
        name: 'Marketing Campaign Prep',
        lastMessage: 'Draft looks good!',
        time: '2 hours ago',
        unreadCount: 1,
        avatarInitial: 'MC',
        status: '3 members, online',
    },
];

export const mockMessages = {
    // Messages for the active conversation (c1: Project Alpha Team)
    c1: [
        {
            id: 'm1',
            text: 'Hey! The latest design iteration looks great. When is the deadline for final feedback?',
            type: 'received',
            timestamp: '10:28 AM',
        },
        {
            id: 'm2',
            text: "Thanks! The deadline is end of day Friday. Got the mockups, thanks! I'll ping the team with a quick summary shortly.",
            type: 'sent',
            timestamp: '10:30 AM',
        },
        {
            id: 'm3',
            text: 'Perfect, cheers!',
            type: 'received',
            timestamp: '10:31 AM',
        },
        {
            id: 'm4',
            text: 'I will start testing this afternoon.',
            type: 'sent',
            timestamp: '10:32 AM',
        },
    ],
    // You'd add messages for c2, c3, etc. here
};