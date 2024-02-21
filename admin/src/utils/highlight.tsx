import hljs from 'highlight.js';
import 'highlight.js/styles/monokai-sublime.css';

declare global {
  interface Window {
    hljs: any;
  }
}


// ----------------------------------------------------------------------

hljs.configure({
  languages: ['typescript', 'tsx', 'sh', 'bash', 'html', 'scss', 'css', 'json'],
});

if (typeof window as any !== 'undefined') {
  window.hljs = hljs;
}
