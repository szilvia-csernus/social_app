import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			'/dj-rest-auth': 'http://127.0.0.1:8000',
			'/profiles': 'http://127.0.0.1:8000',
			'/posts': 'http://127.0.0.1:8000',
			'/comments': 'http://127.0.0.1:8000',
			'/likes': 'http://127.0.0.1:8000',
			'/follows': 'http://127.0.0.1:8000',
		},
	},
});
