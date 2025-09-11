const PIXI_APP = new PIXI.Application({
  background: "#12a8b8",
  resizeTo: window
});

const ORBS_COLORS = ["0x27e0b6"];
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
    // create random circle
    const randomColor = Math.floor(Math.random() * ORBS_COLORS.length);
    circle.beginFill(ORBS_COLORS[randomColor]);
    circle.drawCircle(0, 0, (Math.random() * PIXI_APP.screen.width) / 4);
    circle.endFill();
    // generateTexture converts a graphic to a texture, which can be used to
    // create a sprite
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

      // wrap the orbs around as they hit the bounds
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

function hexToRgb(hex) {
  if (typeof hex === "string" && hex.startsWith("#")) {
    hex = parseInt(hex.slice(1), 16);
  } else if (typeof hex === "string") {
    hex = parseInt(hex, 16);
  }
  return [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255];
}

function lerpColor(c1, c2, t) {
  return [
    Math.round(c1[0] + (c2[0] - c1[0]) * t),
    Math.round(c1[1] + (c2[1] - c1[1]) * t),
    Math.round(c1[2] + (c2[2] - c1[2]) * t),
  ];
}

function rgbToHex([r, g, b]) {
  return (r << 16) + (g << 8) + b;
}

export function changeBackgroundAndOrbs(newBackground, newColors, fadeDuration = 200) {
  const startBackground = PIXI_APP.renderer.backgroundColor;
  const startBgRgb = hexToRgb(startBackground);
  const endBgRgb = hexToRgb(newBackground);

  const startColors = ORBS_COLORS.map(c => hexToRgb(c));
  const endColors = newColors.map(c => hexToRgb(c));

  const orbs = PIXI_APP.stage.children[0].children; // container.children

  const startTime = performance.now();

  function animate() {
    const now = performance.now();
    const t = Math.min(1, (now - startTime) / fadeDuration);

    const bgRgb = lerpColor(startBgRgb, endBgRgb, t);
    PIXI_APP.renderer.backgroundColor = rgbToHex(bgRgb);

    ORBS_COLORS.length = 0;
    for (let i = 0; i < endColors.length; i++) {
      const start = startColors[i % startColors.length];
      const end = endColors[i];
      const rgb = lerpColor(start, end, t);
      ORBS_COLORS.push(rgbToHex(rgb));
    }

    // actually recolor current orbs
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

