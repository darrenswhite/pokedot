import {Box, Container} from '@mui/material';
import dynamic from 'next/dynamic';
import React from 'react';

import {GenerationProviderProps} from '../generation/GenerationProvider';
import {SpeciesProviderProps} from '../species/SpeciesProvider';
import {TeamProviderProps} from '../team-analysis/TeamProvider';
import {TeamGeneratorProviderProps} from '../team-generator/TeamGeneratorProvider';

import {Footer} from './Footer';
import {Header} from './Header';

const SpeciesBottomDrawer = dynamic<object>(() =>
  import('../species/SpeciesBottomDrawer').then(m => m.SpeciesBottomDrawer)
);

const GenerationProvider = dynamic<GenerationProviderProps>(() =>
  import('../generation/GenerationProvider').then(m => m.GenerationProvider)
);

const SpeciesProvider = dynamic<SpeciesProviderProps>(() =>
  import('../species/SpeciesProvider').then(m => m.SpeciesProvider)
);

const TeamProvider = dynamic<TeamProviderProps>(() =>
  import('../team-analysis/TeamProvider').then(m => m.TeamProvider)
);

const TeamGeneratorProvider = dynamic<TeamGeneratorProviderProps>(() =>
  import('../team-generator/TeamGeneratorProvider').then(
    m => m.TeamGeneratorProvider
  )
);

type PageContainerProps = {
  children: NonNullable<React.ReactNode>;
};

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
}: PageContainerProps) => {
  return (
    <Box display={'flex'}>
      <Box
        display={'flex'}
        flex={'1 1 auto'}
        flexDirection={'column'}
        minHeight={'100vh'}
        maxWidth={'100%'}
        position={'relative'}
        sx={{backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden'}}
      >
        <Header />

        <TeamGeneratorProvider>
          <GenerationProvider>
            <SpeciesProvider>
              <TeamProvider>
                <Box
                  component={'main'}
                  role="main"
                  display={'flex'}
                  flex={'1 0 auto'}
                  maxWidth={'100%'}
                  paddingTop={12}
                >
                  <Container maxWidth={false} sx={{padding: 2}}>
                    {children}
                  </Container>
                </Box>

                <SpeciesBottomDrawer />
              </TeamProvider>
            </SpeciesProvider>
          </GenerationProvider>
        </TeamGeneratorProvider>

        <Footer />
      </Box>
    </Box>
  );
};
