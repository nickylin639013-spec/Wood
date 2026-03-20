import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Layout, RefreshCw } from 'lucide-react';
import { COLORS } from '../constants';
import { CutPart, CutResult } from '../types';

export default function CutOptimizer() {
  const [boardWidth, setBoardWidth] = useState<string>('240');
  const [boardHeight, setBoardHeight] = useState<string>('120');
  const [kerf, setKerf] = useState<string>('0.3');
  
  const [partWidth, setPartWidth] = useState<string>('');
  const [partHeight, setPartHeight] = useState<string>('');
  const [partQty, setPartQty] = useState<string>('1');
  const [partName, setPartName] = useState<string>('');
  
  const [parts, setParts] = useState<CutPart[]>([]);
  const [result, setResult] = useState<CutResult | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const addPart = () => {
    if (!partWidth || !partHeight || !partQty) return;
    const newPart: CutPart = {
      id: Date.now().toString(),
      name: partName || `部件 ${parts.length + 1}`,
      width: parseFloat(partWidth),
      height: parseFloat(partHeight),
      quantity: parseInt(partQty),
      color: COLORS[parts.length % COLORS.length]
    };
    setParts([...parts, newPart]);
    setPartWidth('');
    setPartHeight('');
    setPartQty('1');
    setPartName('');
  };

  const optimize = () => {
    const bw = parseFloat(boardWidth);
    const bh = parseFloat(boardHeight);
    const k = parseFloat(kerf);
    
    if (isNaN(bw) || isNaN(bh) || parts.length === 0) return;

    // Flatten parts by quantity
    let allPartsToPlace: { id: string; name: string; w: number; h: number; color: string }[] = [];
    parts.forEach(p => {
      for (let i = 0; i < p.quantity; i++) {
        allPartsToPlace.push({ id: p.id, name: p.name, w: p.width, h: p.height, color: p.color });
      }
    });

    // Sort by area descending
    allPartsToPlace.sort((a, b) => (b.w * b.h) - (a.w * a.h));

    const sheets: CutResult['sheets'] = [];
    let totalPartArea = 0;

    const createNewSheet = () => ({
      width: bw,
      height: bh,
      placedParts: [] as CutResult['sheets'][0]['placedParts']
    });

    let currentSheet = createNewSheet();
    sheets.push(currentSheet);

    // FFDS (First Fit Decreasing Shelf)
    let shelves: { y: number; height: number; x: number }[] = [{ y: 0, height: 0, x: 0 }];

    allPartsToPlace.forEach(p => {
      totalPartArea += p.w * p.h;
      let placed = false;

      // Try each sheet
      for (let sIdx = 0; sIdx < sheets.length; sIdx++) {
        const sheet = sheets[sIdx];
        // This is a simplified shelf algorithm for the demo
        // In a real app, we'd track shelves per sheet
      }

      // Simplified placement logic for the toolbox
      // We'll use a basic shelf approach on the current sheet
      const tryPlace = (sheet: typeof currentSheet, part: typeof p) => {
        // Try normal and rotated
        const orientations = [
          { w: part.w, h: part.h, rot: false },
          { w: part.h, h: part.w, rot: true }
        ];

        for (const orient of orientations) {
          // Find a shelf that fits
          for (let i = 0; i < shelves.length; i++) {
            const shelf = shelves[i];
            if (shelf.x + orient.w <= bw && shelf.y + orient.h <= bh) {
              // Fits in this shelf
              sheet.placedParts.push({
                part: parts.find(orig => orig.id === part.id)!,
                x: shelf.x,
                y: shelf.y,
                w: orient.w,
                h: orient.h,
                rotated: orient.rot
              });
              shelf.x += orient.w + k;
              shelf.height = Math.max(shelf.height, orient.h);
              return true;
            }
          }

          // Try new shelf
          const lastShelf = shelves[shelves.length - 1];
          const newY = lastShelf.y + lastShelf.height + k;
          if (newY + orient.h <= bh && orient.w <= bw) {
            const newShelf = { y: newY, height: orient.h, x: orient.w + k };
            shelves.push(newShelf);
            sheet.placedParts.push({
              part: parts.find(orig => orig.id === part.id)!,
              x: 0,
              y: newY,
              w: orient.w,
              h: orient.h,
              rotated: orient.rot
            });
            return true;
          }
        }
        return false;
      };

      if (!tryPlace(currentSheet, p)) {
        // New sheet
        currentSheet = createNewSheet();
        sheets.push(currentSheet);
        shelves = [{ y: 0, height: 0, x: 0 }];
        tryPlace(currentSheet, p);
      }
    });

    const totalBoardArea = sheets.length * bw * bh;
    setResult({
      sheets,
      utilization: (totalPartArea / totalBoardArea) * 100,
      wasteArea: totalBoardArea - totalPartArea
    });
  };

  useEffect(() => {
    if (!result || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sheet = result.sheets[0]; // Draw first sheet for preview
    const padding = 20;
    const availableWidth = canvas.width - padding * 2;
    const scale = availableWidth / sheet.width;
    canvas.height = sheet.height * scale + padding * 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Board
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 2;
    ctx.strokeRect(padding, padding, sheet.width * scale, sheet.height * scale);
    ctx.fillStyle = '#FAF6F1';
    ctx.fillRect(padding, padding, sheet.width * scale, sheet.height * scale);

    // Draw Parts
    sheet.placedParts.forEach(pp => {
      ctx.fillStyle = pp.part.color + '88';
      ctx.strokeStyle = pp.part.color;
      ctx.lineWidth = 1;
      
      const px = padding + pp.x * scale;
      const py = padding + pp.y * scale;
      const pw = pp.w * scale;
      const ph = pp.h * scale;

      ctx.fillRect(px, py, pw, ph);
      ctx.strokeRect(px, py, pw, ph);

      // Label
      ctx.fillStyle = '#3E2723';
      ctx.font = '10px sans-serif';
      const label = pp.part.name.substring(0, 4);
      ctx.fillText(label, px + 2, py + 12);
    });
  }, [result]);

  return (
    <div className="flex flex-col gap-4">
      <div className="card-panel">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Layout size={18} className="text-wood-accent" /> 板材規格
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="input-group">
            <label className="text-xs font-bold">長度 <span className="unit-label">cm</span></label>
            <input type="number" value={boardWidth} onChange={e => setBoardWidth(e.target.value)} className="input-field py-1" />
          </div>
          <div className="input-group">
            <label className="text-xs font-bold">寬度 <span className="unit-label">cm</span></label>
            <input type="number" value={boardHeight} onChange={e => setBoardHeight(e.target.value)} className="input-field py-1" />
          </div>
          <div className="input-group">
            <label className="text-xs font-bold">鋸路 <span className="unit-label">cm</span></label>
            <input type="number" value={kerf} onChange={e => setKerf(e.target.value)} className="input-field py-1" />
          </div>
        </div>
      </div>

      <div className="card-panel">
        <h3 className="font-bold mb-3">新增部件</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="input-group col-span-2">
            <input type="text" value={partName} onChange={e => setPartName(e.target.value)} placeholder="部件名稱 (選填)" className="input-field py-1" />
          </div>
          <div className="input-group">
            <label className="text-xs font-bold">長度 <span className="unit-label">cm</span></label>
            <input type="number" value={partWidth} onChange={e => setPartWidth(e.target.value)} className="input-field py-1" />
          </div>
          <div className="input-group">
            <label className="text-xs font-bold">寬度 <span className="unit-label">cm</span></label>
            <input type="number" value={partHeight} onChange={e => setPartHeight(e.target.value)} className="input-field py-1" />
          </div>
          <div className="input-group">
            <label className="text-xs font-bold">數量</label>
            <input type="number" value={partQty} onChange={e => setPartQty(e.target.value)} className="input-field py-1" />
          </div>
          <div className="flex items-end mb-4">
            <button onClick={addPart} className="btn-primary w-full py-2 flex items-center justify-center gap-1 text-sm">
              <Plus size={16} /> 加入
            </button>
          </div>
        </div>

        {parts.length > 0 && (
          <div className="mt-2 border-t border-wood-light/10 pt-2">
            <div className="text-xs font-bold text-wood-light mb-2">待排版部件:</div>
            <div className="flex flex-wrap gap-2">
              {parts.map(p => (
                <div key={p.id} className="flex items-center gap-1 bg-wood-bg px-2 py-1 rounded border border-wood-light/20 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></div>
                  <span>{p.name} {p.width}x{p.height} x{p.quantity}</span>
                  <button onClick={() => setParts(parts.filter(i => i.id !== p.id))} className="text-red-500 ml-1">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={optimize} className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
              <RefreshCw size={18} /> 開始優化排版
            </button>
          </div>
        )}
      </div>

      {result && (
        <div className="card-panel border-wood-accent/50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">排版結果</h3>
            <div className="text-right">
              <div className="text-xs text-wood-light">利用率</div>
              <div className="text-xl font-mono font-bold text-wood-accent">{result.utilization.toFixed(1)}%</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-wood-bg p-2 rounded text-center">
              <div className="text-[10px] text-wood-light">所需板材</div>
              <div className="font-mono font-bold text-lg">{result.sheets.length} 片</div>
            </div>
            <div className="bg-wood-bg p-2 rounded text-center">
              <div className="text-[10px] text-wood-light">廢料面積</div>
              <div className="font-mono font-bold text-lg">{Math.round(result.wasteArea)} <span className="text-xs">cm²</span></div>
            </div>
          </div>

          <div className="overflow-x-auto bg-wood-bg rounded-lg p-2 flex justify-center">
            <canvas ref={canvasRef} width={320} className="max-w-full h-auto" />
          </div>
          <p className="text-[10px] text-wood-light mt-2 text-center">※ 預覽僅顯示第一張板材，實際需要 {result.sheets.length} 片</p>
        </div>
      )}
    </div>
  );
}
