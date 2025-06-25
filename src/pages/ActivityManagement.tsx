
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityList from '@/components/ActivityList';
import ActivityConfigForm from '@/components/ActivityConfigForm';

const ActivityManagement = () => {
  const navigate = useNavigate();
  const [editingActivity, setEditingActivity] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const handleCreateNew = () => {
    navigate('/activity-config');
  };

  const handleEdit = (activity: any) => {
    setEditingActivity(activity);
    setShowEditForm(true);
  };

  const handleSaveEdit = (config: any) => {
    console.log('编辑活动配置:', config);
    // 这里可以添加保存编辑到后端的逻辑
    setShowEditForm(false);
    setEditingActivity(null);
  };

  if (showEditForm && editingActivity) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          <button
            onClick={() => setShowEditForm(false)}
            className="mb-4 text-blue-600 hover:text-blue-800"
          >
            ← 返回列表
          </button>
        </div>
        <ActivityConfigForm
          onSave={handleSaveEdit}
          initialData={editingActivity}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ActivityList
        onCreateNew={handleCreateNew}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default ActivityManagement;
