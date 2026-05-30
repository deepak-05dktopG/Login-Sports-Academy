
import { useEffect, useState } from 'react';
import {
  fetchDailyTracker,
  fetchAllTrackerEntries,
  addDailyTrackerEntry,
  updateDailyTrackerEntry,
  deleteDailyTrackerById,
  deleteDailyTrackerByDate,
  deleteAllTrackerEntries
} from '../../api/dailyTracker';
import api from '../../api/api';
import Swal from 'sweetalert2';
import { formatHHmmTo12Hour } from '../../utils/dateTime';
import AdminLayout from '../../components/adminPanel/AdminLayout';



// Utility to format date/time
const getNow = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return {
    date: `${year}-${month}-${day}`,
    time: d.toTimeString().slice(0, 5),
  };
};



const paymentOptions = ['Cash', 'GPay'];

const Badge = ({ children, color }) => {
  const colors = {
    blue: { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' },
    green: { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' },
    red: { bg: '#fee2e2', text: '#b91c1c', border: '#fecaca' },
    yellow: { bg: '#fef3c7', text: '#b45309', border: '#fde68a' },
    purple: { bg: '#f3e8ff', text: '#7e22ce', border: '#e9d5ff' },
    gray: { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' },
  };
  const theme = colors[color] || colors.gray;
  return (
    <span style={{ backgroundColor: theme.bg, color: theme.text, border: `1px solid ${theme.border}`, padding: '4px 12px', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
      {children}
    </span>
  );
};
const getTypeColor = (type) => {
  switch (type) {
    case 'Stock':
    case 'Order':
    case '1 Hour Order':
    case '1 Hour':
    case '1 Hour Stock':
    case 'Public Stock':
    case 'Public Order': return 'green';
    case 'Pending Amount': return 'purple';
    case 'Expense': return 'red';
    case 'Withdrawal': return 'gray';
    default: return 'blue'; // Assume blue for all dynamic membership plans
  }
};
const getPaymentColor = (ptype) => {
  switch ((ptype || '').toLowerCase()) {
    case 'cash': return 'yellow';
    case 'gpay': return 'purple';
    case 'razorpay': return 'blue';
    default: return 'gray';
  }
};

function exportToCSV(rows, cashBox, dateSuffix = null) {
  const header = ['Type', 'Sport', 'Name', 'Payment Type', 'Amount', 'Date', 'Time', 'Details/Notes'];
  const csvRows = rows.map(r =>
    [r.type, r.serviceType || 'swimming', r.name, r.paymentType, r.amount, r.date, r.time, r.notes].map(x => `"${x ?? ''}"`).join(',')
  );

  const typeTotals = {};
  rows.forEach(r => {
    if (!typeTotals[r.type]) typeTotals[r.type] = 0;
    typeTotals[r.type] += Number(r.amount) || 0;
  });

  const earningEntries = rows.filter(r => r.type !== 'Expense' && r.type !== 'Withdrawal');
  const totalEarningCount = earningEntries.length;

  const cashRowsTotal = earningEntries.filter(r => (r.paymentType || '').toLowerCase() === 'cash').reduce((sum, r) => sum + Number(r.amount), 0);
  const gpayRowsTotal = earningEntries.filter(r => (r.paymentType || '').toLowerCase() === 'gpay').reduce((sum, r) => sum + Number(r.amount), 0);
  const razorpayRowsTotal = earningEntries.filter(r => (r.paymentType || '').toLowerCase() === 'razorpay').reduce((sum, r) => sum + Number(r.amount), 0);

  const breakdownStatsStr = Object.entries(typeTotals).map(([t, v]) => `${t}: Rupees ${v}`).join(' | ');
  const combinedStatsStr = `${breakdownStatsStr}${breakdownStatsStr ? ' | ' : ''}Cash Earnings: Rupees ${cashRowsTotal} | GPay Earnings: Rupees ${gpayRowsTotal} | Razerpay Earnings: Rupees ${razorpayRowsTotal}`;

  // Add totals row (with 'Rupees' instead of symbol)
  const totalsRow = [
    `Totals (Earning Entries: ${totalEarningCount})`, '', '', '', '', '', '',
    `"${combinedStatsStr}"`
  ].join(',');

  const cashBoxRow = [
    'Cash Box', '', '', '', '', '', '',
    `Cash: Rupees ${cashBox?.hardCash || 0} | GPay: Rupees ${cashBox?.gpayCash || 0}`
  ].join(',');

  const emptyRow = ['', '', '', '', '', '', '', ''].join(',');

  const csv = [header.join(','), ...csvRows, emptyRow, totalsRow, cashBoxRow].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const suffix = dateSuffix ? `-${dateSuffix}` : `-${getNow().date}`;
  a.download = `daily-tracker${suffix}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}




const DailyTracker = () => {
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [rows, setRows] = useState([]);
  const [printData, setPrintData] = useState(null);
  const [cashBox, setCashBox] = useState({ hardCash: 0, gpayCash: 0 });
  const [filter, setFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [formType, setFormType] = useState('');
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(() => getNow().date);

  // "All Entries" view mode
  const [viewMode, setViewMode] = useState('date'); // 'date' | 'all'
  const [allRows, setAllRows] = useState([]);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [showSidebar, setShowSidebar] = useState(false);

  // Inline editing
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({});
  // Display Summary maximize
  const [summaryMaximized, setSummaryMaximized] = useState(false);
  // Sport tab filter
  const [sportTab, setSportTab] = useState('all'); // 'all' | 'swimming' | 'badminton'
  const [formServiceType, setFormServiceType] = useState('swimming');

  // Stock tracking states
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockModalRow, setStockModalRow] = useState(null);
  const [activeStockItems, setActiveStockItems] = useState([]);
  const [stockPresetSelect, setStockPresetSelect] = useState('');
  const [customStockName, setCustomStockName] = useState('');
  const [customStockPrice, setCustomStockPrice] = useState('');
  const [stockCatalog, setStockCatalog] = useState([]);
  const [formHeadsCount, setFormHeadsCount] = useState(1);

  const getContextualStocks = (type) => {
    // Show all active stock items regardless of stockType
    // so everything added in ManagePlans appears in the daily entry modal
    return stockCatalog.map(item => ({
      name: item.planName,
      price: item.basePrice || 0,
      count: item.stockCount !== undefined ? item.stockCount : 0,
      isRental: item.stockType === 'rental',
    }));
  };

  // Inline Stock selections states in creation form
  const [formStockItems, setFormStockItems] = useState([]);
  const [formStockPreset, setFormStockPreset] = useState('');
  const [formCustomName, setFormCustomName] = useState('');
  const [formCustomPrice, setFormCustomPrice] = useState('');
  const [formAmount, setFormAmount] = useState('');

  const openStockDrawer = (row) => {
    setStockModalRow(row);
    setActiveStockItems(row.stockItems ? [...row.stockItems] : []);
    setStockPresetSelect('');
    setCustomStockName('');
    setCustomStockPrice('');
    setShowStockModal(true);
  };

  const closeStockDrawer = () => {
    setShowStockModal(false);
    setStockModalRow(null);
  };

  const addStockItem = () => {
    let name = '';
    let price = 0;

    if (customStockName.trim() && customStockPrice) {
      name = customStockName.trim();
      price = parseFloat(customStockPrice) || 0;
    } else {
      const preset = getContextualStocks(stockModalRow?.type || 'Stock').find(p => p.name === stockPresetSelect);
      if (!preset) return;
      name = preset.name;
      price = preset.price;
    }

    const existsIdx = activeStockItems.findIndex(item => item.name.toLowerCase() === name.toLowerCase());
    if (existsIdx > -1) {
      const updated = [...activeStockItems];
      const item = updated[existsIdx];
      const dbStock = getContextualStocks(stockModalRow?.type || 'Stock').find(p => p.name.toLowerCase() === name.toLowerCase());
      if (dbStock) {
        const originalItem = stockModalRow?.stockItems?.find(p => p.name.toLowerCase() === name.toLowerCase());
        const originalQty = originalItem ? originalItem.quantity : 0;
        const maxAllowed = dbStock.count + originalQty;
        if (item.quantity >= maxAllowed) {
          Swal.fire('Limit Reached', `Only ${maxAllowed} of ${name} is available in stock.`, 'warning');
          return;
        }
      }
      updated[existsIdx].quantity += 1;
      updated[existsIdx].total = updated[existsIdx].quantity * updated[existsIdx].price;
      setActiveStockItems(updated);
    } else {
      const dbStock = getContextualStocks(stockModalRow?.type || 'Stock').find(p => p.name.toLowerCase() === name.toLowerCase());
      if (dbStock) {
        const originalItem = stockModalRow?.stockItems?.find(p => p.name.toLowerCase() === name.toLowerCase());
        const originalQty = originalItem ? originalItem.quantity : 0;
        const maxAllowed = dbStock.count + originalQty;
        if (maxAllowed <= 0) {
          Swal.fire('Out of Stock', `${name} is out of stock.`, 'warning');
          return;
        }
      }
      setActiveStockItems([
        ...activeStockItems,
        { name, quantity: 1, price, total: price }
      ]);
    }

    setStockPresetSelect('');
    setCustomStockName('');
    setCustomStockPrice('');
  };

  const updateStockQuantity = (idx, delta) => {
    const updated = [...activeStockItems];
    const item = updated[idx];
    if (delta > 0) {
      const dbStock = getContextualStocks(stockModalRow?.type || 'Stock').find(p => p.name.toLowerCase() === item.name.toLowerCase());
      if (dbStock) {
        const originalItem = stockModalRow?.stockItems?.find(p => p.name.toLowerCase() === item.name.toLowerCase());
        const originalQty = originalItem ? originalItem.quantity : 0;
        const maxAllowed = dbStock.count + originalQty;
        if (item.quantity >= maxAllowed) {
          Swal.fire('Limit Reached', `Only ${maxAllowed} of ${item.name} is available in stock.`, 'warning');
          return;
        }
      }
    }
    updated[idx].quantity = Math.max(1, updated[idx].quantity + delta);
    updated[idx].total = updated[idx].quantity * updated[idx].price;
    setActiveStockItems(updated);
  };

  const removeStockItem = (idx) => {
    setActiveStockItems(activeStockItems.filter((_, i) => i !== idx));
  };

  const saveStockSales = async () => {
    if (!stockModalRow) return;
    setLoading(true);
    try {
      await updateDailyTrackerEntry(stockModalRow._id, { stockItems: activeStockItems });
      await fetchData();
      setShowStockModal(false);
      Swal.fire({ title: 'Stock details saved!', icon: 'success', timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire('Error', err?.response?.data?.message || 'Failed to save stock details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      // Fetch all plans (no isActive filter) so newly added stocks always appear
      const { data } = await api.get('/membership/plans');
      console.log('[DailyTracker] fetchPlans response:', data);
      if (data.success) {
         const nonStockPlans = data.data.filter(p => p.type !== 'stock');
         setMembershipPlans(nonStockPlans.filter(p => p.isActive !== false).map(p => p.planName));
         const stockPlans = data.data.filter(p => p.type === 'stock');
         console.log('[DailyTracker] stockCatalog set to:', stockPlans);
         setStockCatalog(stockPlans);
      }
    } catch (err) {
      console.error("Failed to load membership plans and stocks", err);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await fetchPlans();
      if (viewMode === 'date') {
        const res = await fetchDailyTracker(date);
        setRows(res.data || []);
        if (res.cashBox) setCashBox(res.cashBox);
      } else {
        const res = await fetchAllTrackerEntries({ fromDate: dateRange.from, toDate: dateRange.to, limit: 10000 });
        setAllRows(res.data || []);
        if (res.cashBox) setCashBox(res.cashBox);
      }
    } catch (e) {
      console.error('Fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (row) => {
    setEditingId(row._id);
    setEditDraft({ type: row.type, name: row.name, paymentType: row.paymentType, amount: row.amount, notes: row.notes || '' });
  };
  const cancelEdit = () => { setEditingId(null); setEditDraft({}); };
  const saveEdit = async (id) => {
    try {
      setLoading(true);
      await updateDailyTrackerEntry(id, editDraft);
      setEditingId(null);
      setEditDraft({});
      await fetchData();
      Swal.fire({ title: 'Updated!', icon: 'success', timer: 1200, showConfirmButton: false });
    } catch (err) {
      setLoading(false);
      Swal.fire('Error', err?.response?.data?.message || 'Failed to update', 'error');
    }
  };
  const deleteRow = async (id) => {
    const result = await Swal.fire({
      title: 'Delete this entry?',
      text: 'This will also adjust the Grocer Box balance.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Yes, delete it'
    });
    if (!result.isConfirmed) return;
    try {
      setLoading(true);
      await deleteDailyTrackerById(id);
      await fetchData();
      Swal.fire({ title: 'Deleted!', icon: 'success', timer: 1000, showConfirmButton: false });
    } catch (e) {
      setLoading(false);
      Swal.fire('Error', 'Failed to delete entry.', 'error');
    }
  };

  // Fetch entries when date or viewMode changes
  useEffect(() => {
    fetchData();
  }, [date, viewMode]);

  // Add Entry
  const openModal = (row = null) => {
    setModalData(row);
    const initialType = row?.type || '';
    setFormType(initialType);
    setFormStockItems([]);
    setFormStockPreset('');
    setFormCustomName('');
    setFormCustomPrice('');
    setFormHeadsCount(row?.headsCount ?? '');
    setFormAmount(row?.amount || '');
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setModalData(null);
  };
  const saveModal = async (e) => {
    e.preventDefault();
    const action = e.nativeEvent?.submitter?.value || 'save';
    const form = e.target;
    const data = Object.fromEntries(new FormData(form));
    // Ensure paymentType is lowercase for backend compatibility
    if (data.paymentType) {
      data.paymentType = data.paymentType.toLowerCase();
    }
    if (!modalData) {
      // Add new entry
      try {
        setLoading(true);
        const stockTotal = formStockItems.reduce((sum, item) => sum + item.total, 0);
        const headsCount = formType === '1 Hour Order' ? Number(formHeadsCount) : 1;
        const sessionAmount = formType === '1 Hour Order' ? (headsCount * 100) : (Number(formAmount || data.amount) - stockTotal);
        const finalAmount = sessionAmount + stockTotal;

        const payload = { 
          ...data, 
          date, 
          time: data.time || getNow().time,
          amount: finalAmount,
          sessionAmount,
          headsCount,
          stockTotal,
          stockItems: formStockItems
        };

        await addDailyTrackerEntry(payload);
        await fetchData();
        closeModal();

        if ((payload.type !== 'Expense' && payload.type !== 'Withdrawal') && action === 'print') {
          setPrintData(payload);
          setTimeout(() => {
            window.print();
            setPrintData(null);
          }, 400); // Allow DOM to render thermal layout before triggering the print menu
        } else {
          Swal.fire({
            title: 'Success!',
            text: 'Entry added successfully',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
        }
      } catch (err) {
        setLoading(false);
        const msg = err?.response?.data?.message || err.message || 'Failed to add entry';
        Swal.fire('Error', msg, 'error');
      }
    } else {
      closeModal();
    }
  };


  // Download CSV then delete all entries (either for the selected day or fully)
  const downloadAndClear = async () => {
    const dataToExport = viewMode === 'all' ? allRows : rows;
    if (dataToExport.length === 0) {
      Swal.fire('Nothing to clear', 'There are no entries to process.', 'info');
      return;
    }
    let suffix;
    if (viewMode === 'all') {
      if (dateRange?.from || dateRange?.to) {
        suffix = `${dateRange.from || 'start'}_to_${dateRange.to || 'end'}_cleared-${getNow().date}`;
      } else {
        suffix = `FULL-HISTORY-${getNow().date}`;
      }
    } else {
      suffix = date;
    }
    
    // Step 1: Download CSV first
    exportToCSV(dataToExport, cashBox, suffix);
    // Step 2: Confirm deletion
    const isFullPurge = viewMode === 'all';
    const result = await Swal.fire({
      title: isFullPurge ? 'Clear ALL history?' : 'Clear all entries for today?',
      text: `CSV downloaded. ${isFullPurge ? 'THE ENTIRE HISTORY' : `All ${rows.length} entries for ${date}`} will be permanently deleted.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: isFullPurge ? 'Yes, PURGE ALL DATA' : 'Yes, delete all',
      cancelButtonText: 'Keep data'
    });
    if (result.isConfirmed) {
      setLoading(true);
      if (isFullPurge) {
        await deleteAllTrackerEntries();
        setAllRows([]);
      } else {
        await deleteDailyTrackerByDate(date);
        setRows([]);
      }
      setCashBox({ hardCash: 0, gpayCash: 0 });
      setLoading(false);
      Swal.fire({ title: 'Cleared!', text: 'Entries deleted successfully.', icon: 'success', timer: 1500, showConfirmButton: false });
    }
  };

  // Filtered rows (for both date and all modes) — also filter by sport tab
  const baseRows = viewMode === 'all' ? allRows : rows;
  const filtered = baseRows.filter(r =>
    (!filter || Object.values(r).some(v => String(v).toLowerCase().includes(filter.toLowerCase()))) &&
    (!typeFilter || r.type === typeFilter) &&
    (sportTab === 'all' || (r.serviceType || 'swimming') === sportTab)
  );

  // Running totals
  const hasInlineStockSales = filtered.some(r => r.type !== 'Stock' && (r.stockTotal || 0) > 0);
  const rawTypes = filtered.map(r => r.type);
  if (hasInlineStockSales) {
    rawTypes.push('Stock');
  }
  const allTypesInCurrentView = [...new Set(rawTypes)];

  const getCategoryAmounts = (type) => {
    let cashAmt = 0;
    let gpayAmt = 0;
    let razorpayAmt = 0;

    if (type === 'Stock') {
      // 1. Pure Stock rows
      filtered.filter(r => r.type === 'Stock').forEach(r => {
        const amt = Number(r.amount) || 0;
        if ((r.paymentType || '').toLowerCase() === 'cash') {
          cashAmt += amt;
        } else if ((r.paymentType || '').toLowerCase() === 'gpay') {
          gpayAmt += amt;
        } else if ((r.paymentType || '').toLowerCase() === 'razorpay') {
          razorpayAmt += amt;
        }
      });
      // 2. Stock portion from other non-Stock rows
      filtered.filter(r => r.type !== 'Stock' && (r.stockTotal || 0) > 0).forEach(r => {
        const stkVal = Number(r.stockTotal) || 0;
        if ((r.paymentType || '').toLowerCase() === 'cash') {
          cashAmt += stkVal;
        } else if ((r.paymentType || '').toLowerCase() === 'gpay') {
          gpayAmt += stkVal;
        } else if ((r.paymentType || '').toLowerCase() === 'razorpay') {
          razorpayAmt += stkVal;
        }
      });
    } else {
      filtered.filter(r => r.type === type).forEach(r => {
        const sessionVal = r.sessionAmount !== undefined 
          ? r.sessionAmount 
          : (Number(r.amount) || 0) - (r.stockTotal || 0);
        
        if ((r.paymentType || '').toLowerCase() === 'cash') {
          cashAmt += sessionVal;
        } else if ((r.paymentType || '').toLowerCase() === 'gpay') {
          gpayAmt += sessionVal;
        } else if ((r.paymentType || '').toLowerCase() === 'razorpay') {
          razorpayAmt += sessionVal;
        }
      });
    }

    return { cashAmt, gpayAmt, razorpayAmt, total: cashAmt + gpayAmt + razorpayAmt };
  };

  const earningEntriesUI = filtered.filter(r => r.type !== 'Expense' && r.type !== 'Withdrawal');
  const totalCount = earningEntriesUI.length;

  const totalCashCollected = earningEntriesUI
    .filter(r => (r.paymentType || '').toLowerCase() === 'cash')
    .reduce((sum, r) => sum + Number(r.amount), 0);

  const totalGpayCollected = earningEntriesUI
    .filter(r => (r.paymentType || '').toLowerCase() === 'gpay')
    .reduce((sum, r) => sum + Number(r.amount), 0);

  const totalRazorpayCollected = earningEntriesUI
    .filter(r => (r.paymentType || '').toLowerCase() === 'razorpay')
    .reduce((sum, r) => sum + Number(r.amount), 0);

  const totalExpensesUI = filtered
    .filter(r => r.type === 'Expense')
    .reduce((sum, r) => sum + Number(r.amount), 0);

  const netProfit = (totalCashCollected + totalGpayCollected + totalRazorpayCollected) - totalExpensesUI;

  const formatDateText = (d) => d ? d.split('-').reverse().join('-') : '';
  const displayDateText = viewMode === 'date'
    ? (date ? `For ${formatDateText(date)}` : '')
    : (dateRange.from || dateRange.to 
        ? `From ${formatDateText(dateRange.from) || 'Start'} to ${formatDateText(dateRange.to) || 'End'}` 
        : 'All Time');

  const typeOptions = ['Stock', '1 Hour Order', 'Pending Amount', 'Expense', 'Withdrawal', ...membershipPlans];
  const filterTypeOptions = ['Stock', '1 Hour Order', 'Pending Amount', 'Expense', 'Withdrawal', ...membershipPlans];

  const stockModalSessionAmt = stockModalRow ? (stockModalRow.sessionAmount !== undefined ? stockModalRow.sessionAmount : ((Number(stockModalRow.amount) || 0) - (stockModalRow.stockTotal || 0))) : 0;
  const stockModalTotalStockCost = activeStockItems.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
  const stockModalGrandTotal = stockModalSessionAmt + stockModalTotalStockCost;
  const stockModalTotalQty = activeStockItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only {
            display: block !important;
            width: 58mm;
            font-family: monospace;
            font-size: 13px;
            margin: 0;
            padding: 0;
            color: #000;
          }
          @page { margin: 0; }
        }
        @media screen {
          .print-only { display: none !important; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* ===== RESPONSIVE STYLES ===== */
        .dt-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .dt-title {
          font-weight: 900;
          font-size: 2.4rem;
          color: #00FFD4;
          letter-spacing: -0.5px;
          margin: 0;
        }
        .dt-toggle-group {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }
        .dt-filter-bar {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
          align-items: center;
        }
        .dt-filter-bar input,
        .dt-filter-bar select {
          flex: 1;
          min-width: 130px;
        }
        .dt-filter-bar button {
          white-space: nowrap;
        }
        .dt-main-layout {
          display: flex;
          gap: 20px;
          align-items: flex-start;
          margin-top: 10px;
        }
        .dt-sidebar {
          width: 280px;
          flex-shrink: 0;
          background: #fff;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        .dt-table-wrap {
          flex: 1;
          min-width: 0;
          overflow-x: auto;
        }
        .dt-modal-form {
          background: #fff;
          border-radius: 16px;
          min-width: 400px;
          max-width: min(680px, calc(100vw - 16px));
          box-shadow: 0 8px 40px rgba(0,0,0,0.22);
          width: 100%;
          box-sizing: border-box;
          max-height: 96vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .dt-modal-form-wide {
          background: #fff;
          border-radius: 16px;
          min-width: 400px;
          max-width: min(900px, calc(100vw - 16px));
          box-shadow: 0 8px 40px rgba(0,0,0,0.22);
          width: 100%;
          box-sizing: border-box;
          max-height: 96vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .dt-stock-modal-dark {
          background: #0f172a;
          border-radius: 16px;
          min-width: 400px;
          max-width: min(820px, calc(100vw - 16px));
          box-shadow: 0 8px 40px rgba(0,0,0,0.5);
          width: 100%;
          box-sizing: border-box;
          max-height: 96vh;
          border: 1px solid #1e293b;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .dt-modal-header {
          flex-shrink: 0;
          padding: 30px 40px 10px;
        }
        .dt-modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 10px 40px;
        }
        .dt-modal-footer {
          flex-shrink: 0;
          padding: 16px 40px 30px;
          border-top: 1px solid #cbd5e1;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          flex-wrap: wrap;
        }
        .dt-stock-modal-dark .dt-modal-footer {
          border-top: 1px solid #334155;
        }
        .dt-stock-catalog-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 14px;
        }
        .dt-stock-catalog-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 10px 8px;
          background: #1e293b;
          border: 1.5px solid #334155;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.15s;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
        }
        .dt-stock-catalog-btn:hover {
          border-color: #00FFD4;
          background: #0b1528;
          transform: translateY(-1px);
        }
        .dt-stock-item-row {
          display: grid;
          grid-template-columns: 1fr auto auto auto auto;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: #1e293b;
          border-radius: 8px;
          border: 1px solid #334155;
        }
        .dt-form-stock-card {
          display: grid;
          grid-template-columns: 1fr auto auto auto;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: #fff;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }

        @media (max-width: 768px) {
          .dt-title { font-size: 1.6rem; }
          .dt-toggle-group button { padding: 6px 12px !important; font-size: 12px !important; }
          .dt-main-layout { flex-direction: column; gap: 16px; }
          .dt-sidebar { width: 100% !important; }
          .dt-cashbox-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }
          .dt-modal-form, .dt-modal-form-wide, .dt-stock-modal-dark {
            min-width: unset;
            padding: 0 !important;
            border-radius: 12px;
            margin: 8px;
            width: calc(100vw - 16px);
            max-height: 94vh;
          }
          .dt-modal-header {
            padding: 18px 16px 8px;
          }
          .dt-modal-body {
            padding: 8px 16px;
          }
          .dt-modal-footer {
            padding: 12px 16px 18px;
          }
          .dt-modal-form h3, .dt-modal-form-wide h3, .dt-stock-modal-dark h3 { font-size: 18px !important; }
          .dt-modal-row { flex-direction: column !important; }
          .dt-filter-bar button { flex: 1 1 140px; }
          .dt-stock-catalog-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 6px !important; }
          .dt-stock-catalog-btn { padding: 6px 4px !important; font-size: 11px !important; }
          .dt-stock-item-row { grid-template-columns: 1fr auto auto auto auto; gap: 6px; padding: 8px 10px; }
          .dt-form-stock-card { grid-template-columns: 1fr auto auto auto; gap: 6px; padding: 8px 10px; }
        }

        @media (max-width: 480px) {
          .dt-title { font-size: 1.3rem; }
          .no-print > div { padding: 12px !important; }
          .dt-filter-bar { gap: 8px; }
          .dt-filter-bar input,
          .dt-filter-bar select { min-width: 100%; }
          .dt-stock-catalog-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 4px !important; }
          .dt-stock-catalog-btn { padding: 4px 2px !important; font-size: 10px !important; }
          .dt-stock-item-row { grid-template-columns: 1fr; gap: 6px; }
          .dt-form-stock-card { grid-template-columns: 1fr; gap: 4px; }
        }
      `}</style>

      <AdminLayout>
      <div className="no-print" style={{ padding: 0, margin: 0, width: '100%', minHeight: '100vh' }}>
        <div style={{ background: 'rgba(15, 25, 50, 0.5)', borderRadius: 0, boxShadow: 'none', padding: '20px', margin: 0, border: 'none' }}>
          <div className="dt-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <h2 className="dt-title" style={{ margin: 0 }}>Daily Tracker</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => setShowSidebar(prev => !prev)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: showSidebar ? '1.5px solid #00FFD4' : '1.5px solid #cbd5e1',
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: 'pointer',
                  background: showSidebar ? '#1e293b' : '#fff',
                  color: showSidebar ? '#00FFD4' : '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.15s'
                }}
                title="Toggle Summary & Stats"
              >
                <span style={{ fontSize: 16 }}>☰</span> Summary &amp; Stats
              </button>
              <div className="dt-toggle-group" style={{ margin: 0 }}>
                <button
                  onClick={() => setViewMode('date')}
                  style={{ padding: '8px 20px', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer', background: viewMode === 'date' ? '#2563eb' : '#f1f5f9', color: viewMode === 'date' ? '#fff' : '#475569' }}
                >📅 By Date</button>
                <button
                  onClick={() => setViewMode('all')}
                  style={{ padding: '8px 20px', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer', background: viewMode === 'all' ? '#7c3aed' : '#f1f5f9', color: viewMode === 'all' ? '#fff' : '#475569' }}
                >📊 All</button>
              </div>
            </div>
          </div>

          {/* Sport Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {[
              { key: 'all', label: '📊 All', bg: '#0f172a' },
              { key: 'swimming', label: '🏊 Swimming', bg: '#0891b2' },
              { key: 'badminton', label: '🏸 Badminton', bg: '#d97706' },
            ].map(tab => (
              <button key={tab.key} onClick={() => setSportTab(tab.key)}
                style={{ padding: '8px 20px', borderRadius: 8, border: sportTab === tab.key ? '2px solid ' + tab.bg : '2px solid #e2e8f0', fontWeight: 800, fontSize: 14, cursor: 'pointer', background: sportTab === tab.key ? tab.bg : '#f8fafc', color: sportTab === tab.key ? '#fff' : '#475569', transition: 'all 0.2s' }}
              >{tab.label}</button>
            ))}
          </div>

          <div className="dt-filter-bar">
            {viewMode === 'date' ? (
              <>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 15 }} title="Select date" />
                <input placeholder="Search..." value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 15 }} title="Search entries" />
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ padding: 10, borderRadius: 8, fontSize: 15, border: '1px solid #cbd5e1' }} title="Filter by type">
                  <option value="">All Types</option>
                  {filterTypeOptions.map(t => <option key={t}>{t}</option>)}
                </select>
                <button onClick={() => openModal()} style={{ padding: '10px 22px', borderRadius: 8, background: '#2563eb', color: '#fff', fontWeight: 700, border: 'none', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }} title="Add new entry">
                  <span style={{ fontSize: 18 }}>➕</span> Add Entry
                </button>
                <button onClick={downloadAndClear} style={{ padding: '10px 22px', borderRadius: 8, background: '#dc2626', color: '#fff', fontWeight: 700, border: 'none', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }} title="Download CSV then delete all entries">
                  <span style={{ fontSize: 18 }}>⬇️🗑️</span> Download &amp; Clear
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <span style={{ color: '#7c3aed', fontWeight: 700, fontSize: 16 }}>All history ({filtered.length} entries shown)</span>
                  
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => exportToCSV(filtered, cashBox, dateRange.from || dateRange.to ? `${dateRange.from || 'start'}_to_${dateRange.to || 'end'}_generated-${getNow().date}` : `ALL-HISTORY-${getNow().date}`)} style={{ padding: '10px 22px', borderRadius: 8, background: '#10b981', color: '#fff', fontWeight: 700, border: 'none', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 18 }}>⬇️</span> Download CSV
                    </button>
                    <button onClick={downloadAndClear} style={{ padding: '10px 22px', borderRadius: 8, background: '#dc2626', color: '#fff', fontWeight: 700, border: 'none', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 18 }}>⬇️🗑️</span> Download &amp; Clear All
                    </button>
                  </div>
                </div>
                
                {/* Secondary row of filters for All-History */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <input type="date" value={dateRange.from} onChange={e => setDateRange({...dateRange, from: e.target.value})} style={{ padding: 10, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }} />
                  <span style={{ color: '#64748b', fontSize: 14 }}>to</span>
                  <input type="date" value={dateRange.to} onChange={e => setDateRange({...dateRange, to: e.target.value})} style={{ padding: 10, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }} />
                  <button onClick={() => fetchData()} style={{ padding: '10px 16px', borderRadius: 8, background: '#7c3aed', color: '#fff', fontWeight: 700, border: 'none', fontSize: 14, cursor: 'pointer' }}>Apply Date Range</button>
                  
                  <input placeholder="Search..." value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, flex: 1, minWidth: 150 }} title="Search entries in current view" />
                  <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ padding: 10, borderRadius: 8, fontSize: 13, border: '1px solid #cbd5e1' }} title="Filter by type">
                    <option value="">All Types</option>
                    {filterTypeOptions.map(t => <option key={t}>{t}</option>)}
                  </select>

                  <button onClick={() => { setDateRange({from: '', to: ''}); setFilter(''); setTypeFilter(''); setTimeout(() => setViewMode('date'), 0); setTimeout(() => setViewMode('all'), 100); }} style={{ padding: '10px 16px', borderRadius: 8, background: '#e2e8f0', color: '#475569', fontWeight: 700, border: 'none', fontSize: 14, cursor: 'pointer' }}>Clear Filters</button>
                </div>
              </div>
            )}
          </div>
          {loading ? (
            <div style={{ color: '#2563eb', margin: 24, textAlign: 'center', fontSize: 18, fontWeight: 600 }}>
              <span className="spinner" style={{ display: 'inline-block', width: 24, height: 24, border: '3px solid #cbd5e1', borderTop: '3px solid #2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite', verticalAlign: 'middle', marginRight: 10 }} />
              Loading data...
            </div>
          ) : null}
          <div className="dt-main-layout">
            {/* ASIDE - SUMMARY + CASH BOX SIDEBAR */}
            {showSidebar && (
              <div className="dt-sidebar">
              {/* ── Display Summary (filter-aware) ── */}
              <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', padding: '14px 16px', fontWeight: 900, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span>📊</span> Display Summary
                {displayDateText && <span style={{ fontSize: 11, fontWeight: 500, color: '#e2e8f0', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: 99 }}>{displayDateText}</span>}
                <span style={{ fontSize: 11, fontWeight: 600, color: '#38bdf8', marginLeft: 'auto', background: 'rgba(56,189,248,0.15)', padding: '2px 8px', borderRadius: 99 }}>{filtered.length} entries</span>
                <button onClick={() => setSummaryMaximized(true)} title="Maximize summary" style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 6, color: '#94a3b8', cursor: 'pointer', fontSize: 14, padding: '2px 7px', marginLeft: 6, lineHeight: 1 }}>⛶</button>
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10, borderBottom: '1px solid #e2e8f0' }}>
                {/* Overall cash / gpay earnings */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 60px', minWidth: 0, background: 'linear-gradient(135deg, #fefce8, #fef9c3)', padding: '8px 10px', borderRadius: 8, borderLeft: '4px solid #eab308', boxShadow: '0 1px 3px rgba(234,179,8,0.15)', overflow: 'hidden' }}>
                    <div style={{ fontSize: 9, color: '#a16207', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>Cash</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: '#78350f', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>₹{totalCashCollected.toLocaleString('en-IN')}</div>
                  </div>
                  <div style={{ flex: '1 1 60px', minWidth: 0, background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', padding: '8px 10px', borderRadius: 8, borderLeft: '4px solid #7c3aed', boxShadow: '0 1px 3px rgba(124,58,237,0.15)', overflow: 'hidden' }}>
                    <div style={{ fontSize: 9, color: '#6d28d9', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>GPay</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: '#4c1d95', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>₹{totalGpayCollected.toLocaleString('en-IN')}</div>
                  </div>
                  <div style={{ flex: '1 1 60px', minWidth: 0, background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', padding: '8px 10px', borderRadius: 8, borderLeft: '4px solid #3b82f6', boxShadow: '0 1px 3px rgba(37,99,235,0.15)', overflow: 'hidden' }}>
                    <div style={{ fontSize: 9, color: '#1e40af', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>Razerpay</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: '#1e3a8a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>₹{totalRazorpayCollected.toLocaleString('en-IN')}</div>
                  </div>
                </div>
                {/* Per-type breakdown — only types present in filtered view */}
                {allTypesInCurrentView.map(type => {
                  const { cashAmt, gpayAmt, razorpayAmt, total } = getCategoryAmounts(type);

                  let count = 0;
                  if (type === '1 Hour Order') {
                    const typeRows = filtered.filter(r => r.type === type);
                    count = typeRows.reduce((sum, r) => {
                      if (r.headsCount !== undefined) return sum + r.headsCount;
                      const sessAmt = r.sessionAmount !== undefined ? r.sessionAmount : (Number(r.amount) - (r.stockTotal || 0));
                      return sum + (sessAmt > 0 ? (sessAmt % 150 === 0 ? Math.round(sessAmt / 150) : Math.round(sessAmt / 100)) : 1);
                    }, 0);
                  } else if (type === 'Stock') {
                    const pureStockCount = filtered.filter(r => r.type === 'Stock').length;
                    const stockItemsCount = filtered.reduce((sum, r) => sum + (r.stockItems ? r.stockItems.reduce((s, item) => s + (item.quantity || 0), 0) : 0), 0);
                    count = Math.max(pureStockCount, stockItemsCount);
                  } else {
                    count = filtered.filter(r => r.type === type).length;
                  }

                  // Color theme per type
                  const themes = {
                    'Stock':          { bg: '#ecfdf5', border: '#10b981', label: '#065f46', amount: '#047857', countBg: '#d1fae5', countText: '#047857' },
                    '1 Hour Order':   { bg: '#ecfdf5', border: '#059669', label: '#064e3b', amount: '#047857', countBg: '#d1fae5', countText: '#047857' },
                    'Expense':        { bg: '#fef2f2', border: '#ef4444', label: '#991b1b', amount: '#dc2626', countBg: '#fee2e2', countText: '#dc2626' },
                    'Withdrawal':     { bg: '#f8fafc', border: '#64748b', label: '#334155', amount: '#475569', countBg: '#e2e8f0', countText: '#475569' },
                    'Pending Amount': { bg: '#faf5ff', border: '#a855f7', label: '#6b21a8', amount: '#7c3aed', countBg: '#f3e8ff', countText: '#7c3aed' },
                  };
                  const defaultTheme = { bg: '#eff6ff', border: '#3b82f6', label: '#1e40af', amount: '#2563eb', countBg: '#dbeafe', countText: '#2563eb' };
                  const t = themes[type] || defaultTheme;
                  return (
                    <div key={type} style={{ background: t.bg, padding: '8px 10px', borderRadius: 8, borderLeft: `4px solid ${t.border}`, border: '1px solid #0f172a', borderLeftWidth: 4, borderLeftColor: t.border, transition: 'transform 0.15s', cursor: 'default' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: t.label, textTransform: 'uppercase', letterSpacing: 0.3 }}>{type}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: t.countText, background: t.countBg, padding: '1px 8px', borderRadius: 99 }}>Count: {count}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 10, fontSize: 11, fontWeight: 700, alignItems: 'center' }}>
                        {cashAmt > 0 && <span style={{ color: '#a16207' }}>Cash ₹{cashAmt.toLocaleString('en-IN')}</span>}
                        {gpayAmt > 0 && <span style={{ color: '#6d28d9' }}>GPay ₹{gpayAmt.toLocaleString('en-IN')}</span>}
                        {razorpayAmt > 0 && <span style={{ color: '#1e40af' }}>Razerpay ₹{razorpayAmt.toLocaleString('en-IN')}</span>}
                        <span style={{ marginLeft: 'auto', color: t.amount, fontWeight: 900, fontSize: 14 }}>₹{total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  );
                })}
                {allTypesInCurrentView.length === 0 && (
                  <div style={{ color: '#94a3b8', fontSize: 12, textAlign: 'center', padding: 8, fontStyle: 'italic' }}>No entries to summarize</div>
                )}
              </div>

              {/* ── Sport-Wise Cash Box ── */}
              <div style={{ background: '#1e293b', color: '#fff', padding: '14px 16px', fontWeight: 900, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>💰</span> Cash Box {sportTab !== 'all' ? `(${sportTab === 'swimming' ? '🏊 Swimming' : '🏸 Badminton'})` : '(Combined)'}
              </div>
              <div className="dt-cashbox-grid" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {(() => {
                  const prefix = sportTab === 'swimming' ? 'swimming' : sportTab === 'badminton' ? 'badminton' : '';
                  const cashVal = prefix ? (cashBox[`${prefix}HardCash`] || 0) : (cashBox.hardCash || 0);
                  const gpayVal = prefix ? (cashBox[`${prefix}GpayCash`] || 0) : (cashBox.gpayCash || 0);
                  const expVal = prefix ? (cashBox[`${prefix}LifetimeExpense`] || 0) : (cashBox.lifetimeExpense || 0);
                  const wdVal = prefix ? (cashBox[`${prefix}LifetimeWithdrawal`] || 0) : (cashBox.lifetimeWithdrawal || 0);
                  return (<>
                    <div style={{ background: '#f1f5f9', padding: '10px 12px', borderRadius: 8, borderLeft: '4px solid #10b981' }}>
                       <div style={{ fontSize: 11, color: '#475569', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>Cash Balance</div>
                       <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>₹ {cashVal.toLocaleString('en-IN')}</div>
                    </div>
                    <div style={{ background: '#f1f5f9', padding: '10px 12px', borderRadius: 8, borderLeft: '4px solid #3b82f6' }}>
                       <div style={{ fontSize: 11, color: '#475569', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>GPay Balance</div>
                       <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>₹ {gpayVal.toLocaleString('en-IN')}</div>
                    </div>
                    <div style={{ background: '#fef2f2', padding: '10px 12px', borderRadius: 8, borderLeft: '4px solid #ef4444' }}>
                       <div style={{ fontSize: 11, color: '#991b1b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>Lifetime Expense</div>
                       <div style={{ fontSize: 16, fontWeight: 800, color: '#7f1d1d' }}>₹ {expVal.toLocaleString('en-IN')}</div>
                    </div>
                    <div style={{ background: '#f0fdf4', padding: '10px 12px', borderRadius: 8, borderLeft: '4px solid #10b981' }}>
                       <div style={{ fontSize: 11, color: '#065f46', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>Lifetime Withdrawal</div>
                       <div style={{ fontSize: 16, fontWeight: 800, color: '#064e3b' }}>₹ {wdVal.toLocaleString('en-IN')}</div>
                    </div>
                  </>);
                })()}
              </div>
              
              {/* ── All-Time Totals ── */}
              <div style={{ background: '#1e293b', color: '#fff', padding: '14px 16px', fontWeight: 900, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8, borderTop: '1px solid #334155' }}>
                <span>📋</span> All-Time Totals
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(() => {
                   const orderStats = cashBox.orderStats || { count: 0, amount: 0 };
                   const oneHourOrderStats = cashBox.oneHourOrderStats || { count: 0, amount: 0 };
                   const memStats = cashBox.membershipStats || [];
                   
                   const items = [
                     { name: 'Stock', stats: orderStats },
                     { name: '1 Hour Order', stats: oneHourOrderStats },
                     ...memStats.map(m => ({ name: m.planName, stats: m }))
                   ];

                   return items.map(item => {
                     const displayCount = item.stats.count;
                     return (
                     <div key={item.name} style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <span style={{ fontSize: 12, color: '#0f172a', fontWeight: 800, textTransform: 'uppercase' }}>{item.name}</span>
                         <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Count: {displayCount}</span>
                       </div>
                       <div style={{ fontSize: 14, fontWeight: 800, color: '#10b981', marginTop: 4 }}>₹{(item.stats.amount || 0).toLocaleString('en-IN')}</div>
                     </div>
                   )});
                })()}
              </div>
            </div>
            )}

            {/* MAIN TABLE */}
            <div className="dt-table-wrap">
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, background: '#fff', borderRadius: 14, overflow: 'hidden', minWidth: 900, border: '1px solid #e2e8f0' }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>

                <tr style={{ background: '#f8fafc', color: '#475569', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  <th style={{ padding: '16px 14px', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>Type</th>
                  <th style={{ padding: '16px 14px', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>Sport</th>
                  <th style={{ padding: '16px 14px', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '16px 14px', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>Payment Type</th>
                  <th style={{ padding: '16px 14px', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>Amount</th>
                  <th style={{ padding: '16px 14px', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '16px 14px', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>Time</th>
                  <th style={{ padding: '16px 14px', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>Details/Notes</th>
                  <th style={{ padding: '16px 14px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', color: '#888', padding: 24, fontSize: 16 }}>No entries found.</td>
                  </tr>
                ) : filtered.map((row, idx) => {
                  const isEditing = editingId === row._id;
                  return (
                    <tr key={row._id || idx} style={{
                      background: isEditing ? '#eff6ff' : (idx % 2 === 0 ? '#f8fafc' : '#ffffff'),
                      transition: 'background 0.2s',
                    }}
                      onMouseEnter={(e) => !isEditing && (e.currentTarget.style.background = '#f1f5f9')}
                      onMouseLeave={(e) => !isEditing && (e.currentTarget.style.background = idx % 2 === 0 ? '#f8fafc' : '#ffffff')}
                    >
                      <td style={{ padding: '14px 14px', verticalAlign: 'middle', borderBottom: '1px solid #e2e8f0' }}>
                        {isEditing
                          ? <select value={editDraft.type} onChange={e => setEditDraft(d => ({ ...d, type: e.target.value }))} style={{ padding: '5px 8px', borderRadius: 6, border: '1.5px solid #2563eb', fontSize: 14, minWidth: 120 }}>
                              <option value="Stock">Stock</option>
                              <option value="1 Hour Order">1 Hour Order</option>
                              <option value="Pending Amount">Pending Amount</option>
                              <option value="Expense">Expense</option>
                              <option value="Withdrawal">Withdrawal</option>
                              {membershipPlans.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                          : <Badge color={getTypeColor(row.type)}>{row.type}</Badge>}
                      </td>
                      <td style={{ padding: '14px 14px', verticalAlign: 'middle', borderBottom: '1px solid #e2e8f0' }}>
                        {isEditing ? (
                          <select value={editDraft.serviceType || 'swimming'} onChange={e => setEditDraft(d => ({ ...d, serviceType: e.target.value }))} style={{ padding: '5px 8px', borderRadius: 6, border: '1.5px solid #2563eb', fontSize: 14 }}>
                            <option value="swimming">🏊 Swimming</option>
                            <option value="badminton">🏸 Badminton</option>
                          </select>
                        ) : (() => {
                          const st = row.serviceType || 'swimming';
                          const sportStyles = { swimming: { bg: '#e0f7fa', color: '#0891b2', label: '🏊' }, badminton: { bg: '#fff8e1', color: '#d97706', label: '🏸' } };
                          const s = sportStyles[st] || sportStyles.swimming;
                          return <span style={{ background: s.bg, color: s.color, padding: '4px 10px', borderRadius: 99, fontSize: 13, fontWeight: 800 }}>{s.label}</span>;
                        })()}
                      </td>
                      <td style={{ padding: '14px 14px', verticalAlign: 'middle', fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #e2e8f0' }}>
                        {isEditing ? (
                          <input value={editDraft.name} onChange={e => setEditDraft(d => ({ ...d, name: e.target.value }))} style={{ padding: '5px 8px', borderRadius: 6, border: '1.5px solid #2563eb', width: '100%', fontSize: 14 }} />
                        ) : (
                          <div>
                            <div>{row.name}</div>
                            {row.stockItems && row.stockItems.length > 0 && (
                              <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                {row.stockItems.map((item, i) => (
                                  <span key={i} style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '2px 8px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700 }}>
                                    🛍️ {item.name} (x{item.quantity})
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '14px 14px', verticalAlign: 'middle', borderBottom: '1px solid #e2e8f0' }}>
                        {isEditing
                          ? <select value={editDraft.paymentType} onChange={e => setEditDraft(d => ({ ...d, paymentType: e.target.value }))} style={{ padding: '5px 8px', borderRadius: 6, border: '1.5px solid #2563eb', fontSize: 14 }}>
                            <option value="cash">Cash</option>
                            <option value="gpay">GPay</option>
                            {editDraft.paymentType === 'razorpay' && <option value="razorpay">Razerpay</option>}
                          </select>
                          : <Badge color={getPaymentColor(row.paymentType)}>
                              {row.paymentType === 'razorpay' ? 'Razerpay' : row.paymentType === 'gpay' ? 'GPay' : row.paymentType === 'cash' ? 'Cash' : row.paymentType}
                            </Badge>}
                      </td>
                      <td style={{ padding: '14px 14px', verticalAlign: 'middle', fontWeight: 800, color: '#0f172a', borderBottom: '1px solid #e2e8f0' }}>
                        {isEditing
                          ? <input type="number" value={editDraft.amount} onChange={e => setEditDraft(d => ({ ...d, amount: Number(e.target.value) }))} style={{ padding: '5px 8px', borderRadius: 6, border: '1.5px solid #2563eb', width: 90, fontSize: 14 }} />
                          : <>₹ {Number(row.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</>}
                      </td>
                      <td style={{ padding: '14px 14px', verticalAlign: 'middle', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>{row.date}</td>
                      <td style={{ padding: '14px 14px', verticalAlign: 'middle', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>{formatHHmmTo12Hour(row.time)}</td>
                      <td style={{ padding: '14px 14px', verticalAlign: 'middle', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                        {isEditing
                          ? <input value={editDraft.notes} onChange={e => setEditDraft(d => ({ ...d, notes: e.target.value }))} style={{ padding: '5px 8px', borderRadius: 6, border: '1.5px solid #2563eb', width: '100%', fontSize: 14 }} />
                          : row.notes}
                      </td>
                      <td style={{ padding: '14px 14px', verticalAlign: 'middle', borderBottom: '1px solid #e2e8f0', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        {isEditing ? (
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                            <button onClick={() => saveEdit(row._id)} title="Save" style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>✅ Save</button>
                            <button onClick={cancelEdit} title="Cancel" style={{ background: '#64748b', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>✕</button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                            {(row.type === '1 Hour Order' || row.type === 'Public Order' || row.type === 'Order' || row.type === 'Stock') && (
                              <button onClick={() => openStockDrawer(row)} title="Manage Stocks" style={{ background: 'none', border: '1px solid #a855f7', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', fontSize: 16 }}>🛍️</button>
                            )}
                            <button onClick={() => startEdit(row)} title="Edit" style={{ background: 'none', border: '1px solid #cbd5e1', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', fontSize: 16 }}>✏️</button>
                            <button onClick={() => deleteRow(row._id)} title="Delete" style={{ background: 'none', border: '1px solid #fecaca', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', fontSize: 16 }}>🗑️</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          </div>
        </div>

        {/* Display Summary Fullscreen Overlay */}
        {summaryMaximized && (
          <div style={{ position: 'fixed', inset: 0, background: '#fff', zIndex: 1100, display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: '#fff', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 20 }}>📊</span>
              <span style={{ fontWeight: 900, fontSize: 18 }}>Display Summary</span>
              {displayDateText && <span style={{ fontSize: 13, fontWeight: 500, color: '#e2e8f0', background: 'rgba(255,255,255,0.1)', padding: '3px 12px', borderRadius: 99, marginLeft: 8 }}>{displayDateText}</span>}
              <span style={{ fontSize: 12, fontWeight: 600, color: '#38bdf8', marginLeft: 'auto', background: 'rgba(56,189,248,0.15)', padding: '2px 10px', borderRadius: 99 }}>{filtered.length} entries</span>
              <button onClick={() => setSummaryMaximized(false)} style={{ marginLeft: 10, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, color: '#fff', cursor: 'pointer', fontSize: 18, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            {/* Body */}
            <div style={{ padding: '24px', flex: 1, overflowY: 'auto', background: '#f8fafc' }}>
              <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  <div style={{ background: 'linear-gradient(135deg, #fefce8, #fef9c3)', padding: '20px', borderRadius: 12, borderLeft: '6px solid #eab308', boxShadow: '0 4px 12px rgba(234,179,8,0.1)' }}>
                    <div style={{ fontSize: 13, color: '#a16207', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Cash Earnings</div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: '#78350f' }}>₹{totalCashCollected.toLocaleString('en-IN')}</div>
                  </div>
                  <div style={{ background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', padding: '20px', borderRadius: 12, borderLeft: '6px solid #7c3aed', boxShadow: '0 4px 12px rgba(124,58,237,0.1)' }}>
                    <div style={{ fontSize: 13, color: '#6d28d9', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>GPay Earnings</div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: '#4c1d95' }}>₹{totalGpayCollected.toLocaleString('en-IN')}</div>
                  </div>
                  <div style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', padding: '20px', borderRadius: 12, borderLeft: '6px solid #3b82f6', boxShadow: '0 4px 12px rgba(37,99,235,0.1)' }}>
                    <div style={{ fontSize: 13, color: '#1e40af', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Razerpay Earnings</div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: '#1e3a8a' }}>₹{totalRazorpayCollected.toLocaleString('en-IN')}</div>
                  </div>
                </div>
                {/* Per-type grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                  {allTypesInCurrentView.map(type => {
                    const { cashAmt, gpayAmt, razorpayAmt, total } = getCategoryAmounts(type);

                    let count = 0;
                    if (type === '1 Hour Order') {
                      const typeRows = filtered.filter(r => r.type === type);
                      count = typeRows.reduce((sum, r) => {
                        if (r.headsCount !== undefined) return sum + r.headsCount;
                        const sessAmt = r.sessionAmount !== undefined ? r.sessionAmount : (Number(r.amount) - (r.stockTotal || 0));
                        return sum + (sessAmt > 0 ? (sessAmt % 150 === 0 ? Math.round(sessAmt / 150) : Math.round(sessAmt / 100)) : 1);
                      }, 0);
                    } else if (type === 'Stock') {
                      const pureStockCount = filtered.filter(r => r.type === 'Stock').length;
                      const stockItemsCount = filtered.reduce((sum, r) => sum + (r.stockItems ? r.stockItems.reduce((s, item) => s + (item.quantity || 0), 0) : 0), 0);
                      count = Math.max(pureStockCount, stockItemsCount);
                    } else {
                      count = filtered.filter(r => r.type === type).length;
                    }

                    const themes = {
                      'Stock':          { bg: '#ecfdf5', border: '#10b981', label: '#065f46', amount: '#047857', countBg: '#d1fae5', countText: '#047857' },
                      '1 Hour Order':   { bg: '#ecfdf5', border: '#059669', label: '#064e3b', amount: '#047857', countBg: '#d1fae5', countText: '#047857' },
                      'Expense':        { bg: '#fef2f2', border: '#ef4444', label: '#991b1b', amount: '#dc2626', countBg: '#fee2e2', countText: '#dc2626' },
                      'Withdrawal':     { bg: '#f8fafc', border: '#64748b', label: '#334155', amount: '#475569', countBg: '#e2e8f0', countText: '#475569' },
                      'Pending Amount': { bg: '#faf5ff', border: '#a855f7', label: '#6b21a8', amount: '#7c3aed', countBg: '#f3e8ff', countText: '#7c3aed' },
                    };
                    const defaultTheme = { bg: '#eff6ff', border: '#3b82f6', label: '#1e40af', amount: '#2563eb', countBg: '#dbeafe', countText: '#2563eb' };
                    const t = themes[type] || defaultTheme;
                    return (
                      <div key={type} style={{ background: t.bg, padding: '16px 20px', borderRadius: 12, border: '1px solid rgba(15,23,42,0.1)', borderLeftWidth: 6, borderLeftColor: t.border, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                          <span style={{ fontSize: 14, fontWeight: 800, color: t.label, textTransform: 'uppercase', letterSpacing: 0.3 }}>{type}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: t.countText, background: t.countBg, padding: '3px 12px', borderRadius: 99 }}>Count: {count}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 14, fontSize: 13, fontWeight: 700, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
                          {cashAmt > 0 && <span style={{ color: '#a16207' }}>Cash ₹{cashAmt.toLocaleString('en-IN')}</span>}
                          {gpayAmt > 0 && <span style={{ color: '#6d28d9' }}>GPay ₹{gpayAmt.toLocaleString('en-IN')}</span>}
                          {razorpayAmt > 0 && <span style={{ color: '#1e40af' }}>Razerpay ₹{razorpayAmt.toLocaleString('en-IN')}</span>}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: `1px solid ${t.border}40`, paddingTop: 8, marginTop: 'auto' }}>
                          <span style={{ color: t.amount, fontWeight: 900, fontSize: 20 }}>₹{total.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    );
                  })}
                  {allTypesInCurrentView.length === 0 && (
                    <div style={{ gridColumn: '1/-1', color: '#94a3b8', fontSize: 15, textAlign: 'center', padding: 40, fontStyle: 'italic', background: '#fff', borderRadius: 12 }}>No entries to summarize</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Manage Stock */}
        {showStockModal && stockModalRow && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(5,10,30,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '10px', boxSizing: 'border-box' }}>
            <div className="dt-stock-modal-dark">
              {/* Header Container */}
              <div className="dt-modal-header">
                <h3 style={{ fontWeight: 900, fontSize: 22, marginBottom: 12, color: '#00FFD4', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 24 }}>🛍️</span> Merchandise Sales
                  <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 600, color: '#64748b', background: '#1e293b', padding: '4px 12px', borderRadius: 99, border: '1px solid #334155' }}>Order Stocks</span>
                </h3>
                {/* Customer info banner */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'linear-gradient(135deg, #0d2137 0%, #0f172a 100%)', padding: '12px 16px', borderRadius: 10, border: '1px solid #1e3a5f' }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #0099FF, #00FFD4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#0f172a', flexShrink: 0 }}>
                    {(stockModalRow.name || 'C')[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>{stockModalRow.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                      {stockModalRow.type} &nbsp;·&nbsp; {stockModalRow.serviceType || 'swimming'} &nbsp;·&nbsp; {stockModalRow.paymentType?.toUpperCase()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Session</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: '#00FFD4' }}>₹{stockModalSessionAmt.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>

              {/* Body Container */}
              <div className="dt-modal-body">
                {/* Quick-add product grid */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 11, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>📦 Quick Add Products</div>
                  <div className="dt-stock-catalog-grid">
                    {getContextualStocks(stockModalRow.type).map(p => {
                      const inCart = activeStockItems.find(i => i.name === p.name);
                      const originalItem = stockModalRow?.stockItems?.find(i => i.name === p.name);
                      const originalQty = originalItem ? originalItem.quantity : 0;
                      const maxAllowed = p.count + originalQty;
                      const remainingCount = maxAllowed - (inCart?.quantity || 0);
                      const isOutOfStock = remainingCount <= 0;
                      return (
                        <button key={p.name} type="button" className="dt-stock-catalog-btn"
                          disabled={isOutOfStock}
                          onClick={() => {
                            const existsIdx = activeStockItems.findIndex(i => i.name === p.name);
                            if (existsIdx > -1) {
                              const item = activeStockItems[existsIdx];
                              if (item.quantity >= maxAllowed) {
                                Swal.fire('Limit Reached', `Only ${maxAllowed} of ${p.name} is available in stock.`, 'warning');
                                return;
                              }
                              const updated = [...activeStockItems];
                              updated[existsIdx].quantity += 1;
                              updated[existsIdx].total = updated[existsIdx].quantity * updated[existsIdx].price;
                              setActiveStockItems(updated);
                            } else {
                              if (maxAllowed <= 0) {
                                Swal.fire('Out of Stock', `${p.name} is out of stock.`, 'warning');
                                return;
                              }
                              setActiveStockItems([...activeStockItems, { name: p.name, quantity: 1, price: p.price, total: p.price }]);
                            }
                          }}
                          style={{ 
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 8px', 
                            background: isOutOfStock ? '#1e293b' : (inCart ? '#0d2137' : '#1e293b'), 
                            border: isOutOfStock ? '1.5px solid #ef4444' : (inCart ? '1.5px solid #00FFD4' : '1.5px solid #334155'), 
                            borderRadius: 10, cursor: isOutOfStock ? 'not-allowed' : 'pointer', transition: 'all 0.15s', 
                            color: isOutOfStock ? '#64748b' : '#fff', fontSize: 11, fontWeight: 700, position: 'relative',
                            opacity: isOutOfStock ? 0.5 : 1
                          }}>
                          {inCart && <span style={{ position: 'absolute', top: 5, right: 7, background: '#00FFD4', color: '#0f172a', borderRadius: 99, fontSize: 10, fontWeight: 900, padding: '0px 5px' }}>x{inCart.quantity}</span>}
                          <span style={{ fontSize: 20 }}>{p.name.toLowerCase().includes('cap') ? '🎓' : p.name.toLowerCase().includes('suit') ? '🥋' : p.name.toLowerCase().includes('goggle') ? '🥽' : p.name.toLowerCase().includes('grip') ? '🏸' : p.name.toLowerCase().includes('shuttle') ? '🏹' : '🎧'}</span>
                          <span style={{ fontSize: 11, textAlign: 'center' }}>{p.name} {p.isRental ? '(Rent)' : ''}</span>
                          <span style={{ fontSize: 10, color: isOutOfStock ? '#ef4444' : '#fbbf24' }}>
                            {isOutOfStock ? 'Out of Stock' : `${remainingCount} left`}
                          </span>
                          <span style={{ fontSize: 11, color: '#00FFD4', fontWeight: 800 }}>₹{p.price}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom product row */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginTop: 8 }}>
                    <input placeholder="Custom item name" value={customStockName} onChange={e => setCustomStockName(e.target.value)} style={{ flex: 1, minWidth: 130, padding: '8px 12px', borderRadius: 8, border: '1px solid #334155', background: '#0b0f19', color: '#fff', fontSize: 13 }} />
                    <input type="number" placeholder="₹ Price" value={customStockPrice} onChange={e => setCustomStockPrice(e.target.value)} style={{ width: 90, padding: '8px 12px', borderRadius: 8, border: '1px solid #334155', background: '#0b0f19', color: '#fff', fontSize: 13 }} />
                    <button type="button" onClick={addStockItem} disabled={!customStockName.trim() || !customStockPrice}
                      style={{ padding: '8px 16px', borderRadius: 8, background: customStockName.trim() && customStockPrice ? '#00FFD4' : '#334155', color: customStockName.trim() && customStockPrice ? '#0f172a' : '#64748b', border: 'none', fontWeight: 800, fontSize: 13, cursor: customStockName.trim() && customStockPrice ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap' }}>+ Add Custom</button>
                  </div>
                </div>

                {/* Active items table */}
                {activeStockItems.length > 0 ? (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                      🛒 Cart Items
                      <span style={{ background: '#00FFD4', color: '#0f172a', borderRadius: 99, padding: '1px 8px', fontSize: 11, fontWeight: 900 }}>{stockModalTotalQty} item{stockModalTotalQty !== 1 ? 's' : ''}</span>
                    </div>
                    {/* Table header */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 80px 90px 32px', gap: 8, padding: '6px 14px', borderRadius: 6, fontSize: 10, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
                      <span>Product</span><span style={{ textAlign: 'center' }}>Qty</span><span style={{ textAlign: 'center' }}>Unit Price</span><span style={{ textAlign: 'right' }}>Subtotal</span><span></span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {activeStockItems.map((item, idx) => (
                        <div key={idx} className="dt-stock-item-row" style={{ display: 'grid', gridTemplateColumns: '1fr 90px 80px 90px 32px', gap: 8, alignItems: 'center', padding: '10px 14px', background: '#1e293b', borderRadius: 8, border: '1px solid #334155' }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13, color: '#e2e8f0' }}>{item.name}</div>
                            <div style={{ fontSize: 11, color: '#475569', marginTop: 1 }}>@ ₹{item.price.toLocaleString('en-IN')} each</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#0f172a', borderRadius: 20, padding: '3px 8px', border: '1px solid #334155' }}>
                              <button type="button" onClick={() => updateStockQuantity(idx, -1)} style={{ width: 24, height: 24, borderRadius: '50%', border: 'none', background: '#1e293b', color: '#00FFD4', fontWeight: 900, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>−</button>
                              <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 900, fontSize: 15, color: '#00FFD4' }}>{item.quantity}</span>
                              <button type="button" onClick={() => updateStockQuantity(idx, 1)} style={{ width: 24, height: 24, borderRadius: '50%', border: 'none', background: '#1e293b', color: '#00FFD4', fontWeight: 900, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>+</button>
                            </div>
                          </div>
                          <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 12, color: '#94a3b8' }}>₹{item.price.toLocaleString('en-IN')}</div>
                          <div style={{ textAlign: 'right', fontWeight: 800, fontSize: 13, color: '#00FFD4' }}>₹{item.total.toLocaleString('en-IN')}</div>
                          <button type="button" onClick={() => removeStockItem(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px 0', color: '#475569', fontSize: 13, fontStyle: 'italic', marginBottom: 16 }}>No items added yet. Use the quick-add grid above.</div>
                )}

                {/* Bill Summary */}
                <div style={{ background: 'linear-gradient(135deg, #0d2137, #0b0f19)', border: '1px solid #1e3a5f', borderRadius: 10, padding: '14px 18px', marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: '#475569', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>Bill Summary</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>
                    <span>Session Booking</span>
                    <span style={{ color: '#e2e8f0', fontWeight: 700 }}>₹{stockModalSessionAmt.toLocaleString('en-IN')}</span>
                  </div>
                  {activeStockItems.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 4 }}>
                      <span>{item.name} × {item.quantity}</span>
                      <span style={{ color: '#94a3b8' }}>₹{item.total.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  <div style={{ height: 1, background: '#1e293b', margin: '10px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>Grand Total</span>
                    <span style={{ fontWeight: 900, fontSize: 22, color: '#00FFD4' }}>₹{stockModalGrandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Footer Container */}
              <div className="dt-modal-footer">
                <button type="button" onClick={closeStockDrawer} disabled={loading} style={{ background: '#1e293b', color: '#94a3b8', padding: '10px 24px', borderRadius: 8, border: '1px solid #334155', fontWeight: 700, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.15s' }}>Cancel</button>
                <button type="button" onClick={saveStockSales} disabled={loading} style={{ background: 'linear-gradient(135deg, #00FFD4, #0099FF)', color: '#0f172a', padding: '10px 28px', borderRadius: 8, border: 'none', fontWeight: 900, fontSize: 15, boxShadow: '0 4px 16px rgba(0,255,212,0.25)', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>{loading ? 'Saving...' : '💾 Save Stock Details'}</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Add Entry */}
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(7px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '10px', boxSizing: 'border-box' }}>
            <form onSubmit={saveModal} className={formType === '1 Hour Order' || formType === 'Public Order' || formType === 'Order' || formType === 'Stock' ? 'dt-modal-form-wide' : 'dt-modal-form'}>
              {/* Header Container */}
              <div className="dt-modal-header">
                <h3 style={{ fontWeight: 900, fontSize: 24, marginBottom: 8, color: '#2563eb', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 22 }}>📝</span> Add Daily Entry
                </h3>
                <div style={{ color: '#64748b', fontSize: 14, background: '#f1f5f9', padding: 10, borderRadius: 6 }}>
                  <span style={{ color: '#ef4444' }}>Admins: Double-check amount and type before saving.</span>
                </div>
              </div>

              {/* Body Container */}
              <div className="dt-modal-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 10 }}>
                  {/* Sport Selector */}
                  <div>
                    <label style={{ fontWeight: 700, color: '#1e293b', marginBottom: 6, display: 'block' }}>Sport <span style={{ color: '#ef4444' }}>*</span></label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {[
                        { key: 'swimming', label: '🏊 Swimming', bg: '#0891b2' },
                        { key: 'badminton', label: '🏸 Badminton', bg: '#d97706' },
                      ].map(s => (
                        <button type="button" key={s.key} onClick={() => setFormServiceType(s.key)}
                          style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: formServiceType === s.key ? `2px solid ${s.bg}` : '2px solid #e2e8f0', fontWeight: 800, fontSize: 13, cursor: 'pointer', background: formServiceType === s.key ? s.bg : '#f8fafc', color: formServiceType === s.key ? '#fff' : '#475569', transition: 'all 0.2s' }}
                        >{s.label}</button>
                      ))}
                    </div>
                    <input type="hidden" name="serviceType" value={formServiceType} />
                  </div>
                  <div className="dt-modal-row" style={{ display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>Type <span style={{ color: '#ef4444' }}>*</span></label>
                      <select name="type" value={formType} onChange={e => {
                        const selectedType = e.target.value;
                        setFormType(selectedType);
                        const stockTotal = formStockItems.reduce((sum, item) => sum + item.total, 0);
                        if (selectedType === '1 Hour Order') {
                          // No default heads count; user will input manually
                          setFormHeadsCount('');
                          setFormAmount(stockTotal > 0 ? String(stockTotal) : '');
                        } else {
                          setFormAmount(stockTotal > 0 ? String(stockTotal) : '');
                        }
                      }} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 15 }}>
                        <option value="">Select type</option>
                        {typeOptions.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>Payment <span style={{ color: '#ef4444' }}>*</span></label>
                      <select name="paymentType" defaultValue={modalData?.paymentType || ''} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 15 }}>
                        <option value="">Select payment</option>
                        {paymentOptions.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="dt-modal-row" style={{ display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>Name <span style={{ color: '#ef4444' }}>*</span></label>
                      <input name="name" placeholder="Full name or description" defaultValue={modalData?.name || ''} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 15 }} />
                    </div>
                    {formType === '1 Hour Order' ? (
                      <div style={{ flex: 1 }}>
                        <label style={{ fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>Heads / Customer Count <span style={{ color: '#ef4444' }}>*</span></label>
                        <input name="headsCount" type="number" min="0" step="1" value={formHeadsCount} onChange={e => {
                          const val = e.target.value;
                          const hc = val ? Math.max(1, parseInt(val)) : '';
                          setFormHeadsCount(hc);
                          const stockTotal = formStockItems.reduce((sum, item) => sum + item.total, 0);
                          setFormAmount(val ? String((hc * 100) + stockTotal) : String(stockTotal));
                        }} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 15 }} />
                        <div style={{ marginTop: 10, padding: '10px 14px', background: 'linear-gradient(135deg, #1e3a5f, #0d2137)', borderRadius: 8, border: '1px solid #2563eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 700, fontSize: 13, color: '#93c5fd' }}>Total Amount</span>
                          <span style={{ fontWeight: 900, fontSize: 20, color: '#00FFD4' }}>₹{(Number(formAmount) || 0).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    ) : (
                      <div style={{ flex: 1 }}>
                        <label style={{ fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>Amount (₹) <span style={{ color: '#ef4444' }}>*</span></label>
                        <input name="amount" type="number" min="0" step="0.01" placeholder="0.00" value={formAmount} onChange={e => setFormAmount(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 15 }} />
                      </div>
                    )}
                  </div>
                  <div className="dt-modal-row" style={{ display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>Date <span style={{ color: '#ef4444' }}>*</span></label>
                      <input name="date" type="date" defaultValue={modalData?.date || date} readOnly required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 15, opacity: 0.7, cursor: 'not-allowed', backgroundColor: '#f9fafb' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>Time <span style={{ color: '#ef4444' }}>*</span></label>
                      <input name="time" type="time" defaultValue={modalData?.time || getNow().time} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 15 }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>Details/Notes</label>
                    <input name="notes" placeholder="Optional notes, remarks, etc." defaultValue={modalData?.notes || ''} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 15 }} />
                  </div>

                  {/* Inline Stock Selection for hour order */}
                  {(formType === '1 Hour Order' || formType === 'Public Order' || formType === 'Order' || formType === 'Stock') && (
                    <div style={{ background: 'linear-gradient(135deg, #f0f9ff, #f8fafc)', padding: '16px', borderRadius: 12, border: '1.5px solid #bfdbfe', marginTop: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                        <h4 style={{ margin: 0, fontSize: 13, color: '#1d4ed8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.6, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>🎒</span> Merchandise / Stock
                        </h4>
                        {formStockItems.length > 0 && (
                          <span style={{ background: '#2563eb', color: '#fff', borderRadius: 99, padding: '2px 10px', fontSize: 11, fontWeight: 900 }}>
                            {formStockItems.reduce((s, i) => s + i.quantity, 0)} item{formStockItems.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      {/* Quick preset grid */}
                      <div className="dt-stock-catalog-grid" style={{ marginBottom: 10 }}>
                        {getContextualStocks(formType).map(p => {
                          const inCart = formStockItems.find(i => i.name === p.name);
                          const remainingCount = p.count - (inCart?.quantity || 0);
                          const isOutOfStock = remainingCount <= 0;
                          return (
                            <button key={p.name} type="button"
                              disabled={isOutOfStock}
                              onClick={() => {
                                const existsIdx = formStockItems.findIndex(i => i.name === p.name);
                                let updated;
                                if (existsIdx > -1) {
                                  if (formStockItems[existsIdx].quantity >= p.count) {
                                    Swal.fire('Limit Reached', `Only ${p.count} of ${p.name} is available in stock.`, 'warning');
                                    return;
                                  }
                                  updated = [...formStockItems];
                                  updated[existsIdx].quantity += 1;
                                  updated[existsIdx].total = updated[existsIdx].quantity * updated[existsIdx].price;
                                } else {
                                  if (p.count <= 0) {
                                    Swal.fire('Out of Stock', `${p.name} is out of stock.`, 'warning');
                                    return;
                                  }
                                  updated = [...formStockItems, { name: p.name, quantity: 1, price: p.price, total: p.price }];
                                }
                                setFormStockItems(updated);
                                const stockTotal = updated.reduce((sum, item) => sum + item.total, 0);
                                setFormAmount(String((formType === '1 Hour Order' ? (formHeadsCount * 100) : 0) + stockTotal));
                              }}
                              style={{ 
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '9px 6px', 
                                background: isOutOfStock ? '#f1f5f9' : (inCart ? '#dbeafe' : '#fff'), 
                                border: isOutOfStock ? '2px solid #ef4444' : (inCart ? '2px solid #2563eb' : '1.5px solid #e2e8f0'), 
                                borderRadius: 9, cursor: isOutOfStock ? 'not-allowed' : 'pointer', transition: 'all 0.15s', 
                                color: isOutOfStock ? '#94a3b8' : '#1e293b', fontSize: 12, fontWeight: 700, position: 'relative', 
                                boxShadow: '0 1px 3px rgba(0,0,0,0.04)', opacity: isOutOfStock ? 0.55 : 1
                              }}>
                              {inCart && <span style={{ position: 'absolute', top: 4, right: 5, background: '#2563eb', color: '#fff', borderRadius: 99, fontSize: 9, fontWeight: 900, padding: '0px 4px' }}>×{inCart.quantity}</span>}
                              <span style={{ fontSize: 18 }}>{p.name.toLowerCase().includes('cap') ? '🎓' : p.name.toLowerCase().includes('suit') ? '🥋' : p.name.toLowerCase().includes('goggle') ? '🥽' : p.name.toLowerCase().includes('grip') ? '🏸' : p.name.toLowerCase().includes('shuttle') ? '🏹' : '🎧'}</span>
                              <span style={{ fontSize: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{p.name} {p.isRental ? '(Rent)' : ''}</span>
                              <span style={{ fontSize: 10, color: isOutOfStock ? '#ef4444' : '#d97706' }}>
                                {isOutOfStock ? 'Out of Stock' : `${remainingCount} left`}
                              </span>
                              <span style={{ fontSize: 11, color: '#2563eb', fontWeight: 800 }}>₹{p.price}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom item row */}
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
                        <input placeholder="Custom item name" value={formCustomName} onChange={e => setFormCustomName(e.target.value)} style={{ flex: 1, minWidth: 120, padding: '7px 10px', borderRadius: 7, border: '1px solid #cbd5e1', fontSize: 13, background: '#fff' }} />
                        <input type="number" placeholder="₹ Price" value={formCustomPrice} onChange={e => setFormCustomPrice(e.target.value)} style={{ width: 80, padding: '7px 10px', borderRadius: 7, border: '1px solid #cbd5e1', fontSize: 13, background: '#fff' }} />
                        <button type="button" onClick={() => {
                          if (!formCustomName.trim() || !formCustomPrice) return;
                          const name = formCustomName.trim();
                          const price = parseFloat(formCustomPrice) || 0;
                          
                          // Check if name matches a preset stock and enforce limit
                          const dbStock = getContextualStocks(formType).find(p => p.name.toLowerCase() === name.toLowerCase());
                          
                          const existsIdx = formStockItems.findIndex(item => item.name.toLowerCase() === name.toLowerCase());
                          let updated;
                          if (existsIdx > -1) {
                            const item = formStockItems[existsIdx];
                            if (dbStock && item.quantity >= dbStock.count) {
                              Swal.fire('Limit Reached', `Only ${dbStock.count} of ${dbStock.name} is available in stock.`, 'warning');
                              return;
                            }
                            updated = [...formStockItems];
                            updated[existsIdx].quantity += 1;
                            updated[existsIdx].total = updated[existsIdx].quantity * updated[existsIdx].price;
                          } else {
                            if (dbStock && dbStock.count <= 0) {
                              Swal.fire('Out of Stock', `${dbStock.name} is out of stock.`, 'warning');
                              return;
                            }
                            updated = [...formStockItems, { name, quantity: 1, price, total: price }];
                          }
                          setFormStockItems(updated);
                          const stockTotal = updated.reduce((sum, i) => sum + i.total, 0);
                          setFormAmount(String((formType === '1 Hour Order' ? (formHeadsCount * 100) : 0) + stockTotal));
                          setFormCustomName('');
                          setFormCustomPrice('');
                        }} disabled={!formCustomName.trim() || !formCustomPrice}
                          style={{ padding: '7px 14px', borderRadius: 7, background: formCustomName.trim() && formCustomPrice ? '#2563eb' : '#e2e8f0', color: formCustomName.trim() && formCustomPrice ? '#fff' : '#94a3b8', border: 'none', fontWeight: 700, fontSize: 13, cursor: formCustomName.trim() && formCustomPrice ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap' }}>+ Add</button>
                      </div>

                      {/* Cart items list */}
                      {formStockItems.length > 0 && (
                        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #dbeafe', overflow: 'hidden' }}>
                          {/* Col headers */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 88px 72px 72px 28px', gap: 6, padding: '7px 14px', background: '#eff6ff', fontSize: 10, fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: 0.4 }}>
                            <span>Item</span><span style={{ textAlign: 'center' }}>Qty</span><span style={{ textAlign: 'center' }}>Price</span><span style={{ textAlign: 'right' }}>Total</span><span></span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            {formStockItems.map((item, idx) => (
                              <div key={idx} className="dt-form-stock-card" style={{ display: 'grid', gridTemplateColumns: '1fr 88px 72px 72px 28px', gap: 6, alignItems: 'center', padding: '9px 14px', borderBottom: idx < formStockItems.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                                <div>
                                  <div style={{ fontWeight: 700, fontSize: 13, color: '#1e293b' }}>{item.name}</div>
                                  <div style={{ fontSize: 10, color: '#94a3b8' }}>@ ₹{item.price}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f1f5f9', borderRadius: 20, padding: '3px 8px', border: '1px solid #cbd5e1' }}>
                                    <button type="button" onClick={() => {
                                      const updated = [...formStockItems];
                                      updated[idx].quantity = Math.max(1, updated[idx].quantity - 1);
                                      updated[idx].total = updated[idx].quantity * updated[idx].price;
                                      setFormStockItems(updated);
                                      const stockTotal = updated.reduce((sum, i) => sum + i.total, 0);
                                      setFormAmount(String((formType === '1 Hour Order' ? (formHeadsCount * 100) : 0) + stockTotal));
                                    }} style={{ width: 22, height: 22, borderRadius: '50%', border: 'none', background: '#fff', color: '#2563eb', fontWeight: 900, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>−</button>
                                    <span style={{ fontWeight: 800, fontSize: 14, color: '#2563eb', minWidth: 18, textAlign: 'center' }}>{item.quantity}</span>
                                    <button type="button" onClick={() => {
                                      const item = formStockItems[idx];
                                      const dbStock = getContextualStocks(formType).find(p => p.name.toLowerCase() === item.name.toLowerCase());
                                      if (dbStock && item.quantity >= dbStock.count) {
                                        Swal.fire('Limit Reached', `Only ${dbStock.count} of ${item.name} is available in stock.`, 'warning');
                                        return;
                                      }
                                      const updated = [...formStockItems];
                                      updated[idx].quantity += 1;
                                      updated[idx].total = updated[idx].quantity * updated[idx].price;
                                      setFormStockItems(updated);
                                      const stockTotal = updated.reduce((sum, i) => sum + i.total, 0);
                                      setFormAmount(String((formType === '1 Hour Order' ? (formHeadsCount * 100) : 0) + stockTotal));
                                    }} style={{ width: 22, height: 22, borderRadius: '50%', border: 'none', background: '#fff', color: '#2563eb', fontWeight: 900, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>+</button>
                                  </div>
                                </div>
                                <div style={{ textAlign: 'center', fontSize: 12, color: '#64748b', fontWeight: 600 }}>₹{item.price}</div>
                                <div style={{ textAlign: 'right', fontSize: 13, fontWeight: 800, color: '#1d4ed8' }}>₹{item.total}</div>
                                <button type="button" onClick={() => {
                                  const updated = formStockItems.filter((_, i) => i !== idx);
                                  setFormStockItems(updated);
                                  const stockTotal = updated.reduce((sum, i) => sum + i.total, 0);
                                  setFormAmount(String((formType === '1 Hour Order' ? (formHeadsCount * 100) : 0) + stockTotal));
                                }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                              </div>
                            ))}
                          </div>
                          {/* Totals row */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#eff6ff', borderTop: '1.5px solid #bfdbfe' }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#3b82f6' }}>
                              1 Hr Booking: <strong style={{ color: '#0f172a' }}>₹{formType === '1 Hour Order' ? (formHeadsCount * 100) : 0}</strong>
                              &nbsp;+&nbsp; Stocks: <strong style={{ color: '#0f172a' }}>₹{formStockItems.reduce((s, i) => s + i.total, 0)}</strong>
                            </span>
                            <span style={{ fontSize: 15, fontWeight: 900, color: '#1d4ed8' }}>Total ₹{formAmount}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Container */}
              <div className="dt-modal-footer">
                <button type="button" onClick={closeModal} disabled={loading} style={{ background: '#f1f5f9', color: '#333', padding: '10px 28px', borderRadius: 7, border: 'none', fontWeight: 700, fontSize: 16, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>Cancel</button>
                <button type="submit" name="action" value="save" disabled={loading} style={{ background: '#2563eb', color: '#fff', padding: '10px 20px', borderRadius: 7, border: 'none', fontWeight: 800, fontSize: 16, letterSpacing: 1, boxShadow: '0 4px 6px -1px #2563eb44', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>{loading ? 'Saving...' : 'Save'}</button>
                {formType === 'Public Order' || formType === 'Order' || formType === '1 Hour Order' ? (
                  <button type="submit" name="action" value="print" disabled={loading} style={{ background: '#059669', color: '#fff', padding: '10px 20px', borderRadius: 7, border: 'none', fontWeight: 800, fontSize: 16, letterSpacing: 1, boxShadow: '0 4px 6px -1px #05966944', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>{loading ? 'Saving...' : 'Save & Print'}</button>
                ) : ''}
              </div>
            </form>
          </div>
        )}
        </div>

      {/* Hidden Thermal Printer Container (Compact Layout) */}
      <div className="print-only">
        {printData && (
          <div style={{ width: '100%', padding: '0 4px', boxSizing: 'border-box' }}>
            <h3 style={{ margin: '0 0 2px 0', fontSize: '15px', textAlign: 'center', fontWeight: '900' }}>LOGIN SPORTS ACADEMY</h3>
            <p style={{ margin: '0 0 4px 0', textAlign: 'center', fontSize: '11px' }}>loginsportsacademy.in</p>

            <p style={{ margin: '2px 0', textAlign: 'center', fontSize: '12px' }}>----------------------------</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '2px' }}>
              <span>{printData.date}</span>
              <span>{formatHHmmTo12Hour(printData.time)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '70%' }}>
                <b>{printData.name}</b>
              </span>
              <span><b>{printData.paymentType.toUpperCase()}</b></span>
            </div>

            <p style={{ margin: '2px 0', textAlign: 'center', fontSize: '12px' }}>----------------------------</p>

            {printData.stockItems && printData.stockItems.length > 0 ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', margin: '2px 0' }}>
                  <span>{printData.type === '1 Hour Order' ? `Entry(1Hr) x${printData.headsCount || 1}` : (printData.type === 'Public Order' || printData.type === 'Order' ? 'Entry(1Hr)' : printData.type)}</span>
                  <span>₹ {printData.sessionAmount !== undefined ? printData.sessionAmount : (printData.amount - (printData.stockTotal || 0))}</span>
                </div>
                {printData.stockItems.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', margin: '2px 0' }}>
                    <span>{item.name} (x{item.quantity})</span>
                    <span>₹ {item.total}</span>
                  </div>
                ))}
                <p style={{ margin: '2px 0', textAlign: 'center', fontSize: '12px' }}>----------------------------</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold', margin: '4px 0' }}>
                  <span>GRAND TOTAL</span>
                  <span>₹ {printData.amount}</span>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold', margin: '4px 0' }}>
                <span>{printData.type === '1 Hour Order' ? `Entry(1Hr) x${printData.headsCount || 1}` : (printData.type === 'Public Order' || printData.type === 'Order' ? 'Entry(1Hr)' : printData.type)}</span>
                <span>₹ {printData.amount}</span>
              </div>
            )}

            <p style={{ margin: '2px 0', textAlign: 'center', fontSize: '12px' }}>----------------------------</p>
            <p style={{ margin: '4px 0 0 0', textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>Thank You!</p>
          </div>
        )}
      </div>


      </AdminLayout>
    </>
  );
};

export default DailyTracker;
