
const SELECTED_AREA_COLOR = 'rgba(135, 179, 255, 0.7)';
const OUTER_LINE_COLOR = 'rgba(255,255,255,0.3)';
const RADAR_BACKGROUND_COLOR = 'rgba(0,0,0,0.1)';

const LABELS = ['Move with a lot of chars', 'Move with a lot of chars', 'Move with a lot of chars', 'Move with a lot of chars'];
const DATA = [2, 1, 1, 0.5];

export function loadMovesRadar(labels = LABELS, data = DATA, id = 'moves-radar') {
    new Chart(document.getElementById(id), getRadarConfig(labels, data));
}

function getRadarData(labels, data) {
    return {
        labels: labels,
        datasets: [{
            data: data,
            backgroundColor: SELECTED_AREA_COLOR,
            borderWidth: 0,
            pointRadius: 0
        }]
    };
}

function getRadarConfig(labels, data) {
    return {
        type: 'radar',
        data: getRadarData(labels, data),
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
                        font: { family: 'Roboto, sans-serif', size: 18, weight: 'bold' },
                        color: '#eed02a',
                        padding: 30,
                        callback: formatPointLabels
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
        plugins: [getRadarBackgroundPlugin(), loadRadarAxesPlugin(), getPointCirclePlugin()]
    };
}

function formatPointLabels(label, index) {
    if (index === 1 || index === 3) {
        const maxLength = 9;
        if (label.length > maxLength) {
            let lines = [];
            for (let i = 0; i < label.length; i += maxLength) {
                lines.push(label.substring(i, i + maxLength));
            }
            return lines;
        }
    }
    return label;
}

function getRadarBackgroundPlugin() {
    return {
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

            ctx.fillStyle = RADAR_BACKGROUND_COLOR;
            ctx.fill();
            ctx.restore();
        }
    }
}

function loadRadarAxesPlugin() {
    return {
        id: 'radarAxes',
        afterDraw(chart) {
            const { ctx, scales: { r } } = chart;
            ctx.save();
            ctx.strokeStyle = OUTER_LINE_COLOR;
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
}

function getPointCirclePlugin() {
    return {
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
}
