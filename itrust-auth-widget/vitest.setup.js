process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection caught in tests:', err);
  });
  