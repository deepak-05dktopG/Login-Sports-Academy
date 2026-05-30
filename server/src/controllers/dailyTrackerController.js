import DailyTracker from '../models/DailyTracker.js';
import GrocerCashBox from '../models/GrocerCashBox.js';
import MembershipPlan from '../models/MembershipPlan.js';
import { incrementCashBox } from './grocerCashBoxController.js';

// Helper to ensure all active plans are physically initialized in the CashBox document
const ensureCashBoxStats = async (cashBox) => {
  if (!cashBox) return;
  const plans = await MembershipPlan.find({ isActive: true });
  let updated = false;
  
  if (!cashBox.orderStats) { cashBox.orderStats = { count: 0, amount: 0 }; updated = true; }
  if (!cashBox.oneHourOrderStats) { cashBox.oneHourOrderStats = { count: 0, amount: 0 }; updated = true; }
  if (!cashBox.membershipStats) { cashBox.membershipStats = []; updated = true; }

  for (const plan of plans) {
    const exists = cashBox.membershipStats.find(p => p.planName === plan.planName);
    if (!exists) {
      cashBox.membershipStats.push({ planName: plan.planName, count: 0, amount: 0 });
      updated = true;
    }
  }

  if (updated) {
    await cashBox.save();
  }
};

const adjustStockInventory = async (stockItems, entryType, isRefunding = false) => {
  if (!stockItems || !Array.isArray(stockItems) || stockItems.length === 0) return;
  const stockType = entryType === '1 Hour Order' ? 'rental' : 'buying';
  for (const item of stockItems) {
    const multiplier = isRefunding ? 1 : -1;
    const delta = item.quantity * multiplier;
    await MembershipPlan.findOneAndUpdate(
      { planName: { $regex: new RegExp(`^${item.name}$`, 'i') }, type: 'stock', stockType },
      { $inc: { stockCount: delta } }
    );
  }
};


