// src/composables/useSheets.js
import { CONFIG } from '../config'

export function useSheets(accessToken) {
  const BASE = 'https://sheets.googleapis.com/v4/spreadsheets'
  const headers = () => ({
    'Authorization': `Bearer ${accessToken.value}`,
    'Content-Type': 'application/json'
  })

  async function getEmployeeByEmail(email) {
    const url = `${BASE}/${CONFIG.SPREADSHEET_ID}/values/${CONFIG.SHEET_NAME}!${CONFIG.SHEET_RANGE}`
    const res = await fetch(url, { headers: headers() })
    const data = await res.json()
    const rows = data.values || []

    // Row 0 = headers, find employee by email (column C = index 2)
    const rowIndex = rows.findIndex((row, i) => i > 0 && row[2]?.toLowerCase() === email.toLowerCase())
    if (rowIndex === -1) return null

    const row = rows[rowIndex]
    return {
      rowIndex: rowIndex + 1, // 1-based for Sheets API
      employeeId: row[0] || '',
      name: row[1] || '',
      email: row[2] || '',
      timeInTime: row[3] || '',
      timeInAlready: row[4]?.toUpperCase() === 'TRUE',
      timeOutTime: row[5] || '',
      timeOutAlready: row[6]?.toUpperCase() === 'TRUE',
    }
  }

  async function updateEmployee(rowIndex, data) {
    // Only update column E (Time In Already?) and G (Time Out Already?)
    const requests = [
      {
        range: `${CONFIG.SHEET_NAME}!E${rowIndex}`,
        values: [[data.timeInAlready ? 'TRUE' : 'FALSE']]
      },
      {
        range: `${CONFIG.SHEET_NAME}!G${rowIndex}`,
        values: [[data.timeOutAlready ? 'TRUE' : 'FALSE']]
      }
    ]

    const url = `${BASE}/${CONFIG.SPREADSHEET_ID}/values:batchUpdate`
    const body = {
      valueInputOption: 'USER_ENTERED',
      data: requests
    }
    const res = await fetch(url, { method: 'POST', headers: headers(), body: JSON.stringify(body) })
    return res.ok
  }

  return { getEmployeeByEmail, updateEmployee }
}