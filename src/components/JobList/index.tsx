import React, { useState, useEffect, useCallback, useRef } from 'react';
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
    const isFirstRender = useRef(false);

    // console.log('infoId', props.infoId)
    const { isApply, emitData } = props;
    const [filters, setFilters] = useState<JobRequest>({
        companyName: '',
        limit: '20',
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

    const [sortOrder, setSortOrder] = useState<{ field: string, order: 'ascend' | 'descend' | null }>({ field: 'company_name', order: null });

    const handleSort = (field: string, order: 'ascend' | 'descend' | null) => {
        setSortOrder({ field, order });

        fetchJobsList(filters);
    };

    const [pageInfo, setPageInfo] = useState<PageInfo>({
        count: 0,
        limit: '20',
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
            // console.log('get',props.infoId)
            let fn = isApply ? fetchUserJobsListData : fetchJobsListData;
            const response = await fn({ ...params, sortType: sortOrder.field, sortOrder: sortOrder.order });
            const fetchedJobs = response.data.data.jobList;
            let { selectInfo, jobDateTable, pageInfo } = response.data.data;
            emitData && emitData(response.data.data);
            try {

                if (selectInfo && params.infoId) {
                    let copyFilters = { ...filters }
                    selectInfo = convertKeysToCamelCase(selectInfo);
                    for (let key in selectInfo) {
                        if (selectInfo[key]) copyFilters[key] = selectInfo[key];
                    }
                    // isFirstRender.current = true;
                    // console.log('setFilters',setFilters)
                    setFilters(copyFilters);
                } else {
                    setFlag(flag + 1);
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


    useEffect(() => {
        // handleClearFilters();
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        props.infoId && fetchJobsList({ infoId: props.infoId })
    }, [props.infoId])
    useEffect(() => {
        if (isFirstRender.current) {
            return;
        }
        // if (flag !== 1) {
        fetchJobsList(filters);
        // }
        // console.log('flag+1 use', flag, flag + 1)
        setFlag(flag + 1);

    }, [filters]);


    const handleFilterChange = (name: string, value: string[] | string) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleClearFilters = () => {
        setFilters({
            companyName: '',
            limit: '20',
            nation: '',
            noFeedback: '',
            page: '1',
            publishCompany: '',
            targetGroup: '',
            type: '',
            status: '',
        });
    };

    const config = {
        data: chartData,
        xField: 'date',
        yField: 'num',
        title: {
            // visible: true,
            text: 'Job Category Trend',  // 这里是你的标题内容
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
                alias: 'Date',  // x轴的标题
                tickCount: 5,  // 显示的刻度数量
            },
            num: {
                alias: 'Job Count',  // y轴的标题
                tickCount: 5,  // 显示的刻度数量
            },
        },
        xAxis: {
            label: {
                autoRotate: false,  // 防止标签相互覆盖
                autoHide: false,  // 防止标签自动隐藏
                style: {
                    fontSize: 14,
                },
            },

        },
        yAxis: {
            label: {
                autoRotate: false,  // 防止标签相互覆盖
                autoHide: false,  // 防止标签自动隐藏
                style: {
                    fontSize: 14,
                },
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
                    <div className='text-center font-bold text-2xl mb-[20px] mt-[20px]'>Job Category Trend</div>
                    <div className='my-[10px]'>Job Count / Date</div>
                    <JobChart config={config} data={chartData} />
                    <div className='h-[20px]'></div>
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
                    setJobs={setJobs}
                    onSort={handleSort}
                    sortOrder={sortOrder}
                />
            </Col>
        </Row>
    );
};

export default JobList;