// Get all tracker entries for a specific date (YYYY-MM-DD)
export const getDailyTrackerByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ success: false, message: 'Date is required' });
    const entries = await DailyTracker.find({ date }).sort({ time: 1, createdAt: 1 });
    let cashBox = await GrocerCashBox.findOne({});
    if (cashBox) await ensureCashBoxStats(cashBox);
    res.json({ success: true, data: entries, cashBox: cashBox || { hardCash: 0, gpayCash: 0 } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Get ALL tracker entries (no date filter), with optional type/paymentType/date range filters
export const getAllTrackerEntries = async (req, res) => {
  try {
    const { type, paymentType, fromDate, toDate, limit: limitParam } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (paymentType) filter.paymentType = (paymentType || '').toLowerCase();
    if (fromDate || toDate) {
      filter.date = {};
      if (fromDate) filter.date.$gte = fromDate;
      if (toDate) filter.date.$lte = toDate;
    }
    const limitNum = Math.min(Number.isFinite(Number(limitParam)) ? Number(limitParam) : 500, 10000);
    const entries = await DailyTracker.find(filter).sort({ date: -1, time: -1 }).limit(limitNum);
    let cashBox = await GrocerCashBox.findOne({});
    if (cashBox) await ensureCashBoxStats(cashBox);
    res.json({ success: true, data: entries, cashBox: cashBox || { hardCash: 0, gpayCash: 0 } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Add a new tracker entry
export const addDailyTrackerEntry = async (req, res) => {
  try {
    const isOneHour = req.body.type === '1 Hour Order';
    if (isOneHour) {
      req.body.headsCount = Number(req.body.headsCount) || 1;
      req.body.sessionAmount = req.body.headsCount * 100;
    }

    // Process stock items if present
    if (req.body.stockItems && Array.isArray(req.body.stockItems)) {
      let totalStock = 0;
      req.body.stockItems.forEach(item => {
        item.total = (Number(item.price) || 0) * (Number(item.quantity) || 0);
        totalStock += item.total;
      });
      req.body.stockTotal = totalStock;

      if (!isOneHour && req.body.sessionAmount === undefined) {
        req.body.sessionAmount = (Number(req.body.amount) || 0) - totalStock;
      }
      
      req.body.amount = (Number(req.body.sessionAmount) || 0) + totalStock;
    } else {
      req.body.stockTotal = 0;
      req.body.stockItems = [];
      if (!isOneHour) {
        req.body.sessionAmount = Number(req.body.amount) || 0;
      } else {
        req.body.amount = req.body.sessionAmount;
      }
    }

    const entry = new DailyTracker(req.body);

    if (entry.amount && entry.paymentType && (entry.type === 'Expense' || entry.type === 'Withdrawal')) {
      const cashBox = await GrocerCashBox.findOne({});
      const available = cashBox ? (entry.paymentType === 'cash' ? cashBox.hardCash : cashBox.gpayCash) : 0;
      if (entry.amount > available) {
        return res.status(400).json({ success: false, message: `Insufficient ${entry.paymentType === 'cash' ? 'Cash' : 'GPay'} balance in Grocer Box` });
      }
    }

    await entry.save();

    // Adjust stock inventory (deduct quantities)
    if (entry.stockItems && entry.stockItems.length > 0) {
      try {
        await adjustStockInventory(entry.stockItems, entry.type, false);
      } catch (err) {
        console.error('Failed to deduct stock inventory:', err);
      }
    }

    if (entry.amount && entry.paymentType) {
      if (entry.type !== 'Expense' && entry.type !== 'Withdrawal') {
        try {
          // Booking portion
          await incrementCashBox({
            amount: entry.amount, // Adds full amount to combined cash box hardCash/gpayCash
            paymentType: entry.paymentType,
            entryType: entry.type,
            entryCountDelta: entry.headsCount || 1,
            entryTotalDelta: entry.sessionAmount || 0,
            serviceType: entry.serviceType || 'swimming'
          });
          // Stock portion (separate under Stock details)
          if ((entry.stockTotal || 0) > 0) {
            await incrementCashBox({
              amount: 0, // 0 so it doesn't double add to hardCash/gpayCash
              paymentType: entry.paymentType,
              entryType: 'Stock',
              entryCountDelta: 1,
              entryTotalDelta: entry.stockTotal,
              serviceType: entry.serviceType || 'swimming'
            });
          }
        } catch (err) {
          console.error('Error incrementing GrocerCashBox for DailyTracker:', err);
        }
      } else if (entry.type === 'Expense' || entry.type === 'Withdrawal') {
        try {
          await incrementCashBox({
            amount: -entry.amount,
            paymentType: entry.paymentType,
            expenseDelta: entry.type === 'Expense' ? entry.amount : 0,
            withdrawalDelta: entry.type === 'Withdrawal' ? entry.amount : 0,
            entryType: entry.type,
            entryCountDelta: 1,
            entryTotalDelta: entry.amount,
            serviceType: entry.serviceType || 'swimming'
          });
        } catch (err) {
          console.error(`Error decrementing GrocerCashBox for DailyTracker ${entry.type}:`, err);
        }
      }
    }

    res.json({ success: true, data: entry });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

// Update a tracker entry (with cash box adjustment)
export const updateDailyTrackerEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const oldEntry = await DailyTracker.findById(id);
    if (!oldEntry) return res.status(404).json({ success: false, message: 'Entry not found' });

    const currentType = updates.type !== undefined ? updates.type : oldEntry.type;
    const isOneHour = currentType === '1 Hour Order';
    if (isOneHour) {
      const headsCount = updates.headsCount !== undefined ? Number(updates.headsCount) : (oldEntry.headsCount || 1);
      updates.headsCount = headsCount;
      updates.sessionAmount = headsCount * 100;
    }

    // Process stock items inside updates if present or recalculate if amount changes
    if (updates.stockItems && Array.isArray(updates.stockItems)) {
      let totalStock = 0;
      updates.stockItems.forEach(item => {
        item.total = (Number(item.price) || 0) * (Number(item.quantity) || 0);
        totalStock += item.total;
      });
      updates.stockTotal = totalStock;

      if (!isOneHour && updates.sessionAmount === undefined) {
        updates.sessionAmount = oldEntry.sessionAmount !== undefined ? oldEntry.sessionAmount : ((Number(oldEntry.amount) || 0) - (oldEntry.stockTotal || 0));
      }
      
      updates.amount = (Number(updates.sessionAmount) || 0) + totalStock;
    } else if (isOneHour) {
      const currentStockTotal = updates.stockTotal !== undefined ? updates.stockTotal : (oldEntry.stockTotal || 0);
      updates.amount = updates.sessionAmount + currentStockTotal;
    } else if (updates.amount !== undefined || updates.sessionAmount !== undefined) {
      const currentStockTotal = updates.stockTotal !== undefined ? updates.stockTotal : (oldEntry.stockTotal || 0);
      if (updates.sessionAmount !== undefined) {
        updates.amount = Number(updates.sessionAmount) + currentStockTotal;
      } else if (updates.amount !== undefined) {
        updates.sessionAmount = Number(updates.amount) - currentStockTotal;
      }
    }

    // Step 1: Revert old entry's effect on cash box
    if (oldEntry.amount && oldEntry.paymentType) {
      if (oldEntry.type !== 'Expense' && oldEntry.type !== 'Withdrawal') {
        try {
          // Revert booking portion
          await incrementCashBox({
            amount: -oldEntry.amount, // Subtracts full amount from cashBox cash/gpay
            paymentType: oldEntry.paymentType,
            entryType: oldEntry.type,
            entryCountDelta: -(oldEntry.headsCount || 1),
            entryTotalDelta: -(oldEntry.sessionAmount !== undefined ? oldEntry.sessionAmount : (Number(oldEntry.amount) || 0) - (oldEntry.stockTotal || 0)),
            serviceType: oldEntry.serviceType || 'swimming'
          });
          // Revert stock portion
          if ((oldEntry.stockTotal || 0) > 0) {
            await incrementCashBox({
              amount: 0,
              paymentType: oldEntry.paymentType,
              entryType: 'Stock',
              entryCountDelta: -1,
              entryTotalDelta: -oldEntry.stockTotal,
              serviceType: oldEntry.serviceType || 'swimming'
            });
          }
        } catch (err) {
          console.error('Error reverting old entry cash box:', err);
        }
      } else {
        let revertAmount = oldEntry.amount;
        let revertExpense = oldEntry.type === 'Expense' ? -oldEntry.amount : 0;
        let revertWithdrawal = oldEntry.type === 'Withdrawal' ? -oldEntry.amount : 0;
        await incrementCashBox({
          amount: revertAmount,
          paymentType: oldEntry.paymentType,
          expenseDelta: revertExpense,
          withdrawalDelta: revertWithdrawal,
          entryType: oldEntry.type,
          entryCountDelta: -1,
          entryTotalDelta: -oldEntry.amount,
          serviceType: oldEntry.serviceType || 'swimming'
        });
      }
    }

    // Step 2: Update the entry
    const updatedEntry = await DailyTracker.findByIdAndUpdate(id, updates, { new: true });

    // Adjust stock inventory
    try {
      // Revert old stocks (add back quantities)
      if (oldEntry.stockItems && oldEntry.stockItems.length > 0) {
        await adjustStockInventory(oldEntry.stockItems, oldEntry.type, true);
      }
      // Apply new stocks (deduct quantities)
      if (updatedEntry.stockItems && updatedEntry.stockItems.length > 0) {
        await adjustStockInventory(updatedEntry.stockItems, updatedEntry.type, false);
      }
    } catch (err) {
      console.error('Failed to adjust stock inventory on update:', err);
    }

    // Step 3: Apply new entry's effect on cash box
    if (updatedEntry.amount && updatedEntry.paymentType) {
      if (updatedEntry.type !== 'Expense' && updatedEntry.type !== 'Withdrawal') {
        try {
          // Apply booking portion
          await incrementCashBox({
            amount: updatedEntry.amount, // Adds full amount to cashBox cash/gpay
            paymentType: updatedEntry.paymentType,
            entryType: updatedEntry.type,
            entryCountDelta: updatedEntry.headsCount || 1,
            entryTotalDelta: updatedEntry.sessionAmount || 0,
            serviceType: updatedEntry.serviceType || 'swimming'
          });
          // Apply stock portion
          if ((updatedEntry.stockTotal || 0) > 0) {
            await incrementCashBox({
              amount: 0,
              paymentType: updatedEntry.paymentType,
              entryType: 'Stock',
              entryCountDelta: 1,
              entryTotalDelta: updatedEntry.stockTotal,
              serviceType: updatedEntry.serviceType || 'swimming'
            });
          }
        } catch (err) {
          console.error('Error applying updated entry cash box:', err);
        }
      } else {
        let applyAmount = -updatedEntry.amount;
        let applyExpense = updatedEntry.type === 'Expense' ? updatedEntry.amount : 0;
        let applyWithdrawal = updatedEntry.type === 'Withdrawal' ? updatedEntry.amount : 0;
        await incrementCashBox({
          amount: applyAmount,
          paymentType: updatedEntry.paymentType,
          expenseDelta: applyExpense,
          withdrawalDelta: applyWithdrawal,
          entryType: updatedEntry.type,
          entryCountDelta: 1,
          entryTotalDelta: updatedEntry.amount,
          serviceType: updatedEntry.serviceType || 'swimming'
        });
      }
    }

    res.json({ success: true, data: updatedEntry });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

// Delete all tracker entries for a specific date
export const deleteDailyTrackerByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ success: false, message: 'Date is required' });
    await DailyTracker.deleteMany({ date });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Delete a single tracker entry by ID (with cash box adjustment)
export const deleteDailyTrackerById = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await DailyTracker.findById(id);
    if (!entry) return res.status(404).json({ success: false, message: 'Entry not found' });

    // Step 1: Revert its effect on cash box
    if (entry.amount && entry.paymentType) {
      if (entry.type !== 'Expense' && entry.type !== 'Withdrawal') {
        try {
          // Revert booking portion
          await incrementCashBox({
            amount: -entry.amount,
            paymentType: entry.paymentType,
            entryType: entry.type,
            entryCountDelta: -(entry.headsCount || 1),
            entryTotalDelta: -(entry.sessionAmount !== undefined ? entry.sessionAmount : (Number(entry.amount) || 0) - (entry.stockTotal || 0)),
            serviceType: entry.serviceType || 'swimming'
          });
          // Revert stock portion
          if ((entry.stockTotal || 0) > 0) {
            await incrementCashBox({
              amount: 0,
              paymentType: entry.paymentType,
              entryType: 'Stock',
              entryCountDelta: -1,
              entryTotalDelta: -entry.stockTotal,
              serviceType: entry.serviceType || 'swimming'
            });
          }
        } catch (err) {
          console.error('Error reverting deleted entry cash box:', err);
        }
      } else {
        let revertAmount = entry.amount;
        let revertExpense = entry.type === 'Expense' ? -entry.amount : 0;
        let revertWithdrawal = entry.type === 'Withdrawal' ? -entry.amount : 0;
        await incrementCashBox({
          amount: revertAmount,
          paymentType: entry.paymentType,
          expenseDelta: revertExpense,
          withdrawalDelta: revertWithdrawal,
          entryType: entry.type,
          entryCountDelta: -1,
          entryTotalDelta: -entry.amount,
          serviceType: entry.serviceType || 'swimming'
        });
      }
    }

    // Step 2: Delete
    await DailyTracker.findByIdAndDelete(id);

    // Revert stock inventory (add back quantities)
    if (entry.stockItems && entry.stockItems.length > 0) {
      try {
        await adjustStockInventory(entry.stockItems, entry.type, true);
      } catch (err) {
        console.error('Failed to refund stock inventory on delete:', err);
      }
    }

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Delete all tracker entries (full purge)
export const deleteAllTrackerEntries = async (req, res) => {
  try {
    const result = await DailyTracker.deleteMany({});
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
