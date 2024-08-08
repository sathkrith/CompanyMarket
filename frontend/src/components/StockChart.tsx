import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';

interface StockData {
  date: string;
  price: number;
}

const StockChart = ({ companyName }: { companyName: string }): JSX.Element => {
  const [timeFrame, setTimeFrame] = useState('5y');
  const [data, setData] = useState<StockData[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get(`/api/stock_prices/${companyName}/${timeFrame}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchStockData();
  }, [companyName, timeFrame]);

  useEffect(() => {
    if (data.length > 0) {
      const margin = { top: 20, right: 30, bottom: 30, left: 40 };
      const width = 800 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      const svg = d3.select(svgRef.current)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3.scaleTime()
        .domain(d3.extent(data, (d: StockData) => new Date(d.date)) as [Date, Date])
        .range([0, width]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, (d: StockData) => d.price) as number])
        .range([height, 0]);

      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

      svg.append('g')
        .call(d3.axisLeft(y));

      svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('d', d3.line<StockData>()
          .x((d: StockData) => x(new Date(d.date)))
          .y((d: StockData) => y(d.price))
        );
    }
  }, [data]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Stock Prices for {companyName}</h2>
      <div className="flex space-x-2 mb-4">
        <button className={`py-2 px-4 rounded ${timeFrame === '5y' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setTimeFrame('5y')}>5 Year</button>
        <button className={`py-2 px-4 rounded ${timeFrame === '1y' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setTimeFrame('1y')}>1 Year</button>
        <button className={`py-2 px-4 rounded ${timeFrame === '6m' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setTimeFrame('6m')}>6 Month</button>
        <button className={`py-2 px-4 rounded ${timeFrame === '1m' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setTimeFrame('1m')}>1 Month</button>
        <button className={`py-2 px-4 rounded ${timeFrame === '1d' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setTimeFrame('1d')}>1 Day</button>
      </div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default StockChart;
