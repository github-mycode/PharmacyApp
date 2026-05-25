import React, { useState, useEffect } from 'react';

import MedicineGrid from './components/MedicineGrid';
import MedicineForm from './components/MedicineForm';
import SaleModel from './components/SaleModel';
import SearchBar from './components/SearchBar';

import {
  medicineService
} from './services/medicineService';

import type { Medicine } from './types/medicine';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

function App() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  
  const [filteredMedicines, setFilteredMedicines] =
    useState<Medicine[]>([]);

  const [searchQuery, setSearchQuery] =
    useState<string>('');

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string>('');

  const [showForm, setShowForm] =
    useState<boolean>(false);

  const [editingMedicine, setEditingMedicine] =
    useState<Medicine | null>(null);

  const [showSaleModel, setShowSaleModel] =
    useState<boolean>(false);

  const [selectedMedicine, setSelectedMedicine] =
    useState<Medicine | null>(null);

  useEffect(() => {
    loadMedicines();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMedicines(medicines);
    } else {
      const filtered = medicines.filter((medicine) =>
        medicine.fullName
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );

      setFilteredMedicines(filtered);
    }
  }, [searchQuery, medicines]);

  const loadMedicines = async (): Promise<void> => {
    try {
      setLoading(true);

      setError(null);

      const data = await medicineService.getAll();

      setMedicines(data);

      setFilteredMedicines(data);
    } catch (err) {
      setError(
        'Failed to load medicines. Please ensure the API is running.'
      );

      console.error('Error loading medicines:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = (): void => {
    setEditingMedicine(null);

    setShowForm(true);
  };

  const handleEdit = (
    medicine: Medicine
  ): void => {
    setEditingMedicine(medicine);

    setShowForm(true);
  };

  const handleSave = async (
    medicineData: Medicine
  ): Promise<void> => {
    try {
      setError(null);

      if (editingMedicine) {
        await medicineService.update(
          editingMedicine.id!,
          medicineData
        );

        setSuccessMessage(
          'Medicine updated successfully!'
        );
      } else {
        await medicineService.create(medicineData);

        setSuccessMessage(
          'Medicine added successfully!'
        );
      }

      setShowForm(false);

      setEditingMedicine(null);

      await loadMedicines();

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      const apiError = err as ApiError;

      setError(
        apiError.response?.data?.message ||
          'Failed to save medicine'
      );

      console.error(
        'Error saving medicine:',
        err
      );
    }
  };

  const handleDelete = async (
    id: number | string
  ): Promise<void> => {
    if (
      !window.confirm(
        'Are you sure you want to delete this medicine?'
      )
    ) {
      return;
    }

    try {
      setError(null);

      await medicineService.delete(id);

      setSuccessMessage(
        'Medicine deleted successfully!'
      );

      await loadMedicines();

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      const apiError = err as ApiError;

      setError(
        apiError.response?.data?.message ||
          'Failed to delete medicine'
      );

      console.error(
        'Error deleting medicine:',
        err
      );
    }
  };

  const handleSaleClick = (
    medicine: Medicine
  ): void => {
    setSelectedMedicine(medicine);

    setShowSaleModel(true);
  };

  const handleRecordSale = async (
    quantity: number
  ): Promise<void> => {
    if (!selectedMedicine) {
      return;
    }

    try {
      setError(null);

      await medicineService.recordSale(
        selectedMedicine.id!,
        quantity
      );

      setSuccessMessage(
        `Sale recorded successfully! Sold ${quantity} units of ${selectedMedicine.fullName}`
      );

      setShowSaleModel(false);

      setSelectedMedicine(null);

      await loadMedicines();

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      const apiError = err as ApiError;

      setError(
        apiError.response?.data?.message ||
          'Failed to record sale'
      );

      console.error(
        'Error recording sale:',
        err
      );
    }
  };

  const handleCancel = (): void => {
    setShowForm(false);

    setEditingMedicine(null);
  };

  const handleCancelSale = (): void => {
    setShowSaleModel(false);

    setSelectedMedicine(null);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>
          ABC Pharmacy - Medicine Inventory
        </h1>

        <p>
          Manage your pharmacy stock and sales
          efficiently
        </p>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {successMessage && (
        <div className="success-message">
          <strong>Success:</strong>{' '}
          {successMessage}
        </div>
      )}

      <div className="controls">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by medicine name..."
        />

        <button
          className="btn btn-primary"
          onClick={handleAddNew}
        >
          + Add New Medicine
        </button>
      </div>

      {loading ? (
        <div className="loading">
          <p>Loading medicines...</p>
        </div>
      ) : (
        <MedicineGrid
          medicines={filteredMedicines}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSale={handleSaleClick}
        />
      )}

      {showForm && (
        <div
          className="modal-overlay"
          onClick={handleCancel}
        >
          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <h2>
              {editingMedicine
                ? 'Edit Medicine'
                : 'Add New Medicine'}
            </h2>

            <MedicineForm
              medicine={editingMedicine || undefined}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}

      {showSaleModel &&
        selectedMedicine && (
          <SaleModel
            medicine={selectedMedicine}
            onSave={handleRecordSale}
            onCancel={handleCancelSale}
          />
        )}
    </div>
  );
}

export default App;