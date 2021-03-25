import React from 'react';
import {NextPage, NextPageContext} from 'next';
import Error from '../src/components/layout/Error';

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
  const statusCode = res?.statusCode ?? err?.statusCode ?? 404;

  return {statusCode};
};

export default _Error;
