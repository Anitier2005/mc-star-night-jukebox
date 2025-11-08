class starNight {
    constructor(rate,sizeRange,starCount,groupCount){
        // 配置
        this.starScrollRate = rate;    // 星空旋转速率
        this.minSize = sizeRange[0];    // 大小随机范围
        this.maxSize = sizeRange[1];
        this.starsCount = starCount;    //  星星数量
        this.groupCount = groupCount; // 大小随机的组别

        //console.log(rate,sizeRange,starCount,groupCount)

        // 初始化场景
        this.scene = new THREE.Scene();

        // 初始化相机（透视摄像机）
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = -5;

        // 初始化渲染器
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000);   // 黑色背景
        document.getElementById('container').appendChild(this.renderer.domElement);

        //  创建星星
        this.createStars();

        // 窗口大小调整处理
        window.addEventListener('resize', ()=>{
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        //  创建动画循环
        this.animate();
    }

    // 创建动画循环
    animate = ()=>{
        window.requestAnimationFrame(this.animate);
        // 轻微旋转所有星星组
        this.starGroups.forEach(group => {
            group.rotation.y += this.starScrollRate;
        });
        this.renderer.render(this.scene, this.camera);
        //console.log('动画循环启动')
    }

    //  创建星星
    createStars(){
        // 使用多个点系统实现大小随机
        this.starGroups = [];
        const starsPerGroup = this.starsCount / this.groupCount;

        for (let i = 0; i < this.groupCount; i++) {
            const groupGeometry = new THREE.BufferGeometry();
            const groupPositions = new Float32Array(starsPerGroup * 3);

            // 在当前组内随机分配位置
            for (let j = 0; j < groupPositions.length; j += 3) {
                groupPositions[j] = (Math.random() - 0.5) * 100;
                groupPositions[j+1] = (Math.random() - 0.5) * 100;
                groupPositions[j+2] = (Math.random() - 0.5) * 100;
            }

            groupGeometry.setAttribute('position', new THREE.BufferAttribute(groupPositions, 3));

            // 在指定区间内随机大小
            const randomSize = Math.random() * (this.maxSize - this.minSize) + this.minSize;

            const groupMaterial = new THREE.PointsMaterial({
                size: randomSize,
                color: 0xFFFFFF,
                transparent: true,
                opacity: 0.8,
                sizeAttenuation: false,
                map: (function() {
                    const canvas = document.createElement('canvas');
                    canvas.width = 16;
                    canvas.height = 16;
                    const context = canvas.getContext('2d');
                    context.fillStyle = '#FFFFFF';
                    context.fillRect(0, 0, 16, 16);
                    return new THREE.CanvasTexture(canvas);
                })()
            });

            this.starGroup = new THREE.Points(groupGeometry, groupMaterial);
            this.scene.add(this.starGroup);
            this.starGroups.push(this.starGroup);
            //console.log('星星创建完成');
        }
    }

    //  更新星星
    updateStars(rate,sizeRange,starCount,groupCount) {
        this.starScrollRate = rate;    // 星空旋转速率
        this.minSize = sizeRange[0];    // 大小随机范围
        this.maxSize = sizeRange[1];
        this.starsCount = starCount;    //  星星数量
        this.groupCount = groupCount; // 大小随机的组别

        // 只移除和重新创建星星，不影响场景和相机
        this.starGroups.forEach(group => {
            this.scene.remove(group);
            // 释放几何体和材质资源
            group.geometry.dispose();
            group.material.dispose();
        });
        this.starGroups = [];

        // 重新创建星星
        this.createStars();
    }
}



