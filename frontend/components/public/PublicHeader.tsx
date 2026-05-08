import React from 'react';
import Header from '@/components/common/Header';

interface PublicHeaderProps {
  showAnnouncement?: boolean;
  announcementText?: string;
}

const PublicHeader: React.FC<PublicHeaderProps> = ({
  showAnnouncement = true,
  announcementText = 'CreatorLaunch is building the next generation of founders.',
}) => {
  return (
    <Header
      showAnnouncement={showAnnouncement}
      announcementText={announcementText}
    />
  );
};

export default PublicHeader;
