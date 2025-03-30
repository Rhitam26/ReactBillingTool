import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

// Styled Components
const ExcelContainer = styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f0f0f0;
  font-family: 'Arial', sans-serif;
  font-size: 11px;
  color: #000000;
  position: relative;
`;

const StyledButton = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  font-weight: bold;
  margin: 8px 0;
`;

const TableContainer = styled.div`
  height: calc(100vh - 2px);
  overflow: auto;
  background-color: white;
  border: 1px solid #808080;
  box-shadow: inset 0 0 0 1px #ffffff;

  &::-webkit-scrollbar {
    width: 16px;
    height: 16px;
  }

  &::-webkit-scrollbar-track {
    background: #f0f0f0;
    border: 1px solid #808080;
  }

  &::-webkit-scrollbar-thumb {
    background: #d4d0c8;
    border: 1px solid #808080;
    &:hover {
      background: #b5b1a8;
    }
  }
`;

const ExcelTable = styled.table`
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
`;

const TableHeader = styled.th`
  background: linear-gradient(to bottom, #f7f7f7 0%, #e3e3e3 100%);
  border: 1px solid #808080;
  border-right: 1px solid #808080;
  border-bottom: 1px solid #808080;
  padding: 4px;
  text-align: left;
  font-weight: normal;
  height: 50px;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: inset 1px 1px 0 #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 11px;
`;

const TableCell = styled.td`
  border: 1px solid #d4d0c8;
  padding: 0;
  height: 20px;
  background: white;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
  box-shadow: inset 1px 1px 0 #ffffff;
  font-size: 11px;
`;

const CellInput = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  padding: 0 4px;
  font-family: 'Arial', sans-serif;
  font-size: 11px;
  line-height: 20px;
  background-color: ${props => props.disabled ? '#f0f0f0' : 'white'};

  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px #b8d6f9;
  }

  &:disabled {
    color: #666666;
    cursor: default;
  }
`;

const CellSelect = styled.select`
  width: 100%;
  height: 100%;
  border: none;
  padding: 0 2px;
  font-family: 'Arial', sans-serif;
  font-size: 11px;
  line-height: 20px;
  background-color: ${props => props.disabled ? '#f0f0f0' : 'white'};
  appearance: none;
  cursor: pointer;

  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px #b8d6f9;
  }

  &:disabled {
    color: #666666;
    cursor: default;
  }

  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath d='M0 2l4 4 4-4z' fill='%23666666'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 4px center;
  padding-right: 16px;
`;

const OptionsCell = styled(TableCell)`
  background: #f5f5f5;
  padding: 0 4px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 2px;
  user-select: none;
  font-size: 11px;
`;

const ExcelCheckbox = styled.input`
  width: 13px;
  height: 13px;
  margin: 0;
  cursor: pointer;
  border: 1px solid #808080;
  background: white;

  &:checked {
    background: #d4d0c8;
  }
