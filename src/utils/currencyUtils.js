// Format amount with Naira symbol
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Get budget status feedback with detailed context
export const getBudgetFeedback = (spent, budget, spentPercentage, timeElapsedPercentage, daysElapsed, daysInMonth) => {
  const difference = spentPercentage - timeElapsedPercentage;
  const projectedSpending = daysInMonth > 0 ? (spent / daysElapsed) * daysInMonth : 0;
  const overBudgetAmount = spent - budget;

  // Over budget (100%+)
  if (spentPercentage >= 100) {
    return {
      color: 'red',
      message: `Over budget by ${formatCurrency(overBudgetAmount)}`,
      emoji: '🔴',
      detail: `Budget exceeded on day ${daysElapsed} of ${daysInMonth}`
    };
  }

  // Danger zone: spending WAY too fast (>25% faster than time)
  else if (difference > 25) {
    const projectedOver = projectedSpending - budget;
    return {
      color: 'red',
      message: 'Slow down!',
      emoji: '🔴',
      detail: `Day ${daysElapsed}/${daysInMonth}. At this rate: ${formatCurrency(projectedSpending)}/month (${formatCurrency(projectedOver)} over)`
    };
  }

  // Warning zone: spending too fast (10-25% faster than time)
  else if (difference > 10) {
    const projectedOver = projectedSpending - budget;
    return {
      color: 'yellow',
      message: 'Watch out!',
      emoji: '🟡',
      detail: `Day ${daysElapsed}/${daysInMonth}. Projected: ${formatCurrency(projectedSpending)}/month (${formatCurrency(projectedOver)} over)`
    };
  }

  // Caution: slightly faster (5-10% faster)
  else if (difference > 5) {
    return {
      color: 'yellow',
      message: 'Pace up slightly',
      emoji: '🟡',
      detail: `Day ${daysElapsed}/${daysInMonth}. Keep an eye on spending`
    };
  }

  // On track or under
  else {
    const remaining = budget - spent;
    return {
      color: 'green',
      message: 'Great pace!',
      emoji: '🟢',
      detail: `Day ${daysElapsed}/${daysInMonth}. ${formatCurrency(remaining)} remaining`
    };
  }
};