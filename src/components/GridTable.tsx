import React, { useState, useEffect, useCallback, useRef, useImperativeHandle, forwardRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface GridTableProps {
  tableName: string;
}

// Use forwardRef to allow ref to be passed from parent component
const GridTable: React.ForwardRefExoticComponent<React.PropsWithChildren<GridTableProps> & React.RefAttributes<any>> = forwardRef<any, GridTableProps>(({ tableName }, ref) => {
  const [rowData, setRowData] = useState<any[]>([])
  const [columnDefs, setColumnDefs] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const gridRef = useRef<AgGridReact>(null)
  const gridApiRef = useRef<any>(null) // Ref to hold the ag-Grid API

  const fetchTableData = useCallback(async () => {
    if (!tableName) {
      console.warn('Table name is empty, skipping fetch.')
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')

      if (error) {
        console.error('Error fetching data from Supabase:', error)
        // Display user-friendly error in UI if needed
      }
      if (data) {
        setRowData(data)
        if (data.length > 0) {
          // Dynamically generate column definitions based on the keys of the first row
          setColumnDefs(
            Object.keys(data[0]).map(key => ({
              field: key,
              filter: true, // Enable filter for each column
              sortable: true, // Enable sorting for each column
            }))
          )
        } else {
          setColumnDefs([]) // Set to empty if no data to prevent errors
        }
      }
    } catch (error) {
      console.error('Unexpected error fetching data:', error)
      // Display user-friendly error in UI if needed
    } finally {
      setLoading(false)
    }
  }, [tableName]) // Dependency array includes tableName

  useEffect(() => {
    fetchTableData()
  }, [fetchTableData]) // useEffect hook to fetch data when tableName changes or component mounts

  // Use useImperativeHandle to expose functions to parent component via ref
  useImperativeHandle(ref, () => ({
    exportToCsv: () => {
      console.log('exportToCsv function called in GridTable.tsx') // Debug log
      console.log('gridApiRef.current in exportToCsv:', gridApiRef.current) // Debug log
      gridApiRef.current?.exportDataAsCsv()
    },
    exportToExcel: () => {
      console.log('exportToExcel function called in GridTable.tsx') // Debug log
      console.log('gridApiRef.current in exportToExcel:', gridApiRef.current) // Debug log
      gridApiRef.current?.exportDataAsExcel()
    },
  }))

  const onGridReady = useCallback((params) => {
    console.log('onGridReady called in GridTable.tsx') // Debug log
    gridApiRef.current = params.api // Store the grid API
    console.log('gridApiRef.current in onGridReady:', gridApiRef.current) // Debug log
  }, [])

  return (
    <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <p>Loading data...</p>
        </div>
      ) : (
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          DomLayout={'autoHeight'}
          enableFilter={true} // Enable filtering on the grid
          enableSorting={true} // Enable sorting on the grid
          onGridReady={onGridReady} // Get grid API when grid is ready
        />
      )}
    </div>
  )
})

GridTable.displayName = 'GridTable' // helps with React DevTools
export default GridTable
