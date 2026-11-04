import { GetServerSideProps } from 'next';

export default function BusinessProgramLoginRedirect() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: 'https://creatorlaunch-student-business.creatorlaunc-8659.chatgpt.site',
    permanent: false,
  },
});
