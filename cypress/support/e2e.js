// This example support file is processed and loaded automatically before your test files.
// This is a great place to put global configuration and behavior that modifies Cypress.
// You can change the location of this file or turn off automatically serving support files with the 'supportFile' configuration option.

// Import commands.js using ES2015 syntax:
import './commands';
Cypress.on('uncaught:exception', (err) => {
    // Ignore the error if it's related to something you can safely ignore
    // You can customize the conditions based on the errors you encounter
    if (err.message.includes('Cannot read properties of null')) {
      return false; // Prevent Cypress from failing the test
    }
    return true; // Let Cypress fail the test for other errors
  });
  
// Alternatively you can use CommonJS syntax:
// require('./commands');
