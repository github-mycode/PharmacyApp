import React from 'react';
import type { Medicine } from '../types/medicine';
import {
  formatDate,
  formatCurrency,
  getRowClass,
  getStatusBadge,
} from '../utils/helpers';


interface MedicineGridProps {
  medicines: Medicine[];
  onEdit: (medicine: Medicine) => void;
  onDelete: (id: number | string) => void;
  onSale: (medicine: Medicine) => void;
}

const MedicineGrid: React.FC<MedicineGridProps> = ({
  medicines,
  onEdit,
  onDelete,
  onSale,
}) => {
  if (medicines.length === 0) {
    return (
      <div className="empty-state">
        <h3>No medicines found</h3>
        <p>Start by adding your first medicine to the inventory.</p>
      </div>
    );
  }

  return (
    <div className="medicine-grid">
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Brand</th>
              <th>Expiry Date</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {medicines.map((medicine) => {
              const status = getStatusBadge(medicine);

              return (
                <tr
                  key={medicine.id}
                  className={getRowClass(medicine)}
                >
                  <td>
                    <strong>{medicine.fullName}</strong>
                  </td>

                  <td>{medicine.brand}</td>

                  <td>{formatDate(medicine.expiryDate)}</td>

                  <td>
                    <strong>{medicine.quantity}</strong> units
                  </td>

                  <td>{formatCurrency(medicine.price)}</td>

                  <td>
                    <span className={`badge ${status.class}`}>
                      {status.text}
                    </span>
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-success btn-small"
                        onClick={() => onSale(medicine)}
                        disabled={medicine.quantity === 0}
                      >
                        Sell
                      </button>

                      <button
                        className="btn btn-secondary btn-small"
                        onClick={() => onEdit(medicine)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-small"
                        onClick={() => onDelete(medicine.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicineGrid;