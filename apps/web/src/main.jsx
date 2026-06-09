import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import { I18nProvider } from '@/i18n/I18nProvider.jsx';
import { AuthProvider } from '@/auth/AuthProvider.jsx';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
	<I18nProvider>
		<AuthProvider>
			<App />
		</AuthProvider>
	</I18nProvider>
);