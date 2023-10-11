import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col } from 'antd';
import JobFilters from './JobFilters';
import JobsTable from './JobsTable';
import { JobRequest, Job, PageInfo } from './types';
import { fetchJobsListData, fetchUserJobsListData } from '@/utils/api/global';
import JobChart from './JobChart';
import OnlineCount from '../Common/OnlineCount';
import { convertKeysToCamelCase } from '@/utils';

// 主组件
const JobList: React.FC = (props: any) => {
    const { isApply, emitData } = props;
    const [filters, setFilters] = useState<JobRequest>({
        companyName: '',
        limit: '10',
        nation: '',
        noFeedback: '',
        page: '1',
        publishCompany: '',
        targetGroup: '',
        type: '',
        status: '',
    });

    const [jobs, setJobs] = useState<Job[]>([]);
    const [chartData, setChartData] = useState([]);

    const [pageInfo, setPageInfo] = useState<PageInfo>({
        count: 0,
        limit: '10',
        page: '1',
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [flag, setFlag] = useState<number>(0);

    const handlePageChange = (newPage: number) => {
        setFilters(prev => ({ ...prev, page: newPage.toString() }));
    };

    // 当API响应返回后，更新`pageInfo`
    const fetchJobsList = async (params: JobRequest) => {
        setLoading(true);
        try {
            console.log('getList', flag)
            let fn = isApply ? fetchUserJobsListData : fetchJobsListData;
            const response = await fn({ ...params, infoId: props.infoId });
            const fetchedJobs = response.data.data.jobList;
            let { selectInfo, jobDateTable, pageInfo } = response.data.data;
            emitData && emitData(response.data.data);
            try {
                if (flag === 0) {
                    if (selectInfo) {
                        let copyFilters = { ...filters }
                        selectInfo = convertKeysToCamelCase(selectInfo);
                        // console.log('selectInfo', selectInfo)
                        for (let key in selectInfo) {
                            if (selectInfo[key]) copyFilters[key] = selectInfo[key];
                        }
                        // console.log('copyFilters', copyFilters)
                        setFilters(copyFilters);
                        return;
                    } else {
                        // console.log('flag+1', flag, flag + 1)
                        setFlag(flag + 1);
                    }
                }
            } catch (error) {
                console.log('err', error)
            }

            setChartData(jobDateTable)
            setJobs(fetchedJobs);
            setPageInfo(pageInfo); // 更新分页信息
        } catch (error) {
            console.error('Failed to fetch jobs', error);
        } finally {
            setLoading(false);
        }
    };

    // 使用useEffect在组件加载和filters变化时调用API
    useEffect(() => {

        if (flag !== 1) {
            fetchJobsList(filters);
        }
        console.log('flag+1 use', flag, flag + 1)
        setFlag(flag + 1);

    }, [filters]);
    // useEffect(() => {
    //     console.log('flag', flag)
    // }, [flag])

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
            status: ''
        });
    };

    const config = {
        data: chartData,
        xField: 'date',
        yField: 'num',
        title: {
            // visible: true,
            text: '所选职位变化趋势',  // 这里是你的标题内容
            // style: {
            //   fontSize: 24,  // 标题字体大小
            //   fontWeight: 'bold',  // 字体加粗
            //   textAlign: 'center',  // 标题居中
            //   fill: '#000',  // 字体颜色
            // },
        },

        point: {
            shape: "round"
        },
        legend: {
            visible: true,
            layout: 'horizontal',
            position: 'right'
        },
        meta: {
            date: {
                alias: '日期',  // x轴的标题
                tickCount: 5,  // 显示的刻度数量
            },
            num: {
                alias: '职位数',  // y轴的标题
                tickCount: 5,  // 显示的刻度数量
            },
        },
        xAxis: {
            label: {
                autoRotate: false,  // 防止标签相互覆盖
                autoHide: false,  // 防止标签自动隐藏
            },
        },
        yAxis: {
            label: {
                autoRotate: false,  // 防止标签相互覆盖
                autoHide: false,  // 防止标签自动隐藏
            },
        },
        smooth: true, // 是否平滑
    };


    return (
        <Row gutter={[16, 16]}>
            {
                flag >= 1 && <Col span={24}>
                    <JobFilters
                        isApply={isApply}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={handleClearFilters}
                    />
                </Col>
            }
            {props.showCahrt && <Col span={24}>
                <div className='w-[80%] ml-[10%]'>
                    <div className='text-center font-bold text-2xl mb-[20px] mt-[20px]'>所选职位变化趋势</div>
                    <div className='my-[10px]'>职位数/日期</div>
                    <JobChart config={config} data={chartData} />
                    <div className='h-[40px]'></div>
                </div>
            </Col>}
            {props.showOnline && <Col span={24}>
                <OnlineCount jobCount={pageInfo.count} />
            </Col>}
            <Col span={24}>
                <JobsTable
                    isApply={isApply}
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
