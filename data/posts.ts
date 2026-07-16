export interface Post {
  slug: string;
  title: { en: string; zh: string };
  date: string;
  summary: { en: string; zh: string };
  content: { en: string; zh: string };
  tags: string[];
}

export const posts: Post[] = [
  {
    slug: 'tensorrt10-migration',
    title: {
      en: 'Migrating to TensorRT 10: Lessons from Drone Deployment',
      zh: '迁移到 TensorRT 10：无人机部署的经验教训',
    },
    date: '2025-01-15',
    summary: {
      en: 'Key insights and pitfalls when upgrading inference pipelines from TensorRT 8 to TensorRT 10 on Jetson Orin platforms.',
      zh: '在 Jetson Orin 平台上将推理管线从 TensorRT 8 升级到 TensorRT 10 时的关键洞察和陷阱。',
    },
    content: {
      en: `## Background\n\nWhen NVIDIA released TensorRT 10, we faced the decision of whether to migrate our entire inference fleet. Our deployment spans 30+ Jetson Orin devices running YOLOv8 detection models at 45 FPS.\n\n## Key Changes in TRT 10\n\n- The legacy parser API has been deprecated in favor of ONNX-only ingestion\n- New strongly-typed networks improve type safety but require explicit precision specifications\n- Memory allocation patterns have changed, affecting peak VRAM usage\n\n## Migration Steps\n\n1. **ONNX re-export**: Re-exported all models with opset 17+ for full TRT 10 compatibility\n2. **Builder configuration**: Updated precision flags from legacy setFlag() to new typed enums\n3. **Calibration data**: Regenerated INT8 calibration caches (not backward compatible)\n4. **DeepStream plugin**: Updated custom parsers to match new NMS output tensor formats\n\n## Results\n\nAfter migration, we observed:\n- 12% inference speedup on identical models\n- 15% reduction in GPU memory usage\n- Better dynamic shape handling for multi-resolution inputs\n\n## Pitfalls\n\n- Calibration caches from TRT 8 are NOT compatible — must regenerate\n- Custom plugins need recompilation against new API headers\n- Some deprecated layers (FlattenConcat) require manual replacement`,
      zh: `## 背景\n\n当 NVIDIA 发布 TensorRT 10 时，我们面临是否迁移整个推理机队的决策。我们的部署涵盖 30+ 台运行 YOLOv8 检测模型的 Jetson Orin 设备，帧率 45 FPS。\n\n## TRT 10 关键变更\n\n- 旧版解析器 API 已弃用，改为仅支持 ONNX 导入\n- 新的强类型网络提高了类型安全性，但需要显式精度规范\n- 内存分配模式发生变化，影响峰值 VRAM 使用\n\n## 迁移步骤\n\n1. **ONNX 重新导出**：使用 opset 17+ 重新导出所有模型以完全兼容 TRT 10\n2. **Builder 配置**：将精度标志从旧版 setFlag() 更新为新的类型化枚举\n3. **校准数据**：重新生成 INT8 校准缓存（不向后兼容）\n4. **DeepStream 插件**：更新自定义解析器以匹配新的 NMS 输出张量格式\n\n## 结果\n\n迁移后，我们观察到：\n- 相同模型推理速度提升 12%\n- GPU 内存使用减少 15%\n- 多分辨率输入的动态形状处理更好\n\n## 陷阱\n\n- TRT 8 的校准缓存不兼容——必须重新生成\n- 自定义插件需要针对新 API 头文件重新编译\n- 一些弃用层（FlattenConcat）需要手动替换`,
    },
    tags: ['TensorRT', 'Edge Deployment', 'Optimization'],
  },
  {
    slug: 'distributed-training-aerial',
    title: {
      en: 'Scaling Aerial Object Detection Training to 8 GPUs',
      zh: '将航拍目标检测训练扩展到 8 GPU',
    },
    date: '2024-11-20',
    summary: {
      en: 'Practical guide to distributed training for aerial detection models, from data sharding to gradient synchronization.',
      zh: '航拍检测模型分布式训练实战指南，从数据分片到梯度同步。',
    },
    content: {
      en: `## Motivation\n\nTraining detection models on large aerial datasets (500K+ images) with single GPU takes weeks. We needed to scale to 8 GPUs while maintaining convergence quality.\n\n## Architecture\n\nWe chose PyTorch DDP (DistributedDataParallel) over DataParallel for its better scaling efficiency. Key considerations:\n\n- **Data sharding**: Each GPU processes a unique subset with DistributedSampler\n- **Learning rate scaling**: Linear scaling rule — base_lr * num_gpus\n- **Warmup**: Extended warmup (5 epochs vs 3) critical for multi-GPU stability\n- **Batch normalization**: SyncBatchNorm across all GPUs for consistent statistics\n\n## Key Optimizations\n\n1. **Mixed precision (AMP)**: 40% memory reduction, 1.5x throughput\n2. **Gradient accumulation**: Simulated larger batches for better convergence\n3. **NCCL backend tuning**: Set NCCL_IB_DISABLE=0 for InfiniBand clusters\n4. **Data loading**: 4 workers per GPU with persistent_workers=True\n\n## Results\n\n| Setup | Time/Epoch | Final mAP |\n|-------|-----------|----------|\n| 1x A100 | 4.2h | 91.8% |\n| 4x A100 | 1.1h | 91.6% |\n| 8x A100 | 0.6h | 91.5% |\n\nNear-linear scaling with < 0.3% mAP difference.`,
      zh: `## 动机\n\n在大型航拍数据集（50万+图像）上使用单 GPU 训练检测模型需要数周时间。我们需要扩展到 8 GPU，同时保持收敛质量。\n\n## 架构\n\n我们选择 PyTorch DDP（DistributedDataParallel）而非 DataParallel，因为它具有更好的扩展效率。关键考虑：\n\n- **数据分片**：每个 GPU 通过 DistributedSampler 处理唯一子集\n- **学习率缩放**：线性缩放规则 - base_lr * num_gpus\n- **Warmup**：扩展预热（5 epochs vs 3）对多 GPU 稳定性至关重要\n- **批归一化**：跨所有 GPU 的 SyncBatchNorm 以保持一致的统计信息\n\n## 关键优化\n\n1. **混合精度（AMP）**：40% 内存减少，1.5x 吞吐量\n2. **梯度累积**：模拟更大 batch 以获得更好的收敛\n3. **NCCL 后端调优**：为 InfiniBand 集群设置 NCCL_IB_DISABLE=0\n4. **数据加载**：每个 GPU 4 个 workers，persistent_workers=True\n\n## 结果\n\n| 配置 | 每 Epoch 时间 | 最终 mAP |\n|-------|-----------|----------|\n| 1x A100 | 4.2h | 91.8% |\n| 4x A100 | 1.1h | 91.6% |\n| 8x A100 | 0.6h | 91.5% |\n\n接近线性扩展，mAP 差异 < 0.3%。`,
    },
    tags: ['Distributed Training', 'PyTorch', 'Performance'],
  },
  {
    slug: 'drone-edge-optimization',
    title: {
      en: 'From 8 FPS to 45 FPS: Optimizing Detection Models for Drone Edge',
      zh: '从 8 FPS 到 45 FPS：优化无人机边缘端检测模型',
    },
    date: '2024-09-05',
    summary: {
      en: 'Step-by-step optimization journey taking a detection model from research prototype to real-time drone deployment.',
      zh: '将检测模型从研究原型带到实时无人机部署的逐步优化之旅。',
    },
    content: {
      en: `## Starting Point\n\nOur research team delivered a high-accuracy YOLOv8-L model running at 8 FPS on Jetson Orin — far below the 30 FPS minimum for real-time drone operation.\n\n## Optimization Pipeline\n\n### Step 1: Model Architecture (8 → 15 FPS)\n- Switched from YOLOv8-L to YOLOv8-M (fewer parameters)\n- Replaced C2f with lighter C2 blocks in backbone\n- Reduced input resolution from 1280 to 960 (acceptable for flight altitude)\n\n### Step 2: Quantization (15 → 28 FPS)\n- FP32 → FP16: immediate 1.5x speedup with zero accuracy loss\n- FP16 → INT8 (PTQ): additional 1.3x speedup, 0.8% mAP drop\n- Calibrated with 1000 representative aerial images\n\n### Step 3: TensorRT Optimization (28 → 38 FPS)\n- Layer fusion (Conv+BN+ReLU → single kernel)\n- Optimal workspace allocation\n- Engine built with timing cache for reproducibility\n\n### Step 4: Pipeline Optimization (38 → 45 FPS)\n- Async preprocessing on DLA while GPU runs inference\n- Batched NMS with CUDA kernels\n- Zero-copy memory for camera input\n\n## Final Results\n\n| Metric | Before | After |\n|--------|--------|-------|\n| FPS | 8 | 45 |\n| mAP@0.5 | 93.1% | 91.4% |\n| Model Size | 87MB | 24MB |\n| Power | 25W | 15W |`,
      zh: `## 起点\n\n我们的研究团队交付了一个高精度 YOLOv8-L 模型，在 Jetson Orin 上运行 8 FPS——远低于实时无人机操作的最低 30 FPS 要求。\n\n## 优化管线\n\n### 步骤 1：模型架构（8 → 15 FPS）\n- 从 YOLOv8-L 切换到 YOLOv8-M（更少参数）\n- 将骨干网络中的 C2f 替换为更轻的 C2 块\n- 将输入分辨率从 1280 降低到 960（对飞行高度可接受）\n\n### 步骤 2：量化（15 → 28 FPS）\n- FP32 → FP16：立即 1.5x 加速，零精度损失\n- FP16 → INT8（PTQ）：额外 1.3x 加速，0.8% mAP 下降\n- 使用 1000 张代表性航拍图像进行校准\n\n### 步骤 3：TensorRT 优化（28 → 38 FPS）\n- 层融合（Conv+BN+ReLU → 单一核）\n- 最优工作空间分配\n- 使用时序缓存构建引擎以确保可重现性\n\n### 步骤 4：管线优化（38 → 45 FPS）\n- 在 DLA 上异步预处理，同时 GPU 运行推理\n- 使用 CUDA 核的批量 NMS\n- 摄像头输入的零拷贝内存\n\n## 最终结果\n\n| 指标 | 之前 | 之后 |\n|--------|--------|-------|\n| FPS | 8 | 45 |\n| mAP@0.5 | 93.1% | 91.4% |\n| 模型大小 | 87MB | 24MB |\n| 功耗 | 25W | 15W |`,
    },
    tags: ['Edge Optimization', 'TensorRT', 'YOLO', 'Jetson'],
  },
];
