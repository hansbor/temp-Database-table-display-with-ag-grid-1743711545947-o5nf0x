import React, { useState, useRef } from 'react'
import GridTable from './components/GridTable'
import ApiTest from './components/ApiTest' // Import the ApiTest component

function App() {
  const [tableName, setTableName] = useState<string>('addresses') // Default table name - set to 'addresses' as per image
  const tableNames = [
    'addresses',
    'brands',
    'categories',
    'collections',
    'colors',
    'product_types',
    'products',
    'purchase_order_items',
    'purchase_orders',
    'sequence_counters',
    'settings',
    'sizes',
    'suppliers',
    'variants',
  ]
  const gridRef = useRef<any>(null) // Ref to hold the GridTable instance

  const handleTableNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTableName = e.target.value
    setTableName(newTableName)
  }

  const exportToCsv = () => {
    console.log('Export to CSV button clicked in App.tsx') // Debug log
    gridRef.current?.exportToCsv() // Call exportToCsv function in GridTable
  }

  const exportToExcel = () => {
    console.log('Export to Excel button clicked in App.tsx') // Debug log
    gridRef.current?.exportToExcel() // Call exportToExcel function in GridTable
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-inter"> {/* Apply font-inter */}
      <header className="text-center py-4">
        <h1 className="text-2xl font-semibold text-ga-color-primary-90"> {/* Example using ga-color */}
          Database Table Viewer
        </h1>
      </header>
      <main className="container mx-auto mt-8">
        <ApiTest /> {/* Include the ApiTest component here */}
        <div className="mb-4 flex space-x-2 items-center">
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={tableName}
            onChange={handleTableNameChange}
          >
            {tableNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <button
            className="ga-button ga-button--primary"  // Example using ga-button styles
            onClick={exportToCsv}
          >
            Export as CSV
          </button>
          <button
            className="ga-button ga-button--secondary" // Example using ga-button styles
            onClick={exportToExcel}
          >
            Export as Excel
          </button>
        </div>
        <GridTable tableName={tableName} ref={gridRef} /> {/* Pass ref to GridTable */}
      </main>
      <footer className="text-center mt-8 p-4 text-gray-500">
        <p>© 2023 My Company</p>
      </footer>
    </div>
  )
}

export default App
