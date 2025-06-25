
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityConfigForm from '@/components/ActivityConfigForm';

const ActivityConfig = () => {
  const navigate = useNavigate();

  const handleSave = (config: any) => {
    console.log('保存活动配置:', config);
    // 这里可以添加保存到后端的逻辑
    setTimeout(() => {
      navigate('/activity-management');
    }, 1000);
  };

  const handleCancel = () => {
    navigate('/activity-management');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ActivityConfigForm onSave={handleSave} onCancel={handleCancel} />
    </div>
  );
};

export default ActivityConfig;
