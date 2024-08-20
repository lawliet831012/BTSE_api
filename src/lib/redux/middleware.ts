/* Core */
import { createLogger } from 'redux-logger';

const logger = createLogger({
  duration: true,
  timestamp: false,
  collapsed: true,
  colors: {
    title: () => '#139BFE',
    prevState: () => '#1C5FAF',
    action: () => '#149945',
    nextState: () => '#A47104',
    error: () => '#ff0005',
  },
  predicate: () => typeof window !== 'undefined',
});

const middleware: any[] = [];
if (process.env.NODE_ENV === 'development') {
  middleware.push(logger);
}

export { middleware };
