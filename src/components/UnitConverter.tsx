import React, { useState } from 'react';
import { TAI_CHI_CM, TAI_TSUN_CM, TAI_CAI_CM3, BOARD_FOOT_CM3, INCH_CM } from '../constants';

export default function UnitConverter() {
  // Volume
  const [volVal, setVolVal] = useState<string>('1');
  const [volUnit, setVolUnit] = useState<string>('taiCai');

  // Length
  const [lenVal, setLenVal] = useState<string>('30.303');
  const [lenUnit, setLenUnit] = useState<string>('cm');

  const getVolInCm3 = () => {
    const val = parseFloat(volVal) || 0;
    switch (volUnit) {
      case 'taiCai': return val * TAI_CAI_CM3;
      case 'shi': return val * TAI_CAI_CM3 * 10;
      case 'bf': return val * BOARD_FOOT_CM3;
      case 'm3': return val * 1000000;
      case 'cm3': return val;
      default: return 0;
    }
  };

  const cm3 = getVolInCm3();
  const volResults = {
    taiCai: cm3 / TAI_CAI_CM3,
    shi: cm3 / (TAI_CAI_CM3 * 10),
    bf: cm3 / BOARD_FOOT_CM3,
    m3: cm3 / 1000000,
    cm3: cm3,
    taiChi3: cm3 / Math.pow(TAI_CHI_CM, 3)
  };

  const getLenInCm = () => {
    const val = parseFloat(lenVal) || 0;
    switch (lenUnit) {
      case 'cm': return val;
      case 'in': return val * INCH_CM;
      case 'taiChi': return val * TAI_CHI_CM;
      case 'taiTsun': return val * TAI_TSUN_CM;
      case 'mm': return val / 10;
      default: return 0;
    }
  };

  const baseCm = getLenInCm();
  const lenResults = {
    cm: baseCm,
    in: baseCm / INCH_CM,
    taiChi: baseCm / TAI_CHI_CM,
    taiTsun: baseCm / TAI_TSUN_CM,
    mm: baseCm * 10,
    m: baseCm / 100
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="card-panel">
        <h3 className="font-bold mb-4 flex items-center gap-2">📦 材積互轉</h3>
        <div className="flex gap-2 mb-4">
          <input type="number" value={volVal} onChange={e => setVolVal(e.target.value)} className="input-field flex-1" />
          <select value={volUnit} onChange={e => setVolUnit(e.target.value)} className="input-field w-32">
            <option value="taiCai">台才</option>
            <option value="shi">材 (石)</option>
            <option value="bf">板呎 BF</option>
            <option value="m3">m³</option>
            <option value="cm3">cm³</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(volResults).map(([u, val]) => (
            <div key={u} className="bg-wood-bg p-2 rounded border border-wood-light/10">
              <div className="text-[10px] text-wood-light uppercase">
                {u === 'taiCai' ? '台才' : u === 'shi' ? '材 (石)' : u === 'bf' ? '板呎 BF' : u === 'm3' ? '立方公尺 m³' : u === 'cm3' ? '立方公分 cm³' : '立方台尺'}
              </div>
              <div className="font-mono font-bold text-sm truncate">{val.toLocaleString(undefined, { maximumFractionDigits: 4 })}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-panel">
        <h3 className="font-bold mb-4 flex items-center gap-2">📏 長度互轉</h3>
        <div className="flex gap-2 mb-4">
          <input type="number" value={lenVal} onChange={e => setLenVal(e.target.value)} className="input-field flex-1" />
          <select value={lenUnit} onChange={e => setLenUnit(e.target.value)} className="input-field w-32">
            <option value="cm">公分 cm</option>
            <option value="in">英吋 in</option>
            <option value="taiChi">台尺</option>
            <option value="taiTsun">台寸</option>
            <option value="mm">公厘 mm</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(lenResults).map(([u, val]) => (
            <div key={u} className="bg-wood-bg p-2 rounded border border-wood-light/10">
              <div className="text-[10px] text-wood-light uppercase">
                {u === 'cm' ? '公分' : u === 'in' ? '英吋' : u === 'taiChi' ? '台尺' : u === 'taiTsun' ? '台寸' : u === 'mm' ? '公厘' : '公尺'}
              </div>
              <div className="font-mono font-bold text-sm truncate">{val.toLocaleString(undefined, { maximumFractionDigits: 4 })}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
