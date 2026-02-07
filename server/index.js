const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
   ☁️  Nolan Cloud Platform API Server
   ===================================
   🚀 Listening on port ${PORT}
   🔗 Local: http://localhost:${PORT}
  `);
});
