/**
 * EduPortal Local Test Server (Node.js Built-in HTTP)
 * Zero external dependencies needed!
 * Runs locally to test HTML, CSS, JavaScript, jQuery and process.php endpoints.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = parsedUrl.pathname;

  // Route: POST /process.php
  if (pathname === '/process.php' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const data = querystring.parse(body);

      // Server-side validation
      const errors = {};
      if (!data.firstName || data.firstName.trim().length < 2) errors.firstName = 'First name required';
      if (!data.lastName || data.lastName.trim().length < 2) errors.lastName = 'Last name required';
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Valid email required';
      if (!data.phone || !/^[0-9]{10}$/.test(data.phone)) errors.phone = '10-digit phone required';
      if (!data.course) errors.course = 'Course selection required';

      if (Object.keys(errors).length > 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ status: 'error', message: 'Validation failed', errors }));
      }

      const now = new Date();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const formattedDate = `${String(now.getDate()).padStart(2, '0')} ${months[now.getMonth()]} ${now.getFullYear()}`;
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const randomRef = 'APP-' + now.getFullYear() + '-' + Math.random().toString(36).substring(2, 7).toUpperCase();

      let formattedDob = data.dob || '';
      if (data.dob) {
        const d = new Date(data.dob);
        if (!isNaN(d.getTime())) {
          formattedDob = `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
        }
      }

      const responsePayload = {
        status: 'success',
        message: 'Candidate application registered successfully.',
        data: {
          applicationId: randomRef,
          submissionDate: formattedDate,
          timestamp: `${formattedDate}, ${timeStr}`,
          fullName: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          dob: formattedDob,
          gender: data.gender || '',
          course: data.course || '',
          qualification: data.qualification || '',
          address: data.address || '',
          city: data.city || '',
          pincode: data.pincode || '',
          remarks: data.remarks || ''
        }
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(responsePayload));
    });
    return;
  }

  // Route: Static files (index.html, style.css, script.js)
  if (pathname === '/') pathname = '/index.html';
  const filePath = path.join(__dirname, pathname);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(` EduPortal Registration App is running!`);
  console.log(` Open URL: http://localhost:${PORT}`);
  console.log(` Press Ctrl+C to stop the server.`);
  console.log(`======================================================\n`);
});
