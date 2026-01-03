#!/usr/bin/env node
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 8080;
const ROOT_DIR = __dirname;

const server = http.createServer((req, res) => {
  try {
    // Handle OPTIONS requests for CORS
    if (req.method === 'OPTIONS') {
      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Range'
      });
      res.end();
      return;
    }

    const url = new URL(req.url, `http://localhost:${PORT}`);
    // Decode URL to handle spaces in font paths
    let decodedPath = decodeURIComponent(url.pathname);
    
    // Route requests to appropriate directories
    let filePath;
    if (decodedPath.startsWith('/basemaps/')) {
      filePath = path.join(ROOT_DIR, decodedPath);
    } else if (decodedPath.startsWith('/shared/')) {
      filePath = path.join(ROOT_DIR, decodedPath);
    } else if (decodedPath.startsWith('/public/')) {
      filePath = path.join(ROOT_DIR, decodedPath);
    } else if (decodedPath === '/' || decodedPath === '') {
      // Root path - serve public/index.html if it exists, otherwise 404
      filePath = path.join(ROOT_DIR, 'public', 'index.html');
      if (!fs.existsSync(filePath)) {
        res.writeHead(404);
        res.end('Not Found');
        return;
      }
    } else {
      // Try public directory for backwards compatibility
      filePath = path.join(ROOT_DIR, 'public', decodedPath);
    }
    
    // Check if file exists
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }

    const stat = fs.statSync(filePath);
    const ext = path.extname(filePath);
    
    // Set content type
    const contentTypes = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.pbf': 'application/x-protobuf',
      '.pmtiles': 'application/octet-stream'
    };
    
    const contentType = contentTypes[ext] || 'application/octet-stream';
    
    // Handle byte range requests (needed for PMTiles)
    const range = req.headers.range;
    if (range && ext === '.pmtiles') {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunksize = (end - start) + 1;
      
      const stream = fs.createReadStream(filePath, { start, end });
      
      stream.on('error', (err) => {
        console.error(`Error reading file ${filePath}:`, err);
        if (!res.headersSent) {
          res.writeHead(500);
          res.end('Internal Server Error');
        }
      });
      
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS'
      });
      
      stream.pipe(res);
    } else {
      // Regular file serving
      const stream = fs.createReadStream(filePath);
      
      stream.on('error', (err) => {
        console.error(`Error reading file ${filePath}:`, err);
        if (!res.headersSent) {
          res.writeHead(500);
          res.end('Internal Server Error');
        }
      });
      
      res.on('close', () => {
        if (!stream.destroyed) {
          stream.destroy();
        }
      });
      
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': stat.size,
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS'
      });
      
      stream.pipe(res);
    }
  } catch (err) {
    console.error(`Error handling request ${req.url}:`, err);
    if (!res.headersSent) {
      res.writeHead(500);
      res.end('Internal Server Error');
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Serving files from project root: ${ROOT_DIR}`);
  console.log(`Available paths:`);
  console.log(`  - /basemaps/* - Basemap styles and previews`);
  console.log(`  - /shared/* - Shared assets (glyphs, sprites)`);
  console.log(`  - /public/* - Public files`);
});
