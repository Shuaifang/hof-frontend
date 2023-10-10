// @ts-nocheck
import React from 'react';
import { Table, Popover, Button, message, Dropdown, Tag, DatePicker } from 'antd';
import type { MenuProps } from 'antd';
import type { DatePickerProps } from 'antd';


import { JobListItem, PageInfo } from './types';  // 确保引入路径正确
import { setApplyJob, setJobFeedback, setUserJobStatus } from '@/utils/api/user';
import Icons from '../Icons';
import { isLoggedIn } from '@/utils';
import dayjs from 'dayjs';

interface JobsTableProps {
  jobs: JobListItem[];
  pageInfo: PageInfo;
  onPageChange: (page: number) => void;
  loading: boolean;
  isApply: boolean;
}
interface JobsTableProps {
  jobs: JobListItem[];
}

const JobsTable: React.FC<JobsTableProps> = ({ jobs, pageInfo, onPageChange, loading, isApply = false }) => {
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
  const statusOptions: MenuProps['items'] = [
    'Applied',
    'Referred',
    'Recruiter',
    'OA',
    'Phone Interview',
    'Onsite',
    'Offered',
    'Rejecte',
  ].map(label => ({ label, key: label }))


  const updateApplyStatue = async (data: any) => {
    await setUserJobStatus(data)
    messageApi.open({
      type: 'success',
      content: '职位状态修改成功！',
      style: {
        marginTop: '6vh',
      },
    });
    onPageChange(parseInt(pageInfo.page));

  }
  const columns = [
    {
      title: '💼 职位名称',
      dataIndex: 'job',
      key: 'job',
      render: (text: string, item: any) => {
        item.job_feedback = item.job_feedback || []
        return (
          <>
            <Button type='link' href={item.job_link} target='_blank'>{text}</Button>
            {
              item.job_feedback.length &&
              <>
                <br />
                <div className='inline mr-[15px]'></div>
                {item.job_feedback.includes('无Sponsor') && <Tag color='#6CB57A'>无Sponsor</Tag>}
                {item.job_feedback.includes('US Citizen') && <Tag color='#ff9933'>US Citizen</Tag>}
                {item.job_feedback.includes('职位失效') && <Tag color='#BBBBBB'>职位失效</Tag>}
              </>
            }
          </>
        )
      }
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
      title: '🎯 职位申请',
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

  const isApplyColumns = [
    {
      title: '💼 职位名称',
      dataIndex: 'job',
      key: 'job',
      render: (text: string, item: any) => {
        return (
          <>
            <a href={item.job_link} target='_blank'>{text}</a>
          </>
        )
      }
      // job_feedback
    },
    {
      title: '🏢 公司名字',
      dataIndex: 'company',
      key: 'company',
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
      title: '📅 日期',
      dataIndex: 'date',
      key: 'date',
      render: (text: string, item: any) => {
        return (
          <DatePicker format="" defaultValue={dayjs(text, 'YYYY-MM-DD')} onChange={e => {
            updateApplyStatue({ id: item.id, type: 'date', content: e?.format("YYYY-MM-DD") })
          }} />
        )
      }
    },
    {
      title: '💡 状态',
      dataIndex: 'status',
      key: 'status',
      render: (text: string, item: any) => {
        return (
          <Dropdown menu={{
            items: statusOptions, onClick: e => {
              updateApplyStatue({ id: item.id, type: 'apply_statusc', ontent: e.key })
            }
          }}>
            <Button type='default' className='w-[140px]'>
              {text}
            </Button>
          </Dropdown>

        )
      }
    },
  ]

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
        columns={isApply ? isApplyColumns : columns}
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
