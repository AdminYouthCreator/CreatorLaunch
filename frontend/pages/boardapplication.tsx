import Head from 'next/head';

const BoardApplicationPage = () => {
  return (
    <>
      <Head>
        <title>Board Application | CreatorLaunch</title>
        <meta
          name="description"
          content="Apply to serve on the CreatorLaunch Board of Directors."
        />
      </Head>

      <iframe
        src="https://creatorlaunchforms.qwentin-856.workers.dev/"
        title="CreatorLaunch Board Application"
        loading="eager"
        style={{
          position: 'fixed',
          inset: 0,
          display: 'block',
          width: '100vw',
          height: '100dvh',
          border: 0,
          background: '#ffffff',
        }}
      />
    </>
  );
};

export default BoardApplicationPage;
