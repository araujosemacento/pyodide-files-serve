import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',
      precompress: false,
      strict: false
    }),
    paths: {
      base: process.env.NODE_ENV === 'production' ? '/pyodide-files-serve' : '',
      relative: false
    },
    prerender: {
      handleHttpError: ({ path, referrer, message }) => {
        // Log error but don't fail build
        console.warn(`Prerender error on ${path}: ${message}`);
      }
    }
  }
};

export default config;
