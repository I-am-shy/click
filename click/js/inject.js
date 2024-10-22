
let style = true;// 风格变化

// 函数式风格，将需求拆解放置在独立函数中，函数应保持纯粹无二义性
function fire() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  document.body.append(canvas);

  let fireWorks = [];// 存放烟花小球的数组

  // 设置canvas样式
  function setCanvasStyle() {
    canvas.style.zIndex='1000'
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    // canvas.style.width = '100%'
    // canvas.style.height = '100%'
    canvas.style.pointerEvents = 'none';// 使当前元素不成为触发点击事件的目标，不影响页面的点击
  }

  // 设置canvas大小
  function setCanvasSize() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
  }

  setCanvasStyle();
  setCanvasSize();

  // 粒子对象
  function Particle(x, y) {
    // 坐标，半径，速度，颜色，透明度
    this.x = x + (Math.random() - 0.5) * 10;
    this.y = y + (Math.random() - 0.5) * 10;
    this.r = Math.random() * 4 + 1;
    this.v = {
      // (-4,4)
      x: Math.random() * 8 - 4,
      y: Math.random() * 8 - 4,
    }
    this.opacity = 1;
    this.random = Math.random() * 360
    this.color = `hsla(${this.random}, 100%, 50%,${this.opacity})`;
    

    // 更新粒子的属性（移动粒子）
    this.updateParticle = () => {
      this.x += this.v.x / 2;
      this.y += this.v.y / 2;
      this.opacity -= 0.02;
      this.color = `hsla(${this.random}, 100%, 50%,${this.opacity})`;
    }

    // 绘制粒子
    this.draw = () => {// 使用 save() 方法保存默认的状态，使用 restore() 进行恢复
      // ctx.save();// 保存当前画布的状态（内容）
      // ctx.globalAlpha = this.opacity;// 指定将被绘制到 canvas 上的形状或图像的 alpha（透明度）值。全局透明，会使后面的粒子透明度变化
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);// 绘制圆
      ctx.fill();
      // ctx.restore();// 使用之前保存的状态（内容）
    }
  }

  // 烟花对象（由粒子构成）
  function FireWork(x, y) {
    this.x = x;
    this.y = y;
    this.particles = [];

    // 创建粒子
    for (let i = 0; i < 30; i++) {
      this.particles.push(new Particle(this.x, this.y));
    }

    // 更新烟花
    this.update = () => {
      for (let i = 0; i < this.particles.length; i++) {
        this.particles[i].updateParticle();
        this.particles[i].draw();
      }

    }
  }

  // 生成烟花对象
  function createFireWork(x, y) {
    fireWorks.push(new FireWork(x, y))
  }

  // 循环动画
  function animation() {
    // 使用双缓存解决闪屏（不需要）
    function temp() {
      const tempCanvas = document.createElement('canvas'); // 新建一个 canvas 作为缓存 canvas
      const tempCtx = tempCanvas.getContext('2d');
      tempCanvas.width = window.innerWidth * devicePixelRatio;
      tempCanvas.height = window.innerHeight * devicePixelRatio;
      tempCtx.drawImage(canvas, 0, 0); // 开始绘制背景
      return tempCanvas;
    }

    // 消除掉透明的烟花
    fireWorks = fireWorks.filter((item) => item.particles[0].opacity > 0);
    // let tempCanvas = temp();// 缓存当前画布
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空画布
    // ctx.drawImage(tempCanvas,0,0); // 将缓存 canvas 复制到旧的 canvas
    
    for (let i = 0; i < fireWorks.length; i++) {
      fireWorks[i].update();
    }

    requestAnimationFrame(animation);
  }

  animation();

  // 监听窗口变化事件，重新设置canvas的大小
  window.addEventListener('resize', (e) => {
    setCanvasSize();
  })

  // 监听点击事件，在点击的位置生成烟花
  document.addEventListener('click', (e) => {
    // console.log(e.clientX, e.clientY);
    if(style){
      createFireWork(e.clientX, e.clientY);
    }
    
  })
}

function ripper() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  document.body.append(canvas);

  let rippers = [];// 存波纹的数组

  // 设置canvas样式
  function setCanvasStyle() {
    canvas.style.zIndex = '9999'
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';// 使当前元素不成为触发点击事件的目标，不影响页面的点击
  }

  // 设置canvas大小
  function setCanvasSize() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
  }

  setCanvasStyle();
  setCanvasSize();

  function Ripper(x, y) {
    this.x = x;
    this.y = y;
    this.opacity = 1;
    this.r = 5;
    this.v = 0.04;
    this.random = Math.random() * 360
    this.color = `hsla(${this.random},10%,90%,${this.opacity})`

    this.draw = () => {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.lineWidth = 1 * devicePixelRatio;
      ctx.fill()
    }

    this.update = () => {
      this.r += this.v * 30;
      this.opacity -= this.v;
      this.color = `hsla(${this.random},50%,80%,${this.opacity})`
    }
  }

  function createRipper(x, y) {
    rippers.push(new Ripper(x, y));
    setTimeout(() => {
      rippers.push(new Ripper(x, y));
    },150)

  }

  function animate() {
    rippers = rippers.filter(item => item.opacity <= 1)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < rippers.length; i++) {
      rippers[i].draw();
      rippers[i].update();
    }

    requestAnimationFrame(animate)
  }
  animate()

  // 监听窗口变化事件，重新设置canvas的大小
  window.addEventListener('resize', (e) => {
    setCanvasSize();
  })

  // 监听点击事件，在点击的位置生成烟花
  document.addEventListener('click', (e) => {
    // console.log(e.clientX, e.clientY);
    if(!style){
      createRipper(e.clientX, e.clientY)
    }
    
  })
}

fire();
ripper();

document.addEventListener('keydown',(e)=>{
  // console.log(e.key );
  if(e.key == 'Enter'){
    style = !style;
    if(style){
      console.log("烟花特效")
    }else{
      console.log("波纹特效")
    }
  }
})