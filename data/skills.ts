export interface Skill {
  slug: string;
  title: { en: string; zh: string };
  description: { en: string; zh: string };
  detail: { en: string; zh: string };
  technologies: string[];
  relatedProjects: string[]; // project slugs
  proficiency: number; // 0-100
}

export const skills: Skill[] = [
  {
    slug: 'deep-learning',
    title: { en: 'Deep Learning', zh: '深度学习' },
    description: {
      en: 'CNN, Transformer, YOLO, DETR architectures for detection, segmentation, and tracking in aerial scenes.',
      zh: 'CNN、Transformer、YOLO、DETR 架构，用于航拍场景中的检测、分割和跟踪。',
    },
    detail: {
      en: 'Expertise in designing and training deep neural networks for computer vision tasks specific to aerial imagery. Proficient in adapting state-of-the-art architectures (YOLOv8, DETR, SegFormer, SAM) for drone-specific challenges including small object detection at high altitude, motion blur handling, and multi-scale feature extraction. Experienced with distributed training on multi-GPU clusters using PyTorch DDP and DeepSpeed.',
      zh: '擅长设计和训练针对航拍图像的深度神经网络。精通将最先进的架构（YOLOv8、DETR、SegFormer、SAM）适配到无人机特定挑战，包括高空小目标检测、运动模糊处理和多尺度特征提取。有使用 PyTorch DDP 和 DeepSpeed 在多 GPU 集群上进行分布式训练的经验。',
    },
    technologies: ['PyTorch', 'MMDetection', 'Ultralytics', 'HuggingFace', 'DeepSpeed', 'CUDA'],
    relatedProjects: ['aerial-detection', 'terrain-mapping'],
    proficiency: 95,
  },
  {
    slug: 'edge-computing',
    title: { en: 'Edge Computing', zh: '边缘计算' },
    description: {
      en: 'Model conversion, quantization, and real-time inference optimization for embedded AI accelerators.',
      zh: '模型转换、量化及嵌入式 AI 加速器的实时推理优化。',
    },
    detail: {
      en: 'Specialized in deploying deep learning models on resource-constrained edge devices for real-time inference. Expert in the full optimization pipeline: ONNX export, TensorRT engine building, INT8/FP16 quantization, layer fusion, and DeepStream integration. Proficient with NVIDIA Jetson family (Orin, Xavier NX, Nano), Qualcomm SNPE, and Hailo-8 accelerators.',
      zh: '专注于在资源受限的边缘设备上部署深度学习模型以实现实时推理。精通完整优化管线：ONNX 导出、TensorRT 引擎构建、INT8/FP16 量化、层融合和 DeepStream 集成。精通 NVIDIA Jetson 系列（Orin、Xavier NX、Nano）、高通 SNPE 和 Hailo-8 加速器。',
    },
    technologies: ['TensorRT', 'ONNX', 'Jetson', 'Triton', 'DeepStream', 'OpenVINO'],
    relatedProjects: ['aerial-detection', 'inference-toolkit'],
    proficiency: 92,
  },
  {
    slug: 'mlops',
    title: { en: 'MLOps & Infrastructure', zh: 'MLOps 与基础设施' },
    description: {
      en: 'End-to-end ML pipelines with automated training, evaluation, and continuous deployment workflows.',
      zh: '端到端 ML 管线，包含自动化训练、评估和持续部署工作流。',
    },
    detail: {
      en: 'Building and maintaining production ML infrastructure including automated data pipelines, experiment tracking, model versioning, and CI/CD for model deployment. Experienced with containerized training environments, distributed job scheduling, and monitoring systems for model performance in production.',
      zh: '构建和维护生产级 ML 基础设施，包括自动化数据管线、实验跟踪、模型版本管理和模型部署 CI/CD。有容器化训练环境、分布式任务调度和生产环境模型性能监控系统的经验。',
    },
    technologies: ['Docker', 'MLflow', 'Weights & Biases', 'CI/CD', 'Kubernetes', 'Airflow'],
    relatedProjects: ['inference-toolkit'],
    proficiency: 85,
  },
  {
    slug: '3d-perception',
    title: { en: '3D Perception', zh: '3D 感知' },
    description: {
      en: 'Point cloud processing, depth estimation, and multi-sensor fusion for 3D environment understanding.',
      zh: '点云处理、深度估计和多传感器融合，用于 3D 环境理解。',
    },
    detail: {
      en: 'Working with multi-modal 3D data from LiDAR, stereo cameras, and depth sensors for environment reconstruction and obstacle detection. Experienced in point cloud registration, semantic labeling of 3D scenes, and real-time depth estimation networks optimized for aerial platforms.',
      zh: '处理来自 LiDAR、立体摄像头和深度传感器的多模态 3D 数据，用于环境重建和障碍物检测。有点云配准、3D 场景语义标注和针对航空平台优化的实时深度估计网络经验。',
    },
    technologies: ['Open3D', 'PCL', 'LiDAR', 'Stereo Vision', 'RealSense', 'CloudCompare'],
    relatedProjects: ['gps-navigation', 'terrain-mapping'],
    proficiency: 80,
  },
  {
    slug: 'slam-navigation',
    title: { en: 'SLAM & Navigation', zh: 'SLAM 与导航' },
    description: {
      en: 'Visual-inertial odometry, path planning, and autonomous navigation in GPS-denied environments.',
      zh: '视觉惯性里程计、路径规划和 GPS 拒止环境中的自主导航。',
    },
    detail: {
      en: 'Developing localization and mapping solutions for autonomous UAV navigation without GPS. Combining visual SLAM (ORB-SLAM3, VINS-Fusion) with learned features, integrating with flight controllers for autonomous mission execution, and implementing path planning algorithms for obstacle-rich environments.',
      zh: '开发无 GPS 环境下无人机自主导航的定位与建图解决方案。将视觉 SLAM（ORB-SLAM3、VINS-Fusion）与学习特征结合，与飞控集成实现自主任务执行，并实现障碍物密集环境中的路径规划算法。',
    },
    technologies: ['ORB-SLAM', 'ROS2', 'PX4', 'MAVLink', 'VINS-Fusion', 'Gazebo'],
    relatedProjects: ['gps-navigation'],
    proficiency: 78,
  },
  {
    slug: 'data-engineering',
    title: { en: 'Data Engineering', zh: '数据工程' },
    description: {
      en: 'Large-scale aerial dataset curation, annotation pipeline design, and data quality assurance systems.',
      zh: '大规模航拍数据集整理、标注管线设计和数据质量保证系统。',
    },
    detail: {
      en: 'Designing scalable data pipelines for aerial imagery including automated ingestion from drone flights, quality filtering, geo-tagging, annotation orchestration with active learning, and version-controlled dataset management. Building data quality metrics and monitoring dashboards.',
      zh: '设计可扩展的航拍图像数据管线，包括从无人机飞行中自动摄取、质量过滤、地理标记、带主动学习的标注编排，以及版本控制的数据集管理。构建数据质量指标和监控仪表板。',
    },
    technologies: ['Label Studio', 'DVC', 'Airflow', 'Spark', 'PostgreSQL', 'MinIO'],
    relatedProjects: ['aerial-detection', 'terrain-mapping'],
    proficiency: 82,
  },
];
