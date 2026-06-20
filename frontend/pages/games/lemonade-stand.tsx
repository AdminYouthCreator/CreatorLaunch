import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import GamesLayout from '@/components/games/GamesLayout';

type Weather = 'Hot' | 'Warm' | 'Cloudy' | 'Rainy';

interface DayResult {
  day: number;
  weather: Weather;
  price: number;
  cupsMade: number;
  cupsSold: number;
  revenue: number;
  expenses: number;
  profit: number;
  cashAfter: number;
  lesson: string;
}

const weatherOptions: Weather[] = ['Hot', 'Warm', 'Cloudy', 'Rainy'];

const getWeatherForDay = (day: number): Weather => {
  return weatherOptions[(day * 3 + 1) % weatherOptions.length];
};

const weatherDemandMultiplier: Record<Weather, number> = {
  Hot: 1.45,
  Warm: 1.15,
  Cloudy: 0.9,
  Rainy: 0.55,
};

const weatherEmoji: Record<Weather, string> = {
  Hot: '☀️',
  Warm: '🌤️',
  Cloudy: '☁️',
  Rainy: '🌧️',
};

const getLesson = (result: {
  weather: Weather;
  cupsMade: number;
  cupsSold: number;
  price: number;
  profit: number;
}) => {
  if (result.cupsSold === result.cupsMade) {
    return 'You sold out. That means demand was higher than your supply. Next time, you might prepare more inventory.';
  }

  if (result.price > 2.5 && result.cupsSold < result.cupsMade * 0.6) {
    return 'Your price may have been too high for the amount of demand today. Higher prices can increase profit per sale, but reduce customers.';
  }

  if (result.profit < 0) {
    return 'You lost money today. Businesses have to watch expenses carefully because revenue alone does not mean profit.';
  }

  if (result.weather === 'Rainy') {
    return 'Rain lowered demand. External factors can affect sales, even when your product is good.';
  }

  return 'Good job. You balanced supplies, price, and marketing well enough to create profit today.';
};

