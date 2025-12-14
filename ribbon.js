const fs = require('fs');
const path = require('path');

function generateSVG() {
  const silver = 1 + Math.sqrt(2);
  const gruvbox = [
    '#83a598',
    '#458588',
    '#076678',
    '#8ec07c',
    '#689d6a',
    '#427b58',
  ];

  let sequence = 'S';
  for (let i = 0; i < 6; i++) {
    let next = '';
    for (let char of sequence) {
      next += char === 'S' ? 'L' : 'LS';
    }
    sequence = next;
  }

  let totalWidth = 0;
  for (let char of sequence) {
    totalWidth += char === 'S' ? 1 : silver;
  }

  const S_width = 1200 / totalWidth;
  const L_width = S_width * silver;
  const height = 630;

  let svg = '<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">';
  svg += '<rect width="1200" height="630" fill="#282828"/>';

  let x = 0;
  let i = 0;

  for (let char of sequence) {
    const width = char === 'S' ? S_width : L_width;
    svg += `<rect x="${x}" y="0" width="${width}" height="${height}" fill="${gruvbox[i % gruvbox.length]}" stroke="#1d2021" stroke-width="0.5"/>`;
    x += width;
    i++;
  }

  svg += '</svg>';
  return svg;
}

if (require.main === module) {
  const svg = generateSVG();
  const outputPath = path.join(__dirname, 'ribbons.svg');
  fs.writeFileSync(outputPath, svg);
  console.log(`Wrote ${outputPath}`);
} else {
  module.exports = { generateSVG };
}
