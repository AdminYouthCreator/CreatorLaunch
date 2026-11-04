import { GetServerSideProps } from 'next';

export default function BusinessProgramPortalRedirect() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: '/business-program/login',
    permanent: false,
  },
});
