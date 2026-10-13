import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Zap, 
  ShieldCheck, 
  Activity, 
  RefreshCw,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { ArbitrageCommodity, ArbitrageLedgerRecord } from '../types';

export const AutoArbitrageEmpire: React.FC = () => {
  const [commodities, setCommodities] = useState<ArbitrageCommodity[]>([]);
  const [ledger, setLedger] = useState<ArbitrageLedgerRecord[]>([]);
  const [empireCash, setEmpireCash] = useState<number>(1845000);
  const [overnightProfit, setOvernightProfit] = useState<number>(68400);
  const [loading, setLoading] = useState(false);

  const fetchArbitrageData = async () => {
    try {
      const res = await fetch('/api/economy/arbitrage');
      const data = await res.json();
      if (data.commodities) setCommodities(data.commodities);
      if (data.ledger) setLedger(data.ledger);
      if (data.empireLiquidCash) setEmpireCash(data.empireLiquidCash);
      if (data.offlineEarningsOvernight) setOvernightProfit(data.offlineEarningsOvernight);
    } catch (err) {
      console.error('Arbitrage fetch error:', err);
    }
  };

  useEffect(() => {
    fetchArbitrageData();
  }, []);

  const handleExecuteTrade = async (action: 'BUY' | 'SELL' | 'TOGGLE_AUTO', commodityId: string, units = 10) => {
    setLoading(true);
    try {
      const res = await fetch('/api/economy/arbitrage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, commodityId, units }),
      });
      const data = await res.json();
      if (data.commodities) setCommodities(data.commodities);
      if (data.ledger) setLedger(data.ledger);
      if (data.empireLiquidCash) setEmpireCash(data.empireLiquidCash);
    } catch (err) {
      console.error('Trade execution error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/60 p-4 sm:p-5 rounded-xl border border-slate-800 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase tracking-wider">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>The Offline Empire // Auto-Arbitrage Execution Loop</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
            AUTONOMOUS COMMODITY TRADING MACRO
          </h2>
          <p className="text-xs text-slate-400">
            Executes buy/sell orders via sanctioned Social Club APIs while you sleep. Capitalizes on 4:00 AM turf war inventory shortages.
          </p>
        </div>

        {/* Liquid Empire Bankroll Header */}
        <div className="flex items-center space-x-3 font-mono">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-right">
            <div className="text-[10px] text-slate-400 uppercase">Empire Liquid Cash</div>
            <div className="text-xl font-bold text-emerald-400 font-display">
              ${empireCash.toLocaleString()}
            </div>
          </div>
          <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/40 text-right">
            <div className="text-[10px] text-emerald-300 uppercase">Overnight Gain</div>
            <div className="text-xl font-bold text-emerald-300 font-display">
              +${overnightProfit.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Commodity Market Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {commodities.map((comm) => (
          <div
            key={comm.id}
            className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3 font-mono text-xs flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  {comm.category}
                </span>
                <span
                  className={`flex items-center space-x-1 font-bold ${
                    comm.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {comm.change24h >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>{comm.change24h >= 0 ? `+${comm.change24h}%` : `${comm.change24h}%`}</span>
                </span>
              </div>

              <h4 className="text-base font-bold font-display text-white">
                {comm.name}
              </h4>

              <div className="mt-2 flex items-baseline justify-between">
                <div>
                  <span className="text-slate-500 text-[10px]">Current Price:</span>
                  <div className="text-lg font-bold text-white">${comm.currentPrice.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 text-[10px]">Vault Holdings:</span>
                  <div className="text-sm font-bold text-cyan-300">{comm.ownedUnits} Units</div>
                </div>
              </div>

              {/* Forecast Alert */}
              <div className="mt-2.5 p-2 rounded bg-slate-900 border border-slate-800 text-[11px] space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span className="text-amber-400 font-semibold">{comm.forecastTrend}</span>
                  <span className="text-slate-500">{comm.predictedSurgeTime}</span>
                </div>
                <p className="text-[10px] text-slate-300 line-clamp-2">
                  {comm.catalystEvent}
                </p>
              </div>
            </div>

            {/* Trading Controls & Auto-Trade Switch */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Offline Auto-Trading:</span>
                <button
                  type="button"
                  onClick={() => handleExecuteTrade('TOGGLE_AUTO', comm.id)}
                  className={`px-2 py-0.5 rounded font-bold text-[10px] border transition-all ${
                    comm.autoTradeActive
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  {comm.autoTradeActive ? 'ENABLED' : 'PAUSED'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleExecuteTrade('BUY', comm.id, 10)}
                  className="py-1.5 rounded bg-emerald-600/25 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 font-bold text-xs flex items-center justify-center space-x-1 transition-colors"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Buy 10</span>
                </button>

                <button
                  type="button"
                  disabled={loading || comm.ownedUnits < 10}
                  onClick={() => handleExecuteTrade('SELL', comm.id, 10)}
                  className="py-1.5 rounded bg-rose-600/25 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center justify-center space-x-1 transition-colors disabled:opacity-40"
                >
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  <span>Sell 10</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Immutable Transaction Ledger */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
              Autonomous Trade Execution Ledger ({ledger.length} Records)
            </h3>
          </div>
          <span className="font-mono text-xs text-slate-500">Zod Checksum Verified</span>
        </div>

        <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
          {ledger.map((record) => (
            <div
              key={record.id}
              className="p-3 rounded-lg bg-slate-900/70 border border-slate-800/80 font-mono text-xs flex flex-wrap items-center justify-between gap-2"
            >
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  record.action === 'AUTONOMOUS_BUY'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-pink-500/20 text-pink-300 border-pink-500/40'
                }`}>
                  {record.action}
                </span>
                <span className="text-white font-bold">{record.commodityName}</span>
                <span className="text-slate-500 text-[11px]">x{record.units} @ ${record.unitPrice}</span>
              </div>

              <div className="flex items-center space-x-4 text-xs">
                {record.netProfit > 0 && (
                  <span className="text-emerald-400 font-bold">
                    +${record.netProfit.toLocaleString()} Net Gain
                  </span>
                )}
                <span className="text-slate-400 text-[10px]">{record.triggerEvent}</span>
                <span className="text-slate-600 text-[10px]">{record.zodChecksum}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
