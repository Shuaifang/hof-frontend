import React from 'react';
import { Table, Popover, Button, message } from 'antd';
import { JobListItem, PageInfo } from './types';  // 确保引入路径正确
import { setApplyJob, setJobFeedback } from '@/utils/api/user';
import Icons from '../Icons';
import { isLoggedIn } from '@/utils';

interface JobsTableProps {
  jobs: JobListItem[];
  pageInfo: PageInfo;
  onPageChange: (page: number) => void;
  loading: boolean;
}
interface JobsTableProps {
  jobs: JobListItem[];
}

const JobsTable: React.FC<JobsTableProps> = ({ jobs, pageInfo, onPageChange, loading }) => {
  const [messageApi, contextHolder] = message.useMessage();


  const switchApply = async (id: any) => {
    let loginstatus = await isLoggedIn();
    if (!loginstatus) {
      messageApi.warning(
        {
          type: 'warning',
          content: '请先登录！',
          style: {
            marginTop: '6vh',
          },
        }
      );
      return;
    }
    await setApplyJob({
      id
    })
    onPageChange(parseInt(pageInfo.page));
    messageApi.open({
      type: 'success',
      content: '职位申请成功！',
      style: {
        marginTop: '6vh',
      },
    });
  }
  const columns = [
    {
      title: '💼 职位名称',
      dataIndex: 'job',
      key: 'job',
    },
    {
      title: '🏢 公司名字',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: '📅 发布日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '📍 地区',
      dataIndex: 'nation',
      key: 'nation',
    },
    {
      title: '👥 岗位类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '📦 职位类型',
      dataIndex: 'target_group',
      key: 'target_group',
    },
    {
      title: '💬 职位反馈',
      dataIndex: 'job_feedback',
      key: 'job_feedback',
      render: (text: string, item: any) => (
        <Popover
          content={(
            <div className='flex flex-col space-y-2'>
              <Button
                size='small'
                style={{
                  backgroundColor: '#6CB57A', // Soft Green
                  color: 'white',
                  borderColor: '#6CB57A' // Slightly darker green for border
                }}
                onClick={() => {
                  feedback(item.id, "无Sponsor")
                }}
              >
                无Sponsor
              </Button>
              <Button
                size='small'
                style={{
                  backgroundColor: '#ff9933', // Soft Yellow
                  color: 'white',
                  borderColor: '#ff9933' // Slightly darker yellow for border
                }}
                onClick={() => {
                  feedback(item.id, "US Citizen")
                }}
              >
                US Citizen
              </Button>
              <Button
                size='small'
                style={{
                  backgroundColor: '#BBBBBB', // Soft Gray
                  color: 'white',
                  borderColor: '#BBBBBB' // Slightly darker gray for border
                }}
                onClick={() => {
                  feedback(item.id, "职位失效")
                }}
              >
                职位失效
              </Button>
            </div>
          )}
          title=""
        >
          <Button type='link'>职位反馈</Button>
        </Popover>
      )
    },
    {
      title: '💬 职位反馈',
      dataIndex: 'job_feedback',
      key: 'job_feedback',
      render: (text: string, item: any) => {
        return (
          <div className='text-center'>
            <Button size='small' onClick={() => {
              switchApply(item.id)
            }} type={item.is_apply === 1 ? 'primary' : 'default'} icon={<Icons.Check size={16} style={{ marginTop: 3 }} />}></Button>
          </div>

        )
      }
    }
  ];


  const feedback = async (id: number, content: string) => {
    await setJobFeedback({
      id, content
    })
    messageApi.open({
      type: 'success',
      content: '反馈成功，感谢您的反馈！',
      style: {
        marginTop: '6vh',
      },
    });

  }
  return (
    <>
      {contextHolder}
      <Table
        loading={loading}
        dataSource={jobs}
        columns={columns}
        rowKey="id"
        pagination={{
          current: parseInt(pageInfo.page, 10),
          pageSize: parseInt(pageInfo.limit, 10),
          total: pageInfo.count,
          onChange: onPageChange,
        }}
      />
    </>

  );
};

export default JobsTable;
