import { NextApiRequest, NextApiResponse } from 'next';
import { BankData } from '@/types';
import fs from 'fs';
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ banks: BankData[], lastUpdated: string } | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Read from local JSON file
    const filePath = path.join(process.cwd(), 'data', 'banksData.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    // Filter only active banks
    const banks = data.banks.filter((bank: BankData) => bank.isActive);
    
    res.status(200).json({
      banks,
      lastUpdated: data.lastUpdated || new Date().toISOString()
    });
  } catch (error) {
    console.error('Error reading bank data:', error);
    res.status(500).json({ error: 'Failed to fetch bank data' });
  }
}

