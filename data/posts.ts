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
      en: 'TensorRT 8 → 10 Migration: YOLOv8 on RTX A6000',
      zh: 'TensorRT 8 → 10 迁移实战：YOLOv8 在 RTX A6000 上的完整适配',
    },
    date: '2025-07-10',
    summary: {
      en: 'Complete adaptation from TensorRT 8 to 10.16.1: API changes, 5 critical pitfalls, and performance analysis on RTX A6000.',
      zh: 'YOLOv8 目标检测引擎从 TensorRT 8 升级到 TensorRT 10.16.1 的完整适配过程、5 个致命踩坑记录与架构分析。',
    },
    content: {
      en: `## Project Overview

This project migrates the YOLOv8 detector from **TensorRT 8** to **TensorRT 10.16.1**, with **OpenCV 5.0.0** and **CUDA 13.2**. The new module lives in the \`detector_trt10/\` directory with the \`joai_trt10\` namespace.

### Tech Stack

| Component | Old (TRT8) | New (TRT10) |
|-----------|-----------|-------------|
| Inference Engine | TensorRT 8.x | TensorRT 10.16.1 |
| CUDA | 11.x / 12.x | 13.2 |
| OpenCV | 4.x | 5.0.0 |
| NPP API | nppiResize_8u_C3R | nppiResize_8u_C3R_Ctx |
| CMake | FindCUDA | CUDA language native |

## TRT8 → TRT10 Core API Changes

TensorRT 10 completely renamed the inference API, shifting from a "binding index" paradigm to a "tensor name" paradigm:

| Function | TRT8 (Old) | TRT10 (New) | Notes |
|----------|-----------|-------------|-------|
| IO count | \`getNbBindings()\` | \`getNbIOTensors()\` | Clearer semantics |
| Tensor name | \`getBindingName(i)\` | \`getIOTensorName(i)\` | Returns char8_t* |
| Tensor shape | \`getBindingDimensions(i)\` | \`getTensorShape(name)\` | Query by name |
| IO mode | \`getBindingIsInput(i)\` | \`getTensorIOMode(name)\` | Returns enum |
| Set input shape | \`setBindingDimensions(i,dims)\` | \`setInputShape(name,dims)\` | **Must call before inference** |
| Bind buffer | \`buffers[]\` passed to enqueueV2 | \`setTensorAddress(name,ptr)\` | Pre-register |
| Run inference | \`enqueueV2(buffers,stream,nullptr)\` | \`enqueueV3(stream)\` | Only pass stream |
| Destroy object | \`obj->destroy()\` | \`delete obj\` | C++ standard semantics |

> [!warning]
> **Core paradigm shift:** TRT10 moves from *index-based* to *name-based* operations. All \`getBinding*\` APIs are replaced with \`getTensor*\` + name string parameters.

## TRT10 Code Deep Dive

### 3.1 Engine Init — InitEngine()

Initialization performs four key steps: load engine, parse tensor info, allocate memory, register addresses.

\`\`\`cpp
// 1. Load serialized engine
mp_runtime = nvinfer1::createInferRuntime(gLogger);
mp_engine = mp_runtime->deserializeCudaEngine(trtModelStream, size);

// 2. TRT10: Query IO tensors by name
m_nb_io_tensors = mp_engine->getNbIOTensors();
for (int i = 0; i < m_nb_io_tensors; ++i) {
    std::string name = mp_engine->getIOTensorName(i);
    auto mode = mp_engine->getTensorIOMode(name.c_str());
    auto dims = mp_engine->getTensorShape(name.c_str());
}

// 3. TRT10: Must explicitly set input shape
mp_context->setInputShape(input_name, input_dims);

// 4. TRT10: Pre-register buffer addresses
mp_context->setTensorAddress(input_name, buffers_device[0]);
mp_context->setTensorAddress(output_name, buffers_device[1]);
\`\`\`

### 3.2 Inference — inference()

TRT10 inference is extremely concise — only one stream parameter:

\`\`\`cpp
bool status = mp_context->enqueueV3(m_stream);
// Copy results from pre-registered output buffer
cudaMemcpyAsync(output_buffer_host, buffers_device[1], ...);
cudaStreamSynchronize(m_stream);
\`\`\`

### 3.3 Resource Cleanup — DeInitEngine()

TRT10 uses standard C++ \`delete\` instead of \`destroy()\`:

\`\`\`cpp
// TRT8:  mp_context->destroy();
// TRT10: standard C++ semantics
delete mp_context;
delete mp_engine;
delete mp_runtime;
\`\`\`

### 3.4 GpuMat Path — NPP Adaptation

CUDA 13.2 requires NPP functions with \`_Ctx\` suffix:

\`\`\`cpp
NppStreamContext nppStreamCtx;
memset(&nppStreamCtx, 0, sizeof(NppStreamContext));
nppStreamCtx.hStream = m_stream;

nppiResize_8u_C3R_Ctx(
    src, src_step, srcSize, srcRect,
    dst, dst_step, dstSize, dstRect,
    NPPI_INTER_LINEAR, nppStreamCtx);
\`\`\`

## 5 Critical Pitfalls

### Pitfall 1: CUDA_ARCH Mismatch — All-Zero Output (Most Fatal)

> [!danger]
> **Symptom:** Program runs normally, inference time is normal, but 0 detections, all class confidence < 0.001.
> **Root cause:** CMake cache had \`CUDA_ARCH=89\` (RTX 4090), but actual GPU is **RTX A6000 (sm_86)**. CUDA kernel compiled for wrong target causes \`preprocess\` kernel to silently fail with "named symbol not found", output buffer all zeros.

**Debugging process:**

1. Add output statistics after \`inference()\` → found max_class_score ≈ 0.00017
2. Read back input buffer after \`preprocess()\` → found all zeros
3. Add \`cudaStreamSynchronize\` + \`cudaGetLastError()\` → caught "named symbol not found"
4. Check \`CMakeCache.txt\` → \`CUDA_ARCH:STRING=89\`, but GPU is sm_86

**Fix:**

\`\`\`bash
# Reconfigure with correct arch + full rebuild
cmake .. -DCUDA_ARCH=86
make clean && make -j$(nproc)
\`\`\`

> [!warning]
> **Lesson:** CMake Cache retains old \`CUDA_ARCH\` values. Even modifying CMakeLists.txt defaults won't help. After switching GPUs, you must explicitly pass \`-DCUDA_ARCH=xx\` or delete \`CMakeCache.txt\`.

### Pitfall 2: enqueueV3 Signature Change

> [!danger]
> **TRT8:** \`enqueueV2(void** buffers, cudaStream_t stream, cudaEvent_t* inputConsumed)\` — 3 parameters
> **TRT10:** \`enqueueV3(cudaStream_t stream)\` — only 1 parameter!

Buffer addresses must be pre-registered via \`setTensorAddress()\`.

### Pitfall 3: setInputShape Must Be Called

Even with fixed engine input dimensions, TRT10 still requires calling \`setInputShape()\` before inference. Omitting this won't crash but results in incorrect inference.

### Pitfall 4: NPP Ctx Version Functions

In CUDA 13.2, many NPP functions are deprecated — use the \`_Ctx\` suffix versions:

\`\`\`cpp
// Old API (deprecated):
nppiResize_8u_C3R(src, step, srcSize, srcRect, dst, ...);

// New API:
NppStreamContext ctx{};
ctx.hStream = m_stream;
nppiResize_8u_C3R_Ctx(src, step, srcSize, srcRect, dst, ..., ctx);
\`\`\`

### Pitfall 5: OpenCV 5 Module Renaming

| OpenCV 4.x | OpenCV 5.x | Notes |
|-----------|-----------|-------|
| calib3d | calib | pkg-config: opencv5 |
| features2d | features | |
| libopencv_*.so.4xx | libopencv_*.so.500 | Need LD_LIBRARY_PATH |

Runtime \`LD_LIBRARY_PATH\` must point to OpenCV 5 install path (default \`/usr/local/lib\`).

## TRT10 Upgrade Advantages

### Modern API Design

- **Name-based operations:** Eliminates hard-coded binding index dependencies, more robust code
- **C++ standard semantics:** \`delete\` replaces \`destroy()\`, follows RAII pattern
- **Minimal inference interface:** \`enqueueV3(stream)\` takes only one parameter

### Performance Improvements

- **Faster kernel fusion:** TRT10 introduces more aggressive layer fusion strategies
- **Better INT8/FP8 support:** Native FP8 quantization (Hopper/Ada architecture)
- **Improved memory management:** More efficient workspace usage, reduced peak VRAM

### Benchmark Results

| Metric | TRT8 | TRT10 | Improvement |
|--------|------|-------|-------------|
| Inference Latency (640x384) | ~7.5ms | ~4.4ms | **-41%** |
| Detection Accuracy | 29 targets | 29 targets | Identical |
| API Complexity | High (index+array) | Low (name+register) | Simplified |

> [!success]
> **Conclusion:** On RTX A6000, TRT10 inference latency dropped from ~7.5ms to ~4.4ms, a **41% improvement**. Detection accuracy is fully consistent. API is cleaner and more maintainable. Highly recommended upgrade.

## Migration Checklist

| Category | Check Item | Status |
|----------|-----------|--------|
| CMake | Confirm \`CUDA_ARCH\` matches target GPU | ☐ |
| CMake | Clean CMakeCache.txt and reconfigure | ☐ |
| API | \`getNbBindings\` → \`getNbIOTensors\` | ☐ |
| API | \`getBindingDimensions(i)\` → \`getTensorShape(name)\` | ☐ |
| API | \`getBindingIsInput(i)\` → \`getTensorIOMode(name)\` | ☐ |
| API | Add \`setInputShape()\` call | ☐ |
| API | \`enqueueV2(buffers,...)\` → \`setTensorAddress()\` + \`enqueueV3(stream)\` | ☐ |
| API | \`destroy()\` → \`delete\` | ☐ |
| NPP | Replace NPP functions with \`_Ctx\` versions | ☐ |
| OpenCV | Update module names (calib3d→calib etc.) | ☐ |
| OpenCV | Runtime \`LD_LIBRARY_PATH\` points to correct path | ☐ |
| Testing | Compare TRT8/TRT10 detection count and confidence | ☐ |

## CUDA NMS Acceleration

After the base migration, we moved NMS from CPU to GPU to further reduce post-processing latency.

### Three CUDA Kernels

| Kernel | Function | Parallel Strategy |
|--------|----------|-------------------|
| \`kernel_decode_detections\` | Decode bbox + confidence filter from raw output | One thread per anchor (5040 parallel) |
| \`std::sort\` (CPU) | Sort filtered candidates by confidence desc | Candidates usually < 500, CPU very fast |
| \`kernel_nms\` | Parallel IoU compute and suppression marking | One thread per detection box |

### NMS Kernel Core Logic

\`\`\`cpp
// Each thread handles one detection box
__global__ void kernel_nms(
    const GpuDetection* dets, const int* order,
    int* keep, int n, float iou_thresh)
{
    int i = order[blockIdx.x * blockDim.x + threadIdx.x];
    // Check all higher-confidence same-class boxes
    for (int k = 0; k < n; k++) {
        int j = order[k];
        if (j == i) break;  // later ones have lower score
        if (dets[j].class_id != dets[i].class_id) continue;
        float iou = compute_iou(dets[i], dets[j]);
        if (iou > iou_thresh) { keep[i] = 0; return; }
    }
}
\`\`\`

### Benchmark (50 runs)

| NMS Mode | Avg Time | Detections | Notes |
|----------|----------|------------|-------|
| CPU NMS | **4.145 ms** | 29 | Default scheme |
| CUDA NMS | 4.287 ms | 29 | ~3.4% overhead |

> [!info]
> **Conclusion: CPU NMS is faster in current scenario.** Reasons: total time dominated by TRT10 inference (~4ms), NMS only a tiny fraction; after confidence filtering only ~hundreds of candidates, CPU processes them near-instantly; CUDA NMS overhead: \`cudaMalloc/free\`, host↔device copy, \`cudaStreamSynchronize\`.

> [!success]
> **Verification:** CUDA NMS output matches CPU NMS **exactly** — same 29 detections, confidence and coordinates all match. CUDA NMS implementation retained, switchable via \`use_cpu_nms\` flag.`,
      zh: `## 项目概览

本项目将 YOLOv8 检测器从 **TensorRT 8** 迁移到 **TensorRT 10.16.1**，同时适配 **OpenCV 5.0.0** 和 **CUDA 13.2**。新模块放置在 \`detector_trt10/\` 目录下，对外接口与原版完全一致，使用 \`joai_trt10\` 命名空间隔离。

### 技术栈

| 组件 | 旧版本 (TRT8) | 新版本 (TRT10) |
|------|-------------|---------------|
| 推理引擎 | TensorRT 8.x | TensorRT 10.16.1 |
| CUDA | 11.x / 12.x | 13.2 |
| OpenCV | 4.x | 5.0.0 |
| NPP API | nppiResize_8u_C3R | nppiResize_8u_C3R_Ctx |
| CMake | FindCUDA | CUDA language native |

## TRT8 → TRT10 核心 API 变更

TensorRT 10 对推理 API 进行了**全面的名称重构**，从「按索引操作」范式转向「按张量名称操作」范式：

| 功能 | TRT8 (旧) | TRT10 (新) | 说明 |
|------|----------|-----------|------|
| IO 数量 | \`getNbBindings()\` | \`getNbIOTensors()\` | 语义更清晰 |
| 张量名称 | \`getBindingName(i)\` | \`getIOTensorName(i)\` | 返回 char8_t* |
| 张量形状 | \`getBindingDimensions(i)\` | \`getTensorShape(name)\` | 按名称查询 |
| IO 模式 | \`getBindingIsInput(i)\` | \`getTensorIOMode(name)\` | 返回枚举 |
| 设置输入形状 | \`setBindingDimensions(i,dims)\` | \`setInputShape(name,dims)\` | **推理前必须调用** |
| 绑定缓冲区 | \`buffers[]\` 传入 enqueueV2 | \`setTensorAddress(name,ptr)\` | 预先注册 |
| 执行推理 | \`enqueueV2(buffers,stream,nullptr)\` | \`enqueueV3(stream)\` | 仅传 stream |
| 销毁对象 | \`obj->destroy()\` | \`delete obj\` | C++ 标准语义 |

> [!warning]
> **核心范式转变：** TRT10 从*按索引操作*转向*按名称操作*。所有 \`getBinding*\` 系列 API 均被替换为 \`getTensor*\` + 名称字符串参数，提高了代码可读性。

## TRT10 代码深度解析

### 3.1 引擎初始化 — InitEngine()

初始化阶段完成了引擎加载、张量信息解析、内存分配和地址注册四个关键步骤：

\`\`\`cpp
// 1. 加载序列化引擎
mp_runtime = nvinfer1::createInferRuntime(gLogger);
mp_engine = mp_runtime->deserializeCudaEngine(trtModelStream, size);

// 2. TRT10: 按名称查询 IO 张量信息
m_nb_io_tensors = mp_engine->getNbIOTensors();
for (int i = 0; i < m_nb_io_tensors; ++i) {
    std::string name = mp_engine->getIOTensorName(i);
    auto mode = mp_engine->getTensorIOMode(name.c_str());
    auto dims = mp_engine->getTensorShape(name.c_str());
}

// 3. TRT10: 必须显式设置输入形状
mp_context->setInputShape(input_name, input_dims);

// 4. TRT10: 预注册缓冲区地址
mp_context->setTensorAddress(input_name, buffers_device[0]);
mp_context->setTensorAddress(output_name, buffers_device[1]);
\`\`\`

### 3.2 推理执行 — inference()

TRT10 的推理调用极其简洁，仅传一个 stream 参数：

\`\`\`cpp
bool status = mp_context->enqueueV3(m_stream);
// 从预注册的输出缓冲区拷贝结果
cudaMemcpyAsync(output_buffer_host, buffers_device[1], ...);
cudaStreamSynchronize(m_stream);
\`\`\`

### 3.3 资源释放 — DeInitEngine()

TRT10 使用标准 C++ \`delete\` 替代 \`destroy()\`：

\`\`\`cpp
// TRT8:  mp_context->destroy();
// TRT10: 标准 C++ 语义
delete mp_context;
delete mp_engine;
delete mp_runtime;
\`\`\`

### 3.4 GpuMat 路径 — NPP 适配

CUDA 13.2 要求 NPP 函数使用 \`_Ctx\` 后缀版本，需手动构造 \`NppStreamContext\`：

\`\`\`cpp
NppStreamContext nppStreamCtx;
memset(&nppStreamCtx, 0, sizeof(NppStreamContext));
nppStreamCtx.hStream = m_stream;

nppiResize_8u_C3R_Ctx(
    src, src_step, srcSize, srcRect,
    dst, dst_step, dstSize, dstRect,
    NPPI_INTER_LINEAR, nppStreamCtx);
\`\`\`

## 踩坑实录：5 个致命问题

### 坑 1：CUDA_ARCH 不匹配 — 全零输出（最致命）

> [!danger]
> **现象：** 程序正常运行，推理耗时正常，但检测结果为 0，所有类别置信度 < 0.001。
> **根因：** CMake 缓存中 \`CUDA_ARCH=89\`（RTX 4090），但实际 GPU 为 **RTX A6000 (sm_86)**。CUDA kernel 编译目标与实际 GPU 不匹配，导致 \`preprocess\` kernel 以 "named symbol not found" 静默失败，输出缓冲区全零。

**排查过程：**

1. 在 \`inference()\` 后添加输出统计 → 发现 max_class_score ≈ 0.00017
2. 在 \`preprocess()\` 后回读输入缓冲区 → 发现全部为 0
3. 添加 \`cudaStreamSynchronize\` + \`cudaGetLastError()\` → 捕获 "named symbol not found"
4. 检查 \`CMakeCache.txt\` → \`CUDA_ARCH:STRING=89\`，而 GPU 为 sm_86

**修复方案：**

\`\`\`bash
# 重新配置正确架构 + 完全重编译
cmake .. -DCUDA_ARCH=86
make clean && make -j$(nproc)
\`\`\`

> [!warning]
> **教训：** CMake Cache 会保留旧 \`CUDA_ARCH\` 值，即使修改 CMakeLists.txt 默认值也不生效。切换 GPU 后必须显式传入 \`-DCUDA_ARCH=xx\` 或删除 \`CMakeCache.txt\`。

### 坑 2：enqueueV3 签名变化

> [!danger]
> **TRT8：** \`enqueueV2(void** buffers, cudaStream_t stream, cudaEvent_t* inputConsumed)\` — 3 个参数
> **TRT10：** \`enqueueV3(cudaStream_t stream)\` — 仅 1 个参数！

缓冲区地址必须通过 \`setTensorAddress()\` 预先注册到 execution context。

### 坑 3：setInputShape 必须调用

即使引擎输入维度是固定的，TRT10 仍要求在推理前显式调用 \`setInputShape()\`。遗漏此调用不会崩溃，但推理结果不正确。

### 坑 4：NPP Ctx 版本函数

CUDA 13.2 中大量 NPP 函数被标记为 deprecated，需使用带 \`_Ctx\` 后缀的新版本：

\`\`\`cpp
// 旧 API（deprecated）:
nppiResize_8u_C3R(src, step, srcSize, srcRect, dst, ...);

// 新 API:
NppStreamContext ctx{};
ctx.hStream = m_stream;
nppiResize_8u_C3R_Ctx(src, step, srcSize, srcRect, dst, ..., ctx);
\`\`\`

### 坑 5：OpenCV 5 模块重命名

| OpenCV 4.x | OpenCV 5.x | 备注 |
|-----------|-----------|------|
| calib3d | calib | pkg-config: opencv5 |
| features2d | features | |
| libopencv_*.so.4xx | libopencv_*.so.500 | 需要 LD_LIBRARY_PATH |

运行时需注意 \`LD_LIBRARY_PATH\` 指向 OpenCV 5 安装路径（默认 \`/usr/local/lib\`）。

## TRT10 升级优势分析

### API 设计更现代

- **按名称操作：** 消除了对 binding index 的硬编码依赖，代码更健壮
- **C++ 标准语义：** \`delete\` 替代 \`destroy()\`，符合 RAII 模式
- **极简推理接口：** \`enqueueV3(stream)\` 仅一个参数

### 性能提升

- **更快的 kernel 融合：** TRT10 引入了更激进的 layer fusion 策略
- **更好的 INT8/FP8 支持：** 原生 FP8 量化支持（Hopper/Ada 架构）
- **改进的内存管理：** workspace 使用更高效，减少峰值显存占用

### 实测对比

| 指标 | TRT8 | TRT10 | 提升 |
|------|------|-------|------|
| 推理延迟 (640×384) | ~7.5ms | ~4.4ms | **-41%** |
| 检测精度 | 29 targets | 29 targets | 一致 |
| API 调用复杂度 | 高（索引+数组） | 低（名称+注册） | 简化 |

> [!success]
> **结论：** 在 RTX A6000 上，TRT10 推理延迟从 ~7.5ms 降至 ~4.4ms，提升约 **41%**。检测精度完全一致。API 更简洁，代码维护性更好。强烈推荐升级。

## 迁移 Checklist

| 类别 | 检查项 | 状态 |
|------|--------|------|
| CMake | 确认 \`CUDA_ARCH\` 与目标 GPU 匹配 | ☐ |
| CMake | 清理 CMakeCache.txt 后重新配置 | ☐ |
| API | \`getNbBindings\` → \`getNbIOTensors\` | ☐ |
| API | \`getBindingDimensions(i)\` → \`getTensorShape(name)\` | ☐ |
| API | \`getBindingIsInput(i)\` → \`getTensorIOMode(name)\` | ☐ |
| API | 添加 \`setInputShape()\` 调用 | ☐ |
| API | \`enqueueV2(buffers,...)\` → \`setTensorAddress()\` + \`enqueueV3(stream)\` | ☐ |
| API | \`destroy()\` → \`delete\` | ☐ |
| NPP | NPP 函数替换为 \`_Ctx\` 版本 | ☐ |
| OpenCV | 模块名更新 (calib3d→calib 等) | ☐ |
| OpenCV | 运行时 \`LD_LIBRARY_PATH\` 指向正确路径 | ☐ |
| 测试 | 对比 TRT8/TRT10 检测数量与置信度 | ☐ |

## 番外：CUDA NMS 加速实现

在完成基础迁移后，我们将 NMS 从 CPU 迁移到了 GPU，进一步减少后处理延迟。

### 三个 CUDA Kernel

| Kernel | 功能 | 并行策略 |
|--------|------|----------|
| \`kernel_decode_detections\` | 从原始输出解码 bbox + 置信度过滤 | 每个线程处理一个 anchor（5040 并行） |
| \`std::sort\` (CPU) | 按置信度降序排列过滤后的候选 | 候选数通常 < 500，CPU 极快 |
| \`kernel_nms\` | 并行计算 IoU 并标记抑制 | 每个线程检查一个检测框是否被更高置信度的同类框抑制 |

### NMS Kernel 核心逻辑

\`\`\`cpp
// 每个线程处理一个检测框
__global__ void kernel_nms(
    const GpuDetection* dets, const int* order,
    int* keep, int n, float iou_thresh)
{
    int i = order[blockIdx.x * blockDim.x + threadIdx.x];
    // 检查所有更高置信度的同类框
    for (int k = 0; k < n; k++) {
        int j = order[k];
        if (j == i) break;  // 后面的分数更低，无需检查
        if (dets[j].class_id != dets[i].class_id) continue;
        float iou = compute_iou(dets[i], dets[j]);
        if (iou > iou_thresh) { keep[i] = 0; return; }
    }
}
\`\`\`

### 实测对比（50 runs）

| NMS 模式 | 平均耗时 | 检测数 | 备注 |
|----------|----------|--------|------|
| CPU NMS | **4.145 ms** | 29 | 默认方案 |
| CUDA NMS | 4.287 ms | 29 | 多 ~3.4% 开销 |

> [!info]
> **结论：当前场景下 CPU NMS 更快。** 原因：总耗时被 TRT10 推理主导（~4ms），NMS 仅占极小比例；置信度过滤后候选框仅数百个，CPU 处理几乎瞬时；CUDA NMS 额外开销：\`cudaMalloc/free\`、host↔device 拷贝、\`cudaStreamSynchronize\` 同步。

> [!success]
> **验证结果：** CUDA NMS 输出与 CPU NMS **完全一致** — 同样 29 个检测目标，置信度和坐标均匹配。代码已保留 CUDA NMS 实现，可通过 \`use_cpu_nms\` 标志切换。`,
    },
    tags: ['TensorRT', 'CUDA', 'YOLOv8', 'C++', 'Optimization'],
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
