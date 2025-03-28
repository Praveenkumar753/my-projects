import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const RegionChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Group data by region and count occurrences
    const regionCounts = d3.rollups(
      data.filter(d => d.region && d.region !== ''),
      v => v.length,
      d => d.region
    )
      .map(([region, count]) => ({ region, count }))
      .sort((a, b) => b.count - a.count);

    // Set dimensions
    const margin = { top: 30, right: 30, bottom: 60, left: 60 };
    const width = 1000 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear previous SVG
    d3.select(svgRef.current).selectAll('*').remove();

    // Create SVG
    const svg = d3.select(svgRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3.scaleBand()
      .domain(regionCounts.map(d => d.region))
      .range([0, width])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(regionCounts, d => d.count) * 1.1])
      .range([height, 0]);

    // Create and add x-axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    // Create and add y-axis
    svg.append('g')
      .call(d3.axisLeft(yScale));

    // Add x-axis label
    svg.append('text')
      .attr('transform', `translate(${width / 2},${height + 50})`)
      .style('text-anchor', 'middle')
      .text('Region');

    // Add y-axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -50)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .text('Number of Records');

    // Create color scale
    const colorScale = d3.scaleOrdinal()
      .domain(regionCounts.map(d => d.region))
      .range(d3.schemeCategory10);

    // Create tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', 'rgba(0, 0, 0, 0.7)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('pointer-events', 'none');

    // Create bars
    svg.selectAll('rect')
      .data(regionCounts)
      .join('rect')
      .attr('x', d => xScale(d.region))
      .attr('y', d => yScale(d.count))
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - yScale(d.count))
      .attr('fill', d => colorScale(d.region))
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 0.8);
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html(`Region: ${d.region}<br/>Count: ${d.count} (${(d.count / data.filter(d => d.region && d.region !== '').length * 100).toFixed(1)}%)`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 1);
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });

    // Add count labels on top of bars
    svg.selectAll('text.count')
      .data(regionCounts)
      .join('text')
      .attr('class', 'count')
      .attr('x', d => xScale(d.region) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.count) - 5)
      .attr('text-anchor', 'middle')
      .text(d => d.count)
      .style('font-size', '12px')
      .style('font-weight', 'bold');

    // Clean up
    return () => {
      d3.select('body').selectAll('.tooltip').remove();
    };
  }, [data]);

  return <div ref={svgRef} className="chart-container"></div>;
};

export default RegionChart;