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
  UserCheck,
  Trash2,
  UploadCloud,
  Paperclip,
  Users,
  Edit
} from 'lucide-react';

import logoImg from './assets/media__1783603526191.png';
import img204 from './assets/media__1783603526204.png';
import img205 from './assets/media__1783603526205.png';

const CATEGORIES = [
  { name: 'Sposta Data', color: '#00a49f', info: 'Modifica la data di consegna o scadenza associata a cliente e articolo.' },
  { name: 'Non Conformità', color: '#d83b01', info: 'Segnala una non conformità di prodotto, documenti o consegna.' },
  { name: 'Sollecito', color: '#ffb900', info: 'Invia un sollecito per attività o documenti in attesa.' },
  { name: 'Giacenza Articolo', color: '#0078d4', info: 'Verifica la disponibilità e giacenza di un articolo.' },
  { name: 'Reso Merce', color: '#5c2d91', info: 'Gestisci un reso merce con motivazione e dati logistici.' },
  { name: 'Variazione Prezzo', color: '#8764b8', info: 'Proponi o richiedi una variazione di prezzo.' },
  { name: 'Blocco Ordine', color: '#a80000', info: 'Richiedi il blocco amministrativo o operativo di un ordine.' },
  { name: 'Sblocco Ordine', color: '#107c41', info: 'Richiedi lo sblocco di un ordine sospeso.' },
  { name: 'Verifica Pagamento', color: '#0078d4', info: 'Verifica lo stato contabile o l\'avvenuto pagamento.' },
  { name: 'Aggiornamento Anagrafica', color: '#002050', info: 'Aggiorna i dettagli di anagrafica clienti o contatti.' },
  { name: 'Richiesta Fattura', color: '#7f7f7f', info: 'Richiedi emissione, rettifica o copia di una fattura.' },
  { name: 'Reclamo Trasporto', color: '#7a24db', info: 'Segnala problemi o anomalie legate alla spedizione.' },
  { name: 'Priorità Consegna', color: '#d83b01', info: 'Richiedi la priorità o sollecito di una consegna.' },
  { name: 'Richiesta Documenti', color: '#008272', info: 'Richiedi certificati, schede tecniche o altri documenti.' },
  { name: 'Cambio Vettore', color: '#8a8a8a', info: 'Richiedi il cambio del vettore incaricato del trasporto.' }
];

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

  // Form tabbed functionality (Details, Note, Allegati)
  const [formTab, setFormTab] = useState('details'); // 'details' | 'notes' | 'attachments'
  const [formNotes, setFormNotes] = useState([]);
  const [newFormNoteText, setNewFormNoteText] = useState('');
  const [formAttachments, setFormAttachments] = useState([]);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [draftTicket, setDraftTicket] = useState(null);
  const [showCancelWarning, setShowCancelWarning] = useState(false);
  const [cancelTarget, setCancelTarget] = useState('hub');
  const [newCommentText, setNewCommentText] = useState('');

  // Ticket detail view state
  const [ticketDetailTab, setTicketDetailTab] = useState('details'); // 'details' | 'notes' | 'attachments' | 'actions'
  const [editTicketSubject, setEditTicketSubject] = useState('');
  const [editTicketDesc, setEditTicketDesc] = useState('');

  const [ticketComments, setTicketComments] = useState({
    'KT-1004': [
      { author: 'Laura Conti', text: 'Ho verificato lo stato della spedizione su BC, sembra tutto pronto.', date: '08/07/2026 14:23' }
    ],
    'KT-1005': [
      { author: 'System Operator', text: 'Token cache reset successfully, waiting for client refresh.', date: '09/07/2026 09:12' }
    ]
  });

  const mockTeamMembers = [
    { name: 'Marco Rossi', role: 'Agente Senior', avatar: 'MR', open: 2, resolved: 12 },
    { name: 'Laura Conti', role: 'Agente', avatar: 'LC', open: 1, resolved: 8 },
    { name: 'Andrea Ferri', role: 'Sviluppatore', avatar: 'AF', open: 1, resolved: 5 },
    { name: 'Sara Mancini', role: 'Support Manager', avatar: 'SM', open: 0, resolved: 20 },
  ];

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

  const [notifications, setNotifications] = useState([
    {
      id: 'N-001',
      ticketId: 'KT-1004',
      title: 'Nuovo commento sul ticket KT-1004',
      desc: 'Laura Conti ha aggiunto: "Ho verificato lo stato..."',
      date: '08/07/2026 14:24',
      read: false
    },
    {
      id: 'N-002',
      ticketId: 'KT-1005',
      title: 'Ticket assegnato',
      desc: 'Il ticket KT-1005 OAuth Consent Token Cycle è stato assegnato a te.',
      date: '09/07/2026 09:13',
      read: false
    },
    {
      id: 'N-003',
      ticketId: 'KT-1007',
      title: 'Sollecito ricevuto',
      desc: 'Il cliente ha sollecitato il ticket KT-1007 Inventory Sync Delay.',
      date: '09/07/2026 12:45',
      read: true
    }
  ]);

  const handleOpenNotificationTicket = (ticketId) => {
    const ticket = activeTickets.find(t => t.id === ticketId) || historyTickets.find(t => t.id === ticketId);
    if (ticket) {
      handleOpenTicketDetails(ticket, 'notifications');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const [activeCategoryFilter, setActiveCategoryFilter] = useState('Tutte');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');

  const filteredActiveTickets = activeTickets.filter(ticket => {
    const matchesCategory = activeCategoryFilter === 'Tutte' || ticket.category === activeCategoryFilter;
    const matchesSearch = activeSearchQuery === '' ||
      ticket.subject.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(activeSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync URL hash with subView state and enforce login view if unauthenticated
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (!isLoggedIn && hash !== '#/login') {
        window.location.hash = '#/login';
        return;
      }
      if (isLoggedIn && (hash === '#/login' || hash === '')) {
        window.location.hash = '#/hub';
        return;
      }
      const view = getSubViewFromHash();
      _setSubView(view);
    };
    window.addEventListener('hashchange', handleHashChange);

    // Set initial redirect based on auth status
    if (!isLoggedIn) {
      window.location.hash = '#/login';
    } else if (!window.location.hash || window.location.hash === '#/login') {
      window.location.hash = '#/hub';
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [isLoggedIn]);

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

  const handleSelectCategory = (categoryName) => {
    setSelectedCategory(categoryName);
    setFormTab('details');
    setFormNotes([]);
    setNewFormNoteText('');
    setFormAttachments([]);
    setSubView('create_form');
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
      tags: selectedCategory === 'Sposta Data' ? ['sposta-data', 'logistica'] : [selectedCategory.toLowerCase().replace(/\s+/g, '-')],
      assignee: 'Nessun assegnatario',
      attachmentsCount: formAttachments.length,
      attachmentsList: formAttachments
    };

    setDraftTicket(newRequest);
    setSubView('create_review');
  };

  const handleConfirmTicket = () => {
    if (!draftTicket) return;

    // Save notes to comments state
    if (formNotes.length > 0) {
      const newComments = formNotes.map(note => ({
        author: 'Key-Ticket Agent',
        text: note,
        date: draftTicket.creationDate
      }));
      setTicketComments(prev => ({
        ...prev,
        [draftTicket.id]: newComments
      }));
    }

    setActiveTickets([draftTicket, ...activeTickets]);
    triggerNotification(`Richiesta ${draftTicket.id} (${draftTicket.category}) salvata correttamente!`);

    // Clear state
    setSelectedCustomer(null);
    setSelectedItem(null);
    setOldDate('');
    setNewDate('');
    setFormSubject('');
    setFormDesc('');
    setFormNotes([]);
    setFormAttachments([]);
    setFormUrgency('Medium');
    setDraftTicket(null);
    setSubView('active');
  };

  const handleCancelForm = (target = 'hub') => {
    setCancelTarget(target);
    setShowCancelWarning(true);
  };

  const executeCancel = () => {
    setShowCancelWarning(false);
    setSelectedCustomer(null);
    setSelectedItem(null);
    setOldDate('');
    setNewDate('');
    setFormSubject('');
    setFormDesc('');
    setFormNotes([]);
    setFormAttachments([]);
    setFormUrgency('Medium');
    setDraftTicket(null);
    setSubView(cancelTarget);
  };

  const abortCancel = () => {
    setShowCancelWarning(false);
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
    <div className="w-full h-[100dvh] bg-[#fafbfc] flex flex-col justify-start items-center ms-font select-none overflow-hidden overscroll-none">
      <AzureStyleOverride />

      {/* SVG Filter to remove white background from PNG logo */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <defs>
          <filter id="remove-white">
            <feColorMatrix type="matrix" values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              -2 -2 -2 5.8 0
            " />
          </filter>
        </defs>
      </svg>

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
        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-white overflow-hidden">
          <div className="flex flex-col items-center text-center space-y-8 -mt-16 fade-in">

            {/* Clean Logo without box */}
            <img src={logoImg} alt="Key Ticket Logo" className="w-[180px] h-[150px] object-contain" style={{ filter: 'url(#remove-white)' }} />

            {/* Title below logo */}
            <div className="pb-2">
              <h1 className="text-[30px] font-light text-[#4a4a4a] tracking-[0.18em] uppercase">
                Key Ticket
              </h1>
            </div>

            {/* Teal Sign In button */}
            <div>
              {isLoggingIn ? (
                <div className="flex items-center justify-center w-[180px] h-[45px] bg-[#009b96]">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                </div>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="flex items-center justify-center gap-2 bg-[#009b96] hover:bg-[#008782] active:bg-[#00736e] text-white w-[180px] h-[45px] text-[15px] font-normal transition-all duration-150 border-none cursor-pointer"
                >
                  <span>Sign In</span>
                  <span className="text-[16px] translate-y-[-1px] font-light">&rarr;</span>
                </button>
              )}
            </div>

          </div>
        </div>
      ) : (
        /* ================= MAIN DYNAMICS BC WORKSPACE ================= */
        <div className="w-full h-full flex flex-col bg-[#f0f0f0] fade-in overflow-hidden">

          {/* Top Header Bar formatted like Microsoft Business Central */}
          <header className="w-full h-14 bg-[#1e1e1e] border-b border-[#2d2d2d] px-4 flex justify-between items-center z-50 shadow-sm shrink-0">

            <div
              className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setSubView('hub')}
            >
              <img src={logoImg} alt="Key-Ticket Logo" className="w-7 h-7 object-contain" style={{ filter: 'url(#remove-white)' }} />
              <span className="text-[14px] font-semibold text-white tracking-wide">
                Key-Ticket
              </span>
            </div>

            <div className="flex items-center gap-3" ref={profileRef}>
              <button
                onClick={() => setSubView('notifications')}
                className="relative p-1.5 hover:bg-neutral-800 rounded-full transition duration-150 text-neutral-300 hover:text-white"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#e81123] rounded-full"></span>
                )}
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
          <main className="flex-grow flex flex-col items-center justify-start overflow-y-auto overscroll-none w-full max-w-md mx-auto px-5 py-6 bg-white shadow-sm border-x border-neutral-100">

            {subView === 'notifications' && (
              /* ================= SUB-VIEW: NOTIFICATIONS ================= */
              <div className="w-full flex flex-col items-center justify-start pb-10 fade-in">
                {/* Header */}
                <div className="w-full flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSubView('hub')}
                      className="p-1 hover:bg-neutral-100 rounded-full transition-colors text-neutral-500"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <h2 className="text-[20px] font-semibold text-[#1a1a1a] tracking-tight">Notifiche</h2>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                      className="text-[12px] font-medium text-[#009b96] hover:underline"
                    >
                      Segna tutte come lette
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="w-full flex flex-col gap-3">
                  {notifications.length === 0 ? (
                    <div className="w-full py-12 flex flex-col items-center justify-center text-neutral-400">
                      <Bell size={32} className="mb-3 text-neutral-300" />
                      <span className="text-[14px]">Nessuna notifica presente.</span>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          if (!notif.read) {
                            setNotifications(notifications.map(n => n.id === notif.id ? { ...n, read: true } : n));
                          }
                          handleOpenNotificationTicket(notif.ticketId);
                        }}
                        className="relative w-full flex flex-col p-4 rounded-xl bg-white border border-neutral-200 ms-card-shadow cursor-pointer hover:border-neutral-300 transition-all duration-200"
                      >
                        <div className="flex justify-between items-start mb-1.5 gap-2">
                          <span className="text-[15px] font-semibold text-[#1a1a1a] leading-tight flex items-center gap-2">
                            {!notif.read && (
                              <div className="w-4 h-4 rounded-full bg-[#e81123] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                                !
                              </div>
                            )}
                            {notif.title}
                          </span>
                          <span className="text-[11px] text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                            {notif.date}
                          </span>
                        </div>
                        <span className="text-[13px] text-neutral-600 mb-2.5 leading-tight">
                          {notif.desc}
                        </span>
                        <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#009b96]">
                          <TicketLogoIcon className="w-3.5 h-3.5" />
                          <span>Ticket: {notif.ticketId}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {subView === 'hub' && (
              /* ================= SUB-VIEW: 3-ACTION CENTERED HUB ================= */
              <div className="w-full flex flex-col items-center justify-center space-y-12 py-8 fade-in text-center">

                {/* 1. BUTTON: CREA (Teal Style) */}
                <button
                  onClick={() => setSubView('create_select')}
                  className="flex flex-col items-center text-center focus:outline-none select-none group w-48 py-2 cursor-pointer border-none bg-transparent"
                >
                  <div className="w-[100px] h-[100px] rounded-full bg-[#e1f5f4] group-hover:bg-[#c9eeec] group-active:scale-95 text-[#009b96] flex items-center justify-center shadow-sm transition-all duration-200">
                    <img src={img204} alt="Crea" className="w-[52px] h-[52px] object-contain" />
                  </div>
                  <span className="text-[17px] font-semibold text-[#1a1a1a] mt-4 group-hover:text-[#009b96] transition-colors">
                    Crea
                  </span>
                </button>

                {/* 2. BUTTON: VISUALIZZA (Old Classic Structured List Style) */}
                <button
                  onClick={() => setSubView('active')}
                  className="flex flex-col items-center text-center focus:outline-none select-none group w-48 py-2 cursor-pointer border-none bg-transparent"
                >
                  <div className="w-[100px] h-[100px] rounded-full bg-[#e3effb] group-hover:bg-[#ccdff7] group-active:scale-95 text-[#0066d6] flex items-center justify-center shadow-sm transition-all duration-200">
                    <ListCustomIcon className="w-11 h-11 text-black" />
                  </div>
                  <span className="text-[17px] font-semibold text-[#1a1a1a] mt-4 group-hover:text-[#0066d6] transition-colors">
                    Visualizza
                  </span>
                  <span className="text-[13px] text-[#737373] font-normal mt-1">
                    {activeTickets.length} aperte
                  </span>
                </button>

                {/* 3. BUTTON: STORICO (Purple Style) */}
                <button
                  onClick={() => setSubView('history')}
                  className="flex flex-col items-center text-center focus:outline-none select-none group w-48 py-2 cursor-pointer border-none bg-transparent"
                >
                  <div className="w-[100px] h-[100px] rounded-full bg-[#f0ebf8] group-hover:bg-[#e2d8f3] group-active:scale-95 text-[#633cb3] flex items-center justify-center shadow-sm transition-all duration-200">
                    <img src={img205} alt="Storico" className="w-11 h-11 object-contain" />
                  </div>
                  <span className="text-[17px] font-semibold text-[#1a1a1a] mt-4 group-hover:text-[#633cb3] transition-colors">
                    Storico
                  </span>
                  <span className="text-[13px] text-[#737373] font-normal mt-1">
                    {historyTickets.length} chiuse
                  </span>
                </button>

              </div>
            )}

            {subView === 'team' && (
              /* ================= SUB-VIEW: TEAM DASHBOARD ================= */
              <div className="w-full flex flex-col space-y-6 py-2 fade-in">

                <button
                  onClick={() => setSubView('hub')}
                  className="w-10 h-10 rounded-full border border-neutral-200 bg-white flex items-center justify-center hover:bg-neutral-50 active:scale-95 transition shadow-sm cursor-pointer border-none"
                >
                  <ArrowLeft size={18} className="text-neutral-700" />
                </button>

                <div className="space-y-1 pb-2">
                  <h2 className="text-[28px] font-light text-neutral-800 tracking-tight leading-tight">
                    Team di Supporto
                  </h2>
                  <p className="text-[14px] text-neutral-400 font-normal">
                    {mockTeamMembers.length} membri attivi
                  </p>
                </div>

                <div className="w-full flex flex-col gap-4">
                  {mockTeamMembers.map((member, idx) => (
                    <div key={idx} className="bg-white border border-neutral-100 rounded-2xl p-4 ms-card-shadow flex flex-col gap-3 hover:border-neutral-200 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-[#fceee6] text-[#e65c00] font-bold text-sm flex items-center justify-center shrink-0 shadow-sm border border-[#fae1d2]">
                          {member.avatar}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[16px] font-bold text-neutral-800 tracking-tight">{member.name}</span>
                          <span className="text-[12px] font-medium text-neutral-500">{member.role}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-100">
                        <div className="flex flex-col items-center bg-neutral-50 rounded-xl p-2 border border-neutral-100">
                          <span className="text-[10px] uppercase font-bold text-neutral-400 mb-0.5 tracking-wider">Aperti</span>
                          <span className="text-[18px] font-black text-neutral-700">{member.open}</span>
                        </div>
                        <div className="flex flex-col items-center bg-[#f0f9f8] rounded-xl p-2 border border-[#e1f5f4]">
                          <span className="text-[10px] uppercase font-bold text-[#009b96] mb-0.5 tracking-wider">Risolti</span>
                          <span className="text-[18px] font-black text-[#00a49f]">{member.resolved}</span>
                        </div>
                      </div>
                    </div>
                  ))}
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

                {/* Category lists dynamic map of all 15 categories */}
                <div className="w-full flex flex-col space-y-4 pt-2">
                  {CATEGORIES.map((cat) => (
                    <div key={cat.name} className="w-full bg-white border border-neutral-200 rounded-lg overflow-hidden ms-card-shadow flex flex-col">
                      <div className="h-1 w-full" style={{ backgroundColor: cat.color }}></div>
                      <div className="p-4 flex items-center justify-between gap-4">
                        <div className="flex flex-col text-left">
                          <span className="text-[15px] font-semibold text-neutral-800">{cat.name}</span>
                          <span className="text-[11px] text-neutral-400 font-normal mt-0.5 line-clamp-1">{cat.info}</span>
                        </div>
                        <button
                          onClick={() => handleSelectCategory(cat.name)}
                          className="text-[13px] font-semibold flex items-center gap-1 hover:underline cursor-pointer shrink-0 border-none bg-transparent"
                          style={{ color: cat.color }}
                        >
                          Seleziona <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {subView === 'create_form' && (
              /* ================= SUB-VIEW: DETAIL REQUEST FORM ================= */
              <div className="w-full flex flex-col items-start justify-start space-y-6 py-2 fade-in">

                <button
                  onClick={() => setSubView('create_select')}
                  className="w-10 h-10 rounded-full border border-neutral-200 bg-white flex items-center justify-center hover:bg-neutral-50 active:scale-95 transition shadow-sm cursor-pointer border-none"
                >
                  <ArrowLeft size={18} className="text-neutral-700" />
                </button>

                <div className="w-full space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-[28px] font-light text-neutral-800 tracking-tight leading-tight">
                      Nuova richiesta
                    </h2>
                    <span className="text-neutral-400 cursor-pointer hover:text-neutral-600 transition" title={selectedCategory}>
                      <Info size={16} />
                    </span>
                  </div>
                  <p className="text-[14px] text-neutral-400 font-normal">
                    {selectedCategory}
                  </p>
                </div>

                {/* Tabs selection bar */}
                <div className="w-full flex items-center gap-6 border-b border-neutral-200 text-xs mt-3 select-none">
                  <button
                    type="button"
                    onClick={() => setFormTab('details')}
                    className={`pb-2.5 font-bold uppercase tracking-wider transition-all border-b-2 bg-transparent cursor-pointer border-none ${formTab === 'details'
                        ? 'border-[#00a49f] text-[#00a49f]'
                        : 'border-transparent text-neutral-400 hover:text-neutral-700'
                      }`}
                  >
                    Dettagli
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormTab('notes')}
                    className={`pb-2.5 font-bold uppercase tracking-wider transition-all border-b-2 bg-transparent cursor-pointer border-none ${formTab === 'notes'
                        ? 'border-[#00a49f] text-[#00a49f]'
                        : 'border-transparent text-neutral-400 hover:text-neutral-700'
                      }`}
                  >
                    Note ({formNotes.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormTab('attachments')}
                    className={`pb-2.5 font-bold uppercase tracking-wider transition-all border-b-2 bg-transparent cursor-pointer border-none ${formTab === 'attachments'
                        ? 'border-[#00a49f] text-[#00a49f]'
                        : 'border-transparent text-neutral-400 hover:text-neutral-700'
                      }`}
                  >
                    Allegati ({formAttachments.length})
                  </button>
                </div>

                {/* Tab Panel rendering */}
                {formTab === 'details' && (
                  <div className="w-full">
                    {selectedCategory === 'Sposta Data' ? (
                      /* SPOSTA DATA PAGE FORM modeled after image_81f545.png with modern layout changes */
                      <form onSubmit={handleCreateRequest} className="w-full space-y-5">

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
                            onClick={() => handleCancelForm('create_select')}
                            className="px-5 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 text-sm font-semibold transition cursor-pointer border-none bg-transparent"
                          >
                            Annulla
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2.5 rounded-xl bg-[#00a49f] hover:bg-[#008f8a] text-white text-sm font-semibold transition shadow-md cursor-pointer border-none"
                          >
                            Salva
                          </button>
                        </div>

                      </form>
                    ) : (
                      /* Standard dynamic form for other request categories */
                      <div className="w-full space-y-4">
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
                                      className={`py-2 rounded-xl text-xs font-semibold border transition text-center cursor-pointer ${isSelected ? `${colors} ring-1 ring-neutral-400` : 'border-neutral-200 text-neutral-600 bg-white hover:bg-neutral-50'
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

                            <div className="flex gap-3 pt-2">
                              <button
                                type="button"
                                onClick={() => handleCancelForm('create_select')}
                                className="w-1/3 py-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 text-sm font-semibold transition cursor-pointer border-none bg-transparent"
                              >
                                Annulla
                              </button>
                              <button
                                type="submit"
                                className="w-2/3 py-3 rounded-xl bg-[#0067b8] hover:bg-[#005da6] text-white text-sm font-semibold shadow-md transition flex items-center justify-center gap-2 cursor-pointer border-none"
                              >
                                <span>Rivedi Richiesta</span>
                                <ArrowRight size={15} />
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {formTab === 'notes' && (
                  <div className="w-full space-y-4 pt-2">
                    <div className="space-y-3 w-full">
                      {formNotes.length === 0 ? (
                        <p className="text-xs text-neutral-400 italic text-center py-6 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                          Nessuna nota aggiunta a questa richiesta.
                        </p>
                      ) : (
                        <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                          {formNotes.map((note, idx) => (
                            <div key={idx} className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-100 flex justify-between items-start">
                              <div className="space-y-1 text-left">
                                <span className="text-[10px] font-bold text-[#00a49f] block">Nota {idx + 1}</span>
                                <p className="text-xs text-neutral-700 leading-normal">{note}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setFormNotes(formNotes.filter((_, i) => i !== idx))}
                                className="text-neutral-400 hover:text-red-500 transition cursor-pointer border-none bg-transparent"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 pt-2 border-t border-neutral-100 w-full">
                      <textarea
                        placeholder="Inserisci una nota descrittiva o commento per questa richiesta..."
                        rows={2.5}
                        value={newFormNoteText}
                        onChange={(e) => setNewFormNoteText(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:border-[#00a49f] focus:ring-1 focus:ring-[#00a49f] outline-none text-xs bg-neutral-50 focus:bg-white resize-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newFormNoteText.trim()) {
                            setFormNotes([...formNotes, newFormNoteText.trim()]);
                            setNewFormNoteText('');
                          }
                        }}
                        disabled={!newFormNoteText.trim()}
                        className="w-full py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 disabled:opacity-50 text-neutral-600 text-xs font-semibold transition cursor-pointer border-none"
                      >
                        Aggiungi Nota
                      </button>
                    </div>
                  </div>
                )}

                {formTab === 'attachments' && (
                  <div className="w-full space-y-4 pt-2">
                    <div className="space-y-3 w-full">
                      {formAttachments.length === 0 ? (
                        <p className="text-xs text-neutral-400 italic text-center py-6 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                          Nessun allegato inserito.
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                          {formAttachments.map((file, idx) => (
                            <div key={idx} className="bg-neutral-50 px-3.5 py-2.5 rounded-2xl border border-neutral-100 flex items-center justify-between">
                              <div className="flex items-center gap-2.5 truncate">
                                <Paperclip size={13} className="text-[#00a49f] shrink-0" />
                                <span className="text-xs text-neutral-700 font-medium truncate">{file.name}</span>
                                <span className="text-[10px] text-neutral-400 font-normal shrink-0">({(file.size / 1024).toFixed(1)} KB)</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setFormAttachments(formAttachments.filter((_, i) => i !== idx))}
                                className="text-neutral-400 hover:text-red-500 transition cursor-pointer shrink-0 border-none bg-transparent"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-neutral-100 w-full">
                      <label className="w-full h-24 border border-dashed border-neutral-200 rounded-xl flex flex-col justify-center items-center gap-1.5 hover:bg-neutral-50/50 cursor-pointer transition">
                        <UploadCloud size={20} className="text-neutral-400" />
                        <span className="text-[11px] text-neutral-500 font-semibold">Seleziona File</span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            if (files.length > 0) {
                              const newAttachments = files.map(file => ({
                                name: file.name,
                                size: file.size
                              }));
                              setFormAttachments([...formAttachments, ...newAttachments]);
                            }
                            e.target.value = '';
                          }}
                          multiple
                        />
                      </label>
                    </div>
                  </div>
                )}

              </div>
            )}

            {subView === 'create_review' && draftTicket && (
              /* ================= SUB-VIEW: TICKET CREATION REVIEW ================= */
              <div className="w-full flex flex-col space-y-6 py-2 fade-in">

                <button
                  onClick={() => setSubView('create_form')}
                  className="w-10 h-10 rounded-full border border-neutral-200 bg-white flex items-center justify-center hover:bg-neutral-50 active:scale-95 transition shadow-sm cursor-pointer border-none"
                >
                  <ArrowLeft size={18} className="text-neutral-700" />
                </button>

                <div className="space-y-1 pb-2">
                  <h2 className="text-[28px] font-light text-neutral-800 tracking-tight leading-tight">
                    Conferma ticket
                  </h2>
                  <p className="text-[14px] text-neutral-400 font-normal">
                    Nuovo documento
                  </p>
                </div>

                <div className="bg-[#e1f5f4] p-4 rounded-xl flex items-start gap-3 border border-[#c9eeec]">
                  <AlertTriangle size={18} className="text-[#009b96] mt-0.5 shrink-0" />
                  <p className="text-[13px] text-neutral-700 font-medium">Verifica i dati del ticket prima di completare il salvataggio.</p>
                </div>

                <div className="bg-white border border-neutral-200 rounded-2xl p-5 ms-card-shadow space-y-6">
                  <div className="border-b border-dashed border-neutral-200 pb-4">
                    <div className="text-xs font-semibold text-neutral-400 mb-1">{draftTicket.id} • Bozza</div>
                    <div className="text-[18px] font-bold text-neutral-800">{draftTicket.subject}</div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-dashed border-neutral-100 pb-2">
                      <span className="text-[13px] font-bold text-neutral-400 uppercase tracking-wider w-1/3">Stato</span>
                      <span className="text-[14px] font-semibold text-neutral-800 w-2/3 text-right">Aperto</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-dashed border-neutral-100 pb-2">
                      <span className="text-[13px] font-bold text-neutral-400 uppercase tracking-wider w-1/3">Categoria</span>
                      <span className="text-[14px] font-semibold text-neutral-800 w-2/3 text-right">{draftTicket.category}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-dashed border-neutral-100 pb-2">
                      <span className="text-[13px] font-bold text-neutral-400 uppercase tracking-wider w-1/3">Cliente</span>
                      <span className="text-[14px] font-semibold text-neutral-800 w-2/3 text-right">{draftTicket.customer}</span>
                    </div>
                    <div className="flex flex-col border-b border-dashed border-neutral-100 pb-2 gap-1.5">
                      <span className="text-[13px] font-bold text-neutral-400 uppercase tracking-wider">Descrizione</span>
                      <span className="text-[14px] font-medium text-neutral-700 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                        {draftTicket.desc}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleCancelForm('create_select')}
                    className="w-1/3 py-3.5 rounded-xl border border-[#f3d6d8] bg-[#fdf3f4] text-[#a4262c] text-[15px] font-bold transition hover:bg-[#fae7e9] cursor-pointer text-center flex items-center justify-center gap-2"
                  >
                    <X size={18} />
                    <span>Annulla</span>
                  </button>
                  <button
                    onClick={handleConfirmTicket}
                    className="w-2/3 py-3.5 rounded-xl bg-[#009b96] hover:bg-[#008f8a] text-white text-[15px] font-bold shadow-md transition cursor-pointer text-center flex items-center justify-center gap-2 border-none"
                  >
                    <Check size={18} />
                    <span>Conferma e Salva</span>
                  </button>
                </div>
              </div>
            )}

            {subView === 'active' && (
              /* ================= SUB-VIEW: ACTIVE REQUESTS LIST ================= */
              <div className="w-full space-y-5 py-2 fade-in">

                <button
                  onClick={() => setSubView('hub')}
                  className="w-10 h-10 rounded-full border border-neutral-200 bg-white flex items-center justify-center hover:bg-neutral-50 active:scale-95 transition shadow-sm cursor-pointer border-none"
                >
                  <ArrowLeft size={18} className="text-neutral-700" />
                </button>

                <div className="space-y-1 pb-2">
                  <h2 className="text-[28px] font-light text-neutral-800 tracking-tight leading-tight">
                    Richieste Aperte
                  </h2>
                  <p className="text-[14px] text-neutral-400 font-normal">
                    {filteredActiveTickets.length} ticket in coda
                  </p>
                </div>

                {/* Filters & Search */}
                <div className="space-y-4 w-full">
                  {/* Search Bar */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Search size={16} className="text-neutral-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Cerca ticket, cliente o ID..."
                      value={activeSearchQuery}
                      onChange={(e) => setActiveSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#009b96]/20 focus:border-[#009b96] transition-all ms-card-shadow text-neutral-700"
                    />
                    {activeSearchQuery && (
                      <button
                        onClick={() => setActiveSearchQuery('')}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {/* Horizontal Category Scroll */}
                  <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide -mx-2 px-2">
                    <button
                      onClick={() => setActiveCategoryFilter('Tutte')}
                      className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all border ${activeCategoryFilter === 'Tutte' ? 'bg-[#009b96] text-white border-[#009b96] shadow-md shadow-[#009b96]/20' : 'bg-white text-neutral-600 border-neutral-200 hover:border-[#009b96]/50 hover:bg-[#f0f9f8]'}`}
                    >
                      Tutte
                    </button>
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.name}
                        onClick={() => setActiveCategoryFilter(cat.name)}
                        className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all border ${activeCategoryFilter === cat.name ? 'bg-[#009b96] text-white border-[#009b96] shadow-md shadow-[#009b96]/20' : 'bg-white text-neutral-600 border-neutral-200 hover:border-[#009b96]/50 hover:bg-[#f0f9f8]'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredActiveTickets.length === 0 ? (
                  <div className="bg-white border border-neutral-200 p-8 rounded-2xl text-center ms-card-shadow space-y-3 mt-4">
                    <CheckCircle className="text-[#009b96] mx-auto w-12 h-12" />
                    <p className="font-bold text-neutral-700">{activeTickets.length === 0 ? 'Tutto risolto!' : 'Nessun ticket trovato.'}</p>
                    <p className="text-xs text-neutral-400">{activeTickets.length === 0 ? 'Non ci sono ticket attivi in sospeso.' : 'Modifica la ricerca o il filtro per vedere altri ticket.'}</p>
                  </div>
                ) : (
                  <div className="bg-white border border-neutral-100 rounded-2xl ms-card-shadow overflow-hidden mt-4">
                    {filteredActiveTickets.map((ticket, index) => {
                      const catObj = CATEGORIES.find(c => c.name === ticket.category);
                      const catColor = catObj ? catObj.color : '#00a49f';
                      return (
                        <div
                          key={ticket.id}
                          onClick={() => handleOpenTicketDetails(ticket, 'active')}
                          className={`w-full p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-50 transition-colors ${index !== filteredActiveTickets.length - 1 ? 'border-b border-neutral-100' : ''}`}
                        >
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-[3px]" style={{ backgroundColor: catColor }}></div>
                              <span className="text-[14px] font-semibold text-neutral-800 tracking-tight">
                                {ticket.category}
                              </span>
                            </div>
                            <span className="text-[13px] text-neutral-500 ml-4.5 line-clamp-1">
                              {ticket.customer}
                            </span>
                            <span className="text-[11px] text-neutral-400 ml-4.5">
                              {ticket.creationDate ? ticket.creationDate.split(' ')[0] : ticket.date}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-semibold text-[#00a49f] bg-[#e1f5f4] px-2.5 py-1 rounded-full uppercase tracking-wider">
                              Aperto
                            </span>
                            <ArrowRight size={16} className="text-neutral-400" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {subView === 'history' && (
              /* ================= SUB-VIEW: REQUESTS ARCHIVE HISTORY ================= */
              <div className="w-full space-y-5 py-2 fade-in">

                <button
                  onClick={() => setSubView('hub')}
                  className="w-10 h-10 rounded-full border border-neutral-200 bg-white flex items-center justify-center hover:bg-neutral-50 active:scale-95 transition shadow-sm cursor-pointer border-none"
                >
                  <ArrowLeft size={18} className="text-neutral-700" />
                </button>

                <div className="space-y-1 pb-2">
                  <h2 className="text-[28px] font-light text-neutral-800 tracking-tight leading-tight">
                    Storico Ticket
                  </h2>
                  <p className="text-[14px] text-neutral-400 font-normal">
                    {historyTickets.length} ticket chiusi
                  </p>
                </div>

                {historyTickets.length === 0 ? (
                  <div className="bg-white border border-neutral-200 p-6 rounded-2xl text-center ms-card-shadow">
                    <p className="text-sm text-neutral-400">Nessun ticket archiviato presente nello storico.</p>
                  </div>
                ) : (
                  <div className="bg-white border border-neutral-100 rounded-2xl ms-card-shadow overflow-hidden mt-4">
                    {historyTickets.map((ticket, index) => {
                      const catObj = CATEGORIES.find(c => c.name === ticket.category);
                      const catColor = catObj ? catObj.color : '#00a49f';
                      const isResolved = ticket.status === 'Resolved';
                      return (
                        <div
                          key={ticket.id}
                          onClick={() => handleOpenTicketDetails(ticket, 'history')}
                          className={`w-full p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-50 transition-colors ${index !== historyTickets.length - 1 ? 'border-b border-neutral-100' : ''}`}
                        >
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-[3px]" style={{ backgroundColor: catColor }}></div>
                              <span className="text-[14px] font-semibold text-neutral-800 tracking-tight">
                                {ticket.category}
                              </span>
                            </div>
                            <span className="text-[13px] text-neutral-500 ml-4.5 line-clamp-1">
                              {ticket.customer}
                            </span>
                            <span className="text-[11px] text-neutral-400 ml-4.5">
                              {ticket.creationDate ? ticket.creationDate.split(' ')[0] : ticket.date}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${isResolved ? 'text-green-700 bg-green-50 border border-green-100' : 'text-red-700 bg-red-50 border border-red-100'}`}>
                              {isResolved ? 'Risolto' : 'Chiuso'}
                            </span>
                            <ArrowRight size={16} className="text-neutral-400" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            )}

            {subView === 'ticket_detail' && selectedTicket && (
              /* ================= SUB-VIEW: HIGH-FIDELITY TICKET DETAILS ================= */
              <div className="w-full space-y-5 py-2 fade-in">

                {/* Back Navigation Bar */}
                <div className="flex items-center justify-between pb-2">
                  <button
                    onClick={() => setSubView(previousView)}
                    className="w-10 h-10 rounded-full border border-neutral-200 bg-white flex items-center justify-center hover:bg-neutral-50 active:scale-95 transition shadow-sm cursor-pointer border-none"
                  >
                    <ArrowLeft size={18} className="text-neutral-700" />
                  </button>
                  <span className="text-xs font-bold text-[#00a49f] uppercase tracking-widest bg-[#e1f5f4] px-2.5 py-1 rounded-full">{selectedTicket.id}</span>
                </div>

                <div className="space-y-1 pb-2">
                  <h2 className="text-[28px] font-light text-neutral-800 tracking-tight leading-tight">
                    {selectedTicket.subject || selectedTicket.category}
                  </h2>
                </div>

                {/* Metadata Header Card */}
                <div className="bg-white p-4 rounded-2xl border border-neutral-100 ms-card-shadow grid grid-cols-2 gap-y-3 gap-x-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Numero richiesta</span>
                    <span className="text-xs text-neutral-800 font-medium">{selectedTicket.id}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Segnalato da</span>
                    <span className="text-xs text-neutral-800 font-medium">{selectedTicket.reportedBy || selectedTicket.customer || "Cliente Occasionale"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Presa in carico da</span>
                    <span className="text-xs text-neutral-800 font-medium">{selectedTicket.assignee || 'Non assegnato'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Data richiesta</span>
                    <span className="text-xs text-neutral-800 font-medium">{selectedTicket.creationDate ? selectedTicket.creationDate.split(' ')[0] : selectedTicket.date}</span>
                  </div>
                  <div className="flex flex-col col-span-2 pt-1 border-t border-neutral-50">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Stato</span>
                    <div>
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider inline-flex ${
                        selectedTicket.status === 'Resolved' 
                          ? 'text-green-700 bg-green-50 border border-green-100' 
                          : previousView === 'history' 
                            ? 'text-red-700 bg-red-50 border border-red-100'
                            : 'text-[#00a49f] bg-[#e1f5f4] border border-[#c9eeec]'
                      }`}>
                        {selectedTicket.status === 'Resolved' ? 'Risolto' : previousView === 'history' ? 'Chiuso' : 'Aperto'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="w-full flex items-center gap-6 border-b border-neutral-200 text-xs mt-3 select-none overflow-x-auto scrollbar-hide">
                  {[
                    { id: 'details', label: 'Dettagli' },
                    { id: 'notes', label: `Note (${ticketComments[selectedTicket.id]?.length || 0})` },
                    { id: 'attachments', label: 'Allegati' },
                    { id: 'actions', label: 'Azioni' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setTicketDetailTab(tab.id)}
                      className={`pb-2.5 font-bold uppercase tracking-wider transition-all border-b-2 bg-transparent cursor-pointer border-none whitespace-nowrap ${
                        ticketDetailTab === tab.id
                          ? 'border-[#009b96] text-[#009b96]'
                          : 'border-transparent text-neutral-400 hover:text-neutral-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="w-full pt-1">
                  {ticketDetailTab === 'details' && (
                    <div className="space-y-4 fade-in">
                      {/* Description Block Section */}
                      <div className="space-y-1 bg-white p-4 rounded-2xl border border-neutral-100 ms-card-shadow">
                        <span className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Descrizione</span>
                        <p className="text-sm text-neutral-800 leading-relaxed pt-1 font-normal">
                          {selectedTicket.desc}
                        </p>
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

                      <div className="space-y-1 bg-white p-4 rounded-2xl border border-neutral-100 ms-card-shadow">
                        <span className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Ultimo aggiornamento</span>
                        <p className="text-xs text-neutral-800 pt-1">
                          {selectedTicket.lastUpdate || selectedTicket.date}
                        </p>
                      </div>
                    </div>
                  )}

                  {ticketDetailTab === 'notes' && (
                    <div className="space-y-2.5 bg-white p-4 rounded-2xl border border-neutral-100 ms-card-shadow fade-in">
                      <div className="space-y-3">
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
                      <form onSubmit={handleAddComment} className="pt-4 border-t border-neutral-100 space-y-2 mt-4">
                        <label className="block text-[10px] font-bold text-neutral-400 uppercase">Nuovo commento</label>
                        <textarea
                          placeholder="Scrivi un commento..."
                          rows={2}
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:border-[#009b96] focus:ring-1 focus:ring-[#009b96] outline-none text-xs bg-neutral-50 focus:bg-white resize-none transition"
                          required
                        />
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="bg-[#009b96] hover:bg-[#008f8a] text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-sm cursor-pointer border-none"
                          >
                            Commenta
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {ticketDetailTab === 'attachments' && (
                    <div className="bg-white p-6 rounded-2xl border border-neutral-100 ms-card-shadow text-center space-y-2 fade-in">
                       <p className="text-sm text-neutral-500 font-medium">Nessun allegato presente</p>
                       <p className="text-xs text-neutral-400">Questo ticket non contiene file o immagini allegate.</p>
                    </div>
                  )}

                  {ticketDetailTab === 'actions' && (
                    <div className="bg-white p-5 rounded-2xl border border-neutral-100 ms-card-shadow space-y-4 fade-in">
                      
                      {previousView === 'active' && (
                        <div className="space-y-2 pb-4 border-b border-neutral-100">
                          <button
                            onClick={() => {
                              setEditTicketSubject(selectedTicket.subject || selectedTicket.category);
                              setEditTicketDesc(selectedTicket.desc);
                              setSubView('ticket_edit');
                            }}
                            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 font-semibold text-xs active:scale-[0.99] transition text-left cursor-pointer"
                          >
                            <Edit size={16} className="text-[#009b96]" />
                            <span>Modifica Ticket / Sollecita</span>
                          </button>
                        </div>
                      )}

                      <div className="space-y-3">
                        {/* Action 1: Prendi in carico */}
                        <button
                          onClick={() => takeOwnership(selectedTicket.id)}
                          disabled={selectedTicket.assignee === 'Key-Ticket Agent'}
                          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl border text-xs font-semibold transition text-left ${selectedTicket.assignee === 'Key-Ticket Agent'
                            ? 'border-neutral-100 bg-neutral-50 text-neutral-400 cursor-not-allowed'
                            : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 active:scale-[0.99] cursor-pointer'
                            }`}
                        >
                          {selectedTicket.assignee === 'Key-Ticket Agent' ? (
                            <UserCheck size={16} className="text-[#009b96]" />
                          ) : (
                            <User size={16} className="text-neutral-400" />
                          )}
                          <span>
                            {selectedTicket.assignee === 'Key-Ticket Agent' ? 'Sei già assegnatario' : 'Prendi in carico'}
                          </span>
                        </button>

                        {/* Riassegna */}
                        <div className="space-y-1.5 pt-2">
                          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Riassegna Operatore</label>
                          <select
                            value={selectedTicket.assignee === 'Nessun assegnatario' ? 'Non assegnato' : selectedTicket.assignee}
                            onChange={(e) => {
                              const newAssignee = e.target.value;
                              const currentFormattedTime = getFormattedDateTime();
                              setActiveTickets(activeTickets.map(t =>
                                t.id === selectedTicket.id ? { ...t, assignee: newAssignee, lastUpdate: currentFormattedTime } : t
                              ));
                              setHistoryTickets(historyTickets.map(t =>
                                t.id === selectedTicket.id ? { ...t, assignee: newAssignee, lastUpdate: currentFormattedTime } : t
                              ));
                              setSelectedTicket({ ...selectedTicket, assignee: newAssignee, lastUpdate: currentFormattedTime });
                              triggerNotification(`Ticket assegnato a ${newAssignee}.`);
                            }}
                            className="w-full px-3.5 py-3 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 bg-neutral-50 outline-none transition focus:bg-white cursor-pointer"
                          >
                            <option value="Non assegnato">Non assegnato</option>
                            <option value="Key-Ticket Agent">Key-Ticket Agent (Te)</option>
                            <option value="Marco Rossi">Marco Rossi</option>
                            <option value="Laura Conti">Laura Conti</option>
                            <option value="Giulia Bianchi">Giulia Bianchi</option>
                            <option value="Andrea Ferri">Andrea Ferri</option>
                          </select>
                        </div>

                        {/* Risolvi */}
                        {previousView === 'active' && (
                          <button
                            onClick={() => resolveTicket(selectedTicket.id)}
                            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 font-semibold text-xs active:scale-[0.99] transition text-left cursor-pointer mt-4"
                          >
                            <Check size={16} className="text-green-500" />
                            <span>Segna come risolto</span>
                          </button>
                        )}

                        {/* Chiudi */}
                        {previousView === 'active' && (
                          <button
                            onClick={() => closeOrRejectTicket(selectedTicket.id)}
                            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl border border-red-100 bg-red-50/20 hover:bg-red-50/50 text-red-700 font-semibold text-xs active:scale-[0.99] transition text-left cursor-pointer"
                          >
                            <X size={16} className="text-red-500" />
                            <span>Chiudi ticket</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {subView === 'ticket_edit' && selectedTicket && (
              /* ================= SUB-VIEW: EDIT TICKET ================= */
              <div className="w-full space-y-5 py-2 fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                  <button
                    onClick={() => setSubView('ticket_detail')}
                    className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-800 text-sm font-semibold transition cursor-pointer border-none bg-transparent"
                  >
                    <ArrowLeft size={16} />
                    <span>Annulla</span>
                  </button>
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Modifica Ticket</span>
                </div>

                <div className="bg-white border border-neutral-200 rounded-2xl p-5 ms-card-shadow space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider">Titolo / Oggetto</label>
                    <input
                      type="text"
                      value={editTicketSubject}
                      onChange={(e) => setEditTicketSubject(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-xl border border-neutral-200 focus:border-[#009b96] focus:ring-1 focus:ring-[#009b96] outline-none text-sm text-neutral-800 transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider">Descrizione</label>
                    <textarea
                      rows={6}
                      value={editTicketDesc}
                      onChange={(e) => setEditTicketDesc(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-xl border border-neutral-200 focus:border-[#009b96] focus:ring-1 focus:ring-[#009b96] outline-none text-sm text-neutral-800 transition resize-none"
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        const currentFormattedTime = getFormattedDateTime();
                        
                        // Update activeTickets if it exists there
                        setActiveTickets(activeTickets.map(t => 
                          t.id === selectedTicket.id 
                            ? { ...t, subject: editTicketSubject, desc: editTicketDesc, lastUpdate: currentFormattedTime } 
                            : t
                        ));
                        
                        // Update historyTickets if it exists there
                        setHistoryTickets(historyTickets.map(t => 
                          t.id === selectedTicket.id 
                            ? { ...t, subject: editTicketSubject, desc: editTicketDesc, lastUpdate: currentFormattedTime } 
                            : t
                        ));
                        
                        // Update selectedTicket
                        setSelectedTicket({
                          ...selectedTicket,
                          subject: editTicketSubject,
                          desc: editTicketDesc,
                          lastUpdate: currentFormattedTime
                        });
                        
                        triggerNotification(`Il ticket ${selectedTicket.id} è stato aggiornato.`);
                        setSubView('ticket_detail');
                      }}
                      disabled={!editTicketSubject.trim() || !editTicketDesc.trim()}
                      className="w-full py-3.5 rounded-xl bg-[#009b96] hover:bg-[#008f8a] text-white text-[15px] font-bold shadow-md transition cursor-pointer text-center flex items-center justify-center gap-2 border-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Check size={18} />
                      <span>Salva Modifiche</span>
                    </button>
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

      {/* Cancel Confirmation Modal */}
      {showCancelWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl ms-card-shadow border border-neutral-100" onClick={e => e.stopPropagation()}>
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-[#fdf3f4] rounded-full flex items-center justify-center mx-auto mb-2 border border-[#f3d6d8]">
                <AlertTriangle size={32} className="text-[#a4262c]" />
              </div>
              <h3 className="text-xl font-bold text-neutral-800 tracking-tight">Annullare la creazione?</h3>
              <p className="text-sm text-neutral-500 font-medium">
                Tutti i dati inseriti e i progressi andranno persi. Sei sicuro di voler procedere?
              </p>
            </div>
            <div className="flex border-t border-neutral-100">
              <button
                onClick={abortCancel}
                className="w-1/2 py-4 text-[15px] font-bold text-neutral-600 hover:bg-neutral-50 transition border-r border-neutral-100 cursor-pointer border-none bg-transparent"
              >
                Indietro
              </button>
              <button
                onClick={executeCancel}
                className="w-1/2 py-4 text-[15px] font-bold text-[#a4262c] hover:bg-[#fdf3f4] transition cursor-pointer border-none bg-transparent"
              >
                Conferma
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}