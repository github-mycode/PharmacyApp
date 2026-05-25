import React, { useState } from 'react';
import type {
  ChangeEventHandler,
  FormEventHandler,
  MouseEventHandler,
} from 'react';

import type { Medicine } from '../types/medicine';
import { formatCurrency } from '../utils/helpers';


interface SaleModelProps {
  medicine: Medicine;
  onSave: (quantity: number) => void;
  onCancel: () => void;
}

const SaleModel: React.FC<SaleModelProps> = ({
  medicine,
  onSave,
  onCancel,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string>('');

  const handleQuantityChange: ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const value = parseInt(e.target.value) || 0;

    setQuantity(value);

    if (value > medicine.quantity) {
      setError(
        `Only ${medicine.quantity} units available in stock`
      );
    } else if (value <= 0) {
      setError('Quantity must be at least 1');
    } else {
      setError('');
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (quantity <= 0) {
      setError('Quantity must be at least 1');
      return;
    }

    if (quantity > medicine.quantity) {
      setError(`Only ${medicine.quantity} units available`);
      return;
    }

    onSave(quantity);
  };

  const stopPropagation: MouseEventHandler<HTMLDivElement> = (
    e
  ) => {
    e.stopPropagation();
  };

  const totalAmount = medicine.price * quantity;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={stopPropagation}>
        <h2>Record Sale</h2>

        <div
          style={{
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
          }}
        >
          <p style={{ marginBottom: '8px' }}>
            <strong>Medicine:</strong> {medicine.fullName}
          </p>

          <p style={{ marginBottom: '8px' }}>
            <strong>Brand:</strong> {medicine.brand}
          </p>

          <p style={{ marginBottom: '8px' }}>
            <strong>Available Stock:</strong>{' '}
            {medicine.quantity} units
          </p>

          <p style={{ marginBottom: '0' }}>
            <strong>Unit Price:</strong>{' '}
            {formatCurrency(medicine.price)}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="quantity">
              Quantity to Sell{' '}
              <span style={{ color: 'red' }}>*</span>
            </label>

            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              max={medicine.quantity}
              autoFocus
            />

            {error && (
              <div className="error-message">{error}</div>
            )}
          </div>

          <div
            style={{
              padding: '15px',
              backgroundColor: '#f0f9ff',
              borderRadius: '8px',
              marginBottom: '20px',
            }}
          >
            <p style={{ fontSize: '1.1rem', margin: '0' }}>
              <strong>Total Amount:</strong>{' '}
              {formatCurrency(totalAmount)}
            </p>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-success"
              disabled={!!error || quantity <= 0}
            >
              Record Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaleModel;