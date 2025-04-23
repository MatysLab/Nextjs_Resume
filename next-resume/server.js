const { createServer } = require('https');
const { createServer: createHttpServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// SSL certificate paths
const httpsOptions = {
  key: fs.readFileSync(path.join(process.cwd(), 'certificates', 'semphas.com', 'privkey.pem')),
  cert: fs.readFileSync(path.join(process.cwd(), 'certificates', 'semphas.com', 'fullchain.pem'))
};

// Function to check if the request is for www subdomain
const isWwwSubdomain = (host) => {
  return host && host.startsWith('www.');
};

// Function to redirect to non-www
const redirectToNonWww = (req, res) => {
  const host = req.headers.host;
  const newHost = host.replace('www.', '');
  res.writeHead(301, { Location: `https://${newHost}${req.url}` });
  res.end();
};

// Redirect HTTP to HTTPS and handle www subdomain
const httpServer = createHttpServer((req, res) => {
  const host = req.headers.host;
  if (isWwwSubdomain(host)) {
    redirectToNonWww(req, res);
  } else {
    res.writeHead(301, { Location: `https://${host}${req.url}` });
    res.end();
  }
});

app.prepare().then(() => {
  // Start HTTP server on port 80
  httpServer.listen(80, '0.0.0.0', (err) => {
    if (err) {
      console.error('Error starting HTTP server:', err);
      throw err;
    }
    console.log('> HTTP server ready on port 80');
  });

  // Start HTTPS server on port 443
  createServer(httpsOptions, (req, res) => {
    try {
      const host = req.headers.host;
      if (isWwwSubdomain(host)) {
        redirectToNonWww(req, res);
        return;
      }
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling request:', err);
      res.writeHead(500);
      res.end('Internal Server Error');
    }
  }).listen(443, '0.0.0.0', (err) => {
    if (err) {
      console.error('Error starting HTTPS server:', err);
      throw err;
    }
    console.log('> HTTPS server ready on port 443');
  });
}).catch((err) => {
  console.error('Error preparing the application:', err);
  process.exit(1);
}); 