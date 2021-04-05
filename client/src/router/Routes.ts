import {findLast, flow, values} from 'lodash/fp';
import dynamic from 'next/dynamic';
import {NextRouter} from 'next/router';

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
  TEAM_ANALYSIS: {
    displayName: 'Team Analysis',
    path: '/team-analysis',
    icon: dynamic(() => import('@material-ui/icons/BarChart')),
  },
  TEAM_GENERATOR: {
    displayName: 'Team Generator',
    path: '/team-generator',
    icon: dynamic(() => import('@material-ui/icons/Casino')),
  },
};

export const getCurrentRoute = (router: NextRouter): Route | undefined => {
  return flow(
    values,
    findLast(route => router.pathname.startsWith(route.path))
  )(Routes);
};
