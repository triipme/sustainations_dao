import { useState, useLayoutEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import DfinityAgentService from '../../auth/services/dfinityAgentService';
import { useConnect } from "@connect2ic/react";

function SignInPage() {
  const [authClient, setAuthClient] = useState(undefined);

  const { connect } = useConnect({
    onConnect: (data) => {
      console.log("connected!", data);
      DfinityAgentService.login();
    },
    onDisconnect: () => {
      console.log("disconnected!")
    }
  });

  useLayoutEffect(() => {
    (async () => {
      AuthClient.create().then(async client => {
        setAuthClient(client);
      });
    })();
  }, []);

  const handleLogin = async () => {
    await authClient?.login({
      identityProvider: process.env.II_URL,
      onSuccess: async () => {
        DfinityAgentService.login();
      },
      onError: error => {
        console.log(error);
      }
    });
  };

  function redirectUrl(url) {
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col flex-auto items-center sm:justify-center min-w-0">
      <Paper className="w-full sm:w-auto min-h-full sm:min-h-auto rounded-0 py-32 px-16 sm:p-48 sm:rounded-2xl sm:shadow">
        <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
          <div className="items-center">
            <img className="flex-auto mx-auto max-w-xs" src='images/logo/on_chain.svg' alt='on chain' />
          </div>
          <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight text-center" style={{color: '#46c2cb'}}>
            D.A.O for Sustainable Development Goals
          </Typography>
          <div className="flex items-center">
            <img className="flex-auto m-w" src='images/logo/sustainations-medal.png' alt='logo' />
          </div>
          <div className="items-center">
            <img className="cursor-pointer mx-auto max-w-64" onClick={() => redirectUrl("https://www.youtube.com/watch?v=pe84UGSXOuk")} src="images/logo/youtube.png" alt="youtube" />
          </div>
          <div className="mt-24 text-lg tracking-tight leading-6 text-center" style={{color: '#46c2cb'}}>
          💚 SUSTAINATIONS is a global private community of change-makers, founders, farmers, and builders who work together to write a greener future for our community and the Earth.
          </div>
          <div className="text-lg mt-16 text-center">Sign with Internet Identity to become our change-maker.</div>
          <div className="flex items-center">
            <Button
              variant="contained"
              color="secondary"
              className="w-full mt-16 flex-auto"
              style={{color: '#ffffff'}}
              aria-label="Sign in"
              type="button"
              size="large"
              onClick={() => handleLogin()}
            >
              Sign in
            </Button>
          </div>
          <div className="flex items-center mt-16">
            <div className="flex-auto mt-px border-t" />
            <Typography className="mx-8" color="text.secondary">
              Or
            </Typography>
            <div className="flex-auto mt-px border-t" />
          </div>
          <div className="flex items-center">
            <Button
              variant="contained"
              color="secondary"
              className="w-full mt-16 flex-auto"
              style={{color: '#ffffff'}}
              aria-label="Use Infinity Wallet"
              type="button"
              size="large"
              onClick={() => connect('infinity')}
            >
              Use Infinity Wallet
            </Button>
          </div>
        </div>
      </Paper>
    </div>
  );
}

export default SignInPage;
