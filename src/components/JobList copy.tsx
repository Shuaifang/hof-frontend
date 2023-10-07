// JobList.tsx
'use client';
import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, Table, Row, Col, Popover, Menu } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import Icons from './Icons';
import { useConfig } from '@/contexts/GlobalContext';  // 确保路径正确

interface Job {
    id: string;
    title: string;
    company: string;
    date: string;
    location: string;
    jobType: string;
    positionType: string;
    feedback: string;
}

interface Filters {
    region: string[];
    jobType: string[];
    positionType: string[];
    companyType: string[];
    companyName: string;
}

type FilterOption = {
    key: string;
    name: string;
};

type FilterKey = keyof Filters;

const JobFilters: React.FC<{
    filters: Filters;
    onFilterChange: (name: string, value: any) => void;
    onClearFilters: () => void;
}> = ({ filters, onFilterChange, onClearFilters }) => {
    const { state: { data: configData } } = useConfig();

    const filterOptions: Record<FilterKey, FilterOption[]> = {
        region: configData?.nation?.infoList || [],
        jobType: configData?.type?.infoList || [],
        positionType: configData?.target_group?.infoList || [],
        companyType: [],
        companyName: [],
    };

    const filterLabels: Record<FilterKey, string> = {
        region: '🌍 地区',
        jobType: '🛠️ 工作类型',
        positionType: '🧑‍💼 职位类型',
        companyType: '🏷️ 公司类型',
        companyName: '🏢 公司名称',
    };

    const handleCheckboxChange = (event: CheckboxChangeEvent, name: FilterKey) => {
        const value = event.target.value.key;
        const currentValues = filters[name];
        let newValues;
        if (event.target.checked) {
            newValues = [...currentValues, value];
        } else {
            if (typeof currentValues !== 'string') {
                newValues = currentValues.filter((item: any) => item !== value);
            } else {
                newValues = currentValues
            }

        }
        onFilterChange(name, newValues);
    };

    const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange(event.target.name, event.target.value);
    };

    return (
        <Form layout="horizontal" labelCol={{ flex: '110px' }} labelAlign="left">
            {Object.keys(filterOptions).map((filterName) => (
                <Form.Item label={filterLabels[filterName as FilterKey]} key={filterName}>
                    {filterOptions[filterName as FilterKey].map((option) => (
                        <Checkbox
                            key={option.key}
                            checked={filters[filterName as FilterKey].includes(option.key)}
                            onChange={(e) => handleCheckboxChange(e, filterName as FilterKey)}
                            value={option}
                        >
                            {option.name}
                        </Checkbox>
                    ))}
                </Form.Item>
            ))}
            <Form.Item label={filterLabels['companyName']}>
                <Input
                    value={filters['companyName']}
                    onChange={handleTextFieldChange}
                    name="companyName"
                    className='w-[180px] mr-2'
                    placeholder='请输入公司名称搜索'
                />
                <Button type="primary" onClick={onClearFilters} className='mr-2'>
                    搜索
                </Button>
                <Button type="primary" onClick={onClearFilters}>
                    清空筛选
                </Button>
            </Form.Item>
        </Form>
    );
};

const JobsTable: React.FC<{ jobs: Job[] }> = ({ jobs }) => {
    const columns = [
        {
            title: '💼 职位名称',
            dataIndex: 'title',
            key: 'title'
        },
        {
            title: '🏢 公司名字',
            dataIndex: 'company',
            key: 'company'
        },
        {
            title: '📅 发布日期',
            dataIndex: 'date',
            key: 'date'
        },
        {
            title: '📍 地区',
            dataIndex: 'location',
            key: 'location'
        },
        {
            title: '👥 岗位类型',
            dataIndex: 'jobType',
            key: 'jobType'
        },
        {
            title: '📦 职位类型',
            dataIndex: 'positionType',
            key: 'positionType'
        },
        {
            title: '💬 职位反馈',
            dataIndex: 'feedback',
            key: 'feedback',
            render: (text: string, record: Job) => (
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
                            >
                                职位失效
                            </Button>
                        </div>
                    )}
                    title=""
                >
                    <Button type='link'>{text}</Button>
                </Popover>
            )
        },
    ];

    return (
        <Table dataSource={jobs} columns={columns} rowKey="id" />
    );
};

const JobList: React.FC = () => {
    const [filters, setFilters] = useState<Filters>({
        region: [],
        jobType: [],
        positionType: [],
        companyType: [],
        companyName: '',
    });

    const mockJobsData: Job[] = [
        {
            id: '1',
            title: "Software Engineering Intern",
            company: "Carrier",
            date: "2023-10-01",
            location: "美国",
            jobType: "SDE",
            positionType: "Intern",
            feedback: "职位反馈",
        },
        // ...其他职位数据
    ];

    const filteredJobs = mockJobsData.filter(job => {
        let isMatch = true;
        //...你的filter逻辑
        return isMatch;
    });

    const handleFilterChange = (name: string, value: string[] | string) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleClearFilters = () => {
        setFilters({
            region: [],
            jobType: [],
            positionType: [],
            companyType: [],
            companyName: '',
        });
    };

    return (
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <JobFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                />
            </Col>
            <Col span={24}>
                <JobsTable jobs={filteredJobs} />
            </Col>
        </Row>
    );
};

export default JobList;
