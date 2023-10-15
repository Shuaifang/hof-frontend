import React, { useState, useRef, useEffect } from 'react';
import { Button, Checkbox, Form, Input, Space } from 'antd';
import { JobRequest } from './types';
import { useConfig } from '@/contexts/GlobalContext';

interface JobFiltersProps {
    filters: JobRequest;
    onFilterChange: (name: string, value: any) => void;
    onClearFilters: () => void;
    showCompanyName?: boolean;
    isApply?: boolean;
}

const JobFilters: React.FC<JobFiltersProps> = ({ filters, onFilterChange, onClearFilters, showCompanyName = true, isApply = false }) => {
    const { state: { data: configData } } = useConfig();
    // console.log('filters',filters)
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

    const filterOptions = {
        nation: configData?.nation?.infoList.map(tem => {
            if (tem.key === 'US') tem.name = '🇺🇸 US';
            if (tem.key === 'CA') tem.name = '🇨🇦 CA';
            if (tem.key === 'SG') tem.name = '🇸🇬 SG';
            if (tem.key === 'HK') tem.name = '🇭🇰 HK';
            if (tem.key === 'FR') tem.name = '🇫🇷 FR'; // France
            if (tem.key === 'DE') tem.name = '🇩🇪 DE'; // Germany
            if (tem.key === 'IT') tem.name = '🇮🇹 IT'; // Italy
            if (tem.key === 'ES') tem.name = '🇪🇸 ES'; // Spain
            if (tem.key === 'GB') tem.name = '🇬🇧 GB'; // United Kingdom
            if (tem.key === 'NL') tem.name = '🇳🇱 NL'; // Netherlands
            if (tem.key === 'SE') tem.name = '🇸🇪 SE'; // Sweden
            if (tem.key === 'NO') tem.name = '🇳🇴 NO'; // Norway
            if (tem.key === 'DK') tem.name = '🇩🇰 DK'; // Denmark
            if (tem.key === 'FI') tem.name = '🇫🇮 FI'; // Finland
            if (tem.key === 'PL') tem.name = '🇵🇱 PL'; // Poland
            return tem;
        }) || [],
        type: configData?.type?.infoList || [],
        targetGroup: configData?.target_group?.infoList || [],
        publishCompany: ['Facebook', 'Linkedin', 'Amazon', 'Apple', 'Netflix', 'Google', 'Microsoft'].map(name => ({ name, key: name })),
        noFeedback: [
            { name: 'Closed', key: 'Closed' },
            { name: 'No-Sponsor', key: 'No-Sponsor' },
            { name: 'US Citizen Only', key: 'US Citizen' },
        ],
        status: [
            'Applied',
            'Referred',
            'Recruiter',
            'OA',
            'Phone Interview',
            'Onsite',
            'Offered',
            'Rejected',
        ].map(name => ({ name, key: name }))
    };

    const filterLabels = {
        companyName: '🏠 Company',
        nation: '🌍 Loc',
        type: '🛠️ Role',
        targetGroup: '🧑‍💻 Type',
        publishCompany: '🚀 BigTech',
        noFeedback: '❌ Filtered Tags',
        status: '💡 Status'
    };

    const [localCompanyName, setLocalCompanyName] = useState<string>(filters.companyName || '');
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocalCompanyName(event.target.value);
        // if (timeoutRef.current) {
        //     clearTimeout(timeoutRef.current);
        // }
        // timeoutRef.current = setTimeout(() => {
        //     onFilterChange(event.target.name, event.target.value);
        // }, 500);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [filters]);

    return (
        <Form layout="horizontal" labelCol={{ flex: '120px' }} labelAlign="left">
            {Object.keys(filterOptions).filter(tem => {
                if (isApply) return tem === 'status'
                if (!showCompanyName) return tem !== 'noFeedback' && tem !== 'publishCompany' && tem !== 'status'
                return tem !== 'status'
            }).map(filterName => (
                <Form.Item label={filterLabels[filterName as keyof typeof filterOptions]} key={filterName}>
                    {filterOptions[filterName as keyof typeof filterOptions].map(option => (
                        <Checkbox
                            key={option.key}
                            checked={(filters[filterName as keyof JobRequest] as string[])?.includes(option.key)}
                            onChange={e => handleCheckboxChange(e, filterName)}
                            value={option.key}
                        >
                            {option.name}
                        </Checkbox>
                    ))}
                </Form.Item>
            ))}
            {showCompanyName && (
                <Form.Item label={filterLabels.companyName}>
                    <Space.Compact className='mr-4'>
                        <Input
                            value={localCompanyName}
                            onChange={handleTextFieldChange}
                            name="companyName"
                            className='w-[180px] mr-2'
                            placeholder='Company Name Search'
                        />
                        <Button type="primary" onClick={() => {
                            onFilterChange("companyName", localCompanyName);
                        }}>
                            Search
                        </Button>
                    </Space.Compact>

                    {
                        !isApply && <Button type="primary" onClick={() => {
                            setLocalCompanyName('');
                            onClearFilters()
                        }}>
                            Reset
                        </Button>
                    }
                </Form.Item>
            )}
        </Form>
    );
};

export default JobFilters;
