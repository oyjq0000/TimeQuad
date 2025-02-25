# 时光象限 (TimeQuad)

## 项目简介
时光象限是一个基于四象限法则的任务管理应用，结合了番茄工作法，帮助用户更好地规划和管理时间。通过将任务分类到紧急重要、重要但不紧急、紧急但不重要、既不紧急也不重要这四个象限中，帮助用户做出更明智的时间分配决策。

## 功能特点
- **四象限任务分类**：基于任务的紧急性和重要性进行分类
- **番茄工作法集成**：每个任务都可以使用番茄工作法进行时间管理
- **任务管理**：
  - 创建、编辑和删除任务
  - 标记任务完成状态
  - 追踪每个任务的番茄钟数量
- **实时状态保存**：自动保存任务状态和进行中的番茄钟信息

## 技术栈
- React 18
- TypeScript
- Vite
- Local Storage for data persistence

## 快速开始

### 环境要求
- Node.js 16.0.0 或更高版本
- npm 7.0.0 或更高版本

### 安装步骤
1. 克隆项目到本地
```bash
git clone [项目地址]
cd timeQuad
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 打开浏览器访问 http://localhost:5173

### 构建部署
```bash
npm run build
```

## 使用说明
1. 在主界面点击"添加任务"按钮创建新任务
2. 为任务选择优先级（四象限中的一个）
3. 可以启动番茄钟来专注完成任务
4. 任务完成后可以标记为已完成

## 许可证
本项目采用 MIT 许可证。这意味着你可以自由地使用、修改和分发本项目的代码，无论是个人还是商业用途。详细信息请参阅 [MIT 许可证](https://opensource.org/licenses/MIT)。
