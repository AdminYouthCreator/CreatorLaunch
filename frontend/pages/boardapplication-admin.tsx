import Head from 'next/head';

const BoardApplicationAdminPage = () => {
  return (
    <>
      <Head>
        <title>Board Application Admin | CreatorLaunch</title>
        <meta
          name="description"
          content="Manage CreatorLaunch Board of Directors applications."
        />
      </Head>

      <iframe
        src="/api/boardapplication-proxy/admin"
        title="CreatorLaunch Board Application Administration"
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

export default BoardApplicationAdminPage;
