const fs = require('fs-extra');
fs.copy('views', 'dist/views')
  .then(() => console.log('Success: dist/views!'))
  .catch(err => console.error(err))
fs.copy('public', 'dist/public')
  .then(() => console.log('Success: dist/public!'))
  .catch(err => console.error(err))

  // Copy folder views và public sang folder dist