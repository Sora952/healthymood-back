import React from 'react';
import { Layout, Breadcrumb, Avatar } from 'antd';
import avatar from '../images/Luffy-One-Piece.png';

const { Header } = Layout;

const TopBar = () => {
  return (
    <>
      <Header className='site-layout-background' style={{ padding: 0 }}>
        <Avatar src={avatar} />
      </Header>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>User</Breadcrumb.Item>
        <Breadcrumb.Item>Bill</Breadcrumb.Item>
      </Breadcrumb>
    </>
  );
};

export default TopBar;
