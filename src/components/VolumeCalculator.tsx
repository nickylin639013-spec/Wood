import React, { useState, useMemo } from 'react';
import { TAI_CHI_CM, TAI_TSUN_CM, TAI_CAI_CM3, BOARD_FOOT_CM3, INCH_CM } from '../constants';
import { Shape, Unit, BatchItem } from '../types';
import { Trash2, Plus, Copy, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function VolumeCalculator({ showToast }: { showToast: (m: string) => void }) {
  const [activeTab, setActiveTab] = useState<'single' | 'batch'>('single');
  const [unit, setUnit] = useState<Unit>('cm');
  const [shape, setShape] = useState<Shape>('rect');
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [thickness, setThickness] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');
  const [wasteRate, setWasteRate] = useState<string>('15');
  const [itemName, setItemName] = useState<string>('');
  const [batchList, setBatchList] = useState<BatchItem[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const calculateVolume = (l: number, w: number, t: number, q: number, s: Shape, u: Unit) => {
    let lCm = l, wCm = w, tCm = t;
    if (u === 'in') {
      lCm = l * INCH_CM;
      wCm = w * INCH_CM;
      tCm = t * INCH_CM;
    } else if (u === 'tai') {
      lCm = l * TAI_CHI_CM;
      wCm = w * TAI_CHI_CM;
      tCm = t * TAI_TSUN_CM;
    }

    let vol = 0;
    if (s === 'rect') {
      vol = lCm * wCm * tCm;
    } else {
      // Log: width is diameter
      vol = Math.PI * Math.pow(wCm / 2, 2) * lCm;
    }
    return vol * q;
  };

  const currentVolume = useMemo(() => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const t = parseFloat(thickness) || 0;
    const q = parseFloat(quantity) || 1;
    return calculateVolume(l, w, t, q, shape, unit);
  }, [length, width, thickness, quantity, shape, unit]);

  const currentTaiCai = currentVolume / TAI_CAI_CM3;
  const currentBoardFoot = currentVolume / BOARD_FOOT_CM3;
  const currentM3 = currentVolume / 1000000;
  const currentShi = currentTaiCai / 10;

  const totalTaiCai = batchList.reduce((acc, item) => acc + item.taiCai, 0);
  const totalWithWaste = totalTaiCai * (1 + (parseFloat(wasteRate) || 0) / 100);

  const addToBatch = () => {
    if (!length || !width || (shape === 'rect' && !thickness)) return;
    const newItem: BatchItem = {
      id: Date.now().toString(),
      name: itemName || `項目 ${batchList.length + 1}`,
      length: parseFloat(length),
      width: parseFloat(width),
      thickness: parseFloat(thickness) || 0,
      quantity: parseFloat(quantity) || 1,
      shape,
      unit,
      volumeCm3: currentVolume,
      taiCai: currentTaiCai
    };
    setBatchList([...batchList, newItem]);
    setItemName('');
    showToast('已加入清單');
  };

  const copyReport = () => {
    const date = new Date().toLocaleDateString('zh-TW');
    let report = `【方禾家具 材數估料單】\n日期：${date}\n`;
    report += `──────────────────────────\n`;
    batchList.forEach((item, i) => {
      const unitStr = item.unit === 'tai' ? '台尺/寸' : item.unit;
      report += `${i + 1}. ${item.name}: ${item.length}x${item.width}${item.shape === 'rect' ? 'x' + item.thickness : ''} (${unitStr}) x ${item.quantity}支 = ${item.taiCai.toFixed(2)} 才\n`;
    });
    report += `──────────────────────────\n`;
    report += `合計才數：${totalTaiCai.toFixed(2)} 才\n`;
    report += `損耗率：${wasteRate}%\n`;
    report += `備料量：${totalWithWaste.toFixed(2)} 才\n`;
    
    navigator.clipboard.writeText(report);
    showToast('報告已複製');
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Custom Confirm Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black/50 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-2xl"
            >
              <h4 className="font-bold text-lg mb-2">確認清空？</h4>
              <p className="text-wood-light text-sm mb-6">這將會移除清單中所有的項目，且無法復原。</p>
              <div className="flex gap-3">
                <button onClick={() => setShowClearConfirm(false)} className="flex-1 py-2 rounded-lg bg-wood-bg text-wood-medium font-bold">取消</button>
                <button onClick={() => { setBatchList([]); setShowClearConfirm(false); }} className="flex-1 py-2 rounded-lg bg-red-600 text-white font-bold">確定清空</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Sub Tabs */}
      <div className="flex bg-wood-bg p-1 rounded-lg self-center mb-2">
        <button 
          onClick={() => setActiveTab('single')}
          className={`px-6 py-2 rounded-md transition-colors ${activeTab === 'single' ? 'bg-wood-dark text-white shadow-sm' : 'text-wood-medium'}`}
        >
          單件計算
        </button>
        <button 
          onClick={() => setActiveTab('batch')}
          className={`px-6 py-2 rounded-md transition-colors ${activeTab === 'batch' ? 'bg-wood-dark text-white shadow-sm' : 'text-wood-medium'}`}
        >
          批次估料
        </button>
      </div>

      <div className="card-panel">
        {/* Unit Selector */}
        <div className="flex gap-2 mb-4">
          {(['cm', 'in', 'tai'] as Unit[]).map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={`flex-1 py-2 rounded-lg border-2 transition-all ${unit === u ? 'border-wood-accent bg-yellow-50 text-wood-dark font-bold' : 'border-wood-light/20 text-wood-light'}`}
            >
              {u === 'cm' ? '公分 cm' : u === 'in' ? '英吋 in' : '台尺台寸'}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-3">
          {activeTab === 'batch' && (
            <div className="input-group col-span-2">
              <label className="text-sm font-bold">品名</label>
              <input 
                type="text" 
                value={itemName} 
                onChange={(e) => setItemName(e.target.value)}
                className="input-field"
                placeholder="例如：桌腳、面板..."
              />
            </div>
          )}
          <div className="input-group">
            <label className="text-sm font-bold">長度 <span className="unit-label">{unit === 'tai' ? '台尺' : unit}</span></label>
            <input 
              type="number" 
              value={length} 
              onChange={(e) => setLength(e.target.value)}
              className="input-field"
              placeholder="0"
            />
          </div>
          <div className="input-group">
            <label className="text-sm font-bold">{shape === 'rect' ? '寬度' : '直徑'} <span className="unit-label">{unit === 'tai' ? '台尺' : unit}</span></label>
            <input 
              type="number" 
              value={width} 
              onChange={(e) => setWidth(e.target.value)}
              className="input-field"
              placeholder="0"
            />
          </div>
          {shape === 'rect' && (
            <div className="input-group">
              <label className="text-sm font-bold">厚度 <span className="unit-label">{unit === 'tai' ? '台寸' : unit}</span></label>
              <input 
                type="number" 
                value={thickness} 
                onChange={(e) => setThickness(e.target.value)}
                className="input-field"
                placeholder="0"
              />
            </div>
          )}
          <div className="input-group">
            <label className="text-sm font-bold">數量</label>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                value={quantity} 
                onChange={(e) => setQuantity(e.target.value)}
                className="input-field flex-1"
                placeholder="1"
              />
              <span className="text-sm text-wood-light">支</span>
            </div>
          </div>
          <div className="input-group col-span-2">
            <label className="text-sm font-bold">形狀</label>
            <select 
              value={shape} 
              onChange={(e) => setShape(e.target.value as Shape)}
              className="input-field"
            >
              <option value="rect">方材 / 板材</option>
              <option value="log">圓木</option>
            </select>
          </div>
        </div>

        {activeTab === 'batch' && (
          <button onClick={addToBatch} className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
            <Plus size={20} /> 加入清單
          </button>
        )}
      </div>

      {/* Results for Single Item */}
      {activeTab === 'single' && (
        <div className="card-panel border-wood-accent/50 bg-yellow-50/30">
          <div className="text-center mb-4">
            <div className="text-wood-light text-sm font-medium">計算結果</div>
            <div className="text-4xl font-mono font-bold text-wood-dark">
              {currentTaiCai.toFixed(2)} <span className="text-lg">台才</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white p-2 rounded border border-wood-light/10 text-center">
              <div className="text-[10px] text-wood-light uppercase">材 (石)</div>
              <div className="font-mono font-bold">{currentShi.toFixed(3)}</div>
            </div>
            <div className="bg-white p-2 rounded border border-wood-light/10 text-center">
              <div className="text-[10px] text-wood-light uppercase">板呎 BF</div>
              <div className="font-mono font-bold">{currentBoardFoot.toFixed(2)}</div>
            </div>
            <div className="bg-white p-2 rounded border border-wood-light/10 text-center">
              <div className="text-[10px] text-wood-light uppercase">立方公尺 m³</div>
              <div className="font-mono font-bold">{currentM3.toFixed(5)}</div>
            </div>
            <div className="bg-white p-2 rounded border border-wood-light/10 text-center">
              <div className="text-[10px] text-wood-light uppercase">立方公分 cm³</div>
              <div className="font-mono font-bold">{Math.round(currentVolume).toLocaleString()}</div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-wood-light/20">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold">損耗率 (%)</label>
              <input 
                type="number" 
                value={wasteRate} 
                onChange={(e) => setWasteRate(e.target.value)}
                className="input-field w-20 py-1 text-center"
              />
            </div>
            <div className="flex items-center justify-between text-wood-medium font-bold">
              <span>預估備料量</span>
              <span className="text-xl font-mono text-wood-accent">
                {(currentTaiCai * (1 + (parseFloat(wasteRate) || 0) / 100)).toFixed(2)} 台才
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Batch List */}
      {activeTab === 'batch' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold">估料清單 ({batchList.length})</h3>
            <button 
              onClick={() => setShowClearConfirm(true)}
              className="text-red-600 text-sm flex items-center gap-1"
            >
              <RotateCcw size={14} /> 清空
            </button>
          </div>
          
          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {batchList.map((item) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-3 rounded-lg border border-wood-light/20 flex items-center justify-between shadow-sm"
                >
                  <div className="flex-1">
                    <div className="font-bold text-sm">{item.name}</div>
                    <div className="text-xs text-wood-light font-mono">
                      {item.length}x{item.width}{item.shape === 'rect' ? 'x' + item.thickness : ''} ({item.unit}) x {item.quantity}
                    </div>
                  </div>
                  <div className="text-right mr-3">
                    <div className="font-mono font-bold text-wood-dark">{item.taiCai.toFixed(2)}</div>
                    <div className="text-[10px] text-wood-light">台才</div>
                  </div>
                  <button 
                    onClick={() => setBatchList(batchList.filter(i => i.id !== item.id))}
                    className="text-red-400 p-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {batchList.length === 0 && (
              <div className="text-center py-8 text-wood-light italic text-sm">尚未加入任何項目</div>
            )}
          </div>

          {batchList.length > 0 && (
            <div className="mt-2 flex flex-col gap-3">
              <div className="bg-wood-dark text-white p-4 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm opacity-80">合計才數</span>
                  <span className="text-2xl font-mono font-bold">{totalTaiCai.toFixed(2)} 才</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/20">
                  <div className="flex items-center gap-2">
                    <span className="text-sm opacity-80">損耗</span>
                    <input 
                      type="number" 
                      value={wasteRate} 
                      onChange={(e) => setWasteRate(e.target.value)}
                      className="bg-white/10 border border-white/20 rounded px-2 py-0.5 w-14 text-center text-white text-sm outline-none focus:border-wood-accent"
                    />
                    <span className="text-sm opacity-80">%</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] opacity-60 uppercase">備料量</div>
                    <div className="text-xl font-mono font-bold text-wood-accent">{totalWithWaste.toFixed(2)} 才</div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={copyReport}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <Copy size={18} /> 複製文字報告
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
