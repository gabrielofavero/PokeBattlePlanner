const PIXI_APP = new PIXI.Application({
  background: 0x12a8b8,
  resizeTo: window
});

const ORBS_QUANTITY = 20;
const orbs = [];

export function loadLavaBackground() {
  document.body.appendChild(PIXI_APP.view);

  PIXI_APP.stage.eventMode = "dynamic";
  PIXI_APP.stage.hitArea = PIXI_APP.screen;

  const container = new PIXI.Container();
  PIXI_APP.stage.addChild(container);

  const blurFilter2 = new PIXI.BlurFilter();

  function randomCircle() {
    const circle = new PIXI.Graphics();
    circle.beginFill(0xffffff);
    circle.drawCircle(0, 0, (Math.random() * PIXI_APP.screen.width) / 4);
    circle.endFill();
    const texture = PIXI_APP.renderer.generateTexture(circle);
    return { texture };
  }

  const padding = PIXI_APP.screen.width / 4;
  const bounds = new PIXI.Rectangle(
    -padding,
    -padding,
    PIXI_APP.screen.width + padding * 2,
    PIXI_APP.screen.height + padding * 2
  );

  for (let i = 0; i < ORBS_QUANTITY; i++) {
    const orb = PIXI.Sprite.from(randomCircle().texture);

    orb.anchor.set(0.5);
    orb.tint = 0x27e0b6;
    container.addChild(orb);

    orb.direction = Math.random() * Math.PI * 2;
    orb.speed = 1;
    orb.turnSpeed = Math.random() - 0.8;

    orb.x = Math.random() * bounds.width;
    orb.y = Math.random() * bounds.height;

    orb.scale.set(1 + Math.random() * 0.3);
    orb.original = new PIXI.Point();
    orb.original.copyFrom(orb.scale);

    orbs.push(orb);
  }

  container.filters = [blurFilter2];
  blurFilter2.blur = 300;
  blurFilter2.quality = 35;

  let count = 0;

  PIXI_APP.ticker.add(() => {
    count += 0.02;
    for (let orb of orbs) {
      orb.direction += orb.turnSpeed * 0.01;
      orb.x += Math.sin(orb.direction) * orb.speed;
      orb.y += Math.cos(orb.direction) * orb.speed;
      orb.rotation = -orb.direction - Math.PI / 2;
      orb.scale.x = orb.original.x + Math.sin(count) * 0.2;

      if (orb.x < bounds.x) orb.x += bounds.width;
      else if (orb.x > bounds.x + bounds.width) orb.x -= bounds.width;

      if (orb.y < bounds.y) orb.y += bounds.height;
      else if (orb.y > bounds.y + bounds.height) orb.y -= bounds.height;
    }
  });
}

export function loadDefaultBackground() {
  changeBackground(0x12a8b8);
  changeOrbColor(0x27e0b6);
}

export function loadBlueBackground() {
  changeBackground(0x002c5b);
  changeOrbColor(0x005ab8);
}

function changeBackground(hex) {
  PIXI_APP.renderer.background.color = hex;
}

function changeOrbColor(hex) {
  for (let orb of orbs) {
    orb.tint = hex;
  }
}

export function stopPixiApp() {
  if (PIXI_APP.view && PIXI_APP.view.parentNode) {
    PIXI_APP.view.parentNode.removeChild(PIXI_APP.view);
  }
  PIXI_APP.ticker.stop();
  PIXI_APP.stage.removeChildren();
  PIXI_APP.destroy(true, { children: true, texture: true, baseTexture: true });
  orbs.length = 0;
}

export function isPixiAppRunning() {
  return PIXI_APP.ticker.started;
}