import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SalaryData } from '../utils/dataLoader';

interface MainTableProps {
  data: SalaryData[];
  onRowClick: (year: number) => void;
}

const MainTable: React.FC<MainTableProps> = ({ data, onRowClick }) => {
  const columns: ColumnsType<SalaryData> = [
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      sorter: (a, b) => a.year - b.year,
    },
    {
      title: 'Total Jobs',
      dataIndex: 'totalJobs',
      key: 'totalJobs',
      sorter: (a, b) => a.totalJobs - b.totalJobs,
    },
    {
      title: 'Average Salary (USD)',
      dataIndex: 'averageSalary',
      key: 'averageSalary',
      sorter: (a, b) => a.averageSalary - b.averageSalary,
      render: (value: number) => value.toFixed(2),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="year"
      onRow={(record) => ({
        onClick: () => onRowClick(record.year),
      })}
    />
  );
};

export default MainTable;
