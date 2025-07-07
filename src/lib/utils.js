/**
 * @param {number} bytes
 * @param {function} [t] - Translation function (optional for backwards compatibility)
 */
// @ts-ignore
export function formatFileSize(bytes, t = null) {
  if (bytes === 0) {
    return t ? `0 ${t('file_sizes.bytes', { default: 'Bytes' })}` : '0 Bytes';
  }

  const k = 1024;
  const sizes = t
    ? [
      t('file_sizes.bytes', { default: 'Bytes' }),
      t('file_sizes.kb', { default: 'KB' }),
      t('file_sizes.mb', { default: 'MB' }),
      t('file_sizes.gb', { default: 'GB' })
    ]
    : ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * @param {{ type: string; name: string; }} file
 */
export function getFileIcon(file) {
  if (file.type === 'directory') {
    return '📁';
  }

  const iconMap = {
    '.whl': '🐍',
    '.tar': '📦',
    '.gz': '📦',
    '.zip': '📦',
    '.pdf': '📄',
    '.txt': '📝',
    '.md': '📝',
    '.json': '⚙️',
    '.yml': '⚙️',
    '.yaml': '⚙️',
    '.js': '🟨',
    '.ts': '🔵',
    '.html': '🌐',
    '.css': '🎨',
    '.png': '🖼️',
    '.jpg': '🖼️',
    '.jpeg': '🖼️',
    '.gif': '🖼️',
    '.svg': '🎨'
  };

  const ext = file.name.substring(file.name.lastIndexOf('.'));
  // @ts-ignore
  return iconMap[ext] || '📄';
}

/**
 * @param {string} filename
 */
export function getFileExtension(filename) {
  return filename.substring(filename.lastIndexOf('.'));
}

/**
 * @param {any[]} files
 * @param {string} searchTerm
 */
export function searchFiles(files, searchTerm) {
  if (!searchTerm.trim()) return files;

  const term = searchTerm.toLowerCase();
  return files.filter((/** @type {{ name: string; }} */ file) =>
    file.name.toLowerCase().includes(term)
  );
}
