// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Modal, Button, notification } from 'antd';
import JobFilters from './JobFilters';
import { JobRequest } from './types';
import { getUserAlert, setUserAlert } from '@/utils/api/user';

interface SubscriptionModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isVisible, onClose }) => {
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

    // 获取用户当前订阅情况的API请求
    const fetchUserSubscriptions = async () => {
        try {
            const response = await getUserAlert(null);
            console.log('response', response)
            // 更新 filters 状态
            setFilters(prev => ({
                ...prev,
                nation: response.data.nation.map((n: any) => n.name),
                type: response.data.type.map((t: any) => t.name),
                targetGroup: response.data.target_group.map((tg: any) => tg.name),
            }));
        } catch (error) {
            console.error('订阅失败', error);
        }
    };

    // 提交订阅信息的接口的请求
    const submitSubscription = async (subscriptionData: any) => {
        try {
            await setUserAlert(subscriptionData);
            notification.success({
                message: '订阅已更新',
                description: '当您订阅的职位有更新时你将收到推送邮件!',
            });
            onClose();
        } catch (error) {
            console.error('Failed to update subscription', error);
            notification.error({
                message: 'Update Failed',
                description: 'Failed to update your job subscription. Please try again later.',
            });
        }
    };

    const handleFilterChange = (name: string, value: any) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveSubscription = () => {

        const subscriptionData = {
            is_send: '1', // Assuming you want to set this as true

            nation: filters.nation.join(','),
            target_group: filters.targetGroup.join(','),
            type: filters.type.join(','),
        };
        submitSubscription(subscriptionData);
    };

    useEffect(() => {
        if (isVisible) {
            fetchUserSubscriptions();
        }
    }, [isVisible]);

    return (
        <Modal
            title="订阅职位"
            visible={isVisible}
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose}>
                    取消
                </Button>,
                <Button key="submit" type="primary" onClick={handleSaveSubscription}>
                    保存变更
                </Button>,
            ]}
        >
            <span className='my-[5px]'>当您勾选了任意选项后，您的登录邮箱将会在订阅内容更新时收到相关推送</span>
            <JobFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={() => setFilters({
                    companyName: '',
                    limit: '10',
                    nation: '',
                    noFeedback: '',
                    page: '1',
                    publishCompany: '',
                    targetGroup: '',
                    type: '',
                })}
                showCompanyName={false}
            />
        </Modal>
    );
};

export default SubscriptionModal;