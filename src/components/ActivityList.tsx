
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Edit, Pause, Play, Eye, Trash2 } from "lucide-react";
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
  lastUpdatedBy: string;
  createdAt: Date;
}

interface ActivityListProps {
  onCreateNew: () => void;
  onEdit: (activity: Activity) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({ onCreateNew, onEdit }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  // 模拟数据
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      name: '春节限免活动',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-15'),
      userType: '全部用户',
      userSubType: '会员新客',
      contentAids: ['AID001', 'AID002', 'AID003'],
      durationLimit: '30',
      frequencyType: 'daily',
      frequencyValue: '3',
      status: '活动中',
      lastUpdatedBy: '张三',
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
      durationLimit: '60',
      frequencyType: 'campaign',
      frequencyValue: '10',
      status: '待开始',
      lastUpdatedBy: '李四',
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
      durationLimit: '45',
      frequencyType: 'daily',
      frequencyValue: '5',
      status: '已完成',
      lastUpdatedBy: '王五',
      createdAt: new Date('2024-01-10'),
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

  const handleDelete = (activityId: string) => {
    setActivities(activities.filter(activity => activity.id !== activityId));
    toast({
      title: "删除成功",
      description: "活动已成功删除",
    });
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || activity.status === statusFilter;
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
                <p className="mt-1">{selectedActivity.durationLimit} 分钟</p>
              </div>
              <div>
                <label className="font-medium text-sm text-gray-600">限免频次</label>
                <p className="mt-1">
                  {selectedActivity.frequencyValue} {selectedActivity.frequencyType === 'daily' ? '次/天' : '次/活动周期内'}
                </p>
              </div>
            </div>

            <div>
              <label className="font-medium text-sm text-gray-600">最近更新人</label>
              <p className="mt-1">{selectedActivity.lastUpdatedBy}</p>
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
            <CardTitle className="text-2xl font-bold">清晰度限免活动管理</CardTitle>
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
                <SelectItem value="">全部状态</SelectItem>
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
                  <TableHead>状态</TableHead>
                  <TableHead>最近更新人</TableHead>
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
                        <div>{activity.durationLimit}分钟</div>
                        <div className="text-gray-500">
                          {activity.frequencyValue}{activity.frequencyType === 'daily' ? '次/天' : '次/周期'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(activity.status)}</TableCell>
                    <TableCell>{activity.lastUpdatedBy}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(activity)}
                          className="h-8 w-8 p-0 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedActivity(activity)}
                          className="h-8 w-8 p-0 hover:bg-green-50"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {activity.status === '活动中' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(activity.id, '已暂停')}
                            className="h-8 w-8 p-0 hover:bg-yellow-50"
                          >
                            <Pause className="h-4 w-4" />
                          </Button>
                        ) : activity.status === '已暂停' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(activity.id, '活动中')}
                            className="h-8 w-8 p-0 hover:bg-green-50"
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        ) : null}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(activity.id)}
                          className="h-8 w-8 p-0 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
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
