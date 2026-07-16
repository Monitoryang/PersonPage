export interface Project {
  slug: string;
  category: { en: string; zh: string };
  title: { en: string; zh: string };
  description: { en: string; zh: string };
  detail: { en: string; zh: string };
  tech: string[];
  results: { en: string[]; zh: string[] };
}

export const projects: Project[] = [
  {
    slug: 'aerial-detection',
    category: { en: 'Object Detection', zh: '目标检测' },
    title: { en: 'Aerial Detection System', zh: '航拍检测系统' },
    description: {
      en: 'Real-time multi-class object detection on drone video streams, achieving 45+ FPS on Jetson Orin with custom YOLOv8 fine-tuned on aerial imagery datasets.',
      zh: '无人机视频流上的实时多类目标检测，在 Jetson Orin 上使用自定义 YOLOv8 微调航拍图像数据集，达到 45+ FPS。',
    },
    detail: {
      en: 'This project implements a complete aerial object detection pipeline optimized for real-time UAV operations. The system processes 4K video streams from gimbal-mounted cameras, performing multi-scale detection of vehicles, people, and infrastructure across diverse terrain. Key innovations include a custom anchor-free detection head optimized for small aerial objects, an adaptive NMS strategy for dense scenes, and a DeepStream-based inference pipeline achieving consistent frame rates on edge hardware.',
      zh: '该项目实现了一套完整的航拍目标检测管线，针对实时无人机操作进行了优化。系统处理来自云台摄像头的 4K 视频流，对各种地形上的车辆、人员和基础设施进行多尺度检测。关键创新包括针对小型航拍目标优化的无锚点检测头、密集场景的自适应 NMS 策略，以及基于 DeepStream 的推理管线，在边缘硬件上实现稳定帧率。',
    },
    tech: ['YOLOv8', 'TensorRT', 'Jetson Orin', 'DeepStream', 'CUDA', 'Python'],
    results: {
      en: ['45+ FPS real-time inference on Jetson Orin', '92.3% mAP@0.5 on custom aerial dataset', '70% model size reduction via INT8 quantization', 'Deployed across 30+ active drone units'],
      zh: ['在 Jetson Orin 上达到 45+ FPS 实时推理', '在自定义航拍数据集上达到 92.3% mAP@0.5', '通过 INT8 量化减少 70% 模型大小', '部署在 30+ 架活跃无人机上'],
    },
  },
  {
    slug: 'gps-navigation',
    category: { en: 'Autonomous Navigation', zh: '自主导航' },
    title: { en: 'GPS-Denied Navigation Pipeline', zh: 'GPS 拒止导航管线' },
    description: {
      en: 'Visual-inertial SLAM system combined with learned depth estimation for autonomous flight in indoor and underground environments.',
      zh: '视觉惯性 SLAM 系统结合学习型深度估计，实现室内和地下环境中的自主飞行。',
    },
    detail: {
      en: 'Developed a robust navigation system for UAV operations in GPS-denied environments including warehouses, tunnels, and urban canyons. The system fuses visual odometry from stereo cameras with IMU data using an extended Kalman filter, while a lightweight monocular depth network provides dense depth estimates for obstacle avoidance. The pipeline integrates with PX4 flight controller via MAVLink for seamless autonomous operation.',
      zh: '为仓库、隧道和城市峡谷等 GPS 拒止环境中的无人机操作开发了一套鲁棒的导航系统。系统使用扩展卡尔曼滤波器融合立体摄像头的视觉里程计与 IMU 数据，同时轻量级单目深度网络提供密集深度估计用于避障。管线通过 MAVLink 与 PX4 飞控集成，实现无缝自主操作。',
    },
    tech: ['ORB-SLAM3', 'ROS2', 'Stereo Depth', 'PX4', 'C++', 'Python'],
    results: {
      en: ['< 1% drift over 500m flight paths', 'Operates reliably in complete darkness with IR stereo', '200ms end-to-end latency for obstacle avoidance', 'Published 2 papers at ICRA/IROS'],
      zh: ['500m 飞行路径漂移 < 1%', '在红外立体视觉下于完全黑暗中可靠运行', '避障端到端延迟 200ms', '在 ICRA/IROS 发表 2 篇论文'],
    },
  },
  {
    slug: 'terrain-mapping',
    category: { en: 'Semantic Segmentation', zh: '语义分割' },
    title: { en: 'Terrain Mapping Engine', zh: '地形映射引擎' },
    description: {
      en: 'Semantic segmentation model for real-time terrain classification from drone-mounted cameras, enabling precision agriculture and survey applications.',
      zh: '基于无人机摄像头的实时地形分类语义分割模型，赋能精准农业和测绘应用。',
    },
    detail: {
      en: 'Built a production-grade semantic segmentation system that classifies terrain into 12 categories (crops, roads, water, buildings, vegetation, etc.) from aerial imagery captured at various altitudes. The model uses a SegFormer backbone with custom multi-scale attention heads optimized for aerial perspectives. Deployed via ONNX Runtime on embedded hardware, processing 2048x1536 frames at 15 FPS with geo-referenced output integrated into GIS workflows.',
      zh: '构建了一套生产级语义分割系统，从不同高度拍摄的航拍图像中将地形分类为 12 个类别（农作物、道路、水域、建筑、植被等）。模型使用 SegFormer 骨干网络，配合针对航拍视角优化的自定义多尺度注意力头。通过 ONNX Runtime 在嵌入式硬件上部署，以 15 FPS 处理 2048x1536 帧，地理参考输出集成到 GIS 工作流中。',
    },
    tech: ['SegFormer', 'ONNX Runtime', 'OpenCV', 'GDAL', 'Python', 'QGIS'],
    results: {
      en: ['94.7% mean IoU across 12 terrain classes', '15 FPS on 2048x1536 input resolution', 'Covers 500+ hectares per flight mission', 'Integrated with 3 agricultural platforms'],
      zh: ['12 类地形平均 IoU 达 94.7%', '2048x1536 输入分辨率下 15 FPS', '每次飞行任务覆盖 500+ 公顷', '已集成到 3 个农业平台'],
    },
  },
  {
    slug: 'inference-toolkit',
    category: { en: 'Model Optimization', zh: '模型优化' },
    title: { en: 'Inference Acceleration Toolkit', zh: '推理加速工具包' },
    description: {
      en: 'Internal toolkit for automated model pruning, INT8 quantization, and architecture search, reducing model size by 70% while maintaining 95%+ accuracy.',
      zh: '内部工具包，支持自动化模型剪枝、INT8 量化和架构搜索，在保持 95%+ 精度的同时减少 70% 模型体积。',
    },
    detail: {
      en: 'Designed and built an internal optimization toolkit that automates the model compression pipeline for edge deployment. The toolkit supports structured pruning with sensitivity analysis, post-training quantization (PTQ) and quantization-aware training (QAT), neural architecture search for latency-optimal configurations, and automated benchmarking across multiple hardware targets (Jetson Orin, Xavier NX, Hailo-8). Used by the entire AI team to accelerate deployment cycles from weeks to days.',
      zh: '设计并构建了一套内部优化工具包，自动化边缘部署的模型压缩管线。工具包支持带敏感性分析的结构化剪枝、训练后量化（PTQ）和量化感知训练（QAT）、面向延迟最优配置的神经架构搜索，以及跨多个硬件目标（Jetson Orin、Xavier NX、Hailo-8）的自动基准测试。被整个 AI 团队使用，将部署周期从数周缩短至数天。',
    },
    tech: ['NNCF', 'TensorRT', 'OpenVINO', 'PyTorch', 'ONNX', 'Python'],
    results: {
      en: ['70% average model size reduction', '3x inference speedup with < 2% accuracy loss', 'Supports 5+ hardware targets', 'Reduced deployment cycle from 2 weeks to 2 days'],
      zh: ['平均 70% 模型体积减少', '3 倍推理加速，精度损失 < 2%', '支持 5+ 硬件目标', '部署周期从 2 周缩短至 2 天'],
    },
  },
];
