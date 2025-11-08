class blockController{
    constructor(maxRotateY,maxRotateX,baseRotateX,baseRotateY){
        // 设置最大旋转角度（可调节灵敏度）
        this.maxRotateY = maxRotateY; // 左右最大 ±45 度
        this.maxRotateX = maxRotateX; // 上下最大 ±30 度（叠加在基础 -25deg 上）
        // 基础角度（与 CSS 中一致）
        this.baseRotateX = baseRotateX; // deg
        this.baseRotateY = baseRotateY;   // deg

        // 获取 .scene 元素
        const scene = document.querySelector('.scene');
        if (!scene) {
            console.warn('未找到 .scene 元素');
        } else {
            document.addEventListener('mousemove', (e) => {
                const rect = scene.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                // 计算鼠标相对于中心的偏移比例（-1 到 1）
                const mouseX = (e.clientX - centerX) / (rect.width / 2);  // [-1, 1]
                const mouseY = (e.clientY - centerY) / (rect.height / 2); // [-1, 1]

                // 映射到旋转角度
                const rotateY = this.baseRotateY + mouseX * this.maxRotateY; // 左右
                const rotateX = this.baseRotateX - mouseY * this.maxRotateX; // 上下（注意：屏幕Y向下，所以取反）

                // 更新 CSS 变量（作用于 :root）
                document.documentElement.style.setProperty('--rotate-y', `${rotateY}deg`);
                document.documentElement.style.setProperty('--rotate-x', `${rotateX}deg`);
            });
        }
    }
}

