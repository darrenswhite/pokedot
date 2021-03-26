import dynamic from 'next/dynamic';
import {NextRouter} from 'next/router';
import {values, find, flow} from 'lodash/fp';

export interface Route {
  displayName: string;
  path: string;
  icon: React.ComponentType<React.HTMLAttributes<HTMLElement>>;
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
  TEAM_GENERATOR: {
    displayName: 'Team generator',
    path: '/team-generator',
    icon: dynamic(() => import('@material-ui/icons/Casino')),
  },
};

export const getCurrentRoute = (router: NextRouter): Route | undefined => {
  return flow(
    values,
    find(route => router.pathname === route.path)
  )(Routes);
};
