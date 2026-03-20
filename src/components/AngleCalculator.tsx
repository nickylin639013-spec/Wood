import React, { useState, useEffect, useRef } from 'react';

export default function AngleCalculator() {
  const [activeTab, setActiveTab] = useState<'polygon' | 'miter' | 'triangle'>('polygon');

  // Polygon
  const [sides, setSides] = useState<number>(4);
  const [sideLength, setSideLength] = useState<string>('10');
  const polygonCanvasRef = useRef<HTMLCanvasElement>(null);

  // Miter
  const [jointAngle, setJointAngle] = useState<string>('90');
  const [thickness, setThickness] = useState<string>('');

  // Triangle
  const [triA, setTriA] = useState<string>('');
  const [triB, setTriB] = useState<string>('');
  const [triC, setTriC] = useState<string>('');

  // Polygon Calculations
  const miterAngle = 180 / sides;
  const innerAngle = (sides - 2) * 180 / sides;
  const circumDiameter = parseFloat(sideLength) / Math.sin(Math.PI / sides);

  useEffect(() => {
    if (activeTab !== 'polygon' || !polygonCanvasRef.current) return;
    const canvas = polygonCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    ctx.beginPath();
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 2;
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = '#F9A82522';
    ctx.fill();

    // Draw inner angle label
    ctx.fillStyle = '#3E2723';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${innerAngle.toFixed(1)}°`, centerX, centerY + 5);
  }, [sides, sideLength, activeTab]);

  // Triangle Calculations
  const solveTriangle = () => {
    let a = parseFloat(triA);
    let b = parseFloat(triB);
    let c = parseFloat(triC);

    let resA = a, resB = b, resC = c;
    let angleA = 0, angleB = 0, slope = 0;

    if (a && b) {
      resC = Math.sqrt(a * a + b * b);
    } else if (a && c) {
      resB = Math.sqrt(c * c - a * a);
    } else if (b && c) {
      resA = Math.sqrt(c * c - b * b);
    }

    if (resA && resB) {
      angleA = Math.atan2(resB, resA) * (180 / Math.PI);
      angleB = 90 - angleA;
      slope = (resB / resA) * 100;
    }

    return { a: resA, b: resB, c: resC, angleA, angleB, slope };
  };

  const triResult = solveTriangle();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex bg-wood-bg p-1 rounded-lg self-center mb-2 overflow-x-auto max-w-full">
        <button 
          onClick={() => setActiveTab('polygon')}
          className={`px-4 py-2 rounded-md whitespace-nowrap transition-colors ${activeTab === 'polygon' ? 'bg-wood-dark text-white shadow-sm' : 'text-wood-medium'}`}
        >
          多邊形拼接
        </button>
        <button 
          onClick={() => setActiveTab('miter')}
          className={`px-4 py-2 rounded-md whitespace-nowrap transition-colors ${activeTab === 'miter' ? 'bg-wood-dark text-white shadow-sm' : 'text-wood-medium'}`}
        >
          兩板交角
        </button>
        <button 
          onClick={() => setActiveTab('triangle')}
          className={`px-4 py-2 rounded-md whitespace-nowrap transition-colors ${activeTab === 'triangle' ? 'bg-wood-dark text-white shadow-sm' : 'text-wood-medium'}`}
        >
          直角三角形
        </button>
      </div>

      {activeTab === 'polygon' && (
        <>
          <div className="card-panel">
            <div className="grid grid-cols-2 gap-3">
              <div className="input-group">
                <label className="text-sm font-bold">邊數</label>
                <select 
                  value={sides} 
                  onChange={(e) => setSides(parseInt(e.target.value))}
                  className="input-field"
                >
                  {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                    <option key={n} value={n}>{n} 邊形</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label className="text-sm font-bold">每邊外長 <span className="unit-label">cm</span></label>
                <input 
                  type="number" 
                  value={sideLength} 
                  onChange={(e) => setSideLength(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          <div className="card-panel border-wood-accent/50 bg-yellow-50/30">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-xs text-wood-light">鋸台角度</div>
                <div className="text-3xl font-mono font-bold text-wood-dark">{miterAngle.toFixed(2)}°</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-wood-light">內角</div>
                <div className="text-3xl font-mono font-bold text-wood-dark">{innerAngle.toFixed(1)}°</div>
              </div>
            </div>
            <div className="text-center mb-4">
              <div className="text-xs text-wood-light">外接圓直徑</div>
              <div className="text-xl font-mono font-bold">{circumDiameter.toFixed(2)} cm</div>
            </div>
            <div className="flex justify-center bg-white rounded-lg p-4 border border-wood-light/10">
              <canvas ref={polygonCanvasRef} width={200} height={200} />
            </div>
          </div>
        </>
      )}

      {activeTab === 'miter' && (
        <div className="card-panel">
          <div className="input-group">
            <label className="text-sm font-bold">交角角度 (度)</label>
            <input 
              type="number" 
              value={jointAngle} 
              onChange={(e) => setJointAngle(e.target.value)}
              className="input-field"
              placeholder="90"
            />
          </div>
          <div className="input-group">
            <label className="text-sm font-bold">板厚 (選填) <span className="unit-label">cm</span></label>
            <input 
              type="number" 
              value={thickness} 
              onChange={(e) => setThickness(e.target.value)}
              className="input-field"
              placeholder="0"
            />
          </div>
          
          <div className="mt-6 p-6 bg-yellow-50 border-2 border-wood-accent rounded-xl text-center">
            <div className="text-sm text-wood-light mb-1">鋸台切角</div>
            <div className="text-5xl font-mono font-bold text-wood-dark">
              {(parseFloat(jointAngle) / 2 || 0).toFixed(2)}°
            </div>
          </div>
        </div>
      )}

      {activeTab === 'triangle' && (
        <>
          <div className="card-panel">
            <p className="text-xs text-wood-light mb-3 italic">輸入任意兩個數值，自動計算其餘部分</p>
            <div className="grid grid-cols-1 gap-3">
              <div className="input-group">
                <label className="text-sm font-bold">底邊 a <span className="unit-label">cm</span></label>
                <input type="number" value={triA} onChange={e => setTriA(e.target.value)} className="input-field" />
              </div>
              <div className="input-group">
                <label className="text-sm font-bold">高 b <span className="unit-label">cm</span></label>
                <input type="number" value={triB} onChange={e => setTriB(e.target.value)} className="input-field" />
              </div>
              <div className="input-group">
                <label className="text-sm font-bold">斜邊 c <span className="unit-label">cm</span></label>
                <input type="number" value={triC} onChange={e => setTriC(e.target.value)} className="input-field" />
              </div>
            </div>
          </div>

          {triResult.a > 0 && (
            <div className="card-panel border-wood-accent/50 bg-yellow-50/30">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-[10px] text-wood-light uppercase">角 A</div>
                  <div className="font-mono font-bold text-lg">{triResult.angleA.toFixed(2)}°</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-[10px] text-wood-light uppercase">角 B</div>
                  <div className="font-mono font-bold text-lg">{triResult.angleB.toFixed(2)}°</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-[10px] text-wood-light uppercase">坡度</div>
                  <div className="font-mono font-bold text-lg">{triResult.slope.toFixed(1)}%</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-[10px] text-wood-light uppercase">缺少的邊</div>
                  <div className="font-mono font-bold text-lg">
                    {!triA ? `a=${triResult.a.toFixed(2)}` : !triB ? `b=${triResult.b.toFixed(2)}` : `c=${triResult.c.toFixed(2)}`}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
