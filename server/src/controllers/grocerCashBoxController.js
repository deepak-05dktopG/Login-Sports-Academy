import GrocerCashBox from '../models/GrocerCashBox.js';

export async function incrementCashBox({ amount, paymentType, expenseDelta = 0, withdrawalDelta = 0, entryType = null, entryCountDelta = 0, entryTotalDelta = 0, serviceType = 'swimming' }) {
  if (!['cash', 'gpay'].includes(paymentType)) return;
  let cashBox = await GrocerCashBox.findOne({});
  if (!cashBox) {
    cashBox = new GrocerCashBox();
    cashBox.orderStats = { count: 0, amount: 0 };
    cashBox.oneHourOrderStats = { count: 0, amount: 0 };
    cashBox.membershipStats = [];
  }

  cashBox.updatedAt = new Date();

  // ── Update COMBINED totals (backward compat) ──
  if (paymentType === 'cash') cashBox.hardCash = (cashBox.hardCash || 0) + amount;
  if (paymentType === 'gpay') cashBox.gpayCash = (cashBox.gpayCash || 0) + amount;
  if (expenseDelta !== 0) cashBox.lifetimeExpense = (cashBox.lifetimeExpense || 0) + expenseDelta;
  if (withdrawalDelta !== 0) cashBox.lifetimeWithdrawal = (cashBox.lifetimeWithdrawal || 0) + withdrawalDelta;

  // ── Update SPORT-SPECIFIC totals ──
  const svc = serviceType || 'swimming';
  const prefix = svc === 'badminton' ? 'badminton' : 'swimming';

  if (paymentType === 'cash') cashBox[`${prefix}HardCash`] = (cashBox[`${prefix}HardCash`] || 0) + amount;
  if (paymentType === 'gpay') cashBox[`${prefix}GpayCash`] = (cashBox[`${prefix}GpayCash`] || 0) + amount;
  if (expenseDelta !== 0) cashBox[`${prefix}LifetimeExpense`] = (cashBox[`${prefix}LifetimeExpense`] || 0) + expenseDelta;
  if (withdrawalDelta !== 0) cashBox[`${prefix}LifetimeWithdrawal`] = (cashBox[`${prefix}LifetimeWithdrawal`] || 0) + withdrawalDelta;

  // ── Update entry stats (same as before) ──
  if (entryType && (entryCountDelta !== 0 || entryTotalDelta !== 0)) {
    if (entryType === 'Stock' || entryType === 'Order') {
      cashBox.orderStats.count = Math.max(0, cashBox.orderStats.count + entryCountDelta);
      cashBox.orderStats.amount = Math.max(0, cashBox.orderStats.amount + entryTotalDelta);
    } else if (entryType === '1 Hour' || entryType === '1 Hour Stock' || entryType === 'Public Stock' || entryType === '1 Hour Order' || entryType === 'Public Order') {
      cashBox.oneHourOrderStats.count = Math.max(0, cashBox.oneHourOrderStats.count + entryCountDelta);
      cashBox.oneHourOrderStats.amount = Math.max(0, cashBox.oneHourOrderStats.amount + entryTotalDelta);
    } else if (entryType !== 'Expense' && entryType !== 'Withdrawal') {
      let stat = cashBox.membershipStats.find(p => p.planName === entryType);
      if (!stat) {
         cashBox.membershipStats.push({ planName: entryType, count: Math.max(0, entryCountDelta), amount: Math.max(0, entryTotalDelta) });
      } else {
         stat.count = Math.max(0, stat.count + entryCountDelta);
         stat.amount = Math.max(0, stat.amount + entryTotalDelta);
      }
    }
  }

  await cashBox.save();
}