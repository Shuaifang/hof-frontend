import React, { useState, useRef, useEffect } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { JobRequest } from './types';
import { useConfig } from '@/contexts/GlobalContext';  // 确保路径正确

interface JobFiltersProps {
    filters: JobRequest;
    onFilterChange: (name: string, value: any) => void;
    onClearFilters: () => void;
}

const JobFilters: React.FC<JobFiltersProps> = ({ filters, onFilterChange, onClearFilters }) => {
    const { state: { data: configData } } = useConfig();

    const handleCheckboxChange = (event: any, name: string) => {
        const value = event.target.value;
        const currentValues = filters[name as keyof JobRequest] as string[];
        let newValues: string[];
        if (event.target.checked) {
            newValues = [...currentValues, value];
        } else {
            newValues = currentValues.filter(item => item !== value);
        }
        onFilterChange(name, newValues);
    };

    // const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     onFilterChange(event.target.name, event.target.value);
    // };

    // 配置你的筛选选项，这里你可能需要根据实际情况调整选项值
    const filterOptions = {
        nation: configData?.nation?.infoList || [],
        type: configData?.type?.infoList || [],
        targetGroup: configData?.target_group?.infoList || [],
        publishCompany: ['Facebook', 'Linkedin', 'Amazon', 'Apple', 'Netflix', 'Google', 'Microsoft'].map(name => ({ name, key: name })),
    };

    const filterLabels = {
        companyName: '🏢 公司名称',
        nation: '🌍 地区',
        type: '🛠️ 工作类型',
        targetGroup: '🧑‍💼 职位类型',
        publishCompany: '🏷️ 公司类型',
    };

    const [localCompanyName, setLocalCompanyName] = useState<string>(filters.companyName || '');

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocalCompanyName(event.target.value);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            onFilterChange(event.target.name, event.target.value);
        }, 500);
    };

    // 在组件卸载或者其他filter变化时清除定时器
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [filters]);

    return (
        <Form layout="horizontal" labelCol={{ flex: '110px' }} labelAlign="left">
            {Object.keys(filterOptions).map(filterName => (
                <Form.Item label={filterLabels[filterName as keyof typeof filterOptions]} key={filterName}>
                    {filterOptions[filterName as keyof typeof filterOptions].map(option => (
                        <Checkbox
                            key={option.key}
                            checked={(filters[filterName as keyof JobRequest] as string[]).includes(option.key)}
                            onChange={e => handleCheckboxChange(e, filterName)}
                            value={option.key}
                        >
                            {option.name}
                        </Checkbox>
                    ))}
                </Form.Item>
            ))}
            <Form.Item label={filterLabels.companyName}>
                <Input
                    value={localCompanyName}  // 使用本地状态
                    onChange={handleTextFieldChange}
                    name="companyName"
                    className='w-[180px] mr-2'
                    placeholder='请输入公司名称搜索'
                />
                {/* <Button type="primary" onClick={onClearFilters} className='mr-2'>
                    搜索
                </Button> */}
                <Button type="primary" onClick={()=>{
                    setLocalCompanyName('');
                    onClearFilters()
                }}>
                    重置筛选
                </Button>
            </Form.Item>
        </Form>
    );
};

export default JobFilters;
