import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const filePath = path.join(process.cwd(), 'public', 'config', 'blogData.json');
      const newData = req.body;
      
      // Validate the data structure
      if (!newData.posts || !Array.isArray(newData.posts)) {
        return res.status(400).json({ error: 'Invalid data structure' });
      }
      
      // Create backup of existing file
      const backupPath = path.join(process.cwd(), 'public', 'config', `blogData.backup.${Date.now()}.json`);
      if (fs.existsSync(filePath)) {
        fs.copyFileSync(filePath, backupPath);
      }
      
      // Write new data to static file
      fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
      
      res.status(200).json({ 
        success: true, 
        message: 'Blog data updated successfully',
        postsCount: newData.posts.length
      });
    } catch (error) {
      console.error('Failed to update blog data:', error);
      res.status(500).json({ error: 'Failed to update blog data' });
    }
  } else if (req.method === 'GET') {
    // Allow reading the current static file
    try {
      const filePath = path.join(process.cwd(), 'public', 'config', 'blogData.json');
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(fileContents);
      
      res.status(200).json(data);
    } catch (error) {
      console.error('Failed to read blog data:', error);
      res.status(500).json({ error: 'Failed to read blog data' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
