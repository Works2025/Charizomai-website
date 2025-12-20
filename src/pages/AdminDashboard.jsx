import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Heart, Calendar, DollarSign, FileText, Settings, LogOut, Plus, Edit, Trash2, Search, Filter, Download,
    BarChart3, TrendingUp, Mail, MoreVertical, Eye, ArrowUpRight, CheckCircle, Clock, FileIcon, X, Shield, Lock, Smartphone, Bell, AlertTriangle, Globe, Facebook, Twitter, Instagram, Upload, Image, Linkedin, Phone, MapPin, Send, Info, ArrowLeft, MessageCircle, Paperclip, Server, ChevronDown, Slash, List, Grid, Link, Square, CheckSquare, Trash
} from 'lucide-react';
import { sendEmail } from '../utils/emailService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../supabase';


const GalleryPreviewModal = ({ image, onClose }) => {
    if (!image) return null;
    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)', zIndex: 9999,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: '2rem', backdropFilter: 'blur(10px)',
            animation: 'fadeIn 0.2s ease-out'
        }} onClick={onClose}>
            <button 
                onClick={onClose}
                style={{
                    position: 'absolute', top: '24px', right: '24px',
                    background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer',
                    borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s', backdropFilter: 'blur(4px)'
                }}
                onMouseOver={e => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                    e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseOut={e => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'scale(1)';
                }}
            >
                <X size={24} />
            </button>
            <div 
                onClick={e => e.stopPropagation()} 
                style={{ 
                    maxWidth: '100%', maxHeight: '100%', 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px',
                    animation: 'zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
            >
                <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                    <img 
                        src={image.image_url} 
                        alt={image.caption} 
                        style={{ 
                            maxWidth: '90vw', maxHeight: '80vh', 
                            objectFit: 'contain', display: 'block'
                        }} 
                    />
                </div>
                <div style={{ textAlign: 'center', color: 'white', maxWidth: '600px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.02em' }}>{image.caption}</h3>
                    <span style={{ 
                        display: 'inline-block', padding: '4px 12px', borderRadius: '100px', 
                        background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.1)',
                        fontSize: '0.875rem', fontWeight: 500, backdropFilter: 'blur(4px)'
                    }}>
                        {image.category}
                    </span>
                </div>
            </div>
            <style>
                {`
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                    @keyframes zoomIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                `}
            </style>
        </div>
    );
};

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [searchQuery, setSearchQuery] = useState('');
    const [eventsSubTab, setEventsSubTab] = useState('events');
    const [verifyCode, setVerifyCode] = useState('');
    const [verificationResult, setVerificationResult] = useState(null);
    const [verifiedUser, setVerifiedUser] = useState(null);
    const [attendance, setAttendance] = useState([]);
    
    // Initial State with Safe Defaults
    const [stats, setStats] = useState({
        totalDonations: 0,
        totalDonors: 0,
        activeCauses: 0,
        upcomingEvents: 0,
        registrations: 0,
        monthlyGrowth: 0,
        donorGrowth: 0
    });

    const [eventRegistrations, setEventRegistrations] = useState([]);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCauseCreateModalOpen, setIsCauseCreateModalOpen] = useState(false);
    const [isCauseEditModalOpen, setIsCauseEditModalOpen] = useState(false);
    const [isCauseViewModalOpen, setIsCauseViewModalOpen] = useState(false);
    const [selectedCause, setSelectedCause] = useState(null);
    const [selectedDonor, setSelectedDonor] = useState(null);
    const [isDonorViewModalOpen, setIsDonorViewModalOpen] = useState(false);
    const [isMessageViewModalOpen, setIsMessageViewModalOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isGenerateReportModalOpen, setIsGenerateReportModalOpen] = useState(false);
    const [recentDonations, setRecentDonations] = useState([]);
    const [causes, setCauses] = useState([]);
    const [dashboardActivityLogs, setDashboardActivityLogs] = useState([]);
    
    // Newsletter/Campaign State
    const [newsletterTab, setNewsletterTab] = useState('all'); // 'all', 'drafts', 'sent'
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [newsletterSubject, setNewsletterSubject] = useState('');
    const [newsletterContent, setNewsletterContent] = useState('');
    const [targetAudience, setTargetAudience] = useState('all'); // 'all', 'donors', 'volunteers'
    const [isSendingNewsletter, setIsSendingNewsletter] = useState(false);
    
    // --- Live Chat State ---
    const [liveChats, setLiveChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [chatSearchQuery, setChatSearchQuery] = useState('');
    const [adminReplyText, setAdminReplyText] = useState('');
    // NEW: Chat Features State
    // NEW: Chat Features State
    const [activeChatTab, setActiveChatTab] = useState('open'); // 'open' | 'resolved'
    const [showQuickReplies, setShowQuickReplies] = useState(false);
    const [quickRepliesList, setQuickRepliesList] = useState([
        "Hi there! How can I help you today?",
        "I'm looking into that for you right now.",
        "Could you please provide more details?",
        "Thank you for contacting us. Have a great day!"
    ]);
    const [showChatDetails, setShowChatDetails] = useState(false);
    const [showAssignDropdown, setShowAssignDropdown] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Hoisted state

    const [isInternalNote, setIsInternalNote] = useState(false);
    // deleted starredChats state
    // deleted chatTags state
    const fileInputRef = useRef(null);
    // Campaigns State
    const [campaigns, setCampaigns] = useState([]);
    const [donors, setDonors] = useState([]);

    const [galleryImages, setGalleryImages] = useState([]);
    const [isGalleryUploadModalOpen, setIsGalleryUploadModalOpen] = useState(false);
    const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
    const [isGalleryEditModalOpen, setIsGalleryEditModalOpen] = useState(false);
    const [gallerySearchQuery, setGallerySearchQuery] = useState('');
    const [galleryCategoryFilter, setGalleryCategoryFilter] = useState('All');
    const [gallerySortOrder, setGallerySortOrder] = useState('newest'); // 'newest' | 'oldest'
    const [galleryViewMode, setGalleryViewMode] = useState('grid'); // 'grid' | 'list'
    const [previewImage, setPreviewImage] = useState(null);
    const [gallerySelectedImages, setGallerySelectedImages] = useState([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null); // { id: string, type: 'gallery' | 'event' | ... }
    const [volunteers, setVolunteers] = useState([]);
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [isVolunteerViewModalOpen, setIsVolunteerViewModalOpen] = useState(false);
    
    // Activity Log State
    const [activityLogs, setActivityLogs] = useState([]);
    const [clientIp, setClientIp] = useState('');
    const [appUsers, setAppUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [settingsTab, setSettingsTab] = useState('general');
    const [reportsDateRange, setReportsDateRange] = useState('30days'); // '7days', '30days', '90days', 'year', 'all'
    const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
    const [reportCategory, setReportCategory] = useState('overview'); // 'overview', 'financial', 'volunteers', 'impact'
    const [messagesSubTab, setMessagesSubTab] = useState('inbox'); // 'inbox', 'campaigns'
    const [isEmailProviderOpen, setIsEmailProviderOpen] = useState(false);
    // SMS Configuration State
    const [smsProvider, setSmsProvider] = useState('twilio');
    const [isSmsProviderOpen, setIsSmsProviderOpen] = useState(false);
    const [smsAccountSid, setSmsAccountSid] = useState('');
    const [smsAuthToken, setSmsAuthToken] = useState('');
    const [smsPhoneNumber, setSmsPhoneNumber] = useState('');

    // Payment Configuration State
    const [paymentGateway, setPaymentGateway] = useState('paystack');
    const [isPaymentGatewayOpen, setIsPaymentGatewayOpen] = useState(false);
    // Separate keys for providers
    const [paystackPublicKey, setPaystackPublicKey] = useState('');
    const [paystackSecretKey, setPaystackSecretKey] = useState('');
    const [stripePublicKey, setStripePublicKey] = useState('');
    const [stripeSecretKey, setStripeSecretKey] = useState('');
    const [paymentCurrency, setPaymentCurrency] = useState('GHS');

    const [currentUserProfile, setCurrentUserProfile] = useState(null);
    const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] = useState(false);
    const [forcePasswordChange, setForcePasswordChange] = useState(false);
    
    // Enhanced User Management State
    // Enhanced User Management State
    const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [userRoleFilter, setUserRoleFilter] = useState('all');
    const [userStatusFilter, setUserStatusFilter] = useState('all');
    const [selectedUserIds, setSelectedUserIds] = useState(new Set());
    
    // --- Notification State --
    const [notification, setNotification] = useState(null); 
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // --- Live Chat Scroll Refs ---
    const messagesEndRef = useRef(null);
    const [editingCampaignId, setEditingCampaignId] = useState(null);

    const playNotificationSound = () => {
        const sound = "data:audio/mpeg;base64,SUQzBAAAAAABAFRYWFgAAAASAAADbWFqb3JfYnJhbmQAbXA0MgBUWFhYAAAAEQAAA21pbm9yX3ZlcnNpb24AMABUWFhYAAAAHAAAA2NvbXBhdGlibGVfYnJhbmRzAGlzb21tcDQyAFRTU0UAAAAPAAADTGF2ZjU3LjU2LjEwMAAAAAAAAAAAAAAA//tQZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAjAAAHXwAFBwoNEhUYGx0gIiQnKi0wMjU4Ojw+QENFRkdKS01QUlVYW1xeYWJkZmhqbG9xdHZ5fH6AgYKDhoiLjI+QkpOUlpiZm5yen6GjpKanqKqsrbCzsre5uru9vsDBwsPExcbHyMzN0NHS1NbX2Nrb3d7f4OHi5OXm6Oqsra+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+AAAAAExhdmM1Ny42NAEAf//7UGQAAAAAAAG7AAAAAAAABuAAAAAAAAAAA0gAABDoAAAAKAAACgAAAGQAAAABCAAAACAAAAB5AAAAJAAAAM5AAADmAAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD//tQZAAACkAAAAA0gAAAAAAABuAAAAS6AAAANIAAAAAAAAbgAAAALwAAAA8AAAAfAAAAIwAAACsAAAAzA";
        try {
            const audio = new Audio(sound);
            audio.volume = 0.5;
            audio.play().catch(e => console.error('Audio play failed:', e));
        } catch(e) {}
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Scroll when selected chat changes or liveChats update (new messages)
    useEffect(() => {
        scrollToBottom();
    }, [selectedChatId, liveChats]);

    // Fetch IP on mount
    useEffect(() => {
        fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(data => setClientIp(data.ip))
            .catch(err => console.error('Error fetching IP:', err));
    }, []);

    // Helper to log actions
    const logAction = async (action, details = {}) => {
        try {
            const { data: sessionData } = await supabase.auth.getSession();
            const userEmail = sessionData?.session?.user?.email || 'Unknown';
            
            const { error } = await supabase.from('activity_logs').insert([{
                user_email: userEmail,
                action: action,
                details: details,
                ip_address: clientIp
            }]);

            if (error) console.error('Failed to log action:', error);

            // Refresh logs
            const { data: logs } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(50);
            if (logs) setActivityLogs(logs);
        } catch (err) {
            console.error('Error in logAction:', err);
        }
    };

    // --- Real-time Subscription ---
    useEffect(() => {
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('contact_messages')
                .select('*')
                .order('created_at', { ascending: false }); // Newest first
            if (data) {
                // Determine Live Chats (ChatBot Lead)
                // Note: Main 'messages' list is populated by fetchDashboardData to avoid redundancy/race conditions
                
                const chatLeads = data.filter(m => m.subject === 'ChatBot Lead');
                setLiveChats(chatLeads);
            } else if (error) {
                console.error('Error fetching messages:', error);
            }
        };
        fetchMessages();

        // Subscribe to changes in contact_messages
        const channel = supabase
            .channel('public:contact_messages')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'contact_messages' },
                (payload) => {
                    if (payload.new) {
                        const isChatBot = payload.new.subject === 'ChatBot Lead';

                        if (isChatBot) {
                            
                            // Sound Notification Logic
                            if (payload.eventType === 'INSERT') {
                                playNotificationSound(); // New Chat
                            } else if (payload.eventType === 'UPDATE') {
                                // Check if last message is from User
                                const lines = payload.new.message ? payload.new.message.split('\n') : [];
                                const lastLine = lines[lines.length - 1];
                                if (lastLine && lastLine.trim().startsWith('User:')) {
                                    playNotificationSound(); // New User Reply
                                }
                            }

                            // Whether Insert or Update, we want to update our list
                            // If Update, replace item. If Insert, prepend item.
                            setLiveChats(prev => {
                                const exists = prev.find(c => c.id === payload.new.id);
                                if (exists) {
                                    return prev.map(c => c.id === payload.new.id ? payload.new : c);
                                } else {
                                    return [payload.new, ...prev];
                                }
                            });
                        } else {
                            // Also update main messages list if needed for non-chat messages
                            fetchDashboardData();
                        }
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Mark as Read Logic for Admin (Moved to Main Component Scope)






    // Mock Data for Charts (Safe Defaults)
    const chartData = [
        { name: 'Nov 1', amount: 4000 }, { name: 'Nov 2', amount: 3000 }, { name: 'Nov 3', amount: 2000 },
        { name: 'Nov 4', amount: 2780 }, { name: 'Nov 5', amount: 1890 }, { name: 'Nov 6', amount: 2390 },
        { name: 'Nov 7', amount: 3490 }, { name: 'Nov 8', amount: 4000 }, { name: 'Nov 9', amount: 3000 },
        { name: 'Nov 10', amount: 2000 }, { name: 'Nov 11', amount: 2780 }, { name: 'Nov 12', amount: 1890 },
        { name: 'Nov 13', amount: 5390 }, { name: 'Nov 14', amount: 3490 },
    ];
    const pieData = [
        { name: 'One-time', value: 400 }, { name: 'Monthly', value: 300 },
        { name: 'Corporate', value: 300 }, { name: 'Anonymous', value: 200 },
    ];
    const barData = [
        { name: 'Education', amount: 45000 }, { name: 'Health', amount: 32000 },
        { name: 'Water', amount: 28000 }, { name: 'Community', amount: 15000 },
    ];
    const COLORS = ['#E67E22', '#2C3E50', '#10b981', '#f59e0b'];

    // Handlers
    const handleViewEvent = (event) => { setSelectedEvent(event); setIsViewModalOpen(true); };
    const handleEditEvent = (event) => { setSelectedEvent(event); setIsEditModalOpen(true); };
    const handleCreateEvent = () => { setIsCreateModalOpen(true); };
    const handleCreateCause = () => { setIsCauseCreateModalOpen(true); };
    const handleViewCause = (cause) => { setSelectedCause(cause); setIsCauseViewModalOpen(true); };
    const handleEditCause = (cause) => { setSelectedCause(cause); setIsCauseEditModalOpen(true); };
    const handleViewDonor = (donor) => { setSelectedDonor(donor); setIsDonorViewModalOpen(true); };
    const handleViewMessage = (message) => { setSelectedMessage(message); setIsMessageViewModalOpen(true); };
    const handleViewVolunteer = (volunteer) => { setSelectedVolunteer(volunteer); setIsVolunteerViewModalOpen(true); };
    const handleEditUser = (user) => { setSelectedUserForEdit(user); setIsEditUserModalOpen(true); };
    
    const handleCloseModals = () => {
        setIsViewModalOpen(false); setIsEditModalOpen(false); setIsCreateModalOpen(false); setIsCauseCreateModalOpen(false); setIsCauseEditModalOpen(false); setIsCauseViewModalOpen(false); setIsDonorViewModalOpen(false); setIsMessageViewModalOpen(false); setIsGalleryUploadModalOpen(false); setIsGalleryEditModalOpen(false); setIsVolunteerViewModalOpen(false); setIsEditUserModalOpen(false); setIsAddUserModalOpen(false); setIsDeleteConfirmOpen(false);
        setSelectedEvent(null); setSelectedCause(null); setSelectedDonor(null); setSelectedMessage(null); setSelectedVolunteer(null); setSelectedUserForEdit(null); setSelectedGalleryImage(null); setItemToDelete(null);
    };
    const handleSaveEvent = async (updatedEvent) => {
        try {
            const { error } = await supabase
                .from('events')
                .update(updatedEvent)
                .eq('id', updatedEvent.id);
            
            if (error) throw error;
            
            setEvents(events.map(ev => ev.id === updatedEvent.id ? updatedEvent : ev));
            logAction('Update Event', { eventId: updatedEvent.id, title: updatedEvent.title });
            handleCloseModals();
        } catch (error) {
            console.error('Error updating event:', error);
            alert('Error updating event!');
        }
    };
    const handleDeleteEvent = async (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                const { error } = await supabase
                    .from('events')
                    .delete()
                    .eq('id', eventId);
                
                if (error) throw error;
                
                setEvents(events.filter(ev => ev.id !== eventId));
                logAction('Delete Event', { eventId });
            } catch (error) {
                console.error('Error deleting event:', error);
                alert('Error deleting event!');
            }
        }
    };
    const handleSaveNewEvent = (newEvent) => {
        const eventWithId = { ...newEvent, id: events.length + 1, registrations: 0, status: 'upcoming' };
        setEvents([...events, eventWithId]); 
        logAction('Create Event', { title: newEvent.title });
        handleCloseModals();
    };
    const handleSaveNewCause = async (newCause) => {
        try {
            const { data, error } = await supabase
                .from('causes')
                .insert([newCause])
                .select();
            
            if (error) throw error;
            
            if (data) {
                setCauses([...causes, {
                    id: data[0].id,
                    title: data[0].title,
                    raised: parseFloat(data[0].raised || 0),
                    goal: parseFloat(data[0].goal),
                    status: 'active',
                    donors: 0,
                    growth: '+0%'
                }]);
                logAction('Create Cause', { causeId: data[0].id, title: data[0].title });
            }
            handleCloseModals();
        } catch (error) {
            console.error('Error creating cause:', error);
            alert('Error creating cause!');
        }
    };
    const handleSaveCause = async (updatedCause) => {
        try {
            const { error } = await supabase
                .from('causes')
                .update(updatedCause)
                .eq('id', updatedCause.id);
            
            if (error) throw error;
            
            setCauses(causes.map(c => c.id === updatedCause.id ? { ...c, ...updatedCause } : c));
            logAction('Update Cause', { causeId: updatedCause.id, title: updatedCause.title });
            handleCloseModals();
        } catch (error) {
            console.error('Error updating cause:', error);
            alert('Error updating cause!');
        }
    };
    const handleDeleteCause = async (causeId) => {
        if (window.confirm('Are you sure you want to delete this cause?')) {
            try {
                const { error } = await supabase
                    .from('causes')
                    .delete()
                    .eq('id', causeId);
                
                if (error) throw error;
                
                setCauses(causes.filter(c => c.id !== causeId));
                logAction('Delete Cause', { causeId });
            } catch (error) {
                console.error('Error deleting cause:', error);
                alert('Error deleting cause!');
            }
        }
    };
    const handleLogout = async () => { 
        await logAction('Sign Out', { timestamp: new Date().toISOString() });
        await supabase.auth.signOut(); 
        navigate('/login'); 
    };

    // User Management Handlers
    const handleAddUser = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const role = formData.get('role');
        const password = formData.get('password');

        if (!email) return;

        try {
            setUsersLoading(true);
            
            // Create user in Supabase Auth if password is provided
            if (password) {
                if (password.length < 6) {
                    alert('Password must be at least 6 characters');
                    setUsersLoading(false);
                    return;
                }
                
                // Use a temporary client to avoid logging out the admin
                const tempSupabase = createClient(
                    import.meta.env.VITE_SUPABASE_URL,
                    import.meta.env.VITE_SUPABASE_ANON_KEY
                );

                const { data: authData, error: authError } = await tempSupabase.auth.signUp({
                    email,
                    password,
                });

                if (authError) {
                    console.error('Error creating auth user:', authError);
                    alert(`Error creating user: ${authError.message}`);
                    setUsersLoading(false);
                    return;
                }
            }

            // Add to user_roles table
            const { data, error } = await supabase
                .from('user_roles')
                .upsert([{ 
                    email, 
                    role, 
                    must_change_password: !!password // Force change if admin set it
                }], { onConflict: 'email' })
                .select();

            if (error) {
                if (error.code === '23505') {
                    alert('User role entry already exists or updated.');
                     // Refresh list if it was just an update
                     const { data: updatedUsers } = await supabase.from('user_roles').select('*').order('created_at', { ascending: false });
                     if (updatedUsers) setAppUsers(updatedUsers);
                } else {
                    throw error;
                }
            }

            if (data) {
                // If the user already existed in the array, replace them, otherwise add
                const existingIndex = appUsers.findIndex(u => u.email === email);
                if (existingIndex >= 0) {
                    const newUsers = [...appUsers];
                    newUsers[existingIndex] = data[0];
                    setAppUsers(newUsers);
                } else {
                     setAppUsers([data[0], ...appUsers]);
                }
                
                logAction('Add User', { email, role, withPassword: !!password });
                e.target.reset();
                alert(password ? 'User created with password!' : 'User added to allowlist.');
            }
        } catch (error) {
            console.error('Error adding user:', error);
            alert('Error adding user');
        } finally {
            setUsersLoading(false);
            if (!error) setIsAddUserModalOpen(false);
        }
    };

    const handleBulkDelete = async () => {
        if (!selectedUserIds.size) return;
        if (!window.confirm(`Are you sure you want to delete ${selectedUserIds.size} users?`)) return;

        try {
            const idsToDelete = Array.from(selectedUserIds);
            const { error } = await supabase.from('user_roles').delete().in('id', idsToDelete);
            
            if (error) throw error;
            
            setAppUsers(appUsers.filter(u => !selectedUserIds.has(u.id)));
            setSelectedUserIds(new Set());
            logAction('Bulk Delete Users', { count: idsToDelete.length, ids: idsToDelete });
        } catch (error) {
            console.error('Error deleting users:', error);
            alert('Failed to delete some users.');
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = appUsers.map(u => u.id);
            setSelectedUserIds(new Set(allIds));
        } else {
            setSelectedUserIds(new Set());
        }
    };

    const handleSelectUser = (id) => {
        const newSelected = new Set(selectedUserIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedUserIds(newSelected);
    };

    const handleTogglePasswordRequirement = async (userId, userEmail, currentValue) => {
        try {
            const { error } = await supabase
                .from('user_roles')
                .update({ must_change_password: !currentValue })
                .eq('id', userId);

            if (error) throw error;

            setAppUsers(appUsers.map(u => u.id === userId ? { ...u, must_change_password: !currentValue } : u));
            logAction('Toggle Password Req', { userEmail, newValue: !currentValue });
        } catch (error) {
            console.error('Error updating password requirement:', error);
            alert('Error updating password requirement');
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const role = formData.get('role');
        const status = formData.get('status');

        if (!selectedUserForEdit) return;

        try {
            const { error } = await supabase
                .from('user_roles')
                .update({ role, status })
                .eq('id', selectedUserForEdit.id);

            if (error) throw error;

            setAppUsers(appUsers.map(u => u.id === selectedUserForEdit.id ? { ...u, role, status } : u));
            logAction('Update User Profile', { email: selectedUserForEdit.email, role, status });
            handleCloseModals();
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Error updating user');
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        if (password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({ password: password });
            if (error) throw error;

            // If it was forced, update the flag
            if (currentUserProfile && currentUserProfile.must_change_password) {
                 const { error: dbError } = await supabase
                    .from('user_roles')
                    .update({ must_change_password: false })
                    .eq('email', currentUserProfile.email);
                
                if (dbError) throw dbError;
                
                setCurrentUserProfile({ ...currentUserProfile, must_change_password: false });
                setForcePasswordChange(false);
            }

            alert('Password updated successfully!');
            e.target.reset();
            if (isPasswordChangeModalOpen) setIsPasswordChangeModalOpen(false);
            logAction('Update Password', { timestamp: new Date().toISOString() });

        } catch (error) {
            console.error('Error updating password:', error);
            alert(error.message || 'Error updating password');
        }
    };

    const handleDeleteUser = async (userId, userEmail) => {
        if (window.confirm(`Are you sure you want to remove ${userEmail}?`)) {
            try {
                const { error } = await supabase
                    .from('user_roles')
                    .delete()
                    .eq('id', userId);

                if (error) throw error;

                setAppUsers(appUsers.filter(u => u.id !== userId));
                logAction('Remove User', { userEmail });
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Error deleting user');
            }
        }
    };

    const handleDeleteGalleryImage = (imageId) => {
        setItemToDelete({ id: imageId, type: 'gallery' });
        setIsDeleteConfirmOpen(true);
    };

    const confirmDeleteGalleryImage = async () => {
        if (!itemToDelete) return;
        try {
            const { error } = await supabase
                .from('gallery')
                .delete()
                .eq('id', itemToDelete.id);
            
            if (error) throw error;
            
            setGalleryImages(galleryImages.filter(img => img.id !== itemToDelete.id));
            showNotification('Image deleted successfully');
            handleCloseModals();
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('Error deleting image!');
        }
    };

    const handleUploadGalleryImage = async (newImage) => {
        try {
            const { data, error } = await supabase
                .from('gallery')
                .insert([newImage])
                .select();
            
            if (error) throw error;
            
            setGalleryImages([...galleryImages, data[0]]);
            handleCloseModals();
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image!');
        }
    };

    const handleEditGalleryImage = (image) => {
        setSelectedGalleryImage(image);
        setIsGalleryEditModalOpen(true);
    };

    const handleUpdateGalleryImage = async (updatedImage) => {
        try {
            const { error } = await supabase
                .from('gallery')
                .update({
                    caption: updatedImage.caption,
                    category: updatedImage.category
                })
                .eq('id', updatedImage.id);

            if (error) throw error;

            setGalleryImages(galleryImages.map(img => img.id === updatedImage.id ? { ...img, ...updatedImage } : img));
            handleCloseModals();
            showNotification('Image details updated successfully');
        } catch (error) {
            console.error('Error updating image:', error);
            alert('Error updating image details!');
        }
    };


    const handleUpdateVolunteerStatus = async (volunteerId, newStatus) => {
        try {
            const { error } = await supabase
                .from('volunteers')
                .update({ status: newStatus })
                .eq('id', volunteerId);

            if (error) throw error;

            setVolunteers(volunteers.map(v => v.id === volunteerId ? { ...v, status: newStatus } : v));
            if (selectedVolunteer && selectedVolunteer.id === volunteerId) {
                setSelectedVolunteer({ ...selectedVolunteer, status: newStatus });
            }

            // Fetch email for notification
            const volunteer = volunteers.find(v => v.id === volunteerId);
            if (volunteer && volunteer.email) {
                const subject = newStatus === 'approved' 
                    ? 'Volunteer Application Approved! 🎉' 
                    : 'Update on your Volunteer Application';
                
                const html = newStatus === 'approved'
                    ? `
                        <div style="font-family: sans-serif; padding: 20px; color: #333;">
                            <h2 style="color: #059669;">Welcome to the Team!</h2>
                            <p>Hi ${volunteer.full_name},</p>
                            <p>We are thrilled to inform you that your volunteer application has been <strong>APPROVED</strong>.</p>
                            <p>Our team coordinator will be in touch with you shortly with onboarding details.</p>
                            <br/>
                            <p>Welcome to Charizomai! Can't wait to make an impact together.</p>
                        </div>
                    `
                    : `
                        <div style="font-family: sans-serif; padding: 20px; color: #333;">
                            <h2>Application Update</h2>
                            <p>Hi ${volunteer.full_name},</p>
                            <p>Thank you for your interest in volunteering with us.</p>
                            <p>At this time, we are unable to move forward with your application. However, we will keep your details on file for future opportunities.</p>
                            <br/>
                            <p>Best regards,<br/>The Charizomai Team</p>
                        </div>
                    `;

                await sendEmail({
                    to: volunteer.email,
                    subject,
                    html,
                    type: 'transactional'
                });
                
                showNotification(`Volunteer ${newStatus} & notified via email`);
            } else {
                 showNotification(`Volunteer ${newStatus}`);
            }
        } catch (error) {
            console.error('Error updating volunteer status:', error);
            alert('Error updating volunteer status!');
        }
    };

    // Data Fetching
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data: causesData } = await supabase.from('causes').select('*');
                if (causesData) {
                    setCauses(causesData.map(c => ({
                        id: c.id, title: c.title, raised: parseFloat(c.raised), goal: parseFloat(c.goal),
                        status: 'active', donors: 0, growth: '+0%'
                    })));
                }

                const { data: donationsData } = await supabase.from('donations').select('*').order('created_at', { ascending: false });
                if (donationsData) {
                    setRecentDonations(donationsData.map(d => ({
                        id: d.id, donor: d.donor_name, amount: d.amount, cause: 'General',
                        date: new Date(d.created_at).toLocaleDateString(), raw_date: d.created_at, email: d.email, status: d.status
                    })));
                    const totalRaised = donationsData.reduce((sum, d) => sum + (d.amount || 0), 0);
                    const uniqueDonors = new Set(donationsData.map(d => d.email)).size;
                    setStats(prev => ({
                        ...prev, totalDonations: totalRaised, totalDonors: uniqueDonors, activeCauses: causesData?.length || 0
                    }));
                }

                const { data: eventsData } = await supabase.from('events').select('*');
                if (eventsData) {
                    setEvents(eventsData.map(e => ({ ...e, registrations: 0 })));
                }

                const { data: galleryData } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
                if (galleryData) setGalleryImages(galleryData);

                const { data: volunteersData } = await supabase.from('volunteers').select('*').order('created_at', { ascending: false });
                if (volunteersData) setVolunteers(volunteersData);

                const { data: registrationsData } = await supabase.from('event_registrations').select(`*, events (title)`).order('created_at', { ascending: false });
                if (registrationsData) {
                    setEventRegistrations(registrationsData.map(r => ({
                        id: r.id, attendee: r.attendee_name, email: r.email, phone: r.phone,
                        event: r.events?.title || 'Unknown Event', date: new Date(r.created_at).toLocaleDateString(),
                        code: r.ticket_code, status: r.status
                    })));
                }

                // Fetch Donors (from donations table for now, aggregating by email)
                if (donationsData) {
                    const uniqueDonorsMap = new Map();
                    donationsData.forEach(d => {
                        if (!uniqueDonorsMap.has(d.email)) {
                            uniqueDonorsMap.set(d.email, {
                                id: d.id,
                                name: d.donor_name,
                                email: d.email,
                                totalDonated: 0,
                                lastDonationDate: d.created_at,
                                donationCount: 0
                            });
                        }
                        const donor = uniqueDonorsMap.get(d.email);
                        donor.totalDonated += d.amount;
                        donor.donationCount += 1;
                        if (new Date(d.created_at) > new Date(donor.lastDonationDate)) {
                            donor.lastDonationDate = d.created_at;
                        }
                    });
                    setDonors(Array.from(uniqueDonorsMap.values()));
                }

                // Campaigns
                const { data: campaignsData } = await supabase.from('campaigns').select('*').order('created_at', { ascending: false });
                if (campaignsData) setCampaigns(campaignsData);

                // Messages
                const { data: messagesData } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
                if (messagesData) {
                    setMessages(messagesData.filter(m => m.subject !== 'ChatBot Lead'));
                }

                // Activity Logs
                const { data: logsData } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(50);
                if (logsData) {
                    setActivityLogs(logsData);
                }

                // User Roles
                const { data: usersData } = await supabase.from('user_roles').select('*').order('created_at', { ascending: false });
                if (usersData) {
                    setAppUsers(usersData);
                }

                // Check Current User Status & Ensure Profile Exists
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    let { data: profile } = await supabase.from('user_roles').select('*').eq('email', user.email).single();
                    
                    if (!profile) {
                        // Profile missing (e.g. first login or manual auth creation). Create default Admin profile.
                        const newProfile = {
                            email: user.email,
                            role: 'admin',
                            status: 'active',
                            last_login: new Date().toISOString()
                        };
                        const { data: createdProfile, error: createError } = await supabase
                            .from('user_roles')
                            .insert([newProfile])
                            .select()
                            .single();
                        
                        if (createdProfile) {
                            profile = createdProfile;
                            setAppUsers(prev => {
                                const exists = prev.find(p => p.email === createdProfile.email);
                                return exists ? prev : [createdProfile, ...prev];
                            });
                            logAction('Auto-created User Profile', { email: user.email });
                        } else if (createError) {
                            console.error('Failed to auto-create user profile:', createError);
                        }
                    }

                    if (profile) {
                         setCurrentUserProfile(profile);
                         if (profile.must_change_password) {
                             setForcePasswordChange(true);
                             setIsPasswordChangeModalOpen(true);
                         }
                    }
                }

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        const fetchSettings = async () => {
             const { data: settings } = await supabase.from('admin_settings').select('*');
             if (settings) {
                 const settingsMap = settings.reduce((acc, curr) => {
                     acc[curr.key] = curr.value;
                     return acc;
                 }, {});
                 
                 // Email
                 if (settingsMap.email_provider) setEmailProvider(settingsMap.email_provider);
                 if (settingsMap.email_api_key) setEmailApiKey(settingsMap.email_api_key);
                 if (settingsMap.email_sender_name) setEmailSenderName(settingsMap.email_sender_name);
                 if (settingsMap.email_sender_address) setEmailSenderAddress(settingsMap.email_sender_address);
                 
                 // SMS
                 if (settingsMap.sms_provider) setSmsProvider(settingsMap.sms_provider);
                 if (settingsMap.sms_account_sid) setSmsAccountSid(settingsMap.sms_account_sid);
                 if (settingsMap.sms_auth_token) setSmsAuthToken(settingsMap.sms_auth_token);
                 if (settingsMap.sms_phone_number) setSmsPhoneNumber(settingsMap.sms_phone_number);

                 // Payment
                 // Payment
                 if (settingsMap.payment_gateway) setPaymentGateway(settingsMap.payment_gateway);
                 if (settingsMap.paystack_public_key) setPaystackPublicKey(settingsMap.paystack_public_key);
                 if (settingsMap.paystack_secret_key) setPaystackSecretKey(settingsMap.paystack_secret_key);
                 if (settingsMap.stripe_public_key) setStripePublicKey(settingsMap.stripe_public_key);
                 if (settingsMap.stripe_secret_key) setStripeSecretKey(settingsMap.stripe_secret_key);
                 if (settingsMap.payment_currency) setPaymentCurrency(settingsMap.payment_currency);
                 
                 // General
                 if(settingsMap.org_name) setOrgName(settingsMap.org_name);
                 if(settingsMap.org_email) setOrgEmail(settingsMap.org_email);
                 if(settingsMap.org_tagline) setOrgTagline(settingsMap.org_tagline);
                 if(settingsMap.org_address) setOrgAddress(settingsMap.org_address);
                 if(settingsMap.social_facebook) setSocialFacebook(settingsMap.social_facebook);
                 if(settingsMap.social_twitter) setSocialTwitter(settingsMap.social_twitter);
                 if(settingsMap.social_instagram) setSocialInstagram(settingsMap.social_instagram);
                 if(settingsMap.social_linkedin) setSocialLinkedin(settingsMap.social_linkedin);
             }
        };

        fetchDashboardData();
        fetchSettings();

    }, []);

    // Real-time Subscription
    useEffect(() => {
        const channel = supabase
            .channel('realtime donations')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'donations' }, (payload) => {
                const newDonation = payload.new;
                setRecentDonations(prev => [{
                    id: newDonation.id,
                    donor: newDonation.donor_name,
                    amount: newDonation.amount,
                    cause: 'General',
                    date: 'Just now',
                    email: newDonation.email,
                    status: newDonation.status
                }, ...prev]);

                setStats(prev => ({
                    ...prev,
                    totalDonations: (prev.totalDonations || 0) + newDonation.amount,
                    totalDonors: prev.totalDonors + 1
                }));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Helper Functions
    const downloadCSV = (data, filename) => {
        if (!data || !data.length) return;
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    
    // UI Helpers
    const toggleMaintenanceMode = () => {
        logAction('Toggle Maintenance Mode');
        alert("Maintenance mode toggled! (This is a meaningful placeholder for now)");
    };

    // Render Methods
    const renderOverview = () => (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
                <StatCard icon={<DollarSign size={18} />} title="Total Donations" value={`₵${(stats.totalDonations || 0).toLocaleString()}`} iconColor="#E67E22" />
                <StatCard icon={<Users size={18} />} title="Total Donors" value={stats.totalDonors || 0} iconColor="#10b981" />
                <StatCard icon={<Heart size={18} />} title="Active Causes" value={stats.activeCauses || 0} iconColor="#f59e0b" />
                <StatCard icon={<Calendar size={18} />} title="Registrations" value={stats.registrations || 0} iconColor="#ef4444" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div style={cardStyle}>
                    <h3 style={cardTitleStyle}>Donations by Cause</h3>
                    <div style={{ height: '220px', marginTop: '16px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#6b7280' }} width={70} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={tooltipStyle} />
                                <Bar dataKey="amount" fill="#E67E22" radius={[0, 4, 4, 0]} barSize={16} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div style={cardStyle}>
                    <h3 style={cardTitleStyle}>Donation Sources</h3>
                    <div style={{ height: '220px', marginTop: '16px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={tooltipStyle} />
                                <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" iconSize={6} wrapperStyle={{ fontSize: '11px', color: '#6b7280' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            <div style={{ ...cardStyle, marginBottom: '20px' }}>
                <h3 style={cardTitleStyle}>Donation Trends (Last 14 Days)</h3>
                <div style={{ height: '260px', marginTop: '16px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickMargin={10} />
                            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(value) => `₵${value}`} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Line type="monotone" dataKey="amount" stroke="#E67E22" strokeWidth={2} dot={{ r: 3, fill: '#E67E22', strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#2C3E50', margin: 0 }}>Recent Donations</h2>
                    <button style={actionButtonStyle}>View all <ArrowUpRight size={14} /></button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {recentDonations.slice(0, 5).map((donation) => <DonationItem key={donation.id} donation={donation} />)}
                </div>
            </div>
        </div>
    );

    const renderDonations = () => (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2C3E50', margin: 0 }}>Donations</h2>
                <button style={actionButtonStyle} onClick={() => downloadCSV(recentDonations, 'donations.csv')}><Download size={16} /> Export CSV</button>
            </div>
            <div style={{ display: 'grid', gap: '16px' }}>
                {recentDonations.map(donation => <DonationItem key={donation.id} donation={donation} />)}
            </div>
        </div>
    );

    const renderCauses = () => (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2C3E50', margin: 0 }}>Causes</h2>
                <button style={primaryButtonStyle} onClick={handleCreateCause}><Plus size={16} /> New Cause</button>
            </div>
            <div style={{ display: 'grid', gap: '16px' }}>
                {causes.map(cause => <CauseCard key={cause.id} cause={cause} onView={() => handleViewCause(cause)} onEdit={() => handleEditCause(cause)} onDelete={() => handleDeleteCause(cause.id)} />)}
            </div>
        </div>
    );

    const renderGallery = () => {
        const filteredGallery = galleryImages.filter(img => {
            const matchesSearch = (img.caption || '').toLowerCase().includes(gallerySearchQuery.toLowerCase());
            const matchesCategory = galleryCategoryFilter === 'All' || img.category === galleryCategoryFilter;
            return matchesSearch && matchesCategory;
        }).sort((a, b) => {
            if (gallerySortOrder === 'newest') return new Date(b.created_at) - new Date(a.created_at);
            if (gallerySortOrder === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
            if (gallerySortOrder === 'az') return a.caption.localeCompare(b.caption);
            return 0;
        });

        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2C3E50', margin: 0 }}>Gallery Management</h2>
                    <button onClick={() => setIsGalleryUploadModalOpen(true)} style={actionButtonStyle}><Plus size={16} /> Upload Image</button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px -1px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <Image size={16} color="#6b7280" />
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Images</div>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>{galleryImages.length}</div>
                    </div>
                    
                    <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px -1px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <Calendar size={16} color="#6b7280" />
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>New This Month</div>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>
                            {galleryImages.filter(img => {
                                const date = new Date(img.created_at);
                                const now = new Date();
                                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                            }).length}
                        </div>
                    </div>

                    <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px -1px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <TrendingUp size={16} color="#6b7280" />
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Top Category</div>
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#E67E22', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {Object.entries(galleryImages.reduce((acc, img) => {
                                acc[img.category] = (acc[img.category] || 0) + 1;
                                return acc;
                            }, {})).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
                        </div>
                    </div>

                    <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px -1px rgba(0,0,0,0.05)' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <Filter size={16} color="#6b7280" />
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Active Categories</div>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b82f6' }}>
                            {new Set(galleryImages.map(img => img.category)).size}
                        </div>
                    </div>

                    <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px -1px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <Clock size={16} color="#6b7280" />
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Last Updated</div>
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#8b5cf6' }}>
                            {galleryImages.length > 0 ? (() => {
                                const dates = galleryImages.map(img => new Date(img.created_at));
                                const maxDate = new Date(Math.max(...dates));
                                const diff = Math.floor((new Date() - maxDate) / (1000 * 60 * 60 * 24));
                                return diff === 0 ? 'Today' : diff === 1 ? 'Yesterday' : `${diff} days ago`;
                            })() : 'Never'}
                        </div>
                    </div>

                    <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px -1px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <BarChart3 size={16} color="#6b7280" />
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Avg. Images/Cat</div>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ec4899' }}>
                            {(() => {
                                const activeCats = new Set(galleryImages.map(img => img.category)).size;
                                return activeCats > 0 ? (galleryImages.length / activeCats).toFixed(1) : 0;
                            })()}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                        <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input 
                            type="text" 
                            placeholder="Search gallery..." 
                            value={gallerySearchQuery}
                            onChange={(e) => setGallerySearchQuery(e.target.value)}
                            style={{ 
                                width: '100%', 
                                padding: '12px 12px 12px 48px', 
                                borderRadius: '12px', 
                                border: 'none', 
                                outline: 'none', 
                                background: 'white',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                                fontSize: '0.95rem',
                                color: '#1f2937'
                            }}
                        />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ position: 'relative', minWidth: '160px' }}>
                            <select 
                                value={gallerySortOrder}
                                onChange={(e) => setGallerySortOrder(e.target.value)}
                                style={{ 
                                    width: '100%',
                                    padding: '12px 40px 12px 16px', 
                                    borderRadius: '12px', 
                                    border: 'none', 
                                    outline: 'none', 
                                    background: 'white', 
                                    cursor: 'pointer',
                                    appearance: 'none',
                                    WebkitAppearance: 'none',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                                    fontSize: '0.95rem',
                                    color: '#1f2937',
                                    fontWeight: 500
                                }}
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="az">Caption (A-Z)</option>
                            </select>
                            <ChevronDown size={16} color="#6b7280" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        </div>

                        <div style={{ position: 'relative', minWidth: '180px' }}>
                            <select 
                                value={galleryCategoryFilter}
                                onChange={(e) => setGalleryCategoryFilter(e.target.value)}
                                style={{ 
                                    width: '100%',
                                    padding: '12px 40px 12px 16px', 
                                    borderRadius: '12px', 
                                    border: 'none', 
                                    outline: 'none', 
                                    background: 'white', 
                                    cursor: 'pointer',
                                    appearance: 'none',
                                    WebkitAppearance: 'none',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                                    fontSize: '0.95rem',
                                    color: '#1f2937',
                                    fontWeight: 500
                                }}
                            >
                                <option value="All">All Categories</option>
                                <option value="Outreach">Outreach</option>
                                <option value="Distribution">Distribution</option>
                                <option value="Education">Education</option>
                                <option value="Team">Team</option>
                                <option value="Events">Events</option>
                                <option value="Volunteer">Volunteer</option>
                            </select>
                            <ChevronDown size={16} color="#6b7280" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        </div>

                        <div style={{ display: 'flex', background: 'white', padding: '4px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', gap: '4px' }}>
                            <button 
                                onClick={() => {
                                    setIsSelectionMode(!isSelectionMode);
                                    if(isSelectionMode) setGallerySelectedImages([]); // Clear on exit
                                }}
                                style={{ 
                                    padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                    background: isSelectionMode ? '#eff6ff' : 'transparent',
                                    color: isSelectionMode ? '#3b82f6' : '#9ca3af',
                                    display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem', fontWeight: 500
                                }}
                                title="Toggle Selection Mode"
                            >
                                <CheckSquare size={18} />
                                {isSelectionMode && ' Done'}
                            </button>
                            <div style={{ width: '1px', background: '#e5e7eb', margin: '4px 0' }} />
                            <button 
                                onClick={() => setGalleryViewMode('grid')}
                                style={{ 
                                    padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                    background: galleryViewMode === 'grid' ? '#f3f4f6' : 'transparent',
                                    color: galleryViewMode === 'grid' ? '#111827' : '#9ca3af'
                                }}
                            >
                                <Grid size={18} />
                            </button>
                            <button 
                                onClick={() => setGalleryViewMode('list')}
                                style={{ 
                                    padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                    background: galleryViewMode === 'list' ? '#f3f4f6' : 'transparent',
                                    color: galleryViewMode === 'list' ? '#111827' : '#9ca3af'
                                }}
                            >
                                <List size={18} />
                            </button>
                        </div>
                        {isSelectionMode && gallerySelectedImages.length > 0 && (
                            <button 
                                onClick={() => {
                                    if(window.confirm(`Delete ${gallerySelectedImages.length} images?`)) {
                                        // Bulk delete logic
                                        const remaining = galleryImages.filter(img => !gallerySelectedImages.includes(img.id));
                                        setGalleryImages(remaining);
                                        setGallerySelectedImages([]);
                                        setIsSelectionMode(false);
                                        // In real app: call API for each or bulk endpoint
                                    }
                                }}
                                style={{ 
                                    background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '12px',
                                    padding: '0 16px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                                    boxShadow: '0 2px 4px rgba(220, 38, 38, 0.1)', display: 'flex', alignItems: 'center', gap: '8px'
                                }}
                            >
                                <Trash2 size={16} /> Delete ({gallerySelectedImages.length})
                            </button>
                        )}
                    </div>
                </div>

                {galleryViewMode === 'grid' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                        {filteredGallery.map(img => {
                            const isSelected = gallerySelectedImages.includes(img.id);
                            return (
                                <div 
                                    key={img.id} 
                                    onClick={() => {
                                        if (isSelectionMode) {
                                            setGallerySelectedImages(prev => 
                                                isSelected ? prev.filter(id => id !== img.id) : [...prev, img.id]
                                            );
                                        } else {
                                            setPreviewImage(img);
                                        }
                                    }}
                                    style={{ 
                                        ...cardStyle, padding: 0, overflow: 'hidden', position: 'relative', group: 'group', border: isSelected ? '2px solid #3b82f6' : 'none', 
                                        boxShadow: isSelected ? '0 0 0 4px rgba(59, 130, 246, 0.2)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', 
                                        cursor: isSelectionMode ? 'pointer' : 'zoom-in',
                                        transform: isSelected ? 'scale(0.98)' : 'scale(1)',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ height: '220px', width: '100%', position: 'relative' }}>
                                        <img src={img.image_url} alt={img.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <div style={{ 
                                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)',
                                            pointerEvents: 'none'
                                        }} />
                                        {isSelectionMode && (
                                            <div style={{ position: 'absolute', top: '12px', left: '12px', background: isSelected ? '#3b82f6' : 'rgba(255,255,255,0.8)', borderRadius: '4px', padding: '4px' }}>
                                                {isSelected ? <CheckSquare size={20} color="white" /> : <Square size={20} color="#6b7280" />}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <span style={{ 
                                                fontSize: '0.7rem', fontWeight: 700, color: '#E67E22', 
                                                textTransform: 'uppercase', letterSpacing: '0.5px',
                                                padding: '2px 8px', background: '#FFF7ED', borderRadius: '4px'
                                            }}>
                                                {img.category}
                                            </span>
                                            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                                {new Date(img.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 500, color: '#1f2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{img.caption}</div>
                                    </div>
                                    {!isSelectionMode && (
                                        <div style={{ 
                                            position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px',
                                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                                        }} onClick={e => e.stopPropagation()}>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(img.image_url);
                                                    alert('Link copied!');
                                                }}
                                                style={{
                                                     background: 'white', border: 'none', borderRadius: '6px', width: '32px', height: '32px', 
                                                     display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', cursor: 'pointer'
                                                }}
                                                title="Copy Link"
                                            >
                                                <Link size={14} />
                                            </button>
                                            <a 
                                                href={img.image_url} 
                                                download 
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                     background: 'white', border: 'none', borderRadius: '6px', width: '32px', height: '32px', 
                                                     display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', cursor: 'pointer'
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                                title="Download"
                                            >
                                                <Download size={14} />
                                            </a>
                                            <button 
                                                onClick={() => handleEditGalleryImage(img)}
                                                style={{ 
                                                    background: 'white', border: 'none', borderRadius: '6px', width: '32px', height: '32px', 
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', cursor: 'pointer',
                                                    transition: 'transform 0.1s'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteGalleryImage(img.id)}
                                                style={{ 
                                                    background: 'white', border: 'none', borderRadius: '6px', width: '32px', height: '32px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', cursor: 'pointer',
                                                    transition: 'transform 0.1s'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                        {filteredGallery.map(img => {
                            const isSelected = gallerySelectedImages.includes(img.id);
                            return (
                                <div 
                                    key={img.id} 
                                    onClick={() => {
                                        if (isSelectionMode) {
                                            setGallerySelectedImages(prev => 
                                                isSelected ? prev.filter(id => id !== img.id) : [...prev, img.id]
                                            );
                                        } else {
                                            setPreviewImage(img);
                                        }
                                    }}
                                    style={{ 
                                        display: 'flex', alignItems: 'center', gap: '16px', 
                                        background: isSelected ? '#eff6ff' : 'white', 
                                        padding: '12px', borderRadius: '12px', 
                                        boxShadow: isSelected ? 'inset 0 0 0 2px #3b82f6' : '0 1px 3px rgba(0,0,0,0.05)', 
                                        border: isSelected ? '1px solid #3b82f6' : '1px solid #e5e7eb',
                                        cursor: isSelectionMode ? 'pointer' : 'zoom-in', transition: 'all 0.1s'
                                    }}
                                    onMouseOver={e => !isSelected && (e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)')}
                                    onMouseOut={e => !isSelected && (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)')}
                                >
                                    {isSelectionMode && (
                                        <div style={{ padding: '0 8px' }}>
                                            {isSelected ? <CheckSquare size={20} color="#3b82f6" /> : <Square size={20} color="#9ca3af" />}
                                        </div>
                                    )}
                                    <img src={img.image_url} alt={img.caption} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 600, color: '#1f2937' }}>{img.caption}</h4>
                                        <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', color: '#6b7280' }}>
                                            <span style={{ 
                                                color: '#E67E22', background: '#FFF7ED', padding: '2px 8px', borderRadius: '4px', fontWeight: 600
                                            }}>{img.category}</span>
                                            <span>•</span>
                                            <span>{new Date(img.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    {!isSelectionMode && (
                                        <div style={{ display: 'flex', gap: '8px' }} onClick={e => e.stopPropagation()}>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(img.image_url);
                                                    alert('Link copied!');
                                                }}
                                                style={{
                                                     padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb', 
                                                     background: 'white', color: '#6b7280', cursor: 'pointer',
                                                     display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}
                                                title="Copy Link"
                                            >
                                                <Link size={16} />
                                            </button>
                                            <a 
                                                href={img.image_url} 
                                                download 
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                     padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb', 
                                                     background: 'white', color: '#6b7280', cursor: 'pointer',
                                                     display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                                title="Download"
                                            >
                                                <Download size={16} />
                                            </a>
                                            <button 
                                                onClick={() => handleEditGalleryImage(img)}
                                                style={{ 
                                                    padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb', 
                                                    background: 'white', color: '#3b82f6', cursor: 'pointer'
                                                }}
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteGalleryImage(img.id)}
                                                style={{ 
                                                    padding: '8px', borderRadius: '8px', border: '1px solid #fee2e2', 
                                                    background: '#fef2f2', color: '#ef4444', cursor: 'pointer'
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
                {filteredGallery.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '48px', color: '#9ca3af', background: '#f9fafb', borderRadius: '12px', border: '1px dashed #d1d5db' }}>
                        <Image size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                        <p>No images found matching your search.</p>
                    </div>
                )}
            </div>
        );
    };

    const renderVolunteers = () => (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2C3E50', margin: 0 }}>Volunteer Applications</h2>
                <button style={actionButtonStyle} onClick={() => downloadCSV(volunteers, 'volunteers.csv')}><Download size={16} /> Export CSV</button>
            </div>
            <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(249, 250, 251, 0.5)' }}>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>Name</th>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>Skills</th>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>Availability</th>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>Status</th>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {volunteers.map((v, i) => (
                            <tr key={v.id} style={{ borderBottom: i < volunteers.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                                <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: '#2C3E50' }}>
                                    <div style={{ fontWeight: 500 }}>{v.full_name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{v.email}</div>
                                </td>
                                <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: '#6b7280' }}>{v.skills}</td>
                                <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: '#6b7280' }}>{v.availability}</td>
                                <td style={{ padding: '12px 16px' }}>
                                    <span style={{ 
                                        padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500,
                                        background: v.status === 'approved' ? '#ecfdf5' : v.status === 'rejected' ? '#fef2f2' : '#fff7ed',
                                        color: v.status === 'approved' ? '#059669' : v.status === 'rejected' ? '#dc2626' : '#d97706'
                                    }}>
                                        {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                                    </span>
                                </td>
                                <td style={{ padding: '12px 16px' }}>
                                    <button onClick={() => handleViewVolunteer(v)} style={{ padding: '6px 12px', fontSize: '0.75rem', fontWeight: 500, color: '#6b7280', background: 'rgba(249, 250, 251, 0.8)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderEvents = () => (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2C3E50', margin: 0 }}>Events</h2>
                <button style={primaryButtonStyle} onClick={handleCreateEvent}><Plus size={16} /> New Event</button>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid #e5e7eb', paddingBottom: '0' }}>
                {['events', 'registrations', 'attendance', 'verify'].map(tab => (
                    <button key={tab} onClick={() => setEventsSubTab(tab)} style={{
                        padding: '8px 12px', fontSize: '0.875rem', fontWeight: 500,
                        color: eventsSubTab === tab ? '#E67E22' : '#6b7280', background: 'transparent', border: 'none',
                        borderBottom: eventsSubTab === tab ? '2px solid #E67E22' : '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s', marginBottom: '-1px', textTransform: 'capitalize'
                    }}>{tab}</button>
                ))}
            </div>
            {eventsSubTab === 'events' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                    {events.map(event => <EventCard key={event.id} event={event} onView={() => handleViewEvent(event)} onEdit={() => handleEditEvent(event)} onDelete={() => handleDeleteEvent(event.id)} />)}
                </div>
            )}
            {eventsSubTab === 'registrations' && <RegistrationsTable data={eventRegistrations} />}
            {eventsSubTab === 'attendance' && <ComingSoon title="Event Attendance" />}
            {eventsSubTab === 'verify' && (
                <div style={{ background: 'white', padding: '40px', borderRadius: '12px', border: '1px solid #e5e7eb', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ width: '64px', height: '64px', background: '#FFF3E0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#E67E22' }}><CheckCircle size={32} /></div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111', marginBottom: '12px' }}>Verify Ticket</h3>
                    <p style={{ color: '#666', marginBottom: '32px' }}>Enter the ticket code provided by the attendee to verify their registration.</p>
                    <div style={{ display: 'flex', gap: '12px', maxWidth: '400px', margin: '0 auto' }}>
                        <input type="text" placeholder="Enter Ticket Code" value={verifyCode} onChange={(e) => { setVerifyCode(e.target.value); setVerificationResult(null); setVerifiedUser(null); }} style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '1rem', outline: 'none' }} />
                        <button onClick={() => {
                            const foundUser = eventRegistrations.find(reg => reg.code === verifyCode.toUpperCase());
                            if (foundUser) {
                                setVerificationResult('success'); setVerifiedUser(foundUser);
                                setEventRegistrations(eventRegistrations.map(reg => reg.code === foundUser.code ? { ...reg, status: 'confirmed' } : reg));
                            } else { setVerificationResult('error'); setVerifiedUser(null); }
                        }} style={{ padding: '12px 24px', background: '#2C3E50', color: 'white', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Verify</button>
                    </div>
                    {verificationResult === 'success' && verifiedUser && (
                        <div style={{ marginTop: '24px', padding: '20px', background: '#ECFDF5', borderRadius: '12px', border: '1px solid #10B981', color: '#065F46', textAlign: 'left' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 700, fontSize: '1.1rem', marginBottom: '16px', color: '#047857' }}><CheckCircle size={24} /> Verified</div>
                            <div style={{ background: 'white', padding: '16px', borderRadius: '8px' }}>
                                <div><strong>Name:</strong> {verifiedUser.attendee}</div>
                                <div><strong>Email:</strong> {verifiedUser.email}</div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    const renderDonors = () => (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2C3E50', margin: 0 }}>Donors</h2>
                <button style={actionButtonStyle}><Download size={16} /> Export CSV</button>
            </div>
            <div style={{ display: 'grid', gap: '16px' }}>
                {donors.map(donor => <DonorCard key={donor.id} donor={donor} onView={() => handleViewDonor(donor)} />)}
            </div>
        </div>
    );

    const renderMessages = () => (
        <div>
             <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid #e5e7eb', paddingBottom: '0' }}>
                {['inbox', 'campaigns'].map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setMessagesSubTab(tab)} 
                        style={{
                            padding: '8px 16px', 
                            fontSize: '0.875rem', 
                            fontWeight: 500,
                            color: messagesSubTab === tab ? '#E67E22' : '#6b7280', 
                            background: 'transparent', 
                            border: 'none',
                            borderBottom: messagesSubTab === tab ? '2px solid #E67E22' : '2px solid transparent', 
                            cursor: 'pointer', 
                            transition: 'all 0.2s', 
                            marginBottom: '-1px', 
                            textTransform: 'capitalize'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {messagesSubTab === 'inbox' && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2C3E50', margin: 0 }}>Messages</h2>
                    </div>
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {messages.length > 0 ? (
                             messages.map(message => <MessageCard key={message.id} message={message} onView={() => handleViewMessage(message)} />)
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>No messages found.</div>
                        )}
                    </div>
                </>
            )}

            {messagesSubTab === 'campaigns' && renderNewsletter()}
        </div>
    );


    const handleSendNewsletter = async (e) => {
        e.preventDefault();
        setIsSendingNewsletter(true);
        try {
             await sendEmail({
                 to: targetAudience === 'all' ? 'all-subscribers@charizomai.com' : `${targetAudience}@charizomai.com`,
                 subject: newsletterSubject,
                 html: newsletterContent,
                 type: 'newsletter'
             });
             
            // Add or Update database
            const payload = {
                 subject: newsletterSubject,
                 content: newsletterContent,
                 audience: targetAudience,
                 status: 'sent',
                 sent_at: new Date().toISOString(),
             };
             
             let data, error;
             
             if (editingCampaignId) {
                  // If we were editing a draft and now sending it, update the record
                  ({ data, error } = await supabase
                    .from('campaigns')
                    .update(payload)
                    .eq('id', editingCampaignId)
                    .select());
             } else {
                  // New campaign
                  ({ data, error } = await supabase
                    .from('campaigns') 
                    .insert([{ ...payload, opens: 0, clicks: 0 }])
                    .select());
             }

             if (error) throw error;
             
             if(data) {
                if (editingCampaignId) {
                    setCampaigns(campaigns.map(c => c.id === editingCampaignId ? data[0] : c));
                } else {
                    setCampaigns([data[0], ...campaigns]);
                }
             }

             showNotification('Campaign sent successfully!');
             setNewsletterSubject('');
             setNewsletterContent('');
             setEditingCampaignId(null);
             setIsComposeOpen(false);
             logAction('Sent Campaign', { subject: newsletterSubject });
        } catch (err) {
            console.error(err);
            showNotification('Failed to send campaign', 'error');
        } finally {
            setIsSendingNewsletter(false);
        }
    };

    const handleSaveDraft = async () => {
        if (!newsletterSubject) {
            alert('Please enter a subject line to save draft.');
            return;
        }
        try {
            const payload = {
                 subject: newsletterSubject,
                 content: newsletterContent,
                 audience: targetAudience,
                 status: 'draft',
                 updated_at: new Date().toISOString()
            };

            let data, error;
            if (editingCampaignId) {
                // Update existing
                ({ data, error } = await supabase
                    .from('campaigns')
                    .update(payload)
                    .eq('id', editingCampaignId)
                    .select());
            } else {
                // Insert new
                ({ data, error } = await supabase
                    .from('campaigns')
                    .insert([{ 
                        ...payload, 
                        sent_at: null,
                        opens: 0, 
                        clicks: 0
                    }])
                    .select());
            }

             if (error) throw error;
             
             if(data) {
                if (editingCampaignId) {
                    setCampaigns(campaigns.map(c => c.id === editingCampaignId ? data[0] : c));
                } else {
                    setCampaigns([data[0], ...campaigns]);
                }
             }
             showNotification('Draft saved!');
             setNewsletterSubject('');
             setNewsletterContent('');
             setEditingCampaignId(null);
             setIsComposeOpen(false);
        } catch (err) {
            console.error(err);
            showNotification('Failed to save draft', 'error');
        }
    };

    const handleDeleteCampaign = async (id) => {
        if(!window.confirm('Are you sure you want to delete this campaign?')) return;
        try {
            const { error } = await supabase.from('campaigns').delete().eq('id', id);
            if(error) throw error;
            setCampaigns(campaigns.filter(c => c.id !== id));
            showNotification('Campaign deleted.');
        } catch(err) {
             console.error(err);
             showNotification('Failed to delete campaign', 'error');
        }
    };

    const handleEditCampaign = (campaign) => {
        setNewsletterSubject(campaign.subject);
        setNewsletterContent(campaign.content || '');
        setTargetAudience(campaign.audience);
        if (campaign.status === 'draft') {
             setEditingCampaignId(campaign.id);
        } else {
             setEditingCampaignId(null); // Sent campaigns are duplicated, not edited
        }
        setIsComposeOpen(true);
    };

    const renderNewsletter = () => (
        <div>
             {/* Header Section */}
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>Email Campaigns</h2>
                    <p style={{ color: '#6b7280', margin: '4px 0 0 0', fontSize: '0.925rem' }}>Manage newsletters, announcements, and automated emails.</p>
                </div>
                {!isComposeOpen && (
                    <button 
                        onClick={() => setIsComposeOpen(true)}
                        style={{ ...primaryButtonStyle, display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Plus size={18} /> New Campaign
                    </button>
                )}
            </div>

            {!isComposeOpen ? (
                /* --- CAMPAIGN LIST VIEW --- */
                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    {/* Tabs */}
                    <div style={{  borderBottom: '1px solid #e5e7eb', padding: '0 24px', display: 'flex', gap: '24px' }}>
                         {['all', 'sent', 'drafts'].map(tab => (
                             <button
                                key={tab}
                                onClick={() => setNewsletterTab(tab)}
                                style={{
                                    padding: '16px 0',
                                    background: 'none',
                                    border: 'none',
                                    borderBottom: newsletterTab === tab ? '2px solid #2563eb' : '2px solid transparent',
                                    color: newsletterTab === tab ? '#2563eb' : '#6b7280',
                                    fontWeight: newsletterTab === tab ? 600 : 500,
                                    fontSize: '0.925rem',
                                    cursor: 'pointer',
                                    textTransform: 'capitalize'
                                }}
                             >
                                 {tab} ({campaigns.filter(c => tab === 'all' ? true : tab === 'sent' ? c.status === 'sent' : c.status === 'draft').length})
                             </button>
                         ))}
                    </div>

                    {/* Table Header */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 2fr) 120px 150px 100px 100px 100px', padding: '16px 24px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>
                        <div>Campaign Name</div>
                        <div>Status</div>
                        <div>Recipients</div>
                        <div style={{ textAlign: 'right' }}>Opens</div>
                        <div style={{ textAlign: 'right' }}>Clicks</div>
                        <div style={{ textAlign: 'right' }}>Actions</div>
                    </div>

                    {/* Table Body */}
                    <div>
                        {campaigns
                            .filter(c => newsletterTab === 'all' ? true : newsletterTab === 'sent' ? c.status === 'sent' : c.status === 'draft')
                            .map(campaign => (
                            <div key={campaign.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 2fr) 120px 150px 100px 100px 100px', padding: '20px 24px', borderBottom: '1px solid #f3f4f6', alignItems: 'center', transition: 'background 0.2s', ':hover': { background: '#f9fafb' } }}>
                                <div>
                                    <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.925rem' }}>{campaign.subject}</div>
                                    <div style={{ fontSize: '0.8125rem', color: '#9ca3af', marginTop: '2px' }}>
                                        {campaign.sent_at ? `Sent on ${new Date(campaign.sent_at).toLocaleDateString()}` : 'Last edited 2 days ago'}
                                    </div>
                                </div>
                                <div>
                                    <span style={{ 
                                        display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600,
                                        background: campaign.status === 'sent' ? '#ecfdf5' : '#f3f4f6',
                                        color: campaign.status === 'sent' ? '#047857' : '#4b5563',
                                        textTransform: 'capitalize'
                                    }}>
                                        {campaign.status === 'sent' && <CheckCircle size={12} style={{ marginRight: '4px' }} />}
                                        {campaign.status}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>{campaign.audience}</div>
                                <div style={{ textAlign: 'right', fontSize: '0.875rem', color: '#111827', fontWeight: 500 }}>{campaign.opens > 0 ? campaign.opens.toLocaleString() : '-'}</div>
                                <div style={{ textAlign: 'right', fontSize: '0.875rem', color: '#111827', fontWeight: 500 }}>{campaign.clicks > 0 ? campaign.clicks.toLocaleString() : '-'}</div>
                                <div style={{ textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                    <button 
                                        onClick={() => handleEditCampaign(campaign)}
                                        title="Duplicate/Edit"
                                        style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', transition: 'color 0.2s', ':hover': { color: '#2563eb' } }}
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteCampaign(campaign.id)}
                                        title="Delete"
                                        style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', transition: 'color 0.2s', ':hover': { color: '#dc2626' } }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                /* --- COMPOSE VIEW --- */
                 <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '12px' }}>
                         <button onClick={() => setIsComposeOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 0 }}><ArrowLeft size={20} /></button>
                         <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: 0 }}>New Campaign</h3>
                    </div>
                    
                    <form onSubmit={handleSendNewsletter} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                            <div>
                                <label style={labelStyle}>Subject Line</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newsletterSubject} 
                                    onChange={e => setNewsletterSubject(e.target.value)}
                                    placeholder="Enter a compelling subject..."
                                    style={inputStyle} 
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Audience</label>
                                <select 
                                    value={targetAudience} 
                                    onChange={(e) => setTargetAudience(e.target.value)} 
                                    style={inputStyle}
                                >
                                    <option value="all">All Subscribers (1,248)</option>
                                    <option value="donors">Donors Only (850)</option>
                                    <option value="volunteers">Volunteers Only (120)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Content</label>
                            <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', overflow: 'hidden' }}>
                                {/* Mock Toolbar */}
                                <div style={{ background: '#f9fafb', padding: '8px 12px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '8px' }}>
                                    {['Bold', 'Italic', 'Link', 'Image', 'List'].map(tool => (
                                        <div key={tool} style={{ width: '28px', height: '28px', borderRadius: '4px', background: '#fff', border: '1px solid #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#4b5563' }}>
                                            {tool[0]}
                                        </div>
                                    ))}
                                </div>
                                <textarea 
                                    required
                                    rows={15}
                                    value={newsletterContent}
                                    onChange={e => setNewsletterContent(e.target.value)}
                                    placeholder="Start writing your campaign..."
                                    style={{ ...inputStyle, border: 'none', borderRadius: 0, resize: 'vertical', fontFamily: 'monospace', padding: '16px', lineHeight: '1.6' }} 
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #e5e7eb', gap: '12px' }}>
                            <button 
                                type="button"
                                onClick={() => handleSaveDraft()}
                                style={{ ...actionButtonStyle, background: '#fff', border: '1px solid #d1d5db' }}
                            >
                                Save as Draft
                            </button>
                            <button 
                                type="submit" 
                                disabled={isSendingNewsletter}
                                style={{ ...primaryButtonStyle, opacity: isSendingNewsletter ? 0.7 : 1 }}
                            >
                                {isSendingNewsletter ? 'Sending...' : 'Send Now'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );

    const handleAdminReply = async (e) => {
        e.preventDefault();
        if (!selectedChatId || !adminReplyText.trim()) return;

        try {
            // Fetch latest content to avoid race conditions
            const { data: currentData, error: fetchError } = await supabase
                .from('contact_messages')
                .select('message')
                .eq('id', selectedChatId)
                .single();
            
            if (fetchError) throw fetchError;

            const currentMessage = currentData?.message || '';
            
            // Derive Agent Name from email (since we don't have a name field yet)
            let agentName = 'Agent';
            if (currentUserProfile && currentUserProfile.email) {
                const namePart = currentUserProfile.email.split('@')[0];
                agentName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
            }

            const prefix = isInternalNote ? '[Internal]: ' : `Admin <${agentName}>: `;
            const newHistory = `${currentMessage}\n${prefix}${adminReplyText}`;
            
            const { error: updateError } = await supabase
                .from('contact_messages')
                .update({ message: newHistory })
                .eq('id', selectedChatId);
            
            if (updateError) throw updateError;
            
            setAdminReplyText('');
            // Optimistic update
            const updatedChats = liveChats.map(c => c.id === selectedChatId ? { ...c, message: newHistory } : c);
            setLiveChats(updatedChats);
            // setMessages handled by subscription effectively, but for immediate feel:
            // setMessages(prev => prev.map(m => m.id === selectedChatId ? { ...m, message: newHistory } : m));
            showNotification('Reply sent');

            // Reset internal note status after sending
            if (isInternalNote) setIsInternalNote(false); 

        } catch (err) {
            console.error(err);
            showNotification('Failed to send reply', 'error');
        }
    };

    const handleExportChat = (chat) => {
        if (!chat) return;
        const content = chat.message || '';
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-transcript-${chat.name.replace(/\s+/g, '-').toLowerCase()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification('Transcript downloaded');
    };

    const handleMarkResolved = async (chatId) => {
        if (!chatId) return;
        try {
            const chat = liveChats.find(c => c.id === chatId);
            if (!chat) return;

            const newHistory = `${chat.message}\n[System]: This conversation has been marked as resolved.`;
            const { error } = await supabase.from('contact_messages')
                .update({ message: newHistory })
                .eq('id', chatId);
            
            if (error) throw error;
            
            // Optimistic update
            const updatedChats = liveChats.map(c => c.id === chatId ? { ...c, message: newHistory } : c);
            setLiveChats(updatedChats);
            setMessages(prev => prev.map(m => m.id === chatId ? { ...m, message: newHistory } : m));
            showNotification('Chat marked as resolved');
        } catch (err) {
            console.error('Error marking resolved:', err);
            showNotification('Failed to update status', 'error');
        }
    };

    const handleJoinChat = async (chatId) => {
        if (!chatId) return;
        try {
            // Fetch latest content to avoid race conditions
            const { data: currentData, error: fetchError } = await supabase
                .from('contact_messages')
                .select('message')
                .eq('id', chatId)
                .single();
            
            if (fetchError) throw fetchError;

            const currentMessage = currentData?.message || '';
            
            // Check if already joined to avoid duplicate messages
            if (currentMessage.endsWith('[System]: An agent has joined the chat.')) {
                showNotification('You have already joined this chat');
                return;
            }

            const newHistory = `${currentMessage}\n[System]: An agent has joined the chat.`;
            
            const { error: updateError } = await supabase
                .from('contact_messages')
                .update({ message: newHistory })
                .eq('id', chatId);
            
            if (updateError) throw updateError;
            
            // Optimistic update for UI responsiveness
            const updatedChats = liveChats.map(c => c.id === chatId ? { ...c, message: newHistory } : c);
            setLiveChats(updatedChats);
            setMessages(prev => prev.map(m => m.id === chatId ? { ...m, message: newHistory } : m));
            showNotification('Joined chat successfully');
        } catch (err) {
            console.error('Error joining chat:', err);
            showNotification(`Failed to join chat: ${err.message}`, 'error');
        }
    };



    // --- Live Chat Helpers (Hoisted) ---
    const getChatMetadata = (chat) => {
         if (!chat || !chat.message) return {};
         const lines = chat.message.split('\n');
         const metaLine = lines.find(l => l.startsWith('[Metadata]:'));
         if (metaLine) {
             try {
                 return JSON.parse(metaLine.replace('[Metadata]:', '').trim());
             } catch (e) { return {}; }
         }
         return {};
    };

    const updateChatMetadata = async (chatId, newMeta) => {
        try {
            const chat = liveChats.find(c => c.id === chatId);
            if (!chat) return;
            
            // Parse existing metadata from message string
            const lines = (chat.message || '').split('\n');
            let existingMeta = {};
            const metaLineIndex = lines.findIndex(l => l.startsWith('[Metadata]:'));
            
            if (metaLineIndex !== -1) {
                try {
                    existingMeta = JSON.parse(lines[metaLineIndex].replace('[Metadata]:', '').trim());
                } catch (e) {}
            }

            const updatedMeta = { ...existingMeta, ...newMeta };
            const metaString = `[Metadata]: ${JSON.stringify(updatedMeta)}`;
            
            let newHistory = '';
            if (metaLineIndex !== -1) {
                lines[metaLineIndex] = metaString;
                newHistory = lines.join('\n');
            } else {
                newHistory = `${chat.message}\n${metaString}`;
            }

            // Optimistic Update
            setLiveChats(prev => prev.map(c => c.id === chatId ? { ...c, message: newHistory } : c));
            
            await supabase.from('contact_messages').update({ message: newHistory }).eq('id', chatId);
        } catch (error) {
            console.error('Error updating chat metadata:', error);
        }
    };

    const toggleStar = (e, chatId) => {
        e.stopPropagation();
        const chat = liveChats.find(c => c.id === chatId);
        if (!chat) return;
        
        const meta = getChatMetadata(chat);
        const isStarred = !!meta.isStarred;
        
        updateChatMetadata(chatId, { isStarred: !isStarred });
    };

    const addTag = (tag) => {
        if (!selectedChatId || !tag.trim()) return;
        const chat = liveChats.find(c => c.id === selectedChatId);
        if (!chat) return;
        
        const meta = getChatMetadata(chat);
        const currentTags = meta.tags || [];
        
        if (!currentTags.includes(tag)) {
            updateChatMetadata(selectedChatId, { tags: [...currentTags, tag] });
        }
    };

    const removeTag = (tag) => {
         if (!selectedChatId) return;
         const chat = liveChats.find(c => c.id === selectedChatId);
         if (!chat) return;
         
         const meta = getChatMetadata(chat);
         const currentTags = meta.tags || [];
         
         updateChatMetadata(selectedChatId, { tags: currentTags.filter(t => t !== tag) });
    };

    const handleDeleteChat = async (chatId) => {
        if (!window.confirm("Are you sure you want to delete this conversation? This action cannot be undone.")) return;
        try {
            await supabase.from('contact_messages').delete().eq('id', chatId);
            setLiveChats(prev => prev.filter(c => c.id !== chatId));
            if (selectedChatId === chatId) setSelectedChatId(null);
            showNotification("Conversation deleted", "success");
        } catch (error) {
            showNotification("Failed to delete chat", "error");
        }
    };

    const handleBlockUser = async (chatId) => {
        if (!window.confirm("Are you sure you want to block this user? They will not be able to send further messages.")) return;
        updateChatMetadata(chatId, { blocked: true });
        showNotification("User blocked");
    };

    const handleQuickReply = (text) => {
        setAdminReplyText(text);
        setShowQuickReplies(false);
    };

    const handleAddQuickReply = () => {
        const text = prompt("Enter new quick reply:");
        if (text && text.trim()) {
            setQuickRepliesList(prev => [...prev, text.trim()]);
            // In a real app, persist this to DB/LocalStorage
        }
    };

    const handleDeleteQuickReply = (e, index) => {
        e.stopPropagation();
        if (window.confirm("Remove this quick reply?")) {
            setQuickRepliesList(prev => prev.filter((_, i) => i !== index));
        }
    };



    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Simulate upload
            const attachmentMsg = `[Attachment]: ${file.name} (Simulated)`;
            setAdminReplyText(attachmentMsg);
        }
    };
    
    // Feature: Quick Replies Data


    // Auto-Mark as Read Effect (Hoisted)
    useEffect(() => {
        if (selectedChatId) {
            const chat = liveChats.find(c => c.id === selectedChatId);
            if (chat) {
                 const lines = (chat.message || '').split('\n');
                 const lastLine = lines[lines.length - 1];
                 updateChatMetadata(selectedChatId, { last_read_admin: Date.now() });
            }
        }
    }, [selectedChatId, liveChats.length]);


    // --- Emoji Picker Helper ---
    const EmojiPicker = ({ onSelect, onClose }) => {
        const emojis = ["👍", "👋", "🎉", "❤️", "😂", "😮", "😢", "🔥", "✨", "🤝", "✅", "❌", "📅", "📍"];
        return (
            <div style={{
                position: 'absolute',
                bottom: '60px',
                right: '20px',
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '12px',
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                zIndex: 100
            }}>
                {emojis.map(emoji => (
                    <button 
                        key={emoji} 
                        onClick={() => { onSelect(emoji); onClose(); }}
                        style={{ border: 'none', background: 'transparent', fontSize: '1.2rem', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
                        onMouseEnter={e => e.target.style.background = '#f3f4f6'}
                        onMouseLeave={e => e.target.style.background = 'transparent'}
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        );
    };

    const renderLiveChat = () => {
        // Feature: Filter Logic
        const isResolved = (chat) => chat.message && chat.message.includes('[System]: This conversation has been marked as resolved');
        
        const filteredChats = liveChats.filter(chat => {
            const name = chat.name || '';
            const email = chat.email || '';
            const query = (chatSearchQuery || '').toLowerCase();
            const meta = getChatMetadata(chat);
            
            const matchesSearch = name.toLowerCase().includes(query) || 
                                  email.toLowerCase().includes(query);
            
            let matchesTab = false;
            if (activeChatTab === 'open') matchesTab = !isResolved(chat);
            else if (activeChatTab === 'resolved') matchesTab = isResolved(chat);
            else if (activeChatTab === 'mine') {
                 // Check assignment
                 const myEmail = currentUserProfile ? currentUserProfile.email : '';
                 matchesTab = !isResolved(chat) && meta.assigned_to === myEmail;
            }
            
            return matchesSearch && matchesTab;
        });


        const selectedChat = liveChats.find(c => c.id === selectedChatId);

        // Assignment Helpers
        const handleAssignChat = (chatId, email = null) => {
            const targetEmail = email || (currentUserProfile ? currentUserProfile.email : null);
            if (!targetEmail) return;
            updateChatMetadata(chatId, { assigned_to: targetEmail });
            showNotification(email ? `Chat assigned to ${email}` : "Chat assigned to you");
            setShowAssignDropdown(false);
        };

        const handleUnassignChat = (chatId) => {
             updateChatMetadata(chatId, { assigned_to: null });
             showNotification("Chat unassigned");
        };




        
        return (
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', height: 'calc(100vh - 120px)', margin: '-24px', background: '#fff', overflow: 'hidden', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
                {/* SIDEBAR: CONVERSATIONS */}
                <div style={{ borderRight: '1px solid #f3f4f6', background: '#fff', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
                        {/* Tab Switcher */}
                        <div style={{ display: 'flex', background: '#f3f4f6', padding: '4px', borderRadius: '10px', marginBottom: '16px' }}>
                            {['open', 'mine', 'resolved'].map(tab => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveChatTab(tab)}
                                    style={{ 
                                        flex: 1, 
                                        padding: '6px', 
                                        borderRadius: '8px', 
                                        border: 'none', 
                                        background: activeChatTab === tab ? '#fff' : 'transparent', 
                                        boxShadow: activeChatTab === tab ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                                        fontWeight: 600, 
                                        fontSize: '0.8rem', 
                                        color: activeChatTab === tab ? '#111827' : '#6b7280',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        textTransform: 'capitalize'
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                         <div style={{ position: 'relative' }}>
                            <Search size={14} style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                            <input 
                                type="text" 
                                placeholder="Search messages" 
                                value={chatSearchQuery}
                                onChange={e => setChatSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px 8px 32px',
                                    borderRadius: '8px',
                                    border: '1px solid #f3f4f6',
                                    fontSize: '0.85rem',
                                    outline: 'none',
                                    background: '#f9fafb',
                                    transition: 'all 0.2s',
                                    color: '#111827'
                                }}
                                onFocus={e => { e.target.style.background = '#fff'; e.target.style.borderColor = '#e5e7eb'; }}
                                onBlur={e => { e.target.style.background = '#f9fafb'; e.target.style.borderColor = '#f3f4f6'; }}
                            />
                        </div>
                    </div>
                    
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {filteredChats.map(chat => {
                            const isSelected = selectedChatId === chat.id;
                            const isStarred = !!getChatMetadata(chat).isStarred;
                            const lastMessageLines = chat.message ? chat.message.split('\n').filter(l => l.trim()) : [];
                            const lastVisualMsg = lastMessageLines.reverse().find(l => !l.startsWith('[System]:') && !l.startsWith('[Metadata]:')) || 'New conversation';
                            const cleanLastMsg = lastVisualMsg.replace(/^(Bot:|User:|Admin:|\[System\]:|\[Internal\]:)/, '').trim();

                            // Unread Logic
                            const meta = getChatMetadata(chat);
                            const lastRead = meta.last_read_admin || 0;
                            // Check if last message is from user
                            const isLastMsgUser = lastVisualMsg.startsWith('User:') || (!lastVisualMsg.startsWith('Admin') && !lastVisualMsg.startsWith('Bot') && !lastVisualMsg.startsWith('[System]')); 
                            
                            // It's unread if last msg is from user AND (never read OR last message time > last read time)
                            // Since we don't have per-message timestamps easily, we use chat.updated_at if available, or rely on read timestamp vs now logic (imperfect).
                            // A solid heuristic: If last sender is User, assume unread until Admin opens it (which updates last_read_admin).
                            // But if Admin opened it, last_read_admin becomes NOW. 
                            // So if Last Sender is User AND last_read_admin was essentially "before now" (meaning we haven't just updated it).
                            // Let's use: If (Last Sender == User) AND (last_read_admin < chat.updated_at)
                            // If updated_at is missing, we default to showing unread if User sent last.
                            
                            const chatUpdatedAt = chat.updated_at ? new Date(chat.updated_at).getTime() : Date.now();
                            // If existing unread logic holds.
                            const isUnread = isLastMsgUser && (lastRead < chatUpdatedAt - 2000); // 2s buffer for update latency

                            return (
                                <div 
                                    key={chat.id}
                                    onClick={() => setSelectedChatId(chat.id)}
                                    style={{ 
                                        padding: '12px 20px', 
                                        cursor: 'pointer',
                                        background: isSelected ? '#f5f5f5' : '#fff',
                                        transition: 'background 0.1s ease',
                                        display: 'flex',
                                        gap: '10px',
                                        alignItems: 'center',
                                        opacity: isResolved(chat) ? 0.6 : 1,
                                        position: 'relative'
                                    }}
                                >
                                    <div style={{ position: 'relative', flexShrink: 0 }}>
                                        <div style={{ 
                                            width: '36px', 
                                            height: '36px', 
                                            borderRadius: '50%', 
                                            background: isSelected ? '#fff' : (isResolved(chat) ? '#e5e7eb' : '#f3f4f6'), 
                                            color: '#6b7280',
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            fontWeight: 600,
                                            fontSize: '0.85rem',
                                            border: '1px solid #f3f4f6',
                                            position: 'relative'
                                        }}>
                                            {(chat.name || 'Visitor').charAt(0).toUpperCase()}
                                            {/* Assignment Dot */}
                                            {meta.assigned_to && (
                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: -2,
                                                    right: -2,
                                                    width: '12px',
                                                    height: '12px',
                                                    borderRadius: '50%',
                                                    background: '#2563eb', // Blue for assigned
                                                    border: '2px solid #fff',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    <span style={{ fontSize: '6px', color: 'white' }}>A</span>
                                                </div>
                                            )}
                                        </div>
                                        {isUnread && (
                                            <div style={{
                                                position: 'absolute',
                                                top: -2,
                                                right: -2,
                                                width: '10px',
                                                height: '10px',
                                                borderRadius: '50%',
                                                background: '#ef4444',
                                                border: '2px solid #fff'
                                            }} />
                                        )}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', alignItems: 'baseline' }}>
                                            <span style={{ 
                                                fontWeight: isUnread ? 700 : 600, 
                                                fontSize: '0.85rem', 
                                                color: '#111827', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '4px' 
                                            }}>
                                                {chat.name}
                                                {isStarred && <span style={{ fontSize: '0.7rem' }}>⭐</span>}
                                            </span>
                                            <span style={{ fontSize: '0.7rem', color: isUnread ? '#ef4444' : '#9ca3af', fontWeight: isUnread ? 600 : 400 }}>
                                                {new Date(chat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div style={{ 
                                            fontSize: '0.8rem', 
                                            color: isSelected ? '#111827' : '#6b7280', 
                                            whiteSpace: 'nowrap', 
                                            overflow: 'hidden', 
                                            textOverflow: 'ellipsis',
                                            opacity: isSelected ? 0.9 : 0.7,
                                            fontWeight: isUnread ? 600 : 400
                                        }}>
                                            {cleanLastMsg}
                                        </div>
                                    </div>
                                    {/* Star Action */}
                                    <button 
                                        onClick={(e) => toggleStar(e, chat.id)}
                                        style={{ 
                                            position: 'absolute', 
                                            right: '10px', 
                                            top: '50%', 
                                            transform: 'translateY(-50%)', 
                                            background: 'none', 
                                            border: 'none', 
                                            cursor: 'pointer',
                                            opacity: isStarred ? 1 : 0, 
                                            color: isStarred ? '#F59E0B' : '#d1d5db',
                                            transition: 'opacity 0.2s'
                                        }}
                                        className="star-btn"
                                        onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                                        onMouseLeave={(e) => e.currentTarget.style.opacity = isStarred ? 1 : 0}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill={isStarred ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                    </button>
                                </div>
                            )
                        })}
                        {filteredChats.length === 0 && (
                            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9ca3af' }}>
                                <p style={{ fontSize: '0.85rem' }}>No {activeChatTab} chats.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* MAIN CHAT AREA */}
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, background: '#fff', position: 'relative' }}>
                    {selectedChat ? (
                        <>
                            {/* Compact Chat Header */}
                            <div style={{ 
                                padding: '10px 24px', 
                                borderBottom: '1px solid #f3f4f6', 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                background: '#fff',
                                height: '60px',
                                flexShrink: 0
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setShowChatDetails(!showChatDetails)}>
                                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>{selectedChat.name}</span>
                                    <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{selectedChat.email}</span>
                                    <Info size={14} color="#9ca3af" />
                                </div>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                   {/* Assignment Controls */}
                                   {!isResolved(selectedChat) && (
                                   <div style={{ position: 'relative' }}>
                                        <button
                                            onClick={() => setShowAssignDropdown(!showAssignDropdown)}
                                            style={{
                                                fontSize: '0.75rem',
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                background: getChatMetadata(selectedChat).assigned_to ? '#EFF6FF' : '#fff',
                                                color: getChatMetadata(selectedChat).assigned_to ? '#2563eb' : '#4b5563',
                                                border: getChatMetadata(selectedChat).assigned_to ? '1px solid #BFDBFE' : '1px solid #d1d5db',
                                                cursor: 'pointer',
                                                fontWeight: 500,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}
                                        >
                                            <Users size={12} />
                                            {getChatMetadata(selectedChat).assigned_to 
                                                ? (getChatMetadata(selectedChat).assigned_to === currentUserProfile?.email ? 'Assigned to You' : 'Assigned') 
                                                : 'Assign'}
                                            <ChevronDown size={12} />
                                        </button>
                                        
                                        {showAssignDropdown && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '100%',
                                                right: 0,
                                                marginTop: '4px',
                                                background: '#fff',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                width: '200px',
                                                zIndex: 50,
                                                overflow: 'hidden'
                                            }}>
                                                <button
                                                    onClick={() => handleAssignChat(selectedChat.id)}
                                                    style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: '#fff', border: 'none', borderBottom: '1px solid #f3f4f6', cursor: 'pointer', fontSize: '0.8rem', color: '#111827' }}
                                                    onMouseEnter={e => e.target.style.background = '#f9fafb'}
                                                    onMouseLeave={e => e.target.style.background = '#fff'}
                                                >
                                                    Assign to Me
                                                </button>
                                                {appUsers.filter(u => u.email !== currentUserProfile?.email).map(user => (
                                                    <button
                                                        key={user.id}
                                                        onClick={() => handleAssignChat(selectedChat.id, user.email)}
                                                        style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: '#fff', border: 'none', borderBottom: '1px solid #f3f4f6', cursor: 'pointer', fontSize: '0.8rem', color: '#374151', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                                        onMouseEnter={e => e.target.style.background = '#f9fafb'}
                                                        onMouseLeave={e => e.target.style.background = '#fff'}
                                                        title={user.email}
                                                    >
                                                        {user.email}
                                                    </button>
                                                ))}
                                                {getChatMetadata(selectedChat).assigned_to && (
                                                    <button
                                                        onClick={() => { handleUnassignChat(selectedChat.id); setShowAssignDropdown(false); }}
                                                        style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: '#ef4444' }}
                                                        onMouseEnter={e => e.target.style.background = '#fef2f2'}
                                                        onMouseLeave={e => e.target.style.background = '#fff'}
                                                    >
                                                        Unassign
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                   </div>
                                   )}
                                   <div style={{ width: '1px', height: '20px', background: '#e5e7eb', margin: '0 4px' }}></div>
                                   <button 
                                        onClick={() => handleExportChat(selectedChat)}
                                        style={{ background: 'transparent', border: '1px solid #e5e7eb', color: '#6b7280', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        title="Export Transcript"
                                    >
                                        <Download size={16} />
                                   </button>
                                   <button 
                                        onClick={() => handleBlockUser(selectedChat.id)}
                                        style={{ background: 'transparent', border: '1px solid #e5e7eb', color: getChatMetadata(selectedChat).blocked ? '#ef4444' : '#6b7280', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        title={getChatMetadata(selectedChat).blocked ? "User Blocked" : "Block User"}
                                    >
                                        <Slash size={16} />
                                   </button>
                                   <button 
                                        onClick={() => handleMarkResolved(selectedChat.id)}
                                        style={{ background: 'transparent', border: '1px solid #e5e7eb', color: '#6b7280', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        title="Resolve Chat"
                                    >
                                        <CheckCircle size={16} />
                                   </button>
                                   <button 
                                        onClick={() => handleDeleteChat(selectedChat.id)}
                                        style={{ background: 'transparent', border: '1px solid #e5e7eb', color: '#ef4444', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        title="Delete Chat"
                                    >
                                        <Trash2 size={16} />
                                   </button>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
                                {/* Messages Stream */}
                                <div style={{ 
                                    flex: 1, 
                                    padding: '20px 24px', 
                                    overflowY: 'auto', 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    gap: '6px', 
                                    background: '#fff',
                                    borderRight: showChatDetails ? '1px solid #f3f4f6' : 'none'
                                }}>
                                    {selectedChat.message && selectedChat.message.split('\n').map((line, idx) => {
                                        if (!line.trim()) return null;
                                        if (line.startsWith('[Metadata]:')) return null; // Hide metadata
                                        
                                        const isSystem = line.startsWith('[System]:') || line.includes('marked as resolved');
                                        const isInternal = line.startsWith('[Internal]:');
                                        const isBot = line.startsWith('Bot:');
                                        // Update to support "Admin <Name>:" or "Admin:"
                                        const isAdmin = line.startsWith('Admin');
                                        const isUser = line.startsWith('User:');
                                        
                                        // Robust strip regex
                                        const text = line.replace(/^(Bot:|User:|\[System\]:|\[Internal\]:|Admin(?: <.*?>)?:)/, '').trim();
                                        
                                        if (isSystem) {
                                            return (
                                                <div key={idx} style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
                                                    <span style={{ color: '#d1d5db', fontSize: '0.7rem' }}>
                                                        {text}
                                                    </span>
                                                </div>
                                            );
                                        }

                                        if (isInternal) {
                                            return (
                                                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '8px 0', opacity: 0.9 }}>
                                                    <div style={{ 
                                                        padding: '8px 16px', 
                                                        background: '#FEF9C3', 
                                                        border: '1px solid #FDE047', 
                                                        borderRadius: '8px', 
                                                        color: '#854D0E', 
                                                        fontSize: '0.8rem',
                                                        maxWidth: '80%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px'
                                                    }}>
                                                        <Lock size={12} /> 
                                                        <span style={{ fontWeight: 600 }}>Note:</span> {text}
                                                    </div>
                                                </div>
                                            )
                                        }

                                        const isOutbound = isAdmin || isBot;

                                        return (
                                            <motion.div 
                                                key={idx} 
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                style={{ 
                                                    alignSelf: isOutbound ? 'flex-end' : 'flex-start',
                                                    maxWidth: '65%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: isOutbound ? 'flex-end' : 'flex-start',
                                                }}
                                            >
                                                <div style={{ 
                                                    padding: '8px 14px',
                                                    borderRadius: '16px',
                                                    background: isOutbound ? '#111827' : '#f3f4f6', 
                                                    color: isOutbound ? '#fff' : '#111827',
                                                    fontSize: '0.9rem',
                                                    lineHeight: 1.4,
                                                    borderBottomRightRadius: isOutbound ? '4px' : '16px',
                                                    borderBottomLeftRadius: !isOutbound ? '4px' : '16px',
                                                }}>
                                                    {text}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>
                                
                                {/* Feature: Side Panel for User Details */}
                                {showChatDetails && (
                                    <motion.div 
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 250, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        style={{ background: '#f9fafb', borderLeft: '1px solid #e5e7eb', padding: '20px', overflowY: 'auto' }}
                                    >
                                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fff', border: '1px solid #e5e7eb', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: '#374151' }}>
                                                {(selectedChat.name || 'Visitor').charAt(0).toUpperCase()}
                                            </div>
                                            <h4 style={{ margin: '0 0 4px 0', color: '#111827', fontSize: '1rem' }}>{selectedChat.name}</h4>
                                            <p style={{ margin: 0, color: '#6b7280', fontSize: '0.8rem' }}>Visitor</p>
                                        </div>
                                        
                                        <div style={{ marginBottom: '20px' }}>
                                            <h5 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#9ca3af', letterSpacing: '0.05em', marginBottom: '8px' }}>Contact</h5>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                <Mail size={14} color="#6b7280" />
                                                <span style={{ fontSize: '0.85rem', color: '#374151', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedChat.email}</span>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <h5 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#9ca3af', letterSpacing: '0.05em', marginBottom: '8px' }}>Context</h5>
                                            <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '0.8rem', color: '#4b5563', marginBottom: '20px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                    <span>First Seen:</span>
                                                    <span style={{ fontWeight: 500 }}>{new Date(selectedChat.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                    <span>IP:</span>
                                                    <span style={{ fontWeight: 500 }}>197.xx.xx.xx</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span>Loc:</span>
                                                    <span style={{ fontWeight: 500 }}>Accra, GH</span>
                                                </div>
                                            </div>

                                            <h5 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#9ca3af', letterSpacing: '0.05em', marginBottom: '8px' }}>Tags</h5>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                                                {(getChatMetadata(selectedChat).tags || []).map((tag, i) => (
                                                    <span key={i} style={{ background: '#EEF2FF', color: '#4F46E5', fontSize: '0.75rem', padding: '4px 8px', borderRadius: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        {tag}
                                                        <button onClick={() => removeTag(tag)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, color: '#4F46E5', display: 'flex' }}><X size={10} /></button>
                                                    </span>
                                                ))}
                                                {(!getChatMetadata(selectedChat).tags || getChatMetadata(selectedChat).tags.length === 0) && <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontStyle: 'italic' }}>No tags yet</span>}
                                            </div>
                                            <div style={{ position: 'relative' }}>
                                                <input 
                                                    type="text" 
                                                    placeholder="Add tag (Enter)" 
                                                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '0.8rem', outline: 'none' }}
                                                    onKeyDown={(e) => {
                                                         if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            addTag(e.target.value);
                                                            e.target.value = '';
                                                         }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Enhanced Composition Area */}
                            <form 
                                onSubmit={handleAdminReply} 
                                style={{ 
                                    padding: '16px 24px', 
                                    background: isInternalNote ? '#FFFbeb' : '#fff', 
                                    display: 'flex', 
                                    gap: '12px', 
                                    alignItems: 'flex-end',
                                    position: 'relative',
                                    borderTop: '1px solid #f3f4f6',
                                    transition: 'background 0.2s'
                                }}>
                                {/* Enhanced Quick Replies Menu */}
                                {showQuickReplies && (
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '70px',
                                        left: '24px',
                                        width: '300px',
                                        background: '#fff',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                        border: '1px solid #e5e7eb',
                                        overflow: 'hidden',
                                        zIndex: 50,
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        <div style={{ padding: '10px 12px', background: '#f9fafb', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>QUICK REPLIES</span>
                                            <button onClick={handleAddQuickReply} style={{ border: 'none', background: 'none', color: '#2563EB', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>+ Add New</button>
                                        </div>
                                        <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                            {quickRepliesList.map((reply, i) => (
                                                <div 
                                                    key={i}
                                                    onClick={() => handleQuickReply(reply)}
                                                    style={{ 
                                                        padding: '10px 12px', 
                                                        fontSize: '0.85rem', 
                                                        color: '#374151', 
                                                        cursor: 'pointer', 
                                                        borderBottom: '1px solid #f9fafb',
                                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
                                                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                                                >
                                                    <span style={{ flex: 1 }}>{reply}</span>
                                                    <button 
                                                        onClick={(e) => handleDeleteQuickReply(e, i)}
                                                        style={{ border: 'none', background: 'none', color: '#ef4444', padding: '4px', cursor: 'pointer', opacity: 0.6 }}
                                                        onMouseEnter={e => e.target.style.opacity = 1}
                                                        onMouseLeave={e => e.target.style.opacity = 0.6}
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                            {quickRepliesList.length === 0 && <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af', fontSize: '0.8rem' }}>No quick replies found.</div>}
                                        </div>
                                    </div>
                                )}

                                <div style={{ flex: 1, position: 'relative' }}>
                                    <textarea 
                                        value={adminReplyText}
                                        onChange={e => {
                                            setAdminReplyText(e.target.value);
                                            e.target.style.height = 'auto';
                                            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                                        }}
                                        placeholder={isInternalNote ? "Add a private note..." : "Type a message..."}
                                        rows={1}
                                        style={{ 
                                            width: '100%', 
                                            padding: '12px 14px', 
                                            paddingRight: '110px', 
                                            borderRadius: '16px', 
                                            border: isInternalNote ? '1px solid #FCD34D' : '1px solid #e5e7eb', 
                                            outline: 'none',
                                            fontSize: '0.9rem',
                                            background: '#fff',
                                            color: '#111827',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                            resize: 'none',
                                            fontFamily: 'inherit',
                                            minHeight: '44px',
                                            maxHeight: '120px',
                                            transition: 'border-color 0.2s'
                                        }}
                                        onFocus={e => { e.target.style.borderColor = isInternalNote ? '#F59E0B' : '#d1d5db'; }}
                                        onBlur={e => { e.target.style.borderColor = isInternalNote ? '#FCD34D' : '#e5e7eb'; }}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleAdminReply(e);
                                            }
                                        }}
                                    />
                                    <div style={{ position: 'absolute', right: '10px', bottom: '10px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                                         <button type="button" onClick={() => setIsInternalNote(!isInternalNote)} style={{ background: isInternalNote ? '#FDE047' : 'transparent', padding: '6px', borderRadius: '6px', border: 'none', cursor: 'pointer', color: isInternalNote ? '#854D0E' : '#9ca3af', display: 'flex', alignItems: 'center' }} title={isInternalNote ? "Switch to Public Reply" : "Switch to Internal Note"}>
                                            <Lock size={16} />
                                        </button>
                                         <button type="button" onClick={() => setShowQuickReplies(!showQuickReplies)} style={{ background: 'transparent', padding: '6px', border: 'none', cursor: 'pointer', color: showQuickReplies ? '#111827' : '#9ca3af' }} title="Quick Replies">
                                            <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>⚡️</span>
                                        </button>
                                        <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{ background: 'transparent', padding: '6px', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                                            <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>😀</span>
                                        </button>
                                        {showEmojiPicker && <EmojiPicker onSelect={(emoji) => setAdminReplyText(prev => prev + emoji)} onClose={() => setShowEmojiPicker(false)} />}
                                        <button type="button" style={{ background: 'transparent', padding: '6px', border: 'none', cursor: 'pointer', color: '#9ca3af' }} onClick={() => fileInputRef.current?.click()}>
                                            <Paperclip size={18} />
                                        </button>
                                        <input 
                                            type="file" 
                                            hidden 
                                            ref={fileInputRef} 
                                            onChange={handleFileUpload}
                                        />
                                    </div>
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={!adminReplyText.trim()}
                                    style={{ 
                                        background: isInternalNote ? '#F59E0B' : '#111827',
                                        color: '#fff',
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '50%',
                                        border: 'none',
                                        cursor: adminReplyText.trim() ? 'pointer' : 'default',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: adminReplyText.trim() ? 1 : 0.5,
                                        flexShrink: 0,
                                        transition: 'all 0.2s',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', color: '#d1d5db' }}>
                            <p style={{ fontSize: '0.9rem' }}>Select a chat</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };


    const renderReports = () => {
        // 1. Filter Logic
        const now = new Date();
        const getStartDate = () => {
             const d = new Date();
             if (reportsDateRange === '7days') d.setDate(now.getDate() - 7);
             else if (reportsDateRange === '30days') d.setDate(now.getDate() - 30);
             else if (reportsDateRange === '90days') d.setDate(now.getDate() - 90);
             else if (reportsDateRange === 'year') d.setFullYear(now.getFullYear() - 1);
             else return new Date(0); // All time
             return d;
        };
        const startDate = getStartDate();

        // Ensure we have valid dates
        const filteredDonations = recentDonations.filter(d => d.raw_date && new Date(d.raw_date) >= startDate);
        const filteredVolunteers = volunteers.filter(v => v.created_at && new Date(v.created_at) >= startDate);

        // 2. Aggregate Stats
        const totalRevenue = filteredDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
        const avgDonation = filteredDonations.length > 0 ? (totalRevenue / filteredDonations.length) : 0;
        const donationCount = filteredDonations.length;
        const volunteerCount = filteredVolunteers.length;

        // 3. prepare Chart Data (Daily aggregation)
        const chartDataMap = {};
        
        // Initialize last X days if range is small, to show empty days
        if (reportsDateRange === '7days' || reportsDateRange === '30days') {
            const daysToCount = reportsDateRange === '7days' ? 7 : 14; 
            for (let i = daysToCount - 1; i >= 0; i--) {
                 const d = new Date();
                 d.setDate(now.getDate() - i);
                 const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                 chartDataMap[key] = 0;
            }
        }

        filteredDonations.forEach(d => {
            const day = new Date(d.raw_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (chartDataMap[day] !== undefined) {
                chartDataMap[day] += d.amount;
            } else {
                chartDataMap[day] = (chartDataMap[day] || 0) + d.amount;
            }
        });

        // Convert to array
        const incomeChartData = Object.keys(chartDataMap).map(key => ({
            name: key,
            amount: chartDataMap[key]
        }));

        // Volunteers by Skill (Top 5)
        const skillsMap = {};
        filteredVolunteers.forEach(v => {
            if (v.skills) {
                const skills = v.skills.split(',').map(s => s.trim());
                skills.forEach(s => {
                    skillsMap[s] = (skillsMap[s] || 0) + 1;
                });
            }
        });
        const skillChartData = Object.keys(skillsMap)
            .map(s => ({ name: s, count: skillsMap[s] }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Helper for simple tables
        const TableHeader = ({ children }) => (
            <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                {children}
            </th>
        );
        const TableCell = ({ children }) => (
            <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: '#374151', borderBottom: '1px solid #f3f4f6' }}>
                {children}
            </td>
        );

        return (
            <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', margin: 0 }}>Organization Reports</h2>
                         <div style={{ display: 'flex', gap: '2px', marginTop: '16px', background: '#f3f4f6', padding: '4px', borderRadius: '8px', width: 'fit-content' }}>
                            {['overview', 'financial', 'volunteers', 'impact'].map(tab => (
                                <button 
                                    key={tab}
                                    onClick={() => setReportCategory(tab)}
                                    style={{
                                        padding: '6px 16px',
                                        fontSize: '0.875rem',
                                        fontWeight: 500,
                                        color: reportCategory === tab ? '#111827' : '#6b7280',
                                        background: reportCategory === tab ? '#fff' : 'transparent',
                                        borderRadius: '6px',
                                        border: 'none',
                                        boxShadow: reportCategory === tab ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                                        cursor: 'pointer',
                                        textTransform: 'capitalize'
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                         </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                         {/* Date Range Selector */}
                         {/* Custom Date Range Selector */}
                         <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setIsDateRangeOpen(!isDateRangeOpen)}
                                onBlur={() => setTimeout(() => setIsDateRangeOpen(false), 200)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    color: '#374151',
                                    background: '#fff',
                                    cursor: 'pointer',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                    minWidth: '180px',
                                    justifyContent: 'space-between',
                                    height: '38px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Calendar size={14} color="#6b7280" />
                                    <span>
                                        {reportsDateRange === '7days' && 'Last 7 Days'}
                                        {reportsDateRange === '30days' && 'Last 30 Days'}
                                        {reportsDateRange === '90days' && 'Last 3 Months'}
                                        {reportsDateRange === 'year' && 'Last Year'}
                                        {reportsDateRange === 'all' && 'All Time'}
                                    </span>
                                </div>
                                <ChevronDown size={14} color="#6b7280" style={{ transform: isDateRangeOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                            </button>
                            
                            {isDateRangeOpen && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    marginTop: '8px',
                                    background: '#fff',
                                    border: '1px solid #f3f4f6',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                                    zIndex: 50,
                                    minWidth: '200px',
                                    overflow: 'hidden',
                                    padding: '6px'
                                }}>
                                    {[
                                        { label: 'Last 7 Days', value: '7days' },
                                        { label: 'Last 30 Days', value: '30days' },
                                        { label: 'Last 3 Months', value: '90days' },
                                        { label: 'Last Year', value: 'year' },
                                        { label: 'All Time', value: 'all' }
                                    ].map((option) => (
                                        <div
                                            key={option.value}
                                            onClick={() => {
                                                setReportsDateRange(option.value);
                                                setIsDateRangeOpen(false);
                                            }}
                                            style={{
                                                padding: '10px 12px',
                                                fontSize: '0.875rem',
                                                color: reportsDateRange === option.value ? '#E67E22' : '#374151',
                                                background: reportsDateRange === option.value ? '#fff7ed' : 'transparent',
                                                cursor: 'pointer',
                                                borderRadius: '8px',
                                                fontWeight: reportsDateRange === option.value ? 600 : 400,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                transition: 'background 0.2s'
                                            }}
                                            onMouseEnter={(e) => { 
                                                if(reportsDateRange !== option.value) {
                                                    e.currentTarget.style.background = '#f9fafb';
                                                }
                                            }}
                                            onMouseLeave={(e) => { 
                                                if(reportsDateRange !== option.value) {
                                                    e.currentTarget.style.background = 'transparent';
                                                }
                                            }}
                                        >
                                            {option.label}
                                            {reportsDateRange === option.value && <CheckCircle size={14} color="#E67E22" />}
                                        </div>
                                    ))}
                                </div>
                            )}
                         </div>

                         <button 
                            onClick={() => {
                                const dataMap = { 'financial': filteredDonations, 'volunteers': filteredVolunteers, 'impact': events, 'overview': recentDonations };
                                const dataToExport = dataMap[reportCategory] || recentDonations;
                                downloadCSV(dataToExport, `${reportCategory}_report.csv`);
                            }} 
                            style={{ ...actionButtonStyle, background: '#fff', border: '1px solid #d1d5db', height: '38px', padding: '0 16px' }}
                        >
                            <Download size={16} /> Export View
                        </button>
                    </div>
                </div>

                <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px', minHeight: '400px' }}>
                    
                    {/* OVERVIEW TAB */}
                    {reportCategory === 'overview' && (
                        <>
                            {/* KPI Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
                                <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' }}>
                                    <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500, marginBottom: '8px' }}>Total Revenue</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>₵{totalRevenue.toLocaleString()}</div>
                                </div>
                                <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' }}>
                                    <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500, marginBottom: '8px' }}>Donations</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>{donationCount}</div>
                                </div>
                                <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' }}>
                                     <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500, marginBottom: '8px' }}>Avg. Donation</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>₵{avgDonation.toFixed(0)}</div>
                                </div>
                                <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' }}>
                                    <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500, marginBottom: '8px' }}>Volunteers</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>{volunteerCount}</div>
                                </div>
                            </div>

                            {/* Charts */}
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                                <div>
                                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Revenue Trends</h3>
                                    <div style={{ height: '300px', width: '100%' }}>
                                         <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={incomeChartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                                                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={(value) => `₵${value}`} />
                                                <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                                <Bar dataKey="amount" fill="#374151" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div>
                                     <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Volunteer Skills</h3>
                                     <div style={{ height: '300px', width: '100%' }}>
                                         <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={skillChartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                                                <XAxis type="number" hide />
                                                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#6b7280' }} width={80} axisLine={false} tickLine={false} />
                                                <Tooltip cursor={{ fill: '#f9fafb' }} />
                                                <Bar dataKey="count" fill="#E67E22" radius={[0, 4, 4, 0]} barSize={20} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                     </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* FINANCIAL TAB */}
                    {reportCategory === 'financial' && (
                        <div style={{ overflowX: 'auto' }}>
                             <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr>
                                        <TableHeader>Date</TableHeader>
                                        <TableHeader>Donor</TableHeader>
                                        <TableHeader>Email</TableHeader>
                                        <TableHeader>Amount</TableHeader>
                                        <TableHeader>Status</TableHeader>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDonations.length > 0 ? filteredDonations.map((d, i) => (
                                        <tr key={i}>
                                            <TableCell>{new Date(d.raw_date).toLocaleDateString()}</TableCell>
                                            <TableCell>{d.donor}</TableCell>
                                            <TableCell>{d.email}</TableCell>
                                            <TableCell><b>₵{d.amount.toLocaleString()}</b></TableCell>
                                            <TableCell>
                                                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '12px', background: '#ecfdf5', color: '#047857', fontWeight: 600 }}>{d.status || 'Completed'}</span>
                                            </TableCell>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No donations found for this period.</td></tr>
                                    )}
                                </tbody>
                             </table>
                        </div>
                    )}

                    {/* VOLUNTEERS TAB */}
                    {reportCategory === 'volunteers' && (
                        <div style={{ overflowX: 'auto' }}>
                             <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr>
                                        <TableHeader>Date Applied</TableHeader>
                                        <TableHeader>Name</TableHeader>
                                        <TableHeader>Email</TableHeader>
                                        <TableHeader>Skills</TableHeader>
                                        <TableHeader>Status</TableHeader>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredVolunteers.length > 0 ? filteredVolunteers.map((v, i) => (
                                        <tr key={i}>
                                            <TableCell>{new Date(v.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell>{v.full_name}</TableCell>
                                            <TableCell>{v.email}</TableCell>
                                            <TableCell>{v.skills}</TableCell>
                                            <TableCell>
                                                <span style={{ fontSize: '11px', textTransform: 'capitalize', padding: '2px 8px', borderRadius: '12px', background: v.status === 'approved' ? '#ecfdf5' : '#fff7ed', color: v.status === 'approved' ? '#047857' : '#c2410c', fontWeight: 600 }}>
                                                    {v.status}
                                                </span>
                                            </TableCell>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No volunteers found for this period.</td></tr>
                                    )}
                                </tbody>
                             </table>
                        </div>
                    )}

                     {/* IMPACT TAB */}
                     {reportCategory === 'impact' && (
                        <div style={{ overflowX: 'auto' }}>
                             <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr>
                                        <TableHeader>Event Name</TableHeader>
                                        <TableHeader>Date</TableHeader>
                                        <TableHeader>Location</TableHeader>
                                        <TableHeader>Registrations</TableHeader>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.length > 0 ? events.map((e, i) => (
                                        <tr key={i}>
                                            <TableCell>{e.title}</TableCell>
                                            <TableCell>{new Date(e.date).toLocaleDateString()}</TableCell>
                                            <TableCell>{e.location}</TableCell>
                                            <TableCell>{eventRegistrations.filter(r => r.event === e.title).length}</TableCell>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No events found.</td></tr>
                                    )}
                                </tbody>
                             </table>
                        </div>
                    )}

                </div>
            </div>
        );
    };

    // --- General Settings State ---
    const [orgName, setOrgName] = useState('Charizomai Foundation');
    const [orgEmail, setOrgEmail] = useState('contact@charizomai.com');
    const [orgTagline, setOrgTagline] = useState('Empowering communities through dedicated charity work.');
    const [orgAddress, setOrgAddress] = useState('123 Charity Lane, Accra, Ghana');
    const [socialFacebook, setSocialFacebook] = useState('');
    const [socialTwitter, setSocialTwitter] = useState('');
    const [socialInstagram, setSocialInstagram] = useState('');
    const [socialLinkedin, setSocialLinkedin] = useState('');

    // --- Email Settings State ---
    const [emailProvider, setEmailProvider] = useState('resend');
    const [emailApiKey, setEmailApiKey] = useState('');
    const [emailSenderName, setEmailSenderName] = useState('Charizomai Team');
    const [emailSenderAddress, setEmailSenderAddress] = useState('updates@charizomai.com');

    const [isSavingSettings, setIsSavingSettings] = useState(false);
    // Notification state moved to top

    const handleSaveGeneralSettings = async () => {
        setIsSavingSettings(true);
        try {
            const updates = [
                { key: 'org_name', value: orgName, category: 'general' },
                { key: 'org_email', value: orgEmail, category: 'general' },
                { key: 'org_tagline', value: orgTagline, category: 'general' },
                { key: 'org_address', value: orgAddress, category: 'general' },
                { key: 'social_facebook', value: socialFacebook, category: 'general' },
                { key: 'social_twitter', value: socialTwitter, category: 'general' },
                { key: 'social_instagram', value: socialInstagram, category: 'general' },
                { key: 'social_linkedin', value: socialLinkedin, category: 'general' },
            ];

            const { error } = await supabase.from('admin_settings').upsert(updates, { onConflict: 'key' });
            if(error) throw error;

            logAction('Updated General Settings', { orgName });
            showNotification('Settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            showNotification(`Failed to save settings: ${error.message}`, 'error');
        } finally {
            setIsSavingSettings(false);
        }
    };

    const handleSaveEmailSettings = async () => {
        try {
             const updates = [
                { key: 'email_provider', value: emailProvider, category: 'email' },
                { key: 'email_api_key', value: emailApiKey, category: 'email' },
                { key: 'email_sender_name', value: emailSenderName, category: 'email' },
                { key: 'email_sender_address', value: emailSenderAddress, category: 'email' },
            ];
            const { error } = await supabase.from('admin_settings').upsert(updates, { onConflict: 'key' });
            if(error) throw error;
            showNotification('Email settings saved!');
        } catch (error) {
            console.error(error);
            showNotification(`Failed to save email settings: ${error.message}`, 'error');
        }
    };

    const handleSaveSmsSettings = async () => {
        try {
             const updates = [
                { key: 'sms_provider', value: smsProvider, category: 'sms' },
                { key: 'sms_account_sid', value: smsAccountSid, category: 'sms' },
                { key: 'sms_auth_token', value: smsAuthToken, category: 'sms' },
                { key: 'sms_phone_number', value: smsPhoneNumber, category: 'sms' },
            ];
            const { error } = await supabase.from('admin_settings').upsert(updates, { onConflict: 'key' });
            if(error) throw error;
            showNotification('SMS settings saved!');
        } catch (error) {
            console.error(error);
            showNotification(`Failed to save SMS settings: ${error.message}`, 'error');
        }
    };

    const handleSavePaymentSettings = async () => {
        try {
             const updates = [
                { key: 'payment_gateway', value: paymentGateway, category: 'payment' },
                { key: 'paystack_public_key', value: paystackPublicKey, category: 'payment' },
                { key: 'paystack_secret_key', value: paystackSecretKey, category: 'payment' },
                { key: 'stripe_public_key', value: stripePublicKey, category: 'payment' },
                { key: 'stripe_secret_key', value: stripeSecretKey, category: 'payment' },
                { key: 'payment_currency', value: paymentCurrency, category: 'payment' },
            ];
            const { error } = await supabase.from('admin_settings').upsert(updates, { onConflict: 'key' });
            if(error) throw error;
            showNotification('Payment settings saved!');
        } catch (error) {
            console.error(error);
            showNotification(`Failed to save payment settings: ${error.message}`, 'error');
        }
    };

    const renderSettings = () => {
        // --- Styles ---
        const containerStyle = {
            maxWidth: '1000px',
            margin: '0 auto',
            paddingBottom: '40px'
        };

        const headerStyle = {
            marginBottom: '24px',
            textAlign: 'center'
        };

        const segmentedControlStyle = {
            display: 'inline-flex',
            background: '#f3f4f6',
            padding: '4px',
            borderRadius: '12px',
            position: 'relative',
            gap: '4px'
        };

        const tabStyle = (isActive) => ({
            padding: '8px 24px',
            fontSize: '0.875rem',
            fontWeight: 600,
            borderRadius: '8px',
            cursor: 'pointer',
            border: 'none',
            background: isActive ? '#fff' : 'transparent',
            color: isActive ? '#111827' : '#6b7280',
            boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        });

        const cardContainerStyle = {
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden'
        };

        const contentPaddingStyle = {
            padding: '32px'
        };

        const sectionTitleStyle = {
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#111827',
            marginBottom: '8px'
        };

        const sectionDescStyle = {
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '24px'
        };

        // Form Inputs
        const labelStyle = {
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#374151',
            marginBottom: '6px'
        };

        const inputStyle = {
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            fontSize: '0.875rem',
            outline: 'none',
            background: '#fff',
            color: '#111827',
            transition: 'border-color 0.2s',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        };

        const grid2ColStyle = {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px'
        };

        return (
            <div style={containerStyle}>
                {/* Header & Navigation */}
                <div style={headerStyle}>
                    <div style={segmentedControlStyle}>
                        {[
                            { id: 'general', label: 'General', icon: <Settings size={16} /> },
                            { id: 'email', label: 'Email', icon: <Mail size={16} /> },
                            { id: 'sms', label: 'SMS', icon: <Smartphone size={16} /> },
                            { id: 'payments', label: 'Payments', icon: <DollarSign size={16} /> },
                            { id: 'users', label: 'Team', icon: <Users size={16} /> },
                            { id: 'security', label: 'Security', icon: <Shield size={16} /> },
                            { id: 'activity', label: 'Logs', icon: <FileText size={16} /> }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setSettingsTab(tab.id)}
                                style={tabStyle(settingsTab === tab.id)}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Card */}
                <div style={cardContainerStyle}>
                    
                    {/* --- GENERAL SETTINGS --- */}
                    {settingsTab === 'general' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            {/* Visual Banner for Profile */}
                            <div style={{ height: '120px', background: 'linear-gradient(135deg, #E67E22 0%, #D35400 100%)', position: 'relative' }}>
                                <div style={{ position: 'absolute', bottom: '-40px', left: '32px', display: 'flex', alignItems: 'flex-end', gap: '24px' }}>
                                    <div style={{ width: '100px', height: '100px', borderRadius: '16px', background: '#fff', padding: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                                        <div style={{ width: '100%', height: '100%', borderRadius: '12px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #d1d5db' }}>
                                            <Image size={32} color="#9ca3af" />
                                        </div>
                                    </div>
                                    <div style={{ paddingBottom: '12px' }}>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>{orgName}</h2>
                                        <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '0.925rem' }}>Full Administrator Access</p>
                                    </div>
                                </div>
                                <div style={{ position: 'absolute', bottom: '16px', right: '32px' }}>
                                    <button style={{ ...primaryButtonStyle, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}>
                                        <Upload size={16} style={{ marginRight: '6px' }} /> Upload Cover
                                    </button>
                                </div>
                            </div>
                            
                            <div style={{ paddingTop: '60px', ...contentPaddingStyle }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                    <h3 style={sectionTitleStyle}>Organization Details</h3>
                                    <button onClick={handleSaveGeneralSettings} disabled={isSavingSettings} style={{ ...primaryButtonStyle, opacity: isSavingSettings ? 0.7 : 1 }}>
                                        {isSavingSettings ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>

                                <div style={grid2ColStyle}>
                                    <div>
                                        <label style={labelStyle}>Organization Name</label>
                                        <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Support Email</label>
                                        <input type="email" value={orgEmail} onChange={(e) => setOrgEmail(e.target.value)} style={inputStyle} />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={labelStyle}>Tagline / Mission</label>
                                        <input type="text" value={orgTagline} onChange={(e) => setOrgTagline(e.target.value)} style={inputStyle} />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={labelStyle}>Physical Address</label>
                                        <textarea rows={3} value={orgAddress} onChange={(e) => setOrgAddress(e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
                                    </div>
                                </div>

                                <div style={{ height: '1px', background: '#e5e7eb', margin: '40px 0' }}></div>

                                <h3 style={sectionTitleStyle}>Social Connections</h3>
                                <p style={sectionDescStyle}>Manage links that appear in your footer and emails.</p>
                                <div style={grid2ColStyle}>
                                    <div style={{ position: 'relative' }}>
                                        <Facebook size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: '#9ca3af' }} />
                                        <input type="text" placeholder="Facebook Page URL" value={socialFacebook} onChange={(e) => setSocialFacebook(e.target.value)} style={{ ...inputStyle, paddingLeft: '40px' }} />
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <Twitter size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: '#9ca3af' }} />
                                        <input type="text" placeholder="Twitter Profile URL" value={socialTwitter} onChange={(e) => setSocialTwitter(e.target.value)} style={{ ...inputStyle, paddingLeft: '40px' }} />
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <Instagram size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: '#9ca3af' }} />
                                        <input type="text" placeholder="Instagram Profile URL" value={socialInstagram} onChange={(e) => setSocialInstagram(e.target.value)} style={{ ...inputStyle, paddingLeft: '40px' }} />
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <Linkedin size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: '#9ca3af' }} />
                                        <input type="text" placeholder="LinkedIn Company URL" value={socialLinkedin} onChange={(e) => setSocialLinkedin(e.target.value)} style={{ ...inputStyle, paddingLeft: '40px' }} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- EMAIL SETTINGS --- */}
                    {settingsTab === 'email' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={contentPaddingStyle}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <div>
                                    <h3 style={sectionTitleStyle}>Email Configuration</h3>
                                    <p style={sectionDescStyle}>Manage your email provider and sender identity.</p>
                                </div>
                                <button onClick={handleSaveEmailSettings} style={primaryButtonStyle}>
                                    Save Changes
                                </button>
                            </div>

                            <div style={{ maxWidth: '800px' }}>
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={labelStyle}>Service Provider</label>
                                    <div style={{ position: 'relative', maxWidth: '400px' }}>
                                        <button
                                            onClick={() => setIsEmailProviderOpen(!isEmailProviderOpen)}
                                            onBlur={() => setTimeout(() => setIsEmailProviderOpen(false), 200)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                width: '100%',
                                                padding: '10px 14px',
                                                borderRadius: '8px',
                                                border: '1px solid #e5e7eb',
                                                fontSize: '0.875rem',
                                                fontWeight: 500,
                                                color: '#374151',
                                                background: '#fff',
                                                cursor: 'pointer',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span>
                                                    {emailProvider === 'resend' && 'Resend (Recommended)'}
                                                    {emailProvider === 'sendgrid' && 'SendGrid'}
                                                    {emailProvider === 'aws_ses' && 'Amazon SES'}
                                                    {emailProvider === 'smtp' && 'Custom SMTP'}
                                                </span>
                                            </div>
                                            <ChevronDown size={16} color="#9ca3af" style={{ transform: isEmailProviderOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                                        </button>
                                        
                                        {isEmailProviderOpen && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '100%',
                                                left: 0,
                                                width: '100%',
                                                marginTop: '8px',
                                                background: '#fff',
                                                border: '1px solid #f3f4f6',
                                                borderRadius: '12px',
                                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                                                zIndex: 50,
                                                overflow: 'hidden',
                                                padding: '6px'
                                            }}>
                                                {[
                                                    { label: 'Resend (Recommended)', value: 'resend' },
                                                    { label: 'SendGrid', value: 'sendgrid' },
                                                    { label: 'Amazon SES', value: 'aws_ses' },
                                                    { label: 'Custom SMTP', value: 'smtp' }
                                                ].map((option) => (
                                                    <div
                                                        key={option.value}
                                                        onClick={() => {
                                                            setEmailProvider(option.value);
                                                            setIsEmailProviderOpen(false);
                                                        }}
                                                        style={{
                                                            padding: '10px 12px',
                                                            fontSize: '0.875rem',
                                                            color: emailProvider === option.value ? '#E67E22' : '#374151',
                                                            background: emailProvider === option.value ? '#fff7ed' : 'transparent',
                                                            cursor: 'pointer',
                                                            borderRadius: '8px',
                                                            fontWeight: emailProvider === option.value ? 600 : 400,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            transition: 'background 0.2s'
                                                        }}
                                                        onMouseEnter={(e) => { 
                                                            if(emailProvider !== option.value) {
                                                                e.currentTarget.style.background = '#f9fafb';
                                                            }
                                                        }}
                                                        onMouseLeave={(e) => { 
                                                            if(emailProvider !== option.value) {
                                                                e.currentTarget.style.background = 'transparent';
                                                            }
                                                        }}
                                                    >
                                                        {option.label}
                                                        {emailProvider === option.value && <CheckCircle size={14} color="#E67E22" />}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <label style={labelStyle}>API Key</label>
                                    <input 
                                        type="password" 
                                        value={emailApiKey} 
                                        onChange={(e) => setEmailApiKey(e.target.value)} 
                                        placeholder="Enter your API key"
                                        style={inputStyle} 
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                                    <div>
                                        <label style={labelStyle}>Sender Name</label>
                                        <input 
                                            type="text" 
                                            value={emailSenderName} 
                                            onChange={(e) => setEmailSenderName(e.target.value)} 
                                            placeholder="e.g. Charity Support"
                                            style={inputStyle} 
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Sender Email</label>
                                        <input 
                                            type="email" 
                                            value={emailSenderAddress} 
                                            onChange={(e) => setEmailSenderAddress(e.target.value)} 
                                            placeholder="e.g. support@charity.org"
                                            style={inputStyle} 
                                        />
                                    </div>
                                </div>

                                <div style={{ paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>Test Configuration</h4>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <button 
                                            onClick={() => showNotification("Test email sent!")}
                                            style={{ ...actionButtonStyle, background: '#fff', border: '1px solid #d1d5db', padding: '8px 16px' }}
                                        >
                                            Send Test Email
                                        </button>
                                        <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                                            Sends a test email to <strong>{currentUserProfile?.email || 'your address'}</strong>.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- SMS SETTINGS --- */}
                    {settingsTab === 'sms' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={contentPaddingStyle}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <div>
                                    <h3 style={sectionTitleStyle}>SMS Configuration</h3>
                                    <p style={sectionDescStyle}>Setup SMS gateways for urgent alerts and notifications.</p>
                                </div>
                                <button onClick={handleSaveSmsSettings} style={primaryButtonStyle}>
                                    Save Changes
                                </button>
                            </div>

                            <div style={{ maxWidth: '800px' }}>
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={labelStyle}>SMS Gateway</label>
                                    <div style={{ position: 'relative', maxWidth: '400px' }}>
                                        <button
                                            onClick={() => setIsSmsProviderOpen(!isSmsProviderOpen)}
                                            onBlur={() => setTimeout(() => setIsSmsProviderOpen(false), 200)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                width: '100%',
                                                padding: '10px 14px',
                                                borderRadius: '8px',
                                                border: '1px solid #e5e7eb',
                                                fontSize: '0.875rem',
                                                fontWeight: 500,
                                                color: '#374151',
                                                background: '#fff',
                                                cursor: 'pointer',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span>
                                                    {smsProvider === 'twilio' && 'Twilio'}
                                                    {smsProvider === 'africastalking' && 'AfricasTalking'}
                                                    {smsProvider === 'mhub' && 'mHub'}
                                                    {smsProvider === 'aws_sns' && 'AWS SNS'}
                                                </span>
                                            </div>
                                            <ChevronDown size={16} color="#9ca3af" style={{ transform: isSmsProviderOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                                        </button>
                                        
                                        {isSmsProviderOpen && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '100%',
                                                left: 0,
                                                width: '100%',
                                                marginTop: '8px',
                                                background: '#fff',
                                                border: '1px solid #f3f4f6',
                                                borderRadius: '12px',
                                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                                                zIndex: 50,
                                                overflow: 'hidden',
                                                padding: '6px'
                                            }}>
                                                {[
                                                    { label: 'Twilio', value: 'twilio' },
                                                    { label: 'AfricasTalking', value: 'africastalking' },
                                                    { label: 'mHub', value: 'mhub' },
                                                    { label: 'AWS SNS', value: 'aws_sns' }
                                                ].map((option) => (
                                                    <div
                                                        key={option.value}
                                                        onClick={() => {
                                                            setSmsProvider(option.value);
                                                            setIsSmsProviderOpen(false);
                                                        }}
                                                        style={{
                                                            padding: '10px 12px',
                                                            fontSize: '0.875rem',
                                                            color: smsProvider === option.value ? '#E67E22' : '#374151',
                                                            background: smsProvider === option.value ? '#fff7ed' : 'transparent',
                                                            cursor: 'pointer',
                                                            borderRadius: '8px',
                                                            fontWeight: smsProvider === option.value ? 600 : 400,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            transition: 'background 0.2s'
                                                        }}
                                                        onMouseEnter={(e) => { 
                                                            if(smsProvider !== option.value) {
                                                                e.currentTarget.style.background = '#f9fafb';
                                                            }
                                                        }}
                                                        onMouseLeave={(e) => { 
                                                            if(smsProvider !== option.value) {
                                                                e.currentTarget.style.background = 'transparent';
                                                            }
                                                        }}
                                                    >
                                                        {option.label}
                                                        {smsProvider === option.value && <CheckCircle size={14} color="#E67E22" />}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                                    <div>
                                        <label style={labelStyle}>Account SID / API Key</label>
                                        <input 
                                            type="password" 
                                            value={smsAccountSid} 
                                            onChange={(e) => setSmsAccountSid(e.target.value)} 
                                            placeholder="AC..."
                                            style={inputStyle} 
                                            autoComplete="new-password"
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Auth Token / Secret</label>
                                        <input 
                                            type="password" 
                                            value={smsAuthToken} 
                                            onChange={(e) => setSmsAuthToken(e.target.value)} 
                                            placeholder="Token..."
                                            style={inputStyle} 
                                            autoComplete="new-password"
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '32px' }}>
                                    <label style={labelStyle}>Sender ID / Phone Number</label>
                                    <input 
                                        type="text" 
                                        value={smsPhoneNumber} 
                                        onChange={(e) => setSmsPhoneNumber(e.target.value)} 
                                        placeholder="+1234567890 or CHARITY"
                                        style={{ ...inputStyle, maxWidth: '400px' }} 
                                    />
                                </div>

                                <div style={{ paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>Test Message</h4>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <input 
                                            type="tel" 
                                            placeholder="Test Phone Number" 
                                            style={{ ...inputStyle, maxWidth: '200px' }} 
                                        />
                                        <button 
                                            onClick={() => showNotification("Test SMS sent!")}
                                            style={{ ...actionButtonStyle, background: '#fff', border: '1px solid #d1d5db', padding: '8px 16px' }}
                                        >
                                            Send Test SMS
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- PAYMENT SETTINGS --- */}
                    {settingsTab === 'payments' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={contentPaddingStyle}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <div>
                                    <h3 style={sectionTitleStyle}>Payment Gateways</h3>
                                    <p style={sectionDescStyle}>Manage how your organization accepts donations and payments.</p>
                                </div>
                                <button onClick={handleSavePaymentSettings} style={primaryButtonStyle}>
                                    Save Changes
                                </button>
                            </div>

                            <div style={{ maxWidth: '800px' }}>
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={labelStyle}>Primary Processor</label>

                                    <div style={{ position: 'relative', maxWidth: '400px' }}>
                                        <button
                                            onClick={() => setIsPaymentGatewayOpen(!isPaymentGatewayOpen)}
                                            onBlur={() => setTimeout(() => setIsPaymentGatewayOpen(false), 200)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                width: '100%',
                                                padding: '10px 14px',
                                                borderRadius: '8px',
                                                border: '1px solid #e5e7eb',
                                                fontSize: '0.875rem',
                                                fontWeight: 500,
                                                color: '#374151',
                                                background: '#fff',
                                                cursor: 'pointer',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span>
                                                    {paymentGateway === 'paystack' && 'Paystack (Recommended for Africa)'}
                                                    {paymentGateway === 'stripe' && 'Stripe'}
                                                    {paymentGateway === 'paypal' && 'PayPal'}
                                                    {paymentGateway === 'flutterwave' && 'Flutterwave'}
                                                </span>
                                            </div>
                                            <ChevronDown size={16} color="#9ca3af" style={{ transform: isPaymentGatewayOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                                        </button>
                                        
                                        {isPaymentGatewayOpen && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '100%',
                                                left: 0,
                                                width: '100%',
                                                marginTop: '8px',
                                                background: '#fff',
                                                border: '1px solid #f3f4f6',
                                                borderRadius: '12px',
                                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                                                zIndex: 50,
                                                overflow: 'hidden',
                                                padding: '6px'
                                            }}>
                                                {[
                                                    { label: 'Paystack (Recommended for Africa)', value: 'paystack' },
                                                    { label: 'Stripe', value: 'stripe' },
                                                    { label: 'PayPal', value: 'paypal' },
                                                    { label: 'Flutterwave', value: 'flutterwave' }
                                                ].map((option) => (
                                                    <div
                                                        key={option.value}
                                                        onClick={() => {
                                                            setPaymentGateway(option.value);
                                                            setIsPaymentGatewayOpen(false);
                                                        }}
                                                        style={{
                                                            padding: '10px 12px',
                                                            fontSize: '0.875rem',
                                                            color: paymentGateway === option.value ? '#E67E22' : '#374151',
                                                            background: paymentGateway === option.value ? '#fff7ed' : 'transparent',
                                                            cursor: 'pointer',
                                                            borderRadius: '8px',
                                                            fontWeight: paymentGateway === option.value ? 600 : 400,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            transition: 'background 0.2s'
                                                        }}
                                                        onMouseEnter={(e) => { 
                                                            if(paymentGateway !== option.value) {
                                                                e.currentTarget.style.background = '#f9fafb';
                                                            }
                                                        }}
                                                        onMouseLeave={(e) => { 
                                                            if(paymentGateway !== option.value) {
                                                                e.currentTarget.style.background = 'transparent';
                                                            }
                                                        }}
                                                    >
                                                        {option.label}
                                                        {paymentGateway === option.value && <CheckCircle size={14} color="#E67E22" />}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <label style={labelStyle}>Public Key ({paymentGateway === 'stripe' ? 'Stripe' : 'Paystack'})</label>
                                    <input 
                                        type="text" 
                                        value={paymentGateway === 'stripe' ? stripePublicKey : paystackPublicKey}
                                        onChange={(e) => paymentGateway === 'stripe' ? setStripePublicKey(e.target.value) : setPaystackPublicKey(e.target.value)}
                                        placeholder={paymentGateway === 'stripe' ? "pk_test_..." : "pk_test_..."}
                                        style={inputStyle} 
                                    />
                                </div>
                                
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={labelStyle}>Secret Key ({paymentGateway === 'stripe' ? 'Stripe' : 'Paystack'})</label>
                                    <input 
                                        type="password" 
                                        value={paymentGateway === 'stripe' ? stripeSecretKey : paystackSecretKey}
                                        onChange={(e) => paymentGateway === 'stripe' ? setStripeSecretKey(e.target.value) : setPaystackSecretKey(e.target.value)} 
                                        placeholder={paymentGateway === 'stripe' ? "sk_test_..." : "sk_test_..."}
                                        style={inputStyle} 
                                        autoComplete="new-password"
                                    />
                                    <div style={{fontSize: '0.75rem', color: '#666', marginTop: '4px'}}>
                                        Used for verifying transactions on the backend.
                                    </div>
                                </div>

                                <div style={{ marginBottom: '32px' }}>
                                    <label style={labelStyle}>Default Currency</label>
                                    <select 
                                        value={paymentCurrency} 
                                        onChange={(e) => setPaymentCurrency(e.target.value)} 
                                        style={{ 
                                            ...inputStyle, 
                                            cursor: 'pointer', 
                                            appearance: 'none', 
                                            WebkitAppearance: 'none',
                                            backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', 
                                            backgroundRepeat: 'no-repeat', 
                                            backgroundPosition: 'right 12px center', 
                                            backgroundSize: '10px', 
                                            paddingRight: '32px',
                                            maxWidth: '300px'
                                        }}
                                    >
                                        <option value="GHS">GHS (Ghana Cedi)</option>
                                        <option value="NGN">NGN (Naira)</option>
                                        <option value="USD">USD (US Dollar)</option>
                                        <option value="EUR">EUR (Euro)</option>
                                        <option value="GBP">GBP (Pound Sterling)</option>
                                    </select>
                                </div>

                                <div style={{ padding: '16px', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #d1fae5', color: '#047857' }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>Security Note</div>
                                    <div style={{ fontSize: '0.875rem' }}>
                                        Ensure your webhook URL <code>https://api.charity.org/webhooks/{paymentGateway}</code> is configured in your provider's dashboard to receive real-time donation updates.
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- USERS SETTINGS --- */}
                    {settingsTab === 'users' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={contentPaddingStyle}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <div>
                                    <h3 style={sectionTitleStyle}>Team Management</h3>
                                    <p style={sectionDescStyle}>Manage access, roles, and permissions.</p>
                                </div>
                                <button onClick={() => setIsAddUserModalOpen(true)} style={primaryButtonStyle}>
                                    <Plus size={16} /> Add Member
                                </button>
                            </div>

                            {/* Filters Bar */}
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', background: '#f9fafb', padding: '12px', borderRadius: '12px', border: '1px solid #f3f4f6', alignItems: 'center' }}>
                                <div style={{ position: 'relative', flex: 1 }}>
                                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                    <input 
                                        type="text" 
                                        placeholder="Search members..." 
                                        value={userSearchQuery}
                                        onChange={(e) => setUserSearchQuery(e.target.value)}
                                        style={{ ...inputStyle, paddingLeft: '36px', border: 'none', boxShadow: 'none', background: 'transparent' }}
                                    />
                                </div>
                                <div style={{ width: '1px', height: '24px', background: '#e5e7eb', margin: '0 4px' }}></div>
                                
                                {selectedUserIds.size > 0 && (
                                    <>
                                        <button onClick={handleBulkDelete} style={{ ...actionButtonStyle, color: '#ef4444', background: '#fee2e2' }}>
                                            <Trash2 size={16} /> Delete ({selectedUserIds.size})
                                        </button>
                                        <div style={{ width: '1px', height: '24px', background: '#e5e7eb', margin: '0 4px' }}></div>
                                    </>
                                )}

                                <button onClick={() => downloadCSV(appUsers, 'users.csv')} style={{ ...actionButtonStyle, background: 'transparent' }}>
                                    <Download size={16} /> Export
                                </button>
                            </div>

                            {/* Table */}
                            <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                                        <tr>
                                            <th style={{ padding: '14px 20px', width: '40px' }}>
                                                <input 
                                                    type="checkbox" 
                                                    onChange={handleSelectAll} 
                                                    checked={appUsers.length > 0 && selectedUserIds.size === appUsers.length}
                                                    style={{ cursor: 'pointer', accentColor: '#E67E22' }}
                                                />
                                            </th>
                                            <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User</th>
                                            <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</th>
                                            <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                            <th style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 600, color: '#475569', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appUsers.filter(u => u.email.toLowerCase().includes(userSearchQuery.toLowerCase())).map((user, idx) => (
                                            <tr key={user.id} style={{ borderBottom: idx !== appUsers.length - 1 ? '1px solid #f1f5f9' : 'none', background: selectedUserIds.has(user.id) ? '#fff7ed' : '#fff' }}>
                                                <td style={{ padding: '16px 20px' }}>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={selectedUserIds.has(user.id)}
                                                        onChange={() => handleSelectUser(user.id)}
                                                        style={{ cursor: 'pointer', accentColor: '#E67E22' }}
                                                    />
                                                </td>
                                                <td style={{ padding: '16px 20px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: user.role === 'admin' ? '#eff6ff' : '#f8fafc', color: user.role === 'admin' ? '#2563eb' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, border: '1px solid rgba(0,0,0,0.05)' }}>
                                                            {user.email.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span style={{ fontWeight: 500, color: '#1e293b' }}>{user.email}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '16px 20px' }}>
                                                    <span style={{ 
                                                        padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                                                        background: user.role === 'admin' ? '#eff6ff' : '#f1f5f9',
                                                        color: user.role === 'admin' ? '#2563eb' : '#475569',
                                                        textTransform: 'capitalize',
                                                        border: '1px solid rgba(0,0,0,0.02)'
                                                    }}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px 20px' }}>
                                                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: !user.status || user.status === 'active' ? '#22c55e' : '#ef4444' }}></div>
                                                        <span style={{ fontSize: '0.875rem', color: '#475569' }}>{user.status || 'Active'}</span>
                                                   </div>
                                                </td>
                                                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                                    <button onClick={() => handleEditUser(user)} style={{ color: '#64748b', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}>
                                                        <Edit size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {/* --- SECURITY SETTINGS --- */}
                    {settingsTab === 'security' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={contentPaddingStyle}>
                            <h3 style={sectionTitleStyle}>Security & Authentication</h3>
                            <p style={sectionDescStyle}>Enhance your account security.</p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                {/* Password Card */}
                                <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                            <Lock size={20} color="#374151" />
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', margin: 0 }}>Password</h4>
                                            <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: 0 }}>Last changed 3 months ago</p>
                                        </div>
                                    </div>
                                    <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <input type="password" name="password" placeholder="New Password" required minLength={6} style={inputStyle} />
                                        <input type="password" name="confirmPassword" placeholder="Confirm Password" required minLength={6} style={inputStyle} />
                                        <button type="submit" style={{ ...primaryButtonStyle, width: '100%', justifyContent: 'center', marginTop: '8px' }}>Update Password</button>
                                    </form>
                                </div>

                                {/* 2FA Card */}
                                <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                            <Smartphone size={20} color="#374151" />
                                        </div>
                                        <div>
                                             <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', margin: 0 }}>2-Step Verification</h4>
                                             <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: 0 }}>Recommended for all admins</p>
                                        </div>
                                    </div>
                                    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>Text Message (SMS)</span>
                                            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Off</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => showNotification("2-Step Verification setup is coming soon!", "error")}
                                        style={{ ...actionButtonStyle, width: '100%', justifyContent: 'center', background: '#fff', border: '1px solid #d1d5db', padding: '10px' }}
                                    >
                                        Enable 2FA
                                    </button>
                                </div>
                            </div>
                            
                            {/* Active Sessions */}
                            <div style={{ marginTop: '24px', padding: '24px', borderRadius: '12px', border: '1px solid #fee2e2', background: '#fef2f2' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: '#991b1b', margin: '0 0 4px 0' }}>Current Session</h4>
                                        <p style={{ fontSize: '0.8125rem', color: '#b91c1c', margin: 0 }}>You are logged in from IP <strong>{clientIp}</strong></p>
                                    </div>
                                    <button onClick={handleLogout} style={{ ...primaryButtonStyle, background: '#ef4444', border: 'none' }}>Log Out All Devices</button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- ACTIVITY LOGS --- */}
                    {settingsTab === 'activity' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={contentPaddingStyle}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <div>
                                    <h3 style={sectionTitleStyle}>Activity History</h3>
                                    <p style={sectionDescStyle}>Audit log of all system actions.</p>
                                </div>
                                <button onClick={() => downloadCSV(activityLogs, 'activity.csv')} style={{ ...actionButtonStyle, background: '#fff', border: '1px solid #d1d5db' }}>
                                    <Download size={16} /> Export CSV
                                </button>
                            </div>

                            <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', height: '400px', overflowY: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                    <tbody>
                                        {activityLogs.map((log, idx) => (
                                            <tr key={log.id} style={{ borderBottom: '1px solid #f3f4f6', background: idx % 2 === 0 ? '#fff' : '#f9fafb' }}>
                                                <td style={{ padding: '16px 24px', width: '200px', color: '#6b7280', fontSize: '0.8125rem' }}>
                                                    {new Date(log.created_at).toLocaleString()}
                                                </td>
                                                <td style={{ padding: '16px 24px' }}>
                                                    <div style={{ fontWeight: 500, color: '#111827' }}>{log.action}</div>
                                                </td>
                                                <td style={{ padding: '16px 24px', textAlign: 'right', fontFamily: 'monospace', color: '#6b7280' }}>
                                                    {log.ip_address || '-'}
                                                </td>
                                            </tr>
                                        ))}
                                         {activityLogs.length === 0 && (
                                            <tr>
                                                <td colSpan={3} style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>No activity logs found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                </div>
            </div>
        );
    };


    return (
        <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
            <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FileIcon size={20} color="#E67E22" /><h1 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#2C3E50', margin: 0 }}>Admin Dashboard</h1></div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button style={primaryButtonStyle} onClick={() => navigate('/')}>Go Back to Site</button>
                    <button style={actionButtonStyle} onClick={handleLogout}>Sign out</button>
                </div>
            </div>
            <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 32px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                    {['overview', 'donations', 'causes', 'events', 'gallery', 'donors', 'messages', 'live_chat', 'volunteers', 'reports', 'settings'].map(tab => (
                        <TabButton key={tab} label={tab === 'live_chat' ? 'Live Chat' : tab.charAt(0).toUpperCase() + tab.slice(1).replace('_', ' ')} active={activeTab === tab} onClick={() => setActiveTab(tab)} />
                    ))}
                </div>
            </div>
            <div style={{ padding: '24px' }}>
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'donations' && renderDonations()}
                    {activeTab === 'causes' && renderCauses()}
                    {activeTab === 'events' && renderEvents()}
                    {activeTab === 'gallery' && renderGallery()}
                    {activeTab === 'donors' && renderDonors()}
                    {activeTab === 'messages' && renderMessages()}
                    {activeTab === 'live_chat' && renderLiveChat()}
                    {activeTab === 'volunteers' && renderVolunteers()}
                    {activeTab === 'reports' && renderReports()}

                    {activeTab === 'settings' && renderSettings()}
                </motion.div>
            </div>
            {isCreateModalOpen && <EventCreateModal onClose={handleCloseModals} onSave={handleSaveNewEvent} />}
            {isCauseCreateModalOpen && <CauseCreateModal onClose={handleCloseModals} onSave={handleSaveNewCause} />}
            {isGalleryUploadModalOpen && <GalleryUploadModal onClose={handleCloseModals} onSave={handleUploadGalleryImage} />}
            {isGalleryEditModalOpen && selectedGalleryImage && <GalleryEditModal image={selectedGalleryImage} onClose={handleCloseModals} onSave={handleUpdateGalleryImage} />}
            {previewImage && <GalleryPreviewModal image={previewImage} onClose={() => setPreviewImage(null)} />}
            {isDeleteConfirmOpen && <DeleteConfirmationModal onClose={handleCloseModals} onConfirm={confirmDeleteGalleryImage} title="Delete Image" message="Are you sure you want to delete this image? This action cannot be undone." />}
            {isVolunteerViewModalOpen && selectedVolunteer && <VolunteerViewModal volunteer={selectedVolunteer} onClose={handleCloseModals} onUpdateStatus={handleUpdateVolunteerStatus} />}
            {isCauseViewModalOpen && selectedCause && <CauseViewModal cause={selectedCause} onClose={handleCloseModals} />}
            {isCauseEditModalOpen && selectedCause && <CauseEditModal cause={selectedCause} onClose={handleCloseModals} onSave={handleSaveCause} />}
            {isViewModalOpen && selectedEvent && <EventViewModal event={selectedEvent} onClose={handleCloseModals} />}
            {isEditModalOpen && selectedEvent && <EventEditModal event={selectedEvent} onClose={handleCloseModals} onSave={handleSaveEvent} />}
            {isDonorViewModalOpen && selectedDonor && <DonorViewModal donor={selectedDonor} onClose={handleCloseModals} />}
            {isMessageViewModalOpen && selectedMessage && <MessageViewModal message={selectedMessage} onClose={handleCloseModals} />}
            
            {/* Force Password Change Modal */}
            {isPasswordChangeModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                }}>
                    <div style={{
                        background: 'white', padding: '32px', borderRadius: '16px',
                        maxWidth: '400px', width: '90%', textAlign: 'center',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ width: '48px', height: '48px', background: '#FEE2E2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#DC2626' }}>
                            <Settings size={24} />
                        </div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111', marginBottom: '8px' }}>Security Update Required</h2>
                        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '24px', lineHeight: 1.5 }}>
                            {forcePasswordChange ? "You are required to change your password before continuing." : "Please update your password."}
                        </p>
                        <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ textAlign: 'left' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>New Password</label>
                                <input type="password" name="password" required minLength={6} placeholder="Min 6 characters" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Confirm Password</label>
                                <input type="password" name="confirmPassword" required minLength={6} placeholder="Confirm new password" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                            </div>
                            <button type="submit" style={{ ...primaryButtonStyle, justifyContent: 'center', marginTop: '8px', padding: '12px' }}>
                                {forcePasswordChange ? "Secure Account & Continue" : "Update Password"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Add User Modal */}
            {isAddUserModalOpen && (
                <div style={modalOverlayStyle}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ ...modalStyle, maxWidth: '400px' }}>
                        <div style={modalHeaderStyle}>
                            <h2 style={modalTitleStyle}>Add New User</h2>
                            <button onClick={() => setIsAddUserModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Email Address</label>
                                <input type="email" name="email" placeholder="user@example.com" required style={{ ...inputStyle, width: '100%' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Default Password (Optional)</label>
                                <input type="text" name="password" placeholder="Min 6 characters" minLength={6} style={{ ...inputStyle, width: '100%' }} />
                                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>If active, user must likely change this on first login.</div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Role</label>
                                <select name="role" style={{ 
                                    ...inputStyle, 
                                    width: '100%', 
                                    cursor: 'pointer',
                                    appearance: 'none',
                                    WebkitAppearance: 'none',
                                    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 12px center',
                                    backgroundSize: '10px',
                                    paddingRight: '32px'
                                }}>
                                    <option value="admin">Admin</option>
                                    <option value="editor">Editor</option>
                                    <option value="viewer">Viewer</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                                <button type="button" onClick={() => setIsAddUserModalOpen(false)} style={cancelButtonStyle}>Cancel</button>
                                <button type="submit" disabled={usersLoading} style={{ ...primaryButtonStyle, width: 'auto' }}>
                                    {usersLoading ? 'Creating...' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Edit User Modal */}
            {isEditUserModalOpen && selectedUserForEdit && (
                <div style={modalOverlayStyle}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ ...modalStyle, maxWidth: '500px' }}>
                        <div style={modalHeaderStyle}>
                            <h2 style={modalTitleStyle}>Edit User</h2>
                            <button onClick={handleCloseModals} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleUpdateUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Email Address</label>
                                <input type="email" value={selectedUserForEdit.email} disabled style={{ ...inputStyle, background: '#f3f4f6', cursor: 'not-allowed' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Role</label>
                                <select name="role" defaultValue={selectedUserForEdit.role} style={{ 
                                    ...inputStyle, 
                                    width: '100%', 
                                    cursor: 'pointer',
                                    appearance: 'none',
                                    WebkitAppearance: 'none',
                                    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 12px center',
                                    backgroundSize: '10px',
                                    paddingRight: '32px'
                                }}>
                                    <option value="admin">Admin</option>
                                    <option value="editor">Editor</option>
                                    <option value="viewer">Viewer</option>
                                </select>
                            </div>
                             <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Account Status</label>
                                <select name="status" defaultValue={selectedUserForEdit.status || 'active'} style={{ 
                                    ...inputStyle, 
                                    width: '100%', 
                                    cursor: 'pointer',
                                    appearance: 'none',
                                    WebkitAppearance: 'none',
                                    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 12px center',
                                    backgroundSize: '10px',
                                    paddingRight: '32px'
                                }}>
                                    <option value="active">Active</option>
                                    <option value="suspended">Suspended</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                                <button type="button" onClick={handleCloseModals} style={cancelButtonStyle}>Cancel</button>
                                <button type="submit" style={primaryButtonStyle}>Save Changes</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
            
            <NotificationToast notification={notification} />
        </div>
    );
}

// Styles
const cardStyle = { background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(229, 231, 235, 1)', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' };
const cardTitleStyle = { fontSize: '0.875rem', fontWeight: 600, color: '#2C3E50', marginBottom: '16px', margin: 0 };
const tooltipStyle = { background: 'rgba(255, 255, 255, 0.9)', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '12px', backdropFilter: 'blur(4px)' };
const primaryButtonStyle = { padding: '8px 16px', fontSize: '0.875rem', fontWeight: 500, color: '#fff', background: '#E67E22', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' };
const actionButtonStyle = { padding: '6px 12px', fontSize: '0.8125rem', fontWeight: 500, color: '#6b7280', background: 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 };
const modalStyle = { background: 'white', padding: '24px', borderRadius: '16px', width: '90%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', position: 'relative' };
const modalHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const modalTitleStyle = { fontSize: '1.25rem', fontWeight: 600, color: '#111827', margin: 0 };
const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem', outline: 'none' };
const cancelButtonStyle = { padding: '8px 16px', fontSize: '0.875rem', fontWeight: 500, color: '#374151', background: '#fff', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' };

// Sub-components
function TabButton({ label, active, onClick }) {
    return <button onClick={onClick} style={{ padding: '12px 16px', fontSize: '0.875rem', fontWeight: 500, color: active ? '#E67E22' : '#6b7280', background: 'transparent', border: 'none', borderBottom: active ? '2px solid #E67E22' : '2px solid transparent', cursor: 'pointer', marginBottom: '-1px' }}>{label}</button>;
}
function StatCard({ icon, title, value, iconColor }) {
    return (
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: `${iconColor}15`, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
            </div>
            <div><div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '2px', fontWeight: 500 }}>{title}</div><div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2C3E50', lineHeight: 1 }}>{value}</div></div>
        </div>
    );
}
function DonationItem({ donation }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8125rem', fontWeight: 600, color: '#6b7280' }}>{donation.donor.charAt(0)}</div>
                <div><div style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#2C3E50' }}>{donation.donor}</div><div style={{ fontSize: '0.6875rem', color: '#9ca3af' }}>{donation.date}</div></div>
            </div>
            <div style={{ textAlign: 'right' }}><div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#2C3E50' }}>₵{donation.amount}</div><div style={{ fontSize: '0.625rem', color: '#6b7280' }}>{donation.cause}</div></div>
        </div>
    );
}
function CauseCard({ cause, onView, onEdit, onDelete }) {
    const percentage = (cause.raised / cause.goal) * 100;
    return (
        <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2C3E50', margin: 0 }}>{cause.title}</h3><span style={{ fontSize: '0.625rem', fontWeight: 600, color: '#10b981', background: '#10b98110', padding: '2px 6px', borderRadius: '4px' }}>{cause.growth}</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}><span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#2C3E50' }}>GH₵{cause.raised.toLocaleString()}</span><span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>of GH₵{cause.goal.toLocaleString()}</span></div>
                <div style={{ width: '100%', height: '4px', background: '#f3f4f6', borderRadius: '2px', overflow: 'hidden' }}><div style={{ width: `${percentage}%`, height: '100%', background: '#E67E22' }}></div></div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                <button onClick={onView} style={{ padding: '6px', fontSize: '0.75rem', fontWeight: 500, color: '#6b7280', background: 'rgba(249, 250, 251, 0.8)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>View</button>
                <button onClick={onEdit} style={{ padding: '6px', fontSize: '0.75rem', fontWeight: 500, color: '#6b7280', background: 'rgba(249, 250, 251, 0.8)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}><Edit size={14} /></button>
                <button onClick={onDelete} style={{ padding: '6px', fontSize: '0.75rem', fontWeight: 500, color: '#ef4444', background: 'rgba(254, 242, 242, 0.8)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}><Trash2 size={14} /></button>
            </div>
        </div>
    );
}
function EventCard({ event, onView, onEdit, onDelete }) {
    return (
        <div style={cardStyle}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '44px', height: '44px', background: '#E67E2210', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#E67E22', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.625rem', fontWeight: 600 }}>
                        {event.date && typeof event.date === 'string' ? (event.date.includes(' ') ? event.date.split(' ')[0] : new Date(event.date).toLocaleString('default', { month: 'short' }).toUpperCase()) : 'DATE'}
                    </div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700 }}>
                        {event.date && typeof event.date === 'string' ? (event.date.includes(' ') ? event.date.split(' ')[1] : new Date(event.date).getDate()) : '00'}
                    </div>
                </div>
                <div style={{ flex: 1 }}><h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2C3E50', marginBottom: '2px', margin: 0 }}>{event.title}</h3><div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{event.location}</div></div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={onView} style={{ flex: 1, padding: '6px', fontSize: '0.75rem', fontWeight: 500, color: '#6b7280', background: 'rgba(249, 250, 251, 0.8)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>View</button>
                <button onClick={onEdit} style={{ flex: 1, padding: '6px', fontSize: '0.75rem', fontWeight: 500, color: '#6b7280', background: 'rgba(249, 250, 251, 0.8)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Edit</button>
                <button onClick={onDelete} style={{ flex: 0.5, padding: '6px', fontSize: '0.75rem', fontWeight: 500, color: '#ef4444', background: 'rgba(254, 242, 242, 0.8)', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={14} /></button>
            </div>
        </div>
    );
}
function RegistrationsTable({ data }) {
    return (
        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: 'rgba(249, 250, 251, 0.5)' }}><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>Attendee</th><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>Event</th><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>Code</th><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>Status</th></tr></thead>
                <tbody>{data.map((row, i) => (
                    <tr key={row.id} style={{ borderBottom: i < data.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                        <td style={{ padding: '10px 16px', fontSize: '0.8125rem', color: '#2C3E50' }}><div>{row.attendee}</div><div style={{ fontSize: '0.6875rem', color: '#9ca3af' }}>{row.email}</div></td>
                        <td style={{ padding: '10px 16px', fontSize: '0.8125rem', color: '#6b7280' }}>{row.event}</td>
                        <td style={{ padding: '10px 16px' }}><code style={{ fontSize: '0.6875rem', background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>{row.code}</code></td>
                        <td style={{ padding: '10px 16px' }}><span style={{ fontSize: '0.6875rem', padding: '2px 8px', borderRadius: '4px', background: row.status === 'confirmed' ? '#10b98112' : '#f59e0b12', color: row.status === 'confirmed' ? '#10b981' : '#f59e0b' }}>{row.status}</span></td>
                    </tr>
                ))}</tbody>
            </table>
        </div>
    );
}
function ComingSoon({ title }) {
    return (
        <div style={{ ...cardStyle, textAlign: 'center', padding: '48px' }}>
            <div style={{ width: '56px', height: '56px', background: 'rgba(243, 244, 246, 0.8)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Settings size={24} color="#9ca3af" /></div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#2C3E50', marginBottom: '6px' }}>{title}</h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>This feature is currently under development</p>
        </div>
    );
}
function EventCreateModal({ onClose, onSave }) {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        capacity: '',
        location: '',
        image_url: ''
    });
    const [uploading, setUploading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        try {
            setUploading(true);
            const file = e.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('images').getPublicUrl(filePath);
            setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image!');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
        }} onClick={onClose}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(16px)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                width: '100%',
                maxWidth: '400px',
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'auto'
            }} onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#9ca3af'
                    }}
                >
                    <X size={20} />
                </button>

                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2C3E50', marginBottom: '20px' }}>Create New Event</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Event Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Annual Charity Gala"
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '0.875rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={e => e.target.style.borderColor = '#E67E22'}
                            onBlur={e => e.target.style.borderColor = '#d1d5db'}
                            required
                        />
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Event Image</label>
                        <div style={{ 
                            border: '1px dashed #d1d5db', 
                            borderRadius: '8px', 
                            padding: '16px', 
                            textAlign: 'center',
                            background: '#f9fafb',
                            cursor: 'pointer',
                            position: 'relative'
                        }}>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageUpload} 
                                style={{ 
                                    position: 'absolute', 
                                    top: 0, 
                                    left: 0, 
                                    width: '100%', 
                                    height: '100%', 
                                    opacity: 0, 
                                    cursor: 'pointer' 
                                }} 
                                disabled={uploading}
                            />
                            {uploading ? (
                                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Uploading...</span>
                            ) : formData.image_url ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <img src={formData.image_url} alt="Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                    <span style={{ fontSize: '0.875rem', color: '#10b981' }}>Image Uploaded</span>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                    <FileIcon size={24} color="#9ca3af" />
                                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Click to upload image</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Date</label>
                            <input
                                type="text"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                placeholder="e.g. DEC 25"
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    fontSize: '0.875rem',
                                    outline: 'none'
                                }}
                                onFocus={e => e.target.style.borderColor = '#E67E22'}
                                onBlur={e => e.target.style.borderColor = '#d1d5db'}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Capacity</label>
                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                placeholder="e.g. 100"
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    fontSize: '0.875rem',
                                    outline: 'none'
                                }}
                                onFocus={e => e.target.style.borderColor = '#E67E22'}
                                onBlur={e => e.target.style.borderColor = '#d1d5db'}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g. Kempinski Hotel"
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '0.875rem',
                                outline: 'none'
                            }}
                            onFocus={e => e.target.style.borderColor = '#E67E22'}
                            onBlur={e => e.target.style.borderColor = '#d1d5db'}
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                background: '#fff',
                                color: '#374151',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={uploading}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: 'none',
                                background: uploading ? '#9ca3af' : '#E67E22',
                                color: '#fff',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                cursor: uploading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {uploading ? 'Uploading...' : 'Create Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function EventViewModal({ event, onClose }) {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
        }} onClick={onClose}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(16px)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                width: '100%',
                maxWidth: '400px',
                position: 'relative'
            }} onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#9ca3af'
                    }}
                >
                    <X size={20} />
                </button>

                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2C3E50', marginBottom: '20px' }}>Event Details</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Event Title</label>
                        <div style={{ fontSize: '1rem', fontWeight: 500, color: '#2C3E50', marginTop: '4px' }}>{event.title}</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</label>
                            <div style={{ fontSize: '0.875rem', color: '#2C3E50', marginTop: '4px' }}>{event.date}</div>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</label>
                            <div style={{ marginTop: '4px' }}>
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    background: '#10b98112',
                                    color: '#10b981'
                                }}>
                                    {event.status || 'Active'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</label>
                        <div style={{ fontSize: '0.875rem', color: '#2C3E50', marginTop: '4px' }}>{event.location}</div>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Registrations</label>
                        <div style={{ marginTop: '4px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.875rem', color: '#2C3E50' }}>
                                <span>{event.registrations} registered</span>
                                <span style={{ color: '#6b7280' }}>Capacity: {event.capacity || 100}</span>
                            </div>
                            <div style={{ width: '100%', height: '6px', background: '#f3f4f6', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${(event.registrations / (event.capacity || 100)) * 100}%`,
                                    height: '100%',
                                    background: '#E67E22'
                                }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function EventEditModal({ event, onClose, onSave }) {
    const [formData, setFormData] = useState({ ...event });
    const [uploading, setUploading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        try {
            setUploading(true);
            const file = e.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('images').getPublicUrl(filePath);
            setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image!');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
        }} onClick={onClose}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(16px)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                width: '100%',
                maxWidth: '400px',
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'auto'
            }} onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#9ca3af'
                    }}
                >
                    <X size={20} />
                </button>

                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2C3E50', marginBottom: '20px' }}>Edit Event</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Event Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '0.875rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={e => e.target.style.borderColor = '#E67E22'}
                            onBlur={e => e.target.style.borderColor = '#d1d5db'}
                        />
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Event Image</label>
                        <div style={{ 
                            border: '1px dashed #d1d5db', 
                            borderRadius: '8px', 
                            padding: '16px', 
                            textAlign: 'center',
                            background: '#f9fafb',
                            cursor: 'pointer',
                            position: 'relative'
                        }}>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageUpload} 
                                style={{ 
                                    position: 'absolute', 
                                    top: 0, 
                                    left: 0, 
                                    width: '100%', 
                                    height: '100%', 
                                    opacity: 0, 
                                    cursor: 'pointer' 
                                }} 
                                disabled={uploading}
                            />
                            {uploading ? (
                                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Uploading...</span>
                            ) : formData.image_url ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <img src={formData.image_url} alt="Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                    <span style={{ fontSize: '0.875rem', color: '#10b981' }}>Image Updated</span>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                    <FileIcon size={24} color="#9ca3af" />
                                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Click to update image</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Date</label>
                            <input
                                type="text"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    fontSize: '0.875rem',
                                    outline: 'none'
                                }}
                                onFocus={e => e.target.style.borderColor = '#E67E22'}
                                onBlur={e => e.target.style.borderColor = '#d1d5db'}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Capacity</label>
                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    fontSize: '0.875rem',
                                    outline: 'none'
                                }}
                                onFocus={e => e.target.style.borderColor = '#E67E22'}
                                onBlur={e => e.target.style.borderColor = '#d1d5db'}
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '0.875rem',
                                outline: 'none'
                            }}
                            onFocus={e => e.target.style.borderColor = '#E67E22'}
                            onBlur={e => e.target.style.borderColor = '#d1d5db'}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                background: '#fff',
                                color: '#374151',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: 'none',
                                background: '#E67E22',
                                color: '#fff',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                cursor: 'pointer'
                            }}
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function CauseCreateModal({ onClose, onSave }) {
    const [formData, setFormData] = useState({
        title: '',
        goal: '',
        description: '',
        image_url: '',
        badge: 'General',
        color: '#E67E22',
        organizer: 'Charity Team',
        location: 'Ghana',
        story: JSON.stringify(["We need your help to make a difference."])
    });
    const [uploading, setUploading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        try {
            setUploading(true);
            const file = e.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `cause-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('images').getPublicUrl(filePath);
            setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image!');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
        }} onClick={onClose}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(16px)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                width: '100%',
                maxWidth: '400px',
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'auto'
            }} onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#9ca3af'
                    }}
                >
                    <X size={20} />
                </button>

                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2C3E50', marginBottom: '20px' }}>Edit Cause</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Cause Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '0.875rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={e => e.target.style.borderColor = '#E67E22'}
                            onBlur={e => e.target.style.borderColor = '#d1d5db'}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Cause Image</label>
                        <div style={{ 
                            border: '1px dashed #d1d5db', 
                            borderRadius: '8px', 
                            padding: '16px', 
                            textAlign: 'center',
                            background: '#f9fafb',
                            cursor: 'pointer',
                            position: 'relative'
                        }}>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageUpload} 
                                style={{ 
                                    position: 'absolute', 
                                    top: 0, 
                                    left: 0, 
                                    width: '100%', 
                                    height: '100%', 
                                    opacity: 0, 
                                    cursor: 'pointer' 
                                }} 
                                disabled={uploading}
                            />
                            {uploading ? (
                                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Uploading...</span>
                            ) : formData.image_url ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <img src={formData.image_url} alt="Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                    <span style={{ fontSize: '0.875rem', color: '#10b981' }}>Image Updated</span>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                    <FileIcon size={24} color="#9ca3af" />
                                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Click to update image</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Fundraising Goal (GH₵)</label>
                        <input
                            type="number"
                            name="goal"
                            value={formData.goal}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '0.875rem',
                                outline: 'none'
                            }}
                            onFocus={e => e.target.style.borderColor = '#E67E22'}
                            onBlur={e => e.target.style.borderColor = '#d1d5db'}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '0.875rem',
                                outline: 'none',
                                resize: 'vertical'
                            }}
                            onFocus={e => e.target.style.borderColor = '#E67E22'}
                            onBlur={e => e.target.style.borderColor = '#d1d5db'}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                background: '#fff',
                                color: '#374151',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={uploading}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: 'none',
                                background: uploading ? '#9ca3af' : '#E67E22',
                                color: '#fff',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                cursor: uploading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {uploading ? 'Uploading...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function CauseEditModal({ cause, onClose, onSave }) {
    const [formData, setFormData] = useState({ ...cause });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (cause) {
            setFormData({
                ...cause,
                description: cause.description || '',
            });
        }
    }, [cause]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        try {
            setUploading(true);
            const file = e.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `cause-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('images').getPublicUrl(filePath);
            setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image!');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
        }} onClick={onClose}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(16px)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                width: '100%',
                maxWidth: '400px',
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'auto'
            }} onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#9ca3af'
                    }}
                >
                    <X size={20} />
                </button>

                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2C3E50', marginBottom: '20px' }}>Edit Cause</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Cause Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '0.875rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={e => e.target.style.borderColor = '#E67E22'}
                            onBlur={e => e.target.style.borderColor = '#d1d5db'}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Cause Image</label>
                        <div style={{ 
                            border: '1px dashed #d1d5db', 
                            borderRadius: '8px', 
                            padding: '16px', 
                            textAlign: 'center',
                            background: '#f9fafb',
                            cursor: 'pointer',
                            position: 'relative'
                        }}>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageUpload} 
                                style={{ 
                                    position: 'absolute', 
                                    top: 0, 
                                    left: 0, 
                                    width: '100%', 
                                    height: '100%', 
                                    opacity: 0, 
                                    cursor: 'pointer' 
                                }} 
                                disabled={uploading}
                            />
                            {uploading ? (
                                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Uploading...</span>
                            ) : formData.image_url ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <img src={formData.image_url} alt="Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                    <span style={{ fontSize: '0.875rem', color: '#10b981' }}>Image Updated</span>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                    <FileIcon size={24} color="#9ca3af" />
                                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Click to update image</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Fundraising Goal (GH₵)</label>
                        <input
                            type="number"
                            name="goal"
                            value={formData.goal}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '0.875rem',
                                outline: 'none'
                            }}
                            onFocus={e => e.target.style.borderColor = '#E67E22'}
                            onBlur={e => e.target.style.borderColor = '#d1d5db'}
                        />
                    </div>
                     <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '0.875rem',
                                outline: 'none',
                                resize: 'vertical'
                            }}
                            onFocus={e => e.target.style.borderColor = '#E67E22'}
                            onBlur={e => e.target.style.borderColor = '#d1d5db'}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                background: '#fff',
                                color: '#374151',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: 'none',
                                background: '#E67E22',
                                color: '#fff',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                cursor: 'pointer'
                            }}
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function CauseViewModal({ cause, onClose }) {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
        }} onClick={onClose}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(16px)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                width: '100%',
                maxWidth: '500px',
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'auto'
            }} onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#9ca3af'
                    }}
                >
                    <X size={20} />
                </button>

                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2C3E50', marginBottom: '20px' }}>Cause Details</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {cause.image_url && (
                        <div style={{ width: '100%', height: '200px', borderRadius: '8px', overflow: 'hidden' }}>
                            <img src={cause.image_url} alt={cause.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    )}
                    
                    <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#2C3E50', marginBottom: '4px' }}>{cause.title}</h3>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            <span style={{ fontWeight: 500, color: '#E67E22' }}>GH₵{cause.raised.toLocaleString()}</span> raised of GH₵{cause.goal.toLocaleString()}
                        </div>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Description</h4>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.5 }}>{cause.description}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Status</h4>
                            <span style={{ 
                                display: 'inline-block',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                background: cause.status === 'active' ? '#10b98110' : '#f3f4f6',
                                color: cause.status === 'active' ? '#10b981' : '#6b7280'
                            }}>
                                {cause.status.charAt(0).toUpperCase() + cause.status.slice(1)}
                            </span>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Donors</h4>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{cause.donors || 0}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DonorCard({ donor, onView }) {
    return (
        <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#E67E2215', color: '#E67E22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                    {donor.name.charAt(0)}
                </div>
                <div>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2C3E50', margin: 0 }}>{donor.name}</h3>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{donor.email}</div>
                </div>
            </div>
            <div style={{ textAlign: 'right', marginRight: '16px' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2C3E50' }}>₵{donor.totalDonated.toLocaleString()}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{donor.donationCount} donations</div>
            </div>
            <button onClick={onView} style={{ padding: '6px 12px', fontSize: '0.75rem', fontWeight: 500, color: '#6b7280', background: 'rgba(249, 250, 251, 0.8)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>View Details</button>
        </div>
    );
}

function MessageCard({ message, onView }) {
    return (
        <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2C3E50', margin: 0 }}>{message.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{new Date(message.created_at).toLocaleDateString()}</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '4px', fontWeight: 500 }}>{message.subject}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80%' }}>{message.message}</div>
            </div>
            <button onClick={onView} style={{ marginLeft: '16px', padding: '6px 12px', fontSize: '0.75rem', fontWeight: 500, color: '#6b7280', background: 'rgba(249, 250, 251, 0.8)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Read</button>
        </div>
    );
}

function DonorViewModal({ donor, onClose }) {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
        }} onClick={onClose}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(16px)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                width: '100%',
                maxWidth: '400px',
                position: 'relative'
            }} onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#9ca3af'
                    }}
                >
                    <X size={20} />
                </button>

                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2C3E50', marginBottom: '20px' }}>Donor Details</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#E67E2215', color: '#E67E22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 600 }}>
                            {donor.name.charAt(0)}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#2C3E50', margin: 0 }}>{donor.name}</h3>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{donor.email}</div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>Total Donated</div>
                            <div style={{ fontSize: '1.125rem', fontWeight: 600, color: '#2C3E50' }}>₵{donor.totalDonated.toLocaleString()}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>Donations</div>
                            <div style={{ fontSize: '1.125rem', fontWeight: 600, color: '#2C3E50' }}>{donor.donationCount}</div>
                        </div>
                    </div>

                    <div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>Last Donation</div>
                        <div style={{ fontSize: '0.875rem', color: '#2C3E50' }}>{new Date(donor.lastDonationDate).toLocaleDateString()}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MessageViewModal({ message, onClose }) {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
        }} onClick={onClose}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(16px)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                width: '100%',
                maxWidth: '500px',
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'auto'
            }} onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#9ca3af'
                    }}
                >
                    <X size={20} />
                </button>

                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2C3E50', marginBottom: '20px' }}>Message Details</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#2C3E50', margin: 0 }}>{message.name}</h3>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{message.email}</div>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{new Date(message.created_at).toLocaleString()}</div>
                    </div>

                    <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Subject: {message.subject}</div>
                        <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{message.message}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ReportCard({ title, description, icon, color, onDownload }) {
    return (
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <div>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${color}15`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    {icon}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#2C3E50', marginBottom: '8px' }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.5, marginBottom: '20px' }}>{description}</p>
            </div>
            <button onClick={onDownload} style={{ width: '100%', padding: '10px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '6px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }}>
                <Download size={16} /> Download CSV
            </button>
        </div>
    );
}

function GalleryUploadModal({ onClose, onSave }) {
    const [formData, setFormData] = useState({
        caption: '',
        category: 'Events',
        image_url: ''
    });
    const [uploading, setUploading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        try {
            setUploading(true);
            const file = e.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `gallery-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('images').getPublicUrl(filePath);
            setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image!');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.image_url) {
            alert('Please upload an image');
            return;
        }
        onSave(formData);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
        }} onClick={onClose}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(16px)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                width: '100%',
                maxWidth: '400px',
                position: 'relative'
            }} onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#9ca3af'
                    }}
                >
                    <X size={20} />
                </button>

                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2C3E50', marginBottom: '20px' }}>Upload to Gallery</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Image</label>
                        <div style={{ 
                            border: '1px dashed #d1d5db', 
                            borderRadius: '8px', 
                            padding: '16px', 
                            textAlign: 'center',
                            background: '#f9fafb',
                            cursor: 'pointer',
                            position: 'relative'
                        }}>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageUpload} 
                                style={{ 
                                    position: 'absolute', 
                                    top: 0, 
                                    left: 0, 
                                    width: '100%', 
                                    height: '100%', 
                                    opacity: 0, 
                                    cursor: 'pointer' 
                                }} 
                                disabled={uploading}
                            />
                            {uploading ? (
                                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Uploading...</span>
                            ) : formData.image_url ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <img src={formData.image_url} alt="Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                    <span style={{ fontSize: '0.875rem', color: '#10b981' }}>Image Uploaded</span>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                    <FileIcon size={24} color="#9ca3af" />
                                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Click or Drag Image Here</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Caption</label>
                        <input
                            type="text"
                            name="caption"
                            value={formData.caption}
                            onChange={handleChange}
                            placeholder="Enter a caption..."
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '0.875rem',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Category</label>
                        <div style={{ position: 'relative' }}>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '10px 40px 10px 12px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    fontSize: '0.875rem',
                                    outline: 'none',
                                    background: '#f9fafb',
                                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
                                    appearance: 'none',
                                    WebkitAppearance: 'none',
                                    cursor: 'pointer',
                                    color: '#1f2937'
                                }}
                            >
                                <option value="Outreach">Outreach</option>
                                <option value="Distribution">Distribution</option>
                                <option value="Education">Education</option>
                                <option value="Team">Team</option>
                                <option value="Events">Events</option>
                                <option value="Volunteer">Volunteer</option>
                            </select>
                            <ChevronDown size={16} color="#6b7280" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                background: '#fff',
                                color: '#374151',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={uploading}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: 'none',
                                background: uploading ? '#9ca3af' : '#E67E22',
                                color: '#fff',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                cursor: uploading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {uploading ? 'Uploading...' : 'Save Image'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}



function GalleryEditModal({ image, onClose, onSave }) {
    const [formData, setFormData] = useState({
        id: image.id,
        caption: image.caption || '',
        category: image.category || 'Events'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
        }} onClick={onClose}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(16px)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                width: '100%',
                maxWidth: '400px',
                position: 'relative'
            }} onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#9ca3af'
                    }}
                >
                    <X size={20} />
                </button>

                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2C3E50', marginBottom: '20px' }}>Edit Image Details</h2>
                
                <div style={{ marginBottom: '20px', borderRadius: '8px', overflow: 'hidden', height: '150px' }}>
                    <img src={image.image_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Caption</label>
                        <input
                            type="text"
                            name="caption"
                            value={formData.caption}
                            onChange={handleChange}
                            placeholder="Enter a caption..."
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '0.875rem',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '0.875rem',
                                outline: 'none',
                                background: 'white'
                            }}
                        >
                            <option value="Outreach">Outreach</option>
                            <option value="Distribution">Distribution</option>
                            <option value="Education">Education</option>
                            <option value="Team">Team</option>
                            <option value="Events">Events</option>
                            <option value="Volunteer">Volunteer</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                background: '#fff',
                                color: '#374151',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: 'none',
                                background: '#E67E22',
                                color: '#fff',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                cursor: 'pointer'
                            }}
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function VolunteerViewModal({ volunteer, onClose, onUpdateStatus }) {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
        }} onClick={onClose}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(16px)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                width: '100%',
                maxWidth: '500px',
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'auto'
            }} onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#9ca3af'
                    }}
                >
                    <X size={20} />
                </button>

                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2C3E50', marginBottom: '20px' }}>Volunteer Application</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#E67E2215', color: '#E67E22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 600 }}>
                            {volunteer.full_name.charAt(0)}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#2C3E50', margin: 0 }}>{volunteer.full_name}</h3>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{volunteer.email}</div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{volunteer.phone}</div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>Skills</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#2C3E50' }}>{volunteer.skills}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>Availability</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#2C3E50' }}>{volunteer.availability}</div>
                        </div>
                    </div>

                    <div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>Motivation</div>
                        <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.6, background: '#f9fafb', padding: '12px', borderRadius: '8px' }}>
                            {volunteer.motivation}
                        </p>
                    </div>

                    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px', marginTop: '8px' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>Update Status</div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => onUpdateStatus(volunteer.id, 'approved')}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
                                    background: volunteer.status === 'approved' ? '#059669' : '#ecfdf5',
                                    color: volunteer.status === 'approved' ? 'white' : '#059669',
                                    fontWeight: 500, cursor: 'pointer'
                                }}
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => onUpdateStatus(volunteer.id, 'rejected')}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
                                    background: volunteer.status === 'rejected' ? '#dc2626' : '#fef2f2',
                                    color: volunteer.status === 'rejected' ? 'white' : '#dc2626',
                                    fontWeight: 500, cursor: 'pointer'
                                }}
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => onUpdateStatus(volunteer.id, 'pending')}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
                                    background: volunteer.status === 'pending' ? '#d97706' : '#fff7ed',
                                    color: volunteer.status === 'pending' ? 'white' : '#d97706',
                                    fontWeight: 500, cursor: 'pointer'
                                }}
                            >
                                Pending
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


function DeleteConfirmationModal({ onClose, onConfirm, title, message }) {
    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }} onClick={onClose}>
            <div style={{
                background: 'white', padding: '32px', borderRadius: '16px',
                maxWidth: '400px', width: '90%', textAlign: 'center',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }} onClick={e => e.stopPropagation()}>
                <div style={{ width: '48px', height: '48px', background: '#FEE2E2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#DC2626' }}>
                    <AlertTriangle size={24} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111', marginBottom: '8px' }}>{title || 'Confirm Delete'}</h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '24px', lineHeight: 1.5 }}>
                    {message || 'Are you sure you want to proceed?'}
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', background: 'white', color: '#374151', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
                    <button onClick={onConfirm} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#DC2626', color: 'white', fontWeight: 500, cursor: 'pointer' }}>Delete</button>
                </div>
            </div>
        </div>
    );
}



function NotificationToast({ notification }) {
    if (!notification) return null;
    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: notification.type === 'success' ? '#10b981' : '#ef4444',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'slideIn 0.3s ease-out'
        }}>
            {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
            <span style={{ fontWeight: 500, fontSize: '0.925rem' }}>{notification.message}</span>
            <style>{`
                @keyframes slideIn {
                    from { transform: translateY(10px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
