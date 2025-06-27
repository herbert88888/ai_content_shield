# AI Content Shield

一个全面的AI内容检测和分析系统，帮助识别AI生成的内容、检查原创性、评估版权风险和SEO合规性。

## 功能特性

### 🤖 AI内容检测
- 分析文本被AI生成的可能性
- 提供置信度评估和详细推理
- 高亮显示可疑的AI生成短语
- 支持多种内容类型（文章、博客、学术论文等）

### 📝 原创性检查
- 检测抄袭和重复内容
- 识别匹配的来源
- 提供原创性评分
- 高亮显示可疑段落

### ⚖️ 版权风险评估
- 识别潜在的版权侵权内容
- 检测歌词、引用和受保护材料
- 提供风险等级评估
- 给出合规建议

### 🔍 SEO风险分析
- 评估Google E-E-A-T（经验、专业性、权威性、可信度）合规性
- 识别可能影响搜索排名的风险因素
- 提供SEO优化建议
- 检测AI内容对SEO的潜在影响

### 📋 披露声明生成
- 根据AI检测结果自动生成披露声明
- 符合平台和法规要求
- 提供多种披露模板
- 建议最佳放置位置

## 技术架构

### 后端服务
- **AI检测服务** (`lib/services/aiDetection.ts`): 使用OpenAI API进行AI内容检测
- **抄袭检测服务** (`lib/services/plagiarismCheck.ts`): 集成CopyLeaks API检查原创性
- **版权检测服务** (`lib/services/copyrightCheck.ts`): 基于规则的版权风险评估
- **SEO评估服务** (`lib/services/seoAssessment.ts`): E-E-A-T合规性分析
- **披露生成器** (`lib/services/disclosureGenerator.ts`): 智能披露声明生成

### API接口
- **分析端点** (`app/api/analyze/route.ts`): 统一的内容分析API
- 支持POST请求，接收JSON格式的内容数据
- 返回完整的分析结果，包括所有检测维度

### 前端组件
- **分析结果组件** (`components/AnalysisResults.tsx`): 展示分析结果的React组件
- 响应式设计，支持移动端和桌面端
- 交互式结果展示，包括高亮显示和详细说明

## 安装和使用

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 环境配置
创建 `.env.local` 文件并配置以下环境变量：

```env
# OpenAI API配置（用于AI检测和披露生成）
OPENAI_API_KEY=your_openai_api_key

# CopyLeaks API配置（用于抄袭检测）
COPYLEAKS_API_KEY=your_copyleaks_api_key
COPYLEAKS_EMAIL=your_copyleaks_email
```

### 启动开发服务器
```bash
npm run dev
```

服务器将在 `http://localhost:3000` 启动。

### API使用示例

#### 分析内容
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "content": "要分析的文本内容",
    "contentType": "article"
  }'
```

#### 响应格式
```json
{
  "success": true,
  "data": {
    "aiDetection": {
      "probability": 25,
      "confidence": "medium",
      "reasoning": "文本显示出自然的句式变化...",
      "highlightedPhrases": [...]
    },
    "originality": {
      "overallScore": 95,
      "isOriginal": true,
      "matchedSources": [...]
    },
    "copyright": {
      "riskLevel": "low",
      "overallScore": 9,
      "detectedContent": [...]
    },
    "seo": {
      "score": 8,
      "riskLevel": "low",
      "eeatViolations": [...]
    },
    "disclosure": {
      "required": false,
      "statement": "",
      "placement": "none"
    }
  }
}
```

## 项目结构

```
ai_content_shield/
├── app/                    # Next.js应用目录
│   ├── api/               # API路由
│   │   └── analyze/       # 内容分析API
│   ├── layout.tsx         # 应用布局
│   └── page.tsx          # 主页面
├── components/            # React组件
│   └── AnalysisResults.tsx # 分析结果展示组件
├── lib/                   # 核心库
│   ├── api.ts            # API客户端
│   └── services/         # 后端服务
│       ├── aiDetection.ts
│       ├── plagiarismCheck.ts
│       ├── copyrightCheck.ts
│       ├── seoAssessment.ts
│       └── disclosureGenerator.ts
├── types/                 # TypeScript类型定义
│   └── index.ts
└── test-api.js           # API测试脚本
```

## 开发指南

### 添加新的检测服务
1. 在 `lib/services/` 目录下创建新的服务文件
2. 在 `types/index.ts` 中定义相关类型
3. 在 `app/api/analyze/route.ts` 中集成新服务
4. 更新前端组件以显示新的分析结果

### 自定义检测规则
每个服务都支持自定义检测规则：
- **AI检测**: 修改提示词和评分逻辑
- **版权检测**: 添加新的内容模式和规则
- **SEO评估**: 调整E-E-A-T评估标准

### 测试
运行API结构测试：
```bash
node test-api.js
```

## 注意事项

### API密钥安全
- 永远不要在代码中硬编码API密钥
- 使用环境变量存储敏感信息
- 在生产环境中使用安全的密钥管理服务

### 性能优化
- API调用有速率限制，请合理使用
- 对于大量内容，考虑实现批处理功能
- 使用缓存减少重复分析

### 准确性说明
- AI检测结果仅供参考，不应作为唯一判断标准
- 建议结合人工审核进行最终决策
- 定期更新检测模型以提高准确性

## 许可证

MIT License - 详见 LICENSE 文件

## 贡献

欢迎提交问题报告和功能请求。如需贡献代码，请先创建issue讨论您的想法。

## 支持

如有问题或需要帮助，请创建GitHub issue或联系开发团队。