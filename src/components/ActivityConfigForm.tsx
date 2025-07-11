import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarIcon, Upload, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ActivityConfig {
  name: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  userType: string;
  userSubType: string;
  dmpId: string;
  offlineTag: string;
  userBlacklist: string[];
  contentAids: string[];
  durationLimitType: string; // 'minutes' | 'percentage'
  durationLimitValue: string;
  frequencyType: string;
  frequencyValue: string;
}

interface ActivityConfigFormProps {
  onSave: (config: ActivityConfig) => void;
  onCancel?: () => void;
  initialData?: Partial<ActivityConfig>;
}

const ActivityConfigForm: React.FC<ActivityConfigFormProps> = ({ onSave, onCancel, initialData }) => {
  const { toast } = useToast();
  
  const [config, setConfig] = useState<ActivityConfig>({
    name: initialData?.name || '',
    startDate: initialData?.startDate,
    endDate: initialData?.endDate,
    userType: initialData?.userType || '',
    userSubType: initialData?.userSubType || '',
    dmpId: initialData?.dmpId || '',
    offlineTag: initialData?.offlineTag || '',
    userBlacklist: initialData?.userBlacklist || [],
    contentAids: initialData?.contentAids || [],
    durationLimitType: initialData?.durationLimitType || 'percentage',
    durationLimitValue: initialData?.durationLimitValue || 'min [60%稿件时长, 10分钟]',
    frequencyType: initialData?.frequencyType || 'daily',
    frequencyValue: initialData?.frequencyValue || '',
  });

  const [newAid, setNewAid] = useState('');
  const [bulkAids, setBulkAids] = useState('');
  const [newUid, setNewUid] = useState('');
  const [bulkUids, setBulkUids] = useState('');

  const userSubTypeOptions = {
    '全部非会员': [],
    'DMP指定人群包': [],
    '离线人群标签': ['高价值用户', '活跃用户', '流失用户', '新注册用户', '付费用户']
  };

  const handleSave = () => {
    if (!config.name || !config.startDate || !config.endDate || !config.userType) {
      toast({
        title: "验证失败",
        description: "请填写所有必填字段",
        variant: "destructive",
      });
      return;
    }

    if (config.contentAids.length === 0) {
      toast({
        title: "验证失败", 
        description: "请至少添加一个AID",
        variant: "destructive",
      });
      return;
    }

    onSave(config);
    toast({
      title: "保存成功",
      description: "活动配置已保存",
    });
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const addSingleAid = () => {
    if (newAid.trim() && !config.contentAids.includes(newAid.trim())) {
      setConfig({
        ...config,
        contentAids: [...config.contentAids, newAid.trim()]
      });
      setNewAid('');
    }
  };

  const addBulkAids = () => {
    const aids = bulkAids.split('\n').map(aid => aid.trim()).filter(aid => aid && !config.contentAids.includes(aid));
    setConfig({
      ...config,
      contentAids: [...config.contentAids, ...aids]
    });
    setBulkAids('');
  };

  const removeAid = (aidToRemove: string) => {
    setConfig({
      ...config,
      contentAids: config.contentAids.filter(aid => aid !== aidToRemove)
    });
  };

  const addSingleUid = () => {
    if (newUid.trim() && !config.userBlacklist.includes(newUid.trim())) {
      setConfig({
        ...config,
        userBlacklist: [...config.userBlacklist, newUid.trim()]
      });
      setNewUid('');
    }
  };

  const addBulkUids = () => {
    const uids = bulkUids.split('\n').map(uid => uid.trim()).filter(uid => uid && !config.userBlacklist.includes(uid));
    setConfig({
      ...config,
      userBlacklist: [...config.userBlacklist, ...uids]
    });
    setBulkUids('');
  };

  const removeUid = (uidToRemove: string) => {
    setConfig({
      ...config,
      userBlacklist: config.userBlacklist.filter(uid => uid !== uidToRemove)
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">清晰度限免活动配置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 活动名称 */}
          <div className="space-y-2">
            <Label htmlFor="activityName">活动名称 *</Label>
            <Input
              id="activityName"
              value={config.name}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
              placeholder="请输入活动名称"
            />
          </div>

          {/* 活动时间 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>活动开始时间 *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !config.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {config.startDate ? format(config.startDate, "PPP") : "选择开始时间"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={config.startDate}
                    onSelect={(date) => setConfig({ ...config, startDate: date })}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>活动结束时间 *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !config.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {config.endDate ? format(config.endDate, "PPP") : "选择结束时间"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={config.endDate}
                    onSelect={(date) => setConfig({ ...config, endDate: date })}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* 用户类型 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>用户类型 *</Label>
              <Select value={config.userType} onValueChange={(value) => setConfig({ ...config, userType: value, userSubType: '', dmpId: '', offlineTag: '' })}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择用户类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="全部非会员">全部非会员</SelectItem>
                  <SelectItem value="DMP指定人群包">DMP指定人群包</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {config.userType === 'DMP指定人群包' && (
              <div className="space-y-2">
                <Label>DMP ID</Label>
                <Input
                  value={config.dmpId}
                  onChange={(e) => setConfig({ ...config, dmpId: e.target.value })}
                  placeholder="请输入DMP ID"
                />
              </div>
            )}
          </div>

          {/* 用户黑名单 */}
          <div className="space-y-4">
            <Label>用户黑名单 (UID)</Label>
            
            {/* 单个添加 */}
            <div className="flex gap-2">
              <Input
                value={newUid}
                onChange={(e) => setNewUid(e.target.value)}
                placeholder="输入单个用户UID"
                className="flex-1"
              />
              <Button onClick={addSingleUid} variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* 批量导入 */}
            <div className="space-y-2">
              <Textarea
                value={bulkUids}
                onChange={(e) => setBulkUids(e.target.value)}
                placeholder="批量导入用户UID，每行一个"
                rows={4}
              />
              <Button onClick={addBulkUids} variant="outline" className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                批量导入用户UID
              </Button>
            </div>

            {/* 已添加的用户黑名单 */}
            {config.userBlacklist.length > 0 && (
              <div className="space-y-2">
                <Label>已添加的用户UID ({config.userBlacklist.length}个)</Label>
                <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-1">
                  {config.userBlacklist.map((uid, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded">
                      <span className="text-sm">{uid}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUid(uid)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 清晰度限免内容 */}
          <div className="space-y-4">
            <Label>清晰度限免内容 (AID) *</Label>
            
            {/* 单个添加 */}
            <div className="flex gap-2">
              <Input
                value={newAid}
                onChange={(e) => setNewAid(e.target.value)}
                placeholder="输入单个AID"
                className="flex-1"
              />
              <Button onClick={addSingleAid} variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* 批量导入 */}
            <div className="space-y-2">
              <Textarea
                value={bulkAids}
                onChange={(e) => setBulkAids(e.target.value)}
                placeholder="批量导入AID，每行一个"
                rows={4}
              />
              <Button onClick={addBulkAids} variant="outline" className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                批量导入AID
              </Button>
            </div>

            {/* 已添加的AID列表 */}
            {config.contentAids.length > 0 && (
              <div className="space-y-2">
                <Label>已添加的AID ({config.contentAids.length}个)</Label>
                <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-1">
                  {config.contentAids.map((aid, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded">
                      <span className="text-sm">{aid}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAid(aid)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 每次限免试用时长 */}
          <div className="space-y-4">
            <Label>每次限免试用时长</Label>
            <RadioGroup 
              value={config.durationLimitType} 
              onValueChange={(value) => setConfig({ 
                ...config, 
                durationLimitType: value, 
                durationLimitValue: value === 'minutes' ? '' : 'min [60%稿件时长, 10分钟]'
              })}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="minutes" id="minutes" />
                <Label htmlFor="minutes">固定分钟数</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="percentage" id="percentage" />
                <Label htmlFor="percentage">稿件/ep时长百分比</Label>
              </div>
            </RadioGroup>
            
            <div className="flex gap-2 items-center">
              <Input
                type={config.durationLimitType === 'minutes' ? 'number' : 'text'}
                value={config.durationLimitValue}
                onChange={(e) => setConfig({ ...config, durationLimitValue: e.target.value })}
                placeholder={config.durationLimitType === 'minutes' ? "输入分钟数" : "min [xx%稿件时长, xx分钟]"}
                className="flex-1"
              />
              {config.durationLimitType === 'minutes' && (
                <span className="text-sm text-gray-500">分钟</span>
              )}
            </div>
          </div>

          {/* 每个稿件限免次数 */}
          <div className="space-y-2">
            <Label>每个稿件限免次数</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={config.frequencyValue}
                onChange={(e) => setConfig({ ...config, frequencyValue: e.target.value })}
                placeholder="次数（-1为不限次数）"
                className="flex-1"
              />
              <Select value={config.frequencyType} onValueChange={(value) => setConfig({ ...config, frequencyType: value })}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">次/天</SelectItem>
                  <SelectItem value="campaign">活动周期内</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {config.frequencyValue === '-1' && (
              <p className="text-sm text-blue-600">设置为-1表示不限制使用次数</p>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-center gap-4 pt-4">
            <Button variant="outline" className="px-8" onClick={handleCancel}>
              取消
            </Button>
            <Button onClick={handleSave} className="px-8">
              保存配置
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityConfigForm;
