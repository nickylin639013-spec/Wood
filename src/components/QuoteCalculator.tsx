import React, { useState } from 'react';
import { Plus, Trash2, Copy } from 'lucide-react';

interface HardwareItem {
  id: string;
  name: string;
  price: number;
}

export default function QuoteCalculator({ showToast }: { showToast: (m: string) => void }) {
  // Materials
  const [taiCai, setTaiCai] = useState<string>('');
  const [unitPrice, setUnitPrice] = useState<string>('');
  const [wasteRate, setWasteRate] = useState<string>('15');

  // Labor
  const [hours, setHours] = useState<string>('');
  const [hourlyRate, setHourlyRate] = useState<string>('350');

  // Hardware
  const [hwName, setHwName] = useState<string>('');
  const [hwPrice, setHwPrice] = useState<string>('');
  const [hardwareList, setHardwareList] = useState<HardwareItem[]>([]);

  // Profit
  const [profitRate, setProfitRate] = useState<string>('30');

  const materialCost = (parseFloat(taiCai) || 0) * (1 + (parseFloat(wasteRate) || 0) / 100) * (parseFloat(unitPrice) || 0);
  const laborCost = (parseFloat(hours) || 0) * (parseFloat(hourlyRate) || 0);
  const hardwareCost = hardwareList.reduce((acc, item) => acc + item.price, 0);

  const subtotal = materialCost + laborCost + hardwareCost;
  const profit = subtotal * (parseFloat(profitRate) || 0) / 100;
  const total = subtotal + profit;

  const addHardware = () => {
    if (!hwPrice) return;
    setHardwareList([...hardwareList, {
      id: Date.now().toString(),
      name: hwName || `項目 ${hardwareList.length + 1}`,
      price: parseFloat(hwPrice)
    }]);
    setHwName('');
    setHwPrice('');
    showToast('已加入五金');
  };

  const copyQuote = () => {
    const date = new Date().toLocaleDateString('zh-TW');
    let report = `【方禾家具 報價】\n日期：${date}\n`;
    report += `──────────────────────────\n`;
    report += `材料：$${Math.round(materialCost).toLocaleString()} (${taiCai}才, 損耗${wasteRate}%, $${unitPrice}/才)\n`;
    report += `工時：$${Math.round(laborCost).toLocaleString()} (${hours} hr × $${hourlyRate})\n`;
    if (hardwareList.length > 0) {
      report += `五金：$${Math.round(hardwareCost).toLocaleString()}\n`;
      hardwareList.forEach(item => {
        report += `  - ${item.name}: $${item.price.toLocaleString()}\n`;
      });
    }
    report += `──────────────────────────\n`;
    report += `小計：$${Math.round(subtotal).toLocaleString()}\n`;
    report += `利潤(${profitRate}%)：$${Math.round(profit).toLocaleString()}\n`;
    report += `總計：$${Math.round(total).toLocaleString()}\n`;

    navigator.clipboard.writeText(report);
    showToast('報價已複製');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="card-panel">
        <h3 className="font-bold mb-3 text-wood-medium border-b border-wood-light/10 pb-1">1. 材料費</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="input-group">
            <label className="text-xs font-bold">用料才數</label>
            <input type="number" value={taiCai} onChange={e => setTaiCai(e.target.value)} className="input-field" placeholder="0" />
          </div>
          <div className="input-group">
            <label className="text-xs font-bold">單價 <span className="unit-label">元/才</span></label>
            <input type="number" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} className="input-field" placeholder="0" />
          </div>
          <div className="input-group">
            <label className="text-xs font-bold">損耗率 (%)</label>
            <input type="number" value={wasteRate} onChange={e => setWasteRate(e.target.value)} className="input-field" />
          </div>
          <div className="flex items-end mb-4">
            <div className="text-right w-full">
              <div className="text-[10px] text-wood-light">材料小計</div>
              <div className="font-mono font-bold text-lg text-wood-dark">${Math.round(materialCost).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-panel">
        <h3 className="font-bold mb-3 text-wood-medium border-b border-wood-light/10 pb-1">2. 工時費</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="input-group">
            <label className="text-xs font-bold">預估工時 <span className="unit-label">hr</span></label>
            <input type="number" value={hours} onChange={e => setHours(e.target.value)} className="input-field" placeholder="0" />
          </div>
          <div className="input-group">
            <label className="text-xs font-bold">時薪 <span className="unit-label">元/hr</span></label>
            <input type="number" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} className="input-field" />
          </div>
        </div>
      </div>

      <div className="card-panel">
        <h3 className="font-bold mb-3 text-wood-medium border-b border-wood-light/10 pb-1">3. 五金 / 其他</h3>
        <div className="flex gap-2 mb-3">
          <input type="text" value={hwName} onChange={e => setHwName(e.target.value)} placeholder="品名" className="input-field flex-1 py-1" />
          <input type="number" value={hwPrice} onChange={e => setHwPrice(e.target.value)} placeholder="金額" className="input-field w-24 py-1" />
          <button onClick={addHardware} className="btn-primary p-2 flex items-center justify-center">
            <Plus size={20} />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {hardwareList.map(item => (
            <div key={item.id} className="flex items-center justify-between bg-wood-bg px-3 py-2 rounded text-sm">
              <span>{item.name}</span>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold">${item.price.toLocaleString()}</span>
                <button onClick={() => setHardwareList(hardwareList.filter(i => i.id !== item.id))} className="text-red-400">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-panel bg-wood-dark text-white shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">報價摘要</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs opacity-70">利潤率</span>
            <input 
              type="number" 
              value={profitRate} 
              onChange={e => setProfitRate(e.target.value)}
              className="bg-white/10 border border-white/20 rounded px-2 py-1 w-16 text-center text-white outline-none"
            />
            <span className="text-xs opacity-70">%</span>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between opacity-80">
            <span>材料費</span>
            <span className="font-mono">${Math.round(materialCost).toLocaleString()}</span>
          </div>
          <div className="flex justify-between opacity-80">
            <span>工時費</span>
            <span className="font-mono">${Math.round(laborCost).toLocaleString()}</span>
          </div>
          <div className="flex justify-between opacity-80">
            <span>五金/其他</span>
            <span className="font-mono">${Math.round(hardwareCost).toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-white/10">
            <span>小計</span>
            <span className="font-mono font-bold">${Math.round(subtotal).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-wood-accent">
            <span>利潤 ({profitRate}%)</span>
            <span className="font-mono font-bold">${Math.round(profit).toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t-2 border-wood-accent flex justify-between items-center">
          <span className="text-lg font-bold">總計金額</span>
          <span className="text-3xl font-mono font-bold text-wood-accent">${Math.round(total).toLocaleString()}</span>
        </div>
      </div>

      <button onClick={copyQuote} className="btn-secondary w-full flex items-center justify-center gap-2 mb-8">
        <Copy size={18} /> 複製報價文字
      </button>
    </div>
  );
}
