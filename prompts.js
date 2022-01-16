module.exports = [
  {
    type: 'list',
    name: 'importType',
    message: 'How do you want to import Fect UI?',
    choices: [
      { name: 'Fully import', value: 'full' },
      { name: 'Import on demand', value: 'partial' },
    ],
    default: 'full',
  },
  {
    type: 'list',
    name: 'partialImportType',
    message: 'Choose a type for import on demand',
    choices: [
      { name: 'Manual', value: 'manual' },
      { name: 'Babel', value: 'babel' },
    ],
    when: ({ importType }) => {
      return importType === 'partial'
    },
    default: 'manual',
  },
]
