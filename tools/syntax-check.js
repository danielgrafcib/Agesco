// Simple syntax check: require the main js files to ensure no parse errors
try {
  require('../js/dictionary.js');
  require('../js/translations.js');
  require('../js/language-manager.js');
  console.log('Syntax check: OK - files loaded without parse errors');
} catch (e) {
  console.error('Syntax check failed:', e && e.stack ? e.stack : e);
  process.exit(1);
}
