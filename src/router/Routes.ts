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
  SPECIES_INFO: {
    displayName: 'Species info',
    path: '/species-info',
    icon: dynamic(() => import('@material-ui/icons/Search')),
  },
  TEAM_ANALYSIS: {
    displayName: 'Team analysis',
    path: '/team-analysis',
    icon: dynamic(() => import('@material-ui/icons/BarChart')),
  },
};

export const getCurrentRoute = (router: NextRouter): Route | undefined => {
  return Object.values(Routes).find(route => router.pathname === route.path);
};
