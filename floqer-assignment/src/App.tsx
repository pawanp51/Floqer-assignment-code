import React, { useState, useEffect } from 'react';
import { Layout, Spin, Modal, Menu } from 'antd';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MainTable from './components/MainTable';
import { SalaryData, loadSalaryData } from './utils/dataLoader';
import DetailTable from './components/DetailTable';
import LineGraph from './components/LineGraph';
import ChatApp from './components/ChatApp';

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
    <Router>
      <Layout>
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Link to="/">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/chat">Chat</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '50px', marginTop: 64 }}>
          <Routes>
            <Route
              path="/"
              element={
                loading ? (
                  <Spin size="large" />
                ) : (
                  <>
                    <MainTable data={salaryData} onRowClick={handleRowClick} />
                    <LineGraph data={salaryData} />
                    <Modal
                      title={`Details for ${selectedYear}`}
                      visible={isModalVisible}
                      onCancel={handleModalClose}
                      footer={null}
                    >
                      <DetailTable data={selectedYearData?.jobTitles || null} />
                    </Modal>
                  </>
                )
              }
            />
            <Route path="/chat" element={<ChatApp />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;