`;

const storageOptions = ['Store', 'W1', 'W2'];

const ProductManagement = () => {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const rowHeight = 20;
  const headerHeight = 20;
  const estimatedRowCount = Math.floor((windowHeight * 0.8 - headerHeight) / rowHeight);

  const initialColumnConfig = [
    { id: 1, name: 'Barcode Number', required: true, type: 'text', width: 120 },
    { id: 2, name: 'Name', required: true, type: 'text', width: 120 },
    { id: 3, name: 'Category', required: true, type: 'text', width: 100 },
    { id: 4, name: 'Quantity', required: true, type: 'number', width: 80 },
    { id: 5, name: 'Brand', required: true, type: 'text', width: 200 },
    { id: 6, name: 'Storage', required: false, type: 'select', width: 120 },
    { id: 7, name: 'Base Purchase Price', required: false, type: 'number', width: 120 },
    { id: 8, name: 'Default Selling Price', required: false, type: 'number', width: 120 },
    { id: 9, name: 'Silver Price', required: false, type: 'number', width: 100 },
    { id: 10, name: 'Gold Price', required: false, type: 'number', width: 100 },
    { id: 11, name: 'Diamond Price', required: false, type: 'text', width: 100 },
    { id: 12, name: 'Second Barcode Number', required: false, type: 'text', width: 100, group: 'secondary' },
    { id: 13, name: 'Second Quantity', required: false, type: 'number', width: 100, group: 'secondary' },
    { id: 14, name: 'Second Storage', required: false, type: 'select', width: 100, group: 'secondary' },
    { id: 15, name: 'K - Purchase Price', required: false, type: 'number', width: 120, group: 'kaccha' },
    { id: 16, name: 'K - Default Price', required: false, type: 'number', width: 120, group: 'kaccha' },
    { id: 17, name: 'K - Silver Price', required: false, type: 'number', width: 100, group: 'kaccha' },
    { id: 18, name: 'K - Gold Price', required: false, type: 'number', width: 100, group: 'kaccha' },
    { id: 19, name: 'K - Diamond Price', required: false, type: 'text', width: 100, group: 'kaccha' }
  ];

  const [columns] = useState(initialColumnConfig);

  const createInitialRows = () => {
    return Array(estimatedRowCount).fill(null).map((_, index) => ({
      id: index + 1,
      cells: Array(19).fill(''),
      enabledGroups: {
        kaccha: false,
        secondary: false
      }
    }));
  };

  const [rows, setRows] = useState(createInitialRows());

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleRowGroup = (rowIndex, groupName) => {
    setRows(prevRows => {
      const newRows = [...prevRows];
      newRows[rowIndex] = {
        ...newRows[rowIndex],
        enabledGroups: {
          ...newRows[rowIndex].enabledGroups,
          [groupName]: !newRows[rowIndex].enabledGroups[groupName]
        }
      };
      return newRows;
    });
  };

  const transformDataForSubmission = () => {
    const products = rows.reduce((acc, row) => {
      const hasRequiredFields = columns
        .filter(col => col.required)
        .some(col => row.cells[col.id - 1]);
      
      if (!hasRequiredFields) return acc;

      const primaryProduct = {
        name: row.cells[1] || '',
        quantity: row.cells[3] || '',
        type: 'primary',
        category: row.cells[2] || '',
        company: '',
        brand: row.cells[4] || '',
        primaryBarcode: row.cells[0] || '',
        purchasePrice: row.cells[6] || '',
        defaultSalesPrice: row.cells[7] || '',
        silverPrice: row.cells[8] || '',
        goldPrice: row.cells[9] || '',
        diamondPrice: row.cells[10] || '',
        warehouse: row.cells[5] || '',
        secondaryBarcode: row.cells[11] || '',
        secondaryBarcodeStock: row.cells[12] || '',
        secondaryBarcodeWarehouse: row.cells[13] || '',
        kacchaBarcode: row.cells[0] + '_K' || '',
        kacchaPurchasePrice: row.cells[14] || '',
        kacchaDefaultSalesPrice: row.cells[15] || '',
        kacchaSilverPrice: row.cells[16] || '',
        kacchaGoldPrice: row.cells[17] || '',
        kacchaDiamondPrice: row.cells[18] || '',
        linkedToPrimary: row.cells[0] || ''
      };

      acc.push(primaryProduct);

      // if (row.enabledGroups.kaccha) {
      //   const kacchaProduct = {
      //     name: row.cells[1] || '',
      //     primaryBarcode: row.cells[0] + '_K',
      //     purchasePrice: row.cells[14] || '',
      //     defaultSalesPrice: row.cells[15] || '',
      //     silverPrice: row.cells[16] || '',
      //     goldPrice: row.cells[17] || '',
      //     diamondPrice: row.cells[18] || '',
      //     warehouse: row.cells[5] || '',
      //     type: 'kaccha',
      //     category: row.cells[2] || '',
      //     company: '',
      //     brand: row.cells[4] || '',
      //     linkedToPrimary: row.cells[0] || ''
      //   };
      //   acc.push(kacchaProduct);
      // }

      return acc;
    }, []);

    return { products };
  };

  const handleSubmit = async () => {
    try {
      const transformedData = transformDataForSubmission();
      
      if (transformedData.products.length === 0) {
        alert('No valid products to submit. Please fill in required fields.');
        return;
      }

      const response = await axios.post('http://localhost:5000/batch-create-products', transformedData);
      
      if (response.data.status === 'success') {
        alert('Products created successfully!');
        setRows(createInitialRows());


      } else {
        alert('Error creating products: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error submitting products:', error);
      alert('Error submitting products: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleCellChange = (rowIndex, columnId, value) => {
    const newRows = [...rows];
    const columnIndex = columns.findIndex(col => col.id === columnId);
    newRows[rowIndex].cells[columnIndex] = value;
    setRows(newRows);
  };

  const isColumnEnabled = (rowIndex, column) => {
    if (column.required) return true;
    if (!column.group) return true;
    return rows[rowIndex].enabledGroups[column.group];
  };

  const renderCell = (row, rowIndex, column) => {
    const isEnabled = isColumnEnabled(rowIndex, column);
    
    if (column.type === 'select') {
      return (
        <CellSelect
          value={row.cells[column.id - 1] || ''}
          onChange={(e) => handleCellChange(rowIndex, column.id, e.target.value)}
          disabled={!isEnabled}
        >
          <option value="">Select...</option>
          {storageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </CellSelect>
      );
    }

    return (
      <CellInput
        type={column.type}
        value={row.cells[column.id - 1] || ''}
        onChange={(e) => handleCellChange(rowIndex, column.id, e.target.value)}
        disabled={!isEnabled}
        placeholder={column.required ? 'Required' : ''}
      />
    );
  };

  return (
    <ExcelContainer>
      <TableContainer>
        <ExcelTable>
          <thead>
            <tr>
              <TableHeader style={{ width: '100px' }}>
                Options
              </TableHeader>
              {columns.map((column) => (
                <TableHeader 
                  key={column.id}
                  style={{ width: `${column.width}px` }}
                >
                  {column.name}
                  {column.required && <span style={{ color: '#ff0000', marginLeft: '2px' }}>*</span>}
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row.id}>
                <OptionsCell>
                  <CheckboxContainer>
                    <CheckboxLabel>
                      <ExcelCheckbox
                        type="checkbox"
                        checked={row.enabledGroups.kaccha}
                        onChange={() => toggleRowGroup(rowIndex, 'kaccha')}
                      />
                      <span>K</span>
                    </CheckboxLabel>
                    <CheckboxLabel>
                      <ExcelCheckbox
                        type="checkbox"
                        checked={row.enabledGroups.secondary}
                        onChange={() => toggleRowGroup(rowIndex, 'secondary')}
                      />
                      <span>S</span>
                    </CheckboxLabel>
                  </CheckboxContainer>
                </OptionsCell>
                {columns.map((column) => (
                  <TableCell 
                    key={column.id}
                    style={{ width: `${column.width}px` }}
                  >
                    {renderCell(row, rowIndex, column)}
                  </TableCell>
                ))}
              </tr>
            ))}
          </tbody>
        </ExcelTable>
        <StyledButton onClick={handleSubmit}>SUBMIT</StyledButton>
      </TableContainer>
    </ExcelContainer>
  );
};


export default ProductManagement;