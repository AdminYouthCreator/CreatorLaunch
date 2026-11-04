import { GetServerSideProps } from 'next';

export default function BusinessProgramPortalRedirect() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: 'https://creatorlaunch-student-business.creatorlaunc-8659.chatgpt.site/portal',
    permanent: false,
  },
});
