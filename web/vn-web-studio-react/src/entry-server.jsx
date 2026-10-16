import { renderToString } from 'react-dom/server';
import App from './main.jsx';

export const render = () => renderToString(<App />);
