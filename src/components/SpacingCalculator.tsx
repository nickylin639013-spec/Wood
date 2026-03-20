import React, { useState } from 'react';

export default function SpacingCalculator() {
  const [activeTab, setActiveTab] = useState<'linear' | 'circular'>('linear');

  // Linear
  const [totalLength, setTotalLength] = useState<string>('100');
  const [count, setCount] = useState<string>('5');
  const [startOffset, setStartOffset] = useState<string>('0');
  const [endOffset, setEndOffset] = useState<string>('0');

  // Circular
  const [radius, setRadius] = useState<string>('50');
  const [holeCount, setHoleCount] = useState<string>('8');
  const [startAngle, setStartAngle] = useState<string>('0');

  // Linear Calc
  const effectiveLength = parseFloat(totalLength) - parseFloat(startOffset || '0') - parseFloat(endOffset || '0');
  const spacing = effectiveLength / (parseInt(count) - 1 || 1);
  const points = Array.from({ length: parseInt(count) || 0 }, (_, i) => parseFloat(startOffset || '0') + i * spacing);

  // Circular Calc
  const holes = Array.from({ length: parseInt(holeCount) || 0 }, (_, i) => {
    const angleDeg = parseFloat(startAngle || '0') + (i * 360) / (parseInt(holeCount) || 1);
    const angleRad = (angleDeg * Math.PI) / 180;
    const r = parseFloat(radius) || 0;
    return {
      angle: angleDeg,
      x: r * Math.cos(angleRad),
      y: r * Math.sin(angleRad)
    };
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex bg-wood-bg p-1 rounded-lg self-center mb-2">
        <button 
          onClick={() => setActiveTab('linear')}
          className={`px-6 py-2 rounded-md transition-colors ${activeTab === 'linear' ? 'bg-wood-dark text-white shadow-sm' : 'text-wood-medium'}`}
        >
          等距排列
        </button>
        <button 
          onClick={() => setActiveTab('circular')}
          className={`px-6 py-2 rounded-md transition-colors ${activeTab === 'circular' ? 'bg-wood-dark text-white shadow-sm' : 'text-wood-medium'}`}
        >
          圓周孔位
        </button>
      </div>

      {activeTab === 'linear' && (
        <>
          <div className="card-panel">
            <div className="grid grid-cols-2 gap-3">
              <div className="input-group col-span-2">
                <label className="text-sm font-bold">總長度 <span className="unit-label">cm</span></label>
                <input type="number" value={totalLength} onChange={e => setTotalLength(e.target.value)} className="input-field" />
              </div>
              <div className="input-group">
                <label className="text-sm font-bold">數量 (含兩端)</label>
                <input type="number" value={count} onChange={e => setCount(e.target.value)} className="input-field" />
              </div>
              <div className="input-group">
                <label className="text-sm font-bold">間距</label>
                <div className="input-field bg-wood-bg font-mono font-bold text-wood-accent">
                  {spacing.toFixed(2)} <span className="text-[10px]">cm</span>
                </div>
              </div>
              <div className="input-group">
                <label className="text-sm font-bold">起始偏移 <span className="unit-label">cm</span></label>
                <input type="number" value={startOffset} onChange={e => setStartOffset(e.target.value)} className="input-field" />
              </div>
              <div className="input-group">
                <label className="text-sm font-bold">末端偏移 <span className="unit-label">cm</span></label>
                <input type="number" value={endOffset} onChange={e => setEndOffset(e.target.value)} className="input-field" />
              </div>
            </div>
          </div>

          <div className="card-panel">
            <h3 className="font-bold text-sm mb-3">各點位置 (從起點算起)</h3>
            <div className="grid grid-cols-3 gap-2">
              {points.map((p, i) => (
                <div key={i} className="bg-wood-bg p-2 rounded text-center border border-wood-light/10">
                  <div className="text-[10px] text-wood-light">點 {i + 1}</div>
                  <div className="font-mono font-bold">{p.toFixed(1)}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'circular' && (
        <>
          <div className="card-panel">
            <div className="grid grid-cols-2 gap-3">
              <div className="input-group">
                <label className="text-sm font-bold">半徑 <span className="unit-label">cm</span></label>
                <input type="number" value={radius} onChange={e => setRadius(e.target.value)} className="input-field" />
              </div>
              <div className="input-group">
                <label className="text-sm font-bold">孔數</label>
                <input type="number" value={holeCount} onChange={e => setHoleCount(e.target.value)} className="input-field" />
              </div>
              <div className="input-group col-span-2">
                <label className="text-sm font-bold">起始角度 (度)</label>
                <input type="number" value={startAngle} onChange={e => setStartAngle(e.target.value)} className="input-field" />
              </div>
            </div>
          </div>

          <div className="card-panel">
            <h3 className="font-bold text-sm mb-3">座標清單 (圓心為 0,0)</h3>
            <div className="flex flex-col gap-2">
              {holes.map((h, i) => (
                <div key={i} className="flex items-center justify-between bg-wood-bg p-2 rounded border border-wood-light/10">
                  <div className="font-bold text-xs">孔 {i + 1} ({h.angle.toFixed(1)}°)</div>
                  <div className="font-mono text-sm">
                    X: <span className="font-bold">{h.x.toFixed(2)}</span>, 
                    Y: <span className="font-bold">{h.y.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
