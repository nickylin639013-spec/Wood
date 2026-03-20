import React from 'react';

export default function ReferenceTables() {
  return (
    <div className="flex flex-col gap-4 pb-8">
      <div className="card-panel">
        <h3 className="font-bold mb-3 text-wood-medium border-b border-wood-light/10 pb-1">表 1：單位定義</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-wood-bg">
              <tr>
                <th className="p-2 text-left">單位</th>
                <th className="p-2 text-left">換算</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-wood-light/5">
                <td className="p-2 font-bold">1 台尺</td>
                <td className="p-2 font-mono">30.303 cm</td>
              </tr>
              <tr className="border-b border-wood-light/5">
                <td className="p-2 font-bold">1 台寸</td>
                <td className="p-2 font-mono">3.0303 cm</td>
              </tr>
              <tr className="border-b border-wood-light/5">
                <td className="p-2 font-bold">1 台才</td>
                <td className="p-2 font-mono">1尺 x 1尺 x 1寸</td>
              </tr>
              <tr className="border-b border-wood-light/5">
                <td className="p-2 font-bold">1 材 (石)</td>
                <td className="p-2 font-mono">10 台才</td>
              </tr>
              <tr className="border-b border-wood-light/5">
                <td className="p-2 font-bold">1 板呎 BF</td>
                <td className="p-2 font-mono">1" x 12" x 12"</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-panel">
        <h3 className="font-bold mb-3 text-wood-medium border-b border-wood-light/10 pb-1">表 2：常用板材尺寸 (cm)</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-wood-bg p-2 rounded flex justify-between">
            <span>3 x 6 尺</span>
            <span className="font-mono">91 x 182</span>
          </div>
          <div className="bg-wood-bg p-2 rounded flex justify-between">
            <span>4 x 8 尺</span>
            <span className="font-mono">122 x 244</span>
          </div>
          <div className="bg-wood-bg p-2 rounded flex justify-between">
            <span>3 x 7 尺</span>
            <span className="font-mono">91 x 212</span>
          </div>
          <div className="bg-wood-bg p-2 rounded flex justify-between">
            <span>4 x 4 尺</span>
            <span className="font-mono">122 x 122</span>
          </div>
        </div>
      </div>

      <div className="card-panel">
        <h3 className="font-bold mb-3 text-wood-medium border-b border-wood-light/10 pb-1">表 3：常用厚度換算</h3>
        <div className="grid grid-cols-3 gap-2 text-xs text-center">
          <div className="bg-wood-bg p-2 rounded">
            <div className="text-wood-light">2 分</div>
            <div className="font-mono font-bold">0.6 cm</div>
          </div>
          <div className="bg-wood-bg p-2 rounded">
            <div className="text-wood-light">3 分</div>
            <div className="font-mono font-bold">0.9 cm</div>
          </div>
          <div className="bg-wood-bg p-2 rounded">
            <div className="text-wood-light">4 分</div>
            <div className="font-mono font-bold">1.2 cm</div>
          </div>
          <div className="bg-wood-bg p-2 rounded">
            <div className="text-wood-light">6 分</div>
            <div className="font-mono font-bold">1.8 cm</div>
          </div>
          <div className="bg-wood-bg p-2 rounded">
            <div className="text-wood-light">1 吋</div>
            <div className="font-mono font-bold">2.54 cm</div>
          </div>
          <div className="bg-wood-bg p-2 rounded">
            <div className="text-wood-light">1.2 吋</div>
            <div className="font-mono font-bold">3.0 cm</div>
          </div>
        </div>
      </div>

      <div className="card-panel">
        <h3 className="font-bold mb-3 text-wood-medium border-b border-wood-light/10 pb-1">表 4：木材密度參考</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between border-b border-wood-light/5 pb-1">
            <span>松木 (Pine)</span>
            <span className="font-mono">0.4 - 0.5 g/cm³</span>
          </div>
          <div className="flex justify-between border-b border-wood-light/5 pb-1">
            <span>橡木 (Oak)</span>
            <span className="font-mono">0.6 - 0.9 g/cm³</span>
          </div>
          <div className="flex justify-between border-b border-wood-light/5 pb-1">
            <span>胡桃木 (Walnut)</span>
            <span className="font-mono">0.6 - 0.7 g/cm³</span>
          </div>
          <div className="flex justify-between border-b border-wood-light/5 pb-1">
            <span>柚木 (Teak)</span>
            <span className="font-mono">0.6 - 0.8 g/cm³</span>
          </div>
        </div>
      </div>
    </div>
  );
}
