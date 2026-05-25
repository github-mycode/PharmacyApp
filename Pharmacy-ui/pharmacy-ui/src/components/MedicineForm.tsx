import React, { useState, useEffect  } from 'react';
import type {  ChangeEvent } from 'react';
import type { Medicine } from '../types/medicine';


interface Errors {
  fullName?: string;
  notes?: string;
  expiryDate?: string;
  quantity?: string;
  price?: string;
  brand?: string;
}

interface MedicineFormProps {
  medicine?: Partial<Medicine>;
  onSave: (data: Medicine) => void;
  onCancel: () => void;
}

const MedicineForm: React.FC<MedicineFormProps> = ({
  medicine,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Medicine>({
    fullName: '',
    notes: '',
    expiryDate: '',
    quantity: 0,
    price: 0,
    brand: '',
  });

  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (medicine) {
      setFormData({
        fullName: medicine.fullName || '',
        notes: medicine.notes || '',
        expiryDate: medicine.expiryDate
          ? medicine.expiryDate.split('T')[0]
          : '',
        quantity: medicine.quantity || 0,
        price: medicine.price || 0,
        brand: medicine.brand || '',
      });
    }
  }, [medicine]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));

    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Medicine name is required';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    }

    if (formData.quantity < 0) {
      newErrors.quantity = 'Quantity cannot be negative';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="fullName">
          Medicine Name <span style={{ color: 'red' }}>*</span>
        </label>

        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Enter medicine name"
        />

        {errors.fullName && (
          <div className="error-message">{errors.fullName}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="brand">
          Brand <span style={{ color: 'red' }}>*</span>
        </label>

        <input
          type="text"
          id="brand"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          placeholder="Enter brand name"
        />

        {errors.brand && (
          <div className="error-message">{errors.brand}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="expiryDate">
          Expiry Date <span style={{ color: 'red' }}>*</span>
        </label>

        <input
          type="date"
          id="expiryDate"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
        />

        {errors.expiryDate && (
          <div className="error-message">{errors.expiryDate}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="quantity">
          Quantity <span style={{ color: 'red' }}>*</span>
        </label>

        <input
          type="number"
          id="quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          min="0"
          placeholder="Enter quantity"
        />

        {errors.quantity && (
          <div className="error-message">{errors.quantity}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="price">
          Price <span style={{ color: 'red' }}>*</span>
        </label>

        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          step="0.01"
          min="0.01"
          placeholder="Enter price"
        />

        {errors.price && (
          <div className="error-message">{errors.price}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes</label>

        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Enter additional notes (optional)"
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button type="submit" className="btn btn-primary">
          {medicine ? 'Update Medicine' : 'Add Medicine'}
        </button>
      </div>
    </form>
  );
};

export default MedicineForm;