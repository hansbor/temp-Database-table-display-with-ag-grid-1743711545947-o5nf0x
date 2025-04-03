import React, { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const ApiTest: React.FC = () => {
  const [apiTestResult, setApiTestResult] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [tableList, setTableList] = useState<string[] | null>(null)
  const [tableListLoading, setTableListLoading] = useState<boolean>(false)

  const testSupabaseConnection = async () => {
    setLoading(true)
    setApiTestResult('Testing API Connection...')
    try {
      const { data, error } = await supabase
        .from('addresses') // Using 'addresses' table as a test table instead of 'items'
        .select('*')
        .limit(1)

      if (error) {
        console.error('Supabase API test failed:', error)
        setApiTestResult(`API Test Failed: ${error.message}`)
      } else {
        console.log('Supabase API test successful:', data)
        setApiTestResult('API Test Successful: Connected to Supabase and fetched data from "addresses" table.')
      }
    } catch (err) {
      console.error('Error during Supabase API test:', err)
      setApiTestResult(`API Test Error: ${(err as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const listTables = async () => {
    setTableListLoading(true)
    setTableList(null) // Clear previous table list
    try {
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')

      if (error) {
        console.error('Supabase table listing failed:', error) // More specific error log
        setTableList([`Error fetching tables: ${error.message}`]) // More specific error message for UI
      } else {
        console.log('Table list fetched successfully:', data)
        const tableNames = data.map((table) => table.table_name)
        setTableList(tableNames)
      }
    } catch (error) {
      console.error('Error fetching table list:', error) // General error log
      setTableList(['Error fetching tables']) // General error message for UI
    } finally {
      setTableListLoading(false)
    }
  }

  return (
    <div className="mb-4 p-4 border rounded shadow-md bg-white">
      <h3 className="font-semibold mb-2">Supabase API Connection Test</h3>
      <div className="mb-2 space-x-2">
        <button
          onClick={testSupabaseConnection}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {loading ? 'Testing Connection...' : 'Test Connection'}
        </button>
        <button
          onClick={listTables}
          disabled={tableListLoading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {tableListLoading ? 'Loading Tables...' : 'List Tables'}
        </button>
      </div>

      {apiTestResult && (
        <div className="mt-2">
          <p className={apiTestResult.startsWith('API Test Successful') ? 'text-green-500' : 'text-red-500'}>
            {apiTestResult}
          </p>
        </div>
      )}

      {tableList && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Available Tables:</h4>
          {tableList.length > 0 ? (
            <ul className="list-disc list-inside">
              {tableList.map((tableName, index) => (
                <li key={index}>{tableName}</li>
              ))}
            </ul>
          ) : (
            <p>No tables found in the public schema.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default ApiTest
