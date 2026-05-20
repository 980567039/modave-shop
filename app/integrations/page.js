'use client';
import { signIn, signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const Integrations = ({ req }) => {

  const { status, data: { user } } = useSession();

  if (status === 'authenticated' && user.accessToken ) {
    redirect('/integrations/channel');
  }
  // add new n
  return (
    <div>
      <br />
      <button onClick={() => signIn('google')}>Sign in with Google</button>
      <br />
      <button onClick={() => signOut({ callbackUrl: '/integrations' })}>Sign out</button>
    </div>
  );
};

export default Integrations;
