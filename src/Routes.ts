import dynamic from 'next/dynamic';
import {NextRouter} from 'next/router';

export interface Route {
  displayName: string;
  path: string;
  icon: React.ComponentType;
}

export const Routes = {
  HOME: {
    displayName: 'Home',
    path: '/',
    icon: dynamic(() => import('@material-ui/icons/Home')),
  },
  TEAM_ANALYSIS: {
    displayName: 'Team Analysis',
    path: '/team-analysis',
    icon: dynamic(() => import('@material-ui/icons/BarChart')),
  },
};

export const getCurrentRoute = (router: NextRouter): Route | undefined => {
  return Object.values(Routes).find(route => router.pathname === route.path);
};
