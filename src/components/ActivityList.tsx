
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface Activity {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  userType: string;
  userSubType?: string;
  dmpId?: string;
  offlineTag?: string;
  contentAids: string[];
  durationLimit: string;
  frequencyType: string;
  frequencyValue: string;
  status: '待开始' | '活动中' | '已暂停' | '已下线' | '已完成';
  approvalStatus: '待提交审核' | '审核中' | '审核通过' | '已驳回';
  submittedBy: string;
  createdAt: Date;
}

interface ActivityListProps {
  onCreateNew: () => void;
  onEdit: (activity: Activity) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({ onCreateNew, onEdit }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  // 更新模拟数据 - 根据最新的表单字段结构
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      name: '春节限免活动',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-15'),
      userType: '全部非会员',
      contentAids: ['AID001', 'AID002', 'AID003'],
      durationLimit: 'min [60%稿件时长, 10分钟]',
      frequencyType: 'daily',
      frequencyValue: '3',
      status: '活动中',
      approvalStatus: '审核通过',
      submittedBy: '张三',
      createdAt: new Date('2024-01-20'),
    },
    {
      id: '2',
      name: 'VIP专享限免',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-03-31'),
      userType: 'DMP指定人群包',
      dmpId: 'DMP_12345',
      contentAids: ['AID004', 'AID005'],
      durationLimit: '30分钟',
      frequencyType: 'campaign',
      frequencyValue: '10',
      status: '待开始',
      approvalStatus: '待提交审核',
      submittedBy: '李四',
      createdAt: new Date('2024-02-15'),
    },
    {
      id: '3',
      name: '高价值用户回馈',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-31'),
      userType: '离线人群标签',
      offlineTag: '高价值用户',
      contentAids: ['AID006', 'AID007', 'AID008', 'AID009'],
      durationLimit: 'min [80%稿件时长, 15分钟]',
      frequencyType: 'daily',
      frequencyValue: '5',
      status: '已完成',
      approvalStatus: '审核通过',
      submittedBy: '王五',
      createdAt: new Date('2024-01-10'),
    },
    {
      id: '4',
      name: '新用户体验活动',
      startDate: new Date('2024-03-15'),
      endDate: new Date('2024-03-30'),
      userType: '会员新客',
      userSubType: '新注册用户',
      contentAids: ['AID010', 'AID011'],
      durationLimit: '20分钟',
      frequencyType: 'daily',
      frequencyValue: '2',
      status: '已暂停',
      approvalStatus: '审核中',
      submittedBy: '赵六',
      createdAt: new Date('2024-03-01'),
    },
    {
      id: '5',
      name: '周末特惠活动',
      startDate: new Date('2024-02-10'),
      endDate: new Date('2024-02-25'),
      userType: '全部非会员',
      contentAids: ['AID012', 'AID013', 'AID014'],
      durationLimit: 'min [50%稿件时长, 8分钟]',
      frequencyType: 'campaign',
      frequencyValue: '-1',
      status: '已下线',
      approvalStatus: '已驳回',
      submittedBy: '钱七',
      createdAt: new Date('2024-02-05'),
    },
  ]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      '待开始': { variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800' },
      '活动中': { variant: 'default' as const, color: 'bg-green-100 text-green-800' },
      '已暂停': { variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' },
      '已下线': { variant: 'destructive' as const, color: 'bg-red-100 text-red-800' },
      '已完成': { variant: 'outline' as const, color: 'bg-blue-100 text-blue-800' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant={config.variant} className={config.color}>
        {status}
      </Badge>
    );
  };

  const getApprovalStatusBadge = (approvalStatus: string) => {
    const statusConfig = {
      '待提交审核': { variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800' },
      '审核中': { variant: 'default' as const, color: 'bg-blue-100 text-blue-800' },
      '审核通过': { variant: 'default' as const, color: 'bg-green-100 text-green-800' },
      '已驳回': { variant: 'destructive' as const, color: 'bg-red-100 text-red-800' },
    };
    
    const config = statusConfig[approvalStatus as keyof typeof statusConfig];
    return (
      <Badge variant={config.variant} className={config.color}>
        {approvalStatus}
      </Badge>
    );
  };

  const handleStatusChange = (activityId: string, newStatus: string) => {
    setActivities(activities.map(activity => 
      activity.id === activityId 
        ? { ...activity, status: newStatus as Activity['status'] }
        : activity
    ));
    
    toast({
      title: "状态更新成功",
      description: `活动状态已更新为：${newStatus}`,
    });
  };

  const handleSubmitForApproval = (activityId: string) => {
    setActivities(activities.map(activity => 
      activity.id === activityId 
        ? { ...activity, approvalStatus: '审核中' as Activity['approvalStatus'] }
        : activity
    ));
    
    toast({
      title: "提交成功",
      description: "活动已提交审核",
    });
  };

  const handleViewApprovalDetails = (activityId: string) => {
    toast({
      title: "跳转审核详情",
      description: `查看活动 ${activityId} 的审核详情`,
    });
  };

  const handleDelete = (activityId: string) => {
    setActivities(activities.filter(activity => activity.id !== activityId));
    toast({
      title: "删除成功",
      description: "活动已成功删除",
    });
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || activity.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const ActivityDetailDialog = () => (
    <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>活动详情</DialogTitle>
        </DialogHeader>
        {selectedActivity && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-medium text-sm text-gray-600">活动名称</label>
                <p className="mt-1">{selectedActivity.name}</p>
              </div>
              <div>
                <label className="font-medium text-sm text-gray-600">活动状态</label>
                <div className="mt-1">{getStatusBadge(selectedActivity.status)}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-medium text-sm text-gray-600">审核状态</label>
                <div className="mt-1">{getApprovalStatusBadge(selectedActivity.approvalStatus)}</div>
              </div>
              <div>
                <label className="font-medium text-sm text-gray-600">提交人</label>
                <p className="mt-1">{selectedActivity.submittedBy}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-medium text-sm text-gray-600">开始时间</label>
                <p className="mt-1">{format(selectedActivity.startDate, 'yyyy-MM-dd')}</p>
              </div>
              <div>
                <label className="font-medium text-sm text-gray-600">结束时间</label>
                <p className="mt-1">{format(selectedActivity.endDate, 'yyyy-MM-dd')}</p>
              </div>
            </div>

            <div>
              <label className="font-medium text-sm text-gray-600">用户类型</label>
              <p className="mt-1">
                {selectedActivity.userType}
                {selectedActivity.userSubType && ` - ${selectedActivity.userSubType}`}
                {selectedActivity.dmpId && ` (DMP ID: ${selectedActivity.dmpId})`}
                {selectedActivity.offlineTag && ` - ${selectedActivity.offlineTag}`}
              </p>
            </div>

            <div>
              <label className="font-medium text-sm text-gray-600">限免内容 (共{selectedActivity.contentAids.length}个AID)</label>
              <div className="mt-1 max-h-32 overflow-y-auto border rounded p-2">
                <div className="flex flex-wrap gap-1">
                  {selectedActivity.contentAids.map((aid, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {aid}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-medium text-sm text-gray-600">限免时长</label>
                <p className="mt-1">{selectedActivity.durationLimit}</p>
              </div>
              <div>
                <label className="font-medium text-sm text-gray-600">限免频次</label>
                <p className="mt-1">
                  {selectedActivity.frequencyValue === '-1' ? '不限次数' : `${selectedActivity.frequencyValue} ${selectedActivity.frequencyType === 'daily' ? '次/天' : '次/活动周期内'}`}
                </p>
              </div>
            </div>

            <div>
              <label className="font-medium text-sm text-gray-600">最近更新人</label>
              <p className="mt-1">{selectedActivity.submittedBy}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">会员清晰度限免管理</CardTitle>
            <Button onClick={onCreateNew} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              新建活动
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* 搜索和筛选 */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="搜索活动名称..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="筛选状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="待开始">待开始</SelectItem>
                <SelectItem value="活动中">活动中</SelectItem>
                <SelectItem value="已暂停">已暂停</SelectItem>
                <SelectItem value="已下线">已下线</SelectItem>
                <SelectItem value="已完成">已完成</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 活动列表表格 */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>活动名称</TableHead>
                  <TableHead>活动时间</TableHead>
                  <TableHead>用户类型</TableHead>
                  <TableHead>限免内容</TableHead>
                  <TableHead>限免规则</TableHead>
                  <TableHead>活动状态</TableHead>
                  <TableHead>审核状态</TableHead>
                  <TableHead>提交人</TableHead>
                  <TableHead className="text-center">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.map((activity) => (
                  <TableRow key={activity.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{activity.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{format(activity.startDate, 'yyyy-MM-dd')}</div>
                        <div className="text-gray-500">至 {format(activity.endDate, 'yyyy-MM-dd')}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{activity.userType}</div>
                        {activity.userSubType && <div className="text-gray-500">{activity.userSubType}</div>}
                        {activity.dmpId && <div className="text-gray-500">DMP: {activity.dmpId}</div>}
                        {activity.offlineTag && <div className="text-gray-500">{activity.offlineTag}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <Badge variant="outline">{activity.contentAids.length} 个AID</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{activity.durationLimit}</div>
                        <div className="text-gray-500">
                          {activity.frequencyValue === '-1' ? '不限次数' : `${activity.frequencyValue}${activity.frequencyType === 'daily' ? '次/天' : '次/周期'}`}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(activity.status)}</TableCell>
                    <TableCell>{getApprovalStatusBadge(activity.approvalStatus)}</TableCell>
                    <TableCell>{activity.submittedBy}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 items-center">
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(activity)}
                            className="text-xs px-2 py-1"
                          >
                            编辑
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedActivity(activity)}
                            className="text-xs px-2 py-1"
                          >
                            查看
                          </Button>
                        </div>
                        
                        <div className="flex gap-1">
                          {/* 审核状态相关操作 */}
                          {activity.approvalStatus === '待提交审核' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSubmitForApproval(activity.id)}
                              className="text-xs px-2 py-1"
                            >
                              提交审核
                            </Button>
                          )}
                          {(activity.approvalStatus === '审核中' || activity.approvalStatus === '已驳回') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewApprovalDetails(activity.id)}
                              className="text-xs px-2 py-1"
                            >
                              审核详情
                            </Button>
                          )}

                          {/* 活动状态相关操作 */}
                          {activity.status === '活动中' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(activity.id, '已暂停')}
                              className="text-xs px-2 py-1"
                            >
                              暂停
                            </Button>
                          ) : activity.status === '已暂停' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(activity.id, '活动中')}
                              className="text-xs px-2 py-1"
                            >
                              启动
                            </Button>
                          ) : null}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(activity.id)}
                          className="text-xs px-2 py-1 text-red-500 border-red-200 hover:bg-red-50"
                        >
                          删除
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredActivities.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <div className="text-lg font-medium">暂无活动数据</div>
                <div className="text-sm mt-1">请创建新的活动或调整搜索条件</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ActivityDetailDialog />
    </div>
  );
};

export default ActivityList;
