(function (){
    const textElement = document.getElementById('music-playing');
    let startTime = null;

    function animateColor(timestamp) {
        if (!startTime) startTime = timestamp;

        // 控制速度：每 10 毫秒增加 1 度色相 → 完整一圈约需 3.6 秒
        // 你可以调整 multiplier（比如 0.05 更慢，0.2 更快）
        const speed = 0.05; // 越小越慢
        const hue = (timestamp - startTime) * speed % 360;

        textElement.style.color = `hsl(${hue}, 100%, 60%)`;
        requestAnimationFrame(animateColor);
    }

    requestAnimationFrame(animateColor);
})();