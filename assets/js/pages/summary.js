import { stopPixiApp } from "../support/lava-background.js";

const TOP_MENU_ICONS = {
    info: {
        icon: document.querySelector('.summary-icon.info'),
        content: document.querySelector('.summary-info')
    },
    moves: {
        icon: document.querySelector('.summary-icon.moves'),
        content: document.querySelector('.summary-moves')
    },
}

export function loadSummary() {
    loadSummaryListeners();
}

function loadSummaryListeners() {
    TOP_MENU_ICONS.info.icon.addEventListener('click', loadSummaryInfo);
    TOP_MENU_ICONS.moves.icon.addEventListener('click', loadMovesInfo);
}

export function loadSummaryPage() {
    stopPixiApp();
    document.body.style.background = "linear-gradient(to top right, #015dba, #002c59)";
    document.getElementById('main-page').style.display = 'none';
    document.getElementById('summary-page').style.display = '';
    loadMovesRadar();
}

function loadTopMenuItem(toShow, toHide) {
    toHide.content.style.display = 'none'
    toHide.icon.classList.remove('selected');
    toShow.content.style.display = ''
    toShow.icon.classList.add('selected');
}

function loadSummaryInfo() {
    loadTopMenuItem(TOP_MENU_ICONS.info, TOP_MENU_ICONS.moves);
}

function loadMovesInfo() {
    loadTopMenuItem(TOP_MENU_ICONS.moves, TOP_MENU_ICONS.info);
}

function loadMovesRadar() {
    const data = {
        labels: ['Move 1', 'Move 2', 'Move 2', 'Move 2'],
        datasets: [{
          data: [2, 1, 1, 0.5],
          backgroundColor: 'rgba(135, 179, 255, 0.7)',
          borderWidth: 0,
          pointRadius: 0
        }]
      };
  
      const radarBackgroundPlugin = {
        id: 'radarBackground',
        beforeDatasetsDraw(chart) {
          const { ctx, scales: { r } } = chart;
  
          ctx.save();
          ctx.beginPath();
  
          r._pointLabels.forEach((label, i) => {
            const point = r.getPointPositionForValue(i, r.max);
            if (i === 0) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
          });
          ctx.closePath();
  
          ctx.fillStyle = 'rgba(0,0,0,0.1)';
          ctx.fill();
          ctx.restore();
        }
      };
  
      const radarAxesPlugin = {
        id: 'radarAxes',
        afterDraw(chart) {
          const { ctx, scales: { r } } = chart;
          ctx.save();
          ctx.strokeStyle = 'rgba(255,255,255,0.3)';
          ctx.lineWidth = 1;
  
          const outerPoints = r._pointLabels.map((label, i) => r.getPointPositionForValue(i, r.max));
  
          // X Axis
          ctx.beginPath();
          ctx.moveTo(outerPoints[0].x, outerPoints[0].y);
          ctx.lineTo(outerPoints[2].x, outerPoints[2].y);
          ctx.stroke();
  
          // Y Axis
          ctx.beginPath();
          ctx.moveTo(outerPoints[1].x, outerPoints[1].y);
          ctx.lineTo(outerPoints[3].x, outerPoints[3].y);
          ctx.stroke();
  
          ctx.restore();
        }
      };
  
      const pointLabelCirclePlugin = {
        id: 'pointLabelCircle',
        afterDraw(chart) {
          const { ctx, scales: { r } } = chart;
  
          ctx.save();
          r._pointLabels.forEach((label, i) => {
            const point = r.getPointPositionForValue(i, r.max);
            const angle = r.getIndexAngle(i);
            const distance = 15;
  
            const x = r.xCenter + (r.getDistanceFromCenterForValue(r.max) + distance) * Math.cos(angle);
            const y = r.yCenter + (r.getDistanceFromCenterForValue(r.max) + distance) * Math.sin(angle);
  
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
          });
          ctx.restore();
        }
      };
      
      const config = {
        type: 'radar',
        data: data,
        options: {
          plugins: {
            legend: { display: false }
          },
          scales: {
            r: {
              min: 0,
              max: 4,
              ticks: {
                stepSize: 1,
                display: false,
                backdropColor: 'transparent'
              },
              pointLabels: {
                display: true,
                font: { size: 18, weight: 'bold' },
                color: '#eed02a',
                padding: 30,
              },
              grid: {
                circular: false,
                drawTicks: false,
                lineWidth: function (ctx) {
                  return ctx.index === ctx.scale.ticks.length - 1 ? 3 : 0;
                },
                color: function (ctx) {
                  return ctx.index === ctx.scale.ticks.length - 1 ? '#fff' : 'transparent';
                }
              },
              angleLines: { color: 'transparent' }
            }
          }
        },
        plugins: [radarBackgroundPlugin, radarAxesPlugin, pointLabelCirclePlugin]
      };
  
      new Chart(document.getElementById('moves-radar'), config);
}