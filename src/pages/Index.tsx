
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Settings, List, Plus } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            清晰度限免活动管理后台
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            专为运营团队打造的清晰度限免活动配置与管理平台
          </p>
        </div>

        {/* 功能卡片网格 */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* 创建活动卡片 */}
          <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">创建新活动</CardTitle>
              <CardDescription className="text-gray-600">
                配置清晰度限免活动的详细参数，包括用户类型、时间范围、限免规则等
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={() => navigate('/activity-config')}
                className="w-full py-3 text-lg font-medium bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                开始创建
              </Button>
              <div className="mt-4 text-sm text-gray-500">
                <p>支持批量导入AID、多种用户类型配置</p>
              </div>
            </CardContent>
          </Card>

          {/* 活动管理卡片 */}
          <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <List className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">活动管理</CardTitle>
              <CardDescription className="text-gray-600">
                查看、编辑和管理所有清晰度限免活动，支持状态控制和数据查看
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={() => navigate('/activity-management')}
                className="w-full py-3 text-lg font-medium bg-green-600 hover:bg-green-700"
                size="lg"
              >
                管理活动
              </Button>
              <div className="mt-4 text-sm text-gray-500">
                <p>活动状态监控、批量操作、详情查看</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 功能特性展示 */}
        <div className="mt-16 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            平台特性
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">灵活配置</h3>
              <p className="text-gray-600 text-sm">支持多种用户类型、DMP人群包、离线标签等精准配置</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <List className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">批量管理</h3>
              <p className="text-gray-600 text-sm">批量导入AID、批量操作活动，提升运营效率</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">实时监控</h3>
              <p className="text-gray-600 text-sm">活动状态实时跟踪，支持暂停、下线等操作</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
