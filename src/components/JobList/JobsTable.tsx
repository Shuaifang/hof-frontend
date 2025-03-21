// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Table, Popover, Button, message, Dropdown, Tag, DatePicker, notification } from 'antd';
import type { MenuProps } from 'antd';
import type { DatePickerProps } from 'antd';


import { JobListItem, PageInfo } from './types';  // 确保引入路径正确
import { setApplyJob, setJobFeedback, setUserJobStatus } from '@/utils/api/user';
import Icons from '../Common/Icons';
import { isLoggedIn } from '@/utils';
import dayjs from 'dayjs';

interface JobsTableProps {
  jobs: JobListItem[];
  pageInfo: PageInfo;
  onPageChange: (page: number) => void;
  loading: boolean;
  isApply: boolean;
  setJobs?: any;
  onSort: (field: string, order: 'ascend' | 'descend' | null) => void; // 添加这一行
  sortOrder: { field: string, order: 'ascend' | 'descend' | null }; // 添加这一行
}
interface JobsTableProps {
  jobs: JobListItem[];
}

const JobsTable: React.FC<JobsTableProps> = ({ jobs, pageInfo, onPageChange, loading, isApply = false, setJobs, onSort, sortOrder }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loginstatus, setLoginStatus] = useState(false);

  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter && sorter.columnKey && sorter.order) {
      onSort(sorter.columnKey, sorter.order);
    }
  };

  useEffect(() => {
    isLoggedIn().then(loginRes => {
      setLoginStatus(loginRes);
    })

  }, [])

  const switchApply = async (id: any) => {
    if (!loginstatus) {
      notification.warning({
        message: 'Please login',
        description: 'To access this feature, please log in. Your dream job is just a few clicks away! ',
      });
      return;
    }
    setJobs(jobs.map(tem => {
      if (tem.id === id) {
        tem.is_apply = 1;
      }
      return tem;
    }))
    await setApplyJob({
      id
    })
    // onPageChange(parseInt(pageInfo.page));
    messageApi.open({
      type: 'success',
      content: 'Apply successful！',
      style: {
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
    'Reject',
  ].map(label => ({ label, key: label }))


  const updateApplyStatue = async (data: any) => {
    if (!loginstatus) {
      notification.warning({
        message: 'Please login',
        description: 'To access this feature, please log in. Your dream job is just a few clicks away! ',
      });
      return;
    }
    await setUserJobStatus(data)
    messageApi.open({
      type: 'success',
      content: 'Updated job status!',
      style: {
      },
    });
    onPageChange(parseInt(pageInfo.page));

  }
  const columns = [
    {
      title: '💼 Job (Click to apply)',
      dataIndex: 'job',
      key: 'job',
      render: (text: string, item: any) => {
        item.job_feedback = item.job_feedback || []
        return (
          <>
            <a className='block truncate text-left text-[#1677ff]' style={{
              maxWidth: '300px'
            }} type='link' href={item.job_link} target='_blank'>
              <span >{text}</span>
            </a>
            {
              item.job_feedback.length ?
                <>
                  {/* <div className='inline mr-[15px]'></div> */}
                  {item.job_feedback.includes('No-Sponsor') && <Tag color='#6CB57A'>No-Sponsor</Tag>}
                  {item.job_feedback.includes('US Citizen') && <Tag color='#ff9933'>US Citizen</Tag>}
                  {item.job_feedback.includes('Closed') && <Tag color='#BBBBBB'>Closed</Tag>}
                </>
                : ''
            }
          </>
        )
      }
    },
    {
      title: '🏢 Company  ',
      dataIndex: 'company',
      key: 'company',
      sorter: true,
      sortOrder: sortOrder.field === 'company' ? sortOrder.order : null,
      render: (text: string, item: any) => {
        return <div className='w-[128px] truncate text-left'>{text}</div>
      }
    },
    {
      title: '📅 Date',
      dataIndex: 'date',
      key: 'date',
      sorter: true,
      sortOrder: sortOrder.field === 'date' ? sortOrder.order : null,
    },
    {
      title: '📍 Loc',
      dataIndex: 'nation',
      key: 'nation',
    },
    {
      title: '👥 Role',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '📦 Type',
      dataIndex: 'target_group',
      key: 'target_group',
    },
    {
      title: '💬 Job Info    Feedback',
      dataIndex: 'job_feedback',
      width: 120,
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
                  feedback(item.id, "No-Sponsor")
                }}
              >
                No-Sponsor
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
                  feedback(item.id, "Closed")
                }}
              >
                Closed
              </Button>
            </div>
          )}
          title=""
        >
          <Button type='link'>Add #Tag</Button>
        </Popover>
      )
    },
    {
      title: '🎯 Applied',
      dataIndex: 'job_feedback',
      key: 'job_feedback',
      render: (text: string, item: any) => {
        return (
          <div className='text-center'>
            {
              item.is_apply === 1 ?
                <Button size='small' className='w-[24px] h-[24px]' type="primary" icon={<Icons.Check size={16} style={{ marginTop: 3 }} />}></Button>
                :
                <Button size='small' className='w-[24px] h-[24px]' onClick={() => {
                  switchApply(item.id)
                }} type="default"></Button>
            }

          </div>

        )
      }
    }
  ];

  const isApplyColumns = [
    {
      title: '💼 Job (Click to apply)',
      dataIndex: 'job',
      key: 'job',
      render: (text: string, item: any) => {
        item.job_feedback = item.job_feedback || []
        return (
          <>
            <a className='block truncate text-left text-[#1677ff]' style={{
              maxWidth: '300px'
            }} type='link' href={item.job_link} target='_blank'>
              <span >{text}</span>
            </a>
            {
              item.job_feedback.length ?
                <>
                  {/* <div className='inline mr-[15px]'></div> */}
                  {item.job_feedback.includes('No-Sponsor') && <Tag color='#6CB57A'>No-Sponsor</Tag>}
                  {item.job_feedback.includes('US Citizen') && <Tag color='#ff9933'>US Citizen</Tag>}
                  {item.job_feedback.includes('Closed') && <Tag color='#BBBBBB'>Closed</Tag>}
                </>
                : ''
            }
          </>
        )
      }
    },
    {
      title: '🏢 Company  ',
      dataIndex: 'company',
      key: 'company',
      sorter: true,
      sortOrder: sortOrder.field === 'company' ? sortOrder.order : null,
      render: (text: string, item: any) => {
        return <div className='w-[128px] truncate text-left'>{text}</div>
      }
    },
    {
      title: '📍 Loc',
      dataIndex: 'nation',
      key: 'nation',
    },
    {
      title: '👥 Role',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '📦 Type',
      dataIndex: 'target_group',
      key: 'target_group',
    },
    {
      title: '📅 Date',
      dataIndex: 'date',
      key: 'date',
      sorter: true,
      sortOrder: sortOrder.field === 'date' ? sortOrder.order : null,
      render: (text: string, item: any) => {
        return (
          <DatePicker format="" defaultValue={dayjs(text, 'YYYY-MM-DD')} onChange={e => {
            updateApplyStatue({ id: item.id, type: 'date', content: e?.format("YYYY-MM-DD") })
          }} />
        )
      }
    },
    {
      title: '💡 Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string, item: any) => {
        return (
          <Dropdown menu={{
            items: statusOptions, onClick: e => {
              updateApplyStatue({ id: item.id, type: 'apply_status', content: e.key })
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
      content: 'Feedback Received, Thank You!',
      style: {
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
        onChange={handleTableChange} // 添加这一行
      />
    </>

  );
};

export default JobsTable;
