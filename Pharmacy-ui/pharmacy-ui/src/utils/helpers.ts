interface Medicine {
    expiryDate: string;
    quantity: number;
  }
  
  interface StatusBadge {
    text: string;
    class: string;
  }
  
  export const formatDate = (
    dateString: string
  ): string => {
    const date = new Date(dateString);
  
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  export const formatCurrency = (
    amount: number
  ): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };
  
  export const getDaysUntilExpiry = (
    expiryDate: string
  ): number => {
    const today = new Date();
  
    const expiry = new Date(expiryDate);
  
    const diffTime =
      expiry.getTime() - today.getTime();
  
    const diffDays = Math.ceil(
      diffTime / (1000 * 60 * 60 * 24)
    );
  
    return diffDays;
  };
  
  export const getRowClass = (
    medicine: Medicine
  ): string => {
    const daysToExpiry = getDaysUntilExpiry(
      medicine.expiryDate
    );
  
    if (daysToExpiry < 30 && daysToExpiry >= 0) {
      return 'row-expiring';
    }
  
    if (medicine.quantity < 10) {
      return 'row-low-stock';
    }
  
    return '';
  };
  
  export const getStatusBadge = (
    medicine: Medicine
  ): StatusBadge => {
    const daysToExpiry = getDaysUntilExpiry(
      medicine.expiryDate
    );
  
    if (daysToExpiry < 0) {
      return {
        text: 'Expired',
        class: 'badge-danger',
      };
    }
  
    if (daysToExpiry < 30) {
      return {
        text: `Expires in ${daysToExpiry} days`,
        class: 'badge-danger',
      };
    }
  
    if (medicine.quantity < 10) {
      return {
        text: 'Low Stock',
        class: 'badge-warning',
      };
    }
  
    return {
      text: 'In Stock',
      class: 'badge-success',
    };
  };