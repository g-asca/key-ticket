import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  ArrowRight,
  LogOut,
  ChevronDown,
  Plus,
  Clock,
  ArrowLeft,
  CheckCircle,
  X,
  ChevronRight,
  Calendar,
  AlertTriangle,
  ClipboardList,
  Search,
  Info,
  MessageSquare,
  User,
  Tag as TagIcon,
  Check,
  UserCheck
} from 'lucide-react';

import logoImg from './assets/media__1783603526191.png';
import img204 from './assets/media__1783603526204.png';
import img205 from './assets/media__1783603526205.png';

const AzureStyleOverride = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
    @import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@300;400;600;700&display=swap');
    
    .ms-font {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
    }
    
    .ms-card-shadow {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.02);
    }

    .modal-backdrop {
      background-color: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(4px);
    }

    .fade-in {
      animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `}} />
);

const TicketLogoIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 5.5c-1.1 0-2 .9-2 2s.9 2 2 2V17H4v-2c1.1 0 2-.9 2-2s-.9-2-2-2V6h16v3.5z" />
  </svg>
);

const ListCustomIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 150 150" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="20" y="20" width="110" height="110" rx="25" />
    <circle cx="48" cy="52" r="8" fill="currentColor" stroke="none" />
    <line x1="72" y1="52" x2="110" y2="52" strokeWidth="10" />
    <circle cx="48" cy="75" r="8" fill="currentColor" stroke="none" />
    <line x1="72" y1="75" x2="110" y2="75" strokeWidth="10" />
    <circle cx="48" cy="98" r="8" fill="currentColor" stroke="none" />
    <line x1="72" y1="98" x2="110" y2="98" strokeWidth="10" />
  </svg>
);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Helper to parse subView from URL hash
  const getSubViewFromHash = () => {
    const hash = window.location.hash;
    if (hash.startsWith('#/')) {
      return hash.slice(2);
    }
    return 'hub';
  };

  // Navigation: 'hub' | 'create_select' | 'create_form' | 'active' | 'history' | 'ticket_detail'
  const [subView, _setSubView] = useState(getSubViewFromHash());
  const setSubView = (view) => {
    window.location.hash = `#/${view}`;
  };
  const [previousView, setPreviousView] = useState('active'); // Remembers origin before entering detail screen
  const [selectedCategory, setSelectedCategory] = useState('');
  const profileRef = useRef(null);

  const getFormattedDateTime = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  // Search filter and modal selectors for Sposta Data page
  const [activeModal, setActiveModal] = useState('none'); // 'none' | 'customer' | 'item'
  const [lookupSearch, setLookupSearch] = useState('');
  const [manualInputActive, setManualInputActive] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [manualDesc, setManualDesc] = useState('');

  // Sposta Data form state values
  const [selectedCustomer, setSelectedCustomer] = useState(null); // { code, desc }
  const [selectedItem, setSelectedItem] = useState(null); // { code, desc }
  const [oldDate, setOldDate] = useState('');
  const [newDate, setNewDate] = useState('');

  // Custom standard input states for generic requests
  const [formSubject, setFormSubject] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formUrgency, setFormUrgency] = useState('Medium');
  const [notification, setNotification] = useState('');

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [ticketComments, setTicketComments] = useState({
    'KT-1004': [
      { author: 'Laura Conti', text: 'Ho verificato lo stato della spedizione su BC, sembra tutto pronto.', date: '08/07/2026 14:23' }
    ],
    'KT-1005': [
      { author: 'System Operator', text: 'Token cache reset successfully, waiting for client refresh.', date: '09/07/2026 09:12' }
    ]
  });

  const mockCustomers = [
    { code: 'C001', desc: 'Alfa Distribuzione S.r.l.' },
    { code: 'C002', desc: 'Beta Forniture S.p.A.' },
    { code: 'C003', desc: 'Gamma Logistica S.r.l.' },
    { code: 'C004', desc: 'Delta Commerce S.r.l.' },
    { code: 'C005', desc: 'Epsilon Trading S.p.A.' },
    { code: 'C006', desc: 'Zeta Solutions S.r.l.' },
    { code: 'C007', desc: 'Eta Group S.p.A.' }
  ];

  const mockItems = [
    { code: 'ART-1001', desc: 'ART-1001 — Valvola idraulica DN50' },
    { code: 'ART-1002', desc: 'ART-1002 — Pompa centrifuga 3kW' },
    { code: 'ART-1003', desc: 'ART-1003 — Filtro aria F7 600x600' },
    { code: 'ART-2001', desc: 'ART-2001 — Raccordo T 1/2"' },
    { code: 'ART-2002', desc: 'ART-2002 — Raccordo curvo 90° 3/4"' },
    { code: 'ART-3001', desc: 'ART-3001 — Sensore pressione 0-10 bar' },
    { code: 'ART-3002', desc: 'ART-3002 — Termostato digitale 230V' },
    { code: 'ART-4001', desc: 'ART-4001 — Guarnizione OR 50x3' }
  ];

  const [activeTickets, setActiveTickets] = useState([
    {
      id: 'KT-1004',
      customer: 'Alfa Distribuzione S.r.l.',
      subject: 'Sposta Consegna Sposta Data',
      category: 'Sposta Data',
      urgency: 'High',
      date: '2026-07-08',
      creationDate: '08/07/2026 14:23',
      lastUpdate: '08/07/2026 15:45',
      reportedBy: 'Laura Conti',
      desc: 'Le email di notifica per i nuovi ticket non vengono inviate agli assegnatari.',
      tags: ['email', 'notifiche'],
      assignee: 'Laura Conti'
    },
    {
      id: 'KT-1008',
      customer: 'Contoso Logistics S.r.l.',
      subject: 'Verifica Connessione API ERP',
      category: 'Sollecito',
      urgency: 'Low',
      date: '2026-07-09',
      creationDate: '09/07/2026 12:01',
      lastUpdate: '09/07/2026 12:01',
      reportedBy: 'Mario Rossi',
      desc: '', // Empty description to show a slim card
      tags: ['api', 'test'],
      assignee: 'Nessun assegnatario'
    },
    {
      id: 'KT-1005',
      customer: 'Beta Forniture S.p.A.',
      subject: 'OAuth Consent Token Cycle',
      category: 'Non Conformità',
      urgency: 'Medium',
      date: '2026-07-09',
      creationDate: '09/07/2026 09:12',
      lastUpdate: '09/07/2026 09:12',
      reportedBy: 'Marco Rossi',
      desc: 'Single sign-on loop riscontrato sui dispositivi mobili aziendali.',
      tags: ['sso', 'azure-ad'],
      assignee: 'Nessun assegnatario'
    },
    {
      id: 'KT-1006',
      customer: 'Gamma Logistica S.r.l.',
      subject: 'Printer Hub Routing Sync Error',
      category: 'Sollecito',
      urgency: 'Low',
      date: '2026-07-09',
      creationDate: '09/07/2026 10:00',
      lastUpdate: '09/07/2026 10:30',
      reportedBy: 'Giovanni Bianchi',
      desc: 'Spooler locali non sincronizzano i parametri impostati sul server.',
      tags: ['printer', 'hardware'],
      assignee: 'Laura Conti'
    },
    {
      id: 'KT-1007',
      customer: 'Delta Commerce S.r.l.',
      subject: 'Inventory Sync Delay',
      category: 'Giacenza Articolo',
      urgency: 'High',
      date: '2026-07-09',
      creationDate: '09/07/2026 11:05',
      lastUpdate: '09/07/2026 11:05',
      reportedBy: 'Silvia Verdi',
      desc: 'Mancanza di chiavi di validazione autorizzate sui driver di storage.',
      tags: ['database', 'sync'],
      assignee: 'Nessun assegnatario'
    }
  ]);

  const [historyTickets, setHistoryTickets] = useState([
    {
      id: 'KT-1001',
      customer: 'Epsilon Trading S.p.A.',
      subject: 'Billing Period Misalignment',
      category: 'Sposta Data',
      urgency: 'Medium',
      date: '2026-07-05',
      creationDate: '05/07/2026 08:30',
      lastUpdate: '05/07/2026 17:00',
      reportedBy: 'Laura Conti',
      status: 'Resolved',
      resolution: 'Reset metadata pointer in BC billing engine.',
      tags: ['billing', 'invoice'],
      assignee: 'Laura Conti'
    },
    {
      id: 'KT-1002',
      customer: 'Zeta Solutions S.r.l.',
      subject: 'Database Log Clearance',
      category: 'Sollecito',
      urgency: 'Low',
      date: '2026-07-06',
      creationDate: '06/07/2026 14:15',
      lastUpdate: '06/07/2026 16:30',
      reportedBy: 'Francesco Neri',
      status: 'Rejected',
      resolution: 'Richiesta non idonea o duplicata.',
      tags: ['maintenance'],
      assignee: 'Laura Conti'
    }
  ]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync URL hash with subView state
  useEffect(() => {
    const handleHashChange = () => {
      const view = getSubViewFromHash();
      _setSubView(view);
    };
    window.addEventListener('hashchange', handleHashChange);

    // Set initial hash if none exists
    if (!window.location.hash) {
      window.location.hash = '#/hub';
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const triggerNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification('');
    }, 4000);
  };

  const handleSignIn = (e) => {
    if (e) e.preventDefault();
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggingIn(false);
      setIsLoggedIn(true);
      setSubView('hub');
    }, 450);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setShowProfileMenu(false);
    setSubView('hub');
  };

  const handleCreateRequest = (e) => {
    if (e) e.preventDefault();

    if (selectedCategory === 'Sposta Data') {
      if (!selectedCustomer || !selectedItem || !oldDate || !newDate) {
        triggerNotification('Si prega di completare tutti i campi obbligatori.');
        return;
      }
    } else {
      if (!formSubject.trim()) {
        triggerNotification('Si prega di inserire un oggetto valido.');
        return;
      }
    }

    const nextId = `KT-${Math.floor(1000 + Math.random() * 9000)}`;
    const currentFormattedTime = getFormattedDateTime();
    const newRequest = {
      id: nextId,
      customer: selectedCategory === 'Sposta Data' ? selectedCustomer.desc : 'Cliente Occasionale S.p.A.',
      subject: selectedCategory === 'Sposta Data'
        ? `Sposta data consegna per ${selectedItem.code}`
        : formSubject,
      category: selectedCategory,
      urgency: selectedCategory === 'Sposta Data' ? 'Medium' : formUrgency,
      date: new Date().toISOString().split('T')[0],
      creationDate: currentFormattedTime,
      lastUpdate: currentFormattedTime,
      reportedBy: 'Key-Ticket Agent (Autore)',
      desc: selectedCategory === 'Sposta Data'
        ? `Spostamento richiesto da ${oldDate} a ${newDate} per l'articolo ${selectedItem.desc}`
        : formDesc || 'Nessun dettaglio aggiuntivo.',
      tags: selectedCategory === 'Sposta Data' ? ['sposta-data', 'logistica'] : ['generale'],
      assignee: 'Nessun assegnatario'
    };

    setActiveTickets([newRequest, ...activeTickets]);
    triggerNotification(`Richiesta ${nextId} (${selectedCategory}) salvata correttamente!`);

    // Clear state
    setSelectedCustomer(null);
    setSelectedItem(null);
    setOldDate('');
    setNewDate('');
    setFormSubject('');
    setFormDesc('');

    setSubView('hub');
  };

  const takeOwnership = (ticketId) => {
    const currentFormattedTime = getFormattedDateTime();
    // Search active tickets
    const updatedActive = activeTickets.map(t => {
      if (t.id === ticketId) {
        triggerNotification(`Ticket ${ticketId} preso in carico con successo.`);
        return { ...t, assignee: 'Key-Ticket Agent', lastUpdate: currentFormattedTime };
      }
      return t;
    });
    setActiveTickets(updatedActive);

    // Update current selected ticket reference if open
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, assignee: 'Key-Ticket Agent', lastUpdate: currentFormattedTime });
    }
  };

  const resolveTicket = (ticketId) => {
    const currentFormattedTime = getFormattedDateTime();
    const target = activeTickets.find(t => t.id === ticketId);
    if (!target) return;

    setActiveTickets(activeTickets.filter(t => t.id !== ticketId));

    const archived = {
      ...target,
      status: 'Resolved',
      lastUpdate: currentFormattedTime,
      resolution: 'Richiesta risolta e contrassegnata come chiusa.'
    };
    setHistoryTickets([archived, ...historyTickets]);
    triggerNotification(`Richiesta ${ticketId} archiviata correttamente.`);
    setSubView('active');
  };

  const closeOrRejectTicket = (ticketId) => {
    const currentFormattedTime = getFormattedDateTime();
    const target = activeTickets.find(t => t.id === ticketId);
    if (!target) return;

    setActiveTickets(activeTickets.filter(t => t.id !== ticketId));

    const archived = {
      ...target,
      status: 'Rejected',
      lastUpdate: currentFormattedTime,
      resolution: 'Ticket rifiutato o chiuso manualmente.'
    };
    setHistoryTickets([archived, ...historyTickets]);
    triggerNotification(`Richiesta ${ticketId} chiusa/rifiutata.`);
    setSubView('active');
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const ticketId = selectedTicket.id;
    const currentFormattedTime = getFormattedDateTime();
    const currentComments = ticketComments[ticketId] || [];
    const newComment = {
      author: 'Key-Ticket Agent',
      text: newCommentText,
      date: currentFormattedTime
    };

    setTicketComments({
      ...ticketComments,
      [ticketId]: [...currentComments, newComment]
    });

    const updatedSelected = { ...selectedTicket, lastUpdate: currentFormattedTime };
    setSelectedTicket(updatedSelected);

    // Update inside list state references
    setActiveTickets(activeTickets.map(t => t.id === ticketId ? { ...t, lastUpdate: currentFormattedTime } : t));
    setHistoryTickets(historyTickets.map(t => t.id === ticketId ? { ...t, lastUpdate: currentFormattedTime } : t));

    setNewCommentText('');
    triggerNotification('Commento inserito con successo.');
  };

  const handleOpenTicketDetails = (ticket, origin) => {
    setSelectedTicket(ticket);
    setPreviousView(origin);
    setSubView('ticket_detail');
  };

  const filteredLookupCustomers = mockCustomers.filter(cust =>
    cust.code.toLowerCase().includes(lookupSearch.toLowerCase()) ||
    cust.desc.toLowerCase().includes(lookupSearch.toLowerCase())
  );

  const filteredLookupItems = mockItems.filter(item =>
    item.code.toLowerCase().includes(lookupSearch.toLowerCase()) ||
    item.desc.toLowerCase().includes(lookupSearch.toLowerCase())
  );

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim() || !manualDesc.trim()) {
      return;
    }
    const customObj = { code: manualCode.toUpperCase(), desc: `${manualCode.toUpperCase()} — ${manualDesc}` };
    if (activeModal === 'customer') {
      setSelectedCustomer(customObj);
    } else {
      setSelectedItem(customObj);
    }
    setManualCode('');
    setManualDesc('');
    setManualInputActive(false);
    setActiveModal('none');
  };

  return (
    <div className="w-full min-h-screen bg-[#fafbfc] flex flex-col justify-start items-center ms-font select-none">
      <AzureStyleOverride />

      {/* Dynamic Global Top Banner Alerts */}
      {notification && (
        <div className="fixed top-16 left-4 right-4 z-[9999] bg-[#111111] text-white text-sm px-4 py-3.5 rounded-xl shadow-xl flex items-center justify-between gap-3 border border-neutral-800 fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-[#00a4ef]" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification('')} className="text-neutral-400 hover:text-white">
            <X size={16} />
          </button>
        </div>
      )}

      {!isLoggedIn ? (
        /* ================= MAIN MINIMALIST LOGIN PAGE ================= */
        <div className="w-full min-h-screen flex flex-col items-center justify-center p-4">
          <div className="flex flex-col items-center text-center space-y-7 -mt-16 fade-in">

            {/* Minimalist Corporate Logo */}
            <div className="relative w-20 h-20 flex items-center justify-center bg-white rounded-[22px] shadow-sm border border-neutral-100">
              <img src={logoImg} alt="Key-Ticket Logo" className="w-14 h-14 object-contain" />
            </div>

            {/* Title below logo */}
            <div>
              <h1 className="text-[34px] font-semibold text-[#1b1b1b] tracking-tight">
                Key-Ticket
              </h1>
            </div>

            {/* Authentic Microsoft style Sign In button with right facing arrow */}
            <div className="pt-2">
              {isLoggingIn ? (
                <div className="flex items-center justify-center w-[180px] h-[40px] bg-[#0067b8]">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                </div>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="flex items-center justify-center gap-3 bg-[#0067b8] hover:bg-[#005da6] active:bg-[#005292] text-white min-w-[180px] h-[40px] px-6 py-2 text-[15px] font-normal transition-all duration-150 shadow-sm rounded-none border-none cursor-pointer"
                >
                  <span>Sign in</span>
                  <ArrowRight size={16} strokeWidth={2.5} />
                </button>
              )}
            </div>

          </div>
        </div>
      ) : (
        /* ================= MAIN DYNAMICS BC WORKSPACE ================= */
        <div className="w-full min-h-screen flex flex-col bg-white fade-in">

          {/* Top Header Bar formatted like Microsoft Business Central */}
          <header className="w-full h-14 bg-[#1e1e1e] border-b border-[#2d2d2d] px-4 flex justify-between items-center z-50 shadow-sm shrink-0">

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 flex items-center justify-center bg-[#00a49f] rounded-lg">
                <TicketLogoIcon className="w-4 h-4 text-white" />
              </div>
              <span className="text-[14px] font-semibold text-white tracking-wide">
                Key Ticket
              </span>
            </div>

            <div className="flex items-center gap-3" ref={profileRef}>
              <button
                onClick={() => triggerNotification('Nessun nuovo avviso presente.')}
                className="relative p-1.5 hover:bg-neutral-800 rounded-full transition duration-150 text-neutral-300 hover:text-white"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#e81123] rounded-full"></span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-1 p-0.5 hover:bg-neutral-800 rounded-full transition duration-150"
                >
                  <div className="w-8 h-8 rounded-full bg-[#00a49f] text-white text-xs font-bold flex justify-center items-center shadow-inner uppercase">
                    KF
                  </div>
                  <ChevronDown size={14} className="text-neutral-400" />
                </button>

                {/* Minimalist Account dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 top-11 z-50 w-[200px] bg-white border border-[#d2d2d2] shadow-xl p-3.5 fade-in text-left rounded-lg">
                    <p className="text-[13px] font-bold text-[#1b1b1b] truncate mb-3">Key-Ticket Agent</p>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-center gap-2 border border-[#a80000] text-[#a80000] hover:bg-[#fde7e9] py-1.5 px-3 text-xs font-semibold transition duration-150 rounded-md"
                    >
                      <LogOut size={13} />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main workspace frame container */}
          <main className="flex-grow flex flex-col items-center justify-start overflow-y-auto w-full max-w-md mx-auto px-5 py-6">

            {subView === 'hub' && (
              /* ================= SUB-VIEW: 3-ACTION HORIZONTAL/VERTICAL HUB ================= */
              <div className="w-full flex flex-col items-center justify-center space-y-12 py-10 fade-in">

                {/* 1. BUTTON: CREA (Teal Style) */}
                <div className="flex flex-col items-center text-center">
                  <button
                    onClick={() => setSubView('create_select')}
                    className="w-[82px] h-[82px] rounded-full bg-[#e1f5f4] hover:bg-[#c9eeec] active:scale-95 text-[#009b96] flex items-center justify-center shadow-sm cursor-pointer transition-all duration-200"
                  >
                    <img src={img204} alt="Crea" className="w-[42px] h-[42px] object-contain" />
                  </button>
                  <span className="text-[15px] font-semibold text-[#1a1a1a] mt-3">
                    Crea
                  </span>
                </div>

                {/* 2. BUTTON: VISUALIZZA (Old Classic Structured List Style) */}
                <div className="flex flex-col items-center text-center">
                  <button
                    onClick={() => setSubView('active')}
                    className="w-[82px] h-[82px] rounded-full bg-[#e3effb] hover:bg-[#ccdff7] active:scale-95 text-[#0066d6] flex items-center justify-center shadow-sm cursor-pointer transition-all duration-200"
                  >
                    <ListCustomIcon className="w-9 h-9 text-black" />
                  </button>
                  <span className="text-[15px] font-semibold text-[#1a1a1a] mt-3">
                    Visualizza
                  </span>
                  <span className="text-[12px] text-[#737373] font-normal mt-0.5">
                    {activeTickets.length} aperte
                  </span>
                </div>

                {/* 3. BUTTON: STORICO (Purple Style) */}
                <div className="flex flex-col items-center text-center">
                  <button
                    onClick={() => setSubView('history')}
                    className="w-[82px] h-[82px] rounded-full bg-[#f0ebf8] hover:bg-[#e2d8f3] active:scale-95 text-[#633cb3] flex items-center justify-center shadow-sm cursor-pointer transition-all duration-200"
                  >
                    <img src={img205} alt="Storico" className="w-9 h-9 object-contain" />
                  </button>
                  <span className="text-[15px] font-semibold text-[#1a1a1a] mt-3">
                    Storico
                  </span>
                  <span className="text-[12px] text-[#737373] font-normal mt-0.5">
                    {historyTickets.length} chiuse
                  </span>
                </div>

              </div>
            )}

            {subView === 'create_select' && (
              /* ================= SUB-VIEW: CATEGORY SELECTION ("Nuova richiesta") ================= */
              /* Styled after image_81f0e6.png */
              <div className="w-full flex flex-col items-start justify-start space-y-6 py-2 fade-in">

                <button
                  onClick={() => setSubView('hub')}
                  className="w-10 h-10 rounded-full border border-neutral-200 bg-white flex items-center justify-center hover:bg-neutral-50 active:scale-95 transition shadow-sm cursor-pointer"
                >
                  <ArrowLeft size={18} className="text-neutral-700" />
                </button>

                <div className="space-y-1">
                  <h2 className="text-[28px] font-light text-neutral-800 tracking-tight leading-tight">
                    Nuova richiesta
                  </h2>
                  <p className="text-[14px] text-neutral-400 font-normal">
                    Scegli richiesta
                  </p>
                </div>

                {/* Category lists styled exactly as image_81f0e6.png */}
                <div className="w-full flex flex-col space-y-4 pt-2">

                  {/* Card 1: Sposta Data */}
                  <div className="w-full bg-white border border-neutral-200 rounded-lg overflow-hidden ms-card-shadow flex flex-col">
                    <div className="h-1 w-full bg-[#00a49f]"></div>
                    <div className="p-4 flex items-center justify-between">
                      <span className="text-[15px] font-semibold text-neutral-800">Sposta Data</span>
                      <button
                        onClick={() => { setSelectedCategory('Sposta Data'); setSubView('create_form'); }}
                        className="text-[#00a49f] text-[13px] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        Seleziona <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Card 2: Non Conformità */}
                  <div className="w-full bg-white border border-neutral-200 rounded-lg overflow-hidden ms-card-shadow flex flex-col">
                    <div className="h-1 w-full bg-[#d83b01]"></div>
                    <div className="p-4 flex items-center justify-between">
                      <span className="text-[15px] font-semibold text-neutral-800">Non Conformità</span>
                      <button
                        onClick={() => { setSelectedCategory('Non Conformità'); setSubView('create_form'); }}
                        className="text-[#d83b01] text-[13px] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        Seleziona <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Card 3: Sollecito */}
                  <div className="w-full bg-white border border-neutral-200 rounded-lg overflow-hidden ms-card-shadow flex flex-col">
                    <div className="h-1 w-full bg-[#ffb900]"></div>
                    <div className="p-4 flex items-center justify-between">
                      <span className="text-[15px] font-semibold text-neutral-800">Sollecito</span>
                      <button
                        onClick={() => { setSelectedCategory('Sollecito'); setSubView('create_form'); }}
                        className="text-[#ffb900] text-[13px] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        Seleziona <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Card 4: Giacenza Articolo */}
                  <div className="w-full bg-white border border-neutral-200 rounded-lg overflow-hidden ms-card-shadow flex flex-col">
                    <div className="h-1 w-full bg-[#0078d4]"></div>
                    <div className="p-4 flex items-center justify-between">
                      <span className="text-[15px] font-semibold text-neutral-800">Giacenza Articolo</span>
                      <button
                        onClick={() => { setSelectedCategory('Giacenza Articolo'); setSubView('create_form'); }}
                        className="text-[#0078d4] text-[13px] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        Seleziona <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {subView === 'create_form' && (
              /* ================= SUB-VIEW: DETAIL REQUEST FORM ================= */
              <div className="w-full flex flex-col items-start justify-start space-y-6 py-2 fade-in">

                <button
                  onClick={() => setSubView('create_select')}
                  className="w-10 h-10 rounded-full border border-neutral-200 bg-white flex items-center justify-center hover:bg-neutral-50 active:scale-95 transition shadow-sm cursor-pointer"
                >
                  <ArrowLeft size={18} className="text-neutral-700" />
                </button>

                {/* Conditional Form Layout: SPOSTA DATA vs OTHERS */}
                {selectedCategory === 'Sposta Data' ? (
                  /* SPOSTA DATA PAGE FORM modeled after image_81f545.png with modern layout changes */
                  <div className="w-full space-y-5">

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-[26px] font-light text-neutral-800 tracking-tight leading-tight">
                          Nuova richiesta
                        </h2>
                        <span className="text-teal-600 cursor-pointer hover:opacity-80">
                          <Info size={18} />
                        </span>
                      </div>
                      <p className="text-[13px] text-neutral-500 font-semibold uppercase tracking-wider">
                        Sposta Data
                      </p>
                    </div>

                    {/* Generale Tab Header Section */}
                    <div className="border-b border-neutral-200 pb-2">
                      <span className="text-sm font-semibold text-[#00a49f] pb-2.5 border-b-2 border-[#00a49f] inline-block">
                        Generale
                      </span>
                    </div>

                    <form onSubmit={handleCreateRequest} className="space-y-5">

                      {/* Nome Cliente Input with lookup modal trigger - Modernized layout */}
                      <div className="space-y-1">
                        <label className="block text-[12px] font-semibold text-neutral-600">
                          Nome cliente
                        </label>
                        <div
                          onClick={() => { setLookupSearch(''); setActiveModal('customer'); }}
                          className="w-full px-3.5 py-3 rounded-xl border border-neutral-200 hover:border-neutral-300 bg-neutral-50 flex justify-between items-center cursor-pointer transition"
                        >
                          <span className={selectedCustomer ? "text-neutral-800 text-sm font-medium" : "text-neutral-400 text-sm"}>
                            {selectedCustomer ? selectedCustomer.desc : "Seleziona nome cliente..."}
                          </span>
                          <Search size={16} className="text-neutral-400" />
                        </div>
                      </div>

                      {/* Numero articolo Input with lookup modal trigger - Modernized layout */}
                      <div className="space-y-1">
                        <label className="block text-[12px] font-semibold text-neutral-600">
                          Numero articolo
                        </label>
                        <div
                          onClick={() => { setLookupSearch(''); setActiveModal('item'); }}
                          className="w-full px-3.5 py-3 rounded-xl border border-neutral-200 hover:border-neutral-300 bg-neutral-50 flex justify-between items-center cursor-pointer transition"
                        >
                          <span className={selectedItem ? "text-neutral-800 text-sm font-medium" : "text-neutral-400 text-sm"}>
                            {selectedItem ? selectedItem.desc : "Seleziona numero articolo..."}
                          </span>
                          <Search size={16} className="text-neutral-400" />
                        </div>
                      </div>

                      {/* Date selection rows */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[12px] font-semibold text-neutral-600">
                            Vecchia data
                          </label>
                          <div className="relative">
                            <input
                              type="date"
                              value={oldDate}
                              onChange={(e) => setOldDate(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:border-[#00a49f] focus:ring-1 focus:ring-[#00a49f] outline-none text-sm transition bg-neutral-50/50 focus:bg-white"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[12px] font-semibold text-neutral-600">
                            Nuova data
                          </label>
                          <div className="relative">
                            <input
                              type="date"
                              value={newDate}
                              onChange={(e) => setNewDate(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:border-[#00a49f] focus:ring-1 focus:ring-[#00a49f] outline-none text-sm transition bg-neutral-50/50 focus:bg-white"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Action buttons configured after image_81f545.png */}
                      <div className="flex gap-3 justify-end pt-5 border-t border-neutral-100">
                        <button
                          type="button"
                          onClick={() => setSubView('create_select')}
                          className="px-5 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 text-sm font-semibold transition"
                        >
                          Annulla
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-[#00a49f] hover:bg-[#008f8a] text-white text-sm font-semibold transition shadow-md"
                        >
                          Salva
                        </button>
                      </div>

                    </form>

                  </div>
                ) : (
                  /* Standard dynamic form for other request categories */
                  <div className="w-full space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wide">
                        {selectedCategory}
                      </span>
                      <h2 className="text-[26px] font-light text-neutral-800 tracking-tight leading-tight">
                        Dettagli Richiesta
                      </h2>
                    </div>

                    <div className="w-full bg-white border border-neutral-200 p-5 rounded-2xl ms-card-shadow space-y-4">
                      <form onSubmit={handleCreateRequest} className="space-y-4">
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                            Oggetto <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., Segnalazione anomalia carico..."
                            value={formSubject}
                            onChange={(e) => setFormSubject(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:border-[#0078d4] focus:ring-1 focus:ring-[#0078d4] outline-none text-sm transition bg-neutral-50/50"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2">
                            Priorità
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {['Low', 'Medium', 'High'].map((level) => {
                              const isSelected = formUrgency === level;
                              const colors = level === 'High'
                                ? 'border-red-200 bg-red-50 text-red-700'
                                : level === 'Medium'
                                  ? 'border-amber-200 bg-amber-50 text-amber-700'
                                  : 'border-green-200 bg-green-50 text-green-700';

                              return (
                                <button
                                  key={level}
                                  type="button"
                                  onClick={() => setFormUrgency(level)}
                                  className={`py-2 rounded-xl text-xs font-semibold border transition text-center ${isSelected ? `${colors} ring-1 ring-neutral-400` : 'border-neutral-200 text-neutral-600 bg-white hover:bg-neutral-50'
                                    }`}
                                >
                                  {level === 'High' ? 'Alta' : level === 'Medium' ? 'Media' : 'Bassa'}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                            Note descrittive
                          </label>
                          <textarea
                            placeholder="Inserisci dettagli aggiuntivi..."
                            rows={3}
                            value={formDesc}
                            onChange={(e) => setFormDesc(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:border-[#0078d4] focus:ring-1 focus:ring-[#0078d4] outline-none text-sm transition bg-neutral-50/50 resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 rounded-xl bg-[#0067b8] hover:bg-[#005da6] text-white text-sm font-semibold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Invia Richiesta</span>
                          <ArrowRight size={15} />
                        </button>
                      </form>
                    </div>
                  </div>
                )}

              </div>
            )}

            {subView === 'active' && (
              /* ================= SUB-VIEW: ACTIVE REQUESTS LIST ================= */
              <div className="w-full space-y-5 py-2 fade-in">

                <div className="flex items-center justify-between pb-2">
                  <button
                    onClick={() => setSubView('hub')}
                    className="flex items-center gap-2 text-neutral-500 hover:text-neutral-800 text-sm font-semibold transition"
                  >
                    <ArrowLeft size={16} />
                    <span>Torna alla Hub</span>
                  </button>
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Aperte ({activeTickets.length})</span>
                </div>

                {activeTickets.length === 0 ? (
                  <div className="bg-white border border-neutral-200 p-8 rounded-2xl text-center ms-card-shadow space-y-3">
                    <CheckCircle className="text-[#009b96] mx-auto w-12 h-12" />
                    <p className="font-bold text-neutral-700">Tutto risolto!</p>
                    <p className="text-xs text-neutral-400">Non ci sono ticket attivi in sospeso.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        onClick={() => handleOpenTicketDetails(ticket, 'active')}
                        className="bg-white border border-neutral-200 p-4 rounded-2xl ms-card-shadow space-y-3 hover:border-neutral-300 transition cursor-pointer"
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-[#0078d4] tracking-wider uppercase bg-blue-50 px-2 py-0.5 rounded-md">
                              {ticket.id}
                            </span>
                            <span className="ml-2 text-[10px] font-bold text-neutral-400 tracking-wider">
                              {ticket.category}
                            </span>
                            <h4 className="font-bold text-neutral-850 text-base mt-1.5">{ticket.subject}</h4>
                            <p className="text-xs text-neutral-500 font-semibold mt-0.5">{ticket.customer}</p>
                          </div>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ticket.urgency === 'High'
                            ? 'bg-red-50 text-red-700 border border-red-100'
                            : ticket.urgency === 'Medium'
                              ? 'bg-amber-50 text-amber-700 border border-amber-100'
                              : 'bg-green-50 text-green-700 border border-green-100'
                            }`}>
                            {ticket.urgency === 'High' ? 'Alta' : ticket.urgency === 'Medium' ? 'Media' : 'Bassa'}
                          </span>
                        </div>

                        {ticket.desc && (
                          <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed bg-neutral-50 p-2.5 rounded-lg border border-neutral-100">
                            {ticket.desc}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                          <span className="text-[10px] text-neutral-400 font-medium flex items-center gap-1">
                            <Clock size={11} /> Creato il {ticket.creationDate || ticket.date}
                          </span>

                          <span className="text-xs text-[#00a49f] font-semibold flex items-center gap-1 hover:underline">
                            Dettagli <ChevronRight size={13} />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {subView === 'history' && (
              /* ================= SUB-VIEW: REQUESTS ARCHIVE HISTORY ================= */
              <div className="w-full space-y-5 py-2 fade-in">

                <div className="flex items-center justify-between pb-2">
                  <button
                    onClick={() => setSubView('hub')}
                    className="flex items-center gap-2 text-neutral-500 hover:text-neutral-800 text-sm font-semibold transition"
                  >
                    <ArrowLeft size={16} />
                    <span>Torna alla Hub</span>
                  </button>
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Storico ({historyTickets.length})</span>
                </div>

                {historyTickets.length === 0 ? (
                  <div className="bg-white border border-neutral-200 p-6 rounded-2xl text-center ms-card-shadow">
                    <p className="text-sm text-neutral-400">Nessun ticket archiviato presente nello storico.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {historyTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        onClick={() => handleOpenTicketDetails(ticket, 'history')}
                        className="bg-white border border-neutral-200 p-4 rounded-2xl ms-card-shadow space-y-2.5 hover:border-neutral-300 transition cursor-pointer"
                      >

                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold text-neutral-400 tracking-wider">
                              {ticket.id} • {ticket.creationDate || ticket.date} • {ticket.category}
                            </span>
                            <h4 className="font-bold text-neutral-850 text-sm mt-0.5">{ticket.subject}</h4>
                            <p className="text-xs text-neutral-500 mt-0.5">{ticket.customer}</p>
                          </div>

                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${ticket.status === 'Resolved'
                            ? 'bg-green-50 text-green-700 border border-green-100'
                            : 'bg-red-50 text-red-700 border border-red-100'
                            }`}>
                            <CheckCircle size={10} />
                            <span>{ticket.status === 'Resolved' ? 'Risolto' : 'Rifiutato'}</span>
                          </span>
                        </div>

                        <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-100 space-y-1">
                          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Nota di Chiusura</span>
                          <p className="text-xs text-neutral-500 leading-relaxed italic">
                            "{ticket.resolution}"
                          </p>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {subView === 'ticket_detail' && selectedTicket && (
              /* ================= SUB-VIEW: HIGH-FIDELITY TICKET DETAILS ================= */
              /* Inspired by WhatsApp Image 2026-07-09 at 11.32.00.jpeg and updated for modern layout */
              <div className="w-full space-y-5 py-2 fade-in">

                {/* Back Navigation Bar */}
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                  <button
                    onClick={() => setSubView(previousView)}
                    className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-800 text-sm font-semibold transition"
                  >
                    <ArrowLeft size={16} />
                    <span>Torna alla lista</span>
                  </button>
                  <span className="text-xs font-bold text-[#00a49f] uppercase tracking-widest">{selectedTicket.id}</span>
                </div>

                {/* Tags Block Section */}
                <div className="space-y-1 bg-white p-4 rounded-2xl border border-neutral-100 ms-card-shadow">
                  <span className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Tag</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedTicket.tags && selectedTicket.tags.length > 0 ? (
                      selectedTicket.tags.map((tag, idx) => (
                        <span key={idx} className="bg-neutral-100 text-neutral-700 text-xs px-2.5 py-1 rounded-full border border-neutral-200 font-medium lowercase">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-neutral-400 italic">Nessun tag configurato.</span>
                    )}
                  </div>
                </div>

                {/* Description Block Section */}
                <div className="space-y-1 bg-white p-4 rounded-2xl border border-neutral-100 ms-card-shadow">
                  <span className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Descrizione</span>
                  <p className="text-sm text-neutral-800 leading-relaxed pt-1 font-normal">
                    {selectedTicket.desc}
                  </p>
                </div>

                {/* Comment History Timeline Section */}
                <div className="space-y-2.5 bg-white p-4 rounded-2xl border border-neutral-100 ms-card-shadow">
                  <span className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Commenti</span>

                  <div className="space-y-3 pt-1">
                    {!(ticketComments[selectedTicket.id]) || ticketComments[selectedTicket.id].length === 0 ? (
                      <p className="text-xs text-neutral-400 italic">Nessun commento presente.</p>
                    ) : (
                      ticketComments[selectedTicket.id].map((comment, idx) => (
                        <div key={idx} className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 text-left space-y-1.5">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-bold text-[#00a49f]">{comment.author}</span>
                            <span className="text-neutral-400">{comment.date}</span>
                          </div>
                          <p className="text-xs text-neutral-700 leading-normal">{comment.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add New Comment Block */}
                  <form onSubmit={handleAddComment} className="pt-4 border-t border-neutral-100 space-y-2">
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase">Nuovo commento</label>
                    <textarea
                      placeholder="Scrivi un commento..."
                      rows={2}
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:border-[#00a49f] focus:ring-1 focus:ring-[#00a49f] outline-none text-xs bg-neutral-50 focus:bg-white resize-none transition"
                      required
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-[#00a49f] hover:bg-[#008f8a] text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-sm cursor-pointer"
                      >
                        Commenta
                      </button>
                    </div>
                  </form>
                </div>

                {/* Actions and Metadata Combined Panel Card */}
                {/* Styled precisely as shown in WhatsApp Image 2026-07-09 at 11.32.00 (1).jpeg */}
                <div className="bg-white p-5 rounded-2xl border border-neutral-100 ms-card-shadow space-y-4">

                  <span className="block text-sm font-semibold text-neutral-800">Azioni</span>

                  {/* Action Link items */}
                  <div className="space-y-2.5">

                    {/* Action 1: Prendi in carico (Take ownership) */}
                    <button
                      onClick={() => takeOwnership(selectedTicket.id)}
                      disabled={selectedTicket.assignee === 'Key-Ticket Agent'}
                      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl border text-xs font-semibold transition text-left ${selectedTicket.assignee === 'Key-Ticket Agent'
                        ? 'border-neutral-100 bg-neutral-50 text-neutral-400 cursor-not-allowed'
                        : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 active:scale-[0.99]'
                        }`}
                    >
                      {selectedTicket.assignee === 'Key-Ticket Agent' ? (
                        <UserCheck size={16} className="text-[#00a49f]" />
                      ) : (
                        <User size={16} className="text-neutral-400" />
                      )}
                      <span>
                        {selectedTicket.assignee === 'Key-Ticket Agent' ? 'Sei già assegnatario' : 'Prendi in carico'}
                      </span>
                    </button>

                    {/* Action 2: Segna come risolto */}
                    {previousView === 'active' && (
                      <button
                        onClick={() => resolveTicket(selectedTicket.id)}
                        className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 font-semibold text-xs active:scale-[0.99] transition text-left"
                      >
                        <Check size={16} className="text-green-500" />
                        <span>Segna come risolto</span>
                      </button>
                    )}

                    {/* Action 3: Chiudi ticket */}
                    {previousView === 'active' && (
                      <button
                        onClick={() => closeOrRejectTicket(selectedTicket.id)}
                        className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl border border-red-100 bg-red-50/20 hover:bg-red-50/50 text-red-700 font-semibold text-xs active:scale-[0.99] transition text-left"
                      >
                        <X size={16} className="text-red-500" />
                        <span>Chiudi ticket</span>
                      </button>
                    )}

                  </div>

                  {/* Horizontal visual divider */}
                  <div className="border-t border-neutral-100 pt-4 space-y-2.5 text-xs text-neutral-500 font-semibold">

                    {/* Metadata item 1: Segnalato da */}
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-neutral-400" />
                      <span>Segnalato da: <span className="text-neutral-700 font-normal">{selectedTicket.reportedBy || "Cliente Occasionale"}</span></span>
                    </div>

                    {/* Metadata item 2: Assignee */}
                    <div className="flex items-center gap-2">
                      <UserCheck size={14} className="text-neutral-400" />
                      <span>Assegnatario: <span className="text-neutral-700 font-normal">{selectedTicket.assignee}</span></span>
                    </div>

                    {/* Metadata item 3: Creation Date */}
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-neutral-400" />
                      <span>Data creazione: <span className="text-neutral-700 font-normal">{selectedTicket.creationDate || selectedTicket.date}</span></span>
                    </div>

                    {/* Metadata item 4: Last Update */}
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-neutral-400" />
                      <span>Ultimo aggiornamento: <span className="text-neutral-700 font-normal">{selectedTicket.lastUpdate || selectedTicket.date}</span></span>
                    </div>

                    {/* Metadata item 5: Tags count summary */}
                    <div className="flex items-center gap-2">
                      <TagIcon size={14} className="text-neutral-400" />
                      <span>{selectedTicket.tags ? selectedTicket.tags.length : 0} tag</span>
                    </div>

                  </div>

                </div>

              </div>
            )}

          </main>

        </div>
      )}

      {/* ================= HIGH FIDELITY LOOKUP MODALS ================= */}
      {activeModal !== 'none' && (
        <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center p-0 sm:p-4 modal-backdrop fade-in">
          <div className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border border-neutral-200">

            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-neutral-100 flex justify-between items-center bg-white sticky top-0">
              <h3 className="text-base font-semibold text-neutral-800">
                {activeModal === 'customer' ? "Seleziona cliente" : "Seleziona articolo"}
              </h3>
              <button
                onClick={() => { setActiveModal('none'); setManualInputActive(false); }}
                className="p-1 rounded-full hover:bg-neutral-100 transition text-neutral-500"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Search Input mimicking screenshots */}
            <div className="p-4 bg-neutral-50 border-b border-neutral-100 space-y-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Cerca per nome o codice..."
                  value={lookupSearch}
                  onChange={(e) => setLookupSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 outline-none text-sm transition bg-white focus:ring-1 focus:ring-[#00a49f] focus:border-[#00a49f]"
                />
              </div>
            </div>

            {/* Main Selection Tables */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">

              {manualInputActive ? (
                /* Manual Input Form Triggered by "+ Altro" */
                <form onSubmit={handleManualSubmit} className="space-y-4 p-2 fade-in">
                  <p className="text-xs text-neutral-500">Inserimento manuale dei dettagli del record non presente a sistema:</p>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase">Codice Nuovo</label>
                    <input
                      type="text"
                      placeholder="e.g. C099 o ART-9999"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase">Descrizione / Nome</label>
                    <input
                      type="text"
                      placeholder="e.g. Custom client..."
                      value={manualDesc}
                      onChange={(e) => setManualDesc(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm outline-none"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setManualInputActive(false)}
                      className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold"
                    >
                      Annulla
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-[#00a49f] text-white text-xs font-semibold"
                    >
                      Conferma
                    </button>
                  </div>
                </form>
              ) : (
                /* Standard dynamic table list built from screenshot guidelines */
                <div className="w-full">
                  <div className="grid grid-cols-12 gap-2 pb-2 text-[11px] font-bold text-neutral-400 tracking-wider uppercase border-b border-neutral-100">
                    <div className="col-span-3">Codice</div>
                    <div className="col-span-9">Descrizione</div>
                  </div>

                  <div className="divide-y divide-neutral-100 overflow-y-auto max-h-[40vh] mt-1">
                    {activeModal === 'customer' ? (
                      /* Rendering Customer Table rows */
                      filteredLookupCustomers.length === 0 ? (
                        <p className="text-xs text-neutral-400 py-4 text-center">Nessun cliente trovato.</p>
                      ) : (
                        filteredLookupCustomers.map((cust) => (
                          <div
                            key={cust.code}
                            onClick={() => { setSelectedCustomer(cust); setActiveModal('none'); }}
                            className="grid grid-cols-12 gap-2 py-3 items-center hover:bg-neutral-50 cursor-pointer transition"
                          >
                            <div className="col-span-3 text-[#00a49f] hover:underline font-semibold text-xs">
                              {cust.code}
                            </div>
                            <div className="col-span-9 text-neutral-700 text-xs">
                              {cust.desc}
                            </div>
                          </div>
                        ))
                      )
                    ) : (
                      /* Rendering Items Table rows */
                      filteredLookupItems.length === 0 ? (
                        <p className="text-xs text-neutral-400 py-4 text-center">Nessun articolo trovato.</p>
                      ) : (
                        filteredLookupItems.map((item) => (
                          <div
                            key={item.code}
                            onClick={() => { setSelectedItem(item); setActiveModal('none'); }}
                            className="grid grid-cols-12 gap-2 py-3 items-center hover:bg-neutral-50 cursor-pointer transition"
                          >
                            <div className="col-span-3 text-[#00a49f] hover:underline font-semibold text-xs">
                              {item.code}
                            </div>
                            <div className="col-span-9 text-neutral-700 text-xs">
                              {item.desc}
                            </div>
                          </div>
                        ))
                      )
                    )}
                  </div>

                  {/* Manual entry row styled after screenshots */}
                  <div
                    onClick={() => setManualInputActive(true)}
                    className="border-t border-neutral-200 pt-3 mt-2 text-[#00a49f] hover:text-[#008f8a] text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus size={14} />
                    <span>+ Altro (inserimento manuale)</span>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}