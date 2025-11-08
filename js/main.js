//  初始化方块旋转控制
new blockController(15,25,-25,90);

//  初始化星空
//  .updateStars()方法用于更新星空的参数
const defaultStarConfig = [0.0015,[0.5,4.0],1000,10];   //  默认星空配置配置
const starBackground = new starNight(...defaultStarConfig);

//  导入音乐配置
let musicConfig = [];
async function importConfig() {
    try {
        const response = await fetch('static/juke/list.json');
        musicConfig = await response.json();
    } catch (err) {
        console.log(err);
    }
}

class playController {
    constructor(){
        this.music = null;
    }
    //  播放歌曲，并显示
    play = (index)=>{
        //  获取对应配置播放歌曲
        const musicDetail = musicConfig[index];
        if(this.music)this.music.pause();   //  若music内存在audio对象则停止播放
        this.music = new Audio(`static/juke/music/${musicDetail.file}`);
        this.music.play().then(()=>{
            //  成功播放
            this.music.loop = true;     //  循环播放
            document.getElementById('music-playing').textContent = `正在播放:${musicDetail["author"]} - ${musicDetail["name"]}`;

            //  修改星空设置
            const effect = musicDetail["effect"];
            if(Object.keys(effect).length > 0){     //  如果对象不为空
                console.log('调用')
                starBackground.updateStars(
                    effect.rate,
                    effect.size,
                    effect.count,
                    effect.groups
                )
            }
            else{   //  对象为空，星空重置为默认配置
                starBackground.updateStars(...defaultStarConfig);
            }
        }).catch(error=>{
            console.log(error);
        });
    }

    //  弹出唱片，停止播放
    turnOff = ()=>{
        this.music.pause();
        document.getElementById('music-playing').textContent = '';
    }
}

const jukeBox = new playController();

//  为所有面初始化点击事件
const faces = ['front', 'back','top','bottom','left','right'];
faces.forEach(face => {
    const faceEl = document.querySelector(`body > div.scene-wrapper > div > div > div.face.${face}`);
    if(faceEl){
        //  弹出唱片
        faceEl.addEventListener('click', jukeBox.turnOff);
    }
});

// 插入物品栏
importConfig().then(()=>{
    let content = '';
    musicConfig.forEach((fuke,index) => {
        content += `
            <span id="music-disc-${index}">
                <img src="/static/juke/icon/${fuke.icon}" alt="Disc">
            </span>
        `;
    })
    let box = document.getElementById('music-box');
    box.innerHTML = content;
    box.style.display = 'flex';
    return box;
}).then(box=>{
    for(const el of box.children){
        el.addEventListener('click', event=>{
            const id = event.currentTarget.id;
            const musicIndex = +id.match(/\d+$/)[0];
            jukeBox.play(musicIndex);
        });
    }
});








