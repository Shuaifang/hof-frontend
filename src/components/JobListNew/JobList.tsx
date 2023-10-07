import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col } from 'antd';
import JobFilters from './JobFilters';
import JobsTable from './JobsTable';
import { JobRequest, Job, PageInfo } from './types';
import { fetchJobsListData } from '@/utils/api/global';

// 主组件
const JobList: React.FC = () => {
    const [filters, setFilters] = useState<JobRequest>({
        companyName: '',
        limit: '10',
        nation: '',
        noFeedback: '',
        page: '1',
        publishCompany: '',
        targetGroup: '',
        type: '',
    });

    const [jobs, setJobs] = useState<Job[]>([]);

    const [pageInfo, setPageInfo] = useState<PageInfo>({
        count: 0,
        limit: '10',
        page: '1',
    });
    const [loading, setLoading] = useState<boolean>(false);

    const handlePageChange = (newPage: number) => {
        setFilters(prev => ({ ...prev, page: newPage.toString() }));
    };

    // 当API响应返回后，更新`pageInfo`
    const fetchJobsList = async (params: JobRequest) => {
        setLoading(true);
        try {
            const response = await fetchJobsListData(params);
            const fetchedJobs = response.data.data.jobList;
            setJobs(fetchedJobs);
            setPageInfo(response.data.data.pageInfo); // 更新分页信息
        } catch (error) {
            console.error('Failed to fetch jobs', error);
        } finally {
            setLoading(false);
        }
    };

    // 使用useEffect在组件加载和filters变化时调用API
    useEffect(() => {
        fetchJobsList(filters);
    }, [filters]);

    const handleFilterChange = (name: string, value: string[] | string) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleClearFilters = () => {
        setFilters({
            companyName: '',
            limit: '10',
            nation: '',
            noFeedback: '',
            page: '1',
            publishCompany: '',
            targetGroup: '',
            type: '',
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
                <JobsTable
                    // @ts-ignore
                    jobs={jobs}
                    loading={loading}
                    pageInfo={pageInfo}
                    onPageChange={handlePageChange}
                />
            </Col>
        </Row>
    );
};

export default JobList;
