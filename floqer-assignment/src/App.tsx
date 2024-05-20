import React, { useState, useEffect } from 'react';
import { Layout, Spin, Modal } from 'antd';
import MainTable from './components/MainTable';
import { SalaryData, loadSalaryData } from './utils/dataLoader';
import DetailTable from './components/DetailTable';

const { Header, Content } = Layout;

const App: React.FC = () => {
  const [salaryData, setSalaryData] = useState<SalaryData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadSalaryData();
      setSalaryData(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleRowClick = (year: number) => {
    setIsModalVisible(true);
    setSelectedYear(year);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedYear(null);
  };

  const selectedYearData = salaryData.find((data) => data.year === selectedYear);

  return (
    <Layout>
      <Header>
        <h1 style={{ color: 'white' }}>ML Engineer salaries from 2020 to 2024: Dashboard</h1>
      </Header>
      <Content style={{ padding: '50px', cursor: 'pointer'}}>
        {loading ? (
          <Spin size="large" />
        ) : (
          <>
            <MainTable data={salaryData} onRowClick={handleRowClick} />
          </>
        )}
      </Content>
      <Modal
        title={`Details for ${selectedYear}`}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <DetailTable data={selectedYearData?.jobTitles || null} />
      </Modal>

    </Layout>
  );
};

export default App;
