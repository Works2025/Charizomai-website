import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Bot, Minus, Headphones, Paperclip, Check, CheckCheck } from 'lucide-react';
import { supabase } from '../supabase';

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimised, setIsMinimised] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! Welcome to Charizomai Foundation. I'm your virtual assistant.", sender: 'bot', createdAt: Date.now() },
        { id: 2, text: "To better assist you and ensure a team member can follow up, may I please have your name?", sender: 'bot', createdAt: Date.now() }
    ]);
    const [inputText, setInputText] = useState('');
    const [step, setStep] = useState('name'); // name, email, chat
    const [leadInfo, setLeadInfo] = useState({ name: '', email: '' });
    const [sessionId, setSessionId] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [isHumanSupport, setIsHumanSupport] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [agentName, setAgentName] = useState(null);
    const [chatMetadata, setChatMetadata] = useState({}); // { last_read_admin: ts, ... }
    const [showGreeting, setShowGreeting] = useState(false);
    const messagesEndRef = useRef(null);

    // Show Greeting after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isOpen && !localStorage.getItem('chatGreetingShown')) {
                setShowGreeting(true);
                playNotificationSound(); // Optional: Play sound with popup
                localStorage.setItem('chatGreetingShown', 'true');
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, [isOpen]);

    // Initial Load from LocalStorage
    useEffect(() => {
        const loadSession = () => {
            const saved = localStorage.getItem('chatSession');
            if (saved) {
                try {
                    const session = JSON.parse(saved);
                    const now = Date.now();
                    const diff = (now - session.timestamp) / 1000 / 60; // difference in minutes

                    if (diff < 60 * 24) { // Extend session valid time to 24 hours
                        setMessages(session.messages);
                        setStep(session.step);
                        setLeadInfo(session.leadInfo);
                        setSessionId(session.sessionId);
                        setIsHumanSupport(session.isHumanSupport);
                        if (session.isOpen !== undefined) setIsOpen(session.isOpen);
                        if (session.agentName) setAgentName(session.agentName);
                        if (session.chatMetadata) setChatMetadata(session.chatMetadata);
                    } else {
                        localStorage.removeItem('chatSession');
                    }
                } catch (e) {
                    console.error('Failed to parse chat session', e);
                }
            }
            setIsInitialized(true);
        };
        loadSession();
    }, []);

    // Reset unread count when opened
    useEffect(() => {
        if (isOpen) {
            setUnreadCount(0);
        }
    }, [isOpen]);

    // Save Session to LocalStorage on Change
    useEffect(() => {
        if (!isInitialized) return;
        
        const sessionData = {
            messages,
            step,
            leadInfo,
            sessionId,
            isHumanSupport,
            isOpen,
            agentName,
            chatMetadata,
            timestamp: Date.now()
        };
        localStorage.setItem('chatSession', JSON.stringify(sessionData));
    }, [messages, step, leadInfo, sessionId, isHumanSupport, isOpen, isInitialized, agentName, chatMetadata]);

    // Sound Effect
    const playNotificationSound = () => {
        // Short "Pop" sound (Base64) to avoid network/CORS issues
        const sound = "data:audio/mpeg;base64,SUQzBAAAAAABAFRYWFgAAAASAAADbWFqb3JfYnJhbmQAbXA0MgBUWFhYAAAAEQAAA21pbm9yX3ZlcnNpb24AMABUWFhYAAAAHAAAA2NvbXBhdGlibGVfYnJhbmRzAGlzb21tcDQyAFRTU0UAAAAPAAADTGF2ZjU3LjU2LjEwMAAAAAAAAAAAAAAA//tQZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAjAAAHXwAFBwoNEhUYGx0gIiQnKi0wMjU4Ojw+QENFRkdKS01QUlVYW1xeYWJkZmhqbG9xdHZ5fH6AgYKDhoiLjI+QkpOUlpiZm5yen6GjpKanqKqsrbCzsre5uru9vsDBwsPExcbHyMzN0NHS1NbX2Nrb3d7f4OHi5OXm6Oqsra+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+AAAAAExhdmM1Ny42NAEAf//7UGQAAAAAAAG7AAAAAAAABuAAAAAAAAAAA0gAABDoAAAAKAAACgAAAGQAAAABCAAAACAAAAB5AAAAJAAAAM5AAADmAAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD//tQZAAACkAAAAA0gAAAAAAABuAAAAS6AAAANIAAAAAAAAbgAAAALwAAAA8AAAAfAAAAIwAAACsAAAAzA";
        const audio = new Audio(sound);
        audio.volume = 1.0;
        audio.play().catch(e => console.error('Audio play failed:', e));
    };

    // Listen for Admin Replies (Robust Sync) & Catch-up
    useEffect(() => {
        if (!sessionId) return;

        // 1. Immediate Catch-up (Sync latest history on mount/reconnect) - No Sound
        const fetchLatestHistory = async () => {
            const { data, error } = await supabase
                .from('contact_messages')
                .select('message')
                .eq('id', sessionId)
                .single();
            
            if (data && data.message) {
                parseAndSetMessages(data.message, false);
            }
        };
        fetchLatestHistory();

        // 2. Real-time Subscription - With Sound
        const channel = supabase
            .channel(`chat:${sessionId}`)
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'contact_messages', filter: `id=eq.${sessionId}` },
                (payload) => {
                    const newData = payload.new;
                    if (newData && newData.message) {
                        parseAndSetMessages(newData.message, true); // Play sound for real-time updates
                        if (!isOpen) {
                            setUnreadCount(prev => prev + 1);
                        }
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [sessionId, isOpen]);

    const parseAndSetMessages = (rawText, playSound = false) => {
        const lines = rawText.split('\n');
        const parsedMessages = [];
        let detectedAgentName = null;
        let detectedMetadata = {};

        lines.forEach((line, index) => {
            const trimmed = line.trim();
            if (!trimmed) return;

            // Filter out Internal notes completely
            if (trimmed.startsWith('[Internal]:')) return;

            // Parse Metadata (Hidden)
            if (trimmed.startsWith('[Metadata]:')) {
                try {
                    const jsonStr = trimmed.replace(/^\[Metadata\]:/, '').trim();
                    detectedMetadata = JSON.parse(jsonStr);
                } catch (e) {
                    console.error("Error parsing metadata", e);
                }
                return;
            }

            let msg = null;
            if (trimmed.startsWith('User:')) {
                msg = { text: trimmed.replace(/^User:/, '').trim(), sender: 'user', createdAt: Date.now() }; // Fallback timestamp if not stored
            } else if (trimmed.startsWith('Bot:')) {
                msg = { text: trimmed.replace(/^Bot:/, '').trim(), sender: 'bot', createdAt: Date.now() };
            } else {
                // Check for Admin/Agent with Name: "Admin <Name>: ..." or "Admin: ..."
                const adminMatch = trimmed.match(/^Admin(?: <(.*?)>)?:(.*)/);
                if (adminMatch) {
                    msg = { text: adminMatch[2].trim(), sender: 'agent', createdAt: Date.now() };
                    if (adminMatch[1]) {
                        detectedAgentName = adminMatch[1];
                    }
                } else if (trimmed.startsWith('[System]:')) {
                    const sysText = trimmed.replace(/^\[System\]:/, '').trim();
                    if (!sysText.includes('Lead captured') && !sysText.includes('Chat started')) {
                         msg = { text: sysText, sender: 'system', createdAt: Date.now() };
                    }
                } else {
                    // Handle multiline messages or lines without prefix
                    if (parsedMessages.length > 0) {
                        parsedMessages[parsedMessages.length - 1].text += `\n${line}`;
                    }
                    return;
                }
            }

            if (msg) {
                msg.id = `msg-${index}`;
                parsedMessages.push(msg);
            }
        });

        // Update Agent Name and Metadata if found
        if (detectedAgentName) {
            setAgentName(detectedAgentName);
        }
        if (Object.keys(detectedMetadata).length > 0) {
            setChatMetadata(detectedMetadata);
        }
        
        setMessages(prev => {
            // Check if we have a NEW message that is NOT from user
            if (playSound && parsedMessages.length > prev.length) {
                const lastMsg = parsedMessages[parsedMessages.length - 1];
                if (lastMsg.sender !== 'user') {
                    playNotificationSound();
                }
            }
            // Preserve existing timestamps from prev state if available to avoid jitter
            // Just replace content.
            // Actually, for simplicity, we'll just allow re-render. Ideally we'd map timestamps.
            return parsedMessages;
        });
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const switchToHuman = async () => {
        if (!sessionId) return;
        setIsHumanSupport(true);
        const sysMsg = { id: Date.now(), text: "Connecting you to a human agent... Please hold on.", sender: 'bot', createdAt: Date.now() };
        setMessages(prev => [...prev, sysMsg]);
        
        try {
            // Update DB to notify admin (or simple Log for now)
            const { data } = await supabase.from('contact_messages').select('message').eq('id', sessionId).single();
            if (data) {
                const newHistory = `${data.message}\n[System]: User proactively requested human agent.`;
                await supabase.from('contact_messages').update({ message: newHistory }).eq('id', sessionId);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const timestamp = Date.now();
        const userMsg = { id: timestamp, text: inputText, sender: 'user', createdAt: timestamp };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        const currentMetadata = { ...chatMetadata, last_user_msg_ts: timestamp };
        
        // Helper to get formatted metadata string
        const getMetaString = (meta) => `[Metadata]: ${JSON.stringify(meta)}`;

        // Process based on step
        if (step === 'name') {
            setLeadInfo(prev => ({ ...prev, name: userMsg.text }));
            setTimeout(() => {
                setMessages(prev => [...prev, { id: Date.now() + 1, text: `Nice to meet you, ${userMsg.text}! Could you please share your email address?`, sender: 'bot', createdAt: Date.now() }]);
                setStep('email');
                setIsTyping(false);
            }, 800);
        } else if (step === 'email') {
            const email = userMsg.text;
            setLeadInfo(prev => ({ ...prev, email: email }));
            
            // Save lead to DB
            try {
                const { data, error } = await supabase.from('contact_messages').insert([{
                    name: leadInfo.name,
                    email: email,
                    subject: 'ChatBot Lead',
                    message: [
                        ...messages.map(m => `${m.sender === 'bot' ? 'Bot' : 'User'}: ${m.text}`),
                        `User: ${email}`,
                        `[System]: Lead captured. Name: ${leadInfo.name}, Email: ${email}`,
                        getMetaString(currentMetadata)
                    ].join('\n')
                }]).select();

                if (data && data[0]) {
                    setSessionId(data[0].id);
                }
            } catch (err) {
                console.error('Error saving lead:', err);
            }

            setTimeout(() => {
                setMessages(prev => [...prev, { id: Date.now() + 1, text: "Thank you! I've saved your details so our team can reach out if we get disconnected. How can I help you today?", sender: 'bot', createdAt: Date.now() }]);
                setStep('chat');
                setIsTyping(false);
            }, 1000);
        } else if (isHumanSupport) {
             // Human requested, so we just log the user message to DB and wait for admin reply
             // No AI response
             try {
                if (sessionId) {
                     const { data } = await supabase.from('contact_messages').select('message').eq('id', sessionId).single();
                     if (data) {
                         // Remove old metadata line if exists
                         const cleanHistory = data.message.split('\n').filter(l => !l.startsWith('[Metadata]:')).join('\n');
                         const newHistory = `${cleanHistory}\nUser: ${userMsg.text}\n${getMetaString(currentMetadata)}`;
                         await supabase.from('contact_messages').update({ message: newHistory }).eq('id', sessionId);
                     }
                }
             } catch(err) { console.error(err); }
             setIsTyping(false);
        } else {
            // General Chat Logic (Simulated AI)
            setTimeout(async () => {
                const response = await getSimulatedAIResponse(userMsg.text);
                const botMsg = { id: Date.now() + 1, text: response, sender: 'bot', createdAt: Date.now() };
                setMessages(prev => [...prev, botMsg]);
                
                // Update DB with conversation history
                if (sessionId) {
                    // Fetch current content first to append safely (or use RPC in production)
                    // For now, simpler append approach via state might risk race conditions but okay for MV
                    const { data } = await supabase.from('contact_messages').select('message').eq('id', sessionId).single();
                    if (data) {
                        const cleanHistory = data.message.split('\n').filter(l => !l.startsWith('[Metadata]:')).join('\n');
                        const newHistory = `${cleanHistory}\nUser: ${userMsg.text}\nBot: ${response}\n${getMetaString(currentMetadata)}`;
                        await supabase.from('contact_messages').update({ message: newHistory }).eq('id', sessionId);
                    }
                }
                
                setIsTyping(false);
            }, 1500);
        }
    };

    const getSimulatedAIResponse = async (text) => {
        const lowerText = text.toLowerCase();

        // 1. Realistic "Thinking" Delay
        const thinkingTime = 800 + Math.random() * 1000; // 0.8s - 1.8s
        await new Promise(resolve => setTimeout(resolve, thinkingTime));

        // 2. Advanced Knowledge Base
        const knowledgeBase = [
            {
                keywords: ['hello', 'hi', 'hey', 'greetings', 'morning', 'afternoon', 'evening'],
                response: "Hello! 👋 It's wonderful to meet you. I'm here to help you learn more about Charizomai's impact. What would you like to start with?"
            },
            {
                keywords: ['donate', 'money', 'fund', 'give', 'contribution', 'support', 'bank', 'momo', 'card'],
                response: "Your generosity fuels our mission! 🌍 You can donate securely via our 'Fundraiser' page using Credit Card, Mobile Money, or Bank Transfer. Every bit counts towards changing a life."
            },
            {
                keywords: ['volunteer', 'join', 'intern', 'help', 'team', 'work with you'],
                response: "We'd love to have you on board! 🙌 Our volunteers are the heartbeat of Charizomai. Please check the 'Volunteer' page for open roles in Education, Health, and Outreach."
            },
            {
                keywords: ['event', 'program', 'schedule', 'calendar', 'activity', 'coming up'],
                response: "We're always busy! 🗓️ Upcoming events include our Community Health Screening and the 'Education for All' drive. You can see the full calendar on our 'Events' tab."
            },
            {
                keywords: ['location', 'where', 'address', 'office', 'ghana', 'accra'],
                response: "We are proudly based in Accra, Ghana 🇬🇭, working across several regions to reach the most vulnerable communities."
            },
            {
                keywords: ['contact', 'email', 'phone', 'call', 'reach', 'number'],
                response: "You can reach our team directly at 📞 +233 50 123 4567 or send an email to ✉️ info@charizomaifoundation.org. We're open Mon-Fri, 9am-5pm."
            },
            {
                keywords: ['mission', 'vision', 'about', 'who are you', 'what do you do', 'story'],
                response: "Charizomai Foundation is a non-profit dedicated to holistic community development. We focus on 3 pillars: Education 📚, Healthcare 🏥, and Social Welfare 🤝."
            },
            {
                keywords: ['thank', 'thanks', 'appreciate', 'good', 'cool', 'awesome'],
                response: "You're very welcome! 🧡 It's great chatting with you. Is there anything else on your mind?"
            },
            {
                keywords: ['bye', 'goodbye', 'see you', 'later'],
                response: "Goodbye! 👋 Thank you for stopping by. Remember, together we can make a difference!"
            }
        ];

        // 3. Smart Matching logic
        for (const item of knowledgeBase) {
            // Check if any keyword matches
            if (item.keywords.some(k => lowerText.includes(k))) {
                return item.response;
            }
        }

        // 4. Intelligent Fallback
        return "That's a specific question that I want to unsure I get right. 🤔 I've flagged this for my human colleagues. Would you like to connect with a human agent directly now?";
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        style={{
                            position: 'fixed',
                            bottom: '90px',
                            right: '24px',
                            width: '350px',
                            height: '500px',
                            background: '#fff',
                            borderRadius: '16px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                            display: 'flex',
                            flexDirection: 'column',
                            zIndex: 9999,
                            overflow: 'hidden',
                            border: '1px solid #e5e7eb'
                        }}
                    >
                        {/* Header */}
                        <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderBottom: '1px solid #f3f4f6' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E67E22', border: '1px solid #e2e8f0' }}>
                                        {agentName ? <Headphones size={18} /> : <Bot size={18} />}
                                    </div>
                                    <div style={{ position: 'absolute', bottom: '0', right: '0', width: '10px', height: '10px', background: '#22c55e', borderRadius: '50%', border: '2px solid #fff' }} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '15px', fontWeight: 600, margin: 0, color: '#111827' }}>
                                        {agentName ? agentName : 'Charizomai AI'}
                                    </h3>
                                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                                        {agentName ? 'Active now' : 'Always here to help'}
                                    </span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                {!isHumanSupport && step === 'chat' && (
                                    <button 
                                        onClick={switchToHuman} 
                                        style={{ background: '#f1f5f9', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '11px', padding: '6px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}
                                        title="Talk to Human"
                                    >
                                        <Headphones size={12} /> Agent
                                    </button>
                                )}
                                <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}><Minus size={18} /></button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div style={{ flex: 1, padding: '16px', overflowY: 'auto', background: '#f9fafb', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        alignSelf: msg.sender === 'user' ? 'flex-end' : (msg.sender === 'system' ? 'center' : 'flex-start'),
                                        maxWidth: msg.sender === 'system' ? '90%' : '80%',
                                        padding: msg.sender === 'system' ? '6px 12px' : '10px 16px',
                                        borderRadius: '18px',
                                        background: msg.sender === 'user' ? '#E67E22' : (msg.sender === 'system' ? '#f8fafc' : '#f1f5f9'),
                                        color: msg.sender === 'user' ? '#fff' : (msg.sender === 'system' ? '#64748b' : '#1e293b'),
                                        borderBottomRightRadius: msg.sender === 'user' ? '4px' : '18px',
                                        borderBottomLeftRadius: (msg.sender === 'bot' || msg.sender === 'agent') ? '4px' : '18px',
                                        boxShadow: msg.sender === 'system' ? 'none' : 'none',
                                        fontSize: msg.sender === 'system' ? '11px' : '13.5px',
                                        lineHeight: '1.5',
                                        textAlign: msg.sender === 'system' ? 'center' : 'left',
                                        fontWeight: msg.sender === 'system' ? '500' : '400',
                                        letterSpacing: msg.sender === 'system' ? '0.02em' : 'normal',
                                        position: 'relative'
                                    }}
                                >
                                    {msg.sender === 'agent' && (
                                        <span style={{ position: 'absolute', top: '-18px', left: '0', fontSize: '10px', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                                            <Headphones size={10} /> Agent
                                        </span>
                                    )}
                                    {msg.text}
                                    
                                    {/* Read Receipts for User Messages */}
                                    {msg.sender === 'user' && (
                                        <span style={{ 
                                            position: 'absolute', 
                                            bottom: '2px', 
                                            right: '6px', 
                                            fontSize: '10px', 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            color: 'rgba(255,255,255,0.7)'
                                        }}>
                                            {/* Logic: 
                                                - If chatMetadata.last_read_admin >= msg.createdAt -> Two Blue Ticks (Read)
                                                - Else -> Two Grey Ticks (Delivered, simplifying assumption) 
                                                Note: In current color scheme, user bubbles are Orange/White text.
                                            */}
                                            {(chatMetadata.last_read_admin && chatMetadata.last_read_admin >= (msg.createdAt || 0)) ? (
                                                // Read (Simulated Blue, actually White/Green on Orange bubble for contrast, or just Double Ticks)
                                                <CheckCheck size={14} color="#fff" strokeWidth={3} />
                                            ) : (
                                                // Delivered (Double Tick)
                                                <CheckCheck size={14} color="rgba(255,255,255,0.6)" />
                                                // Or Single Tick if we want 'Sent' vs 'Delivered' distinction, but state is fast.
                                            )}
                                        </span>
                                    )}
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div style={{ alignSelf: 'flex-start', background: '#fff', padding: '12px 16px', borderRadius: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#9ca3af' }} />
                                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#9ca3af' }} />
                                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#9ca3af' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Actions */}
                        {messages.length < 4 && !inputText && (
                            <div style={{ padding: '0 16px 12px 16px', display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                {['Donate', 'Volunteer', 'Events', 'Contact'].map((action) => (
                                    <button
                                        key={action}
                                        onClick={() => {
                                            const msg = { id: Date.now(), text: `I'd like to know more about ${action}`, sender: 'user' };
                                            setMessages(prev => [...prev, msg]);
                                            setTimeout(async () => {
                                                const response = await getSimulatedAIResponse(msg.text);
                                                setMessages(prev => [...prev, { id: Date.now() + 1, text: response, sender: 'bot' }]);
                                            }, 600);
                                        }}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '16px',
                                            border: '1px solid #e2e8f0',
                                            background: '#fff',
                                            color: '#1e293b',
                                            fontSize: '12px',
                                            whiteSpace: 'nowrap',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                        }}
                                        onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                                        onMouseLeave={(e) => e.target.style.background = '#fff'}
                                    >
                                        {action}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <form onSubmit={handleSend} style={{ padding: '12px 16px', background: '#fff', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button
                                type="button"
                                onClick={() => {
                                    // Simulate file attachment
                                    const msg = { id: Date.now(), text: "[Attached File: screenshot.png]", sender: 'user' };
                                    setMessages(prev => [...prev, msg]);
                                }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#94a3b8',
                                    cursor: 'pointer',
                                    padding: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    transition: 'color 0.2s'
                                }}
                                title="Attach File"
                            >
                                <Paperclip size={18} />
                            </button>
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Type a message..."
                                style={{
                                    flex: 1,
                                    padding: '10px 14px',
                                    borderRadius: '24px',
                                    border: '1px solid #e2e8f0',
                                    outline: 'none',
                                    fontSize: '13.5px',
                                    background: '#f8fafc',
                                    color: '#1e293b',
                                    transition: 'all 0.2s'
                                }}
                                onFocus={(e) => {
                                    e.target.style.background = '#fff';
                                    e.target.style.borderColor = '#cbd5e1';
                                }}
                                onBlur={(e) => {
                                    e.target.style.background = '#f8fafc';
                                    e.target.style.borderColor = '#e2e8f0';
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    background: inputText.trim() ? '#E67E22' : '#e2e8f0',
                                    color: inputText.trim() ? '#fff' : '#94a3b8',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: inputText.trim() ? 'pointer' : 'default',
                                    transition: 'all 0.2s'
                                }}
                                disabled={!inputText.trim()}
                            >
                                <Send size={16} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Proactive Greeting Popup */}
            <AnimatePresence>
                {showGreeting && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        style={{
                            position: 'fixed',
                            bottom: '90px',
                            right: '24px',
                            background: '#fff',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                            maxWidth: '250px',
                            zIndex: 9998,
                            cursor: 'pointer',
                            border: '1px solid #f3f4f6'
                        }}
                    >
                         {/* Close X for the tooltip */}
                         <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowGreeting(false);
                            }}
                            style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                background: '#f3f4f6',
                                borderRadius: '50%',
                                padding: '4px',
                                border: '1px solid #e5e7eb',
                                cursor: 'pointer',
                                color: '#6b7280'
                            }}
                        >
                            <X size={12} />
                        </button>
                        <div onClick={() => { setIsOpen(true); setShowGreeting(false); }} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                             <div style={{ width: '30px', height: '30px', background: '#ffe4e6', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', flexShrink: 0 }}>
                                <span style={{ fontSize: '16px' }}>👋</span>
                             </div>
                             <div>
                                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#1f2937' }}>Hi there!</p>
                                <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>How can we help you today?</p>
                             </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => {
                    setIsOpen(!isOpen);
                    setShowGreeting(false); // Hide greeting when clicked
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    width: '56px',
                    height: '56px',
                    borderRadius: '28px',
                    background: '#E67E22',
                    color: '#fff',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(230, 126, 34, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    cursor: 'pointer'
                }}
            >
                {isOpen ? <X size={22} /> : (
                    <>
                        <MessageCircle size={24} />
                        {unreadCount > 0 && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                style={{
                                    position: 'absolute',
                                    top: '-2px',
                                    right: '-2px',
                                    background: '#ef4444',
                                    color: '#fff',
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '2px solid #fff'
                                }}
                            >
                                {unreadCount}
                            </motion.div>
                        )}
                    </>
                )}
            </motion.button>
        </>
    );
}
