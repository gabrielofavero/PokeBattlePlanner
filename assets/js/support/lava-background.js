import { hexToRgb, lerpColor, rgbToHex } from "./data.js";

const PIXI_APP = new PIXI.Application({
  background: 0x12a8b8,
  resizeTo: window
});

const ORBS_COLORS = [0x27e0b6];
const ORBS_QUANTITY = 20;

export function loadLavaBackground() {
  document.body.appendChild(PIXI_APP.view);

  PIXI_APP.stage.eventMode = "dynamic";
  PIXI_APP.stage.hitArea = PIXI_APP.screen;

  const container = new PIXI.Container();
  PIXI_APP.stage.addChild(container);

  const blurFilter2 = new PIXI.BlurFilter();

  function randomCircle() {
    const circle = new PIXI.Graphics();
    const randomColor = Math.floor(Math.random() * ORBS_COLORS.length);
    circle.beginFill(ORBS_COLORS[randomColor]);
    circle.drawCircle(0, 0, (Math.random() * PIXI_APP.screen.width) / 4);
    circle.endFill();
    const texture = PIXI_APP.renderer.generateTexture(circle);
    return {
      texture
    };
  }

  const orbs = [];

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

  let mouseX;
  let mouseY;

  PIXI_APP.stage.on("pointermove", (event) => {
    mouseX = event.global.x;
    mouseY = event.global.y;
  });

  let count = 0;

  PIXI_APP.ticker.add((delta) => {
    count += 0.02;

    for (let i = 0; i < orbs.length; i++) {
      const orb = orbs[i];

      orb.direction += orb.turnSpeed * 0.01;
      orb.x += Math.sin(orb.direction) * orb.speed;
      orb.y += Math.cos(orb.direction) * orb.speed;

      orb.rotation = -orb.direction - Math.PI / 2;
      orb.scale.x = orb.original.x + Math.sin(count) * 0.2;

      if (orb.x < bounds.x) {
        orb.x += bounds.width;
      } else if (orb.x > bounds.x + bounds.width) {
        orb.x -= bounds.width;
      }

      if (orb.y < bounds.y) {
        orb.y += bounds.height;
      } else if (orb.y > bounds.y + bounds.height) {
        orb.y -= bounds.height;
      }
    }
  });
}

export function loadDefaultBackgroundColor(fadeDuration) {
  changeBackgroundAndOrbs(0x12a8b8, [0x27e0b6], fadeDuration);
}

export function loadBlueBackgroundColor(fadeDuration) {
  changeBackgroundAndOrbs(0x84a8ff, [0x687fff], fadeDuration);
}

function changeBackgroundAndOrbs(newBackground, newColors, fadeDuration = 200) {
  const startBackground = PIXI_APP.renderer.backgroundColor;
  const startBgRgb = hexToRgb(startBackground);
  const endBgRgb = hexToRgb(newBackground);

  const orbs = PIXI_APP.stage.children[0].children;

  const startColors = orbs.map(o => hexToRgb(o.tint || ORBS_COLORS[0]));
  const endColors = newColors.map(c => hexToRgb(c));

  const startTime = performance.now();

  function animate() {
    const now = performance.now();
    const t = Math.min(1, (now - startTime) / fadeDuration);

    const bgRgb = lerpColor(startBgRgb, endBgRgb, t);
    PIXI_APP.renderer.backgroundColor = rgbToHex(bgRgb);

    for (let i = 0; i < orbs.length; i++) {
      const start = startColors[i % startColors.length];
      const end = endColors[i % endColors.length];
      const rgb = lerpColor(start, end, t);
      orbs[i].tint = rgbToHex(rgb);
    }

    if (t < 1) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}


