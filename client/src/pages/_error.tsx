import {NextPage, NextPageContext} from 'next';
import React from 'react';

import {Error} from '../modules/layout/Error';

interface ErrorProps {
  statusCode: number;
}

const messages = ['Oops! Something went wrong!'];

const _Error: NextPage<ErrorProps> = ({statusCode}: ErrorProps) => {
  return (
    <Error statusCode={statusCode} avatarName="unknown" messages={messages} />
  );
};

_Error.getInitialProps = ({res, err}: NextPageContext): ErrorProps => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 500;

  return {statusCode};
};

export default _Error;
