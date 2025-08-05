const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const server = http.createServer((req, res) => {
    console.log(`Request for: ${req.url}`);

    let filePath = req.url === '/' ? 'index.html' : '.' + req.url;
    const ext = path.extname(filePath);
    let contentType = 'text/html';

    switch (ext) {
        case '.css':
            contentType = 'text/css';
                    break;
        case '.js':
            contentType = 'application/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            case '.jpeg':
            contentType = 'image/jpeg'; 
            break;
}


fs.readFile(filePath, (err, content) => {
    if (err){
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');

    }else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
    }
});
}
);

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});