const LemonadeStandPage: React.FC = () => {
  const [day, setDay] = useState(1);
  const [cash, setCash] = useState(25);
  const [lemons, setLemons] = useState(20);
  const [sugar, setSugar] = useState(10);
  const [cups, setCups] = useState(20);
  const [ice, setIce] = useState(10);
  const [price, setPrice] = useState(1.5);
  const [marketing, setMarketing] = useState(2);
  const [history, setHistory] = useState<DayResult[]>([]);
  const [gameOver, setGameOver] = useState(false);

  const currentWeather = getWeatherForDay(day);

  const supplyCost = useMemo(() => {
    return lemons * 0.2 + sugar * 0.15 + cups * 0.08 + ice * 0.1;
  }, [lemons, sugar, cups, ice]);

  const totalExpenses = Number((supplyCost + marketing).toFixed(2));

  const maxCupsFromSupplies = Math.min(
    Math.floor(lemons / 1),
    Math.floor(sugar / 0.5),
    Math.floor(cups / 1),
    Math.floor(ice / 0.5)
  );

  const projectedCupsMade = Math.max(0, maxCupsFromSupplies);

  const playDay = () => {
    if (totalExpenses > cash) {
      alert('You do not have enough cash for those supplies and marketing. Lower your costs.');
      return;
    }

    const baseDemand = 22;
    const weatherMultiplier = weatherDemandMultiplier[currentWeather];
    const priceMultiplier = Math.max(0.25, 1.8 - price * 0.35);
    const marketingBoost = 1 + marketing * 0.08;

    const demand = Math.floor(baseDemand * weatherMultiplier * priceMultiplier * marketingBoost);
    const cupsSold = Math.min(projectedCupsMade, Math.max(0, demand));
    const revenue = Number((cupsSold * price).toFixed(2));
    const profit = Number((revenue - totalExpenses).toFixed(2));
    const cashAfter = Number((cash + profit).toFixed(2));

    const result = {
      day,
      weather: currentWeather,
      price,
      cupsMade: projectedCupsMade,
      cupsSold,
      revenue,
      expenses: totalExpenses,
      profit,
      cashAfter,
      lesson: getLesson({
        weather: currentWeather,
        cupsMade: projectedCupsMade,
        cupsSold,
        price,
        profit,
      }),
    };

    setHistory((prev) => [result, ...prev]);
    setCash(cashAfter);

    if (day >= 7) {
      setGameOver(true);
      return;
    }

    setDay((prev) => prev + 1);
  };

  const resetGame = () => {
    setDay(1);
    setCash(25);
    setLemons(20);
    setSugar(10);
    setCups(20);
    setIce(10);
    setPrice(1.5);
    setMarketing(2);
    setHistory([]);
    setGameOver(false);
  };

  const totalProfit = Number((cash - 25).toFixed(2));
  const totalRevenue = history.reduce((sum, item) => sum + item.revenue, 0);
  const totalCupsSold = history.reduce((sum, item) => sum + item.cupsSold, 0);

  return (
    <GamesLayout
      title="Lemonade Stand | CreatorGames"
      description="Play the CreatorGames Lemonade Stand entrepreneurship simulator."
    >
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl" />
            <div className="absolute top-40 -left-40 w-96 h-96 bg-red-500/20 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 py-10 md:py-16 relative">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
              <div>
                <Link href="/games" className="text-red-300 font-bold hover:text-red-200">
                  ← Back to CreatorGames
                </Link>

                <h1 className="text-4xl md:text-6xl font-black mt-4 mb-3">
                  🍋 Lemonade Stand
                </h1>

                <p className="text-white/70 text-lg max-w-2xl">
                  Run your stand for 7 days. Buy supplies, set a price, choose marketing,
                  and learn how business decisions affect profit.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
                  <p className="text-white/50 text-xs uppercase font-black">Day</p>
                  <p className="text-2xl font-black">{gameOver ? 'Done' : `${day}/7`}</p>
                </div>

                <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
                  <p className="text-white/50 text-xs uppercase font-black">Cash</p>
                  <p className="text-2xl font-black">${cash.toFixed(2)}</p>
                </div>

                <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
                  <p className="text-white/50 text-xs uppercase font-black">Profit</p>
                  <p className={`text-2xl font-black ${totalProfit >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    ${totalProfit.toFixed(2)}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
                  <p className="text-white/50 text-xs uppercase font-black">Sold</p>
                  <p className="text-2xl font-black">{totalCupsSold}</p>
                </div>
              </div>
            </div>

            {gameOver ? (
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="rounded-3xl bg-white text-slate-950 p-8 shadow-2xl">
                  <p className="text-red-600 uppercase tracking-widest font-black mb-3">
                    Final Results
                  </p>

                  <h2 className="text-4xl font-black mb-4">
                    {totalProfit >= 25
                      ? 'You built a strong stand.'
                      : totalProfit >= 0
                        ? 'You made a profit.'
                        : 'You learned the hard way.'}
                  </h2>

                  <div className="grid sm:grid-cols-3 gap-4 mb-8">
                    <div className="rounded-2xl bg-slate-100 p-4">
                      <p className="text-sm text-slate-500 font-bold">Final Cash</p>
                      <p className="text-2xl font-black">${cash.toFixed(2)}</p>
                    </div>

                    <div className="rounded-2xl bg-slate-100 p-4">
                      <p className="text-sm text-slate-500 font-bold">Revenue</p>
                      <p className="text-2xl font-black">${totalRevenue.toFixed(2)}</p>
                    </div>

                    <div className="rounded-2xl bg-slate-100 p-4">
                      <p className="text-sm text-slate-500 font-bold">Profit</p>
                      <p className="text-2xl font-black">${totalProfit.toFixed(2)}</p>
                    </div>
                  </div>

                  <p className="text-slate-600 mb-6">
                    Business lesson: profit is not just about selling a lot. It depends on
                    your price, expenses, inventory, marketing, and outside factors like weather.
                  </p>

                  <button
                    type="button"
                    onClick={resetGame}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-black transition-colors"
                  >
                    Play Again
                  </button>
                </div>

                <div className="rounded-3xl bg-white/10 border border-white/10 p-6">
                  <h3 className="text-2xl font-black mb-4">Your 7-Day Report</h3>

                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {history
                      .slice()
                      .reverse()
                      .map((item) => (
                        <div
                          key={item.day}
                          className="rounded-2xl bg-white/10 border border-white/10 p-4"
                        >
                          <div className="flex justify-between gap-4 mb-2">
                            <strong>
                              Day {item.day}: {weatherEmoji[item.weather]} {item.weather}
                            </strong>
                            <strong className={item.profit >= 0 ? 'text-green-300' : 'text-red-300'}>
                              ${item.profit.toFixed(2)}
                            </strong>
                          </div>

                          <p className="text-sm text-white/60">
                            Sold {item.cupsSold}/{item.cupsMade} cups • Revenue ${item.revenue.toFixed(2)} • Expenses ${item.expenses.toFixed(2)}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-3xl bg-white text-slate-950 p-6 md:p-8 shadow-2xl">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                      <p className="text-red-600 uppercase tracking-widest font-black mb-2">
                        Today’s Setup
                      </p>

                      <h2 className="text-3xl font-black">
                        Day {day}: {weatherEmoji[currentWeather]} {currentWeather}
                      </h2>

                      <p className="text-slate-600 mt-2">
                        Weather affects customer demand. Hot days usually sell more lemonade.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-100 p-4">
                      <p className="text-sm text-slate-500 font-bold">Estimated cups possible</p>
                      <p className="text-3xl font-black">{projectedCupsMade}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-5">
                      <h3 className="text-xl font-black">Buy Supplies</h3>

                      <label className="block">
                        <div className="flex justify-between mb-2">
                          <span className="font-bold">Lemons</span>
                          <span>{lemons} × $0.20</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="80"
                          value={lemons}
                          onChange={(event) => setLemons(Number(event.target.value))}
                          className="w-full"
                        />
                      </label>

                      <label className="block">
                        <div className="flex justify-between mb-2">
                          <span className="font-bold">Sugar</span>
                          <span>{sugar} × $0.15</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          value={sugar}
                          onChange={(event) => setSugar(Number(event.target.value))}
                          className="w-full"
                        />
                      </label>

                      <label className="block">
                        <div className="flex justify-between mb-2">
                          <span className="font-bold">Cups</span>
                          <span>{cups} × $0.08</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="80"
                          value={cups}
                          onChange={(event) => setCups(Number(event.target.value))}
                          className="w-full"
                        />
                      </label>

                      <label className="block">
                        <div className="flex justify-between mb-2">
                          <span className="font-bold">Ice</span>
                          <span>{ice} × $0.10</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          value={ice}
                          onChange={(event) => setIce(Number(event.target.value))}
                          className="w-full"
                        />
                      </label>
                    </div>

                    <div className="space-y-5">
                      <h3 className="text-xl font-black">Business Decisions</h3>

                      <label className="block">
                        <div className="flex justify-between mb-2">
                          <span className="font-bold">Price per cup</span>
                          <span>${price.toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="4"
                          step="0.25"
                          value={price}
                          onChange={(event) => setPrice(Number(event.target.value))}
                          className="w-full"
                        />
                      </label>

                      <label className="block">
                        <div className="flex justify-between mb-2">
                          <span className="font-bold">Marketing spend</span>
                          <span>${marketing.toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="1"
                          value={marketing}
                          onChange={(event) => setMarketing(Number(event.target.value))}
                          className="w-full"
                        />
                      </label>

                      <div className="rounded-2xl bg-slate-100 p-5">
                        <h4 className="font-black mb-3">Cost Summary</h4>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Supplies</span>
                            <strong>${supplyCost.toFixed(2)}</strong>
                          </div>

                          <div className="flex justify-between">
                            <span>Marketing</span>
                            <strong>${marketing.toFixed(2)}</strong>
                          </div>

                          <div className="border-t border-slate-200 pt-2 flex justify-between">
                            <span>Total expenses</span>
                            <strong>${totalExpenses.toFixed(2)}</strong>
                          </div>

                          <div className="flex justify-between">
                            <span>Cash available</span>
                            <strong>${cash.toFixed(2)}</strong>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={playDay}
                        className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-2xl font-black transition-colors"
                      >
                        Open Stand for Day {day}
                      </button>
                    </div>
                  </div>
                </div>

                <aside className="space-y-6">
                  <div className="rounded-3xl bg-white/10 border border-white/10 p-6">
                    <h3 className="text-2xl font-black mb-4">Business Tips</h3>

                    <div className="space-y-4 text-white/70">
                      <p>
                        <strong className="text-white">Inventory:</strong> If you buy too little,
                        you might sell out and miss sales.
                      </p>

                      <p>
                        <strong className="text-white">Pricing:</strong> Higher prices can make
                        more money per sale, but fewer customers may buy.
                      </p>

                      <p>
                        <strong className="text-white">Marketing:</strong> Spending money to
                        attract customers can help, but it also raises expenses.
                      </p>

                      <p>
                        <strong className="text-white">Profit:</strong> Revenue minus expenses
                        equals profit.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white/10 border border-white/10 p-6">
                    <h3 className="text-2xl font-black mb-4">Recent Days</h3>

                    {history.length === 0 ? (
                      <p className="text-white/60">
                        No sales yet. Set up your stand and open for Day 1.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {history.slice(0, 3).map((item) => (
                          <div
                            key={item.day}
                            className="rounded-2xl bg-white/10 border border-white/10 p-4"
                          >
                            <div className="flex justify-between gap-4 mb-2">
                              <strong>Day {item.day}</strong>
                              <strong className={item.profit >= 0 ? 'text-green-300' : 'text-red-300'}>
                                ${item.profit.toFixed(2)}
                              </strong>
                            </div>

                            <p className="text-sm text-white/60 mb-2">
                              Sold {item.cupsSold}/{item.cupsMade} cups
                            </p>

                            <p className="text-xs text-white/50">{item.lesson}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </aside>
              </div>
            )}
          </div>
        </section>
      </main>
    </GamesLayout>
  );
};

export default LemonadeStandPage;