import React from 'react';
import { Table } from 'antd';

interface DetailTableProps {
  data: Record<string, number> | null;
}

const DetailTable: React.FC<DetailTableProps> = ({ data }) => {
  if (!data) return null;

  const tableData = Object.keys(data).map((title) => ({
    title,
    count: data[title],
  }));

  const columns = [
    {
      title: 'Job Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Number of Jobs',
      dataIndex: 'count',
      key: 'count',
    },
  ];

  return <Table columns={columns} dataSource={tableData} rowKey="title" />;
};

export default DetailTable;
